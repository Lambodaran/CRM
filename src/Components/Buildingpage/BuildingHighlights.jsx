import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa"; // Import location icon
import NavLogo from "../HomePage/Assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

const BuildingHighlights = () => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/builder", { replace: true });
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Navbar */}
      <nav className="bg-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="text-xl font-bold flex items-center">
            <img
              src={NavLogo}
              alt="ABV Logo"
              className="h-10 mr-2  text-white  rounded"
            />
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 text-black">
            {["Apartments", "Ongoing Projects", "Individual House", "Contact Us"].map(
              (item, index) => (
                <li key={index}>
                  <a href="#" className="text-black hover:text-[#EA580C]">
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>

          {/* Location and Login */}
          {/* <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <FaMapMarkerAlt className="text-black" />
              <span className="text-black">Chennai</span>
            </div>
            <Link to="/login">
              <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
                Login
              </button>
            </Link>
          </div> */}

          {/* Mobile Menu Button (Simplified - no animation for brevity) */}
          <button className="md:hidden text-black focus:outline-none">
            {/* Add mobile menu logic if needed */}
          </button>
        </div>
      </nav>

      {/* Static Banner with Blue Gradient */}
      <div className="bg-gradient-to-r from-[#E6F0FA] to-[#FFFFFF] min-h-[40vh] flex items-center justify-center text-center px-4">
        <div>
          <h1 className="font-bold text-[32px] sm:text-[48px] md:text-[64px] leading-[120%] text-black mb-2">
            Explore Our Properties
          </h1>
          <p className="font-light text-[16px] sm:text-[20px] md:text-[24px] leading-[140%] text-black max-w-xl mx-auto">
            Discover properties that blend luxury, comfort, and modern living tailored to your
            lifestyle.
          </p>
        </div>
      </div>

      {/* Bottom Floating Card */}
      {/* <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[600px] md:w-[900px] bg-[#EDEAEA] rounded-lg p-4 sm:p-6 shadow-lg text-center z-30 cursor-pointer" onClick={handleCardClick}>
        <h1 className="font-bold text-[20px] sm:text-[28px] md:text-[36px] leading-[110%] tracking-tight text-gray-800">
          Explore Our Building Designs
        </h1>
        <p className="font-light text-[14px] sm:text-[18px] md:text-[24px] leading-[130%] text-gray-700 mt-2">
          Discover Our Modern Buildings
        </p>
      </div> */}
    </div>
  );
};

export default BuildingHighlights;