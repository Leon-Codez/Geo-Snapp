# 🌍 Geo-Snap

**Geo-Snap** is a location-based photo app that lets users:
- Unlock real-world locations via geolocation
- Upload photos to earn points
- View visited landmarks on an interactive map

---

## ✅ Features Implemented

### 🖼️ Welcome Page
- Custom background and UI
- "Continue" button routes to Login

### 🔐 Auth Views
- `/login` and `/register` pages styled and working

### 📝 Edit Profile
- `/profile` allows updating user bio, favorite location, and uploading a profile pic

### 📷 Photo Upload & Points
- `/upload` simulates uploading a photo
- Adds points using the custom `RewardsManager`
- Displays total points after upload

### 📍 Location Unlocking
- `/unlock` uses browser geolocation
- Unlocks a location if near a known landmark
- Displays status messages

### 🗺️ Leaflet Map
- `/map` renders a fully interactive map centered on Syracuse
- Shows visited locations using Leaflet.js
- Markers include name + popup info

---

## 🧼 Clean-Up Highlights
- Removed broken `react-leaflet` setup
- Switched to plain Leaflet.js for full compatibility
- Unified routing and cleaned folder structure

---

## 👨‍💻 Developer
Built and refined by **Leon Dennen** with backend collaboration from **Isaiah**.
