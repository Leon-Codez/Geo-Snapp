import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000'; // or your production URL

export const registerUser = async (userData) => {
  return await axios.post(`${BASE_URL}/register`, userData);
};

export const loginUser = async (credentials) => {
  return await axios.post(`${BASE_URL}/login`, credentials);
};

export const getProfile = async (username) => {
  return await axios.get(`${BASE_URL}/get-profile/${username}`);
};

export const updateProfile = async (userId, profileData) => {
  return await axios.put(`${BASE_URL}/update-profile/${userId}`, profileData);
};

export const deleteUser = async (userId) => {
  return await axios.delete(`${BASE_URL}/delete-user/${userId}`);
};

export const searchProfiles = async (query) => {
  return await axios.get(`${BASE_URL}/search-profiles?query=${query}`);
};

export const getTopExplorers = async () => {
  return await axios.get(`${BASE_URL}/top-explorers`);
};

export const getRecentUsers = async () => {
  return await axios.get(`${BASE_URL}/recent-users`);
};
