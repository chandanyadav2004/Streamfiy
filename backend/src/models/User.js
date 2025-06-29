// Import Mongoose library for MongoDB object modeling
import mongoose from "mongoose";
// Import bcrypt for password hashing
import bcrypt from "bcryptjs";

// Define the schema for users
const userSchema = new mongoose.Schema({
    // User's full name
    fullName: {
        type: String, // String type for full name
        required: true // This field is required
    },
    // User's email address
    email: {
        type: String, // String type for email
        required: true, // This field is required
        unique: true, // Email must be unique across users
    },
    // User's password
    password: {
        type: String, // String type for password
        required: true, // This field is required
        minlength: 6 // Minimum length of 6 characters
    },
    // User's bio
    bio: {
        type: String, // String type for bio
        default: "" // Default value is an empty string
    },
    // URL of the user's profile picture
    profilePic: {
        type: String, // String type for profile picture URL
        default: "" // Default value is an empty string
    },
    // User's native language
    nativeLanguage: {
        type: String, // String type for native language
        default: "" // Default value is an empty string
    },
    // User's learning language
    learningLanguage: {
        type: String, // String type for learning language
        default: "" // Default value is an empty string
    },
    // User's location
    location: {
        type: String, // String type for location
        default: "" // Default value is an empty string
    },
    // Indicates if the user has completed onboarding
    isOnboarded: {
        type: Boolean, // Boolean type for onboarding status
        default: false // Default value is false
    },
    // Array of friends (references to other User documents)
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId, // ObjectId type for referencing User model
            ref: "User ", // Reference to the User model
        }
    ]
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Pre-save hook to hash the password before saving the user
userSchema.pre("save", async function(next) {
    // Check if the password has been modified
    if (!this.isModified("password")) return next(); // If not modified, proceed to the next middleware
    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
        this.password = await bcrypt.hash(this.password, salt); // Hash the password with the salt
        next(); // Proceed to the next middleware
    } catch (error) {
        next(error); // Pass any errors to the next middleware
    }
});

// Method to compare entered password with the hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); // Compare the entered password with the stored hashed password
};

// Create the User model using the defined schema
const User = mongoose.model("User ", userSchema);

// Export the User model for use in other parts of the application
export default User;
