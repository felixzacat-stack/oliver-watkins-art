import React from "react";

import "./FrontPage.scss";

import snippet1 from "../images/snippets/snippet1.png";
import snippet2 from "../images/snippets/snippet2.png";
import snippet3 from "../images/snippets/snippet3.png";
import snippet4 from "../images/snippets/snippet4.png";
import snippet5 from "../images/snippets/snippet5.png";
import snippet6 from "../images/snippets/snippet6.png";

function FrontPage2() {
    return (
        <div className="container frontpage2">
            <div className="frontpage2-first-row">
                <div className="frontpage2-left-stack">
                    <div className="frontpage2-tile frontpage2-tile-1">
                        <img src={snippet1} alt="snippet 1" />
                    </div>

                    <div className="frontpage2-tile frontpage2-tile-3">
                        <img src={snippet3} alt="snippet 3" />
                    </div>
                </div>

                <div className="frontpage2-tile frontpage2-tile-2">
                    <img src={snippet2} alt="snippet 2" />
                </div>

                <div className="frontpage2-tile frontpage2-tile-6">
                    <img src={snippet6} alt="snippet 6" />
                </div>
            </div>

            <div className="frontpage2-middle-row">
                <div className="frontpage2-blurb">
                    <h1>Munich based artist.</h1>
                    <p>
                        My work explores the shifting boundary between reality and dreams through abstract forms.
                        Influenced by Henri Matisse, Pablo Picasso, and the strange branching logic of
                        choose-your-own-adventure books, I approach painting as an open system rather than a fixed outcome.
                    </p>
                    <p>
                        Turning the canvas upside down isn’t just a cliché — it’s part of the process.
                        Each piece moves through iterations: revising, disrupting, confusing.
                    </p>
                </div>
            </div>

            <div className="frontpage2-third-row">
                <div className="frontpage2-tile frontpage2-stack-vertical">
                    <img src={snippet4} alt="snippet 4" />
                </div>

                <div className="frontpage2-tile frontpage2-stack-vertical">
                    <img src={snippet5} alt="snippet 5" />
                </div>
            </div>
        </div>
    );
}

export default FrontPage2;