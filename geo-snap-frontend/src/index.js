import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 🌓 Set theme class on body here (default to dark mode for now)
document.body.classList.add("dark"); // or "light" to start with light mode

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
