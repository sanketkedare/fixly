import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firebaseId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["user", "admin", "service_provider"], 
    default: "user" 
  },
  mobile: { type: String },
  isProfileComplete: { type: Boolean, default: false },
  // Provider-specific fields (optional initially)
  bio: { type: String },
  category: { type: String },
  address: { type: String },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
