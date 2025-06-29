// Import User and FriendRequest models
import User from "../models/User.js"; // Import the User model for user-related database operations
import FriendRequest from "../models/FriendRequest.js"; // Import the FriendRequest model for managing friend requests

// Controller to get recommended users for the current user
export async function getRecommendUsers(req, res) {
    try {
        const currentUserId = req.user.id; // Get the current user's ID from the request
        const currentUser   = req.user; // Get the current user object

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
                { sender: myId, recipient: recipientId }, // Check if the current user sent a request to the recipient
                { sender: recipientId, recipient: myId }, // Check if the recipient sent a request to the current user
            ],
        });

        if (existingRequest) {
            return res.status(400).json({ message: "A friend request already exists between you and this user" });
        }

        // Create a new friend request
        const friendRequest = await FriendRequest.create({
            sender: myId, // Set the sender to the current user's ID
            recipient: recipientId, // Set the recipient to the provided ID
        });

        // Respond with the created friend request
        res.status(201).json(friendRequest);
    } catch (error) {
        // Log the error and respond with a 500 status code
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Controller to accept a friend request
export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params; // Get the friend request ID from the request parameters

        // Find the friend request by ID
        const friendRequest = await FriendRequest.findById(requestId);
        
        // Check if the friend request exists
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        // Verify the current user is the recipient of the friend request
        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        // Update the status of the friend request to accepted
        friendRequest.status = "accepted";
        await friendRequest.save(); // Save the updated friend request

        // Add each user to the other's friends array
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }, // Add the recipient to the sender's friends
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }, // Add the sender to the recipient's friends
        });

        // Respond with a success message
        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        // Log the error and respond with a 500 status code
        console.error("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Controller to get incoming and accepted friend requests
export async function getFriendRequests(req, res) {
    try {
        // Find incoming friend requests that are pending
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id, // Filter by the current user's ID
            status: "pending", // Only include pending requests
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage"); // Populate sender details

        // Find accepted friend requests
        const acceptedReqs = await FriendRequest.find({
            recipient: req.user.id, // Filter by the current user's ID
            status: "accepted", // Only include accepted requests
        }).populate("recipient", "fullName profilePic"); // Populate recipient details

        // Respond with both incoming and accepted requests
        res.status(200).json({ incomingReqs, acceptedReqs });
    } catch (error) {
        // Log the error and respond with a 500 status code
        console.error("Error in getFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }  
}

// Controller to get outgoing friend requests
export async function getOutgoingReqs(req, res) {
    try {
        // Find outgoing friend requests that are pending
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id, // Filter by the current user's ID
            status: "pending", // Only include pending requests
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage"); // Populate recipient details

        // Respond with the list of outgoing requests
        res.status(200).json(outgoingRequests);
    } catch (error) {
        // Log the error and respond with a 500 status code
        console.error("Error in getOutgoingReqs controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    } 
}
