import React, {useState} from 'react';
import "./GalleryModal.scss"

export default function GalleryModal(props) {

    let [currentImageIndex, setCurrentImageIndex] = useState(0)

    let click = () => {
        if (currentImageIndex === (props.img.length - 1)) {
            props.closeModal()
        }else {
            setCurrentImageIndex(currentImageIndex + 1)
        }

    }
    return (
        <div className="gallery-modal" onClick={
            (event)=>
            {
                if(event.target.parentElement.className === 'gallery-modal-content') {
                }else {
                    props.closeModal()
                }
            }}  >
            <div className="gallery-modal-content" >
                <img src={props.img[currentImageIndex]} alt="logo" onClick={click}/>
            </div>
        </div>
    )

}