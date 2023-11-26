import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import "./home.css";
import {useParams} from "react-router-dom";
import ViewRequest from "../../../components/view_request";
import ViewFactcheck from "./components/view_factcheck";
import getRateSvg from "../../../components/rate_svg";
function BrowseFactcheck({contracts, reloadKey}) {
    const {requestId} = useParams();

    return (
        <Container>
            <h3>依頼内容</h3>
            <svg src="../../../../assets/images/rate0.svg" alt="0" />
            <Row>
                <Col>
                    <ViewRequest contracts={contracts} reloadKey={reloadKey} requestId={requestId} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <ViewFactcheck contracts={contracts} reloadKey={reloadKey} requestId={requestId} getRateSvg={getRateSvg} />
                </Col>
            </Row>
        </Container>
    );
}

export default BrowseFactcheck;
