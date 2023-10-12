import React from 'react';
import img_rebirth from "../images/mind_to_infinity_80_by_60.jpg";
import img_summer_party from "../images/summer_party_80_by_60.jpg";
import img_dogs from "../images/dogs.jpg";
import str_parad_2 from "../images/paradise_2.jpg";
import windmill from "../images/windmill_60_by_45.jpg";
import img_cat_dinner from "../images/cat_dinner_50_by_60.jpg";

import str_para_1 from "../images/paradise_1.jpg";
import bar from "../images/bar_80_by_60.jpg";

import "./FrontPage.scss"
import {InView} from "react-intersection-observer";

function FrontPage(props) {
    return (

        <div className={"container grid-container"}>
            <div className="grid-item medium">

                <InView>
                    {({ inView, ref, entry }) => {

                        return (
                            <img ref={ref} className={" " + (inView ? "show-1" : "hidden")} src={img_rebirth} alt="logo"/>
                        )
                    }}
                </InView>
            </div>

            <div className="grid-item ">

                <InView>
                    {({ inView, ref, entry }) => {

                        return (
                            <img ref={ref} className={" " + (inView ? "show-1" : "hidden")} src={img_summer_party} alt="logo"/>
                        )
                    }}
                </InView>

                <p className={"text1"}>
                Hey there! My name is Oliver Watkins and welcome to my gallery. Abstract
                forms have always been a love affair for me. I love exploring the line between reality
                and dreams.
                </p>
            </div>


            <div className="grid-item ">

                <InView>
                    {({ inView, ref, entry }) => {

                        return (
                            <img ref={ref} className={" " + (inView ? "show-1" : "hidden")} src={img_dogs} alt="logo"/>
                        )
                    }}
                </InView>
            </div>
            <div className="grid-item large">
                <InView>
                    {({ inView, ref, entry }) => {

                        return (
                            <img ref={ref} className={" " + (inView ? "show-1" : "hidden")} src={str_parad_2} alt="logo"/>
                        )
                    }}
                </InView>
            </div>
            <div className="grid-item ">

                <p className={"text2"}>

                Works of figurative impressionism is also something I am passionate about.

                Be it animals, figures walking on the beach, or bars with flaking wallpaper, I try to create symphony
                of the brush strokes while still respecting the form.
                </p>
            </div>


            <div className="grid-item threewide">
                <p className={"text1"}>Take a look through my gallery and see if there is something that will
                stir you</p>
            </div>


            <div className="grid-item ">

                <InView>
                    {({ inView, ref, entry }) => {

                        return (
                            <img ref={ref} className={" " + (inView ? "show-2" : "hidden")} src={windmill} alt="logo"/>
                        )
                    }}
                </InView>
            </div>

            <div className="grid-item ">
                <InView>
                    {({ inView, ref, entry }) => {

                        return (
                            <img ref={ref} className={" " + (inView ? "show-1" : "hidden")} src={img_cat_dinner} alt="logo"/>
                        )
                    }}
                </InView>
            </div>
            <div className="grid-item medium">
                <InView>
                    {({ inView, ref, entry }) => {

                        return (
                            <img ref={ref} className={" " + (inView ? "show-1" : "hidden")} src={str_para_1} alt="logo"/>
                        )
                    }}
                </InView>
            </div>
            <div className="grid-item ">

                <InView>
                    {({ inView, ref, entry }) => {

                        return (
                            <img ref={ref} className={" " + (inView ? "show-2" : "hidden")} src={bar} alt="logo"/>
                        )
                    }}
                </InView>
            </div>
        </div>
    );
}

export default FrontPage;