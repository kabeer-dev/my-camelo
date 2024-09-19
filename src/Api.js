import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_BASE_URL_AMK_TEST;

const baseUrl = window.location.protocol + "//" + window.location.host;
const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 15000, // 15 seconds timeout
});

// Function to show the loader
const showLoader = () => {
  const loader = document.getElementById("global-loader");
  if (loader) {
    loader.style.display = "flex";
  }
};

// Function to hide the loader
const hideLoader = () => {
  const loader = document.getElementById("global-loader");
  if (loader) {
    loader.style.display = "none";
  }
};

// Request interceptor to show loader
axiosInstance.interceptors.request.use(
  (config) => {
    showLoader();
    return config;
  },
  (error) => {
    hideLoader();
    return Promise.reject(error);
  }
);

// Response interceptor to hide loader
axiosInstance.interceptors.response.use(
  (response) => {
    hideLoader();
    return response;
  },
  (error) => {
    hideLoader();

    if (
      error.code === "ECONNABORTED" ||
      error.message === "Network Error" ||
      (error.response &&
        (error.response.status === 500 || error.response.status === 408))
    ) {
      // Handle errors and redirect to under-maintenance page
      window.location.href = "/mashrouk-new-ui/under-maintenance";

      // Start polling to check if backend is back online
      const checkBackendStatus = setInterval(async () => {
        try {
          // Try pinging the provided API to check backend status
          const response = await axios.get(
            API_BASE_URL +
              "/api/method/airport_transport.api.bookings.get_services?language=en"
          );

          if (response.status === 200) {
            // Backend is back, clear interval and redirect to live page
            clearInterval(checkBackendStatus);
            window.location.href = "/mashrouk-new-ui/"; // Redirect to your live page
          }
        } catch (err) {
          // Backend is still down, keep polling
        }
      }, 10000); // Check every 10 seconds
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
