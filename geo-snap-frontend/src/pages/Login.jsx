import React from "react";
import AuthPage from "../components/AuthPage";
import loginImage from "../assets/Login.png"; // ✅ correct import path

export default function Login() {
  return <AuthPage isLogin={true} image={loginImage} />;
}
