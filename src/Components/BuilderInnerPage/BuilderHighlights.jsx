// // import React, { useState, useEffect } from "react";
// // import { FaSearch } from "react-icons/fa";
// // import Avenuepark from "../HomePage/Assets/logo.png";
// // import offer from "../HomePage/Assets/offer.png";
// // import slide1 from "../HomePage/Assets/slide1.jpg";
// // import slide2 from "../HomePage/Assets/slide2.webp";
// // import slide3 from "../HomePage/Assets/slide3.webp";
// // import slide4 from "../HomePage/Assets/slide4.webp";
// // import highlightsline from "../BuilderInnerPage/Assets/highlightsline.png";
// // import { Link, useNavigate } from "react-router-dom";

// // const images = [slide1, slide2, slide3, slide4];

// // const PropertyHighlights = ({
// //   scrollToApartments,
// //   scrollToIndividualHouse,
// //   scrollToTopProjects,
// // }) => {
// //   const [activeTab, setActiveTab] = useState("BUY");
// //   const [location, setLocation] = useState("Chennai");
// //   const [propertyType, setPropertyType] = useState("Apartment");
// //   const [priceRange, setPriceRange] = useState("2Cr-5Cr");
// //   const [currentImage, setCurrentImage] = useState(0);
// //   const navigate = useNavigate();

// //   const Header = () => (
// //   <header className="bg-black text-white p-4 flex justify-between items-center">
// //     <div className="container mx-auto flex justify-between items-center">
// //       <div>
// //         <span className="text-black mr-4">📞 +1 (555) 123-4567</span>
// //         <span className="mr-4">📧 info@capitalgroup.com</span>
// //       </div>
// //       <div>
// //         <span className="mr-4">EN</span>
// //         <span className="mr-4">RU</span>
// //       </div>
// //     </div>
// //   </header>
// // );

// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       setCurrentImage((prev) => (prev + 1) % images.length);
// //     }, 3000);
// //     return () => clearInterval(interval);
// //   }, []);

// //   // Handle card click to navigate to builder page
// //   const handleCardClick = () => {
// //     navigate("/builder", { replace: true }); // Use replace to avoid scroll restoration
// //   };

// //   return (
// //     <div className="relative w-full h-[100dvh]">
// //       <Header />
// //       <img
// //         src={images[currentImage]}
// //         alt="Property highlight"
// //         className="w-full h-full object-cover"
// //       />
// //       <div className="absolute inset-0 bg-black bg-opacity-40"></div>

// //       {/* Navbar (Commented Out) */}
// //       {/* <div className="absolute top-5 left-1/2 transform -translate-x-1/2 hidden md:flex w-[100%] max-w-7xl items-center text-white font-semibold text-sm lg:text-base">
// //         <div className="flex flex-1 justify-center space-x-6 lg:space-x-10">
// //           <h1
// //             onClick={scrollToApartments}
// //             className="cursor-pointer flex-shrink-0"
// //           >
// //             Apartments
// //           </h1>
// //           <h1 onClick={scrollToTopProjects} className="cursor-pointer">
// //             Ongoing Projects
// //           </h1>
// //           <h1 onClick={scrollToIndividualHouse} className="cursor-pointer">
// //             Individual House
// //           </h1>
// //           <h1 onClick={() => navigate("/contact")} className="cursor-pointer">
// //             Contact Us
// //           </h1>
// //         </div>
// //         <div className="flex space-x-3">
// //           <Link to="/login">
// //             <button className="px-4 py-2 bg-white text-black rounded hover:bg-blue-700 hover:text-white transition">
// //               Get Started
// //             </button>
// //           </Link>
// //         </div>
// //       </div> */}

// //       {/* Logo */}
// //       <div className="absolute top-8 left-4 sm:top-10 sm:left-6 md:top-14 md:left-16 bg-white p-2 sm:p-3 rounded-md shadow-lg">
// //         <img
// //           src={Avenuepark}
// //           alt="Casagrand Avenuepark Logo"
// //           className="w-20 sm:w-28 md:w-32 h-auto"
// //         />
// //       </div>

// //       {/* Text content */}
// //       <div className="absolute top-24 left-5 sm:top-32 sm:left-10 md:top-40 md:left-16 text-white">
// //         <h1 className="text-xl sm:text-3xl md:text-4xl font-bold leading-snug">
// //           Casagrand Avenuepark <br /> highlight
// //         </h1>
// //         {/* <button
// //           className="mt-4 px-4 py-2 md:px-6 md:py-2 border-2 border-white text-white font-medium rounded-md hover:bg-white hover:text-black transition"
// //         >
// //           Explore properties
// //         </button> */}
// //         <img src={highlightsline} alt="" className="mt-6 h-1 sm:mt-8" />
// //       </div>

// //       {/* Offer badge */}
// //       <div className="absolute bottom-24 right-4 sm:bottom-28 sm:right-6 md:bottom-32 md:right-10 w-16 sm:w-20 md:w-auto">
// //         <img src={offer} alt="Offer Badge" />
// //       </div>

// //       {/* Clickable Card for Builder Navigation */}
// //       <div
// //         className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[600px] md:w-[900px] bg-white shadow-xl rounded-lg p-4 sm:p-6 cursor-pointer hover:bg-gray-100 transition"
// //         onClick={handleCardClick}
// //       >
// //         <h3 className="text-lg sm:text-xl font-bold text-gray-800">
// //           Explore Builder Projects
// //         </h3>
// //         <p className="text-sm sm:text-base text-gray-600 mt-2">
// //           Discover our latest builder projects and offerings.
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PropertyHighlights;

// import React from "react";
// import BuilderNavbar from "./BuilderNavbar"; // Adjust the import path as needed

// const PropertyHighlights = () => {
//   return (
//     <div className="relative w-full min-h-screen">
//       {/* Navbar */}
//       <BuilderNavbar />

//       {/* Static Banner */}
//       <div className="pt-20 bg-[#E6F0FA] min-h-[80vh] flex items-center justify-center text-center px-4">
//         <div>
//           <h1 className="font-bold text-[32px] sm:text-[48px] md:text-[64px] leading-[120%] text-black mb-2">
//             Explore Our Properties
//           </h1>
//           <p className="font-light text-[16px] sm:text-[20px] md:text-[24px] leading-[140%] text-black max-w-xl mx-auto">
//             Discover properties that blend luxury, comfort, and modern living tailored to your
//             lifestyle.
//           </p>
//         </div>
//       </div>

//       {/* Bottom Floating Card (Optional - commented out for now) */}
//       {/* <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[600px] md:w-[900px] bg-[#EDEAEA] rounded-lg p-4 sm:p-6 shadow-lg text-center z-30 cursor-pointer">
//         <h1 className="font-bold text-[20px] sm:text-[28px] md:text-[36px] leading-[110%] tracking-tight text-gray-800">
//           Explore Builder Project
//         </h1>
//         <p className="font-light text-[14px] sm:text-[18px] md:text-[24px] leading-[130%] text-gray-700 mt-2">
//           Discover our latest builder projects and offerings.
//         </p>
//         <button className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition shadow-md">
//           View Projects
//         </button>
//       </div> */}
//     </div>
//   );
// };

// export default PropertyHighlights;



import React from "react";
import BuilderNavbar from "./BuilderNavbar"; // Adjust the import path as needed

const PropertyHighlights = () => {
  return (
    <div className="relative w-full min-h-screen">
      {/* Navbar */}
      <BuilderNavbar />

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

      {/* Bottom Floating Card (Optional - commented out for now) */}
      {/* <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[600px] md:w-[900px] bg-[#EDEAEA] rounded-lg p-4 sm:p-6 shadow-lg text-center z-30 cursor-pointer">
        <h1 className="font-bold text-[20px] sm:text-[28px] md:text-[36px] leading-[110%] tracking-tight text-gray-800">
          Explore Builder Project
        </h1>
        <p className="font-light text-[14px] sm:text-[18px] md:text-[24px] leading-[130%] text-gray-700 mt-2">
          Discover our latest builder projects and offerings.
        </p>
        <button className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition shadow-md">
          View Projects
        </button>
      </div> */}
    </div>
  );
};

export default PropertyHighlights;
