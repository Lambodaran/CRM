import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import NavLogo from "../HomePage/Assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const BuildingHighlights = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleCardClick = () => {
    navigate("/builder", { replace: true });
  };

  const navItems = [
    { name: "About Us", path: "/about" },
    { name: "Why Choose Us", path: "/why-us" },
    { name: "Contact Us", path: "/contact" }
  ];

  return (
    <div className="relative w-full min-h-screen">
      {/* Navbar - Updated to match BuilderNavbar */}
      <nav className="bg-white p-4 shadow-md top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          {/* Logo with motion */}
          <motion.div 
            className="text-xl font-bold flex items-center md:block"
            whileHover={{ scale: 1.05 }}
          >
            <motion.img
              src={NavLogo}
              alt="ABV Logo"
              className="h-10 mr-2 text-white rounded"
              whileHover={{ scale: 1.1 }}
            />
          </motion.div>

          {/* Centered Desktop Menu */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex space-x-6 text-gray-800 font-medium">
              {navItems.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.1, color: "#EA580C" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link 
                    to={item.path} 
                    className="hover:text-orange-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Empty div to balance the flex layout */}
          <div className="hidden md:block invisible">
            <motion.img
              src={NavLogo}
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
                    <Link 
                      to={item.path} 
                      className="block py-2 text-gray-800 hover:text-orange-600"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Static Banner with Blue Gradient */}
      <div className="bg-gradient-to-r from-[#E6F0FA] to-[#FFFFFF] min-h-[40vh] flex items-center justify-center text-center px-4">
        <div>
          <motion.h1 
            className="font-bold text-[32px] sm:text-[48px] md:text-[64px] leading-[120%] text-black mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Explore Our Properties
          </motion.h1>
          <motion.p
            className="font-light text-[16px] sm:text-[20px] md:text-[24px] leading-[140%] text-black max-w-xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover properties that blend luxury, comfort, and modern living tailored to your
            lifestyle.
          </motion.p>
        </div>
      </div>

      {/* Bottom Floating Card - Uncomment if needed */}
      {/* <motion.div 
        className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[600px] md:w-[900px] bg-[#EDEAEA] rounded-lg p-4 sm:p-6 shadow-lg text-center z-30 cursor-pointer"
        onClick={handleCardClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <h1 className="font-bold text-[20px] sm:text-[28px] md:text-[36px] leading-[110%] tracking-tight text-gray-800">
          Explore Our Building Designs
        </h1>
        <p className="font-light text-[14px] sm:text-[18px] md:text-[24px] leading-[130%] text-gray-700 mt-2">
          Discover Our Modern Buildings
        </p>
      </motion.div> */}
    </div>
  );
};

export default BuildingHighlights;