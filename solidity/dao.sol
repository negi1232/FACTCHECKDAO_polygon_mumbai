// SPDX-License-Identifier: UNLICENSED
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
pragma solidity ^0.8.9;

contract DAO {
    address owner;
    address tokenAddress = 0xeF32E2eD9Ea9dA75c7a4ed9C63150Aa646edF806;
    IERC20 public token;

    constructor() {
        owner = msg.sender;
        token = IERC20(tokenAddress);
        _initParameters();
        _initElection();
    }

    struct Election {
        uint parameters_index;
        uint before_value;
        uint after_value;
        uint beginning;
        uint deadline;
        string title;
        string description;
        address[] is_yes;
        address[] is_no;
        bool is_close;
    }
    Election[] private elections;
    mapping(address => bool) is_vote;

    struct Parameter {
        uint index;
        uint value;
        uint decimals;
        string unit_jp;
        string unit_en;
        string name_jp;
        string name_en;
        string description_jp;
        string description_en;
    }

    Parameter[] private parameters;

    //パラメーターを設定する

    function _initParameters() private returns (bool) {
        parameters.push(Parameter(0, 0, 0, "", "", "", "", "", ""));

        parameters.push(Parameter(1, 10 * 10 ** 18, 18, unicode"Wake", "Wake", unicode"選挙の開催費用", "Election costs", unicode"選挙を開催する際に必要なトークン", "Tokens required to hold elections"));
        parameters.push(Parameter(2, 1 * 10 ** 18, 18, unicode"Wake", "Wake", unicode"選挙権の価格", "suffrage price", unicode"選挙に投票する際に必要なトークン", "Tokens required to vote in elections"));
        parameters.push(Parameter(3, 3, 0, unicode"人", "person", unicode"定足数", "quorum", unicode"選挙が成立するのに必要な人数", "The number of people required to hold an election"));
        parameters.push(Parameter(4, 1, 1, unicode"時間", "hours", unicode"選挙の開催時間(最低値)", "Election time (minimum value)", unicode"選挙の開催期間の最低値", "Election period minimum"));
        parameters.push(Parameter(5, 100, 1, unicode"時間", "hours", unicode"選挙の開催時間(最大値)", "Election time (maximum value)", unicode"選挙の開催期間の最大値", "Election period maximum"));

        parameters.push(Parameter(6, 10 * 10 ** 18, 18, unicode"Wake", "Wake", unicode"ファクトチェックの依頼料金(最低値)", "Fact check request fee (minimum)", unicode"ファクトチェックの依頼料金の最低値", "Minimum Fact Check Request Fee"));
        parameters.push(Parameter(7, 1, 1, unicode"時間", "hours", unicode"ファクトチェックの募集期間(最低値)", "Fact check submission period (minimum)", unicode"ファクトチェックの募集期間の最低値", "Minimum Fact Check Recruitment Period"));
        parameters.push(Parameter(8, 240, 1, unicode"時間", "hours", unicode"ファクトチェックの募集期間(最大値)", "Fact check submission period (maximum)", unicode"ファクトチェックの募集期間の最大値", "Maximum Fact Check Recruitment Period"));
        parameters.push(Parameter(9, 1 * 10 ** 18, 18, unicode"Wake", "Wake", unicode"ファクトチェックの投稿料金", "Posting fee for fact-checking", unicode"ファクトチェックの投稿料金", "Posting fee for fact-checking"));
        parameters.push(Parameter(10, 1, 1, unicode"時間", "hours", unicode"ファクトチェックへの評価受付時間", "Fact-check evaluation hours", unicode"ファクトチェックへの評価受付時間", "Fact-check evaluation hours"));
        parameters.push(Parameter(12, 100, 0, unicode"票", "vote", unicode"依頼に対するファクトチェックへの1人当たりの投票数", "number of fact-check votes per person for a request", unicode"依頼に対するファクトチェックへの1人当たりの投票数", "number of fact-check votes per person for a request"));

        return true;
    }

    function _initElection() private returns (bool) {
        elections.push(Election(0, 0, 0, block.timestamp, block.timestamp, "", "", new address[](0), new address[](0), true));
        return true;
    }

    event Start_Election(uint indexed _parameters_index, Election election);

    function startElection(uint _parameters_index, uint _proposal_value, string memory _title, string memory _description, uint _deadline) public returns (bool) {
        //選挙を開催するためのトークンを保有しているか確認する
        require(token.allowance(msg.sender, address(this)) >= parameters[1].value, "Not enough tokens to hold an election");
        //approveが確認できているためtransferFromを使用する
        //token.transferFrom(msg.sender, address(this),parameters[1].value*parameters[1].decimals));

        //トークンがTransferされた場合
        //前回の選挙が終了していることを確認する
        require(elections[elections.length - 1].deadline < block.timestamp, "The previous election has not ended");
        //開催時間が正常な値であることを確認する
        require(_deadline >= block.timestamp, "The event period is earlier than the current time");
        require(_deadline >= block.timestamp + ((parameters[4].value * 60 * 60) / 10 ** parameters[4].decimals), "The election period is too short");
        require(_deadline <= block.timestamp + ((parameters[5].value * 60 * 60) / 10 ** parameters[5].decimals), "The election period is too long");
        //dummyのパラメータへの選挙ではないか
        require(_parameters_index != 0, "This is not an election for dummy parameters");

        //選挙を開催する
        elections.push(
            Election(
                _parameters_index,
                parameters[_parameters_index].value,
                // _proposal_value*10 ** parameters[_parameters_index].decimals ,
                _proposal_value,
                block.timestamp,
                _deadline,
                _title,
                _description,
                new address[](0),
                new address[](0),
                false
            )
        );

        bool result = token.transferFrom(msg.sender, address(this), parameters[1].value);
        require(result == true, "Transfer failed");

        return true;
    }

    function doneElection() public returns (bool) {
        require(elections[elections.length - 1].deadline < block.timestamp, "The election period has not ended");
        elections[elections.length - 1].is_close = true;
        //選挙結果をパラメータに反映する
        //もし賛成が反対より多ければ
        if (elections[elections.length - 1].is_yes.length > elections[elections.length - 1].is_no.length) {
            //パラメータの値を変更する
            parameters[elections[elections.length - 1].parameters_index].value = elections[elections.length - 1].after_value;
        }
        return true;
    }

    function get_vote_len() public view returns (uint, uint) {
        return (elections[elections.length - 1].is_yes.length, elections[elections.length - 1].is_no.length);
    }

    function vote(bool vote_result) public returns (bool) {
        //投票するためのトークンを保有しているか確認する
        require(token.allowance(msg.sender, address(this)) >= parameters[2].value, "Not enough tokens to hold an election");

        //選挙が終了していないかを確認する
        require(elections[elections.length - 1].is_close == false, "The election period has ended");
        //投票期間内であることを確認する
        require(elections[elections.length - 1].deadline > block.timestamp, "The voting period has ended");

        //require(is_vote[msg.sender] == false, "You have already voted"); //すでにmsg.senderが投票していないかを確認する
        if (vote_result) {
            //trueの場合
            elections[elections.length - 1].is_yes.push(msg.sender); //yesの配列にmsg.senderを追加する
        } else {
            //falseの場合
            elections[elections.length - 1].is_no.push(msg.sender); //noの配列にmsg.senderを追加する
        }
        is_vote[msg.sender] = true; //msg.senderが投票したことを記録する

        bool result = token.transferFrom(msg.sender, address(this), parameters[2].value);
        require(result == true, "Transfer failed");
        return true;
    }

    function getElection(uint index) public view returns (Election memory) {
        return elections[index];
    }

    function getActive_election() public view returns (Election memory election) {
        if (elections[elections.length - 1].is_close == false) {
            return elections[elections.length - 1];
        } else {
            return elections[0];
        }
    }

    function getParameter(uint index) public view returns (Parameter memory) {
        return parameters[index];
    }

    function getParameters() public view returns (Parameter[] memory) {
        return parameters;
    }

    function getParameters_length() public view returns (uint) {
        return parameters.length;
    }

    function getParameter_val(uint index) public view returns (uint) {
        return parameters[index].value;
    }

    function getElection_setting() public view returns (uint, uint, uint, uint) {
        return (parameters[1].value, parameters[2].value, parameters[4].value, parameters[5].value);
    }

    function getRequestFactcheck_setting() public view returns (uint, uint, uint) {
        return (parameters[6].value, parameters[7].value, parameters[8].value);
    }

    function isElection() public view returns (bool, uint) {
        return (!elections[elections.length - 1].is_close, elections.length - 1);
    }
}
