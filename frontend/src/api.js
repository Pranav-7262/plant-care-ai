// src/api.js
import axios from "axios";

// ✅ Create Axios instance
const API = axios.create({ baseURL: "http://localhost:5000/api" });

/**
 * 🔐 Request Interceptor
 * Attaches JWT token from localStorage userInfo if available
 */
API.interceptors.request.use((req) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/**
 * ⚠️ Response Interceptor
 * Logs errors globally for debugging
 */
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("🌐 API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

// ---------------- AUTH ROUTES ----------------

// 📌 Register user
export const registerUser = (formData) => API.post("/auth/register", formData);

// 📌 Login user (save userInfo with token in localStorage)
export const loginUser = async (formData) => {
  const { data } = await API.post("/auth/login", formData);

  if (data?.token) {
    localStorage.setItem("userInfo", JSON.stringify(data));
  }

  return data;
};

// 📌 Logout user
export const logoutUser = () => {
  localStorage.removeItem("userInfo");
};

// ---------------- PLANT ROUTES ----------------

// 📌 Fetch plants (supports pagination + search)
export const fetchPlants = (page = 1, keyword = "") =>
  API.get(`/plants?page=${page}&keyword=${keyword}`);

// 📌 Add a new plant
export const addPlant = (plantData) => API.post("/plants", plantData);

// 📌 Update an existing plant
export const updatePlant = (id, plantData) =>
  API.put(`/plants/${id}`, plantData);

// 📌 Delete a plant
export const deletePlant = (id) => API.delete(`/plants/${id}`);
