"use client";

import { useState } from "react";
import { HiSearch, HiDotsVertical, HiCheck, HiChat } from "react-icons/hi";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";

const chats = [
  { id: 1, name: "Master Electrician", lastMsg: "I'll be there at 10 AM tomorrow.", time: "2m ago", unread: 2, online: true, avatar: "⚡" },
  { id: 2, name: "Emergency Plumber", lastMsg: "The leak is fixed. Let me know if you need anything else.", time: "1h ago", unread: 0, online: false, avatar: "🔧" },
  { id: 3, name: "Deep Cleaning Team", lastMsg: "Are you available on Saturday?", time: "3h ago", unread: 0, online: true, avatar: "🧹" },
  { id: 4, name: "Support Team", lastMsg: "How was your experience with the driver?", time: "Yesterday", unread: 0, online: false, avatar: "🎧" },
];

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(chats[0]);

  return (
    <div className="flex h-screen bg-gray-50/30 overflow-hidden">
      {/* Chat List */}
      <div className={cn(
        "w-full lg:w-96 bg-white border-r border-gray-100 flex flex-col h-full transition-all",
        "lg:translate-x-0" // Always visible on desktop
      )}>
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-3xl font-black text-gray-900 mb-6">Messages</h1>
          <div className="relative">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto pb-32 lg:pb-0">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={cn(
                "p-4 flex items-center gap-4 cursor-pointer transition-all border-l-4",
                activeChat?.id === chat.id 
                  ? "bg-blue-50 border-blue-600 shadow-sm" 
                  : "bg-white border-transparent hover:bg-gray-50"
              )}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl shadow-sm">
                  {chat.avatar}
                </div>
                {chat.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-black text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{chat.time}</span>
                </div>
                <p className={cn(
                  "text-sm truncate",
                  chat.unread > 0 ? "text-gray-900 font-bold" : "text-gray-500"
                )}>
                  {chat.lastMsg}
                </p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="hidden lg:flex flex-grow flex-col h-full bg-white relative">
        {activeChat ? (
          <>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl border border-gray-100">
                  {activeChat.avatar}
                </div>
                <div>
                  <h2 className="font-black text-gray-900 leading-none">{activeChat.name}</h2>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Active Now</span>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <HiDotsVertical size={24} />
              </button>
            </div>

            <div className="flex-grow p-8 flex flex-col gap-6 overflow-y-auto">
              <div className="flex justify-center my-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-4 py-1.5 rounded-full">Today</span>
              </div>

              <div className="flex flex-col gap-2 max-w-[70%]">
                <div className="bg-gray-100 p-4 rounded-3xl rounded-tl-none text-sm font-bold text-gray-800">
                  Hi! I'm checking if you're still coming for the electric repair.
                </div>
                <span className="text-[10px] font-bold text-gray-400 ml-2">10:05 AM</span>
              </div>

              <div className="flex flex-col gap-2 max-w-[70%] ml-auto items-end">
                <div className="bg-blue-600 p-4 rounded-3xl rounded-tr-none text-sm font-bold text-white shadow-lg shadow-blue-600/20">
                  {activeChat.lastMsg}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 mr-2">
                  <span>10:30 AM</span>
                  <HiCheck />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-[2rem] border border-gray-100 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
                <input 
                  type="text" 
                  placeholder="Type your message here..." 
                  className="flex-grow bg-transparent border-none focus:ring-0 py-3 px-4 font-bold text-sm"
                />
                <button className="bg-blue-600 text-white px-8 py-3 rounded-[1.5rem] font-black text-sm hover:scale-105 transition-all shadow-lg shadow-blue-600/30">
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
              <HiChat size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Select a Conversation</h2>
            <p className="text-gray-400 font-bold mt-2 max-w-sm">
              Choose a contact from the left to start chatting about your bookings and services.
            </p>
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
}
