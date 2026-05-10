import React from 'react';
import { Link } from 'react-router';
import Masonry from "react-responsive-masonry";

import "./GalleryPage.scss"
import pics from 'src/data/pics';

export default function GalleryPage({ category = "all" }) {

    const label = category === "all" ? "Gallery" : category.charAt(0).toUpperCase() + category.slice(1);
    document.title = `${label} | Oliver Watkins Art`;

    const filteredPics = category === "all"
        ? pics
        : pics.filter(p => p.category.includes(category));

    return (
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
    );
}
