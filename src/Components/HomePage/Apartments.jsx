





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






import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const BASE_URL = "https://crm-bcgg.onrender.com";
const categories = ["All", "Apartment", "Villa", "Plot","Land"];

const Apartments = ({ selectedStateId, searchData, setSelectedStateId, setSearchData }) => {
  const [properties, setProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [selected, setSelected] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState(searchData?.district || "");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(searchData?.propertytype || "");
  const [priceRangeFilter, setPriceRangeFilter] = useState(searchData?.pricerange || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const url = `${BASE_URL}/api/propertiesGet/`;
        const response = await axios.get(url);
        setAllProperties(response.data);
        setProperties(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch properties.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    if (searchData) {
      setSelectedDistrict(searchData.districtid || "");
      setPropertyTypeFilter(searchData.propertytype || "");
      setPriceRangeFilter(searchData.priceRange || "");
    }
  }, [searchData]);

  useEffect(() => {
    if (allProperties.length > 0) {
      let filtered = [...allProperties];

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

      if (searchData?.pricerange) {
        filtered = filtered.filter((property) =>
          property.projects?.some((project) =>
            project.buildings?.some(
              (building) =>
                building.priceRange?.toLowerCase() === searchData.pricerange.toLowerCase()
            )
          )
        );
      }

      if (selected !== "All") {
        filtered = filtered.filter((property) =>
          property.projects?.some(
            (project) =>
              project.propertyType?.toLowerCase() === selected.toLowerCase()
          )
        );
      }

      setProperties(filtered);
    }
  }, [selectedStateId, searchData, selected, allProperties]);

 const clearAllFilters = () => {
    setSelectedStateId(null);
    setSelectedDistrict(null);        // Add this line
    setPropertyTypeFilter(null);     // Add this line
    setPriceRangeFilter(null);       // You might want to add this too if it exists
    if (setSearchData) {
      setSearchData(null);
    }
    setSelected("All");
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
              State ID: {selectedStateId}
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
              Price: {priceRangeFilter}
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="ml-2 text-xs text-red-500 hover:text-red-700"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Heading and View All */}
      <div className="text-center mb-10 pt-8">
        {/* <div className="text-orange-500 text-sm font-light tracking-widest mb-4">
          PROPERTY PORTFOLIO
        </div> */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Explore Properties That Suit 
        </h2>
        <span className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Lifestyle</span>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`px-4 py-2 rounded border text-sm transition-all duration-300 ${
                selected === cat
                   ? "border-black text-white bg-black shadow-md"
        : "border-black text-black bg-white hover:bg-black hover:text-white hover:border-black"
              }`}
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
      {filteredProperties.map((property,index) => (
        <motion.div
        key={property._id}
        initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0 }}
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
            />
          </div>


              {/* <div className="flex items-center text-gray-600 text-sm mb-2">
                <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                <span className="truncate">
                  {property.address?.city || "Unknown city"}
                </span>
              </div> */}

              {/* Property Types */}
              {/* <div className="flex flex-wrap gap-1.5">
                {property.projects?.slice(0, 2).map((project, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600"
                  >
                    {project.propertyType}
                  </span>
                ))}
                {property.projects?.length > 2 && (
                  <span className="text-xs text-orange-500">
                    +{property.projects.length - 2} more
                  </span>
                )}
              </div> */}


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
          >
            Clear all filters
          </button>
        </div>
      )}
      <div className="text-center mt-10">
        <Link
          to="/login"
          className="bg-black text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-300"
        >
          View All Builders
          <span className="ml-2 inline-block">→</span>
        </Link>
      </div>
    </section>
  );
};

export default Apartments;

