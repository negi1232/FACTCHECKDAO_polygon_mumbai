import React, {useState, useEffect} from "react";
import {Card, Row, Col} from "react-bootstrap";
import {Link} from "react-router-dom";

function ViewRequestSimple({request_fc, index}) {
    function convertepochtime(epochtime) {
        let date = new Date(epochtime.toString() * 1000);
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月を取得し、2桁にパディング
        const day = date.getDate().toString().padStart(2, "0"); // 日を取得し、2桁にパディング
        const hours = date.getHours().toString().padStart(2, "0"); // 時を取得し、2桁にパディング
        const minutes = date.getMinutes().toString().padStart(2, "0"); // 分を取得し、2桁にパディング
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    return (
        <Link key={index} to={"/factcheck/browse/" + request_fc.id} style={{textDecoration: "none"}}>
            <Card className="mb-3">
                <Row>
                    <Col xs={3}>
                        <div className="thumbnail">
                            <img src={request_fc.thumbnail_url} alt="サムネイル" className="thumbnail img-fluid" />
                        </div>
                    </Col>
                    <Col xs={9}>
                        <Card.Body>
                            <Card.Title>{request_fc.title}</Card.Title>
                            <Card.Text>{request_fc.description}</Card.Text>
                            <Row>
                                <Col xs={4}>
                                    <p>依頼者：{request_fc.author.slice(0, 10)}</p>
                                </Col>
                                <Col xs={4}>
                                    <p>投稿日：{convertepochtime(request_fc.created_at)}</p>
                                </Col>
                                <Col xs={4}>
                                    <p>締切：{convertepochtime(request_fc.deadline)}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Link>
    );
}

export default ViewRequestSimple;
