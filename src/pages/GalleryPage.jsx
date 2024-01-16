import React, {useState, useEffect} from 'react';

import "./GalleryPage.scss"
import img_rebirth from "../images/mind_to_infinity_80_by_60_COMP.jpg";
import img_rebirth_mu1 from "../images/mind_to_infinity_mu1.png";
import img_rebirth_mu2 from "../images/mind_to_infinity_mu2.png";

import img_summer_party from "../images/summer_party_80_by_60_COMP.jpg";
import img_summer_party_mu1 from "../images/summer_party_mu1.png";


import windmill from "../images/windmill_60_by_45_COMP.jpg";
import windmill_mu1 from "../images/windmill_mu1.png";
import abstr_greece from "../images/abstract_greece_COMP.jpg";
import bar from "../images/bar_80_by_60_COMP.jpg";
import agnes from "../images/agnes_COMP.jpg";
import broken_car from "../images/broken_car_70_by_50_COMP.jpg";
import cat_dinner from "../images/cat_dinner_50_by_60_COMP.jpg";
import dogs from "../images/dogs_COMP.jpg";
import dogs_mu1 from "../images/dogs_mu1.jpg";
import figure from "../images/figure_COMP.jpg";
import khole from "../images/khole_60_by_45_COMP.jpg";
import lady1 from "../images/lady_1_COMP.jpg";
import lady2 from "../images/lady_2_COMP.jpg";
import lady3 from "../images/lady_3_COMP.jpg";
import lady3_mu1 from "../images/lady3_mu1.png";

import lion from "../images/lion_70_by_50_COMP.jpg";
import monster from "../images/monster_COMP.jpg";
import overpass from "../images/overpass_70_by_50_COMP.jpg";
import overpass_mu1 from "../images/overpass_mu1.png";

import paradise1 from "../images/paradise_1_COMP.jpg";
import paradise2 from "../images/paradise_2_COMP.jpg";
import paradise3 from "../images/paradise_3_COMP.jpg";
import perm_vacation from "../images/perm_vacation.jpg";
import queens_gambit from "../images/queens_gambit_COMP.jpg";
import shapes from "../images/shapes_COMP.jpg";
import shapes_mu1 from "../images/shapes_mu1.jpg";

import pink from "../images/pink_COMP.jpg";
import orange from "../images/orange_COMP.jpg";
import blue from "../images/blue_COMP.jpg";




import Modal from 'react-modal';
import GalleryModal from "../common/GalleryModal";
import Masonry from "react-responsive-masonry";
// import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"



let pics = [{

        title: "Rebirth -",
        img: [img_rebirth,    img_rebirth_mu1,
            img_rebirth_mu2],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    }, {

        title: "Agnes - ",
        img: [agnes],
        spec: "Acrylic on canvas board",
        dimensions: "(60cm by 45cm)",

    }, {

        title: "Summer Party -",
        img: [img_summer_party, img_summer_party_mu1],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    }, {

        title: "Windmill -",
        img: [windmill, windmill_mu1],
        spec: "Acrylic on canvas board (60cm by 45cm) ",
        dimensions: "(60cm by 45cm)",

    }, {

        title: "Impressions of Greece - ",
        img: [abstr_greece],
        spec: "Acrylic on paper ",
        dimensions: "(xxx)",
    },
    {
        title: "Beasts at the Bar -",
        img: [bar],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
    },
    {
        title: "Paris Texas -",
        img: [broken_car],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    }, {

        title: "Dinner - ",
        img: [cat_dinner],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
    },
    {

        title: "Dog Siblings -",
        img: [dogs, dogs_mu1],
        spec: "Acrylic on canvas board ",
        dimensions: "(60cm by 45cm)",

    }, {

        title: "Figure #1 - ",
        img: [figure],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    },

    {

        title: "K-Hole of the spotless mind - ",
        img: [khole],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    }, {

        title: "Lady on Sofa -",
        img: [lady1],
        spec: "Acrylic on canvas board ",
        dimensions: "(60cm by 45cm)",

    },
    {

        title: "Figure #2 - ",
        img: [lady2],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    },
    {

        title: "Figure #3 - ",
        img: [lady3, lady3_mu1],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    },
    {

        title: "Abstract Lion - ",
        img: [lion],
        spec: "Acrylic on canvas board ",
        dimensions: "(60cm by 45cm)",

    },
    {

        title: "Awaken the Monster -",
        img: [monster],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    },
    {

        title: "Overpass - ",
        img: [overpass, overpass_mu1],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    }, {

        title: "Stranger than paradise series #1 -",
        img: [paradise1],
        spec: "Acrylic on paper ",
        dimensions: "(60cm by 45cm)",

    },
    {

        title: "Stranger than paradise series #2 -",
        img: [paradise2],
        spec: "Acrylic on paper ",
        dimensions: "(80cm by 60cm)",

    }, {

        title: "Stranger than paradise series #3 -",
        img: [paradise3],
        spec: "Acrylic on paper ",
        dimensions: "(60cm by 45cm)",

    },
    {

        title: "The literary boor - ",
        img: [perm_vacation],
        spec: "Acrylic on canvas board  ",
        dimensions: "(60cm by 45cm)",

    },
    {

        title: "Dream Gambit - ",
        img: [queens_gambit],
        spec: "Acrylic on canvas board  ",
        dimensions: "(60cm by 45cm)",

    },
    {

        img: [shapes, shapes_mu1],
        spec: "Acrylic on paper ",
        dimensions: "(60cm by 45cm)",
    },
    {

        title: "Pink ",
        img: [pink],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
    },
    {

        title: "Orange ",
        img: [orange],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
    },
    {

        title: "Blue ",
        img: [blue],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
    },
]


export default function GalleryPage() {

    const [isOpen, setIsOpen] = useState(false);
    const [imgModal, setImgModal] = useState();

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

        <div className={"gallery-container container"} >
            {/*<ResponsiveMasonry*/}
            {/*    columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}*/}
            {/*>*/}



        <Masonry
            // columnsCount={3} gutter="10px"
        >

                 {isOpen && (
                    <GalleryModal
                        img={imgModal}
                        onClick={() => closeModal()}
                        closeModal={closeModal}
                    >
                    </GalleryModal>
                )}
            {
                    pics && pics.map(el =>
                        <div className="gallery-grid-item">
                            <img onClick={() => openModal(el.img)} src={el.img[0]} alt="logo"/>
                            <div className="gallery-picture-description">
                                <div className={"gallery-text1"}>{el.title}</div>
                                <div className={"gallery-text2"}>{el.spec}</div>
                                <div className={"gallery-text3"}>{el.dimensions}</div>
                            </div>
                        </div>
                    )
                }
        </Masonry>
            {/*</ResponsiveMasonry>*/}

        </div>

    );
}



