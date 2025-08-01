import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { Range } from "react-range";
import BASE_URL from "../../service/api";
import { User } from "lucide-react";

const propertyTypes = ["All", "Apartment", "Villa", "Plot", "Commercial"];

const UserBuilder = ({ selectedStateId, searchData, setSelectedStateId, setSearchData }) => {
  const [properties, setProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [selectedState, setSelectedState] = useState(() => localStorage.getItem("selectedState") || "");
  const [selectedDistrict, setSelectedDistrict] = useState(() => localStorage.getItem("selectedDistrict") || "");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(() => localStorage.getItem("propertyTypeFilter") || "");
  const [priceRange, setPriceRange] = useState([0, 1000000000]); // [minPrice, maxPrice] in rupees (100 Cr)
  const [showPriceSlider, setShowPriceSlider] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [stateError, setStateError] = useState(null);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [districtError, setDistrictError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const navigate = useNavigate();

  // Parse price string to numerical value
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

  // Fetch states from builder profiles
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      setStateError(null);
      try {
        const response = await axios.get(`${BASE_URL}/api/properties/builder-profile`);
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid data format received from API");
        }

        const stateMap = new Map();
        response.data.forEach((builder) => {
          if (builder.address?.state) {
            const normalizedState = builder.address.state.trim().toLowerCase();
            stateMap.set(normalizedState, builder.address.state);
          }
        });

        const uniqueStates = Array.from(stateMap.entries())
          .map(([_, stateName]) => ({
            id: stateName,
            name: stateName,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setStates(uniqueStates);
      } catch (error) {
        setStateError("Failed to fetch states. Please try again.");
        console.error("Error fetching states:", error);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const url = `${BASE_URL}/api/propertiesGet/`;
        const response = await axios.get(url);
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid data format from properties API");
        }
        setAllProperties(response.data);
        setProperties(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch properties. Please try again.");
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Update districts based on selected state
  useEffect(() => {
    if (selectedState && allProperties.length > 0) {
      setLoadingDistricts(true);
      try {
        const normalizedSelectedState = selectedState.trim().toLowerCase();
        const stateProperties = allProperties.filter(
          (property) =>
            property.address?.state?.trim().toLowerCase() === normalizedSelectedState
        );

        const cityMap = new Map();
        stateProperties.forEach((property) => {
          if (property.address?.city) {
            const normalizedCity = property.address.city.trim().toLowerCase();
            cityMap.set(normalizedCity, property.address.city);
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
  }, [selectedState, allProperties]);

  // Sync with props and localStorage
  useEffect(() => {
    const storedStateId = localStorage.getItem("selectedStateId");
    if (selectedStateId && selectedStateId !== selectedState) {
      setSelectedState(selectedStateId);
      localStorage.setItem("selectedState", selectedStateId);
    } else if (storedStateId && !selectedState) {
      setSelectedState(storedStateId);
    }

    if (searchData) {
      setSelectedDistrict(searchData.districtid || "");
      setPropertyTypeFilter(searchData.propertytype || "");
      if (searchData.pricerange && typeof searchData.pricerange === "object") {
        const maxPrice = parseFloat(searchData.pricerange.max) || 1000000000;
        const minPrice = parseFloat(searchData.pricerange.min) || 0;
        setPriceRange([minPrice, maxPrice]);
      }
      localStorage.setItem("selectedDistrict", searchData.districtid || "");
      localStorage.setItem("propertyTypeFilter", searchData.propertytype || "");
      localStorage.setItem("searchData", JSON.stringify(searchData));
    }
    localStorage.setItem("selectedStateId", selectedStateId || "");
  }, [selectedStateId, searchData]);

  // Persist filter states to localStorage
  useEffect(() => {
    localStorage.setItem("selectedState", selectedState);
    localStorage.setItem("selectedDistrict", selectedDistrict);
    localStorage.setItem("propertyTypeFilter", propertyTypeFilter);
    localStorage.setItem("priceRangeFilter", JSON.stringify(priceRange));
  }, [selectedState, selectedDistrict, propertyTypeFilter, priceRange]);

  // Filter properties
  const handleSearch = () => {
    let filtered = [...allProperties];

    if (selectedState) {
      const normalizedSelectedState = selectedState.trim().toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.address?.state?.trim().toLowerCase() === normalizedSelectedState
      );
    }

    if (selectedDistrict) {
      const normalizedSelectedCity = selectedDistrict.trim().toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.address?.city?.trim().toLowerCase() === normalizedSelectedCity
      );
    }

    if (propertyTypeFilter && propertyTypeFilter !== "All") {
      filtered = filtered.filter((property) =>
        property.projects?.some(
          (project) =>
            project.propertyType?.toLowerCase() === propertyTypeFilter.toLowerCase()
        )
      );
    }

    if (priceRange[0] > 0 || priceRange[1] < 1000000000) {
      filtered = filtered.filter((property) => {
        if (!property.projects || !Array.isArray(property.projects)) return false;
        return property.projects.some((project) => {
          if (!project.buildings || !Array.isArray(project.buildings)) return false;
          return project.buildings.some((building) => {
            const buildingPrice = parsePrice(building.priceRange);
            return buildingPrice !== null && buildingPrice >= priceRange[0] && buildingPrice <= priceRange[1];
          });
        });
      });
    }

    setProperties(filtered);
    setIsFilterApplied(
      selectedState || selectedDistrict || (propertyTypeFilter && propertyTypeFilter !== "All") || priceRange[0] > 0 || priceRange[1] < 1000000000
    );

    if (setSearchData) {
      const searchdata = {
        districtid: selectedDistrict,
        propertytype: propertyTypeFilter,
        pricerange: { min: priceRange[0], max: priceRange[1] },
      };
      setSearchData(searchdata);
      localStorage.setItem("searchData", JSON.stringify(searchdata));
    }
    if (setSelectedStateId) {
      setSelectedStateId(selectedState);
      localStorage.setItem("selectedStateId", selectedState);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedState("");
    setSelectedDistrict("");
    setPropertyTypeFilter("");
    setPriceRange([0, 1000000000]);
    setShowPriceSlider(false);
    setSelectedStateId(null);
    if (setSearchData) {
      setSearchData(null);
    }
    localStorage.removeItem("selectedState");
    localStorage.removeItem("selectedStateId");
    localStorage.removeItem("selectedDistrict");
    localStorage.removeItem("propertyTypeFilter");
    localStorage.removeItem("priceRangeFilter");
    localStorage.removeItem("searchData");
    setProperties(allProperties); // Ensure properties are reset to full list
    setIsFilterApplied(false);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 mt-10" id="apartments">
      {/* Filter Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Properties</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* State Filter */}
          <div className="flex flex-col">
            <label htmlFor="state-select" className="text-sm font-semibold text-gray-700 mb-1">
              State
            </label>
            <select
              id="state-select"
              className="bg-white border border-gray-300 rounded-lg w-full px-3 py-2 text-sm text-gray-500 focus:outline-none"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedStateId(e.target.value);
              }}
              disabled={loadingStates}
              aria-label="Select state"
            >
              <option value="">Select State</option>
              {loadingStates ? (
                <option disabled>Loading states...</option>
              ) : stateError ? (
                <option disabled>{stateError}</option>
              ) : (
                states.map((state) => (
                  <option key={state.id} value={state.name}>
                    {state.name}
                  </option>
                ))
              )}
            </select>
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
              <option value="">
                {selectedState ? "Select District" : "Select State First"}
              </option>
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
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
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
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition"
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
            {propertyTypeFilter && propertyTypeFilter !== "All" && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                Type: {propertyTypeFilter}
              </span>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 1000000000) && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                Price: {getPriceRangeString(priceRange)}
              </span>
            )}
          </div>
        )}
      </div>

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
              max={1000000000}
              values={priceRange}
              onChange={(values) => setPriceRange(values)}
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
              <span>₹{(1000000000 / 10000000).toFixed(1)} Cr</span>
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
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading properties...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
              }}
              className="group relative w-full h-[300px] flex flex-col justify-between overflow-hidden shadow-md transition-all duration-500 hover:shadow-lg bg-white rounded-lg border border-gray-200"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                navigate("/builder", {
                  state: { builderId: property._id },
                });
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  navigate("/builder", {
                    state: { builderId: property._id },
                  });
                }
              }}
              aria-label={`View details for ${property.companyName}`}
            >
              {/* Image Section */}
              <div className="relative h-[180px] overflow-hidden shadow-sm flex items-center justify-center">
                <img
                  src={
                    property.coverPhotos?.length > 0
                      ? property.coverPhotos[0].url
                      : property.logo ||
                        "https://via.placeholder.com/300x180?text=No+Image"
                  }
                  alt={property.companyName}
                  className="w-[180px] h-[150px] object-contain"
                  loading="lazy"
                />
              </div>

              {/* Content Section */}
              <div className="p-4 flex flex-col flex-grow justify-between">
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 break-words text-center">
                    {property.companyName}
                  </h3>
                </div>

                {/* Button */}
                <button
                  className="mt-4 w-full bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center"
                  aria-hidden="true"
                >
                  View Builder Details
                  <span className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No properties found matching your filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-4 text-orange-600 hover:underline"
            aria-label="Clear all filters"
          >
            Clear all filters
          </button>
        </div>
      )}
    </section>
  );
};

export default UserBuilder;