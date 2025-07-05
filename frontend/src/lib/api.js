import { axiosInstance } from "./axios";


/**
 * Handles user signup by sending registration data to the server
 * @param {Object} signupData - Contains user registration details
 * @param {string} signupData.fullName - User's full name
 * @param {string} signupData.email - User's email address
 * @param {string} signupData.password - User's password
 * @returns {Promise<Object>} Response data from the server
 * @throws {Error} Various error types that could occur during the API call
 */


export const signup = async (signupData) =>{
    // Potential Error 1: Network failure (server offline, no internet)
    // Potential Error 2: Invalid request data (server validation fails)
    // Potential Error 3: Rate limiting (too many requests)

    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data;
}

/**
 * Common Error Scenarios:
 * 1. Email already exists (409 Conflict)
 * 2. Invalid email/password format (400 Bad Request)
 * 3. Server down/network issues (Network Error)
 * 4. Rate limiting (429 Too Many Requests)
 * 5. Unexpected server errors (500 Internal Server Error)
 */