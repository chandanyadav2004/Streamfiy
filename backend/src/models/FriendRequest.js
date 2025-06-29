// Import Mongoose library for MongoDB object modeling
import mongoose from "mongoose";

// Define the schema for friend requests
const friendRequestSchema = new mongoose.Schema(
  {
    // The sender of the friend request
    sender: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for referencing User model
      ref: "User ", // Reference to the User model
      required: true, // This field is required
    },
    // The recipient of the friend request
    recipient: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for referencing User model
      ref: "User ", // Reference to the User model
      required: true, // This field is required
    },
    // The status of the friend request
    status: {
      type: String, // Status is a string
      enum: ["pending", "accepted"], // Allowed values for status
      default: "pending", // Default value is 'pending'
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the FriendRequest model using the defined schema
const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

// Export the FriendRequest model for use in other parts of the application
export default FriendRequest;
