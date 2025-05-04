import React from "react";
import { useNavigate } from "react-router-dom";
import welcomeImage from "../assets/WelcomeHero.png";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen flex justify-center items-center bg-black">
      <img
        src={welcomeImage}
        alt="Welcome"
        className="max-h-full max-w-full object-contain"
      />
      
      {/* This button is placed using absolute positioning */}
      <button
        onClick={() => navigate("/login")}
        className="absolute bottom-[12%] px-10 py-4 bg-blue-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-blue-600"
      >
        Continue
      </button>
    </div>
  );
}
