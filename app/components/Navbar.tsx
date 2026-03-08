import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Heart, User, PlusCircle } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-100 py-2 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">

        {/* Логотип */}
        <Link href="/" className="flex items-center">
          <Image
            src="/zomera-logo.png"
            alt="Sotaman Logo"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Поисковая строка */}
        <div className="flex-grow max-w-2xl relative">
          <input
            type="text"
            placeholder="Mahsulotlarni qidirish..."
            className="w-full pl-12 pr-4 py-3 rounded-full border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600 placeholder-gray-400 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Иконки и кнопка */}
        <div className="flex items-center gap-6">
          <button className="text-gray-700 hover:text-green-500 transition-colors">
            <Heart className="w-6 h-6 stroke-[1.5]" />
          </button>

          <button className="text-gray-700 hover:text-green-500 transition-colors">
            <User className="w-6 h-6 stroke-[1.5]" />
          </button>

          <Link
            href="/add-listing"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-sm active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            <span>E'lon qo'yish</span>
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
