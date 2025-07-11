// import React, { useState, useEffect } from "react";
// import { FaSearch } from "react-icons/fa";
// import Avenuepark from "../HomePage/Assets/logo.png";
// import offer from "../HomePage/Assets/offer.png";
// import slide1 from "../HomePage/Assets/slide1.jpg";
// import slide2 from "../HomePage/Assets/slide2.webp";
// import slide3 from "../HomePage/Assets/slide3.webp";
// import slide4 from "../HomePage/Assets/slide4.webp";
// import highlightsline from "../BuilderInnerPage/Assets/highlightsline.png";
// import { Link, useNavigate } from "react-router-dom";

// const images = [slide1, slide2, slide3, slide4];

// const PropertyHighlights = ({
//   scrollToApartments,
//   scrollToIndividualHouse,
//   scrollToTopProjects,
// }) => {
//   const [activeTab, setActiveTab] = useState("BUY");
//   const [location, setLocation] = useState("Chennai");
//   const [propertyType, setPropertyType] = useState("Apartment");
//   const [priceRange, setPriceRange] = useState("2Cr-5Cr");
//   const [currentImage, setCurrentImage] = useState(0);
//   const navigate = useNavigate();

//   const Header = () => (
//   <header className="bg-black text-white p-4 flex justify-between items-center">
//     <div className="container mx-auto flex justify-between items-center">
//       <div>
//         <span className="text-black mr-4">📞 +1 (555) 123-4567</span>
//         <span className="mr-4">📧 info@capitalgroup.com</span>
//       </div>
//       <div>
//         <span className="mr-4">EN</span>
//         <span className="mr-4">RU</span>
//       </div>
//     </div>
//   </header>
// );

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImage((prev) => (prev + 1) % images.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   // Handle card click to navigate to builder page
//   const handleCardClick = () => {
//     navigate("/builder", { replace: true }); // Use replace to avoid scroll restoration
//   };

//   return (
//     <div className="relative w-full h-[100dvh]">
//       <Header />
//       <img
//         src={images[currentImage]}
//         alt="Property highlight"
//         className="w-full h-full object-cover"
//       />
//       <div className="absolute inset-0 bg-black bg-opacity-40"></div>

//       {/* Navbar (Commented Out) */}
//       {/* <div className="absolute top-5 left-1/2 transform -translate-x-1/2 hidden md:flex w-[100%] max-w-7xl items-center text-white font-semibold text-sm lg:text-base">
//         <div className="flex flex-1 justify-center space-x-6 lg:space-x-10">
//           <h1
//             onClick={scrollToApartments}
//             className="cursor-pointer flex-shrink-0"
//           >
//             Apartments
//           </h1>
//           <h1 onClick={scrollToTopProjects} className="cursor-pointer">
//             Ongoing Projects
//           </h1>
//           <h1 onClick={scrollToIndividualHouse} className="cursor-pointer">
//             Individual House
//           </h1>
//           <h1 onClick={() => navigate("/contact")} className="cursor-pointer">
//             Contact Us
//           </h1>
//         </div>
//         <div className="flex space-x-3">
//           <Link to="/login">
//             <button className="px-4 py-2 bg-white text-black rounded hover:bg-blue-700 hover:text-white transition">
//               Get Started
//             </button>
//           </Link>
//         </div>
//       </div> */}

//       {/* Logo */}
//       <div className="absolute top-8 left-4 sm:top-10 sm:left-6 md:top-14 md:left-16 bg-white p-2 sm:p-3 rounded-md shadow-lg">
//         <img
//           src={Avenuepark}
//           alt="Casagrand Avenuepark Logo"
//           className="w-20 sm:w-28 md:w-32 h-auto"
//         />
//       </div>

//       {/* Text content */}
//       <div className="absolute top-24 left-5 sm:top-32 sm:left-10 md:top-40 md:left-16 text-white">
//         <h1 className="text-xl sm:text-3xl md:text-4xl font-bold leading-snug">
//           Casagrand Avenuepark <br /> highlight
//         </h1>
//         {/* <button
//           className="mt-4 px-4 py-2 md:px-6 md:py-2 border-2 border-white text-white font-medium rounded-md hover:bg-white hover:text-black transition"
//         >
//           Explore properties
//         </button> */}
//         <img src={highlightsline} alt="" className="mt-6 h-1 sm:mt-8" />
//       </div>

//       {/* Offer badge */}
//       <div className="absolute bottom-24 right-4 sm:bottom-28 sm:right-6 md:bottom-32 md:right-10 w-16 sm:w-20 md:w-auto">
//         <img src={offer} alt="Offer Badge" />
//       </div>

//       {/* Clickable Card for Builder Navigation */}
//       <div
//         className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[600px] md:w-[900px] bg-white shadow-xl rounded-lg p-4 sm:p-6 cursor-pointer hover:bg-gray-100 transition"
//         onClick={handleCardClick}
//       >
//         <h3 className="text-lg sm:text-xl font-bold text-gray-800">
//           Explore Builder Projects
//         </h3>
//         <p className="text-sm sm:text-base text-gray-600 mt-2">
//           Discover our latest builder projects and offerings.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default PropertyHighlights;



import React, { useState, useEffect } from "react";
import { FaSearch , FaMapMarkerAlt} from "react-icons/fa";
import Avenuepark from "../HomePage/Assets/logo.png";
import offer from "../HomePage/Assets/offer.png";
import slide1 from "../HomePage/Assets/slide1.jpg";
import slide2 from "../HomePage/Assets/slide2.webp";
import slide3 from "../HomePage/Assets/slide3.webp";
import slide4 from "../HomePage/Assets/slide4.webp";
import { Link, useNavigate } from "react-router-dom";
import homepageimage from '../HomePage/Assets/HomeImage.png';
import NavLogo from "../HomePage/Assets/footerlogo copy.png";
import build2 from '../HomePage/Assets/build3.jpg';
import build3 from '../HomePage/Assets/build4.jpeg';

const images = [slide1, slide2, slide3, slide4];

const heroSlides = [
 {
    id: 1,
    title: "Luxury Living Redefined",
   
    description: "Discover our premium residential developments featuring world-class amenities and architectural brilliance in the heart of the city.",
    image: homepageimage,
   
  },
  {
    id: 2,
    title: "BUSINESS DESTINATIONS",
   
    description: "State-of-the-art commercial spaces designed for success. Premium office buildings and retail developments in prime locations.",
    image: build3,
   
  },
  {
    id: 3,
    title: "Investment Opportunities",
   
    description: "Exceptional real estate investment opportunities with guaranteed returns. Join our exclusive investor network today.",
    image: build2,
   
  },
];

const PropertyHighlights = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = () => {
    navigate("/builder", { replace: true });
  };


    // const handleScrollToApartments = scrollToApartments || defaultScrollToApartments;
    // const handleScrollToIndividualHouse = scrollToIndividualHouse || defaultScrollToIndividualHouse;
    // const handleScrollToTopProjects = scrollToTopProjects || defaultScrollToTopProjects;

  
      useEffect(() => {
        const interval = setInterval(() => {
          setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
      }, []);

  return (
    <div className="relative w-full h-[90dvh]">
             <div className="absolute inset-0 z-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={index !== currentSlide}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'} // Optimize loading
            />
          </div>
             ))}
           </div>
        
   
         {/* Navbar */}
         <nav className="absolute top-0 left-0 w-full bg-transparent text-white p-4 z-30">
           <div className="container mx-auto flex justify-between items-center">
             <div>
               <img
                 src={NavLogo}
                 alt="ABV Logo"
                 className="w-16 sm:w-20 md:w-24 h-auto"
               />
             </div>
             <div className="hidden md:flex space-x-6 items-center">
               <button 
               
                 className="text-white hover:text-black drop-shadow-md"
               >
                 {/* Apartments */}
               </button>
               <button 
              
                 className="text-white hover:text-black drop-shadow-md"
               >
                 {/* Ongoing Projects */}
               </button>
               <button 
               
                 className="text-white hover:text-black drop-shadow-md"
               >
                 {/* Individual House */}
               </button>
               <button 
                 onClick={() => navigate("/contact")}
                 className="text-white hover:text-black drop-shadow-md"
               >
                 {/* Contact */}
               </button>
             </div>
             <div className="flex space-x-3 items-center">
               {/* <div className="flex items-center space-x-1">
                 <FaMapMarkerAlt className="text-white" size={16} />
                 <span className="text-white text-sm drop-shadow-md">Chennai</span>
               </div> */}
               <Link to="/login">
                 {/* <button className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition shadow-md">               
                   Login
                 </button> */}
               </Link>
             </div>
           </div>
         </nav>
   
         
   
         {/* Text content */}
              <div className="container mx-auto h-full text-white p-4 pt-40 relative z-20">
  {/* Safe title/subtitle rendering */}
  {heroSlides[currentSlide]?.title && (
    <>
      <h1 className="font-inter font-extrabold text-[67px] leading-[122%] tracking-[0%] text-black mb-2">
        {heroSlides[currentSlide].title.split(' ')[0]}
      </h1>
      <span className="font-inter font-extrabold text-[67px] leading-[122%] tracking-[0%] text-black mb-6 block">
        {heroSlides[currentSlide].title.split(' ').slice(1).join(' ')}
      </span>
    </>
  )}
  
  {heroSlides[currentSlide]?.subtitle && (
    <h2 className="font-inter font-extrabold text-[67px] leading-[122%] tracking-[0%] text-black mb-6">
      {heroSlides[currentSlide].subtitle}
    </h2>
  )}

  {/* Safe description rendering */}
  <div className='w-[500px]'>
    <p className="font-inter font-light text-[24px] leading-[122%] tracking-[0%] text-black">
      {heroSlides[currentSlide]?.description || ''}
    </p>
  </div>
</div>
           
   
         
   
         {/* Bottom Search Card */}
<div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[600px] md:w-[900px] bg-[#EDEAEA] rounded-lg p-4 sm:p-6">        {/* Tabs */}
            <h1 className="font-inter font-extrabold text-[36px] leading-[100%] tracking-[0%]">
    Explore Builder Project
  </h1>
  
  {/* Subheading */}
  <p className="font-inter font-light text-[24px] leading-[100%] tracking-[0%] mt-2">
    Discover our latest builder projects and offerings.
  </p>
              
         </div>
         
       </div>
  );
};

export default PropertyHighlights;

