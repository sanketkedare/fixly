"use client";

import { useState, useEffect } from "react";
import { HiOutlineSearch, HiOutlineFilter, HiOutlineDotsVertical, HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "service_provider" | "admin";
  mobile?: string;
  isProfileComplete?: boolean;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users from API (placeholder for now, will connect to real endpoint)
  useEffect(() => {
    // In a production app, we would fetch from /api/admin/users
    // For now, I'll provide a high-fidelity mockup that we can connect once the endpoint is ready
    setLoading(false);
  }, []);

  const mockUsers: User[] = [
    { _id: "1", name: "Sanket Kedare", email: "sanket@example.com", role: "admin", mobile: "9876543210" },
    { _id: "2", name: "John Doe", email: "john@example.com", role: "service_provider", mobile: "1234567890", isProfileComplete: true },
    { _id: "3", name: "Jane Smith", email: "jane@example.com", role: "user", mobile: "5556667777" },
    { _id: "4", name: "Mike Wilson", email: "mike@example.com", role: "service_provider", mobile: "1112223333", isProfileComplete: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">User Management</h2>
          <p className="text-gray-500 font-bold">Manage all platform participants and permissions</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-all font-bold text-sm w-64 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-white border border-gray-100 p-3 rounded-2xl text-gray-500 hover:text-blue-600 transition-all shadow-sm">
            <HiOutlineFilter size={24} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Contact</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-black text-xl border-2 border-white shadow-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-gray-900">{user.name}</p>
                        <p className="text-xs font-bold text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest",
                      user.role === "admin" ? "bg-red-50 text-red-600" :
                      user.role === "service_provider" ? "bg-purple-50 text-purple-600" :
                      "bg-blue-50 text-blue-600"
                    )}>
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-600">
                    {user.mobile || "N/A"}
                  </td>
                  <td className="px-8 py-6">
                    {user.role === "service_provider" ? (
                      <span className={cn(
                        "flex items-center gap-2 text-xs font-black uppercase tracking-widest",
                        user.isProfileComplete ? "text-green-500" : "text-orange-500"
                      )}>
                        <div className={cn("w-2 h-2 rounded-full", user.isProfileComplete ? "bg-green-500" : "bg-orange-500")} />
                        {user.isProfileComplete ? "Complete" : "Pending"}
                      </span>
                    ) : (
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Active</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors">
                        <HiOutlinePencil size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-colors">
                        <HiOutlineTrash size={18} />
                      </button>
                      <button className="p-2 hover:bg-gray-100 text-gray-500 rounded-xl transition-colors">
                        <HiOutlineDotsVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-500">Showing 1 to 10 of 1,284 users</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-400 hover:text-blue-600 transition-all shadow-sm">Previous</button>
            <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:text-blue-600 transition-all shadow-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for class names
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
