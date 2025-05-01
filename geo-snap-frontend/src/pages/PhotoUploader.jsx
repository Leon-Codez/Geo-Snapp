import React, { useState } from 'react';
import RewardsManager from '../utils/RewardsManager'; // Adjust if in a different folder

// Simulated user profile object
let user = {
  name: 'Isaiah',
  points: 0
};

const rewards = new RewardsManager(user);

function PhotoUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [points, setPoints] = useState(user.points);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadMessage('');
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadMessage('Please select a photo first.');
      return;
    }

    console.log(`Uploading photo: ${selectedFile.name}`);
    setUploadMessage('Uploading...');

    setTimeout(() => {
      const totalPoints = rewards.addPoints('photo_upload');
      setPoints(totalPoints);
      setUploadMessage(`Photo uploaded! You've earned 10 points.`);
    }, 1000); // Simulated delay
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload a Photo</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: 10 }}>
        Upload
      </button>
      <p>{uploadMessage}</p>
      <p><strong>Total Points:</strong> {points}</p>
    </div>
  );
}

export default PhotoUploader;
