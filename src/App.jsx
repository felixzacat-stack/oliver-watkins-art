import React from 'react';

import img_dogs from './images/dogs.jpg';
import str_parad_2 from './images/ac29.jpg';
// import i3 from './images/ac31.jpg';
// import str_para_1 from './images/ac33.jpg';
// import windmill from './images/ac53.jpg';
// import i6 from './images/ac55.jpg';
// import i7 from './images/ac56.jpg';
// import i8 from './images/ac57.jpg';
// import i9 from './images/ac58.jpg';
// import i10 from './images/ac59.jpg';
// import img_cat_dinner from './images/ac60.jpg';
// import img_rebirth from './images/ac61.jpg';
// import img_summer_party from './images/ac62.jpg';
// import img_at_the_bar from './images/ac63.jpg';


import './App.css';
import Nav from "./Nav";
// import {BrowserRouter, Route, Switch} from "react-router-dom";
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
                    {/*<nav className="main-menu">*/}
                    {/*    <ul>*/}
                    {/*        <li><a href="#">Home</a></li>*/}
                    {/*        <li><a href="#">Abstract</a></li>*/}
                    {/*        <li><a href="#">Figurative</a></li>*/}
                    {/*        <li><a href="#">Portrait</a></li>*/}
                    {/*        <li><a href="#">Contact</a></li>*/}
                    {/*    </ul>*/}
                    {/*</nav>*/}
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


// return (
//     <BrowserRouter>
//         <Switch>
//             <Route exact path="/">
//                 <PageLayoutMain/>
//             </Route>
//             <Route path="/main">
//                 <PageLayoutMain/>
//             </Route>
//             <Route path="/icharts">
//                 <PageLayoutICharts/>
//             </Route>
//             <Route path="/#/icharts">
//                 <PageLayoutICharts/>
//             </Route>
//             <Route path="*" element={<div>Not found</div>}/>
//         </Switch>
//     </BrowserRouter>
// );


export default App;
