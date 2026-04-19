import React from 'react';

import {Link, useLocation} from "react-router-dom";

function Nav(props) {

    let toggleCollapse = () => {
        setCollapsed(!collapsed)
    }
    const [collapsed, setCollapsed] = React.useState(true);
    // const collapse = collapsed ? "collapse" : "";
    let location = useLocation();

    const homeClassisActive = location.pathname === "/main" ? "active" : "";
    const contactClassisActive = location.pathname.indexOf("contact") > 0 ? "active" : "";
    const abstractClassisActive = location.pathname.indexOf("abstract") > 0 ? "active" : "";
    const figurativeClassisActive = location.pathname.indexOf("figurative") > 0 ? "active" : "";
    const portraitClassisActive = location.pathname.indexOf("portrait") > 0 ? "active" : "";


    return (
        <nav className="main-menu">
            <ul>
                <li>
                    <Link to="/" onClick={toggleCollapse.bind(this)} className={homeClassisActive}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/gallery" onClick={toggleCollapse.bind(this)} className={abstractClassisActive}>
                        Gallery
                    </Link>
                </li>
                <li>
                    <Link to="/commission" onClick={toggleCollapse.bind(this)} className={figurativeClassisActive}>
                        Commission
                    </Link>
                </li>
                <li>
                    <Link to="/purchase" onClick={toggleCollapse.bind(this)} className={portraitClassisActive}>
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