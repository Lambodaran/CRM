import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Range } from "react-range";
import axios from "axios";
import BASE_URL from "../../service/api";

const propertyTypes = ["Apartment", "Villa", "Plot", "Commercial"];

const PropertiesPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 60000000]); // [minPrice, maxPrice] in rupees
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [showPriceSlider, setShowPriceSlider] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [showStatePopup, setShowStatePopup] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [builders, setBuilders] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [districtError, setDistrictError] = useState(null);

  // Parse price to numerical value
  const parsePrice = (price) => {
    if (!price) return null;
    if (typeof price === "number") return price;
    if (typeof price !== "string") return null;

    const normalizedPrice = price.toLowerCase().replace(/\s+/g, "");
    const match = normalizedPrice.match(/(\d+\.?\d*)\s*(cr|crore|l|lac|lakh)?/i);
    if (!match) return null;

    let value = parseFloat(match[1]);
    const unit = match[2];
    if (unit === "cr" || unit === "crore") value *= 10000000;
    else if (unit === "l" || unit === "lac" || unit === "lakh") value *= 100000;
    else if (value >= 10000) return value;
    else return null;

    return value;
  };

  // Get human-readable price range string
  const getPriceRangeString = ([minPrice, maxPrice]) => {
    const minValueInCrores = (parseFloat(minPrice) / 10000000).toFixed(1);
    const maxValueInCrores = (parseFloat(maxPrice) / 10000000).toFixed(1);
    return minPrice === maxPrice ? `₹${minValueInCrores} Cr` : `₹${minValueInCrores} - ₹${maxValueInCrores} Cr`;
  };

  // Fetch properties and builders
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [propertiesResponse, buildersResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/properties/project`),
          axios.get(`${BASE_URL}/api/properties/builder-profile`),
        ]);

        if (!propertiesResponse.ok) {
          throw new Error("Failed to fetch properties");
        }
        const propertiesData = await propertiesResponse.json();
        setProperties(propertiesData);
        setFilteredProperties(propertiesData);

        if (!Array.isArray(buildersResponse.data)) {
          throw new Error("Invalid data format from builders API");
        }
        setBuilders(buildersResponse.data);
        setDistrictError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update districts based on selected state
  useEffect(() => {
    if (selectedState && builders.length > 0) {
      setLoadingDistricts(true);
      try {
        const normalizedSelectedState = selectedState.trim().toLowerCase();
        const stateBuilders = builders.filter(
          (builder) =>
            builder.address?.state?.trim().toLowerCase() === normalizedSelectedState
        );

        const cityMap = new Map();
        stateBuilders.forEach((builder) => {
          if (builder.address?.city) {
            const normalizedCity = builder.address.city.trim().toLowerCase();
            cityMap.set(normalizedCity, builder.address.city);
          }
        });

        const uniqueCities = Array.from(cityMap.values())
          .map((city) => ({ id: city, name: city }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setDistricts(uniqueCities);
        setSelectedDistrict("");
        setDistrictError(null);
      } catch (error) {
        setDistrictError("Failed to load cities. Please try again.");
        console.error("Error filtering cities:", error);
      } finally {
        setLoadingDistricts(false);
      }
    } else {
      setDistricts([]);
      setSelectedDistrict("");
    }
  }, [selectedState, builders]);

  // Filter properties based on all criteria
  const handleSearch = () => {
    let filtered = [...properties];

    if (selectedState) {
      filtered = filtered.filter((property) => {
        const state = property.location?.state || "";
        return state.trim().toLowerCase() === selectedState.trim().toLowerCase();
      });
    }

    if (selectedDistrict) {
      filtered = filtered.filter((property) => {
        const city = property.location?.city || "";
        return city.trim().toLowerCase() === selectedDistrict.trim().toLowerCase();
      });
    }

    if (propertyType) {
      filtered = filtered.filter((property) => property.propertyType === propertyType);
    }

    if (priceRange[0] > 0 || priceRange[1] < 60000000) {
      filtered = filtered.filter((property) => {
        const price = parsePrice(property.price);
        return price !== null && price >= priceRange[0] && price <= priceRange[1];
      });
    }

    setFilteredProperties(filtered);
    setIsFilterApplied(
      selectedState || selectedDistrict || propertyType || priceRange[0] > 0 || priceRange[1] < 60000000
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedState("");
    setSelectedDistrict("");
    setPropertyType("");
    setPriceRange([0, 60000000]);
    setIsFilterApplied(false);
    setShowPriceSlider(false);
    setShowStatePopup(false);
    setFilteredProperties(properties);
  };

  const handlePropertyClick = (propertyId) => {
    console.log("Navigating with property ID:", propertyId);
    navigate("/userbuilding", { state: { propertyId } });
  };

  const formatLocation = (location) => {
    if (!location) return "Location not available";
    if (typeof location === "string") return location;
    return `${location.area || ""}, ${location.city || ""} ${
      location.pincode ? `- ${location.pincode}` : ""
    }`.trim();
  };

  // Get unique states from builders
  const states = Array.from(
    new Map(
      builders.map((builder) => [
        builder.address?.state?.trim().toLowerCase(),
        builder.address?.state,
      ])
    ).values()
  )
    .filter(Boolean)
    .map((state) => ({ id: state, name: state }))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (filteredProperties.length === 0 && !isFilterApplied) {
    return (
      <div className="max-w-7xl mx-auto p-4 text-center">
        No properties found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Filter Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Properties</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* State Filter */}
          <div className="flex flex-col">
            <label htmlFor="state-select" className="text-sm font-semibold text-gray-700 mb-1">
              State
            </label>
            <button
              id="state-select"
              className="relative bg-white border border-gray-300 rounded-lg w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-500"
              onClick={() => setShowStatePopup(true)}
              aria-label={`Select state, current: ${selectedState || "Not set"}`}
            >
              <span>{selectedState || "Select State"}</span>
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

          {/* Location (District) Filter */}
          <div className="flex flex-col">
            <label htmlFor="district-select" className="text-sm font-semibold text-gray-700 mb-1">
              Location
            </label>
            <select
              id="district-select"
              className="bg-white border border-gray-300 rounded-lg w-full px-3 py-2 text-sm text-gray-500 focus:outline-none"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedState || loadingDistricts}
              aria-label="Select district"
            >
              <option value="">{selectedState ? "Select District" : "Select State First"}</option>
              {loadingDistricts ? (
                <option disabled>Loading districts...</option>
              ) : districtError ? (
                <option disabled>{districtError}</option>
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
          <div className="flex flex-col">
            <label htmlFor="property-type-select" className="text-sm font-semibold text-gray-700 mb-1">
              Property Type
            </label>
            <select
              id="property-type-select"
              className="bg-white border border-gray-300 rounded-lg w-full px-3 py-2 text-sm text-gray-500 focus:outline-none"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              aria-label="Select property type"
            >
              <option value="">Select Property Type</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="flex flex-col">
            <label htmlFor="price-range-select" className="text-sm font-semibold text-gray-700 mb-1">
              Price Range
            </label>
            <button
              id="price-range-select"
              className="relative bg-white border border-gray-300 rounded-lg w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-500"
              onClick={() => setShowPriceSlider(true)}
              aria-label={`Select price range, current: ${getPriceRangeString(priceRange)}`}
            >
              <span>{getPriceRangeString(priceRange)}</span>
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
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            aria-label="Apply filters"
          >
            Apply Filters
          </button>
          {isFilterApplied && (
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Applied Filters */}
        {isFilterApplied && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {selectedState && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                State: {selectedState}
              </span>
            )}
            {selectedDistrict && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                Location: {selectedDistrict}
              </span>
            )}
            {propertyType && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                Type: {propertyType}
              </span>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 60000000) && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                Price: {getPriceRangeString(priceRange)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* State Popup */}
      {showStatePopup && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowStatePopup(false)}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm bg-white rounded-lg shadow-lg p-4 z-50"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="state-dialog-title"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 id="state-dialog-title" className="text-lg font-bold text-gray-700 mb-4">
              Select State
            </h3>
            <div className="max-h-64 overflow-y-auto">
              {states.map((state) => (
                <button
                  key={state.id}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setSelectedState(state.name);
                    setShowStatePopup(false);
                  }}
                  aria-label={`Select ${state.name}`}
                >
                  {state.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowStatePopup(false)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              aria-label="Close state selector"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Price Range Slider Popup */}
      {showPriceSlider && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowPriceSlider(false)}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm bg-white rounded-lg shadow-lg p-4 z-50"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="price-range-dialog-title"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 id="price-range-dialog-title" className="text-lg font-bold text-gray-700 mb-4">
              Select Price Range
            </h3>
            <Range
              step={1000000}
              min={0}
              max={60000000}
              values={priceRange}
              onChange={(values) => {
                console.log("Slider values changed to:", values);
                setPriceRange(values);
              }}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  className="h-2 bg-gray-200 rounded-full w-full"
                  style={{ ...props.style }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props, index, value, isDragged }) => (
                <div
                  {...props}
                  className="relative w-4 h-4 bg-blue-600 rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    ...props.style,
                    cursor: "grab",
                  }}
                  aria-label={index === 0 ? "Minimum price" : "Maximum price"}
                >
                  {isDragged && (
                    <div
                      className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap"
                      style={{ zIndex: 10 }}
                    >
                      ₹{(value / 10000000).toFixed(1)} Cr
                    </div>
                  )}
                </div>
              )}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>₹0 Cr</span>
              <span>₹{(60000000 / 10000000).toFixed(1)} Cr</span>
            </div>
            <button
              onClick={() => setShowPriceSlider(false)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              aria-label="Apply price range"
            >
              Apply
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Property Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No properties found matching the filter criteria.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-4 text-blue-600 hover:underline"
            aria-label="Clear all filters"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredProperties.map((property, index) => {
            const firstPhoto = property.media?.photos?.[0]?.url || "https://via.placeholder.com/400";

            return (
              <motion.div
                key={property._id}
                className="bg-white rounded-lg overflow-hidden cursor-pointer w-[90%] mx-auto"
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                }}
                onClick={() => handlePropertyClick(property._id)}
              >
                <img
                  src={firstPhoto}
                  alt={property.projectName || "Property"}
                  className="w-full h-40 sm:h-48 md:h-60 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400";
                  }}
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold">
                    {property.projectName || "Unnamed Project"}
                  </h2>
                  <p className="text-lg mt-1 text-black font-semibold">
                    {property.price
                      ? typeof property.price === "number"
                        ? `₹${parseFloat(property.price).toLocaleString()}`
                        : property.price
                      : "Contact for Price"}
                  </p>
                  <p className="text-sm mt-1 text-gray-500 flex items-center gap-2">
                    📍 {formatLocation(property.location)}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      📐 {property.sqft || "Unknown Size"} Sq.ft
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-gray-600">
                    Type: {property.propertyType || "Not specified"}
                  </p>
                  <p className="text-sm mt-1 text-gray-600">
                    Possession: {property.possessionDate ? new Date(property.possessionDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;