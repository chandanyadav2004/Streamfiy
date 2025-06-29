// Import the generateStreamToken function from the stream utility library
import { generateStreamToken } from "../lib/stream.js";

// Export an async function to handle stream token generation
export async function getStreamToken(req, res) {
  try {
    // Generate a stream token using the authenticated user's ID from req.user
    const token = generateStreamToken(req.user.id);

    // Return the token as JSON with a 200 OK status
    res.status(200).json({ token });
  
  } catch (error) {
    // Log any errors that occur during token generation
    console.log("Error in getStreamToken controller:", error.message);
    
    // Return a 500 Internal Server Error with a generic message
    res.status(500).json({ message: "Internal Server Error" });
  }
}
