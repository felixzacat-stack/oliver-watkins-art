import React from 'react';
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

import "./FrontPage.css"

function FrontPage(props) {
    return (

        <div className={"container grid-container"}>
            <div className="grid-item medium">
                <img src={img_rebirth} alt="logo"/>
            </div>

            <div className="grid-item ">
                <img src={img_summer_party} alt="logo"/>

                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium architecto atque autem debitis
                deleniti dignissimos fugit illum neque perferendis repudiandae sit sunt tenetur voluptas, voluptates
                voluptatum? Ipsum nam quasi vero.
            </div>


            <div className="grid-item ">
                <img src={img_dogs} alt="logo"/>
            </div>
            <div className="grid-item large">
                <img src={str_parad_2} alt="todo"/>
            </div>
            <div className="grid-item ">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci amet animi cum eaque excepturi
                incidunt officia quaerat quas repellendus sed! Ad consequatur consequuntur dolore dolorum, labore
                minima officiis possimus quas?
                {/*<img src={i3} alt="logo" />*/}
            </div>


            <div className="grid-item threewide">
                <h1>asdfas dfasdfasdfas dfasdfasdfas df asdfas dfa asdfas dfasdfasdfas dfasdfasdfas df sdfasdfas
                    dfasdfasdfas df asdfas dfasdfasdfas dfasdfasdfas df</h1>
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


            <div className="grid-item ">

                i7
                <img src={i7} alt="logo"/>
            </div>
            <div className="grid-item ">
                i8
                <img src={i8} alt="logo"/>
            </div>
            <div className="grid-item ">
                i9
                <img src={i9} alt="logo"/>
            </div>
            <div className="grid-item ">
                i10
                <img src={i10} alt="logo"/>
            </div>
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