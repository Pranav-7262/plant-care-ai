// src/api.js
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("🌐 API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export const registerUser = (formData) => API.post("/auth/register", formData);

export const loginUser = async (formData) => {
  const { data } = await API.post("/auth/login", formData);

  if (data?.token) {
    localStorage.setItem("userInfo", JSON.stringify(data));
  }

  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("userInfo");
};

// ---------------- PLANT ROUTES ----------------
export const fetchPlants = (page = 1, keyword = "") =>
  API.get(`/plants?page=${page}&keyword=${keyword}`);

export const fetchPlantById = (id) => API.get(`/plants/${id}`);
export const addPlant = (plantData) => API.post("/plants", plantData);

export const updatePlant = (id, plantData) =>
  API.put(`/plants/${id}`, plantData);

export const deletePlant = (id) => API.delete(`/plants/${id}`);
