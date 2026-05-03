import React from 'react';

import {Link, useLocation} from "react-router-dom";

function Nav(props) {

    let toggleCollapse = () => {
        setCollapsed(!collapsed)
    }
    const [collapsed, setCollapsed] = React.useState(true);
    // const collapse = collapsed ? "collapse" : "";
    let location = useLocation();

    const homeClassisActive = location.pathname === "/" || location.pathname === "/main" ? "active" : "";
    const galleryClassisActive = location.pathname.startsWith("/gallery") ? "active" : "";
    const commissionClassisActive = location.pathname.indexOf("commission") > 0 ? "active" : "";
    const purchaseClassisActive = location.pathname.indexOf("purchase") > 0 ? "active" : "";
    const contactClassisActive = location.pathname.indexOf("contact") > 0 ? "active" : "";


    return (
        <nav className="main-menu">
            <ul>
                <li>
                    <Link to="/" onClick={toggleCollapse.bind(this)} className={homeClassisActive}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/gallery" onClick={toggleCollapse.bind(this)} className={galleryClassisActive}>
                        Gallery
                    </Link>
                </li>
                <li>
                    <Link to="/commission" onClick={toggleCollapse.bind(this)} className={commissionClassisActive}>
                        Commission
                    </Link>
                </li>
                <li>
                    <Link to="/purchase" onClick={toggleCollapse.bind(this)} className={purchaseClassisActive}>
                        Purchase
                    </Link>
                </li>
                <li>
                    <Link to="/contact" onClick={toggleCollapse.bind(this)} className={contactClassisActive}>
                        Contact
                    </Link>
                </li>
            </ul>
        </nav>

    );
}

export default Nav;