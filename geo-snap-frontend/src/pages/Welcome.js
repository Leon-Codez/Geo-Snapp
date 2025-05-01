import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/login'); // FIXED: takes user to login
  };

  return (
    <div className="welcome-background">
      <h1 className="welcome-title">Exploring to Change the World!</h1>
      <button className="welcome-overlay-button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}

export default Welcome;

  