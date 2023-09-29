import React from 'react';

import './App.scss';
import Nav from "./Nav";
import FrontPage from "./pages/FrontPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import GalleryPage from "./pages/GalleryPage";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <header className="App-header">
                    <div className="App-title"><h1> Oliver Watkins - Art</h1></div>
                    <Nav/>
                </header>
                <Routes>
                    <Route exact path="/" element={<FrontPage/>}/>
                </Routes>
                <Routes>
                    <Route exact path="/gallery" element={<GalleryPage/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}


export default App;
