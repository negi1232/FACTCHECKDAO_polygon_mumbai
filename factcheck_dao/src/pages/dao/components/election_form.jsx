import React, {useState, useEffect} from "react";
import {AiOutlineArrowRight} from "react-icons/ai";
import {Form, InputGroup, Button, Container, Row, Col} from "react-bootstrap";

function ElectionForm({contracts, parameters_index, name, value, decimals, unit, max_time, min_time, election_start_amount}) {
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");
    const [proposalValue, setProposalValue] = useState(value / 10 ** decimals);

    useEffect(() => {
        setDeadline(min_time);
    }, [min_time]);

    return (
        <Container>
            <Form>
                <Form.Group className="mb-3" style={{textAlign: "left"}}>
                    {/* <Form.Label>選挙の詳細</Form.Label> */}
                    <Form.Label>Election details</Form.Label>
                    <Form.Control
                        type="text"
                        as="textarea"
                        rows={3}
                        value={description}
                        onChange={(event) => {
                            setDescription(event.target.value);
                        }}
                    />
                </Form.Group>

                <Form.Group className="mb-3" style={{textAlign: "left"}}>
                    {/* <Form.Label>回答締切日時</Form.Label> */}
                    <Form.Label>Response deadline date and time</Form.Label>
                    <Form.Control
                        style={{color: "black"}}
                        value={deadline}
                        type="datetime-local"
                        min={min_time}
                        max={max_time}
                        onChange={(event) => {
                            setDeadline(event.target.value);
                        }}
                    />
                </Form.Group>

                <Row className="align-items-center">
                    <Col xs={12} md={5} className="text-center">
                        <Form.Group>
                            {/* <Form.Label>現在の値</Form.Label> */}
                            <Form.Label>current value</Form.Label>
                            <InputGroup>
                                <Form.Control type="number" value={value / 10 ** decimals} readOnly />
                                <InputGroup.Text>{unit}</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={2} className="d-flex align-items-center justify-content-center">
                        <AiOutlineArrowRight />
                    </Col>
                    <Col xs={12} md={5} className="text-center">
                        <Form.Group>
                            {/* <Form.Label>提案する値</Form.Label> */}
                            <Form.Label>Suggested value</Form.Label>

                            <InputGroup>
                                <Form.Control
                                    type="number"
                                    value={proposalValue}
                                    onChange={(event) => {
                                        setProposalValue(event.target.value);
                                    }}
                                />
                                <InputGroup.Text>{unit}</InputGroup.Text>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        contracts.start_election(parameters_index, proposalValue * 10 ** decimals, name + "を" + value / 10 ** decimals + unit + "から" + proposalValue + unit + "に変更する選挙", description, deadline, election_start_amount);
                                    }}
                                >
                                    Confirm
                                </Button>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default ElectionForm;
