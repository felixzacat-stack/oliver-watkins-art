import React from 'react';

import "./AbstractPage.css"
import img_rebirth from "../images/mind_to_infinity_80_by_60.jpg";
import img_summer_party from "../images/summer_party_80_by_60.jpg";
import windmill from "../images/windmill_60_by_45.jpg";
import abstr_greece from "../images/abstract_greece.jpg";
import bar from "../images/bar_80_by_60.jpg";
import agnes from "../images/agnes.jpg";
import broken_car from "../images/broken_car_70_by_50.jpg";
import cat_dinner from "../images/cat_dinner_50_by_60.jpg";
import dogs from "../images/dogs.jpg";
import figure from "../images/figure.jpg";
import khole from "../images/khole_60_by_45.jpg";
import lady1 from "../images/lady_1.jpg";
import lady2 from "../images/lady_2.jpg";
import lady3 from "../images/lady_3.jpg";
import lion from "../images/lion_70_by_50.jpg";
import monster from "../images/monster.jpg";
import overpass from "../images/overpass_70_by_50.jpg";
import paradise1 from "../images/paradise_1.jpg";
import paradise2 from "../images/paradise_2.jpg";
import paradise3 from "../images/paradise_3.jpg";
import perm_vacation from "../images/perm_vacation.jpg";
import queens_gambit from "../images/queens_gambit.jpg";
import shapes from "../images/shapes.jpg";




export default function GalleryPage(props) {
    return (
        <div className={"gallery"}>
            <div className="grid-item">
                <img src={img_rebirth} alt="logo"/>
                <div className="picture-description">Rebirth - Acrylic on stretched canvas (80cm by 60cm)</div>
            </div>

            <div className="grid-item ">
                <img src={agnes} alt="logo"/>
                <div className="picture-description">Agnes - Acrylic on canvas board (60cm by 45cm)</div>
            </div>
            <div className="grid-item ">
                <img src={img_summer_party} alt="logo"/>
                <div className="picture-description">Summer Party - Acrylic on stretched canvas (80cm by 60cm)</div>
            </div>
            <div className="grid-item ">
                <img src={windmill} alt="logo"/>
                <div className="picture-description">Windmill - Acrylic on canvas board (60cm by 45cm)</div>
            </div>



            <div className="grid-item">
                <img src={abstr_greece} alt="logo"/>
                <div className="picture-description">Impressions of Greece - Acrylic on paper (xxx)</div>
            </div>
            <div className="grid-item ">
                <img src={bar} alt="logo"/>
                <div className="picture-description">Summer Party - Acrylic on stretched canvas (80cm by 60cm)</div>
            </div>




            <div className="grid-item">
                <img src={broken_car} alt="logo"/>
                <div className="picture-description">Paris Texas - Acrylic on stretched canvas (80cm by 60cm)</div>
            </div>
            <div className="grid-item ">
                <img src={cat_dinner} alt="logo"/>
                <div className="picture-description">Dinner - Acrylic on stretched canvas (80cm by 60cm)</div>
            </div>
            <div className="grid-item ">
                <img src={dogs} alt="logo"/>
                <div className="picture-description">Dogs - Acrylic on canvas board (60cm by 45cm)</div>
            </div>



            <div className="grid-item">
                <img src={figure} alt="logo"/>
                <div className="picture-description">Figure #1 - Acrylic on stretched canvas (80cm by 60cm)</div>
            </div>
            <div className="grid-item ">
                <img src={khole} alt="logo"/>
                <div className="picture-description">K-Hole of the spotless mind - Acrylic on stretched canvas (80cm by 60cm)</div>
            </div>
            <div className="grid-item ">
                <img src={lady1} alt="logo"/>
                <div className="picture-description">Lady on Sofa - Acrylic on canvas board (60cm by 45cm)</div>
            </div>



            <div className="grid-item">
                <img src={lady2} alt="logo"/>
                <div className="picture-description">Figure #2 - Acrylic on stretched canvas (80cm by 60cm)</div>
            </div>
            <div className="grid-item ">
                <img src={lady3} alt="logo"/>
                <div className="picture-description">Figure #3 - Acrylic on stretched canvas (80cm by 60cm)</div>
            </div>
            <div className="grid-item ">
                <img src={lion} alt="logo"/>
                <div className="picture-description">Lion - Acrylic on canvas board (60cm by 45cm)</div>
            </div>



            <div className="grid-item">
                <img src={monster} alt="logo"/>
                <div className="picture-description">Awaken the Monster - Acrylic on stretched canvas (80cm by 60cm)</div>
            </div>
            <div className="grid-item ">
                <img src={overpass} alt="logo"/>
                <div className="picture-description">Overpass - Acrylic on stretched canvas (80cm by 60cm)</div>
            </div>
            <div className="grid-item ">
                <img src={paradise1} alt="logo"/>
                <div className="picture-description">Stranger than paradise series #1 - Acrylic on paper (60cm by 45cm)</div>
            </div>


            <div className="grid-item">
                <img src={paradise2} alt="logo"/>
                <div className="picture-description">Stranger than paradise series #2 - Acrylic on stretched canvas (80cm by 60cm)</div>
            </div>
            <div className="grid-item ">
                <img src={paradise3} alt="logo"/>
                <div className="picture-description">Stranger than paradise series #3 -  - Acrylic on stretched canvas (80cm by 60cm)</div>
            </div>
            <div className="grid-item ">
                <img src={perm_vacation} alt="logo"/>
                <div className="picture-description">Morning coffee - Acrylic on canvas board (60cm by 45cm)</div>
            </div>

            <div className="grid-item ">
                <img src={queens_gambit} alt="logo"/>
                <div className="picture-description">Ever after - Acrylic on canvas board (60cm by 45cm)</div>
            </div>

            <div className="grid-item ">
                <img src={shapes} alt="logo"/>
                <div className="picture-description">Shapes - Acrylic on paper (60cm by 45cm)</div>
            </div>

            <div className="grid-item ">
                <img src={windmill} alt="logo"/>
                <div className="picture-description">Windmill - Acrylic on paper (60cm by 45cm)</div>
            </div>
        </div>
    );
}