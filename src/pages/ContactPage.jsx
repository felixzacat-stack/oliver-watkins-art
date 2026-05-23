import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL, OG_IMAGE } from 'src/seo';

function ContactPage(props) {
    return (
        <>
            <Helmet>
                <title>Contact | Oliver Watkins Art</title>
                <meta name="description" content="Contact Oliver Watkins, Munich-based abstract artist. Get in touch about commissions, purchases, or general enquiries." />
                <meta property="og:title" content="Contact | Oliver Watkins Art" />
                <meta property="og:description" content="Contact Oliver Watkins, Munich-based abstract artist." />
                <meta property="og:image" content={OG_IMAGE} />
                <meta property="og:url" content={`${SITE_URL}/contact`} />
                <meta property="og:type" content="website" />
                <link rel="canonical" href={`${SITE_URL}/contact`} />
            </Helmet>
            <div className={"container"} >
                <p className={"text1"}>
                    Contact me by writing me an email at oliver.f.watkins@gmail.com
                </p>
            </div>
        </>
    );
}

export default ContactPage;