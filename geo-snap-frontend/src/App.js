import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import EditProfile from './pages/EditProfile';
import Welcome from './pages/Welcome.jsx';
import ProfilePage from './pages/ProfilePage';
import LocationUnlocker from './pages/LocationUnlocker';
import PhotoUploader from './pages/PhotoUploader';
import LeafletMap from './pages/LeafletMap';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Profile Management */}
          <Route path="/profile" element={<EditProfile userId={1} />} />
          <Route path="/profile-view" element={<ProfilePage username="testuser" />} />

          {/* Core Features */}
          <Route path="/unlock" element={<LocationUnlocker userId={1} />} />
          <Route path="/upload" element={<PhotoUploader />} />
          <Route path="/map" element={<LeafletMap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
