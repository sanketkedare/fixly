import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  image: { type: String },
  includes: [{ type: String }],
  features: [{ type: String }],
});

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);
