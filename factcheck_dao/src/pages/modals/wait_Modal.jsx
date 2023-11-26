import {React, useEffect, useState} from "react";
import "./Modal.css";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
const Wait_Modal = ({is_show, receipt}) => {
    return (
        <>
            {is_show ? ( // showFlagがtrueだったらModalを表示する
                <div id="overlay">
                    <div id="modalContent">
                        <div className="spinner-box">
                            <div className="pulse-container">
                                <div className="pulse-bubble pulse-bubble-1"></div>
                                <div className="pulse-bubble pulse-bubble-2"></div>
                                <div className="pulse-bubble pulse-bubble-3"></div>
                            </div>
                        </div>
                        <div>
                            <p id="content">
                                {/* <font size="5" color="#3f3f3f">結果を確認したい場合は、待機して下さい</font> */}
                                <br />
                                <font size="5" color="#000000">
                                    書き込みを実行中
                                </font>
                                <br />
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <></> // showFlagがfalseの場合はModalは表示しない
            )}
        </>
    );
};

export default Wait_Modal;
