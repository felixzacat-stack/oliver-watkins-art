import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL, OG_IMAGE } from 'src/seo';

function PurchasePage() {
    return (
        <>
            <Helmet>
                <title>Purchase a Painting | Oliver Watkins Art</title>
                <meta name="description" content="Buy original acrylic paintings by Oliver Watkins. Contact us for purchasing enquiries on abstract, figurative, and portrait works." />
                <meta property="og:title" content="Purchase a Painting | Oliver Watkins Art" />
                <meta property="og:description" content="Buy original acrylic paintings by Oliver Watkins. Contact us for purchasing enquiries." />
                <meta property="og:image" content={OG_IMAGE} />
                <meta property="og:url" content={`${SITE_URL}/purchase`} />
                <meta property="og:type" content="website" />
                <link rel="canonical" href={`${SITE_URL}/purchase`} />
            </Helmet>
            <div className={"container"} >
                <p className={"text1"}>
                    For all purchasing enquiries please send an email to oliver.f.watkins@gmail.com
                </p>
            </div>
        </>
    );
}

export default PurchasePage;