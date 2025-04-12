import axios from "axios";

const axiosBare = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export default axiosBare;
