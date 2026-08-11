import React from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";

import "./FrontPage.scss";
import { SITE_URL, OG_IMAGE } from "src/seo";

import heroImg from "../images/snippets/snippet2.png";

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
            </div>
        </>
    );
}

export default FrontPage2;
