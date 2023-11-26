import React, {useState, useEffect} from "react";
import {Form, InputGroup, Button, Container, Row, Col} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import MarkDownEditor from "../../../components/markdown";

function RequestFactcheck({contracts, reloadKey}) {
    const [requestFcSetting, setRequestFcSetting] = useState({min_reward: 0, min_time: "", max_time: ""});
    const [categoryList, setCategoryList] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [content, setContent] = useState("");
    const [reward, setReward] = useState("");
    const [deadline, setDeadline] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        async function getContract() {
            const settings = await contracts.getRequestFactcheck_setting();
            const categorys = await contracts.getCategory();
            setRequestFcSetting(settings);
            setCategoryList(categorys);
            setReward(settings.min_reward / 10 ** 18);
            setDeadline(settings.min_time);
        }
        getContract();
    }, [reloadKey]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await contracts.request_factheck(1, title, description, thumbnailUrl, content, reward * 10 ** 18, deadline, selectedCategory);
        if (response) {
            alert("投稿しました");
            navigate("/factcheck/receive/" + response);
        } else {
            alert("投稿に失敗しました");
        }
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                    <Form.Label>タイトル</Form.Label>
                    <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="description">
                    <Form.Label>説明</Form.Label>
                    <Form.Control type="text" as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="thumbnailUrl">
                    <Form.Label>Thumbnail URL</Form.Label>
                    <Form.Control type="text" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="content">
                    <Form.Label>内容</Form.Label>
                    <MarkDownEditor content={content} setContent={setContent}></MarkDownEditor>
                </Form.Group>

                <Row>
                    <Col sm={6}>
                        <Form.Group style={{textAlign: "left"}}>
                            <Form.Label>締切日時</Form.Label>
                            <Form.Control
                                style={{color: "black"}}
                                value={deadline}
                                type="datetime-local"
                                min={requestFcSetting.min_time}
                                max={requestFcSetting.max_time}
                                onChange={(event) => {
                                    setDeadline(event.target.value);
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group>
                            <Form.Label>カテゴリ</Form.Label>
                            <Form.Control as="select" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                                {categoryList.map((category) => (
                                    <option key={Number(category.id)} value={Number(category.id)}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col sm={6}></Col>
                    <Col sm={6} style={{textAlign: "right"}}>
                        <Form.Group>
                            <Form.Label>報酬</Form.Label>
                            <InputGroup>
                                <Form.Control type="number" value={reward} onChange={(e) => setReward(e.target.value)} />
                                <InputGroup.Text>Wake</InputGroup.Text>
                                <Button variant="primary" type="submit">
                                    提出
                                </Button>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default RequestFactcheck;
