import React from "react";
import AuthPage from "../components/AuthPage";
import signupImage from "../assets/Signup.png";

export default function Signup() {
  return <AuthPage isLogin={false} image={signupImage} />;
}
