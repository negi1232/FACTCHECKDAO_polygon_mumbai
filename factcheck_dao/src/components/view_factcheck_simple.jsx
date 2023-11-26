import React, {useState, useEffect} from "react";
import {Card, Row, Col} from "react-bootstrap";
import {Link} from "react-router-dom";
import getRateSvg from "./rate_svg";

function ViewFactcheckSimple({factcheck, index}) {
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
        <Link key={index} to={"/factcheck/browse/" + factcheck.request_id} style={{textDecoration: "none"}}>
            <Card className="mb-3">
                <Row>
                    <Col xs={2} className="d-flex align-items-center justify-content-center">
                        {getRateSvg(Number(factcheck.result))}
                    </Col>
                    <Col xs={9}>
                        <Card.Body>
                            <Card.Title>{factcheck.title}</Card.Title>
                            <Card.Text>{factcheck.description}</Card.Text>
                            <Row>
                                <Col xs={6}>
                                    <p>投稿者：{factcheck.author.slice(0, 10)}</p>
                                </Col>

                                <Col xs={6}>
                                    <p>投稿日：{convertepochtime(factcheck.created_at)}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Link>
    );
}

export default ViewFactcheckSimple;
