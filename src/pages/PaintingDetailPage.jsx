import React, { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Helmet } from 'react-helmet-async';

import pics from 'src/data/pics';
import { SITE_URL, OG_IMAGE } from 'src/seo';
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

    const title = pic.title?.trim().replace(/-$/, '').trim() || 'Artwork';
    const description = `${title} — ${pic.spec}, ${pic.dimensions}. Original painting by Oliver Watkins.${pic.price ? ` ${pic.price}.` : ''}`;
    const canonicalUrl = `${SITE_URL}/gallery/detail/${pic.slug}`;

    const [activeImg, setActiveImg] = useState(pic.img[0]);
    const hasMultiple = pic.img.length > 1;

    return (
        <>
        <Helmet>
            <title>{title} | Oliver Watkins Art</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={`${title} | Oliver Watkins Art`} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={OG_IMAGE} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content="article" />
            <link rel="canonical" href={canonicalUrl} />
        </Helmet>
        <div className="detail-container">
            <div className="detail-left">
                <Link to="/gallery" className="detail-back">← Back to gallery</Link>
                <div className="detail-description">
                    {pic.title && <div className="gallery-text1">{pic.title}</div>}
                    <div className="gallery-text2">{pic.spec}</div>
                    <div className="gallery-text3">{pic.dimensions}</div>
                    {pic.price && <div className="gallery-text4">{pic.price}</div>}
                    {pic.sold && <div className="detail-sold">SOLD</div>}
                </div>
                {hasMultiple && (
                    <div className="detail-thumbnails">
                        {pic.img.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt={`${pic.title || 'Artwork'} view ${i + 1}`}
                                className={src === activeImg ? 'active' : ''}
                                onClick={() => setActiveImg(src)}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="detail-image-wrapper">
                <img src={activeImg} alt={pic.title || 'Artwork'} />
            </div>
        </div>
        </>
    );
}
