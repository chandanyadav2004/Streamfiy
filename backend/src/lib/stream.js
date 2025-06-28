import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STEAM_API_KEY; // Corrected variable name
const apiSecret = process.env.STEAM_API_SECRET; // Corrected variable name

if (!apiKey || !apiSecret) {
    console.error("Stream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser  = async (userData) => {
    try {
        // Ensure userData has the required fields
        const { userId, name, email, profilePic } = userData;

        // Ensure userId is provided
        if (!userId) {
            throw new Error("User  ID is required when upserting a user");
        }

        // Upsert user in Stream
        await streamClient.upsertUsers([
            {
                id: userId, // This should be the unique user ID
                name: name,
                email: email,
                image: profilePic,
            },
        ]);

        console.log(`Stream user upserted for ${name}`);
        return userData;
    } catch (error) {
        console.error("Error upserting Stream User:", error);
        throw error; // Rethrow the error for further handling
    }
};
