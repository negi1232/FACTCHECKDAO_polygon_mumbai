import React from "react";
import {ProgressBar, Button, Row, Col} from "react-bootstrap";

function RatioBar({value1, value2, contracts, vote_amount}) {
    const total = value1 + value2;
    let ratio1 = 0;
    let ratio2 = 0;
    if (total !== 0) {
        ratio1 = (value1 / total) * 100;
        ratio2 = (value2 / total) * 100;
    }

    return (
        <Row>
            <Col xs={2} className="d-flex justify-content-center">
                <Button variant="primary" onClick={() => contracts.vote(true, vote_amount)}>
                    賛成
                </Button>
            </Col>
            <Col xs={8} className="d-flex align-items-center">
                <ProgressBar style={{width: "100%", height: "100%"}}>
                    <ProgressBar variant="info" now={ratio1} key={1} label={value1 + "票"} />
                    <ProgressBar variant="danger" now={ratio2} key={2} label={value2 + "票"} />
                </ProgressBar>
            </Col>
            <Col xs={2} className="d-flex justify-content-center">
                <Button variant="danger" onClick={() => contracts.vote(false, vote_amount)}>
                    反対
                </Button>
            </Col>
        </Row>
    );
}

export default RatioBar;
