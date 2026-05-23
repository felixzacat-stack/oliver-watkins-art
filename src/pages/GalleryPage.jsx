import React from 'react';
import { Link } from 'react-router';
import Masonry from "react-responsive-masonry";
import { Helmet } from "react-helmet-async";

import "./GalleryPage.scss"
import pics from 'src/data/pics';
import { SITE_URL, OG_IMAGE } from "src/seo";

const DESCRIPTIONS = {
    all: "Browse all original acrylic paintings by Oliver Watkins — abstract, figurative, and portrait works available to purchase or commission.",
    abstract: "Abstract acrylic paintings by Munich-based artist Oliver Watkins. Expressive, layered works exploring form and colour.",
    figurative: "Figurative acrylic paintings by Munich-based artist Oliver Watkins. Paintings of people, animals, and narrative scenes.",
    portrait: "Portrait paintings by Munich-based artist Oliver Watkins. Acrylic works on canvas and paper.",
};

export default function GalleryPage({ category = "all" }) {

    const label = category === "all" ? "Gallery" : category.charAt(0).toUpperCase() + category.slice(1);
    const description = DESCRIPTIONS[category] ?? DESCRIPTIONS.all;
    const canonicalUrl = category === "all" ? `${SITE_URL}/gallery` : `${SITE_URL}/gallery/${category}`;

    const filteredPics = category === "all"
        ? pics
        : pics.filter(p => p.category.includes(category));

    return (
        <>
        <Helmet>
            <title>{label} | Oliver Watkins Art</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={`${label} | Oliver Watkins Art`} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={OG_IMAGE} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content="website" />
            <link rel="canonical" href={canonicalUrl} />
        </Helmet>
        <div className={"gallery-container container"}>
            <Masonry>
                {filteredPics && filteredPics.map(el =>
                    <div className="gallery-grid-item" key={el.slug}>
                        <Link to={`/gallery/detail/${el.slug}`}>
                            <img src={el.img[0]} alt={el.title || "Artwork"} loading="lazy"/>
                        </Link>
                        <Link to={`/gallery/detail/${el.slug}`} className="gallery-picture-description">
                            <div className={"gallery-text1"}>{el.title}</div>
                            <div className={"gallery-text2"}>{el.spec}</div>
                            <div className={"gallery-text3"}>{el.dimensions}</div>
                            {el.price && <div className={"gallery-text4"}>{el.price}</div>}
                        </Link>
                        {el.sold &&
                            <h4 className="shape-shop-image-sash"> &nbsp;  &nbsp;  &nbsp;     SOLD</h4>}
                    </div>
                )}
            </Masonry>
        </div>
        </>
    );
}
