import React, { useState } from "react";

const navigationItems = [
  { name: "Overview", icon: "📊", active: true },
  { name: "My CAO Calculator", icon: "🧮" },
  { name: "My Goals", icon: "🎯" },
  { name: "My CV", icon: "📄" },
  { name: "My Self Assessment", icon: "🧠" },
  { name: "My Study", icon: "📚" },
  { name: "My Choices", icon: "🔀" },
  { name: "My Educational Guidance", icon: "🎓" },
  { name: "My Guidance Report", icon: "📊" },
  { name: "My Work Diary", icon: "💼" },
];

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 flex z-40 lg:hidden ${
          isMobileMenuOpen ? "" : "hidden"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          aria-hidden="true"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <span className="text-white text-2xl">&times;</span>
            </button>
          </div>
          <nav className="mt-5 flex-shrink-0 h-full divide-y divide-gray-200 overflow-y-auto">
            <div className="px-2 space-y-1">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    item.active
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-4 text-xl">{item.icon}</span>
                  {item.name}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:block lg:col-span-2">
        <div className="space-y-1 sticky top-24">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href="#"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                item.active
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              {item.name}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
