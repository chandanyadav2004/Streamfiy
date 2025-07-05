// Import the axios library for making HTTP requests
import axios from "axios";

/**
 * Creates and exports a configured instance of axios with default settings
 * that will be used throughout the application for API calls.
 */
export const axiosInstance = axios.create({
    // Base URL that will be prepended to all request URLs
    baseURL: "http://localhost:5001/api/",

    // Setting to true ensures cookies are included in cross-origin requests
    // Necessary when working with authenticated APIs/sessions
    withCredentials: true, // send cookies with the request

    /**
     * Additional frequently used configuration options (commented out by default):
     * 
     * headers: {
     *   "Content-Type": "application/json", // Default content type
     *   "Authorization": "Bearer <token>"   // Example auth header
     * },
     * timeout: 10000, // Request timeout in milliseconds
     * responseType: "json", // Default response type
     */
});

// Note: Remember to:
// 1. Secure the API endpoint (CORS configuration) to match this baseURL
// 2. Handle potential CORS issues in development
// 3. Replace localhost with production URL for deployment
