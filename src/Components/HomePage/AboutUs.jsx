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

const AboutUs = () => {
  return (
    <div className="bg-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    About Us
                  </span>
                </div>
              </li>
            </ol>
          </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">About Us</h1>

            <p className="text-gray-700 mb-6 leading-relaxed">
              Gone are the days when people used to deal property matters on the
              basis of "mouth to mouth publicity" or nearby dealers.
              Globalization and fast lifestyle has encouraged the real estate
              industry to step in E-World. Now active partakers of real estate
              world are eagerly seeking the right options to establish
              themselves in E-Real Estate World. RealestateIndia.Com is a
              solution to all what bothers to people who all are dealing in
              properties or people who all are searching property. As one of the
              leading property portals, RealestateIndia has tuned itself with
              pulse of real estate sector. Moving ahead with esteemed registered
              users and regularly visited by players of real estate industry,
              RealestateIndia.Com has become the pivot for real-estate sector.
            </p>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our mission is to touch the horizon where our capabilities may
                successfully meet with the requirements of our clients, that too
                with ultimate transparency and cost-effectiveness.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Know us</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We are serving this industry since 1997 by providing an online
                platform acting as a search engine or advertising agency. With
                our vast experience in the same field, we have emerged as the
                solitary solution provider. With such an immense exposure in the
                said domain, we completely understand the needs of our consumers
                and strive hard to meet the same.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Being substantial in the realm of Real estate, we have stridden
                a long way in a short span of time. With our resolution to raise
                high, we beat the all hurdles and stood against all odds. This
                marvelous achievement has been the upshot of the trust, which
                our clients have shown over the years.
              </p>
              <p className="text-gray-700 leading-relaxed">
                RealestateIndia.Com is owned and managed by Weblink.in Pvt. Ltd,
                a leading brand in web designing services and e-commerce
                solutions. Weblink.in Pvt. Ltd. is counted for its expertise in
                web solutions and its top ranking business portals. Our
                invincible expertise and rich experience has raised our spirit
                to reach ahead from our client's expectation. Commercialize
                success rate of other portals managed by Weblink is a live
                paradigm of our work excellence.
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:w-1/2 space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To sow the seeds of par-excellence services with customer
                centric approach and reap the trust of worldwide clients.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Core Values
              </h2>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Transpicuous Work Culture
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Our words and actions always go hand-in-hand. We strongly
                  preserve transparency to be correct ethically, legally and
                  socially as well.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Result-Operation
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  By setting clear goals, fixing the priorities, organizing the
                  resources-and rigorously monitoring the growth of project.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Fast Facts
              </h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-2 leading-relaxed">
                <li>Incepted in 1997</li>
                <li>
                  Recognized as Single platform for versatile needs of Real
                  estate World.
                </li>
                <li>
                  Regularly visited by All the active partakers of Real estate
                  industry.
                </li>
                <li>Crowded by industrial leaders of real estate world.</li>
                <li>Visitors landing Per day More than 1, 00,000.</li>
                <li>
                  Services Offered : Provides Advertising platform to Agents,
                  Buyers and Sellers.
                </li>
                <li>
                  Property categories available industrial, commercial,
                  residential, agricultural and all other types of properties.
                </li>
                <li>
                  Recognized as Single platform for versatile needs of Real
                  estate World.
                </li>
                <li>
                  Regularly visited by All the active partakers of Real estate
                  industry.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
       <div className="w-full mt-10">
           {/* Call to Action Section */}
           <div className="relative bg-gray-300 w-[90%] max-w-4xl mx-auto rounded-xl p-4 sm:p-6 text-center mb-12 sm:mb-16 ">
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
    </div>
  );
};

export default AboutUs;