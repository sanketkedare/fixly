import connectDB from "../lib/db";
import Service from "../models/Service";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const services = [
  {
    name: "Electrician",
    category: "Wiring, Faults, Fittings and more",
    description: "Expert electrical services for your home and office.",
    price: 299,
    rating: 4.6,
    reviews: 1200,
    includes: ["New Installations", "Wiring & Rewiring", "Fault Detection"],
    features: ["Verified Professional", "On-time Service", "Affordable Pricing"]
  },
  {
    name: "Plumber",
    category: "Pipes, Leaks, Installations",
    description: "Professional plumbing solutions for all your needs.",
    price: 299,
    rating: 4.5,
    reviews: 980,
    includes: ["Pipe Repair", "Tap Installation", "Drainage Cleaning"],
    features: ["Verified Professional", "On-time Service", "Affordable Pricing"]
  },
  {
    name: "Driver",
    category: "Personal Driver, Outstation, Airport Drop",
    description: "Safe and reliable driving services.",
    price: 399,
    rating: 4.7,
    reviews: 1100,
    includes: ["Local Driving", "Outstation Trips", "Airport Transfers"],
    features: ["Verified Professional", "Safe Driving", "Punctual"]
  }
];

async function seed() {
  try {
    await connectDB();
    console.log("Connected to database...");
    
    await Service.deleteMany({});
    console.log("Cleared existing services.");
    
    await Service.insertMany(services);
    console.log("Seeded services successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding services:", error);
    process.exit(1);
  }
}

seed();
