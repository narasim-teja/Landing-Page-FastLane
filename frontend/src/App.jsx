import React  from "react";
import { Routes, Route } from "react-router-dom";
import PlayMe from "./PlayMe";
import './style.css';
import Home from "./Home";
import { Provider } from 'react-redux'
import store from './store/store';


function App() {
    return (
        <Provider store={store}>
        <Routes>
        
          <Route path="/" element={<Home />} />
        

          <Route path="/play-me" element={<PlayMe />}
          />
        </Routes>
        </Provider>
    );
  }
export default App
