import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="welcome-background">
      <button className="welcome-overlay-button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}

export default Welcome;
