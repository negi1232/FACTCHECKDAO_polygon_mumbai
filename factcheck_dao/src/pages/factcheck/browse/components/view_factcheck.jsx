import {React, useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {AiOutlinePlus, AiOutlineMinus} from "react-icons/ai";
import MarkDownEditor from "../../../../components/markdown";
import {Form, InputGroup, Button, Accordion, Card, Row, Col} from "react-bootstrap";

function ViewFactcheck({contracts, reloadKey, requestId, getRateSvg}) {
    const [factchecks, setFactchecks] = useState([]);
    const [expanded, setExpanded] = useState("");
    const [remainingVotes, setRemainingVotes] = useState(0);
    //投票数の最大値
    const [maxVotes, setMaxVotes] = useState(0);
    //それぞれに対するクアドラティックボーティングの結果
    const [votes, setVotes] = useState([]);
    //すでに投票したかどうか
    const [isvote, setIsvote] = useState(false);
    useEffect(() => {
        async function getContract() {
            let res = await contracts.getFactCheckForRequest(requestId);
            let votesettings = await contracts.getVoteSettings(requestId);
            setFactchecks(res);

            setMaxVotes(Number(votesettings.maxvotes));
            setIsvote(votesettings.isvote);
            setVotes([]);
            if (votesettings.votes.length === 0) {
                for (let i = 0; i < Number(res.length); i++) {
                    setVotes((votes) => [...votes, 0]);
                }
            } else {
                for (let i = 0; i < Number(res.length); i++) {
                    console.log(i);
                    setVotes((votes) => [...votes, Number(votesettings.votes[i])]);
                }
            }
            let _total = 0;
            //結果を保存する配列
            for (let i = 0; i < votesettings.votes.length; i++) {
                for (let j = 1; j <= Number(votesettings.votes[i]); j++) {
                    _total += j * j;
                }
            }
            setRemainingVotes(_total);
        }
        getContract();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadKey]);

    const handleAddVote = (index) => {
        const updatedList = [...votes]; // Create a copy of the original list
        updatedList[index] = updatedList[index] + 1;
        console.log(updatedList);
        if (remainingVotes + updatedList[index] ** 2 <= maxVotes) {
            setVotes(updatedList); // Update the state with the new list
            setRemainingVotes(remainingVotes + updatedList[index] ** 2);
        }
    };

    const handleSubtractVote = (index) => {
        const updatedList = [...votes]; // Create a copy of the original list
        updatedList[index] = updatedList[index] - 1;
        if (updatedList[index] >= 0) {
            setVotes(updatedList); // Update the state with the new list
            setRemainingVotes(remainingVotes - (updatedList[index] + 1) ** 2);
        }
    };

    return (
        <>
            <Accordion>
                {factchecks.map((factcheck, index) => {
                    return (
                        <Accordion.Item eventKey={index}>
                            <Row>
                                <Col xs={10}>
                                    <Accordion.Header>
                                        <Col xs={2} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                            <div>{getRateSvg(Number(factcheck.rate.id))}</div>
                                        </Col>

                                        <Col xs={10} style={{"margin-left": "10px"}}>
                                            <p style={{fontSize: "20px", whiteSpace: "normal", wordWrap: "break-word"}}>{factcheck.title}</p>

                                            <br />
                                            <p style={{whiteSpace: "normal", wordWrap: "break-word"}}>{factcheck.description}</p>
                                        </Col>
                                    </Accordion.Header>
                                </Col>
                                <Col xs={2} style={{display: "flex", justifyContent: "flex-end"}}>
                                    <Row style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                        <Col xs={12}>
                                            <Form.Label>自分の投票数</Form.Label>
                                            <InputGroup className="" style={{textAlign: "left"}}>
                                                <Form.Control type="number" value={votes[index]} readOnly style={{wordWrap: "break-word"}} />
                                                <InputGroup.Text>票</InputGroup.Text>
                                            </InputGroup>
                                            {isvote === true ? (
                                                <div className="vote-btn-container">
                                                    <Button className="vote-btn" variant="btn btn-danger" onClick={() => handleSubtractVote(Number(factcheck.id))} block>
                                                        <AiOutlineMinus />
                                                    </Button>
                                                    <Button className="vote-btn" variant="primary" onClick={() => handleAddVote(Number(factcheck.id))} block>
                                                        <AiOutlinePlus />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <Form.Label>総得票数</Form.Label>
                                                    <InputGroup className="" style={{textAlign: "left"}}>
                                                        <Form.Control type="number" value={Number(factcheck.evaluation)} readOnly style={{wordWrap: "break-word"}} />
                                                        <InputGroup.Text>票</InputGroup.Text>
                                                    </InputGroup>
                                                </>
                                            )}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Accordion.Body>
                                <Row>
                                    <Col xs={6}>
                                        <Form.Group className="mb-3" style={{textAlign: "left"}}>
                                            <Form.Label>投稿日時</Form.Label>
                                            <Form.Control style={{color: "black"}} value={new Date((Number(factcheck.created_at) - new Date().getTimezoneOffset() * 60) * 1000).toISOString().slice(0, 16).replace("T", " ")} type="datetime-local" readOnly />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Group>
                                            <Form.Label>投稿者</Form.Label>
                                            <InputGroup className="mb-3" style={{textAlign: "left"}}>
                                                <Form.Control type="text" value={factcheck.author} readOnly />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <MarkDownEditor content={factcheck.content} isReadOnly={true} />
                            </Accordion.Body>
                        </Accordion.Item>
                    );
                })}
                <div className="remaining-votes">
                    <p>
                        残りのポイント: <wbr /> {remainingVotes}/{maxVotes}{" "}
                    </p>
                    <div className="d-flex justify-content-center">
                        {isvote === true ? (
                            <Button variant="primary" onClick={() => contracts.vote_factcheck(requestId, votes)}>
                                投票
                            </Button>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </Accordion>
        </>
    );
}

export default ViewFactcheck;
