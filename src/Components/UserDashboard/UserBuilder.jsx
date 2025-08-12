import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { Range } from "react-range";
import BASE_URL from "../../service/api";
import { User } from "lucide-react";

const propertyTypes = ["Apartment", "Villa", "Plot", "Commercial"];

const UserBuilder = ({ selectedStateId, searchData, setSelectedStateId, setSearchData }) => {
  const [properties, setProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [selectedState, setSelectedState] = useState(() => localStorage.getItem("selectedState") || "");
  const [selectedDistrict, setSelectedDistrict] = useState(() => localStorage.getItem("selectedDistrict") || "");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(() => localStorage.getItem("propertyTypeFilter") || "");
  const [priceRange, setPriceRange] = useState([500000, 1000000000]);
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
  const [displayState, setDisplayState] = useState("");
  const [displayDistrict, setDisplayDistrict] = useState("");
  const [displayPropertyType, setDisplayPropertyType] = useState("");
  const navigate = useNavigate();

  // ... (parsePrice, getPriceRangeString, useEffect hooks, handleSearch, clearAllFilters remain unchanged)

  useEffect(() => {
    setDisplayState(selectedState);
  }, [selectedState]);

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
    if (maxPrice < 10000000) {
      return `₹${(minPrice / 100000).toFixed(1)} - ₹${(maxPrice / 100000).toFixed(1)} L`;
    } else if (minPrice < 10000000) {
      return `₹${(minPrice / 100000).toFixed(1)} L - ₹${(maxPrice / 10000000).toFixed(2)} Cr`;
    } else {
      return `₹${(minPrice / 10000000).toFixed(2)} - ₹${(maxPrice / 10000000).toFixed(2)} Cr`;
    }
  };

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
        setDisplayDistrict("");
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
      setDisplayDistrict("");
    }
  }, [selectedState, allProperties]);

  useEffect(() => {
    const storedStateId = localStorage.getItem("selectedStateId");
    if (selectedStateId && selectedStateId !== selectedState) {
      setSelectedState(selectedStateId);
      setDisplayState(selectedStateId);
      localStorage.setItem("selectedState", selectedStateId);
    } else if (storedStateId && !selectedState) {
      setSelectedState(storedStateId);
      setDisplayState(storedStateId);
    }

    if (searchData) {
      setSelectedDistrict(searchData.districtid || "");
      setDisplayDistrict(searchData.districtid || "");
      setPropertyTypeFilter(searchData.propertytype || "");
      setDisplayPropertyType(searchData.propertytype || "");
      if (searchData.pricerange && typeof searchData.pricerange === "object") {
        const maxPrice = parseFloat(searchData.pricerange.max) || 1000000000;
        const minPrice = parseFloat(searchData.pricerange.min) || 500000;
        setPriceRange([minPrice, maxPrice]);
      }
      localStorage.setItem("selectedDistrict", searchData.districtid || "");
      localStorage.setItem("propertyTypeFilter", searchData.propertytype || "");
      localStorage.setItem("searchData", JSON.stringify(searchData));
    }
    localStorage.setItem("selectedStateId", selectedStateId || "");
  }, [selectedStateId, searchData]);

  useEffect(() => {
    localStorage.setItem("selectedState", selectedState);
    localStorage.setItem("selectedDistrict", selectedDistrict);
    localStorage.setItem("propertyTypeFilter", propertyTypeFilter);
    localStorage.setItem("priceRangeFilter", JSON.stringify(priceRange));
  }, [selectedState, selectedDistrict, propertyTypeFilter, priceRange]);

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

    if (priceRange[0] > 500000 || priceRange[1] < 1000000000) {
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
      selectedState || selectedDistrict || (propertyTypeFilter && propertyTypeFilter !== "All") || priceRange[0] > 500000 || priceRange[1] < 1000000000
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

  const clearAllFilters = () => {
    setSelectedState("");
    setSelectedDistrict("");
    setPropertyTypeFilter("");
    setPriceRange([500000, 1000000000]);
    setShowPriceSlider(false);
    setDisplayState("");
    setDisplayDistrict("");
    setDisplayPropertyType("");
    setSelectedStateId?.(null);
    setSearchData?.(null);
    localStorage.removeItem("selectedState");
    localStorage.removeItem("selectedStateId");
    localStorage.removeItem("selectedDistrict");
    localStorage.removeItem("propertyTypeFilter");
    localStorage.removeItem("priceRangeFilter");
    localStorage.removeItem("searchData");
    setProperties(allProperties);
    setIsFilterApplied(false);
    setDistricts([]);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 -mt-12" id="apartments">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4"></h3>
        <div className="flex flex-col gap-4">
          {/* Filter Inputs Card */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label htmlFor="state-select" className="text-sm font-semibold text-gray-700 mb-1">
                  State
                </label>
                <div className="relative">
                  <select
                    id="state-select"
                    className="bg-white border border-gray-300 rounded-lg w-full px-3 py-2 text-sm text-gray-500 focus:outline-none pl-10"
                    value={selectedState}
                    onChange={(e) => {
                      const newState = e.target.value;
                      setSelectedState(newState);
                      setSelectedStateId?.(newState);
                      setDisplayState(newState);
                      handleSearch();
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
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="district-select" className="text-sm font-semibold text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <select
                    id="district-select"
                    className="bg-white border border-gray-300 rounded-lg w-full px-3 py-2 text-sm text-gray-500 focus:outline-none pl-10"
                    value={selectedDistrict}
                    onChange={(e) => {
                      const newDistrict = e.target.value;
                      setSelectedDistrict(newDistrict);
                      setDisplayDistrict(newDistrict);
                      handleSearch();
                    }}
                    disabled={!selectedState || loadingDistricts}
                    aria-label="Select district"
                  >
                    <option value="">Select District</option>
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
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="property-type-select" className="text-sm font-semibold text-gray-700 mb-1">
                  Property Type
                </label>
                <div className="relative">
                  <select
                    id="property-type-select"
                    className="bg-white border border-gray-300 rounded-lg w-full px-3 py-2 text-sm text-gray-500 focus:outline-none pl-10"
                    value={propertyTypeFilter}
                    onChange={(e) => {
                      const newPropertyType = e.target.value;
                      setPropertyTypeFilter(newPropertyType);
                      setDisplayPropertyType(newPropertyType);
                      handleSearch();
                    }}
                    aria-label="Select property type"
                  >
                    <option value="">Select Property Type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="price-range-select" className="text-sm font-semibold text-gray-700 mb-1">
                  Price Range
                </label>
                <div className="relative">
                  <button
                    id="price-range-select"
                    className="bg-white border border-gray-300 rounded-lg w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-500"
                    onClick={() => setShowPriceSlider(!showPriceSlider)}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showPriceSlider ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Price Range Slider Card */}
          {showPriceSlider && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex flex-col items-center w-full max-w-[90vw] sm:max-w-md lg:ml-[600px]">
                <Range
                  step={100000}
                  min={500000}
                  max={1000000000}
                  values={priceRange}
                  onChange={(values) => {
                    setPriceRange(values);
                    handleSearch();
                  }}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="h-1.5 bg-gray-200 rounded-full w-full"
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props: thumbProps, isDragged }) => {
                    const currentValue = thumbProps['aria-valuenow'];
                    const displayValue = currentValue < 10000000
                      ? `₹${(currentValue / 100000).toFixed(1)} L`
                      : `₹${(currentValue / 10000000).toFixed(2)} Cr`;

                    return (
                      <div
                        {...thumbProps}
                        key={`thumb-${currentValue}`}
                        className="relative group outline-none"
                      >
                        <div
                          className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-blue-600 shadow-md flex items-center justify-center ${
                            isDragged ? 'ring-2 ring-blue-400' : ''
                          }`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full bg-white transition-opacity ${
                              isDragged ? 'opacity-100' : 'opacity-0 sm:opacity-100'
                            }`}
                          />
                        </div>
                        <div
                          className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity duration-200 ${
                            isDragged ? 'opacity-100' : 'opacity-0 sm:opacity-100'
                          }`}
                        >
                          {displayValue}
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-solid border-l-transparent border-r-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    );
                  }}
                />
                <div className="flex justify-between w-full text-xs sm:text-sm text-gray-600 mt-2">
                  <span>₹5 L</span>
                  <span>₹100 Cr</span>
                </div>
              </div>
            </div>
          )}

          {/* Selected Filters Display Card */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <div className="flex-1 min-w-[80px] text-center">
                {displayState ? (
                  <span className="text-sm text-gray-700">{displayState}</span>
                ) : (
                  <span className="text-sm text-gray-500">State</span>
                )}
              </div>
              <div className="border-l border-gray-300 h-8 mx-2 hidden sm:block"></div>
              <div className="flex-1 min-w-[80px] text-center">
                {displayDistrict ? (
                  <span className="text-sm text-gray-700">{displayDistrict}</span>
                ) : (
                  <span className="text-sm text-gray-500">Location</span>
                )}
              </div>
              <div className="border-l border-gray-300 h-8 mx-2 hidden sm:block"></div>
              <div className="flex-1 min-w-[80px] text-center">
                {displayPropertyType && displayPropertyType !== "All" ? (
                  <span className="text-sm text-gray-700">{displayPropertyType}</span>
                ) : (
                  <span className="text-sm text-gray-500">Property</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
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
        </div>
      </div>

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
              <div className="p-4 flex flex-col flex-grow justify-between">
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 break-words text-center">
                    {property.companyName}
                  </h3>
                </div>
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