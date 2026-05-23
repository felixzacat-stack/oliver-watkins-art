import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL, OG_IMAGE } from 'src/seo';

function CommissionPage(props) {
    return (
        <>
            <Helmet>
                <title>Commission a Painting | Oliver Watkins Art</title>
                <meta name="description" content="Commission an original acrylic painting from Oliver Watkins, Munich-based abstract artist. Get in touch to discuss your commission." />
                <meta property="og:title" content="Commission a Painting | Oliver Watkins Art" />
                <meta property="og:description" content="Commission an original acrylic painting from Oliver Watkins, Munich-based abstract artist." />
                <meta property="og:image" content={OG_IMAGE} />
                <meta property="og:url" content={`${SITE_URL}/commission`} />
                <meta property="og:type" content="website" />
                <link rel="canonical" href={`${SITE_URL}/commission`} />
            </Helmet>
            <div className={"container"} >
                <p className={"text1"}>
                If you would like to commission a painting from me please contact me on oliver.f.watkins@gmail for a discussion
                </p>
            </div>
        </>
    );
}

export default CommissionPage;