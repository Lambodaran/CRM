import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa"; // Import location icon
import abvlogo from "../HomePage/Assets/logo.png";

export default function BuilderNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold flex items-center">
          <motion.img
            src={abvlogo}
            alt="ABV Logo"
            className="h-10 mr-2  text-white rounded"
            whileHover={{ scale: 1.1 }}
          />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-black">
          {["Apartments", "Ongoing Projects", "Individual House", "Contact Us"].map(
            (item, index) => (
              <motion.li
                key={index}
                whileHover={{ scale: 1.1, color: "#EA580C" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <a href="#">{item}</a>
              </motion.li>
            )
          )}
        </ul>

        {/* Location and Login */}
        {/* <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <FaMapMarkerAlt className="text-black" />
            <span className="text-black">Chennai</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Login
          </motion.button>
        </div> */}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden flex flex-col bg-gray-200 mt-2 p-4 space-y-3 text-center text-black"
          >
            {["Apartments", "Ongoing Projects", "Individual House", "Contact Us"].map(
              (item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.1, color: "#EA580C" }}
                >
                  <a href="#">{item}</a>
                </motion.li>
              )
            )}
            <li>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 w-full"
              >
                Login
              </motion.button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}