import React, {useState, useEffect} from "react";
import {Button, Col, Row} from "react-bootstrap";

const Timer = ({contracts, deadlineTime}) => {
    const calcTime = deadlineTime - parseInt(new Date().getTime() / 1000);
    const [dipsTime, setDipsTime] = useState(new Date(calcTime * 1000));

    useEffect(() => {
        const interval = setInterval(() => {
            const calcTime = deadlineTime * 1000 - new Date().getTime();
            setDipsTime(new Date(calcTime));
        }, 1000);
        return () => clearInterval(interval);
    }, [deadlineTime]);

    if (dipsTime.getTime() >= 0) {
        return (
            <div>
                <div className="col">
                    <h1 style={{color: "red"}}>選挙が開催中!!</h1>
                    <div className="col">残り</div>
                </div>

                <Row className="timer justify-content-center">
                    <Col xs={3} className="row-cols-2">
                        <div className="col timer-1">{dipsTime.getUTCDate() - 1}</div>
                        <div className="col timer-2">days</div>
                    </Col>
                    <Col xs={3} className="row-cols-2">
                        <div className="col timer-1">{dipsTime.getUTCHours()}</div>
                        <div className="col timer-2">hours</div>
                    </Col>
                    <Col xs={3} className="row-cols-2">
                        <div className="col timer-1">{dipsTime.getMinutes()}</div>
                        <div className="col timer-2">mins</div>
                    </Col>
                    <Col xs={3} className="row-cols-2">
                        <div className="col timer-1">{dipsTime.getSeconds()}</div>
                        <div className="col timer-2">secs</div>
                    </Col>
                </Row>
            </div>
        );
    } else {
        return (
            <div className="col">
                <h1 style={{color: "red"}}>選挙が終了!!</h1>
                <div className="col">クロージングを実行してください</div>
                {/* ボタンを押したらクロージングを実行 */}
                <Button variant="primary" onClick={() => contracts.election_closing()}>
                    クロージング
                </Button>
            </div>
        );
    }
};

export default Timer;
