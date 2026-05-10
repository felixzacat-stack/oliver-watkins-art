import React, {useState, useEffect} from 'react';
import { Link } from 'react-router';
import Modal from 'react-modal';
import Masonry from "react-responsive-masonry";

import "./GalleryPage.scss"
import pics from 'src/data/pics';
import GalleryModal from "../common/GalleryModal";

export default function GalleryPage({ category = "all" }) {

    const label = category === "all" ? "Gallery" : category.charAt(0).toUpperCase() + category.slice(1);
    document.title = `${label} | Oliver Watkins Art`;

    const [isOpen, setIsOpen] = useState(false);
    const [imgModal, setImgModal] = useState();

    const filteredPics = category === "all"
        ? pics
        : pics.filter(p => p.category.includes(category));

    function openModal(img) {
        setImgModal(img)
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        Modal.setAppElement('.gallery-container');
    });

    return (
        <div className={"gallery-container container"}>
            <Masonry>
                {isOpen && (
                    <GalleryModal
                        img={imgModal}
                        onClick={() => closeModal()}
                        closeModal={closeModal}
                    />
                )}
                {filteredPics && filteredPics.map(el =>
                    <div className="gallery-grid-item" key={el.slug}>
                        <img onClick={() => openModal(el.img)} src={el.img[0]} alt={el.title || "Artwork"} loading="lazy"/>
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
