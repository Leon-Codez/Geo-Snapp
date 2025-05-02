import React, { useEffect, useState } from "react";

const LocationUnlocker = ({ userId }) => {
  const [location, setLocation] = useState(null);
  const [landmarks, setLandmarks] = useState([]);
  const [status, setStatus] = useState("Click to check your location");

  useEffect(() => {
    fetch("http://localhost:5000/locations")
      .then((res) => res.json())
      .then(setLandmarks)
      .catch((err) => console.error("Failed to fetch landmarks:", err));
  }, []);

  const getUserLocation = async () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported");
      return;
    }

    setStatus("Getting location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus("Location received, checking...");
        checkNearbyLandmarks(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Location error:", error);
        setStatus("Error getting location");
      },
      { enableHighAccuracy: true }
    );
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const checkNearbyLandmarks = (lat, lon) => {
    for (let landmark of landmarks) {
      const distance = haversineDistance(lat, lon, landmark.latitude, landmark.longitude);
      if (distance <= (landmark.radius || 50)) {
        unlockLocation(landmark);
        return;
      }
    }
    setStatus("No nearby landmarks found.");
  };

  const unlockLocation = async (landmark) => {
    try {
      const response = await fetch("http://localhost:5000/locations/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          locationId: landmark.id,
        }),
      });

      if (response.ok) {
        setStatus(`🎉 Unlocked ${landmark.name}!`);
      } else {
        setStatus("Failed to unlock location.");
      }
    } catch (err) {
      console.error("Unlock error:", err);
      setStatus("Error unlocking location.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Geo Unlock</h2>
      <button onClick={getUserLocation} style={{ padding: 10, fontSize: 16 }}>
        Unlock Nearby Location
      </button>
      <p>{status}</p>
    </div>
  );
};

export default LocationUnlocker;
