import React from "react";
import RatioBar from "./ratiobar";
import Timer from "./timer";
import {Form, Container, Row, Col} from "react-bootstrap";

function ActiveElection({contracts, active_election, vote_amount}) {
    if (active_election) {
        return (
            <Container>
                <Row className="election_announcement">
                    <Col className="election_deadline">
                        <Timer contracts={contracts} deadlineTime={parseInt(active_election.deadline)} />
                    </Col>
                </Row>

                <Row className="election_title">
                    <Col>
                        <h3>{active_election.title}</h3>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form>
                            <Form.Label>選挙の詳細</Form.Label>
                            <Form.Control type="text" as="textarea" rows={10} value={active_election.description} readOnly />
                        </Form>
                    </Col>
                </Row>

                <Row className="election_deadline">
                    <Col>
                        <p>現在の投票結果</p>
                        <RatioBar value1={active_election.is_yes.length} value2={active_election.is_no.length} contracts={contracts} vote_amount={vote_amount} />
                    </Col>
                </Row>
            </Container>
        );
    } else {
        return <></>;
    }
}

export default ActiveElection;
