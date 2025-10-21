import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  }
}, {
  timestamps: true, // Add createdAt and updatedAt
});

// Note: username index is automatically created by unique: true

const User = mongoose.model("User", UserSchema);

export default User;
