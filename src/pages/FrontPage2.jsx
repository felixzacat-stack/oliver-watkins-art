import React from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";

import "./FrontPage.scss";
import { SITE_URL, OG_IMAGE } from "src/seo";

import heroImg from "../images/snippets/snippet2.png";
import snippet1 from "../images/snippets/snippet1.png";
import snippet3 from "../images/snippets/snippet3.png";
import snippet4 from "../images/snippets/snippet4.png";
import snippet6 from "../images/snippets/snippet6.png";

function FrontPage2() {
    return (
        <>
            <Helmet>
                <title>Oliver Watkins Art — Munich Abstract Painter</title>
                <meta name="description" content="Original acrylic paintings by Oliver Watkins, a Munich-based abstract artist influenced by Matisse and Picasso. Browse the gallery or commission a piece." />
                <meta property="og:title" content="Oliver Watkins Art" />
                <meta property="og:description" content="Original acrylic paintings by Oliver Watkins, a Munich-based abstract artist influenced by Matisse and Picasso." />
                <meta property="og:image" content={OG_IMAGE} />
                <meta property="og:url" content={SITE_URL} />
                <meta property="og:type" content="website" />
                <link rel="canonical" href={SITE_URL} />
            </Helmet>
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
                        <img src={heroImg} alt="Abstract painting detail by Oliver Watkins" />
                    </div>
                </section>
                <section className="snippet-strip">
                    <img src={snippet1} alt="Painting detail by Oliver Watkins" />
                    <img src={snippet3} alt="Painting detail by Oliver Watkins" />
                    <img src={snippet4} alt="Painting detail by Oliver Watkins" />
                    <img src={snippet6} alt="Painting detail by Oliver Watkins" />
                </section>
            </div>
        </>
    );
}

export default FrontPage2;
