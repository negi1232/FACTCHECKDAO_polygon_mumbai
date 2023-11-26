import React from "react";
import rate0 from "../assets/images/rate0.png";
import rate1 from "../assets/images/rate1.png";
import rate2 from "../assets/images/rate2.png";
import rate3 from "../assets/images/rate3.png";
import rate4 from "../assets/images/rate4.png";
import rate5 from "../assets/images/rate5.png";
import rate6 from "../assets/images/rate6.png";
import rate7 from "../assets/images/rate7.png";
import rate8 from "../assets/images/rate8.png";

function getRateSvg(id) {
    switch (id) {
        case 0:
            return <img src={rate0} alt="rate0" style={{width: "100%", height: "auto"}} />;
        case 1:
            return <img src={rate1} alt="rate1" style={{width: "100%", height: "auto"}} />;
        case 2:
            return <img src={rate2} alt="rate2" style={{width: "100%", height: "auto"}} />;
        case 3:
            return <img src={rate3} alt="rate3" style={{width: "100%", height: "auto"}} />;
        case 4:
            return <img src={rate4} alt="rate4" style={{width: "100%", height: "auto"}} />;
        case 5:
            return <img src={rate5} alt="rate5" style={{width: "100%", height: "auto"}} />;
        case 6:
            return <img src={rate6} alt="rate6" style={{width: "100%", height: "auto"}} />;
        case 7:
            return <img src={rate7} alt="rate7" style={{width: "100%", height: "auto"}} />;
        case 8:
            return <img src={rate8} alt="rate8" style={{width: "100%", height: "auto"}} />;
        default:
            return null;
    }
}

export default getRateSvg;
