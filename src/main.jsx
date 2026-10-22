import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

// On the homepage, start downloading the 3D page straight away rather than
// waiting for the router to ask for it.
if (/^\/(index\.html)?$/.test(window.location.pathname)) import('./pages/Immersive.jsx');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
