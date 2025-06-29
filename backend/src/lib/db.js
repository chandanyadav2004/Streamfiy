// Import the mongoose library for MongoDB object modeling
import mongoose from "mongoose";

// Function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database using the connection URL from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true, // Use the new URL parser
            useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
        });
        
        // Log a success message with the host of the connected database
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log an error message if the connection fails
        console.log("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with a failure code of 1
    }
}

// Export the connectDB function for use in other parts of the application
export default connectDB;
