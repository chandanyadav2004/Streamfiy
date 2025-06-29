// Import the StreamChat library for interacting with Stream's chat API
import { StreamChat } from "stream-chat";
// Import environment variables from the .env file
import "dotenv/config";

// Retrieve the Stream API key and secret from environment variables
const apiKey = process.env.STREAM_API_KEY; // Corrected variable name
const apiSecret = process.env.STREAM_API_SECRET; // Corrected variable name

// Check if the API key and secret are provided
if (!apiKey || !apiSecret) {
    console.error("Stream API key or Secret is missing");
}

// Create an instance of the StreamChat client using the API key and secret
const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// Function to upsert (update or insert) a user in Stream
export const upsertStreamUser  = async (userData) => {
    try {
        // Destructure the required fields from userData
        const { userId, name, email, profilePic } = userData;

        // Ensure userId is provided
        if (!userId) {
            throw new Error("User  ID is required when upserting a user");
        }

        // Upsert user in Stream
        await streamClient.upsertUsers([
            {
                id: userId, // This should be the unique user ID
                name: name, // User's name
                email: email, // User's email
                image: profilePic, // User's profile picture
            },
        ]);

        // Log success message
        console.log(`Stream user upserted for ${name}`);
        return userData; // Return the user data for further use
    } catch (error) {
        // Log any errors that occur during the upsert process
        console.error("Error upserting Stream User:", error);
        throw error; // Rethrow the error for further handling
    }
};
