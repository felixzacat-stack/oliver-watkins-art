import React from 'react';

import './App.scss';
import Nav from "./Nav";

import {Outlet} from "react-router";


function App() {
    return (

        <>
            <header className="App-header">
                <div className="App-title"><h1> Oliver Watkins - ART</h1></div>
                <Nav/>
            </header>
            <main style={{padding: "1rem"}}>
                <Outlet/>
            </main>
        </>
    );
}


export default App;
