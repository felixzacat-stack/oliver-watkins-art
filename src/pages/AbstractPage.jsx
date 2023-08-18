import React from 'react';

import "./AbstractPage.css"
import img_rebirth from "../images/ac61.jpg";
import img_summer_party from "../images/summerparty.jpg";
import windmill from "../images/ac53.jpg";


function AbstractPage(props) {
    return (

        <div className={"abstract grid-container"}>
            <div className="grid-item ">
                <img src={img_rebirth} alt="logo"/>
            </div>
            <div className="grid-item ">
                <img src={img_summer_party} alt="logo"/>
            </div>
            <div className="grid-item ">
                <img src={windmill} alt="logo"/>
            </div>
        </div>
    );
}

export default AbstractPage;