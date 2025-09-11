// src/api/servicesApi.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const fetchServices = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/services`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch services:", err);
    throw err;
  }
};
