import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();

  // Load the logged-in username from localStorage
  const username = localStorage.getItem("username");

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/get-profile/${username}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (!profile) return <div className="profile-loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="theme-toggle"
      >
        Switch to {theme === "dark" ? "Light" : "Dark"} Mode
      </button>

      <div className="profile-card">
        <img src={profile.profile_pic} alt="PFP" className="profile-avatar" />
        <h2>{profile.username}</h2>
        <p className="location">{profile.favorite_location}</p>
        <p className="bio">{profile.bio}</p>

        <div className="achievements-section">
          <h4>Achievements</h4>
          {Array.isArray(profile.achievements) && profile.achievements.length > 0 ? (
            <ul>
              {profile.achievements.map((ach, idx) => (
                <li key={idx} className="achievement-pill">{ach}</li>
              ))}
            </ul>
          ) : (
            <p>No achievements yet.</p>
          )}
        </div>

        <button onClick={() => navigate("/profile")} className="edit-button">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
