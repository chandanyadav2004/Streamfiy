// Import User and FriendRequest models
import User from "../models/User.js"; // Import the User model for user-related database operations
import FriendRequest from "../models/FriendRequest.js"; // Import the FriendRequest model for managing friend requests

// Controller to get recommended users for the current user
export async function getRecommendUsers(req, res) {
    try {
        const currentUserId = req.user.id; // Get the current user's ID from the request
        const currentUser  = req.user; // Get the current user object

        // Find users who are not the current user, not already friends, and are onboarded
        const recommendUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // Exclude the current user
                { _id: { $nin: currentUser .friends } }, // Exclude current user's friends
                { isOnboarded: true } // Only include users who are onboarded
            ]
        });

        // Respond with the list of recommended users
        res.status(200).json(recommendUsers);
    } catch (error) {
        // Log the error and respond with a 500 status code
        console.error("Error in getRecommendUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Controller to get the current user's friends
export async function getMyFriends(req, res) {
    try {
        // Find the user by ID and select only the friends field
        const user = await User.findById(req.user.id)
            .select("friends") // Select only the friends field
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage"); // Populate friend details

        // Respond with the list of friends
        res.status(200).json(user.friends);
    } catch (error) {
        // Log the error and respond with a 500 status code
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Controller to send a friend request to another user
export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id; // Get the current user's ID
        const { id: recipientId } = req.params; // Get the recipient's ID from the request parameters

        // Prevent sending a friend request to oneself
        if (myId === recipientId) {
            return res.status(400).json({ message: "You can't send a friend request to yourself" });
        }

        // Find the recipient user by ID
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        // Check if the users are already friends
        if (recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        // Check if a friend request already exists between the two users
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ],
        });

        if (existingRequest) {
            return res.status(400).json({ message: "A friend request already exists between you and this user" });
        }

        // Create a new friend request
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        // Respond with the created friend request
        res.status(201).json(friendRequest);
    } catch (error) {
        // Log the error and respond with a 500 status code
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
