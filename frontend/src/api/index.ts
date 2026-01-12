import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Replace with your API base URL
  // You can add other default settings here, like headers
});

export default axiosInstance;
