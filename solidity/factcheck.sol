// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface DaoInterface {
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

    function getParameter(uint index) external view returns (Parameter memory);
}

contract FactCheck_Contract {
    address dao_address = 0x0291FB1379767dE1D9B9b9324dB240A7E190CAE4;
    DaoInterface dao = DaoInterface(dao_address);
    address tokenAddress = 0xeF32E2eD9Ea9dA75c7a4ed9C63150Aa646edF806;
    IERC20 public token = IERC20(tokenAddress);

    modifier onlyGuest(uint _requestId) {
        //依頼者：ファクトチェックの投稿or評価　を行える
        //一般ユーザー：ファクトチェックの投稿or評価　を行える
        require(participants[_requestId][msg.sender] == false, "Only the guest can call this function");
        participants[_requestId][msg.sender] = true;
        _;
    }

    struct Rating {
        uint id;
        string title;
        string description;
    }
    struct Category {
        uint id;
        string name;
    }
    struct Factcheck_request {
        uint id;
        //formatのバージョン
        uint format_version;
        //タイトル
        string title;
        //概要
        string description;
        //サムネイル画像のURL
        string thumbnail_url;
        //内容
        string content;
        //投稿者
        address author;
        //報酬
        uint reward;
        //締切
        uint deadline;
        //投稿日時
        uint created_at;
        //isclose
        bool is_close;
        //カテゴリー
        Category category;
    }
    struct FactCheck {
        uint id;
        uint request_id;
        //タイトル
        string title;
        //概要
        string description;
        //formatのバージョン
        uint format_version;
        //内容
        string content;
        //結果
        Rating rate;
        //投稿者
        address author;
        //投稿日時
        uint created_at;
        //評価
        uint evaluation;
    }

    mapping(uint => FactCheck[]) private factchecks; //ある依頼に対してのファクトチェック
    mapping(uint => mapping(address => bool)) private participants; //依頼、投稿、投票をしたかどうか
    mapping(uint => mapping(address => uint[])) Votes; //ファクトチェックに対する評価

    Rating[] public ratings; //ファクトチェックのレーティング
    Category[] public categories; //カテゴリー
    Factcheck_request[] private factcheck_requests; //依頼されたファクトチェックのリスト

    //addressごとの履歴
    struct Pair {
        uint first;
        uint second;
    }
    struct UserProfile {
        uint[] request_ids;
        Pair[] factcheck_ids;
        uint[] vote_ids;
        string username; // ユーザの名前
        string introduction; // ユーザの自己紹介
    }
    mapping(address => UserProfile) private userprofile;

    constructor() {
        ratings.push(Rating(0, unicode"正確", unicode"事実の誤りはなく、重要な要素が欠けていない。"));
        ratings.push(Rating(1, unicode"ほぼ正確", unicode"一部は不正確だが、主要な部分・根幹に誤りはない。"));
        ratings.push(Rating(2, unicode"ミスリード", unicode"一見事実と異なることは言っていないが、釣り見出しや重要な事実の欠落などにより、誤解の余地が大きい。"));
        ratings.push(Rating(3, unicode"不正確", unicode"正確な部分と不正確な部分が混じっていて、全体として正確性が欠如している。"));
        ratings.push(Rating(4, unicode"根拠不明", unicode"誤りと証明できないが、証拠・根拠がないか非常に乏しい。"));
        ratings.push(Rating(5, unicode"誤り", unicode"全て、もしくは根幹部分に事実の誤りがあり、事実でないと知りながら伝えた疑いが濃厚である。"));
        ratings.push(Rating(6, unicode"虚偽", unicode"全て、もしくは根幹部分に事実の誤りがある。"));
        ratings.push(Rating(7, unicode"判定留保", unicode"真偽を証明することが困難。誤りの可能性が強くはないが、否定もできない。"));
        ratings.push(Rating(8, unicode"検証対象外", unicode"意見や主観的な認識・評価に関することであり、真偽を証明・解明できる事柄ではない。"));
        categories.push(Category({id: 0, name: unicode"なし"}));
        categories.push(Category({id: 1, name: unicode"政治"}));
        categories.push(Category({id: 2, name: unicode"経済"}));
        categories.push(Category({id: 3, name: unicode"社会"}));
        categories.push(Category({id: 4, name: unicode"科学"}));
        categories.push(Category({id: 5, name: unicode"健康"}));
        categories.push(Category({id: 6, name: unicode"環境"}));
        categories.push(Category({id: 7, name: unicode"テクノロジー"}));
        categories.push(Category({id: 8, name: unicode"エンターテインメント"}));
        categories.push(Category({id: 9, name: unicode"スポーツ"}));
        categories.push(Category({id: 10, name: unicode"教育"}));
        categories.push(Category({id: 11, name: unicode"歴史"}));
        categories.push(Category({id: 12, name: unicode"宗教"}));
        categories.push(Category({id: 13, name: unicode"医療"}));
        categories.push(Category({id: 14, name: unicode"インターネット"}));
        categories.push(Category({id: 15, name: unicode"ソーシャルメディア"}));
    }

    //requestのeventを定義
    event RequestFactcheck(uint requestId, string title, string description, string thumbnail_url, address indexed author, uint reward, uint indexed deadline, uint created_at, uint indexed category_index);

    function requestFactcheck(uint _format_version, string memory _title, string memory _description, string memory _thumbnailUrl, string memory _content, uint _reward, uint _deadline, uint _category_index) public {
        DaoInterface.Parameter memory parameter = dao.getParameter(6);
        require(_reward <= parameter.value, "The reward is greater than the maximum value.");
        require(token.allowance(msg.sender, address(this)) >= parameter.value, "Not enough tokens to hold an election");
        factcheck_requests.push(Factcheck_request(factcheck_requests.length, _format_version, _title, _description, _thumbnailUrl, _content, msg.sender, _reward, _deadline, block.timestamp,false, categories[_category_index]));
        emit RequestFactcheck(factcheck_requests.length - 1, _title, _description, _thumbnailUrl, msg.sender, _reward, _deadline, block.timestamp, _category_index);
        userprofile[msg.sender].request_ids.push(factcheck_requests.length - 1);

        //報酬にデポジット
        bool result = token.transferFrom(msg.sender, address(this), parameter.value);
        require(result == true, "Transfer failed");
    }

    event SubmitFactcheck(uint requestId, uint receiveId, string title, string description, address indexed author, uint created_at, uint indexed result);

    function submitFactcheck(uint _requestId, string memory _title, string memory _description, uint _format_version, string memory _content, uint _result) public onlyGuest(_requestId) {
        DaoInterface.Parameter memory parameter = dao.getParameter(9); //ファクトチェックの投稿料金を取得
        require(token.allowance(msg.sender, address(this)) >= parameter.value, "Not enough tokens to hold an election");
        //時間内かを判断する
        require(factcheck_requests[_requestId].deadline > block.timestamp, "The deadline has passed.");

        //報酬にデポジット
        factcheck_requests[_requestId].reward += parameter.value;
        factchecks[_requestId].push(FactCheck(factchecks[_requestId].length, _requestId, _title, _description, _format_version, _content, ratings[_result], msg.sender, block.timestamp, 0));

        emit SubmitFactcheck(_requestId, factchecks[_requestId].length - 1, _title, _description, msg.sender, block.timestamp, _result);
        userprofile[msg.sender].factcheck_ids.push(Pair(_requestId, factchecks[_requestId].length - 1));
        //報酬にデポジット
        bool result = token.transferFrom(msg.sender, address(this), parameter.value);
        require(result == true, "Transfer failed");
    }

    event VoteFactcheck(uint requestId, address indexed author, uint created_at);

    function voteFactcheck(uint _requestId, uint[] memory _votes) public onlyGuest(_requestId) {
        //投票の受付期間内かを判断する
        require(block.timestamp >= factcheck_requests[_requestId].deadline, "Before the voting period.");

        DaoInterface.Parameter memory parameter = dao.getParameter(10); //クアドラティック投票の投票期間を取得
        DaoInterface.Parameter memory parameter1 = dao.getParameter(11); //クアドラティック投票の最大値を取得

        require(block.timestamp <= factcheck_requests[_requestId].deadline + ((parameter.value * 60 * 60 * 1000) + 10 ** parameter.decimals), "Out of the evaluation period.");

        FactCheck[] storage _factchecks = factchecks[_requestId];
        require(veryfy_quadrativote(_votes, parameter1.value) == true, "The vote is invalid.");
        for (uint i = 0; i < _factchecks.length; i++) {
            _factchecks[i].evaluation += _votes[i];
        }
        emit VoteFactcheck(_requestId, msg.sender, block.timestamp);
        userprofile[msg.sender].vote_ids.push(_requestId);
        Votes[_requestId][msg.sender] = _votes;
    }

    function finalizeFactcheck(uint _requestId) public {
        //終了時刻を過ぎているか
        DaoInterface.Parameter memory parameter = dao.getParameter(10); //投票の投票期間を取得
        require(block.timestamp > factcheck_requests[_requestId].deadline + ((parameter.value * 60 * 60) / 10 ** parameter.decimals), "Evaluation period not expired.");
        //払い出しを実行最後に書く

        //ファクトチェックの一覧を取得
        FactCheck[] storage _factchecks = factchecks[_requestId];
        //長さを取得
        uint _length = _factchecks.length;
        //評価の合計を取得
        uint _total = 0;
        for (uint i = 0; i < _length; i++) {
            _total += _factchecks[i].evaluation;
        }
        //比率に応じて報酬を払い出す
        //_totalが0の場合は報酬を依頼者に返す
        if (_total == 0) {
            bool result = token.transfer(factcheck_requests[_requestId].author, factcheck_requests[_requestId].reward);
            require(result == true, "Transfer failed");
        } else {
            for (uint i = 0; i < _length; i++) {
                uint _reward = (factcheck_requests[_requestId].reward * _factchecks[i].evaluation) / _total;
                bool result = token.transfer(_factchecks[i].author, _reward);
                require(result == true, "Transfer failed");
            }
        }
        factcheck_requests[_requestId].is_close=true;
    }

    function getVoteSettings(uint _requestId, address _target) public view returns (uint, uint[] memory, bool) {
        DaoInterface.Parameter memory parameter = dao.getParameter(10); //投票の投票期間を取得
        DaoInterface.Parameter memory parameter1 = dao.getParameter(11); //投票の最大値を取得

        //現在の投票状況を取得
        uint[] memory vote = Votes[_requestId][_target];

        //投票ができるかを判断する
        bool is_vote = participants[_requestId][_target] == false && block.timestamp >= factcheck_requests[_requestId].deadline && block.timestamp <= factcheck_requests[_requestId].deadline + ((parameter.value * 60 * 60) / 10 ** parameter.decimals);
        return (parameter1.value, vote, is_vote);
    }

    function getRequestsLen()public view returns (uint len){
        len=factcheck_requests.length;
    }
    function getRequests(uint[] memory ids) public view returns (Factcheck_request[] memory) {
        uint validCount = 0;

        // 有効なIDの数を数える
        for (uint i = 0; i < ids.length; i++) {
            if (ids[i] < factcheck_requests.length) {
                validCount++;
            }
        }

        // 有効なIDのみを含む新しい配列を作成
        Factcheck_request[] memory _factcheck_requests = new Factcheck_request[](validCount);
        uint j = 0;
        for (uint i = 0; i < ids.length; i++) {
            if (ids[i] < factcheck_requests.length) {
                _factcheck_requests[j] = factcheck_requests[ids[i]];
                j++;
            }
        }

        return _factcheck_requests;
    }

    function getFactCheckForRequest(uint _requestId) public view returns (FactCheck[] memory) {
        return factchecks[_requestId];
    }

    function getFactchecks(Pair[] memory _ids) public view returns (FactCheck[] memory) {
        //firstがrequestId、secondがfactcheckId
        FactCheck[] memory _factchecks = new FactCheck[](_ids.length);
        for (uint i = 0; i < _ids.length; i++) {
            _factchecks[i] = factchecks[_ids[i].first][_ids[i].second];
        }
        return _factchecks;
    }

    function getVotes(uint[] memory _ids) public view returns (Factcheck_request[] memory) {
        Factcheck_request[] memory _factcheck_requests = new Factcheck_request[](_ids.length);
        for (uint i = 0; i < _ids.length; i++) {
            _factcheck_requests[i] = factcheck_requests[_ids[i]];
        }
        return _factcheck_requests;
    }

    function getratings() public view returns (Rating[] memory) {
        return ratings;
    }

    function getcategories() public view returns (Category[] memory) {
        return categories;
    }

    function getUserprofile(address _target) public view returns (UserProfile memory) {
        return userprofile[_target];
    }

    function veryfy_quadrativote(uint[] memory _votes, uint _total_votes) public pure returns (bool) {
        uint _total = 0;
        //結果を保存する配列
        for (uint i = 0; i < _votes.length; i++) {
            for (uint j = 1; j <= _votes[i]; j++) {
                _total += j * j;
            }
        }
        return _total <= _total_votes;
    }
}
