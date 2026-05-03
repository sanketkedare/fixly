// ── Fixly Services Data Layer ─────────────────────────────────────────────────
// Single source of truth for all service data used across pages.

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;           // starting price in ₹
  rating: number;
  reviews: number;
  category: string;
  includes: string[];
  duration: string;        // e.g. "2-3 hours"
  image: string;           // path in /public
  emoji: string;           // fallback icon
  gradient: string;        // tailwind gradient for desktop cards
  tags?: string[];
}

export const SERVICES: Service[] = [
  {
    id: "electrician",
    name: "Electrician",
    category: "Electrical",
    description: "Wiring, Faults, Fittings and more",
    price: 299,
    rating: 4.6,
    reviews: 1200,
    duration: "2-3 hours",
    image: "/services/electrician.png",
    emoji: "⚡",
    gradient: "from-yellow-400 to-amber-500",
    includes: [
      "New Installations",
      "Wiring & Rewiring",
      "Fault Detection & Repair",
      "Switch & Socket Replacement",
      "MCB & Fuse Box Service",
    ],
    tags: ["Most Booked"],
  },
  {
    id: "plumber",
    name: "Plumber",
    category: "Plumbing",
    description: "Pipes, Leaks, Installations and more",
    price: 299,
    rating: 4.5,
    reviews: 980,
    duration: "1-2 hours",
    image: "/services/plumber.png",
    emoji: "🔧",
    gradient: "from-blue-400 to-blue-600",
    includes: [
      "Leak Detection & Repair",
      "Pipe Installation",
      "Tap & Faucet Replacement",
      "Bathroom Fitting",
      "Drainage Cleaning",
    ],
  },
  {
    id: "driver",
    name: "Driver",
    category: "Transport",
    description: "Personal Driver, Outstation, Airport Drop",
    price: 399,
    rating: 4.7,
    reviews: 1100,
    duration: "As needed",
    image: "/services/driver.png",
    emoji: "🚗",
    gradient: "from-emerald-400 to-green-600",
    includes: [
      "City Rides",
      "Outstation Trips",
      "Airport Pick & Drop",
      "Corporate Chauffeur",
      "Night Driving Available",
    ],
  },
  {
    id: "cook",
    name: "Cook",
    category: "Home & Kitchen",
    description: "Daily Cooking, Meal Prep, Special Meals",
    price: 299,
    rating: 4.6,
    reviews: 850,
    duration: "2-4 hours",
    image: "/services/cook.png",
    emoji: "👨‍🍳",
    gradient: "from-orange-400 to-orange-600",
    includes: [
      "Daily Meal Preparation",
      "Special Occasion Cooking",
      "Meal Prep & Planning",
      "Kitchen Cleaning",
      "Grocery List Assistance",
    ],
    tags: ["Trending"],
  },
  {
    id: "carpenter",
    name: "Carpenter",
    category: "Furniture",
    description: "Furniture, Repairs, Woodwork",
    price: 299,
    rating: 4.4,
    reviews: 620,
    duration: "3-5 hours",
    image: "/services/carpenter.png",
    emoji: "🪚",
    gradient: "from-amber-500 to-yellow-600",
    includes: [
      "Furniture Assembly",
      "Wood Repair & Polishing",
      "Cabinet Installation",
      "Door & Window Fitting",
      "Custom Woodwork",
    ],
  },
  {
    id: "painter",
    name: "Painter",
    category: "Home Improvement",
    description: "Interior & Exterior Painting, Waterproofing",
    price: 499,
    rating: 4.5,
    reviews: 730,
    duration: "1-2 days",
    image: "/services/painter.png",
    emoji: "🎨",
    gradient: "from-rose-400 to-red-600",
    includes: [
      "Interior Wall Painting",
      "Exterior Painting",
      "Waterproofing",
      "Texture & Design Painting",
      "Wood & Metal Painting",
    ],
  },
  {
    id: "ac-repair",
    name: "AC Repair",
    category: "Appliances",
    description: "AC Service, Gas Refill, Installation",
    price: 399,
    rating: 4.8,
    reviews: 1500,
    duration: "1-3 hours",
    image: "/services/ac-repair.png",
    emoji: "❄️",
    gradient: "from-cyan-400 to-sky-600",
    includes: [
      "Deep Cleaning & Service",
      "Gas Refill",
      "AC Installation",
      "Cooling Issue Fix",
      "Thermostat Repair",
    ],
    tags: ["Most Booked"],
  },
  {
    id: "cleaner",
    name: "Cleaner",
    category: "Home Cleaning",
    description: "Deep Cleaning, Sofa Cleaning, Kitchen Clean",
    price: 499,
    rating: 4.7,
    reviews: 2100,
    duration: "3-6 hours",
    image: "/services/cleaner.png",
    emoji: "🧹",
    gradient: "from-teal-400 to-teal-600",
    includes: [
      "Full Home Deep Cleaning",
      "Kitchen & Bathroom Scrub",
      "Sofa & Carpet Cleaning",
      "Window & Glass Cleaning",
      "Post-Move Cleaning",
    ],
    tags: ["Trending"],
  },
];

export const getServiceById = (id: string): Service | undefined =>
  SERVICES.find((s) => s.id === id);

// Dummy bookings data
export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  address: string;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
  price: number;
  image: string;
  emoji: string;
}

export const DUMMY_BOOKINGS: Booking[] = [
  {
    id: "b1",
    serviceId: "electrician",
    serviceName: "Electrician",
    date: "25 May 2024",
    time: "10:00 AM",
    address: "Sector 21, Noida",
    status: "Confirmed",
    price: 329,
    image: "/services/electrician.png",
    emoji: "⚡",
  },
  {
    id: "b2",
    serviceId: "plumber",
    serviceName: "Plumber",
    date: "28 May 2024",
    time: "11:00 AM",
    address: "Sector 21, Noida",
    status: "Pending",
    price: 329,
    image: "/services/plumber.png",
    emoji: "🔧",
  },
  {
    id: "b3",
    serviceId: "cook",
    serviceName: "Cook",
    date: "30 May 2024",
    time: "01:00 PM",
    address: "Sector 21, Noida",
    status: "Confirmed",
    price: 299,
    image: "/services/cook.png",
    emoji: "👨‍🍳",
  },
  {
    id: "b4",
    serviceId: "cleaner",
    serviceName: "Cleaner",
    date: "10 Apr 2024",
    time: "09:00 AM",
    address: "Sector 21, Noida",
    status: "Completed",
    price: 529,
    image: "/services/cleaner.png",
    emoji: "🧹",
  },
  {
    id: "b5",
    serviceId: "ac-repair",
    serviceName: "AC Repair",
    date: "02 Apr 2024",
    time: "02:00 PM",
    address: "Sector 21, Noida",
    status: "Completed",
    price: 429,
    image: "/services/ac-repair.png",
    emoji: "❄️",
  },
];

// Dummy chat threads
export interface ChatThread {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  emoji: string;
  online: boolean;
}

export const DUMMY_CHATS: ChatThread[] = [
  { id: "c1", name: "Ravi Kumar",    role: "Electrician",  lastMessage: "I'll arrive by 10 AM tomorrow.",      time: "2m",   unread: 2, emoji: "⚡", online: true  },
  { id: "c2", name: "Suresh Mehta",  role: "Plumber",      lastMessage: "The pipe has been fixed. All good!",  time: "1hr",  unread: 0, emoji: "🔧", online: false },
  { id: "c3", name: "Anjali Singh",  role: "Cook",         lastMessage: "What cuisine do you prefer?",         time: "3hr",  unread: 1, emoji: "👨‍🍳", online: true  },
  { id: "c4", name: "Deepak Sharma", role: "Carpenter",    lastMessage: "The cabinet is ready for pickup.",    time: "1d",   unread: 0, emoji: "🪚", online: false },
];
