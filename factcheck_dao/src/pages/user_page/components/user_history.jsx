import {React, useEffect, useState} from "react";
import "./UserInfoCard.css"; // Import the CSS file
import {Button, ButtonGroup} from "react-bootstrap";
import {RequestComponent, FactcheckComponent, VoteComponent, TransferComponent} from "./history_view";
import Container from "react-bootstrap/Container";

const UserHistory = ({address, contracts, request_ids, setRequest_ids, factcheck_ids, setFactcheck_ids, vote_ids, setVote_ids}) => {
    const [transfer_ids, setTransfer_ids] = useState([]);

    const [historyType, setHistoryType] = useState("request");

    let componentToShow;
    let components = [
        <RequestComponent contracts={contracts} address={address} request_ids={request_ids} setRequest_ids={setRequest_ids} />,
        <FactcheckComponent contracts={contracts} address={address} factcheck_ids={factcheck_ids} setFactcheck_ids={setFactcheck_ids} />,
        <VoteComponent contracts={contracts} address={address} vote_ids={vote_ids} setVote_ids={setVote_ids} />,
    ];
    switch (historyType) {
        case "request":
            componentToShow = components[0];
            break;
        case "factcheck":
            componentToShow = components[1];
            break;
        case "vote":
            componentToShow = components[2];
            break;
        default:
            componentToShow = null;
            break;
    }

    const handleHistoryTypeChange = (type) => {
        setHistoryType(type);
    };
    useEffect(() => {}, []);
    return (
        <>
            <Container>
                <ButtonGroup className="d-flex" aria-label="Basic example">
                    <Button variant="secondary" active={historyType === "request"} onClick={() => handleHistoryTypeChange("request")}>
                        依頼
                    </Button>
                    <Button variant="secondary" active={historyType === "factcheck"} onClick={() => handleHistoryTypeChange("factcheck")}>
                        ファクトチェック
                    </Button>
                    <Button variant="secondary" active={historyType === "vote"} onClick={() => handleHistoryTypeChange("vote")}>
                        投票
                    </Button>
                </ButtonGroup>
            </Container>
            <Container>{componentToShow}</Container>
        </>
    );
};

export default UserHistory;
