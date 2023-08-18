import React from 'react';

import './App.css';
import Nav from "./Nav";
import FrontPage from "./pages/FrontPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AbstractPage from "./pages/AbstractPage";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <header className="App-header">
                    <div className="App-title"> Oliver Watkins - Art</div>
                    <Nav/>
                </header>
                <Routes>
                    <Route exact path="/" element={<FrontPage/>}/>
                </Routes>
                <Routes>
                    <Route exact path="/abstract" element={<AbstractPage/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}


export default App;
