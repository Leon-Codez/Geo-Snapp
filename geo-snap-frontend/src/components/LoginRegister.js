import React, { useState } from "react";
import "./LoginRegister.css";
import profileService from "../services/profileService";
import { useNavigate } from "react-router-dom";

function LoginRegister() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");      // Clear any previous message
    setIsError(false);   // Reset error state
  
    try {
      const response = isRegister
        ? await profileService.register(formData.username, formData.email, formData.password)
        : await profileService.login(formData.username, formData.password);
      
        if (response && response.detail) {
          const detail = Array.isArray(response.detail)
            ? response.detail[0].msg  // get the actual text message
            : response.detail;
          setMessage(detail);
          setIsError(true);
        } else {
        // Success
        setMessage(isRegister ? "🎉 Account created!" : "✅ Login successful!");
        setIsError(false);
        localStorage.setItem("username", formData.username);
        localStorage.setItem("token", response.token);
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again.");
      setIsError(true);
    }
  };
  
  return (
    <div className="auth-container">
      <h2>{isRegister ? "Register" : "Login"}</h2>
  
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
  
        {isRegister && (
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        )}
  
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
  
        <button type="submit">
          {isRegister ? "Create Account" : "Log In"}
        </button>
      </form>
  
      {message && (
        <div
          style={{
            marginTop: "10px",
            color: isError ? "red" : "green",
            fontWeight: "bold",
          }}
        >
          {message}
        </div>
      )}
  
      <p onClick={() => setIsRegister(!isRegister)} className="toggle">
        {isRegister ? "Already have an account? Login" : "New here? Register"}
      </p>
    </div>
  );
  
}

export default LoginRegister;
