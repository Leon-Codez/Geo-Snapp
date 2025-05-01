import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import profileService from "../services/profileService";

function Profile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const username = localStorage.getItem("username");
      if (!username) return;

      const data = await profileService.getProfile(username);

      console.log("✅ Profile fetched:", data); // Debug

      if (data.detail) {
        console.warn("Profile fetch error:", data.detail);
        setProfileData(null);
        return;
      }

      setProfileData(data);
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileData.user_id) {
      alert("⚠️ Cannot update profile: Missing user_id.");
      return;
    }

    console.log("Updating profile for user_id:", profileData.user_id); // Debug

    const updated = await profileService.updateProfile(profileData.user_id, {
      bio: profileData.bio,
      favorite_location: profileData.favorite_location,
      profile_pic: profileData.profile_pic,
    });

    alert(updated.message || "Profile updated!");
  };

  return (
    <div className="auth-container">
      <h2>👋 Welcome back, {profileData?.username}!</h2>
      <p>This is your Geo-Snap profile page.</p>

      {!profileData && (
        <p style={{ color: "red", marginTop: "20px" }}>
          ⚠️ Profile not found or failed to load.
        </p>
      )}

      {profileData && (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <img
            src={profileData.profile_pic}
            alt="Profile"
            style={{
              width: "120px",
              borderRadius: "50%",
              marginBottom: "10px",
            }}
          />
          <p>
            <strong>Bio:</strong> {profileData.bio}
          </p>
          <p>
            <strong>Favorite Location:</strong> {profileData.favorite_location}
          </p>
          <p>
            <strong>Achievements:</strong>
          </p>
          <ul>
            {profileData.achievements.map((ach, index) => (
              <li key={index}>{ach}</li>
            ))}
          </ul>

          <hr style={{ margin: "20px 0" }} />
          <h3>Edit Profile</h3>

          {!profileData.user_id && (
            <p style={{ color: "orange" }}>
              ⚠️ Warning: Your profile may not update correctly. Missing user ID.
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label>
              Bio:
              <textarea
                value={profileData.bio}
                onChange={(e) =>
                  setProfileData({ ...profileData, bio: e.target.value })
                }
              />
            </label>

            <label>
              Favorite Location:
              <input
                type="text"
                value={profileData.favorite_location}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    favorite_location: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Profile Picture URL:
              <input
                type="text"
                value={profileData.profile_pic}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    profile_pic: e.target.value,
                  })
                }
              />
            </label>

            <button type="submit" style={{ marginTop: "10px" }}>
              💾 Save Changes
            </button>
          </form>
        </div>
      )}

      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        🚪 Log Out
      </button>
    </div>
  );
}

export default Profile;
