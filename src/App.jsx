import React from 'react';

import './App.scss';
import Nav from "./Nav";

import {Outlet, useLocation, Link} from "react-router";


function App() {
    const location = useLocation();
    const isGallery = location.pathname.startsWith('/gallery');

    return (
        <>
            <div className="sticky-nav-wrapper">
                <header className="App-header">
                    <div className="App-title"><h1> Oliver Watkins - ART</h1></div>
                    <Nav/>
                </header>
                {isGallery && (
                    <nav className="gallery-sub-menu">
                        <ul>
                            <li>
                                <Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''}>
                                    All
                                </Link>
                            </li>
                            <li>
                                <Link to="/gallery/abstract" className={location.pathname === '/gallery/abstract' ? 'active' : ''}>
                                    Abstract
                                </Link>
                            </li>
                            <li>
                                <Link to="/gallery/figurative" className={location.pathname === '/gallery/figurative' ? 'active' : ''}>
                                    Figurative
                                </Link>
                            </li>
                            <li>
                                <Link to="/gallery/portrait" className={location.pathname === '/gallery/portrait' ? 'active' : ''}>
                                    Portrait
                                </Link>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
            <main style={{padding: "1rem"}}>
                <Outlet/>
            </main>
        </>
    );
}


export default App;
