import React, { useState, useEffect } from "react";
import Popup from "./Popup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import NavLogo from "../HomePage/Assets/footerlogo copy.png";
import homepageimage from "../HomePage/Assets/HomeImage.png";
import build2 from "../HomePage/Assets/build3.jpg";
import build3 from "../HomePage/Assets/build4.jpeg";
import BASE_URL from "../../service/api";

const heroSlides = [
  {
    id: 1,
    title: "Luxury Living Redefined",
    description: "Discover our premium residential developments featuring world-class amenities and architectural brilliance in the heart of the city.",
    image: homepageimage,
  },
  {
    id: 2,
    title: "Commercial Excellence",
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


const PropertyHighlights = ({
  scrollToApartments,
  scrollToIndividualHouse,
  scrollToTopProjects,
  selectedStateId,
  setSelectedStateId,
  setSelectedDistrictId,
  setPropertyTypeFilter,
  setPriceRangeFilter,
  setSearchData,
}) => {
  const [activeTab, setActiveTab] = useState("BUY");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [priceRange, setPriceRange] = useState("");
  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [districtError, setDistrictError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [priceRanges, setPriceRanges] = useState([]);
  const [loadingPriceRanges, setLoadingPriceRanges] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [builders, setBuilders] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Initialize selectedStateId from localStorage and check popup visibility
 useEffect(() => {
  // Check if it's a fresh session (new tab or browser restart)
  const isFreshSession = !sessionStorage.getItem('isPersisted');
  
  // Get stored state ID (if it exists)
  const storedStateId = localStorage.getItem('selectedStateId');

  if (isFreshSession) {
    // Clear localStorage for fresh sessions
    localStorage.removeItem('selectedStateId');
    sessionStorage.setItem('isPersisted', 'true');
  } else if (storedStateId && setSelectedStateId) {
    // Restore selectedStateId from localStorage for returning sessions
    setSelectedStateId(storedStateId);
  }

  // Check if popup has already been shown in this session
  const hasShownPopup = sessionStorage.getItem('hasShownPopup');
  if (!hasShownPopup && !storedStateId) {
    setShowPopup(true);
    sessionStorage.setItem('hasShownPopup', 'true');
  }
}, [setSelectedStateId]);

  // Fetch builders and price ranges
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingDistricts(true);
        setLoadingPriceRanges(true);

        const buildersResponse = await axios.get(
          `${BASE_URL}/api/properties/builder-profile`
        );

        if (!Array.isArray(buildersResponse.data)) {
          throw new Error("Invalid data format received from builders API");
        }
        setBuilders(buildersResponse.data);

        const buildingsResponse = await axios.get(
          `${BASE_URL}/api/properties/buildings`
        );

        if (!Array.isArray(buildingsResponse.data)) {
          throw new Error("Invalid data format received from buildings API");
        }

        const uniquePriceRanges = [
          ...new Set(
            buildingsResponse.data
              .map((building) => building.priceRange)
              .filter((range) => range)
          ),
        ].sort((a, b) => {
          const extractNumber = (str) =>
            parseFloat(str.replace(/[^0-9.]/g, ""));
          return extractNumber(a) - extractNumber(b);
        });

        setPriceRanges(uniquePriceRanges);
        if (uniquePriceRanges.length > 0) {
          setPriceRange(uniquePriceRanges[0]);
        }

        setDistrictError(null);
      } catch (error) {
        setDistrictError("Failed to fetch data. Please try again.");
        console.error("Error fetching data:", error);
      } finally {
        setLoadingDistricts(false);
        setLoadingPriceRanges(false);
      }
    };

    fetchData();
  }, []);

  // Update districts when state changes
  useEffect(() => {
    if (selectedStateId && Array.isArray(builders) && builders.length > 0) {
      setLoadingDistricts(true);
      try {
        const normalizedSelectedState = selectedStateId.trim().toLowerCase();
        const stateBuilders = builders.filter(
          (builder) =>
            builder.address?.state &&
            builder.address.state.trim().toLowerCase() ===
              normalizedSelectedState
        );

        const cityMap = new Map();
        stateBuilders.forEach((builder) => {
          if (builder.address?.city) {
            const normalizedCity = builder.address.city.trim().toLowerCase();
            if (!cityMap.has(normalizedCity)) {
              cityMap.set(normalizedCity, builder.address.city);
            }
          }
        });

        const uniqueCities = Array.from(cityMap.entries()).map(
          ([_, cityName]) => ({
            id: cityName,
            name: cityName,
          })
        );

        uniqueCities.sort((a, b) => a.name.localeCompare(b.name));
        setDistricts(uniqueCities);
        setDistrictError(null);
      } catch (error) {
        setDistrictError("Failed to filter cities. Please try again.");
        console.error("Error filtering cities:", error);
      } finally {
        setLoadingDistricts(false);
      }
    } else {
      setDistricts([]);
      setSelectedDistrict("");
    }
  }, [selectedStateId, builders]);

  const handleSearch = () => {
    const searchdata = {
      districtid: selectedDistrict,
      propertytype: propertyType,
      pricerange: priceRange,
    };
    console.log(searchdata);

    if (setPropertyTypeFilter) setPropertyTypeFilter(propertyType);
    if (setPriceRangeFilter) setPriceRangeFilter(priceRange);
    if (setSearchData) setSearchData(searchdata);

    if (scrollToApartments) scrollToApartments();
    setIsMobileFiltersOpen(false); // Close filters after search on mobile
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mobile filter toggle
  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  return (
    <div className="relative w-full h-[80dvh] sm:h-[85vh] md:h-[100dvh]">
  {/* Image Slider */}
  <div className="absolute inset-0 z-0">
    {heroSlides.map((slide, index) => (
      <div
        key={slide.id}
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          index === currentSlide ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={index !== currentSlide}
      >
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover"
          loading={index === 0 ? "eager" : "lazy"}
        />
      </div>
    ))}
  </div>


      
 {/* Navbar */}
<nav className="absolute top-0 left-0 w-full bg-transparent text-white p-3 sm:p-4 z-30">
  <div className="container mx-auto flex justify-between items-center">
    {/* Logo - Left side */}
    <div className="flex items-center">
      <img
        src={NavLogo}
        alt="ABV Logo"
        className="w-14 sm:w-16 md:w-20 lg:w-24 h-auto"
      />
    </div>

    {/* Desktop Menu - Center */}
    <div className="hidden md:flex space-x-4 lg:space-x-6 items-center mx-auto">
      <button onClick={scrollToApartments} className="text-white hover:text-black drop-shadow-md text-sm lg:text-base">
        Apartments
      </button>
      <button onClick={scrollToTopProjects} className="text-white hover:text-black drop-shadow-md text-sm lg:text-base">
        Ongoing Projects
      </button>
      <button onClick={scrollToIndividualHouse} className="text-white hover:text-black drop-shadow-md text-sm lg:text-base">
        Individual House
      </button>
      <button onClick={() => navigate("/contact")} className="text-white hover:text-black drop-shadow-md text-sm lg:text-base">
        Contact
      </button>
    </div>
{/* Right side elements (Location and Login) */}
<div className="flex items-center space-x-2 sm:space-x-4">
  {/* Location - Shows on all screens */}
  <div className="flex items-center space-x-1">
    <FaMapMarkerAlt className="text-white text-sm" />
    <span className="text-white text-xs sm:text-sm">
      {selectedStateId || "Location"}
    </span>
  </div>
  
  {/* Login Button */}
  <Link to="/login">
    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition shadow-md text-xs sm:text-sm">
      Login
    </button>
  </Link>


      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center ml-2">
        <button
          className="text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>
    </div>
  </div>

  {/* Mobile Menu Dropdown */}
  {isMobileMenuOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-[90%] max-w-xs bg-white rounded-md shadow-lg py-1 z-50">
        <div className="flex flex-col items-center">
          <button
            onClick={() => {
              scrollToApartments();
              setIsMobileMenuOpen(false);
            }}
            className="w-full px-4 py-3 text-center text-gray-700 hover:bg-gray-100 text-base font-medium"
          >
            Apartments
          </button>
          <button
            onClick={() => {
              scrollToTopProjects();
              setIsMobileMenuOpen(false);
            }}
            className="w-full px-4 py-3 text-center text-gray-700 hover:bg-gray-100 text-base font-medium"
          >
            Ongoing Projects
          </button>
          <button
            onClick={() => {
              scrollToIndividualHouse();
              setIsMobileMenuOpen(false);
            }}
            className="w-full px-4 py-3 text-center text-gray-700 hover:bg-gray-100 text-base font-medium"
          >
            Individual House
          </button>
          <button
            onClick={() => {
              navigate("/contact");
              setIsMobileMenuOpen(false);
            }}
            className="w-full px-4 py-3 text-center text-gray-700 hover:bg-gray-100 text-base font-medium"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  )}
</nav>

      {/* Text Content */}
      <div className="container mx-auto h-full text-white p-4 sm:p-6 pt-24 sm:pt-32 md:pt-40 relative z-20">
        {heroSlides[currentSlide]?.title && (
          <>
            <h1 className="font-inter font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[67px] leading-[122%] tracking-[0%] text-black mb-2">
              {heroSlides[currentSlide].title.split(" ")[0]}
            </h1>
            <span className="font-inter font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[67px] leading-[122%] tracking-[0%] text-black mb-4 sm:mb-6 block">
              {heroSlides[currentSlide].title.split(" ").slice(1).join(" ")}
            </span>
          </>
        )}
        <div className="w-full sm:w-[400px] md:w-[500px]">
          <p className="font-inter font-light text-base sm:text-lg md:text-xl lg:text-[24px] leading-[122%] tracking-[0%] text-black">
            {heroSlides[currentSlide]?.description || ""}
          </p>
        </div>
      </div>

      {/* Bottom Search Card */}
      <div className="absolute -bottom-12 sm:-bottom-10 left-1/2 transform -translate-x-1/2 w-[95%] max-w-[90vw] sm:max-w-[700px] md:max-w-[1000px] bg-[#EDEAEA] rounded-3xl p-6 sm:p-12 md:p-4 z-20">
        {/* Tabs */}
        <div className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 bg-[#EDEAEA] rounded-lg mt-2 p-2 sm:p-3">
          <span className="cursor-pointer px-4 sm:px-6 py-1 sm:py-2 bg-opacity-30 rounded-t-lg text-black text-sm sm:text-base">
            {activeTab}
          </span>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="md:hidden flex justify-center mb-2">
          <button
            onClick={toggleMobileFilters}
            className="px-4 py-2 bg-[#EDEAEA] text-black rounded-lg flex items-center"
          >
            {isMobileFiltersOpen ? "Hide Filters" : "Show Filters"}
            <svg
              className={`w-4 h-4 ml-2 transition-transform ${isMobileFiltersOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Filters - Desktop */}
        <div className="hidden md:flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 pt-3 sm:pt-6">
          {/* State Filter */}
          <div className="flex flex-col text-left w-full sm:w-auto">
            <label className="text-gray-700 text-lg sm:text-xl md:text-2xl font-bold">State</label>
            <button
              className="relative mt-1 sm:mt-2 bg-[#EDEAEA] rounded-lg w-full text-left flex items-center justify-between px-3 py-2"
              onClick={() => setShowPopup(true)}
            >
              {selectedStateId ? (
                <span className="text-xs sm:text-sm">{selectedStateId}</span>
              ) : (
                <span className="text-gray-500 text-xs sm:text-sm bg-transparent focus:outline-none w-full">
                  Select State
                </span>
              )}
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Location Filter */}
          <div className="flex flex-col text-left w-full sm:w-auto">
            <label className="text-gray-700 text-lg sm:text-xl md:text-2xl font-bold">Location</label>
            <select
              className="text-gray-500 text-xs sm:text-sm bg-transparent focus:outline-none w-full mt-1 sm:mt-2 px-3 py-2 rounded-lg"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedStateId || loadingDistricts}
            >
              <option value="">
                {selectedStateId ? "Select District" : "Select State First"}
              </option>
              {loadingDistricts ? (
                <option>Loading districts...</option>
              ) : districtError ? (
                <option>Error loading districts</option>
              ) : (
                districts.map((district) => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Property Type Filter */}
          <div className="flex flex-col text-left w-full sm:w-auto">
            <label className="text-gray-700 text-lg sm:text-xl md:text-2xl font-bold">Property Type</label>
            <select
              className="text-gray-500 text-xs sm:text-sm bg-transparent focus:outline-none w-full mt-1 sm:mt-2 px-3 py-2  rounded-lg"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="flex flex-col text-left w-full sm:w-auto">
            <label className="text-gray-700 text-lg sm:text-xl md:text-2xl font-bold">Price Range</label>
            <select
              className="text-gray-500 text-xs sm:text-sm bg-transparent focus:outline-none w-full mt-1 sm:mt-2 px-3 py-2  rounded-lg"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              disabled={loadingPriceRanges}
            >
              {loadingPriceRanges ? (
                <option>Loading price ranges...</option>
              ) : priceRanges.length > 0 ? (
                priceRanges.map((range, index) => (
                  <option key={index} value={range}>
                    {range}
                  </option>
                ))
              ) : (
                <option>No price ranges available</option>
              )}
            </select>
          </div>
        </div>

        {/* Filters - Mobile (Collapsible) */}
        {isMobileFiltersOpen && (
          <div className="md:hidden grid grid-cols-2 gap-3 pt-3">
            {/* State Filter */}
            <div className="flex flex-col text-left">
              <label className="text-gray-700 text-sm font-bold">State</label>
              <button
                className="relative mt-1 bg-[#EDEAEA] rounded-lg w-full text-left flex items-center justify-between px-3 py-2 border border-gray-300"
                onClick={() => setShowPopup(true)}
              >
                {selectedStateId ? (
                  <span className="text-xs">{selectedStateId}</span>
                ) : (
                  <span className="text-gray-500 text-xs bg-transparent focus:outline-none w-full">
                    Select State
                  </span>
                )}
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Location Filter */}
            <div className="flex flex-col text-left">
              <label className="text-gray-700 text-sm font-bold">Location</label>
              <select
                className="text-gray-500 text-xs bg-transparent focus:outline-none w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedStateId || loadingDistricts}
              >
                <option value="">
                  {selectedStateId ? "Select District" : "Select State First"}
                </option>
                {loadingDistricts ? (
                  <option>Loading districts...</option>
                ) : districtError ? (
                  <option>Error loading districts</option>
                ) : (
                  districts.map((district) => (
                    <option key={district.id} value={district.name}>
                      {district.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Property Type Filter */}
            <div className="flex flex-col text-left">
              <label className="text-gray-700 text-sm font-bold">Property Type</label>
              <select
                className="text-gray-500 text-xs bg-transparent focus:outline-none w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="flex flex-col text-left">
              <label className="text-gray-700 text-sm font-bold">Price Range</label>
              <select
                className="text-gray-500 text-xs bg-transparent focus:outline-none w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                disabled={loadingPriceRanges}
              >
                {loadingPriceRanges ? (
                  <option>Loading price ranges...</option>
                ) : priceRanges.length > 0 ? (
                  priceRanges.map((range, index) => (
                    <option key={index} value={range}>
                      {range}
                    </option>
                  ))
                ) : (
                  <option>No price ranges available</option>
                )}
              </select>
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handleSearch}
            disabled={!selectedDistrict || !priceRange}
            className={`px-8 sm:px-10 md:px-12 py-2 rounded-xl transition text-sm sm:text-base ${
              selectedDistrict && priceRange
                ? "bg-black text-white "
                : "bg-[#302F2F] text-white hover:bg-[#424141] cursor-not-allowed"
            }`}
          >
            Search
          </button>
        </div>
      </div>

      <Popup
        selectedLocation={selectedStateId}
        setSelectedLocation={setSelectedStateId}
        isVisible={showPopup}
        setIsVisible={setShowPopup}
      />
    </div>
  );
};

export default PropertyHighlights;