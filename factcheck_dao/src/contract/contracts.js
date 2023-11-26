import {createPublicClient, createWalletClient, getContract, parseAbiItem, decodeEventLog, custom} from "viem";
import {polygonMumbai} from "viem/chains";
import dao_abi_json from "./dao_abi.json";
import token_abi_json from "./Fc_token_abi.json";
import factcheck_abi_json from "./FactCheck_Contract_abi.json";
import dao_data from "./contracts-data/fujihalab/DAO-data.json";
import token_data from "./contracts-data/fujihalab/Token-data.json";
import factcheck_data from "./contracts-data/fujihalab/FactCheck_Contract-data.json";

const walletClient = createWalletClient({
    chain: polygonMumbai,
    transport: custom(window.ethereum),
});

const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: custom(window.ethereum),
});

const dao_contract = getContract({
    address: dao_data[0].address,
    ...dao_abi_json,
    walletClient,
    publicClient,
});

const factcheck_contract = getContract({
    address: factcheck_data[0].address,
    ...factcheck_abi_json,
    walletClient,
    publicClient,
});

const token_contract = getContract({
    address: token_data[0].address,
    ...token_abi_json,
    walletClient,
    publicClient,
});

if (window.ethereum) {
    window.ethereum.on("chainChanged", () => {
        window.location.reload();
    });
    window.ethereum.on("accountsChanged", () => {
        window.location.reload();
    });
}

class Contract {
    constructor(receipt, setReceipt, reloadPage, setShow) {
        this.receipt = receipt;
        this.setReceipt = setReceipt;
        this.reloadPage = reloadPage;
        this.setShow = setShow;
    }

    async is_connect() {
        return (await walletClient.getPermissions()).length !== 0;
    }
    async get_address() {
        return (await walletClient.requestAddresses())[0];
    }
    async connect_request() {
        try {
            await walletClient.requestAddresses();
        } catch (e) {
            console.log(e);
        }
    }
    async check_network_id() {
        return await walletClient.getChainId();
    }
    async switch_network() {
        try {
            await walletClient.switchChain({id: polygonMumbai.id});
        } catch (e) {
            //userがrejectした場合
            if (e.code === 4001) {
                console.log(e);
            } else {
                this.add_network();
            }
        }
    }
    async add_network() {
        try {
            await walletClient.addChain({chain: polygonMumbai});
        } catch (e) {
            console.log(e);
        }
    }

    ////ここから下は、DAOに関する関数////

    //選挙を開催する関数
    async start_election(parameters_index, proposal_value, title, descripsion, deadline, election_start_amount) {
        console.log(deadline);
        this.setShow(true);
        let account = await this.get_address();
        let balance = parseInt(await token_contract.read.allowance({args: [account, dao_data[0].address]}));
        let hash = null;
        if (balance >= election_start_amount) {
            hash = await this._start_election(parameters_index, proposal_value, title, descripsion, deadline, election_start_amount, account);
            if (hash) {
                await publicClient.waitForTransactionReceipt({hash});
            }
        } else {
            hash = await this.approve_dao(election_start_amount);
            if (hash) {
                await publicClient.waitForTransactionReceipt({hash});
                hash = await this._start_election(parameters_index, proposal_value, title, descripsion, deadline, election_start_amount, account);
                if (hash) {
                    await publicClient.waitForTransactionReceipt({hash});
                }
            }
        }
        await this.reloadPage();
        this.setShow(false);
    }

    //選挙を終了する関数
    async election_closing() {
        this.setShow(true);
        let account = await this.get_address();
        let hash = null;
        try {
            hash = await this._done_election(account);
            if (hash) {
                await publicClient.waitForTransactionReceipt({hash});
            }
        } catch (e) {
            console.log(e);
        }
        await this.reloadPage();
        this.setShow(false);
    }

    //投票をおこなう関数
    async vote(result, vote_amount) {
        this.setShow(true);
        let account = await this.get_address();
        let balance = parseInt(await token_contract.read.allowance({args: [account, dao_data[0].address]}));
        let hash = null;
        if (balance >= vote_amount) {
            hash = await this._vote(result, account);
            if (hash) {
                await publicClient.waitForTransactionReceipt({hash});
            }
        } else {
            console.log(vote_amount);
            hash = await this.approve_dao(vote_amount);
            if (hash) {
                await publicClient.waitForTransactionReceipt({hash});
                hash = await this._vote(result, account);
                if (hash) {
                    await publicClient.waitForTransactionReceipt({hash});
                }
            }
        }

        await this.reloadPage();
        this.setShow(false);
    }

    async get_parameters() {
        return (await dao_contract.read.getParameters()).slice(1);
    }
    async get_parameter(index) {
        return await dao_contract.read.getParameter({args: [index]});
    }

    //activeな選挙を取得する関数
    async getActive_election() {
        //console.log(await contract.read.getActive_election());
        let result = null;
        try {
            result = await dao_contract.read.getActive_election();
            if (parseInt(result.parameters_index) === 0) {
                return null;
            }
            return result;
        } catch (e) {
            return false;
        }
    }

    async getElection_setting() {
        const setting = await dao_contract.read.getElection_setting();
        //現在時刻を取得
        const now_time = new Date().getTime();
        //タイムゾーンを取得
        const localTime = new Date().getTimezoneOffset();
        //approveの最中に時間が変動するので3分間の余裕を持たせる
        let min_time = new Date(parseInt(now_time + (parseInt(setting[2]) * 60 * 60 * 1000) / 10 ** 1 + 3 * 60 * 1000) - localTime * 60 * 1000).toISOString().slice(0, 16);
        let max_time = new Date(parseInt(now_time + (parseInt(setting[3]) * 60 * 60 * 1000) / 10 ** 1) - localTime * 60 * 1000).toISOString().slice(0, 16);
        return [parseInt(setting[0]), parseInt(setting[1]), min_time, max_time];
    }

    async get_token_balance() {
        let account = await this.get_address();
        const balance = parseInt(parseInt(await token_contract.read.balanceOf({args: [account]})) / 10 ** 18);
        return balance;
    }

    async get_token_allowance() {
        let account = await this.get_address();
        const balance = parseInt(await token_contract.read.allowance({args: [account, dao_data[0].address]})) / 10 ** 18;
        console.log(balance);
        return balance;
    }

    async _start_election(parameters_index, proposal_value, title, descripsion, deadline, election_start_amount, account) {
        console.log(parameters_index, proposal_value, title, descripsion, deadline, election_start_amount);
        let dateObj = new Date(deadline);
        let epochTime = dateObj.getTime() / 1000;
        console.log(epochTime);
        try {
            const {request} = await publicClient.simulateContract({
                account,
                address: dao_data[0].address,
                ...dao_abi_json,
                functionName: "startElection",
                args: [parameters_index, proposal_value, title, descripsion, epochTime],
            });
            return await walletClient.writeContract(request);
        } catch (e) {
            console.log(e);
        }
    }
    async _vote(result, account) {
        console.log(result);
        try {
            const {request} = await publicClient.simulateContract({
                account,
                address: dao_data[0].address,
                ...dao_abi_json,
                functionName: "vote",
                args: [result],
            });

            return await walletClient.writeContract(request);
        } catch (e) {
            console.log(e);
        }
    }
    async _done_election(account) {
        try {
            const {request} = await publicClient.simulateContract({
                account,
                address: dao_data[0].address,
                ...dao_abi_json,
                functionName: "doneElection",
            });
            return walletClient.writeContract(request);
        } catch (e) {
            console.log(e);
        }
    }
    async approve_dao(amount) {
        let account = await this.get_address();
        console.log(account, amount);
        try {
            const {request} = await publicClient.simulateContract({
                account,
                address: token_data[0].address,
                ...token_abi_json,
                functionName: "approve",
                args: [dao_data[0].address, amount],
            });
            return await walletClient.writeContract(request);
        } catch (e) {
            console.log(e);
        }
    }

    ////ここから下は、ファクトチェックに関する関数////

    async getRequestFactcheck_setting() {
        const setting = await dao_contract.read.getRequestFactcheck_setting();
        //現在時刻を取得
        const now_time = new Date().getTime();
        //タイムゾーンを得
        const localTime = new Date().getTimezoneOffset();
        //approveの最中に時間が変動するので1分間の余裕を持たせる
        let min_time = new Date(parseInt(now_time + (parseInt(setting[1]) * 60 * 60 * 1000) / 10 ** 1 + 1 * 60 * 1000) - localTime * 60 * 1000).toISOString().slice(0, 16);
        let max_time = new Date(parseInt(now_time + (parseInt(setting[2]) * 60 * 60 * 1000) / 10 ** 1) - localTime * 60 * 1000).toISOString().slice(0, 16);
        let array = {};
        array["min_reward"] = parseInt(setting[0]);
        array["min_time"] = min_time;
        array["max_time"] = max_time;
        return array;
    }

    async request_factheck(formatVersion, title, description, thumbnailUrl, content, reward, deadline, category) {
        console.log(deadline);
        this.setShow(true);
        let account = await this.get_address();
        let balance = parseInt(await token_contract.read.allowance({args: [account, factcheck_data[0].address]}));
        let res = null;
        let hash = null;
        if (balance >= reward) {
            hash = await this._request_factheck(account, formatVersion, title, description, thumbnailUrl, content, reward, deadline, category);
            if (hash) {
                res = await publicClient.waitForTransactionReceipt({hash});
                console.log(res);
            }
        } else {
            hash = await this.approve_factcheck(reward);
            if (hash) {
                res = await publicClient.waitForTransactionReceipt({hash});
                hash = await this._request_factheck(account, formatVersion, title, description, thumbnailUrl, content, reward, deadline, category);
                if (hash) {
                    res = await publicClient.waitForTransactionReceipt({hash});
                    console.log(res);
                    // history.push({process.env.PUBLIC_URL + "/factcheck/receive/"+res);
                }
            }
        }
        await this.reloadPage();
        await this.setShow(false);
        try {
            if (res) {
                const topics = decodeEventLog({
                    ...factcheck_abi_json,
                    ...res.logs[0],
                });
                console.log(topics.args.requestId);
                return topics.args.requestId;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async submit_factheck(request_id, title, description, content, formatVersion, result, fee) {
        this.setShow(true);
        let account = await this.get_address();
        let balance = parseInt(await token_contract.read.allowance({args: [account, factcheck_data[0].address]}));
        let res = null;
        let hash = null;
        if (balance >= fee) {
            hash = await this._submit_factcheck(account, request_id, title, description, content, formatVersion, result);
            if (hash) {
                res = await publicClient.waitForTransactionReceipt({hash});
            }
        } else {
            hash = await this.approve_factcheck(fee);
            console.log(hash);
            if (hash) {
                res = await publicClient.waitForTransactionReceipt({hash});
                hash = await this._submit_factcheck(account, request_id, title, description, content, formatVersion, result);
                if (hash) {
                    res = await publicClient.waitForTransactionReceipt({hash});
                }
            }
        }

        console.log("close1");
        await this.reloadPage();
        this.setShow(false);
        console.log("close2");
        try {
            if (res) {
                const topics = decodeEventLog({
                    ...factcheck_abi_json,
                    ...res.logs[0],
                });
                console.log(topics.args.requestId);
                return topics.args.requestId;
            }
        } catch (e) {
            console.log(e);
        }

        return null;
    }

    async vote_factcheck(request_id, votes) {
        console.log(request_id, votes);

        let account = await this.get_address();
        let balance = parseInt(await token_contract.read.balanceOf({args: [account]}));
        let hash = null;
        if (balance >= 1) {
            hash = await this._vote_factcheck(account, request_id, votes);
            if (hash) {
                await publicClient.waitForTransactionReceipt({hash});
            }

            await this.reloadPage();
            this.setShow(false);
        } else {
            alert("投票には1FC以上の保有が必要です。");
        }
    }
    async finalizeFactcheck(request_id) {
        let account = await this.get_address();
        let hash = null;
        hash = await this._finalizeFactcheck(account, request_id);
        if (hash) {
            await publicClient.waitForTransactionReceipt({hash});
        }
        await this.reloadPage();
        this.setShow(false);
    }

    async _finalizeFactcheck(account, request_id) {
        try {
            const {request} = await publicClient.simulateContract({
                account,
                address: factcheck_data[0].address,
                ...factcheck_abi_json,
                functionName: "finalizeFactcheck",
                args: [request_id],
            });
            return await walletClient.writeContract(request);
        } catch (e) {
            console.log(e);
        }
    }

    async _request_factheck(account, formatVersion, title, description, thumbnailUrl, content, reward, deadline, category) {
        let dateObj = new Date(deadline);
        let epochTime = dateObj.getTime() / 1000;
        console.log(formatVersion, title, description, thumbnailUrl, content, reward, epochTime, category);
        try {
            const {request} = await publicClient.simulateContract({
                account,
                address: factcheck_data[0].address,
                ...factcheck_abi_json,
                functionName: "requestFactcheck",
                args: [formatVersion, title, description, thumbnailUrl, content, reward, epochTime, []],
            });
            return await walletClient.writeContract(request);
        } catch (e) {
            console.log(e);
        }
    }

    async _submit_factcheck(account, request_id, title, description, content, formatVersion, result) {
        console.log(account, request_id, title, description, content, formatVersion, result);
        try {
            const {request} = await publicClient.simulateContract({
                account,
                address: factcheck_data[0].address,
                ...factcheck_abi_json,
                functionName: "submitFactcheck",
                args: [request_id, title, description, formatVersion, content, result],
            });
            return await walletClient.writeContract(request);
        } catch (e) {
            console.log(e);
        }
    }

    async _vote_factcheck(account, request_id, votes) {
        console.log(request_id, votes);
        try {
            const {request} = await publicClient.simulateContract({
                account,
                address: factcheck_data[0].address,
                ...factcheck_abi_json,
                functionName: "voteFactcheck",
                args: [request_id, votes],
            });
            return await walletClient.writeContract(request);
        } catch (e) {
            console.log(e);
        }
    }

    async approve_factcheck(amount) {
        let account = await this.get_address();
        console.log(account, amount);
        try {
            const {request} = await publicClient.simulateContract({
                account,
                address: token_data[0].address,
                ...token_abi_json,
                functionName: "approve",
                args: [factcheck_data[0].address, amount],
            });
            return await walletClient.writeContract(request);
        } catch (e) {
            console.log(e);
        }
    }

    //リクエストを取得する関数
    async getRequests(index) {
        let result = null;
        try {
            result = await factcheck_contract.read.getRequests({args: [index]});
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    //リクエストに対するファクトチェックを取得する関数
    async getFactCheckForRequest(index) {
        let result = null;
        try {
            result = await factcheck_contract.read.getFactCheckForRequest({args: [index]});
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    //ファクトチェックを取得する関数
    async getFactchecks(index) {
        let result = null;
        try {
            result = await factcheck_contract.read.getFactchecks({args: [index]});
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    async getVoteSettings(requestId, account = null) {
        if (account == null) {
            account = await this.get_address();
        }
        let result = null;
        try {
            result = await factcheck_contract.read.getVoteSettings({args: [requestId, account]});
            const dictionary = {
                maxvotes: result[0],
                votes: result[1],
                isvote: result[2],
            };
            return dictionary;
        } catch (e) {
            console.log(e);
        }
    }

    async getRatings() {
        let result = null;
        try {
            result = await factcheck_contract.read.getratings({args: []});
            console.log(result);
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    async getCategory() {
        let result = null;
        try {
            result = await factcheck_contract.read.getcategories({args: []});
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    async getRequestFactcheck_list(sort, state, offset) {
        //sort =>0:昇順,1:降順
        //state =>0:全て,1:FCを募集中,2:評価受付中,3:評価済み
        //state=>0 全て
        //state=>1 ファクトチェックを募集中か?
        //state=>2 deadlineを超えていないかつ、評価を受け付けているか
        //state=>3 評価済み

        //offset =>何番目のブロックから取得するか
        const blockNumber = await publicClient.getBlockNumber();
        console.log(blockNumber);
        const logs = await publicClient.getLogs({
            address: factcheck_data[0].address,
            event: parseAbiItem("event RequestFactcheck(uint requestId,string title,string description,string thumbnail_url,address indexed author,uint reward,uint indexed deadline,uint created_at,uint indexed category)"),
            args: {
                author: null,
                deadline: null,
                category: null,
            },
            fromBlock: blockNumber - 10n,
            toBlock: blockNumber,
        });
        console.log(logs);

        let array = [];
        let now_time = new Date().getTime();
        //評価期間を取得
        let eval_hours = await this.get_parameter(10);
        let eval_hours_ephoc = (Number(eval_hours.value) / 10 ** Number(eval_hours.decimals)) * 60 * 60 * 1000;
        let deadline = 0;
        for (let i = 0; i < logs.length; i++) {
            //deadlineを超えているか

            deadline = Number(logs[i].args.deadline) * 1000;

            //全て
            if (state === 0) {
                array.push(logs[i]);
            }
            if (state === 1) {
                console.log(deadline);
                console.log(now_time);
                console.log(deadline, now_time, deadline - now_time, deadline > now_time);
                if (deadline > now_time) {
                    array.push(logs[i]);
                }
            }
            //deadlineを超えていないかつ、評価を受け付けているか
            else if (state === 2) {
                if (deadline < now_time && deadline + eval_hours_ephoc > now_time) {
                    //+評価受付期間かを追加
                    array.push(logs[i]);
                }
            }
            //評価済み
            else if (state === 3) {
                if (deadline + eval_hours_ephoc < now_time) {
                    array.push(logs[i]);
                }
            }
        }
        if (sort === 1) {
            array.reverse();
        }

        return array;
    }

    async getRequestsLen() {
        let result = null;
        const account = await this.get_address();
        try {
            result = await factcheck_contract.read.getRequestsLen({account: account});
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    //トークンに関する関数
    async getTransactions(address) {
        const blockNumber = await publicClient.getBlockNumber();
        const account = await this.get_address();
        console.log(blockNumber);

        const logs_from = await publicClient.getLogs({
            address: token_data[0].address,
            event: parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 value)"),
            args: {
                from: account,
                to: null,
            },
            fromBlock: blockNumber - 10n,
            toBlock: blockNumber,
        });

        const logs_to = await publicClient.getLogs({
            address: token_data[0].address,
            event: parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 value)"),
            args: {
                from: null,
                to: account,
            },
            fromBlock: blockNumber - 10n,
            toBlock: blockNumber,
        });

        //ブロックナンバー順に組み合わせ

        let logs = logs_from.concat(logs_to);

        logs.sort(function (a, b) {
            if (Number(a.blockNumber) > Number(b.blockNumber)) {
                return 1;
            } else {
                return -1;
            }
        });

        console.log(logs);

        return logs;
    }

    //ユーザーに関する関数
    //プロファイルを取得する関数
    async getUserprofile(address) {
        let result = null;
        try {
            result = await factcheck_contract.read.getUserprofile({account: address, args: [address]});
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    //投票したファクトチェックを取得する関数
    async getVoteList(account) {
        const blockNumber = await publicClient.getBlockNumber();
        console.log(blockNumber);
        console.log(account);
        const logs = await publicClient.getLogs({
            address: factcheck_data[0].address,
            event: parseAbiItem("event VoteFactcheck(uint requestId, address indexed author, uint created_at)"),
            args: {author: null},
            fromBlock: blockNumber - 10n,
            toBlock: blockNumber,
        });
        return logs;
    }
}

export default Contract;
