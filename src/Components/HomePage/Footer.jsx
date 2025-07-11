import React from "react";
import { Link } from "react-router-dom";
import footerlogo from "../BuilderInnerPage/Assets/footerlogo.png";
import facebook from "../BuilderInnerPage/Assets/facebook.png";
import twitter from "../BuilderInnerPage/Assets/twitter.png";
import instagram from "../BuilderInnerPage/Assets/instagram.png";
import linkedin from "../BuilderInnerPage/Assets/linkedin.png";
import phone from "../BuilderInnerPage/Assets/phone.png";
import email from "../BuilderInnerPage/Assets/email.png";
import location from "../BuilderInnerPage/Assets/location.png";
import footerbackground from "../BuilderInnerPage/Assets/Footer background.png";

const Footer = () => {
  return (
    <div className="w-full">
      {/* Call to Action Section */}
      <div className="relative bg-gray-300 w-[90%] max-w-4xl mx-auto rounded-xl p-4 sm:p-6 text-center mb-12 sm:mb-16">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Looking for more Properties?</h2>
        <p className="text-base sm:text-lg mb-3 sm:mb-4">Let's work together!</p>
        <p className="text-base sm:text-lg mb-4 sm:mb-6">Drop us a line to see how we can help</p>
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
          <button className="bg-black text-white px-4 sm:px-6 py-1 sm:py-2 rounded hover:bg-gray-800 text-sm sm:text-base">
            <a href="/contact">Contact Us</a>
          </button>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-black text-white px-4 sm:px-8">
        <div className="pt-8 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-gray-700">
          {/* Logo and Social Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 md:gap-10">
            <Link to="/" className="shrink-0">
              <img
                src={footerlogo}
                alt="Footer Logo"
                className="hover:scale-110 transition duration-300 w-[160px] sm:w-[180px] md:w-[205px] h-auto p-2 sm:p-4"
              />
            </Link>
            <div className="text-center sm:text-left">
              <p className="text-gray-400 text-sm sm:text-base">
                Welcome to Asset Build Ventures,
                a premier real 
                <span className="block"> estate and construction company</span>
                <span className="block">based in Chennai.</span>
              </p>
              <div className="flex justify-center sm:justify-start space-x-3 sm:space-x-4 mt-3 sm:mt-4">
                {[facebook, twitter, linkedin, instagram].map((icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="hover:opacity-75 transition transform hover:scale-110"
                  >
                    <img src={icon} alt="Social" className="h-5 sm:h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Links and Contact Section */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-10 md:gap-20">
            {/* Navigation Links */}
            <div className="text-center sm:text-left">
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition duration-300 ease-in-out"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/why-us"
                    className="hover:text-white transition duration-300 ease-in-out"
                  >
                    Why Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#feature-properties"
                    className="hover:text-white transition duration-300 ease-in-out"
                  >
                    Properties
                  </Link>
                </li>
                <li>
                  <Link
                    to="/testimonials"
                    className="hover:text-white transition duration-300 ease-in-out"
                  >
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition duration-300 ease-in-out"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-center sm:text-left">
              <ul className="space-y-2 text-gray-400 text-xs sm:text-sm md:text-base">
                {[
                  { icon: phone, text: "+91 8056666902" },
                  { icon: email, text: "assetbuildventures@gmail.com" },
                  {
                    icon: location,
                    text: "Ground floor, H-block, 5th street, Anna Nagar, Chennai-600040",
                  },
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start justify-center sm:justify-start gap-2 hover:text-white transition duration-300"
                  >
                    <img src={item.icon} alt="Icon" className="h-4 sm:h-5 mt-0.5" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-gray-500 text-xs sm:text-sm mt-6 pb-4">
          Copyright © 2025 Asset Build Ventures. All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;