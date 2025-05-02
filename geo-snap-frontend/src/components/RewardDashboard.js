
// RewardDashboard.js
import React, { useState, useEffect } from 'react';
import RewardsManager from './RewardsManager';

const RewardDashboard = ({ user }) => {
  const rewards = new RewardsManager(user);
  const [points, setPoints] = useState(rewards.getPoints());
  const [badge, setBadge] = useState('No Badge');

  useEffect(() => {
    determineBadge(points);
  }, [points]);

  const determineBadge = (currentPoints) => {
    if (currentPoints >= 100) {
      setBadge('Gold Explorer');
    } else if (currentPoints >= 50) {
      setBadge('Silver Navigator');
    } else if (currentPoints >= 20) {
      setBadge('Bronze Traveler');
    } else {
      setBadge('No Badge');
    }
  };

  const simulateActivity = (type) => {
    const updatedPoints = rewards.addPoints(type);
    setPoints(updatedPoints);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
      <p className="text-lg">Total Points: {points}</p>
      <p className="text-lg">Badge: <strong>{badge}</strong></p>

      <div className="space-x-2">
        <button onClick={() => simulateActivity('photo_upload')} className="px-4 py-2 bg-blue-500 text-white rounded">Upload Photo</button>
        <button onClick={() => simulateActivity('location_visited')} className="px-4 py-2 bg-green-500 text-white rounded">Visit Location</button>
        <button onClick={() => simulateActivity('landmark_unlocked')} className="px-4 py-2 bg-yellow-500 text-white rounded">Unlock Landmark</button>
      </div>
    </div>
  );
};

export default RewardDashboard;
