"use client";

import { HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineCurrencyDollar, HiOutlineTrendingUp } from "react-icons/hi";

export default function AdminDashboard() {
  const stats = [
    { name: "Total Users", value: "1,284", icon: HiOutlineUserGroup, change: "+12%", color: "blue" },
    { name: "Active Providers", value: "482", icon: HiOutlineShieldCheck, change: "+5%", color: "purple" },
    { name: "Monthly Revenue", value: "$12,450", icon: HiOutlineCurrencyDollar, change: "+18%", color: "green" },
    { name: "Growth Rate", value: "24.5%", icon: HiOutlineTrendingUp, change: "+2%", color: "orange" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">System Overview</h2>
        <p className="text-gray-500 font-bold">Monitor your platform's growth and health</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all group">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                <stat.icon size={28} />
              </div>
              <span className="text-green-500 text-sm font-black bg-green-50 px-2 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">{stat.name}</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder / Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-gray-900">Platform Activity</h3>
            <select className="bg-gray-50 border-none rounded-xl px-4 py-2 font-bold text-sm text-gray-600 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center">
            <p className="text-gray-400 font-bold">Activity Chart Placeholder</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-6">New Providers</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-black text-gray-900">Provider Name {i}</p>
                  <p className="text-xs font-bold text-gray-400">Electrician • NY</p>
                </div>
                <button className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest">Verify</button>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 bg-gray-50 rounded-2xl font-black text-gray-600 hover:bg-gray-100 transition-colors">
            View All Requests
          </button>
        </div>
      </div>
    </div>
  );
}
