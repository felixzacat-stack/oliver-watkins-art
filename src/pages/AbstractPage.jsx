import React from 'react';

import "./AbstractPage.css"
import img_rebirth from "../images/ac61.jpg";
import img_summer_party from "../images/summerparty.jpg";
import img_dogs from "../images/dogs.jpg";
import str_parad_2 from "../images/ac29.jpg";
import windmill from "../images/ac53.jpg";
import img_cat_dinner from "../images/catdinner.jpg";
import i7 from "../images/ac56.jpg";
import i8 from "../images/ac57.jpg";
import i9 from "../images/ac58.jpg";
import i10 from "../images/ac59.jpg";
import str_para_1 from "../images/ac33.jpg";
import bar from "../images/bar.jpg";


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