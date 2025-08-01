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
  FaMapMarkerAlt,
  FaPlane,
  FaSchool,
  FaHospital,
  FaShoppingBag,
  FaSubway,
} from "react-icons/fa";
import img from "../PropertyInnerPage/Assets/img.webp";
import img6 from "../PropertyInnerPage/Assets/IMG6.jpg";
import img2 from "../PropertyInnerPage/Assets/IMG2.jpg";
import location1 from "../PropertyInnerPage/Assets/location1.png";
import bed from "../PropertyInnerPage/Assets/bed.png";
import sqft from "../PropertyInnerPage/Assets/sqft.png";
import apartment from "../PropertyInnerPage/Assets/apartment.png";
import Map from "../PropertyInnerPage/Map";
import logo from "../HomePage/Assets/logo.png";
import BASE_URL from "../../service/api";
import { User } from "lucide-react";

const UserProperty0 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const buildingId = location.state?.propertyId;
  const builderId = location.state?.builderId;
  const projectId = location.state?.projectId;

  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState(false);
  const [navbarBookNowButton, setNavbarBookNowButton] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Salient Features");

  // Floor plan states
  const [floorPlanActiveTab, setFloorPlanActiveTab] = useState("unit");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Gallery states
  const [galleryActiveTab, setGalleryActiveTab] = useState("elevation");
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  const bookNowButtonRef = useRef(null);
  const mapRef = useRef(null);

  // Updated floorPlanTabs to match API response keys
  const floorPlanTabs = [
    { label: "Unit", key: "unit", disabled: !building?.floorPlans?.unit?.length },
    { label: "Clubhouse Plan", key: "clubhousePlans", disabled: !building?.floorPlans?.clubhousePlans?.length },
    { label: "Master Plan", key: "masterplans", disabled: !building?.floorPlans?.masterplans?.length },
  ];

  // Gallery tabs
  const galleryTabs = [
    { label: "Elevation", key: "elevation", disabled: !building?.gallery?.elevation?.length },
    { label: "Interiors", key: "interiors", disabled: !building?.gallery?.interiors?.length },
    { label: "Amenities", key: "amenities", disabled: !building?.gallery?.amenities?.length },
    { label: "Site Progress", key: "siteProgress", disabled: !building?.gallery?.siteProgress?.length },
  ];

  // Floor plan navigation handlers
  const handleNext = () => {
    const activeImages = building?.floorPlans?.[floorPlanActiveTab] || [];
    if (
      currentIndex <
      activeImages.length - (window.innerWidth < 768 ? 1 : 3)
    ) {
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
    if (
      currentGalleryIndex <
      (building?.gallery?.[galleryActiveTab]?.length || 0) - 1
    ) {
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
      if (!bookNowButtonRef.current || !mapRef.current) return;

      const scrollPosition = window.scrollY;
      const buttonOriginalTop = bookNowButtonRef.current.offsetTop;
      const mapRect = mapRef.current.getBoundingClientRect();

      const buttonPassedNavbar = scrollPosition > buttonOriginalTop - 80;
      const mapPassed = mapRect.bottom < 0;

      setNavbarBookNowButton(buttonPassedNavbar && !mapPassed);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [building]);

  useEffect(() => {
    const fetchBuildingData = async () => {
      try {
        if (!buildingId) throw new Error("No building ID provided");

        const response = await fetch(
          `${BASE_URL}/api/propertiesGet/building/${buildingId}`
        );

        if (!response.ok) throw new Error("Failed to fetch building data");

        const data = await response.json();
        setBuilding(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildingData();
  }, [buildingId]);

  const toggleDescription = () => {
    setExpandedDescriptions(!expandedDescriptions);
  };

  const getAmenityIcon = (amenity) => {
    const iconStyle = { color: "black", size: 16 };
    const iconMap = {
      "air conditioner": <FaSnowflake style={iconStyle} />,
      "fire extinguisher": <FaFireExtinguisher style={iconStyle} />,
      "sports field": <FaRunning style={iconStyle} />,
      "smoking area": <FaSmoking style={iconStyle} />,
      "kids zone": <FaChild style={iconStyle} />,
      "pet friendly": <FaDog style={iconStyle} />,
      elevator: <FaBuilding style={iconStyle} />,
      "lift / elevator": <FaBuilding style={iconStyle} />,
      laundry: <FaTshirt style={iconStyle} />,
      "swimming pool": <FaSwimmingPool style={iconStyle} />,
      gym: <FaDumbbell style={iconStyle} />,
      parking: <FaParking style={iconStyle} />,
      security: <FaShieldAlt style={iconStyle} />,
      "24x7 security": <FaClock style={iconStyle} />,
      "power backup": <FaBolt style={iconStyle} />,
      clubhouse: <FaHome style={iconStyle} />,
      "children play area": <FaGamepad style={iconStyle} />,
      "childrens play area": <FaGamepad style={iconStyle} />,
      garden: <FaTree style={iconStyle} />,
      cctv: <FaVideo style={iconStyle} />,
      surveillance: <FaVideo style={iconStyle} />,
      "cctv surveillance": <FaVideo style={iconStyle} />,
    };

    const lowerAmenity = amenity.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerAmenity.includes(key)) {
        return icon;
      }
    }
    return <FaCheck style={iconStyle} />;
  };

  const handleBookNow = () => {
    navigate("/clientbooking", {
      state: {
        propertyId: buildingId,
        builderId,
        projectId,
        price: building?.priceRange || "N/A",
        buildingName: building?.buildingName || "Property",
        buildingData: building,
      },
    });
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `₹${parseFloat(price).toLocaleString("en-IN")}`;
  };

  const getImageForTab = (tabName) => {
    if (["Salient Features", "Project Overview", "Amenities", "Location Advantage"].includes(tabName)) {
      if (building?.photos?.length >= 4) {
        const tabIndexMap = {
          "Salient Features": 0,
          "Project Overview": 1,
          "Amenities": 2,
          "Location Advantage": 3,
        };
        return building.photos[tabIndexMap[tabName]];
      }
    }
    return img;
  };

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-lg font-medium">Loading property details...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 text-red-500">
        Error: {error}
      </div>
    );

  if (!building)
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        No building details found
      </div>
    );

  return (
    <div className="container mx-auto px-4 md:px-6 py-2">
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
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            <div className="hidden md:flex flex-1 justify-center">
              <nav className="flex space-x-4 lg:space-x-8">
                <a
                  href="/about"
                  className="text-gray-700 hover:text-red-500 font-medium text-sm lg:text-base"
                >
                  About Us
                </a>
                <a
                  href="/why-us"
                  className="text-gray-700 hover:text-red-500 font-medium text-sm lg:text-base"
                >
                  Why Us
                </a>
                <a
                  href="/contact"
                  className="text-gray-700 hover:text-red-500 font-medium text-sm lg:text-base"
                >
                  Contact Us
                </a>
              </nav>
            </div>

            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              {navbarBookNowButton && (
                <button
                  onClick={handleBookNow}
                  className="bg-black text-white font-bold py-1 px-3 lg:py-2 lg:px-4 rounded-lg transition-colors text-xs lg:text-sm"
                >
                  Book {building?.buildingName || "Now"}
                </button>
              )}
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden bg-white py-4 border-t">
              <nav className="flex flex-col space-y-3">
                <a
                  href="/about"
                  className="text-gray-700 hover:text-red-500 font-medium"
                >
                  About Us
                </a>
                <a
                  href="/why-us"
                  className="text-gray-700 hover:text-red-500 font-medium"
                >
                  Why Us
                </a>
                <a
                  href="/contact"
                  className="text-gray-700 hover:text-red-500 font-medium"
                >
                  Contact Us
                </a>
              </nav>
              <div className="mt-4">
                {navbarBookNowButton && (
                  <button
                    onClick={handleBookNow}
                    className="bg-black text-white font-bold py-1 px-3 rounded-lg transition-colors text-xs"
                  >
                    Book {building?.buildingName || "Now"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-20">
        <div className="mb-16 md:mb-24">
          <h1 className="text-3xl md:text-3xl lg:text-[40px] font-semibold pb-4">
            {building.project?.projectName ||
              building.buildingName ||
              "Property Details"}
          </h1>

          {/* Tab Navigation */}
          <div className="flex justify-center">
            <div className="flex overflow-x-auto p-6 border-gray-200 scrollbar-hide">
              {[
                "Salient Features",
                "Project Overview",
                "Amenities",
                "Location Advantage",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-medium whitespace-nowrap text-sm md:text-base ${
                    activeTab === tab
                      ? "text-black border-b-2 border-black"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Highlights Section at Top */}
          <div className="bg-white rounded-lg mb-8">
            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <div className="w-full lg:w-1/2 h-[250px] sm:h-[350px] md:h-[400px] lg:h-auto rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none overflow-hidden">
                <img
                  src={getImageForTab(activeTab)}
                  alt="Property"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Tab Content */}
              <div className="w-full lg:w-1/2">
                <div className="p-4 md:p-6 h-[300px] md:h-[350px] overflow-y-auto">
                  {activeTab === "Salient Features" && (
                    <div className="space-y-4">
                      <h2 className="text-xl md:text-2xl font-bold mb-4">
                        Salient Features
                      </h2>
                      <ul className="space-y-3">
                        {building.salientFeatures?.length > 0 ? (
                          building.salientFeatures.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mt-2 mr-3"></span>
                              <span>{feature}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-600">
                            No salient features available.
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {activeTab === "Project Overview" && (
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold mb-4">
                        Project Overview
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {building.projectOverview ||
                          building.description ||
                          "No project description available."}
                      </p>
                    </div>
                  )}

                  {activeTab === "Amenities" && (
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold mb-4">
                        Amenities
                      </h2>
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

                  {activeTab === "Location Advantage" && (
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold mb-4">
                        Location Advantage
                      </h2>
                      <div className="flex items-center gap-2 mb-4">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span className="font-medium">
                          {building.buildingArea ||
                            "Location details not available"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {building.locationAdvantages?.length > 0 ? (
                          building.locationAdvantages.map(
                            (advantage, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                  {(() => {
                                    const place = advantage.place.toLowerCase();
                                    if (place.includes("airport"))
                                      return (
                                        <FaPlane className="text-blue-500" />
                                      );
                                    if (place.includes("school"))
                                      return (
                                        <FaSchool className="text-green-500" />
                                      );
                                    if (place.includes("metro"))
                                      return (
                                        <FaSubway className="text-red-500" />
                                      );
                                    if (place.includes("mall"))
                                      return (
                                        <FaShoppingBag className="text-purple-500" />
                                      );
                                    if (place.includes("hospital"))
                                      return (
                                        <FaHospital className="text-red-500" />
                                      );
                                    return (
                                      <FaMapMarkerAlt className="text-gray-500" />
                                    );
                                  })()}
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {advantage.place}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {advantage.distance}
                                  </p>
                                </div>
                              </div>
                            )
                          )
                        ) : (
                          <p className="text-gray-600">
                            No location advantages available.
                          </p>
                        )}
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
                  {building.buildingName || "Property Name"}
                </h1>
                <div className="flex flex-col mt-2 md:mt-3 space-y-1 md:space-y-2">
                  <p className="text-red-600 flex items-center gap-1 md:gap-2 text-sm md:text-base">
                    <img
                      src={location1}
                      alt="Location"
                      className="w-4 h-4 md:w-5 md:h-5"
                    />
                    {building.buildingArea || "Location not specified"}
                  </p>
                </div>
                <div className="mt-4 md:mt-6 lg:mt-8">
                  <h2 className="text-lg md:text-xl font-semibold">
                    About the property
                  </h2>
                  <div className="relative">
                    <p
                      className={`text-gray-600 mt-2 md:mt-3 text-sm md:text-base leading-relaxed ${
                        !expandedDescriptions ? "line-clamp-2" : ""
                      }`}
                    >
                      {building.description ||
                        "Nestled in a prime location, this property is the epitome of luxurious living. Designed for those who seek tranquility without compromising on modern conveniences, this property offers a harmonious blend of sophistication, comfort, and timeless elegance."}
                    </p>
                    {building.description && (
                      <button
                        onClick={toggleDescription}
                        className="text-black font-medium mt-1 md:mt-2 hover:underline focus:outline-none text-sm md:text-base"
                      >
                        {expandedDescriptions ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 md:gap-6 lg:gap-24 mt-6 md:mt-8 text-gray-700 text-xs md:text-sm border-b pb-4">
                <p className="flex items-center flex-col gap-1 md:gap-2">
                  <img
                    src={sqft}
                    alt="Sqft"
                    className="w-4 h-4 md:w-5 md:h-5"
                  />
                  Floors: {building.floorsCount || "N/A"}
                </p>
                <p className="flex items-center flex-col gap-1 md:gap-2">
                  <img
                    src={apartment}
                    alt="Type"
                    className="w-4 h-4 md:w-5 md:h-5"
                  />
                  Type: {building.type || "N/A"}
                </p>
              </div>
            </div>

            {/* Right Side - Payment and Amenities */}
            <div>
              <p className="text-lg md:text-xl font-semibold text-black-500 px-3 py-3 md:px-4 md:py-4 text-center w-full md:w-[400px] lg:w-[500px] xl:w-[80%] bg-gradient-to-r from-[#F8D78B] to-red-300 rounded-md shadow-lg xl:ml-[55px]">
                <span className="text-2xl md:text-3xl lg:text-3xl text-black">
                  {formatPrice(building.priceRange)}
                </span>
              </p>

              {/* Book Now Button */}
              <div className="mt-8 md:mt-12 lg:mt-[90px] flex justify-center">
                <button
                  ref={bookNowButtonRef}
                  onClick={handleBookNow}
                  className={`w-full md:w-[80%] bg-black text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-colors ${
                    navbarBookNowButton ? "opacity-50 pointer-events-none" : ""
                  }`}
                  style={{
                    visibility: navbarBookNowButton ? "hidden" : "visible",
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>

          {/* Floor Plans Section - Full Width */}
          <div className="w-screen -ml-[calc(50vw-50%)] bg-gray-100 py-8 mt-8">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-3xl md:text-4xl font-semibold text-center mb-6 md:mb-8">
                FLOOR PLANS
              </h2>

              {/* Tabs */}
              <div className="mb-6 md:mb-10 px-4">
                <div className="w-full overflow-x-auto pb-2 -mb-2 snap-x snap-mandatory scrollbar-hide">
                  <div className="flex w-max md:w-full gap-2 md:gap-4 px-2 md:justify-center">
                    {floorPlanTabs.map((tab) => (
                      <button
                        key={tab.key}
                        disabled={tab.disabled}
                        onClick={() => {
                          setFloorPlanActiveTab(tab.key);
                          setCurrentIndex(0);
                        }}
                        aria-label={`View ${tab.label} floor plans`}
                        className={`
                          flex-shrink-0 px-3 py-2 md:px-4 md:py-3 rounded font-medium text-sm md:text-base 
                          whitespace-nowrap snap-start transition-colors duration-200
                          ${
                            floorPlanActiveTab === tab.key
                              ? "bg-gray-800 text-white shadow-md"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }
                          ${tab.disabled ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Carousel */}
              <div className="flex justify-center">
                <div className="flex items-center gap-4 md:gap-8 w-full max-w-6xl">
                  {/* Left Arrow */}
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    aria-label="Previous floor plan"
                    className={`flex items-center justify-center p-3 bg-gray-700 bg-opacity-70 text-white rounded-full h-10 w-10 md:h-12 md:w-12 ${
                      currentIndex === 0
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-opacity-90"
                    }`}
                  >
                    ←
                  </button>

                  {/* Images */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {building.floorPlans?.[floorPlanActiveTab]
                      ?.slice(
                        currentIndex,
                        currentIndex + (window.innerWidth < 768 ? 1 : 3)
                      )
                      .map((img, idx) => (
                        <div key={idx} className="bg-white rounded shadow p-2">
                          <img
                            src={img}
                            alt={`${floorPlanActiveTab} Plan ${
                              currentIndex + idx + 1
                            }`}
                            className="w-full h-40 md:h-60 object-contain"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = img; // Use imported fallback image
                            }}
                          />
                        </div>
                      ))}
                  </div>

                  {/* Right Arrow */}
                  <button
                    onClick={handleNext}
                    disabled={
                      currentIndex >=
                      (building.floorPlans?.[floorPlanActiveTab]?.length || 0) -
                        (window.innerWidth < 768 ? 1 : 3)
                    }
                    aria-label="Next floor plan"
                    className={`flex items-center justify-center p-3 bg-gray-700 bg-opacity-70 text-white rounded-full h-10 w-10 md:h-12 md:w-12 ${
                      currentIndex >=
                      (building.floorPlans?.[floorPlanActiveTab]?.length || 0) -
                        (window.innerWidth < 768 ? 1 : 3)
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-opacity-90"
                    }`}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="bg-white py-8 mt-8 rounded-lg shadow-sm w-screen -ml-[calc(50vw-50%)]">
            <h2 className="text-3xl md:text-4xl font-semibold text-center mb-6 md:mb-8">
              GALLERY
            </h2>

            {/* Gallery Tabs */}
            <div className="flex justify-start md:justify-center gap-2 md:gap-4 mb-6 md:mb-10 overflow-x-auto px-4 scrollbar-hide">
              {galleryTabs.map((tab) => (
                <button
                  key={tab.key}
                  disabled={tab.disabled}
                  onClick={() => {
                    setGalleryActiveTab(tab.key);
                    setCurrentGalleryIndex(0);
                  }}
                  aria-label={`View ${tab.label} gallery`}
                  className={`flex-shrink-0 px-3 py-2 md:px-4 md:py-2 rounded font-medium text-sm md:text-base ${
                    galleryActiveTab === tab.key
                      ? "bg-gray-800 text-white"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  } ${tab.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Gallery Images */}
            <div className="relative px-4">
              <button
                onClick={handleGalleryPrev}
                disabled={currentGalleryIndex === 0}
                aria-label="Previous gallery image"
                className={`absolute left-0 md:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-3 rounded-full z-10 ${
                  currentGalleryIndex === 0
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-opacity-90"
                }`}
                style={{ width: "40px", height: "40px" }}
              >
                ←
              </button>

              <div className="overflow-hidden">
                <div className="flex justify-center">
                  <div className="w-full max-w-6xl mx-8 flex gap-4">
                    {building.gallery?.[galleryActiveTab]?.length > 0 ? (
                      building.gallery[galleryActiveTab]
                        .slice(
                          currentGalleryIndex,
                          currentGalleryIndex + (window.innerWidth < 768 ? 1 : 3)
                        )
                        .map((img, idx) => (
                          <div key={idx} className="w-full md:w-1/3">
                            <img
                              src={encodeURI(img)}
                              alt={`${galleryActiveTab} view ${currentGalleryIndex + idx + 1}`}
                              className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-md"
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = img; // Use imported fallback image
                              }}
                            />
                          </div>
                        ))
                    ) : (
                      <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
                        <p className="text-gray-500">
                          No images available for {galleryActiveTab}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGalleryNext}
                disabled={
                  currentGalleryIndex >=
                  (building.gallery?.[galleryActiveTab]?.length || 1) -
                    (window.innerWidth < 768 ? 1 : 3)
                }
                aria-label="Next gallery image"
                className={`absolute right-0 md:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-3 rounded-full z-10 ${
                  currentGalleryIndex >=
                  (building.gallery?.[galleryActiveTab]?.length || 1) -
                    (window.innerWidth < 768 ? 1 : 3)
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-opacity-90"
                }`}
                style={{ width: "40px", height: "40px" }}
              >
                →
              </button>

              {building.gallery?.[galleryActiveTab]?.length > 0 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-1 rounded-full text-sm">
                  {currentGalleryIndex + 1} /{" "}
                  {building.gallery[galleryActiveTab].length}
                </div>
              )}
            </div>
          </div>

          {/* Configuration Section */}
          <div className="bg-[#f2f2f2] mt-10 flex flex-col items-center justify-center px-4 py-12 w-screen -ml-[calc(50vw-50%)]">
            <h1 className="text-3xl sm:text-4xl font-semibold text-center text-black mb-6">
              CONFIGURATION
            </h1>

            {/* Price Boxes */}
            {building.configuration && (
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {building.configuration.marketPrice && (
                  <div className="bg-[#dedede] text-gray-700 font-medium px-6 py-2 rounded">
                    Market Price:{" "}
                    <span className="line-through">
                      {formatPrice(building.configuration.marketPrice)}
                    </span>
                  </div>
                )}
                {building.configuration.casagrandPrice && (
                  <div className="bg-[#2b2b2b] text-white font-semibold px-6 py-2 rounded">
                    Builder Price: {formatPrice(building.configuration.casagrandPrice)}
                  </div>
                )}
                {building.configuration.offerPrice && (
                  <div className="bg-[#2b2b2b] text-white font-semibold px-6 py-2 rounded">
                    Offer Price: {formatPrice(building.configuration.offerPrice)}
                  </div>
                )}
              </div>
            )}

            {/* Phase Title */}
            <h2 className="text-lg text-black font-medium mb-6">
              {building.project?.projectName || "Property Details"}
            </h2>

            {/* Table */}
            {building.configuration?.apartmentConfigs?.length > 0 && (
              <div className="overflow-x-auto w-full max-w-6xl">
                <table className="w-full border border-orange-500 text-center">
                  <thead className="bg-[#f2f2f2] text-orange-600 border-b border-orange-500">
                    <tr className="text-sm sm:text-base font-semibold">
                      <th className="py-3 border-r border-orange-500">BHK</th>
                      <th className="py-3 border-r border-orange-500">
                        UNIT TYPE
                      </th>
                      <th className="py-3 border-r border-orange-500">
                        BUILT-UP AREA
                      </th>
                      <th className="py-3 border-r border-orange-500">
                        PRICE PER SQFT
                      </th>
                      <th className="py-3">PRICE RANGE</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-black text-sm sm:text-base">
                    {building.configuration.apartmentConfigs.map(
                      (config, idx) => (
                        <tr key={idx} className="border-t border-orange-500">
                          <td className="py-3 border-r border-orange-500">
                            {config.bhk}
                          </td>
                          <td className="py-3 border-r border-orange-500">
                            {config.unitType}
                          </td>
                          <td className="py-3 border-r border-orange-500">
                            {config.builtUpArea}
                          </td>
                          <td className="py-3 border-r border-orange-500">
                            {config.pricePerSqft}
                          </td>
                          <td className="py-3">{config.priceRange}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Note */}
            <p className="text-xs text-gray-600 mt-4">
              Price Range is mentioned as Basic + Other charges
            </p>
          </div>

          {/* Map Section */}
          <div
            className="mt-8 md:mt-12 w-full max-w-[1450px] mx-auto h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]"
            ref={mapRef}
          >
            <Map building={building} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProperty0;