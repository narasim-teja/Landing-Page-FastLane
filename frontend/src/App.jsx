import React  from "react";
import { Routes, Route } from "react-router-dom";
import PlayMe from "./PlayMe";
import './style.css';
import Home from "./Home";

import LandingPage from "./LandingPage";


function App() {
    return (
        
        <Routes>

          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
        

          <Route path="/play-me" element={<PlayMe />}
          />
        </Routes>
       
    );
  }
export default App
