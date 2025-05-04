import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = ({ isLogin, image }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // only for signup
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    const endpoint = isLogin ? "login" : "register";
    const payload = isLogin
      ? { username, password }
      : { username, password, email }; // ✅ Include email for signup

    try {
      const response = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Something went wrong");

      alert(data.message || (isLogin ? "Logged in!" : "Signed up!"));
      navigate("/home"); // 🔄 Redirect after login/signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0C2D3A] text-white font-sans">
      <div className="mb-6 text-center">
        {image && (
          <img
            src={image}
            alt="Geo-Snap Graphic"
            className="w-24 h-24 mx-auto mb-4"
          />
        )}
        <h1 className="text-4xl font-bold">Geo-Snap</h1>
        <p className="text-2xl mt-2">{isLogin ? "Login" : "Sign up"}</p>
      </div>

      <div className="w-80 space-y-4">
        <input
          className="w-full p-3 rounded-lg bg-white text-black placeholder-gray-500"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full p-3 rounded-lg bg-white text-black placeholder-gray-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isLogin && (
          <input
            className="w-full p-3 rounded-lg bg-white text-black placeholder-gray-500"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        <button
          className="w-full bg-[#2DA6A0] hover:bg-[#24908C] transition text-white font-semibold py-3 rounded-lg"
          onClick={handleSubmit}
        >
          {isLogin ? "Login" : "Sign up"}
        </button>

        <p className="text-sm text-center mt-2">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                className="underline"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="underline"
                onClick={() => navigate("/login")}
              >
                Log in
              </button>
            </>
          )}
        </p>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
