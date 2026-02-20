import React from 'react';

import './App.scss';
import Nav from "./Nav";
import FrontPage from "./pages/FrontPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import CommissionPage from "./pages/CommissionPage";
import PurchasePage from "./pages/PurchasePage";


function App() {
    return (
        <div className="App" id={"App"}>
            <BrowserRouter>
                <header className="App-header">
                    <div className="App-title"><h1> Oliver Watkins - ART....</h1></div>

                    {/*A<span class="fliph">B</span>BA*/}


                    <Nav/>
                </header>
                <Routes>
                    <Route exact path="/" element={<FrontPage/>}/>
                </Routes>
                <Routes>
                    <Route exact path="/gallery" element={<GalleryPage/>}/>
                </Routes>
                <Routes>
                    <Route exact path="/commission" element={<CommissionPage/>}/>
                </Routes>

                <Routes>
                    <Route exact path="/purchase" element={<PurchasePage/>}/>
                </Routes>
                <Routes>
                    <Route exact path="/contact" element={<ContactPage/>}/>
                </Routes>

            </BrowserRouter>
        </div>
    );
}


export default App;
