// Import the axios library to make HTTP requests
import axios from "axios";

// Import the base URL constant from a separate file (usually where you store API endpoints)
import { BASE_URL } from "./constant";

// Create an axios instance with custom configurations
const axiosInstance = axios.create({
  // Set the base URL for all requests made using this instance
  baseURL: BASE_URL,
  // Set a timeout of 10 seconds (10000 milliseconds) for the requests
  timeout: 10000,
  // Set the default headers for all requests
  headers: {
    "Content-Type": "application/json", // Send data in JSON format
  },
});

// Add a request interceptor to the custom Axios instance
axiosInstance.interceptors.request.use(
  // This function runs before the request is sent
  (confiq) => {
    // Get the token from localStorage (usually saved after user logs in)
    const accessToken = localStorage.getItem("token");
    // If the token exists, add it to the request headers
    if (accessToken) {
      // Add the Authorization header with the Bearer token format
      confiq.headers.Authorization = `Bearer ${accessToken}`;
    }
    // Return the modified request config so the request can proceed
    return confiq;
  },
  // This function handles errors that happen while setting up the request
  (error) => {
    // Reject the promise with the error to be handled later
    return Promise.reject(error);
  }
);

// Export the custom axios instance so it can be reused across your project
export default axiosInstance;
