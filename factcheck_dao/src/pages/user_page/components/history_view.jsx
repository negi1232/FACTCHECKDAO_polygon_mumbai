import {React, useEffect, useState} from "react";
import "./history_view.css"; // Import the CSS file

import ViewRequestSimple from "../../../components/view_request_simple";
import ViewFactcheckSimple from "../../../components/view_factcheck_simple";
import ViewVoteSimple from "../../../components/view_vote_simple";
// RequestComponent

export const RequestComponent = ({address, contracts, request_ids, setRequest_ids}) => {
    const [request_list, setRequest_list] = useState([]);
    useEffect(() => {
        async function getContract() {
            setRequest_list(await contracts.getRequests(request_ids));
        }
        if (request_ids.length > 0) {
            getContract();
        }
    }, [request_ids]);

    return (
        <div>
            {request_list.map((request_fc, index) => (
                <ViewRequestSimple request_fc={request_fc} index={index} />
            ))}
        </div>
    );
};

// FactcheckComponent
export const FactcheckComponent = ({contracts, address, factcheck_ids, setFactcheck_ids}) => {
    const [factcheck_list, setFactcheck_list] = useState([]);
    useEffect(() => {
        async function getContract() {
            setFactcheck_list(await contracts.getFactchecks(factcheck_ids));
        }
        getContract();
    }, []);
    return (
        <div>
            {factcheck_list.map((factcheck, index) => (
                <ViewFactcheckSimple factcheck={factcheck} index={index} />
            ))}
        </div>
    );
};

// VoteComponent
export const VoteComponent = ({contracts, address, vote_ids, setVote_ids}) => {
    const [voteFactcheck_list, setVoteFactcheck_list] = useState([]);
    useEffect(() => {
        async function getContract() {
            setVoteFactcheck_list(await contracts.getRequests(vote_ids));
        }
        if (vote_ids.length > 0) {
            getContract();
        }
    }, []);
    return (
        <div>
            {voteFactcheck_list.map((request_fc, index) => (
                <ViewRequestSimple request_fc={request_fc} index={index} />
            ))}
        </div>
    );
};

// HistoryComponent
export const TransferComponent = (contracts, address) => {
    return (
        <div>
            <h2>TransferComponent</h2>
            {/* こちらに詳細な内容を追加できます */}
        </div>
    );
};
function convertepochtime(epochtime) {
    let date = new Date(epochtime.toString() * 1000);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月を取得し、2桁にパディング
    const day = date.getDate().toString().padStart(2, "0"); // 日を取得し、2桁にパディング
    const hours = date.getHours().toString().padStart(2, "0"); // 時を取得し、2桁にパディング
    const minutes = date.getMinutes().toString().padStart(2, "0"); // 分を取得し、2桁にパディング
    return `${year}/${month}/${day} ${hours}:${minutes}`;
}
