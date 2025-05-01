import './EditProfile.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EditProfile({ userId }) {
  const [bio, setBio] = useState('');
  const [favoriteLocation, setFavoriteLocation] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (bio) formData.append('bio', bio);
    if (favoriteLocation) formData.append('favorite_location', favoriteLocation);
    if (profilePic) formData.append('profile_pic', profilePic);

    try {
      const response = await fetch(`http://127.0.0.1:8000/update-profile/${userId}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();
      setMessage(result.message || 'Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Something went wrong.');
    }
  };

  return (
    <div className="edit-profile-container">
      <button onClick={toggleTheme} className="theme-toggle">
        Switch to {theme === "dark" ? "Light" : "Dark"} Mode
      </button>

      <h2>Edit Your Profile</h2>

      <div className="profile-card-preview">
        <div className="card">
          <img
            src={previewUrl || "https://example.com/default-profile-pic.jpg"}
            alt="Profile Preview"
            className="card-pic"
          />
          <div className="card-content">
            <h3>{bio || "This user hasn't set a bio yet."}</h3>
            <p>{favoriteLocation || "Not yet discovered"}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Bio:
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>

        <label>
          Favorite Location:
          <input
            type="text"
            value={favoriteLocation}
            onChange={(e) => setFavoriteLocation(e.target.value)}
          />
        </label>

        <label>
          Profile Picture:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        <button type="submit">Save Changes</button>
      </form>

      <button
        type="button"
        className="back-button"
        onClick={() => navigate('/profile-view')}
      >
        ← Back to Profile
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default EditProfile;
