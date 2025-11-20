import React from "react";
import { HiUserCircle, HiMenu } from "react-icons/hi";

export default function Navbar({ onMenuClick, user }) {
  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm flex items-center h-16 px-4 md:px-8 justify-between">
      <button
        className="md:hidden p-2 mr-2 text-2xl text-indigo-600"
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
      >
        <HiMenu />
      </button>
      <div className="font-semibold text-xl text-indigo-700 tracking-wide">
        Quiz Management System
      </div>
      <div className="flex items-center gap-3">
        <HiUserCircle className="text-3xl text-indigo-600" />
        {user && (
          <span className="hidden sm:inline text-indigo-800 font-medium">
            {user.name} ({user.role})
          </span>
        )}
      </div>
    </header>
  );
}
