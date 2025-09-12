// src/components/servicesApi.js
import api from "./api"; // same folder as api.js

export const fetchServices = async () => {
  try {
    const res = await api.get("/services"); // api.js already handles baseURL
    return res.data;
  } catch (err) {
    console.error("Failed to fetch services:", err);
    throw err;
  }
};
