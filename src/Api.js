import axios from "axios";
import { useHistory } from "react-router-dom";

const baseUrl = window.location.protocol + "//" + window.location.host;
const axiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 500 || error.response.status === 408)) {
      // Redirect to maintenance page
      window.location.href = "/under-maintenance";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
