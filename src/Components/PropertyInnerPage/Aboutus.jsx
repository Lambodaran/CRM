import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaSnowflake, 
  FaFireExtinguisher,
  FaRunning,
  FaSmoking,
  FaChild,
  FaDog,
  FaTshirt,
  FaSwimmingPool,
  FaDumbbell,
  FaParking,
  FaShieldAlt,
  FaBolt,
  FaHome,
  FaGamepad,
  FaTree,
  FaVideo,
  FaClock,
  FaCheck,
  FaBuilding,
  FaBook,
  FaMapMarkerAlt,
  FaPlane,
  FaSchool,
  FaHospital,
  FaShoppingBag,
  FaSubway
} from 'react-icons/fa';
import img from "../PropertyInnerPage/Assets/img.webp";
import img6 from "../PropertyInnerPage/Assets/IMG6.jpg";
import img2 from "../PropertyInnerPage/Assets/IMG2.jpg";
import location1 from "../PropertyInnerPage/Assets/location1.png";
import bed from "../PropertyInnerPage/Assets/bed.png";
import sqft from "../PropertyInnerPage/Assets/sqft.png";
import apartment from "../PropertyInnerPage/Assets/apartment.png";
import Map from "./Map";
import logo from "../HomePage/Assets/logo.png";
import BASE_URL from "../../service/api";

const PropertyDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const propertyId = location.state?.propertyId;
  const builderId = location.state?.builderId;

  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [navbarBookNowButtons, setNavbarBookNowButtons] = useState(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Salient Features");
  
  // Floor plan states
  const [floorPlanActiveTab, setFloorPlanActiveTab] = useState("Unit");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Gallery states
  const [galleryActiveTab, setGalleryActiveTab] = useState("Elevation");
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  const buildingRefs = useRef([]);
  const bookNowButtonRefs = useRef([]);
  const mapRefs = useRef([]);

  // floor plan images
  const floorPlanImages = {
    Unit: [
      "https://www.casagrand.co.in/wp-content/uploads/2025/02/1-min-490x365.jpg?ver=1.211",
      "https://www.casagrand.co.in/wp-content/uploads/2025/02/2-min-490x365.jpg?ver=1.211",
      "https://www.casagrand.co.in/wp-content/uploads/2025/02/3-min-490x365.jpg?ver=1.211",
      "https://www.casagrand.co.in/wp-content/uploads/2025/02/4-min-490x365.jpg?ver=1.211"
    ],
    Floor: [
      "https://www.casagrand.co.in/wp-content/uploads/2025/02/CLUBHOUSE-min-490x365.jpg?ver=1.211",
      "https://www.casagrand.co.in/wp-content/uploads/2025/02/CLUBHOUSE-min-490x365.jpg?ver=1.211",
      "https://www.casagrand.co.in/wp-content/uploads/2025/02/CLUBHOUSE-min-490x365.jpg?ver=1.211"
    ],
    Block: [
      "https://www.casagrand.co.in/wp-content/uploads/2025/02/Master-plan-min-490x365.jpg?ver=1.211",
      "https://www.casagrand.co.in/wp-content/uploads/2025/02/Master-plan-min-490x365.jpg?ver=1.211",
    ]
  };

  const floorPlanTabs = [
    { label: "Unit", disabled: false },
    { label: "Floor", disabled: false },
    { label: "Block", disabled: false }
  ];

  // Gallery images for each category
  const galleryImages = {
    Elevation: [
      "https://www.casagrand.co.in/wp-content/uploads/2025/02/Aerial-Day_color-corrected-490x365.webp?ver=1.211",
      "https://www.casagrand.co.in/wp-content/uploads/2025/02/aerail-night-490x365.webp?ver=1.211",
      "https://www.casagrand.co.in/wp-content/uploads/2025/02/villa-street-2-490x365.webp?ver=1.211",
    ],
    Interiors: [
      "https://www.casagrand.co.in/wp-content/uploads/2025/03/Orchards-images-43-490x365.jpg?ver=1.211",
      "https://www.casagrand.co.in/wp-content/uploads/2025/03/Orchards-images-45-490x365.jpg?ver=1.211",
      "https://www.casagrand.co.in/wp-content/uploads/2025/03/Orchards-images-50-490x365.jpg?ver=1.211",
    ],
    Amenities: [
      "https://www.casagrand.co.in/wp-content/uploads/2025/02/Kids-Play-490x365.webp?ver=1.211",
      "https://www.casagrand.co.in/wp-content/uploads/2025/02/Av-room-490x365.jpg?ver=1.211",
      "https://www.casagrand.co.in/wp-content/uploads/2025/02/Banquet-490x365.jpg?ver=1.211",
    ],
    'Site Progress': [
      "https://www.casagrand.co.in/wp-content/uploads/2025/03/Orchards-II-V100-Foundation-commencement-30.04.25-2-490x365.jpg?ver=1.211",
      "https://www.casagrand.co.in/wp-content/uploads/2025/03/Orchards-II-V100-Foundation-commencement-30.04.25-490x365.jpg?ver=1.211",
      "https://www.casagrand.co.in/wp-content/uploads/2025/03/Orchards-II-V101-Foundation-commencement-30.04.25-490x365.jpg?ver=1.211",
    ],
    Walkthrough: [
      "https://img.youtube.com/vi/ZZcg2zzNR2M/mqdefault.jpg?ver=1.211",
      "https://img.youtube.com/vi/OgbAYSsm5qE/mqdefault.jpg?ver=1.211",
      "https://img.youtube.com/vi/OgbAYSsm5qE/mqdefault.jpg?ver=1.211",
    ],
  };

  const galleryTabs = [
    { label: "Elevation", disabled: false },
    { label: "Interiors", disabled: false },
    { label: "Amenities", disabled: false },
    { label: "Site Progress", disabled: false },
    { label: "Walkthrough", disabled: false }
  ];

  // Mock data for salient features
  const salientFeatures = [
    "115 premium villas set within a 9.52-acre community featuring classical elevation.",
    "5.6-acre open space with 3 acres of lush greenery & a tropical forest.",
    "45+ world-class amenities, including a 4,700 sqft pool & rooftop cricket box.",
    "Vaastu-compliant villas with optimal space utilization.",
    "13,000 sqft grand club, including a 6,000 sqft clubhouse in Phase 2"
  ];

  // Mock data for location advantages
  const locationAdvantages = [
    { name: "Airport", distance: "12 km", icon: <FaPlane className="text-blue-500" /> },
    { name: "International School", distance: "3 km", icon: <FaSchool className="text-green-500" /> },
    { name: "Metro Station", distance: "5 km", icon: <FaSubway className="text-red-500" /> },
    { name: "Shopping Mall", distance: "2 km", icon: <FaShoppingBag className="text-purple-500" /> },
    { name: "Hospital", distance: "4 km", icon: <FaHospital className="text-red-500" /> },
    { name: "Beach", distance: "8 km", icon: <FaSwimmingPool className="text-blue-400" /> }
  ];

  // Floor plan navigation handlers
  const handleNext = () => {
    if (currentIndex < floorPlanImages[floorPlanActiveTab].length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Gallery navigation handlers
  const handleGalleryNext = () => {
    if (currentGalleryIndex < galleryImages[galleryActiveTab].length - 1) {
      setCurrentGalleryIndex(currentGalleryIndex + 1);
    }
  };

  const handleGalleryPrev = () => {
    if (currentGalleryIndex > 0) {
      setCurrentGalleryIndex(currentGalleryIndex - 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const newNavbarButtons = new Set();

      buildings.forEach((building, index) => {
        const bookNowButton = bookNowButtonRefs.current[index];
        const mapSection = mapRefs.current[index];
        
        if (bookNowButton && mapSection) {
          const buttonOriginalTop = bookNowButton.offsetTop;
          const mapRect = mapSection.getBoundingClientRect();
          
          const buttonPassedNavbar = scrollPosition > buttonOriginalTop - 80;
          const mapPassed = mapRect.bottom < 0;
          
          if (buttonPassedNavbar && !mapPassed) {
            newNavbarButtons.add(building._id);
          }
        }
      });

      setNavbarBookNowButtons(newNavbarButtons);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [buildings]);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        if (!propertyId) throw new Error("No property ID provided");
        const response = await fetch(
          `${BASE_URL}/api/properties/buildings/by-project/${propertyId}`
        );
        if (!response.ok) throw new Error("Failed to fetch property data");
        const data = await response.json();
        setBuildings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyData();
  }, [propertyId]);

  const toggleDescription = (buildingId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [buildingId]: !prev[buildingId]
    }));
  };

  const getAmenityIcon = (amenity) => {
    const iconStyle = { color: 'black', size: 16 };
    const iconMap = {
      'air conditioner': <FaSnowflake style={iconStyle} />,
      'fire extinguisher': <FaFireExtinguisher style={iconStyle} />,
      'sports field': <FaRunning style={iconStyle} />,
      'smoking area': <FaSmoking style={iconStyle} />,
      'kids zone': <FaChild style={iconStyle} />,
      'pet friendly': <FaDog style={iconStyle} />,
      'elevator': <FaBuilding style={iconStyle} />,
      'laundry': <FaTshirt style={iconStyle} />,
      'swimming pool': <FaSwimmingPool style={iconStyle} />,
      'gym': <FaDumbbell style={iconStyle} />,
      'parking': <FaParking style={iconStyle} />,
      'security': <FaShieldAlt style={iconStyle} />,
      '24x7 security': <FaClock style={iconStyle} />,
      'power backup': <FaBolt style={iconStyle} />,
      'clubhouse': <FaHome style={iconStyle} />,
      'children play area': <FaGamepad style={iconStyle} />,
      'garden': <FaTree style={iconStyle} />,
      'cctv': <FaVideo style={iconStyle} />,
      'surveillance': <FaVideo style={iconStyle} />
    };

    const lowerAmenity = amenity.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerAmenity.includes(key)) {
        return icon;
      }
    }
    return <FaCheck style={iconStyle} />;
  };

  const handleBookNow = (buildingId) => {
    navigate("/clientbooking", {
      state: {
        propertyId,
        buildingId,
        builderId,
        price: buildings.find(b => b._id === buildingId)?.priceRange || "N/A"
      }
    });
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return price;
  };

  const getImageForTab = (tabName, building) => {
    if (['Salient Features', 'Project Overview', 'Amenities'].includes(tabName)) {
      if (building?.photos?.length >= 3) {
        const tabIndexMap = {
          'Salient Features': 0,
          'Project Overview': 1,
          'Amenities': 2
        };
        const photoIndex = tabIndexMap[tabName];
        return building.photos[photoIndex];
      }
      switch(tabName) {
        case 'Salient Features':
          return img;
        case 'Project Overview':
          return img2;
        case 'Amenities':
          return img6;
        default:
          return img;
      }
    }

    if (tabName === 'Location Advantage') {
      return "https://www.casagrand.co.in/wp-content/uploads/2025/02/Screenshot-2025-02-01-111730.png?ver=1.211";
    }

    return img;
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 text-red-500">
      Error: {error}
    </div>
  );
  
  if (buildings.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      No buildings found for this property
    </div>
  );
  
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-8">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-300 shadow-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <img src={logo} alt="Company Logo" className="h-10" />
            </div>
            
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-red-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
            
            <div className="hidden md:flex flex-1 justify-center">
              <nav className="flex space-x-4 lg:space-x-8">
                <a href="/about" className="text-gray-700 hover:text-red-500 font-medium text-sm lg:text-base">About Us</a>
                <a href="/why-us" className="text-gray-700 hover:text-red-500 font-medium text-sm lg:text-base">Why Us</a>
                <a href="/contact" className="text-gray-700 hover:text-red-500 font-medium text-sm lg:text-base">Contact Us</a>
              </nav>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              {Array.from(navbarBookNowButtons).map((buildingId) => {
                const building = buildings.find(b => b._id === buildingId);
                return (
                  <button
                    key={buildingId}
                    onClick={() => handleBookNow(buildingId)}
                    className="bg-black text-white font-bold py-1 px-3 lg:py-2 lg:px-4 rounded-lg transition-colors text-xs lg:text-sm"
                  >
                    Book {building?.buildingName || 'Now'}
                  </button>
                );
              })}
            </div>
          </div>
          
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white py-4 border-t">
              <nav className="flex flex-col space-y-3">
                <a href="/about" className="text-gray-700 hover:text-red-500 font-medium">About Us</a>
                <a href="/why-us" className="text-gray-700 hover:text-red-500 font-medium">Why Us</a>
                <a href="/contact" className="text-gray-700 hover:text-red-500 font-medium">Contact Us</a>
              </nav>
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from(navbarBookNowButtons).map((buildingId) => {
                  const building = buildings.find(b => b._id === buildingId);
                  return (
                    <button
                      key={buildingId}
                      onClick={() => handleBookNow(buildingId)}
                      className="bg-black text-white font-bold py-1 px-3 rounded-lg transition-colors text-xs"
                    >
                      Book {building?.buildingName || 'Now'}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-20">
        {buildings.map((building, index) => (
          <div 
            key={building._id} 
            className="mb-16 md:mb-24 border-b last:border-b-0"
            ref={el => buildingRefs.current[index] = el}
          >
            <h1 className="text-3xl md:text-5xl lg:text-[60px] font-semibold pb-4">
              {building.project?.projectName || "Project Name"}
            </h1>

            {/* Tab Navigation */}
            <div className="flex justify-center">
              <div className="flex overflow-x-auto p-6 border-gray-200">
                {['Salient Features', 'Project Overview', 'Amenities', 'Location Advantage'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 font-medium whitespace-nowrap text-sm md:text-base ${
                      activeTab === tab 
                        ? 'text-black border-b-2 border-black' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Highlights Section at Top */}
            <div className="bg-white rounded-lg mb-8">
              {/* Stack on mobile, side by side on larger screens */}
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="w-full lg:w-1/2 h-[250px] sm:h-[350px] md:h-[400px] lg:h-auto rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none overflow-hidden">
                  <img
                    src={getImageForTab(activeTab, building)}
                    alt="Property"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Tab Content */}
                <div className="w-full lg:w-1/2">
                  <div className="p-4 md:p-6 h-[300px] md:h-[350px] overflow-y-auto">
                    {activeTab === 'Salient Features' && (
                      <div className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-bold mb-4">Salient Features</h2>
                        <ul className="space-y-3">
                          {salientFeatures.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mt-2 mr-3"></span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeTab === 'Project Overview' && (
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold mb-4">Project Overview</h2>
                        <p className="text-gray-700 leading-relaxed">
                          {building.description || "No project description available."}
                        </p>
                      </div>
                    )}

                    {activeTab === 'Amenities' && (
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold mb-4">Amenities</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {building.amenities?.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                {getAmenityIcon(amenity)}
                              </div>
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'Location Advantage' && (
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold mb-4">Location Advantage</h2>
                        <div className="flex items-center gap-2 mb-4">
                          <FaMapMarkerAlt className="text-red-500" />
                          <span className="font-medium">{building.buildingArea || "Location details not available"}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {locationAdvantages.map((advantage, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                {advantage.icon}
                              </div>
                              <div>
                                <p className="font-medium">{advantage.name}</p>
                                <p className="text-sm text-gray-600">{advantage.distance}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 mt-8 md:mt-12">
              {/* Left Side - Property details */}
              <div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-black">
                    {building.buildingName || "Bouganville"}
                  </h1>
                  <div className="flex flex-col mt-2 md:mt-3 space-y-1 md:space-y-2">
                    <p className="text-gray-600 flex items-center gap-1 md:gap-2 text-sm md:text-base">
                      <img src={location1} alt="Location" className="w-4 h-4 md:w-5 md:h-5" />
                      {building.buildingArea || "OMR, Chennai"}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-6 lg:mt-8">
                    <h2 className="text-lg md:text-xl font-semibold">About the property</h2>
                    <div className="relative">
                      <p className={`text-gray-600 mt-2 md:mt-3 text-sm md:text-base leading-relaxed ${
                        !expandedDescriptions[building._id] ? 'line-clamp-2' : ''
                      }`}>
                        {building.description || "Nestled in a prime location, this property is the epitome of luxurious living. Designed for those who seek tranquility without compromising on modern conveniences, this property offers a harmonious blend of sophistication, comfort, and timeless elegance."}
                      </p>
                      {building.description && (
                        <button
                          onClick={() => toggleDescription(building._id)}
                          className="text-black font-medium mt-1 md:mt-2 hover:underline focus:outline-none text-sm md:text-base"
                        >
                          {expandedDescriptions[building._id] ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 md:gap-6 lg:gap-24 mt-6 md:mt-8 text-gray-700 text-xs md:text-sm border-b pb-4">
                  <p className="flex items-center flex-col gap-1 md:gap-2">
                    <img src={sqft} alt="Sqft" className="w-4 h-4 md:w-5 md:h-5" />
                    Floors: {building.floorsCount || "3"}
                  </p>
                  <p className="flex items-center flex-col gap-1 md:gap-2">
                    <img src={apartment} alt="Type" className="w-4 h-4 md:w-5 md:h-5" />
                    Type: {building.type || "Residential"}
                  </p>
                </div>
              </div>

              {/* Right Side - Payment and Amenities */}
              <div>
                <p className="text-lg md:text-xl font-semibold text-black-500 px-3 py-3 md:px-4 md:py-4 text-center w-full md:w-[400px] lg:w-[500px] xl:w-[540px] bg-[#F0F0F0] rounded-md shadow-lg">
                  <span className="text-2xl md:text-3xl lg:text-4xl text-black-600">₹{formatPrice(building.priceRange)}</span>
                </p>

                {/* Book Now Button */}
                <div className="mt-8 md:mt-12 lg:mt-[90px] flex justify-center">
                  <button
                    ref={el => bookNowButtonRefs.current[index] = el}
                    onClick={() => handleBookNow(building._id)}
                    className={`w-full md:w-[80%] bg-black text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-colors ${
                      navbarBookNowButtons.has(building._id) ? 'opacity-50 pointer-events-none' : ''
                    }`}
                    style={{
                      visibility: navbarBookNowButtons.has(building._id) ? 'hidden' : 'visible'
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            {/* Floor Plans Section */}
            <div className="bg-gray-100 py-8 mt-8 rounded-lg">
              <h2 className="text-3xl md:text-4xl font-semibold text-center mb-6 md:mb-8">FLOOR PLANS</h2>

              {/* Tabs */}
              <div className="flex justify-center gap-2 md:gap-4 mb-6 md:mb-10 overflow-x-auto px-4">
                {floorPlanTabs.map((tab) => (
                  <button
                    key={tab.label}
                    disabled={tab.disabled}
                    onClick={() => {
                      setFloorPlanActiveTab(tab.label);
                      setCurrentIndex(0);
                    }}
                    className={`px-4 py-2 md:px-5 md:py-3 rounded font-medium text-sm md:text-base whitespace-nowrap ${
                      floorPlanActiveTab === tab.label 
                        ? "bg-gray-800 text-white" 
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    } ${
                      tab.disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Carousel - Show one image on mobile, two on larger screens */}
              {["Unit", "Floor", "Block"].includes(floorPlanActiveTab) && (
                <div className="flex justify-center">
                  <div className="flex items-center gap-4 md:gap-8">
                    {/* Left Arrow */}
                    <button
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className={`flex items-center justify-center p-3 bg-gray-700 bg-opacity-70 text-white rounded-full h-10 w-10 md:h-12 md:w-12 ${
                        currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-opacity-90"
                      }`}
                    >
                      &#8592;
                    </button>

                    {/* Images */}
                    <div className="flex gap-4 md:gap-8">
                      {floorPlanImages[floorPlanActiveTab]
                        .slice(currentIndex, currentIndex + (window.innerWidth < 768 ? 1 : 2))
                        .map((img, idx) => (
                          <div key={idx} className="bg-white rounded shadow p-2 flex-1">
                            <img
                              src={img}
                              alt={`${floorPlanActiveTab} Plan ${currentIndex + idx + 1}`}
                              className="w-full h-40 md:h-60 object-contain"
                            />
                          </div>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                      onClick={handleNext}
                      disabled={currentIndex >= floorPlanImages[floorPlanActiveTab].length - (window.innerWidth < 768 ? 1 : 2)}
                      className={`flex items-center justify-center p-3 bg-gray-700 bg-opacity-70 text-white rounded-full h-10 w-10 md:h-12 md:w-12 ${
                        currentIndex >= floorPlanImages[floorPlanActiveTab].length - (window.innerWidth < 768 ? 1 : 2)
                          ? "opacity-30 cursor-not-allowed"
                          : "hover:bg-opacity-90"
                      }`}
                    >
                      &#8594;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Section */}
           <div className="bg-white py-8 mt-8 rounded-lg shadow-sm">
  <h2 className="text-3xl md:text-4xl font-semibold text-center mb-6 md:mb-8">GALLERY</h2>

  {/* Gallery Tabs - Fixed for mobile */}
  <div className="flex justify-start md:justify-center gap-2 md:gap-4 mb-6 md:mb-10 overflow-x-auto px-4 no-scrollbar">
    {galleryTabs.map((tab) => (
      <button
        key={tab.label}
        disabled={tab.disabled}
        onClick={() => {
          setGalleryActiveTab(tab.label);
          setCurrentGalleryIndex(0);
        }}
        className={`flex-shrink-0 px-3 py-2 md:px-4 md:py-2 rounded font-medium text-sm md:text-base ${
          galleryActiveTab === tab.label 
            ? "bg-gray-800 text-white" 
            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
        } ${
          tab.disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {tab.label.split(' ').map(word => (
          <span key={word} className="whitespace-nowrap">
            {word}
          </span>
        ))}
      </button>
    ))}
  </div>

  {/* Gallery Image Display */}
  <div className="relative px-4">
    {/* Navigation Arrows */}
    <button
      onClick={handleGalleryPrev}
      disabled={currentGalleryIndex === 0}
      className={`absolute left-0 md:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-3 rounded-full z-10 ${
        currentGalleryIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-opacity-90"
      }`}
      style={{ width: '40px', height: '40px' }}
    >
      &#8592;
    </button>
    
    <div className="overflow-hidden">
      <div className="flex justify-center">
        <div className="w-full max-w-md mx-8">
          {galleryImages[galleryActiveTab]?.length > 0 ? (
            <img
              src={galleryImages[galleryActiveTab][currentGalleryIndex]}
              alt={`${galleryActiveTab} view ${currentGalleryIndex + 1}`}
              className="w-full h-auto max-h-[400px] md:max-h-[500px] object-cover md:object-contain rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">No images available for {galleryActiveTab}</p>
            </div>
          )}
        </div>
      </div>
    </div>
    
    <button
      onClick={handleGalleryNext}
      disabled={currentGalleryIndex >= (galleryImages[galleryActiveTab]?.length || 1) - 1}
      className={`absolute right-0 md:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-3 rounded-full z-10 ${
        currentGalleryIndex >= (galleryImages[galleryActiveTab]?.length || 1) - 1
          ? "opacity-30 cursor-not-allowed" 
          : "hover:bg-opacity-90"
      }`}
      style={{ width: '40px', height: '40px' }}
    >
      &#8594;
    </button>
    
    {/* Image Counter */}
    {galleryImages[galleryActiveTab]?.length > 0 && (
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-1 rounded-full text-sm">
        {currentGalleryIndex + 1} / {galleryImages[galleryActiveTab].length}
      </div>
    )}
  </div>
</div>

            {/* Map Section */}
            <div className="mt-8 md:mt-12 h-[300px] md:h-[350px] lg:h-[400px]" ref={el => mapRefs.current[index] = el}>
              <Map building={building} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyDetails;