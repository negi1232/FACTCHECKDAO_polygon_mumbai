import React, {useState, useEffect} from "react";
import {Form, InputGroup, Image, Row, Col, Button} from "react-bootstrap";
import MarkDownEditor from "./markdown";

function ViewRequest({contracts, reloadKey, requestId}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [, setFormatVersion] = useState(1);
    const [content, setContent] = useState("");
    const [reward, setReward] = useState(0);
    const [deadline, setDeadline] = useState("");
    const [created_at, setCreated_at] = useState("");
    const [author, setAuthor] = useState("");
    const [isFinished, setIsFinished] = useState(0);

    useEffect(() => {
        async function getContract() {
            let res = await contracts.getRequests([requestId]);
            res = res[0];
            setTitle(res.title);
            setDescription(res.description);
            setThumbnailUrl(res.thumbnail_url);
            setFormatVersion(res.formatVersion);
            setContent(res.content);
            setReward(Number(res.reward) / 10 ** 18);
            setDeadline(new Date((Number(res.deadline) - new Date().getTimezoneOffset() * 60) * 1000).toISOString().slice(0, 16).replace("T", " "));
            setCreated_at(new Date((Number(res.created_at) - new Date().getTimezoneOffset() * 60) * 1000).toISOString().slice(0, 16).replace("T", " "));
            setAuthor(res.author);
            let res2 = await contracts.get_parameter(10);
            let electionLimit = (Number(res2.value) / 10 ** Number(res2.decimals)) * 60 * 60;
            console.log(electionLimit + Number(res.deadline) - Math.floor(new Date().getTime() / 1000));
            setIsFinished(electionLimit + Number(res.deadline) - Math.floor(new Date().getTime() / 1000));
        }
        getContract();
    }, [reloadKey]);

    const handlefinalize = async (requestId) => {
        try {
            await contracts.finalizeFactcheck(requestId);
            // 完了後の処理をここに追加（必要に応じて）
        } catch (error) {
            console.error("エラーが発生しました:", error);
        }
    };

    return (
        <>
            {isFinished < 0 && <Button onClick={() => handlefinalize(requestId)}>クロージング</Button>}
            <Row>
                <Col sm={3}>
                    <div className="thumbnail">
                        <Image src={thumbnailUrl} alt="サムネイル" className="thumbnail" fluid />
                    </div>
                </Col>
                <Col sm={9}>
                    <h4 className="mb-0">{title}</h4>
                    <p>{description}</p>
                    <Row>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>依頼者</Form.Label>
                                <InputGroup className="mb-3" style={{textAlign: "left"}}>
                                    <Form.Control type="text" value={author} readOnly />
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>報酬</Form.Label>
                                <InputGroup className="mb-3" style={{textAlign: "left"}}>
                                    <Form.Control type="number" value={reward} readOnly />
                                    <InputGroup.Text>Wake</InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-3" style={{textAlign: "left"}}>
                                <Form.Label>依頼日時</Form.Label>
                                <Form.Control style={{color: "black"}} value={created_at} type="datetime-local" readOnly />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-3" style={{textAlign: "left"}}>
                                <Form.Label>締切日時</Form.Label>
                                <Form.Control style={{color: "black"}} value={deadline} type="datetime-local" readOnly />
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <MarkDownEditor content={content} setContent={setContent} isReadOnly={true} />
        </>
    );
}

export default ViewRequest;
