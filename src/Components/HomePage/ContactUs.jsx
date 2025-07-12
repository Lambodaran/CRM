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

const ContactUs = () => {
  return (
    <>
      <div className="max-w-6xl mx-auto p-4 font-poppins">
        {/* Breadcrumb */}
<nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <svg
                    className="w-3 h-3 mr-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Home
                </a>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    Contact Us
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        {/* Main heading */}
        <h1 className="text-3xl font-bold mb-6">Get in Touch</h1>

        {/* Description paragraph */}
        <p className="text-gray-700 mb-8 max-w-2xl">
          Having Questions? Tell us about your Business, Our experts will check
          all the aspects and call you back to explain how RealEstateIndia.com
          would help you to get quotes for your Business.
        </p>

        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left column - Contact info */}
          <div className="lg:w-1/2">
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2">RealEstateIndia.com</h2>
              <p className="text-gray-700 mb-2">Co Weblink.in Pvt. Ltd.</p>

              <address className="text-gray-700 not-italic">
                33 & 33A, Rama Road, Industrial Area, Near Kirit Nagar Metro
                Station,
                <br />
                New Delhi, Delhi, India, Pin - 110015
              </address>
            </div>

            <div className=" mb-4 border-b"></div>

            <div className="mb-4">
              <p className="text-gray-700 font-semibold mb-1">
                For any assistance call us at
              </p>
              <p className="text-gray-700 mb-1">
                (9:30 AM to 6:00 PM | ST, Mon to Sat.)
              </p>
              <p className="text-gray-700">India - 191-8929175327</p>
            </div>
           
          </div>

          {/* Right column - Map info */}
          <div className="lg:w-1/2">
            {/* Google Maps Embed */}
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
              <iframe
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31108.758827434904!2d80.2365!3d13.0701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5260e68aebd451%3A0x8cfb47d60ed6225e!2sKoyambedu%2C%20Chennai%2C%20Tamil%20Nadu%20600072%2C%20India!5e0!3m2!1sen!2sus!4v1712112549876!5m2!1sen!2sus"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full mt-10">
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
                   <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-10 md:gap-18">
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
                         {/* <li>
                           <Link
                             to="/#feature-properties"
                             className="hover:text-white transition duration-300 ease-in-out"
                           >
                             Properties
                           </Link>
                         </li> */}
                         {/* <li>
                           <Link
                             to="/testimonials"
                             className="hover:text-white transition duration-300 ease-in-out"
                           >
                             Testimonials
                           </Link>
                         </li> */}
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
      {/* Footer */}
    </>
  );
};

export default ContactUs;