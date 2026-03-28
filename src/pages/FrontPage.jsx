import React from 'react';
import img_rebirth from "../images/mind_to_infinity_80_by_60_COMP.jpg";
import img_summer_party from "../images/summer_party_80_by_60_COMP.jpg";
import img_dogs from "../images/dogs_COMP.jpg";
import str_parad_2 from "../images/paradise_2_COMP.jpg";
import windmill from "../images/windmill_60_by_45_COMP.jpg";
import img_cat_dinner from "../images/cat_dinner_50_by_60_COMP.jpg";

import bar from "../images/bar_80_by_60_COMP.jpg";

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
                Munich based artist.

                    My work explores the shifting boundary between reality and dreams through abstract forms. Influenced by
                    Henri Matisse, Pablo Picasso, and the strange, branching logic of 1980s “choose your own adventure” books, I approach
                    painting as an open system rather than a fixed outcome.


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


                    Turning the canvas upside down isn’t just a cliché—it’s part of the process. Each piece moves through
                    iterations: revising, disrupting, confusing. At times I’m pranking the work, at times the viewer, and often myself.

                    There’s a strong current of Dada in this approach—playful, contradictory, and deliberately unresolved.

                {/*...and works of figurative impressionism have always been about texture while still respecting the form.*/}
                {/*Be it animals, figures walking on the beach, or bars with flaking wallpaper.*/}
                </p>
            </div>

            <div className="grid-item threewide">

                <a href="/gallery" className="rounded-button">
                    <p className={"text1"}>
                    View Gallery

                    </p>
                </a>
                {/*<p className={"text1"}>*/}



                {/*    Lorem ipsum dolor sit amet, consectetur adipisicing elit.. Take a look through my gallery and see if there is something that will*/}
                {/*stir your coul</p>*/}
            </div>

            {/*Accusantium aspernatur assumenda cumque dicta dignissimos dolore dolorum eos explicabo fuga illo ipsam, ipsum itaque nesciunt provident rerum suscipit veritatis voluptatem, voluptatum!*/}

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
            {/*<div className="grid-item medium">*/}
            {/*    <InView>*/}
            {/*        {({ inView, ref, entry }) => {*/}

            {/*            return (*/}
            {/*                <img ref={ref} className={" " + (inView ? "show-1" : "hidden")} src={str_para_1} alt="logo"/>*/}
            {/*            )*/}
            {/*        }}*/}
            {/*    </InView>*/}
            {/*</div>*/}
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