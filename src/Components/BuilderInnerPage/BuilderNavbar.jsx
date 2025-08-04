import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import abvlogo from "../HomePage/Assets/logo.png";

export default function BuilderNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "About Us", path: "/about" },
    { name: "Why Choose Us", path: "/why-us" },
    { name: "Contact Us", path: "/contact" }
  ];

  return (
    <nav className="bg-white p-4 shadow-md top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Logo - Hidden on mobile to center items better */}
        <motion.a 
          href="/" 
          className="text-xl font-bold flex items-center md:block"
          whileHover={{ scale: 1.05 }}
        >
          <motion.img
            src={abvlogo}
            alt="ABV Logo"
            className="h-10 mr-2 text-white rounded "
            whileHover={{ scale: 1.1 }}
          />
        </motion.a>

        {/* Centered Desktop Menu */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
          <ul className="flex space-x-6 text-gray-800 font-medium">
            {navItems.map((item, index) => (
              <motion.li
                key={index}
                whileHover={{ scale: 1.1, color: "#EA580C" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <a href={item.path} className="hover:text-orange-600 transition-colors">
                  {item.name}
                </a>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Empty div to balance the flex layout */}
        <div className="hidden md:block invisible">
          <motion.img
            src={abvlogo}
            alt="ABV Logo"
            className="h-10 mr-2 text-white rounded"
          />
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-gray-800 focus:outline-none text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? "✖" : "☰"}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-50 overflow-hidden"
          >
            <ul className="flex flex-col p-4 space-y-4 items-center">
              {navItems.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.02, color: "#EA580C" }}
                  className="border-b border-gray-200 pb-2 w-full text-center"
                >
                  <a 
                    href={item.path} 
                    className="block py-2 text-gray-800 hover:text-orange-600"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}