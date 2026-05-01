import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import Booking from "@/models/Booking";

const services = [
  {
    name: "Master Electrician",
    category: "Electrician",
    description: "Complete home wiring, fuse box repairs, and appliance installation.",
    price: 499,
    rating: 4.9,
    reviews: 2400,
    includes: ["Fuse Box Repair", "Full Wiring", "Appliance Setup"],
    features: ["Certified", "24/7 Emergency", "Insured"]
  },
  {
    name: "Emergency Plumber",
    category: "Plumber",
    description: "Fixing leaks, clogged drains, and pipe bursts immediately.",
    price: 399,
    rating: 4.8,
    reviews: 1800,
    includes: ["Leak Fix", "Drain Cleaning", "Pipe Burst Repair"],
    features: ["Fast Response", "Expert", "Guaranteed Work"]
  },
  {
    name: "Luxury Car Driver",
    category: "Driver",
    description: "Professional drivers for high-end vehicles and long trips.",
    price: 899,
    rating: 4.9,
    reviews: 500,
    includes: ["Interstate Travel", "Airport VIP Transfer", "Daily Commute"],
    features: ["Uniformed", "Experienced", "Safe"]
  },
  {
    name: "Professional Home Chef",
    category: "Cook",
    description: "Customized healthy meals and party catering at your home.",
    price: 1200,
    rating: 4.7,
    reviews: 320,
    includes: ["Dietary Planning", "Grocery Shopping", "Kitchen Cleanup"],
    features: ["Hygienic", "Gourmet Skills", "Reliable"]
  },
  {
    name: "Furniture Specialist",
    category: "Carpenter",
    description: "Custom furniture creation and high-end woodwork repairs.",
    price: 599,
    rating: 4.6,
    reviews: 890,
    includes: ["Custom Shelving", "Chair Repair", "Polishing"],
    features: ["Artisan", "Quality Materials", "Precise"]
  },
  {
    name: "HVAC Expert",
    category: "AC Repair",
    description: "Servicing all brands of ACs and heating systems.",
    price: 450,
    rating: 4.5,
    reviews: 1500,
    includes: ["Gas Refill", "Deep Cleaning", "Installation"],
    features: ["Authorized", "Warranty", "Genuine Parts"]
  },
  {
    name: "Deep Cleaning Service",
    category: "Cleaner",
    description: "Intense cleaning for homes, offices, and move-ins.",
    price: 1500,
    rating: 4.8,
    reviews: 2100,
    includes: ["Bathroom Sanitization", "Floor Scrubbing", "Glass Cleaning"],
    features: ["Eco-friendly", "Trained Staff", "Comprehensive"]
  },
  {
    name: "Exterior House Painter",
    category: "Painter",
    description: "Professional painting services for exterior and interior walls.",
    price: 2500,
    rating: 4.7,
    reviews: 430,
    includes: ["Wall Putty", "Texture Paint", "Waterproofing"],
    features: ["Color Consultation", "Mess-free", "Fast Completion"]
  }
];

export async function GET() {
  try {
    await connectDB();
    
    // Clear existing data
    await Service.deleteMany({});
    await Booking.deleteMany({});
    
    // Insert Services
    const createdServices = await Service.insertMany(services);
    
    // Insert some Dummy Bookings
    const dummyBookings = [
      {
        userId: "dummy_user_1",
        serviceId: createdServices[0]._id,
        date: "2024-05-25",
        time: "10:00 AM - 12:00 PM",
        address: "Sector 21, Noida, UP",
        instructions: "Please bring a tall ladder.",
        status: "Confirmed",
        totalPrice: 499
      },
      {
        userId: "dummy_user_1",
        serviceId: createdServices[1]._id,
        date: "2024-05-28",
        time: "11:00 AM - 01:00 PM",
        address: "Sector 21, Noida, UP",
        status: "Pending",
        totalPrice: 399
      }
    ];
    
    await Booking.insertMany(dummyBookings);
    
    return NextResponse.json({ 
      message: "Database seeded with 8 services and 2 bookings successfully!",
      servicesCount: createdServices.length,
      bookingsCount: dummyBookings.length
    });
  } catch (error) {
    console.error("Seed Error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
