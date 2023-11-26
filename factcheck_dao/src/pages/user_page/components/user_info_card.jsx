import React from "react";
import "./UserInfoCard.css"; // Import the CSS file
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button"; // Import Button component from React Bootstrap

const UserInfoCard = ({address, requestPosts, factcheckPosts, votePosts, selfIntroduction, transactions}) => {
    return (
        <Container>
            <p style={{fontSize: "20px"}}>{address.slice(0, 7) + "..." + address.slice(37, 42)}</p>
            <p>{selfIntroduction}</p>
            <p>
                <Button variant="primary" size="lg" href="#">
                    edit
                </Button>
            </p>

            <Row className="justify-content-center">
                <Col className="text-center">
                    依頼
                    <br />
                    {requestPosts}
                </Col>
                <Col className="text-center">
                    投稿
                    <br />
                    {factcheckPosts}
                </Col>
                <Col className="text-center">
                    投票
                    <br />
                    {votePosts}
                </Col>
            </Row>
        </Container>
    );
};

export default UserInfoCard;
