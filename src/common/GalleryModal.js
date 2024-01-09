import React, {useState, useEffect} from 'react';
import "./GalleryModal.scss"

export default function GalleryModal(props) {

    let [currentImageIndex, setCurrentImageIndex] = useState(0)

    let click = () => {

        // debugger;

        if (currentImageIndex === (props.img.length - 1)) {
            props.closeModal()

        }else {
            // alert()
            setCurrentImageIndex(currentImageIndex + 1)
        }

    }
    return (
        <div className="gallery-modal">
            <div className="gallery-modal-content">
                {/*<span className="close-button" onClick={props.closeModal}>*/}
                {/*  &times;*/}
                {/*</span>*/}
                <img src={props.img[currentImageIndex]} alt="logo" onClick={click}/>
            </div>
        </div>
    )

}