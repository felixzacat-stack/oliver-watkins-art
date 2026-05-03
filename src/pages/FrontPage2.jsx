import React from "react";

import "./FrontPage.scss";

import snippet1 from "../images/snippets/snippet1.png";
import snippet2 from "../images/snippets/snippet2.png";
import snippet3 from "../images/snippets/snippet3.png";
import snippet4 from "../images/snippets/snippet4.png";
// import snippet5 from "../images/snippets/snippet5.png";
import snippet6 from "../images/snippets/snippet6.png";

function FrontPage2() {
    document.title = "Oliver Watkins Art";
    return (
        <div className="container frontpage2">
            <div className="frontpage2-grid">

                <div className="frontpage2-cell-span-y spanY">
                    <img src={snippet2} alt="Artwork 2" />
                </div>



                <div className="frontpage2-cell-no-span">
                        <p className="text2">
                            Munich based artist exploring the shifting boundary between reality and dreams through abstract forms.
                            Influenced by Matisse, Picasso, and the strange branching logic of
                            choose-your-own-adventure books, I approach painting as an open system rather than a fixed outcome.
                        </p>
                </div>

                <div className="frontpage2-cell-span-x spanX">
                    <img src={snippet1} alt="Artwork 1" />
                </div>

                {/*<font style={{fontSize:0}}> Plunging my psyche for morsels of insight. palimpsest</font>*/}

                <div className="frontpage2-cell-span-x spanX">
                    <img src={snippet3} alt="Artwork 3" />
                </div>


                {/*<div className="frontpage2-cell">*/}
                {/*    <img src={snippet5} alt="Artwork 5" />*/}
                {/*</div>*/}

                <div className="frontpage2-cell-span-y spanY">
                    <img src={snippet6} alt="Artwork 6" />
                </div>


                <div className="frontpage2-cell-span-x spanX">
                    <img src={snippet4} alt="Artwork 4" />
                </div>

                <div className="frontpage2-cell-no-span">
                        <p className="text2">
                            Turning the canvas upside down isn’t just a cliché — it’s part of the process.
                            Each piece moves through iterations: revising, disrupting, confusing.
                        </p>
                </div>
            </div>
        </div>
    );
}


// <p>
//     My work explores the shifting boundary between reality and dreams through abstract forms.
//     Influenced by Henri Matisse, Pablo Picasso, and the strange branching logic of
//     choose-your-own-adventure books, I approach painting as an open system rather than a fixed outcome.
// </p>
// <p>
//     Turning the canvas upside down isn’t just a cliché — it’s part of the process.
//     Each piece moves through iterations: revising, disrupting, confusing.
// </p>

export default FrontPage2;