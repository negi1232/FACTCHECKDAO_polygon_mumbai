import {React, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Form, InputGroup, Button} from "react-bootstrap";
import MarkDownEditor from "../../../../components/markdown";

function ReceiveForm({contracts, reloadKey, requestId}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");

    const [selectedRating, setSelectedRating] = useState(0);

    const [ratings, setRatings] = useState([]);
    const [fee, setFee] = useState(0);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(selectedRating);
        let response = await contracts.submit_factheck(requestId, title, description, content, 1, selectedRating, fee.value);
        console.log(response);
        if (response !== null) {
            alert("投稿しました");
            console.log(response);
            navigate("/factcheck/browse/" + response);
        } else {
            alert("投稿に失敗しました");
        }
        // Handle submission here
    };

    useEffect(() => {
        async function getContract() {
            setRatings(await contracts.getRatings());
            let res = await contracts.get_parameter(9);
            setFee(res);
            console.log(res);
        }
        getContract();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadKey]);

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title">
                <Form.Label>タイトル</Form.Label>
                <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="description">
                <Form.Label>説明</Form.Label>
                <Form.Control type="text" as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="content">
                <Form.Label>内容</Form.Label>
                <MarkDownEditor content={content} setContent={setContent}></MarkDownEditor>
            </Form.Group>

            <div className="row">
                <div className="col-6">
                    <Form.Label>結果</Form.Label>
                    <Form.Group controlId="result">
                        <Form.Select aria-label="Default select example" onChange={(e) => setSelectedRating(e.target.value)}>
                            {ratings.map((rating, index) => {
                                return (
                                    <option key={index} value={index}>
                                        {rating.title}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Form.Group>
                    {ratings[selectedRating] ? ratings[selectedRating].description : ""}
                </div>

                <div className="col-6 ">
                    <Form.Label>デポジット</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control type="number" value={Number(fee.value) / 10 ** Number(fee.decimals)} readOnly />
                        <InputGroup.Text>Wake</InputGroup.Text>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </InputGroup>
                </div>
            </div>
        </Form>
    );
}

export default ReceiveForm;
