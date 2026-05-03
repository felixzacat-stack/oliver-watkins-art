import React, {useState, useEffect} from 'react';

import "./GalleryPage.scss"
import { Category } from 'src/types';

import img_rebirth from "../images/mind_to_infinity_80_by_60_COMP.jpg";
import img_rebirth_mu1 from "../images/mind_to_infinity_mu1.png";
import img_rebirth_mu2 from "../images/mind_to_infinity_mu2.png";

import img_warrior from "../images/victory_60_by_60.jpg";
import img_summer_party from "../images/summer_party_80_by_60_COMP.jpg";
import img_summer_party_mu1 from "../images/summer_party_mu1.png";
import windmill from "../images/windmill_60_by_45_COMP.jpg";
import windmill_mu1 from "../images/windmill_mu1.png";
import abstr_greece from "../images/abstract_greece_COMP.jpg";
import agnes from "../images/agnes_COMP.jpg";
import agnes_mu1 from "../images/agnes_mu1.jpg";
import cat_dinner from "../images/cat_dinner_50_by_60_COMP.jpg";
import dogs from "../images/dogs_COMP.jpg";
import dogs_mu1 from "../images/dogs_mu1.jpg";
import figure from "../images/figure_COMP.jpg";
import khole from "../images/khole_60_by_45_COMP.jpg";
import lady1 from "../images/lady_1_COMP.jpg";
import lady1_mu1 from "../images/lady_1_mu1.jpg";
import lady2 from "../images/lady_2_COMP.jpg";
import monster from "../images/monster_COMP.jpg";
import overpass from "../images/overpass_70_by_50_COMP.jpg";
import overpass_mu1 from "../images/overpass_mu1.png";
import paradise1 from "../images/paradise_1_COMP.jpg";
import paradise2 from "../images/paradise_2_COMP.jpg";
import paradise3 from "../images/paradise_3_COMP.jpg";
import perm_vacation from "../images/perm_vacation.jpg";
import perm_vacation_mu1 from "../images/perm_vacation_mu1.jpg";
import shapes from "../images/shapes_COMP.jpg";
import shapes_mu1 from "../images/shapes_mu1.jpg";
import pink from "../images/pink_COMP.jpg";
import orange from "../images/orange_COMP.jpg";
import blue from "../images/blue_COMP.jpg";
import abstractX from "../images/abstractX_COMP.jpg";
import abstractX_mu1 from "../images/abstractX_mu.jpg";
import squid from "../images/squid_50_by_60_COMP.jpg";
import uml from "../images/uml_40_by_40_COMP.jpg";
import cubens from "../images/cubensis_80_by_60_COMP.jpg";
import frank from "../images/Frankestenstein_50_by_50_COMP.jpg";
import man_snake from "../images/man_snake_60_by_90_COMP.jpg";
import pirranhas from "../images/Parrhanas_60_by_90_COMP.jpg";
import desynchronicity from "../images/desynchronicity_60_by_90_COMP.jpg";

import Modal from 'react-modal';
import GalleryModal from "../common/GalleryModal";
import Masonry from "react-responsive-masonry";

const { Abstract, Figurative, Portrait } = Category;

/** @type {import('src/types').Pic[]} */
let pics = [
    {
        title: "ABSTRACT UNTITLED -",
        category: [Abstract],
        img: [img_rebirth, img_rebirth_mu1, img_rebirth_mu2],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "350€ + PPH"
    },
    {
        title: "Man wrestling snake",
        category: [Abstract],
        img: [man_snake],
        spec: "Acrylic on stretched canvas",
        dimensions: "(60cm by 90cm)",
        price: "450€ + PPH"
    },
    {
        title: "Pirranhas",
        category: [Abstract],
        img: [pirranhas],
        spec: "Acrylic on stretched canvas",
        dimensions: "(60cm by 90cm)",
        price: "450€ + PPH"
    },
    {
        title: "Keyhole - ",
        category: [Abstract],
        img: [khole],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "100€ + PH"
    },
    {
        title: "Desynchronicity",
        category: [Abstract],
        img: [desynchronicity],
        spec: "Acrylic on stretched canvas",
        dimensions: "(60cm by 90cm)",
        price: "450"
    },
    {
        title: "Cubendemensis",
        category: [Abstract],
        img: [cubens],
        spec: "Acrylic on stretched canvas",
        dimensions: "(60cm by 90cm)",
        price: "450"
    },
    {
        title: "Comunion X",
        category: [Figurative],
        img: [frank],
        spec: "Acrylic on stretched canvas",
        dimensions: "(60cm by 90cm)",
        price: "450"
    },
    {
        title: "Warrior",
        category: [Abstract],
        img: [img_warrior],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "300€ + PPH (frame included)"
    },
    {
        title: "Agnes - ",
        category: [Portrait],
        img: [agnes, agnes_mu1],
        spec: "Acrylic on paper ",
        dimensions: "(60cm by 45cm)",
        price: "100€ + PPH (frame included)"
    },
    {
        title: "Summer ",
        category: [Abstract],
        img: [img_summer_party, img_summer_party_mu1],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "250€ + PPH"
    },
    {
        title: "Windmill -",
        category: [Abstract],
        img: [windmill, windmill_mu1],
        spec: "Acrylic on canvas board (60cm by 45cm) ",
        dimensions: "(60cm by 45cm)",
        price: "80€ + PPH",
        sold: true
    },
    {
        title: "Impressions of Greece - ",
        category: [Abstract],
        img: [abstr_greece],
        spec: "Acrylic on paper ",
        dimensions: "(xxx)",
        price: "50€ + PPH"
    },
    {
        title: "Pink ",
        category: [Abstract],
        img: [pink],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "150€ + PH",
        sold: true
    },
    {
        title: "Dinner with Cat - ",
        category: [Abstract],
        img: [cat_dinner],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "100€ + PPH"
    },
    {
        title: "Dog Siblings -",
        category: [Figurative],
        img: [dogs, dogs_mu1],
        spec: "Acrylic on canvas board ",
        dimensions: "(60cm by 45cm)",
        sold: true
    },
    {
        title: "Figure #1 - ",
        category: [Portrait],
        img: [figure],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "50€ + PPH",
        sold: true
    },
    {
        title: "Lady on Sofa -",
        category: [Figurative],
        img: [lady1, lady1_mu1],
        spec: "Acrylic on canvas board ",
        dimensions: "(60cm by 45cm)",
        price: "150€ + PH (frame included)"
    },
    {
        title: "Plasmodesmata",
        category: [Abstract],
        img: [blue],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "150€ + PH",
    },
    {
        title: "Figure #2 - ",
        category: [Figurative],
        img: [lady2],
        spec: "Acrylic on paper ",
        dimensions: "(80cm by 60cm)",
        price: "30€ + PH",
    },
    {
        title: "Awaken the Monster -",
        category: [Figurative],
        img: [monster],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "40€ + PH",
    },
    // {
    //     title: "UML - ",
    //     category: [Figurative],
    //     img: [uml],
    //     spec: "Acrylic on stretched canvas ",
    //     dimensions: "(40cm by 40cm)",
    //     price: "60€ + PH",
    // },
    {
        title: "Squid - ",
        category: [Abstract],
        img: [squid],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(50cm by 60cm)",
        price: "50€ + PH",
    },
    {
        title: "Abstract X - ",
        category: [Abstract],
        img: [abstractX, abstractX_mu1],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(40cm by 40cm)",
        price: "80€ + PH",
    },
    {
        title: "Overpass - ",
        category: [Abstract],
        img: [overpass, overpass_mu1],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
    },
    {
        title: "Stranger than paradise series #1 -",
        category: [Figurative],
        img: [paradise1],
        spec: "Acrylic on paper ",
        dimensions: "(60cm by 45cm)",
        sold: true
    },
    {
        title: "Stranger than paradise series #2 -",
        category: [Figurative],
        img: [paradise2],
        spec: "Acrylic on paper ",
        dimensions: "(80cm by 60cm)"
    },
    {
        title: "Stranger than paradise series #3 -",
        category: [Figurative],
        img: [paradise3],
        spec: "Acrylic on paper ",
        dimensions: "(60cm by 45cm)",
        sold: true
    },
    {
        title: "The literary boor - ",
        category: [Figurative],
        img: [perm_vacation, perm_vacation_mu1],
        spec: "Acrylic on paper   ",
        dimensions: "(60cm by 45cm)",
        price: "80€ + PH (frame included)",
    },
    {
        category: [Abstract],
        img: [shapes, shapes_mu1],
        spec: "Acrylic on paper ",
        dimensions: "(60cm by 45cm)",
    },
    {
        title: "Orange ",
        category: [Abstract],
        img: [orange],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "150€ + PH",
    },
]


export default function GalleryPage({ category = "all" }) {

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
                    >
                    </GalleryModal>
                )}
                {
                    filteredPics && filteredPics.map(el =>
                        <div className="gallery-grid-item">
                            <img onClick={() => openModal(el.img)} src={el.img[0]} alt="logo"/>
                            <div className="gallery-picture-description">
                                <div className={"gallery-text1"}>{el.title}</div>
                                <div className={"gallery-text2"}>{el.spec}</div>
                                <div className={"gallery-text3"}>{el.dimensions}</div>
                                {el.price && <div className={"gallery-text4"}>{el.price}</div>}
                            </div>
                            {el.sold &&
                                <h4 className="shape-shop-image-sash"> &nbsp;  &nbsp;  &nbsp;     SOLD</h4>}
                        </div>
                    )
                }
            </Masonry>

        </div>

    );
}
