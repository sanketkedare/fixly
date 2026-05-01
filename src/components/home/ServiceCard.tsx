"use client";

import Image from "next/image";
import { HiStar, HiChevronRight } from "react-icons/hi";
import Link from "next/link";

interface ServiceCardProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: number;
  image?: string;
}

export default function ServiceCard({ id, name, category, rating, reviews, price, image }: ServiceCardProps) {
  return (
    <Link href={`/services/${id}`} className="flex items-center gap-4 p-4 md:p-6 bg-white rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group">
      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-blue-200">
             <HiStar size={32} />
          </div>
        )}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-black text-gray-900 text-base md:text-lg group-hover:text-blue-600 transition-colors">{name}</h3>
            <p className="text-xs md:text-sm text-gray-500 mb-2 line-clamp-1">{category}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs md:text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded-lg">
            <HiStar className="text-yellow-400" />
            <span className="font-black">{rating}</span>
            <span className="text-gray-400">({reviews}+)</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-black leading-none">Starting from</span>
            <span className="font-black text-blue-600 text-sm md:text-base">₹{price}</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        <HiChevronRight size={24} />
      </div>
    </Link>
  );
}
