import React from 'react';
import img_rebirth from "../images/mind_to_infinity_80_by_60.jpg";
import img_summer_party from "../images/summer_party_80_by_60.jpg";
import img_dogs from "../images/dogs.jpg";
import str_parad_2 from "../images/paradise_2.jpg";
import windmill from "../images/windmill_60_by_45.jpg";
import img_cat_dinner from "../images/cat_dinner_50_by_60.jpg";
// import i7 from "../images/ac56.jpg";
// import i8 from "../images/ac57.jpg";
// import i9 from "../images/ac58.jpg";
// import i10 from "../images/ac59.jpg";
import str_para_1 from "../images/paradise_1.jpg";
import bar from "../images/bar_80_by_60.jpg";

import "./FrontPage.css"

function FrontPage(props) {
    return (

        <div className={"container grid-container"}>
            <div className="grid-item medium">
                <img src={img_rebirth} alt="logo"/>
            </div>

            <div className="grid-item ">
                <img src={img_summer_party} alt="logo"/>

                Hello! My name is Oliver Watkins and welcome to my gallery. Abstract
                forms have always been a love affair for me. The blurring of the line between reality
                and unreality has always been a theme for me.
            </div>


            <div className="grid-item ">
                <img src={img_dogs} alt="logo"/>
            </div>
            <div className="grid-item large">
                <img src={str_parad_2} alt="todo"/>
            </div>
            <div className="grid-item ">
                Works of figurative impressionism is also something I am passionate about. I get inspiration from animals
                and bars with flaking wallpaper.


                {/*Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci amet animi cum eaque excepturi*/}
                {/*incidunt officia quaerat quas repellendus sed! Ad consequatur consequuntur dolore dolorum, labore*/}
                {/*minima officiis possimus quas?*/}
                {/*<img src={i3} alt="logo" />*/}
            </div>


            <div className="grid-item threewide">
                <h1>Take a look through my gallery and see if there is something that wil inspire you or take you to another dimension</h1>
            </div>


            <div className="grid-item ">
                <img src={windmill} alt="logo"/>
            </div>

            <div className="grid-item ">
                <img src={img_cat_dinner} alt="logo"/>
            </div>
            {/*<div  className="grid-item " >*/}
            {/*  <img src={i6} alt="logo" />*/}
            {/*</div>*/}


            {/*threewide*/}


            {/*<div className="grid-item ">*/}

            {/*    i7*/}
            {/*    <img src={i7} alt="logo"/>*/}
            {/*</div>*/}
            {/*<div className="grid-item ">*/}
            {/*    i8*/}
            {/*    <img src={i8} alt="logo"/>*/}
            {/*</div>*/}
            {/*<div className="grid-item ">*/}
            {/*    i9*/}
            {/*    <img src={i9} alt="logo"/>*/}
            {/*</div>*/}
            {/*<div className="grid-item ">*/}
            {/*    i10*/}
            {/*    <img src={i10} alt="logo"/>*/}
            {/*</div>*/}
            <div className="grid-item medium">
                para1
                <img src={str_para_1} alt="logo"/>
            </div>
            <div className="grid-item ">
                <img src={bar} alt="logo"/>
            </div>
        </div>
    );
}

export default FrontPage;