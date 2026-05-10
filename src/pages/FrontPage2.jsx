import React from "react";
import { Link } from "react-router";

import "./FrontPage.scss";

import heroImg from "../images/snippets/snippet2.png";
import snippet1 from "../images/snippets/snippet1.png";
import snippet3 from "../images/snippets/snippet3.png";
import snippet4 from "../images/snippets/snippet4.png";
import snippet6 from "../images/snippets/snippet6.png";

function FrontPage2() {
    document.title = "Oliver Watkins Art";
    return (
        <div className="frontpage">
            <section className="hero">
                <div className="hero-text">
                    <p className="hero-bio">
                        Munich based artist exploring the shifting boundary between reality and dreams through abstract forms.
                        Influenced by Matisse, Picasso, and the strange branching logic of
                        choose-your-own-adventure books, I approach painting as an open system rather than a fixed outcome.
                    </p>
                    <p className="hero-bio">
                        Turning the canvas upside down isn't just a cliché — it's part of the process.
                        Each piece moves through iterations: revising, disrupting, confusing.
                    </p>
                    <Link to="/gallery" className="hero-cta">View Gallery →</Link>
                </div>
                <div className="hero-image">
                    <img src={heroImg} alt="Artwork" />
                </div>
            </section>
            <section className="snippet-strip">
                <img src={snippet1} alt="Artwork" />
                <img src={snippet3} alt="Artwork" />
                <img src={snippet4} alt="Artwork" />
                <img src={snippet6} alt="Artwork" />
            </section>
        </div>
    );
}

export default FrontPage2;
