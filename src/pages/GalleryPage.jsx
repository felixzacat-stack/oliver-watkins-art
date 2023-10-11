import React, {useState, useEffect} from 'react';

import "./GalleryPage.scss"
import img_rebirth from "../images/mind_to_infinity_80_by_60.jpg";
import img_summer_party from "../images/summer_party_80_by_60.jpg";
import windmill from "../images/windmill_60_by_45.jpg";
import abstr_greece from "../images/abstract_greece.jpg";
import bar from "../images/bar_80_by_60.jpg";
import agnes from "../images/agnes.jpg";
import broken_car from "../images/broken_car_70_by_50.jpg";
import cat_dinner from "../images/cat_dinner_50_by_60.jpg";
import dogs from "../images/dogs.jpg";
import figure from "../images/figure.jpg";
import khole from "../images/khole_60_by_45.jpg";
import lady1 from "../images/lady_1.jpg";
import lady2 from "../images/lady_2.jpg";
import lady3 from "../images/lady_3.jpg";
import lion from "../images/lion_70_by_50.jpg";
import monster from "../images/monster.jpg";
import overpass from "../images/overpass_70_by_50.jpg";
import paradise1 from "../images/paradise_1.jpg";
import paradise2 from "../images/paradise_2.jpg";
import paradise3 from "../images/paradise_3.jpg";
import perm_vacation from "../images/perm_vacation.jpg";
import queens_gambit from "../images/queens_gambit.jpg";
import shapes from "../images/shapes.jpg";

import Modal from 'react-modal';

function Modal2(props) {
    return (
        <div className="modal2">
            <div className="modal-content2">
            <span className="close2" onClick={props.closeModal}>
              &times;
            </span>
                {/*<h2>Modal Title</h2>*/}

                <img src={props.img} alt="logo" onClick={props.closeModal}/>
                {/*<p>This is the modal content.</p>*/}
            </div>
        </div>
    )
}

// <div className="grid-item">
//     <img onClick={() => openModal(img_rebirth)} src={img_rebirth} alt="logo"/>
//     <div className="picture-description">
//         <span className={"gallery-text1 "}>Rebirth - </span>
//         <span></span>
//         <span>(80cm by 60cm) </span>
//     </div>
// </div>


let pics = [{

        title: "Rebirth -",
        img: img_rebirth,
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    }, {

        title: "Agnes",
        img: agnes,
        spec: "Acrylic on canvas board",
        dimensions: "(60cm by 45cm)",

    },
    {

        title: "Summer Party -",
        img: img_summer_party,
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    },
    {

        title: "Windmill -",
        img: windmill,
        spec: "Acrylic on canvas board (60cm by 45cm) ",
        dimensions: "(60cm by 45cm)",

    },
    {

        title: "Impressions of Greece - ",
        img: abstr_greece,
        spec: "Acrylic on paper ",
        dimensions: "(xxx)",

    },
    {

        title: "At the bar -",
        img: bar,
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    },


    {

        title: "Paris Texas -",
        img: broken_car,
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    },    {

        title: "Dinner - ",
        img: cat_dinner,
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    },

    {

        title: "Dogs -",
        img: dogs,
        spec: "Acrylic on canvas board ",
        dimensions: "(60cm by 45cm)",

    },    {

        title: "Figure #1 - ",
        img: figure,
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    },

    {

        title: "K-Hole of the spotless mind - ",
        img: khole,
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    },    {

        title: "Lady on Sofa -",
        img: lady1,
        spec: "Acrylic on canvas board ",
        dimensions: "(60cm by 45cm)",

    },
    {

        title: "Figure #2 - ",
        img: lady2,
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    },
    {

        title: "Figure #3 - ",
        img: lady3,
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    },
    {

        title: "Lion - ",
        img: lion,
        spec: "Acrylic on canvas board ",
        dimensions: "(60cm by 45cm)",

    },
    {

        title: "Awaken the Monster -",
        img: monster,
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    },
    {

        title: "Overpass - ",
        img: overpass,
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",

    },    {

        title: "Stranger than paradise series #1 -",
        img: paradise1,
        spec: "Acrylic on paper ",
        dimensions: "(60cm by 45cm)",

    },
    {

        title: "Stranger than paradise series #2 -",
        img: paradise2,
        spec: "Acrylic on paper ",
        dimensions: "(80cm by 60cm)",

    }, {

        title: "Stranger than paradise series #3 -",
        img: paradise3,
        spec: "Acrylic on paper ",
        dimensions: "(60cm by 45cm)",

    },
    {

        title: "Morning coffee - ",
        img: perm_vacation,
        spec: "Acrylic on canvas board  ",
        dimensions: "(60cm by 45cm)",

    },
    {

        title: "Ever after - ",
        img: queens_gambit,
        spec: "Acrylic on canvas board  ",
        dimensions: "(60cm by 45cm)",

    },
    {

        title: "Shapes - ",
        img: shapes,
        spec: "Acrylic on paper ",
        dimensions: "(60cm by 45cm)",
    },
    {

        title: "Windmill - ",
        img: windmill,
        spec: "Acrylic on paper",
        dimensions: "(60cm by 45cm)",
    },
]


export default function GalleryPage(props) {

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
        Modal.setAppElement('.container');
    });

    // let subtitle;

    // function afterOpenModal() {
    //     // references are now sync'd and can be accessed.
    //     // subtitle.style.color = '#f00';
    // }


    return (
        <div className={"gallery container"} id={"gallery"}>
            {isOpen && (
                <Modal2
                    img={imgModal}
                    onClick={() => closeModal()}
                    closeModal={closeModal}
                >
                </Modal2>
            )}
            {
                pics && pics.map(el =>
                        <div className="grid-item">
                            <img onClick={() => openModal(el.img)} src={el.img} alt="logo"/>
                            <div className="picture-description">
                                <span className={"gallery-text1"}>{el.title}</span><br/>
                                <span className={"gallery-text2"}>{el.spec}</span>
                                <span className={"gallery-text3"}>{el.dimensions}</span>
                            </div>
                        </div>
                )
            }
        </div>
    );
}

