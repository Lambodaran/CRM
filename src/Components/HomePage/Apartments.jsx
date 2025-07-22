





// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";

// const BASE_URL = "https://crm-bcgg.onrender.com";
// const categories = ["All", "Apartment", "Villa", "Plot", "Land"];

// const Apartments = ({ selectedStateId, searchData, setSelectedStateId,setSearchData }) => {
//   const [properties, setProperties] = useState([]);
//   const [allProperties, setAllProperties] = useState([]);
//   const [selected, setSelected] = useState("All");
//   const [selectedDistrict, setSelectedDistrict] = useState(
//     searchData?.district || ""
//   );
//   const [propertyTypeFilter, setPropertyTypeFilter] = useState(
//     searchData?.propertytype || ""
//   );
//   const [priceRangeFilter, setPriceRangeFilter] = useState(
//     searchData?.pricerange || ""
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         const url = `${BASE_URL}/api/propertiesGet/`;
//         const response = await axios.get(url);
//         setAllProperties(response.data);
//         setProperties(response.data);
//         setError(null);
//       } catch (err) {
//         setError("Failed to fetch properties.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, []);

//   useEffect(() => {
//     if (searchData) {
//       setSelectedDistrict(searchData.districtid || "");
//       setPropertyTypeFilter(searchData.propertytype || "");
//       setPriceRangeFilter(searchData.priceRange || "");
//     }
//   }, [searchData]);

//   console.log(searchData);

  

//   useEffect(() => {
//     if (allProperties.length > 0) {
//       let filtered = [...allProperties];

//       // Apply state filter if selected
//       if (selectedStateId) {
//         const normalizedSelectedState = selectedStateId.trim().toLowerCase();
//         filtered = filtered.filter(
//           (property) =>
//             property.address?.state &&
//             property.address.state.trim().toLowerCase() ===
//               normalizedSelectedState
//         );
//       }

//       // Apply city/district filter (case-insensitive)
//       if (searchData?.districtid) {
//         const normalizedSelectedCity = searchData.districtid
//           .trim()
//           .toLowerCase();
//         filtered = filtered.filter(
//           (property) =>
//             property.address?.city &&
//             property.address.city.trim().toLowerCase() ===
//               normalizedSelectedCity
//         );
//       }

//       // Apply property type filter
//       if (searchData?.propertytype && searchData.propertytype !== "All") {
//         filtered = filtered.filter((property) =>
//           property.projects?.some(
//             (project) =>
//               project.propertyType?.toLowerCase() ===
//               searchData.propertytype.toLowerCase()
//           )
//         );
//       }

//       // Apply price range filter
//       if (searchData?.pricerange) {
//         filtered = filtered.filter((property) =>
//           property.projects?.some((project) =>
//             project.buildings?.some(
//               (building) =>
//                 building.priceRange?.toLowerCase() ===
//                 searchData.pricerange.toLowerCase()
//             )
//           )
//         );
//       }

//       // Apply category filter
//       if (selected !== "All") {
//         filtered = filtered.filter((property) =>
//           property.projects?.some(
//             (project) =>
//               project.propertyType?.toLowerCase() === selected.toLowerCase()
//           )
//         );
//       }

//       setProperties(filtered);
//     }
//   }, [selectedStateId, searchData, selected, allProperties]);

//   const clearAllFilters = () => {
//     setSelectedStateId(null);
//     if (setSearchData) {
//       setSearchData(null);
//     }
//     setSelected("All");
//   };

//   const filteredProperties = Array.isArray(properties) ? properties : [];

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10 mt-10" id="apartments">
//       {/* Filter Display */}
//       {(selectedStateId ||
//         selectedDistrict ||
//         propertyTypeFilter ||
//         priceRangeFilter) && (
//         <div className="mb-4 flex flex-wrap items-center gap-2">
//           <span className="text-sm">Filters:</span>
//           {selectedStateId && (
//             <span className="text-sm bg-gray-100 px-2 py-1 rounded">
//               State ID: {selectedStateId}
//             </span>
//           )}
//           {selectedDistrict && (
//             <span className="text-sm bg-gray-100 px-2 py-1 rounded">
//               District: {selectedDistrict}
//             </span>
//           )}
//           {propertyTypeFilter && (
//             <span className="text-sm bg-gray-100 px-2 py-1 rounded">
//               Type: {propertyTypeFilter}
//             </span>
//           )}
//           {priceRangeFilter && (
//             <span className="text-sm bg-gray-100 px-2 py-1 rounded">
//               Price: {priceRangeFilter}
//             </span>
//           )}
//           <button
//             onClick={clearAllFilters}
//             className="ml-2 text-sm text-red-500 hover:text-red-700"
//           >
//             Clear all
//           </button>
//         </div>
//       )}

//       {/* Heading and View All */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-xl font-semibold leading-snug font-jakarta">
//             Explore Properties That Suit
//             <br />
//             Your Lifestyle
//           </h2>
//         </div>
//         <Link
//           to="/login"
//           className="text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 text-sm rounded"
//         >
//           View all
//         </Link>
//       </div>

//       {/* Category Filter Buttons */}
//       <div className="flex flex-wrap gap-3 mb-8">
//         {categories.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => setSelected(cat)}
//             className={`px-4 py-1 rounded-full border ${
//               selected === cat
//                 ? "bg-orange-600 text-white border-orange-600"
//                 : "text-gray-700 border-gray-300"
//             }`}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {/* Property Grid */}
//       {loading ? (
//         <div className="text-center py-10 text-gray-500">
//           Loading properties...
//         </div>
//       ) : error ? (
//         <div className="text-center py-10 text-red-500">{error}</div>
//       ) : filteredProperties.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 gap-10 ">
//           {filteredProperties.map((property) => (
//             <div
//               key={property._id}
//               className="relative w-full h-[300px] rounded-lg overflow-hidden shadow-sm border border-gray-300 group cursor-pointer transition-transform duration-300 ease-in-out group-hover:scale-105"
//               onClick={() => {
//                 window.scrollTo({ top: 0, behavior: "smooth" });
//                 navigate("/builder", {
//                   state: { builderId: property._id },
//                 });
//               }}
//             >
//               <div className="flex justify-center items-center">
//   {/* image here */}
//    <img
//   src={
//     property.coverPhotos?.length > 0
//       ? property.coverPhotos[0].url
//       : property.logo
//   }
//   alt={property.companyName}
//   className="mx-auto w-[150px] h-[180px] object-contain "
// />
// </div>
             
//               {/* <div className="absolute top-2 left-2 bg-white bg-opacity-80 text-black text-xs font-medium px-3 py-1 rounded-r-lg shadow">
//                 {property.address?.city || "Unknown city"}
//               </div> */}
//               {/* <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-l-lg shadow">
//                 {property.companyName}
//               </div> */}
//               <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-[#E8E8E8] p-4 text-black">
//                 <h3 className="font-medium text-center">{property.companyName}</h3>
//                 {/* <p className="text-sm">
//                   {property.projects
//                     ?.map((project) => project.propertyType)
//                     .join(", ")}
//                 </p> */}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-10">
//           <p className="text-gray-500">
//             No properties found matching your filters.
//           </p>
//           <button
//             onClick={clearAllFilters}
//             className="mt-4 text-orange-600 hover:underline"
//           >
//             Clear all filters
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Apartments;






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { FaMapMarkerAlt } from "react-icons/fa";
// import { motion } from "framer-motion";
// import BASE_URL from "../../service/api";

// const categories = ["All", "Apartment", "Villa", "Plot"];


// const Apartments = ({ selectedStateId, searchData, setSelectedStateId, setSearchData }) => {
//   const [properties, setProperties] = useState([]);
//   const [allProperties, setAllProperties] = useState([]);
//   const [selected, setSelected] = useState(() => localStorage.getItem("selectedCategory") || "All");
//   const [selectedDistrict, setSelectedDistrict] = useState(() => localStorage.getItem("selectedDistrict") || "");
//   const [propertyTypeFilter, setPropertyTypeFilter] = useState(() => localStorage.getItem("propertyTypeFilter") || "");
//   const [priceRangeFilter, setPriceRangeFilter] = useState(() => localStorage.getItem("priceRangeFilter") || "");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Initialize selectedStateId and searchData from localStorage
//   useEffect(() => {
//     const storedStateId = localStorage.getItem("selectedStateId");
//     const storedSearchData = localStorage.getItem("searchData");

//     if (storedStateId && setSelectedStateId) {
//       setSelectedStateId(storedStateId);
//     }
//     if (storedSearchData && setSearchData) {
//       setSearchData(JSON.parse(storedSearchData));
//     }
//   }, [setSelectedStateId, setSearchData]);

//   // Fetch properties
//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         const url = `${BASE_URL}/api/propertiesGet/`;
//         const response = await axios.get(url);
//         setAllProperties(response.data);
//         setProperties(response.data);
//         setError(null);
//       } catch (err) {
//         setError("Failed to fetch properties.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, []);

//   // Update searchData from props and persist to localStorage
//   useEffect(() => {
//     if (searchData) {
//       setSelectedDistrict(searchData.districtid || "");
//       setPropertyTypeFilter(searchData.propertytype || "");
//       setPriceRangeFilter(searchData.pricerange || "");
//       localStorage.setItem("selectedDistrict", searchData.districtid || "");
//       localStorage.setItem("propertyTypeFilter", searchData.propertytype || "");
//       localStorage.setItem("priceRangeFilter", searchData.pricerange || "");
//       localStorage.setItem("searchData", JSON.stringify(searchData));
//     }
//   }, [searchData]);

//   // Persist selectedStateId to localStorage
//   useEffect(() => {
//     if (selectedStateId) {
//       localStorage.setItem("selectedStateId", selectedStateId);
//     }
//   }, [selectedStateId]);

//   // Persist selected category to localStorage
//   useEffect(() => {
//     localStorage.setItem("selectedCategory", selected);
//   }, [selected]);

//   // Filter properties based on state and filters
//   useEffect(() => {
//     if (allProperties.length > 0) {
//       let filtered = [...allProperties];

//       if (selectedStateId) {
//         const normalizedSelectedState = selectedStateId.trim().toLowerCase();
//         filtered = filtered.filter(
//           (property) =>
//             property.address?.state &&
//             property.address.state.trim().toLowerCase() === normalizedSelectedState
//         );
//       }

//       if (searchData?.districtid) {
//         const normalizedSelectedCity = searchData.districtid.trim().toLowerCase();
//         filtered = filtered.filter(
//           (property) =>
//             property.address?.city &&
//             property.address.city.trim().toLowerCase() === normalizedSelectedCity
//         );
//       }

//       if (searchData?.propertytype && searchData.propertytype !== "All") {
//         filtered = filtered.filter((property) =>
//           property.projects?.some(
//             (project) =>
//               project.propertyType?.toLowerCase() === searchData.propertytype.toLowerCase()
//           )
//         );
//       }

//       if (searchData?.pricerange) {
//         filtered = filtered.filter((property) =>
//           property.projects?.some((project) =>
//             project.buildings?.some(
//               (building) =>
//                 building.priceRange?.toLowerCase() === searchData.pricerange.toLowerCase()
//             )
//           )
//         );
//       }

//       if (selected !== "All") {
//         filtered = filtered.filter((property) =>
//           property.projects?.some(
//             (project) =>
//               project.propertyType?.toLowerCase() === selected.toLowerCase()
//           )
//         );
//       }

//       setProperties(filtered);
//     }
//   }, [selectedStateId, searchData, selected, allProperties]);

//   const clearAllFilters = () => {
//     setSelectedStateId(null);
//     setSelectedDistrict("");
//     setPropertyTypeFilter("");
//     setPriceRangeFilter("");
//     if (setSearchData) {
//       setSearchData(null);
//     }
//     setSelected("All");
//     // Clear localStorage
//     localStorage.removeItem("selectedStateId");
//     localStorage.removeItem("selectedDistrict");
//     localStorage.removeItem("propertyTypeFilter");
//     localStorage.removeItem("priceRangeFilter");
//     localStorage.removeItem("searchData");
//     localStorage.removeItem("selectedCategory");
//   };

//   const filteredProperties = Array.isArray(properties) ? properties : [];

//   return (
//     <section className="max-w-7xl mx-auto px-4 py-10 mt-10" id="apartments">
//       {/* Filter Display */}
//       {(selectedStateId || selectedDistrict || propertyTypeFilter || priceRangeFilter) && (
//         <div className="mb-4 flex flex-wrap items-center gap-2">
//           <span className="text-sm font-semibold text-gray-900">Filters:</span>
//           {selectedStateId && (
//             <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
//               State: {selectedStateId}
//             </span>
//           )}
//           {selectedDistrict && (
//             <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
//               District: {selectedDistrict}
//             </span>
//           )}
//           {propertyTypeFilter && (
//             <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
//               Type: {propertyTypeFilter}
//             </span>
//           )}
//           {priceRangeFilter && (
//             <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
//               Price: {priceRangeFilter}
//             </span>
//           )}
//           <button
//             onClick={clearAllFilters}
//             className="ml-2 text-xs text-red-500 hover:text-red-700"
//           >
//             Clear all
//           </button>
//         </div>
//       )}

//       {/* Heading and View All */}
//       <div className="text-center mb-10 pt-8">
//         <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//           Explore Properties That Suit
//         </h2>
//         <span className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Lifestyle</span>
//         <div className="flex flex-wrap justify-center gap-3 mt-6">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setSelected(cat)}
//               className={`px-4 py-2 rounded border text-sm transition-all duration-300 ${
//                 selected === cat
//                   ? "border-black text-white bg-black shadow-md"
//                   : "border-black text-black bg-white hover:bg-black hover:text-white hover:border-black"
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Property Grid */}
//       {loading ? (
//         <div className="text-center py-10 text-gray-500">
//           Loading properties...
//         </div>
//       ) : error ? (
//         <div className="text-center py-10 text-red-500">{error}</div>
//       ) : filteredProperties.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
//           {filteredProperties.map((property, index) => (
//             <motion.div
//               key={property._id}
//               initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0 }}
//               whileHover={{
//                 scale: 1.05,
//                 boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
//               }}
//               className="group relative w-full h-[300px] flex flex-col justify-between overflow-hidden shadow-md transition-all duration-500 hover:shadow-lg bg-white rounded-lg border border-gray-200"
//               onClick={() => {
//                 window.scrollTo({ top: 0, behavior: "smooth" });
//                 navigate("/builder", {
//                   state: { builderId: property._id },
//                 });
//               }}
//             >
//               {/* Image Section */}
//               <div className="relative h-[180px] overflow-hidden shadow-sm flex items-center justify-center">
//                 <img
//                   src={
//                     property.coverPhotos?.length > 0
//                       ? property.coverPhotos[0].url
//                       : property.logo ||
//                         "https://via.placeholder.com/300x180?text=No+Image"
//                   }
//                   alt={property.companyName}
//                   className="w-[180px] h-[150px] object-contain"
//                 />
//               </div>

//               {/* Content Section */}
//               <div className="p-4 flex flex-col flex-grow justify-between">
//                 <div className="flex-grow">
//                   <h3 className="text-lg font-bold text-gray-900 mb-1 break-words text-center">
//                     {property.companyName}
//                   </h3>
//                 </div>

//                 {/* Button */}
//                 <button
//                   className="mt-4 w-full bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center"
//                 >
//                   View Builder Details
//                   <span className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
//                     →
//                   </span>
//                 </button>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-10">
//           <p className="text-gray-500">
//             No properties found matching your filters.
//           </p>
//           <button
//             onClick={clearAllFilters}
//             className="mt-4 text-orange-600 hover:underline"
//           >
//             Clear all filters
//           </button>
//         </div>
//       )}
//       <div className="text-center mt-10">
//         <Link
//           to="/login"
//           className="bg-black text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-300"
//         >
//           View All Builders
//           <span className="ml-2 inline-block">→</span>
//         </Link>
//       </div>
//     </section>
//   );
// };

// export default Apartments;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import BASE_URL from "../../service/api";

const categories = ["All", "Apartment", "Villa", "Plot", "Commercial"];

const Apartments = ({ selectedStateId, searchData, setSelectedStateId, setSearchData }) => {
  const [properties, setProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [selected, setSelected] = useState(() => localStorage.getItem("selectedCategory") || "All");
  const [selectedDistrict, setSelectedDistrict] = useState(() => localStorage.getItem("selectedDistrict") || "");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(() => localStorage.getItem("propertyTypeFilter") || "");
  const [priceRangeFilter, setPriceRangeFilter] = useState(() => localStorage.getItem("priceRangeFilter") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Parse price string to numerical value
  const parsePrice = (priceString) => {
    if (!priceString || typeof priceString !== "string") {
      console.warn("Invalid priceString:", priceString);
      return null;
    }
    const normalizedPrice = priceString.toLowerCase().replace(/\s+/g, "");
    const match = normalizedPrice.match(/(\d+\.?\d*)\s*(cr|l|lac|crore|lakh)?-?(\d+\.?\d*)?\s*(cr|l|lac|crore|lakh)?/i);
    if (!match) {
      console.warn("Failed to parse priceString:", priceString);
      return null;
    }
    let value = parseFloat(match[1]);
    const unit = match[2] || (match[4] && priceString.includes("-") ? match[4] : "");
    if (unit === "cr" || unit === "crore") value *= 10000000;
    else if (unit === "l" || unit === "lac" || unit === "lakh") value *= 100000;
    else if (value >= 10000) value = value; // Assume INR for large numbers
    else {
      console.warn("Unrecognized unit or format:", priceString);
      return null;
    }
    // Handle ranges (e.g., "50L-75L")
    if (match[3] && !normalizedPrice.includes("above")) {
      let upperValue = parseFloat(match[3]);
      const upperUnit = match[4] || unit;
      if (upperUnit === "cr" || upperUnit === "crore") upperValue *= 10000000;
      else if (upperUnit === "l" || upperUnit === "lac" || upperUnit === "lakh") upperValue *= 100000;
      return upperValue;
    }
    return value;
  };

  // Get human-readable price range string for UI display
  const getPriceRangeString = (minPrice) => {
    const priceValue = parseFloat(minPrice);
    switch (priceValue) {
      case 0: return "Less than Rs. 50L";
      case 5000000: return "Rs. 50 Lakh – Rs. 75 Lakh";
      case 7500000: return "Rs. 75 Lakh – Rs. 1 Cr";
      case 10000000: return "Rs. 1 Cr – Rs. 1.50 Cr";
      case 15000000: return "Rs. 1.5 Cr – Rs. 2 Cr";
      case 20000000: return "Rs. 2 Cr – Rs. 2.5 Cr";
      case 25000000: return "Rs. 2.5 Cr – Rs. 3 Cr";
      case 30000000: return "Above 3 Cr";
      default: return minPrice ? String(minPrice) : "";
    }
  };

  // Get min/max bounds for price range filtering
  const getPriceRangeBounds = (minPrice) => {
    const priceValue = parseFloat(minPrice);
    switch (priceValue) {
      case 0: return { min: 0, max: 5000000 }; // Less than Rs. 50L
      case 5000000: return { min: 5000000, max: 7500000 };
      case 7500000: return { min: 7500000, max: 10000000 };
      case 10000000: return { min: 10000000, max: 15000000 };
      case 15000000: return { min: 15000000, max: 20000000 };
      case 20000000: return { min: 20000000, max: 25000000 };
      case 25000000: return { min: 25000000, max: 30000000 };
      case 30000000: return { min: 30000000, max: Infinity };
      default: return { min: 0, max: Infinity };
    }
  };

  // Initialize from localStorage
  useEffect(() => {
    const storedStateId = localStorage.getItem("selectedStateId");
    const storedSearchData = localStorage.getItem("searchData");

    if (storedStateId && setSelectedStateId) {
      setSelectedStateId(storedStateId);
    }
    if (storedSearchData && setSearchData) {
      setSearchData(JSON.parse(storedSearchData));
    }
  }, [setSelectedStateId, setSearchData]);

  // Synchronize selected category with searchData.propertytype
  useEffect(() => {
    if (searchData?.propertytype && searchData.propertytype !== selected) {
      setSelected(searchData.propertytype);
      localStorage.setItem("selectedCategory", searchData.propertytype);
    }
  }, [searchData?.propertytype, selected]);

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
        console.log("Fetched properties:", response.data.map(p => ({
          id: p._id,
          prices: p.projects?.flatMap(proj => proj.buildings?.map(b => b.priceRange) || []) || []
        })));
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

  // Update searchData from props and persist to localStorage
  useEffect(() => {
    if (searchData) {
      setSelectedDistrict(searchData.districtid || "");
      setPropertyTypeFilter(searchData.propertytype || "");
      setPriceRangeFilter(searchData.pricerange ? String(searchData.pricerange) : "");
      localStorage.setItem("selectedDistrict", searchData.districtid || "");
      localStorage.setItem("propertyTypeFilter", searchData.propertytype || "");
      localStorage.setItem("priceRangeFilter", searchData.pricerange ? String(searchData.pricerange) : "");
      localStorage.setItem("searchData", JSON.stringify(searchData));
    }
  }, [searchData]);

  // Persist selectedStateId to localStorage
  useEffect(() => {
    if (selectedStateId) {
      localStorage.setItem("selectedStateId", selectedStateId);
    }
  }, [selectedStateId]);

  // Persist selected category to localStorage
  useEffect(() => {
    localStorage.setItem("selectedCategory", selected);
  }, [selected]);

  // Filter properties
  useEffect(() => {
    if (allProperties.length > 0) {
      let filtered = [...allProperties];

      console.log("Filter inputs:", { selectedStateId, searchData, selected });

      if (selectedStateId) {
        const normalizedSelectedState = selectedStateId.trim().toLowerCase();
        filtered = filtered.filter(
          (property) =>
            property.address?.state &&
            property.address.state.trim().toLowerCase() === normalizedSelectedState
        );
      }

      if (searchData?.districtid) {
        const normalizedSelectedCity = searchData.districtid.trim().toLowerCase();
        filtered = filtered.filter(
          (property) =>
            property.address?.city &&
            property.address.city.trim().toLowerCase() === normalizedSelectedCity
        );
      }

      if (searchData?.propertytype && searchData.propertytype !== "All") {
        filtered = filtered.filter((property) =>
          property.projects?.some(
            (project) =>
              project.propertyType?.toLowerCase() === searchData.propertytype.toLowerCase()
          )
        );
      }

      if (searchData?.pricerange !== undefined) {
        console.log("Applying price filter with pricerange:", searchData.pricerange, typeof searchData.pricerange);
        filtered = filtered.filter((property) => {
          if (!property.projects || !Array.isArray(property.projects)) {
            console.warn("No projects array for property:", property);
            return false;
          }
          return property.projects.some((project) => {
            if (!project.buildings || !Array.isArray(project.buildings)) {
              console.warn("No buildings array for project:", project);
              return false;
            }
            return project.buildings.some((building) => {
              const buildingPrice = parsePrice(building.priceRange);
              const pricerangeValue = parseFloat(searchData.pricerange);
              if (buildingPrice === null) {
                console.warn("Null price for building:", building);
                return false; // Exclude null prices unless explicitly required
              }
              const { min, max } = getPriceRangeBounds(pricerangeValue);
              const matchesPrice = buildingPrice >= min && buildingPrice < max;
              console.log("Price filter check:", {
                propertyId: property._id,
                priceRange: building.priceRange,
                parsed: buildingPrice,
                bounds: { min, max },
                matches: matchesPrice
              });
              return matchesPrice;
            });
          });
        });
      }

      if (selected !== "All" && !searchData?.propertytype) {
        filtered = filtered.filter((property) =>
          property.projects?.some(
            (project) =>
              project.propertyType?.toLowerCase() === selected.toLowerCase()
          )
        );
      }

      console.log("Filtered properties count:", filtered.length);
      setProperties(filtered);
    }
  }, [selectedStateId, searchData, selected, allProperties]);

  const clearAllFilters = () => {
    setSelectedStateId(null);
    setSelectedDistrict("");
    setPropertyTypeFilter("");
    setPriceRangeFilter("");
    if (setSearchData) {
      setSearchData(null);
    }
    setSelected("All");
    localStorage.removeItem("selectedStateId");
    localStorage.removeItem("selectedDistrict");
    localStorage.removeItem("propertyTypeFilter");
    localStorage.removeItem("priceRangeFilter");
    localStorage.removeItem("searchData");
    localStorage.removeItem("selectedCategory");
  };

  const filteredProperties = Array.isArray(properties) ? properties : [];

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 mt-10" id="apartments">
      {/* Filter Display */}
      {(selectedStateId || selectedDistrict || propertyTypeFilter || priceRangeFilter) && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">Filters:</span>
          {selectedStateId && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
              State: {selectedStateId}
            </span>
          )}
          {selectedDistrict && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
              District: {selectedDistrict}
            </span>
          )}
          {propertyTypeFilter && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
              Type: {propertyTypeFilter}
            </span>
          )}
          {priceRangeFilter && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
              Price: {getPriceRangeString(priceRangeFilter)}
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="ml-2 text-xs text-red-500 hover:text-red-700"
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Heading and Category Filters */}
      <div className="text-center mb-10 pt-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Explore Properties That Suit
        </h2>
        <span className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Lifestyle</span>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              disabled={searchData?.propertytype && cat !== searchData.propertytype}
              className={`px-4 py-2 rounded border text-sm transition-all duration-300 ${
                selected === cat
                  ? "border-black text-white bg-black shadow-md"
                  : searchData?.propertytype && cat !== searchData.propertytype
                  ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "border-black text-black bg-white hover:bg-black hover:text-white hover:border-black"
              }`}
              aria-label={`Filter by ${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Property Grid */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading properties...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {filteredProperties.map((property, index) => (
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
            {searchData?.pricerange === "0" || searchData?.pricerange === 0
              ? "No properties found under Rs. 50 Lakh."
              : searchData?.pricerange === "30000000" || searchData?.pricerange === 30000000
              ? "No properties found above Rs. 3 Crore."
              : "No properties found matching your filters."}
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
      <div className="text-center mt-10">
        <Link
          to="/login"
          className="bg-black text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-300"
          aria-label="View all builders"
        >
          View All Builders
          <span className="ml-2 inline-block">→</span>
        </Link>
      </div>
    </section>
  );
};

export default Apartments;