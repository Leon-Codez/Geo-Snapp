const API_BASE_URL = "http://localhost:8000";

const profileService = {
  login: async (username, password) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    return await res.json();
  },

  register: async (username, email, password) => {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    return await res.json();
  },

  getProfile: async (username) => {
    const res = await fetch(`${API_BASE_URL}/get-profile/${username}`);
    return await res.json();
  }, 
  
  updateProfile: async (userId, updates) => {
    const res = await fetch(`${API_BASE_URL}/update-profile/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    return await res.json();
  },
};

export default profileService;
