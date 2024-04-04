import './style.css';
import React, { Suspense } from 'react'; // Ensure React is imported when using JSX
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react"




const root = ReactDOM.createRoot(document.querySelector('#root'));



// Render the App component instead of directly placing JSX in root.render
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Analytics/>
    </BrowserRouter>
    
  </React.StrictMode>
);
