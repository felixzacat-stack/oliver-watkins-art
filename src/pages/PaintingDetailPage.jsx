import React from 'react';
import { useParams, Link } from 'react-router';

import pics from 'src/data/pics';
import './PaintingDetailPage.scss';

export default function PaintingDetailPage() {
    const { slug } = useParams();
    const pic = pics.find(p => p.slug === slug);

    if (!pic) {
        return (
            <div className="detail-not-found">
                <p>Painting not found.</p>
                <Link to="/gallery">← Back to gallery</Link>
            </div>
        );
    }

    document.title = `${pic.title || 'Artwork'} | Oliver Watkins Art`;

    return (
        <div className="detail-container container">
            <Link to="/gallery" className="detail-back">← Back to gallery</Link>
            <div className="detail-image-wrapper">
                <img src={pic.img[0]} alt={pic.title || 'Artwork'} />
            </div>
            <div className="detail-description">
                {pic.title && <div className="gallery-text1">{pic.title}</div>}
                <div className="gallery-text2">{pic.spec}</div>
                <div className="gallery-text3">{pic.dimensions}</div>
                {pic.price && <div className="gallery-text4">{pic.price}</div>}
                {pic.sold && <div className="detail-sold">SOLD</div>}
            </div>
        </div>
    );
}
