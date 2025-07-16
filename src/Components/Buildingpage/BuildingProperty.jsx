// import { useState, useEffect } from "react";
// import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import { motion } from "framer-motion";

// export default function TowerProperty() {
//   const [selectedType, setSelectedType] = useState("All");
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { propertyId } = location.state || {};
//   const selectedBuilder = location.state?.builderName;
//   const builderId = location.state?.builderId;
//   const { pathname } = useLocation();

//   const statusColors = {
//     "New Launch": "bg-green-500/20 text-green-400 border-green-500/30",
//     "Under Construction": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
//     "Completed": "bg-blue-500/20 text-blue-400 border-blue-500/30"
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `https://crm-bcgg.onrender.com/api/properties/buildings/by-project/${propertyId}`
//         );
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         // Transform API data to match our expected format
//         const transformedProperties = data.map(building => ({
//           id: building._id,
//           buildingName: building.buildingName,
//           type: building.type || "Residential",
//           priceRange: building.priceRange || "Price on request",
//           buildingArea: building.buildingArea || "Location not specified",
//           floorsCount: building.floorsCount || 0,
//           units: building.units || 0,
//           photos: building.photos || [],
//           videos: building.videos || [],
//           description: building.description || "No description available",
//           amenities: building.amenities || [],
//           configuration: building.configuration || { apartmentConfigs: [] },
//           status: building.status || "Under Construction",
//           buildername: building.buildername || "Unknown Builder"
//         }));
        
//         setProperties(transformedProperties);
//       } catch (error) {
//         console.error("Error fetching properties:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, []);

//   const filteredProperties = properties.filter((property) => {
//     const typeMatch = selectedType === "All" || property.type === selectedType;
//     const builderMatch = !selectedBuilder || property.buildername === selectedBuilder;
//     return typeMatch && builderMatch;
//   });

//   const getBhkRange = (configs) => {
//     if (!configs || configs.length === 0) return "N/A";
//     const bhks = configs.map(c => parseInt(c.bhk.split(' ')[0]));
//     return `${Math.min(...bhks)}-${Math.max(...bhks)} BHK`;
//   };

//   if (loading) {
//     return (
//       <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[50vh]">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
//         <p>Loading properties...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[50vh]">
//         <div className="text-red-500 text-center">
//           <p className="font-bold">Error loading properties:</p>
//           <p>{error}</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <section className="py-12 md:py-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12 md:mb-16">
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 md:mb-6">
//             {selectedBuilder ? `${selectedBuilder} Properties` : "Explore Our Properties"}
//           </h2>
//           <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
//             Discover properties that blend luxury, comfort, and modern living tailored to your lifestyle.
//           </p>
//           <div className="flex flex-wrap justify-center gap-3 mt-6">
//             {["All", "Residential", "Commercial", "Plots"].map((type) => (
//               <motion.button
//                 key={type}
//                 onClick={() => setSelectedType(type)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className={`px-4 py-2 rounded-lg border text-sm md:text-base transition-all duration-200 
//                   ${
//                     selectedType === type
//                       ? "border-black text-white bg-black shadow-md"
//                       : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
//                   }`}
//               >
//                 {type}
//               </motion.button>
//             ))}
//           </div>
//         </div>

//         {filteredProperties.length === 0 ? (
//           <div className="w-full max-w-6xl text-center py-12 md:py-20">
//             <p className="text-gray-600">No properties found matching your criteria.</p>
//           </div>
//         ) : (
//           <motion.div 
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
//             initial="hidden"
//             animate="visible"
//             variants={{
//               hidden: { opacity: 0 },
//               visible: {
//                 opacity: 1,
//                 transition: {
//                   staggerChildren: 0.1
//                 }
//               }
//             }}
//           >
//             {filteredProperties.map((property) => (
//               <motion.div
//                 key={property.id}
//                 className="group flex flex-col overflow-hidden border border-gray-200 shadow-sm rounded-xl bg-white h-full hover:shadow-md transition-shadow duration-300"
//                 variants={{
//                   hidden: { y: 20, opacity: 0 },
//                   visible: {
//                     y: 0,
//                     opacity: 1,
//                     transition: {
//                       duration: 0.3
//                     }
//                   }
//                 }}
//                 whileHover={{
//                   y: -5,
//                   boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
//                 }}
//               >
//                 <div className="relative h-56 md:h-64 overflow-hidden">
//                   {property.photos.length > 0 ? (
//                     <img
//                       src={property.photos[0]}
//                       alt={property.buildingName}
//                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                       loading="lazy"
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gray-100 flex items-center justify-center">
//                       <span className="text-gray-400">No image available</span>
//                     </div>
//                   )}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
//                   <div className="absolute top-3 right-3">
//                     <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[property.status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
//                       {property.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="p-5 flex flex-col flex-grow">
//                   <div className="mb-3">
//                     <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
//                       {property.buildingName}
//                     </h3>
//                     <div className="flex items-center text-gray-600 text-sm">
//                       <FaMapMarkerAlt className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
//                       <span className="line-clamp-1">{property.buildingArea}</span>
//                     </div>
//                   </div>

//                   <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
//                     {property.description}
//                   </p>

//                   <div className="grid grid-cols-3 gap-3 mb-5 bg-gray-50 rounded-lg p-3">
//                     <div className="text-center flex flex-col items-center">
//                       <div className="flex items-center justify-center mb-1">
//                         <FaBed className="h-4 w-4 text-gray-700" />
//                       </div>
//                       <div className="font-semibold text-gray-900 text-sm">
//                         {getBhkRange(property.configuration.apartmentConfigs)}
//                       </div>
//                       <div className="text-gray-500 text-xs">BHK</div>
//                     </div>
//                     <div className="text-center flex flex-col items-center">
//                       <div className="flex items-center justify-center mb-1">
//                         <FaRulerCombined className="h-4 w-4 text-gray-700" />
//                       </div>
//                       <div className="font-semibold text-gray-900 text-sm">
//                         {property.floorsCount}
//                       </div>
//                       <div className="text-gray-500 text-xs">Floors</div>
//                     </div>
//                     <div className="text-center flex flex-col items-center">
//                       <div className="flex items-center justify-center mb-1">
//                         <span className="text-sm font-bold text-gray-700">₹</span>
//                       </div>
//                       <div className="font-semibold text-gray-900 text-sm">
//                         {property.priceRange}
//                       </div>
//                       <div className="text-gray-500 text-xs">Price</div>
//                     </div>
//                   </div>

//                   <div className="mb-5">
//                     <div className="text-sm font-semibold text-gray-900 mb-2">Key Amenities</div>
//                     <div className="flex flex-wrap gap-2">
//                       {property.amenities.slice(0, 3).map((amenity, index) => (
//                         <span
//                           key={index}
//                           className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600"
//                         >
//                           {amenity}
//                         </span>
//                       ))}
//                       {property.amenities.length > 3 && (
//                         <span className="text-xs text-gray-500">
//                           +{property.amenities.length - 3} more
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <div className="mt-auto pt-2">
//                     <button
//                       onClick={() => {
//                         navigate("/property", { state: { propertyId: property.id, builderId: builderId } });
//                       }}
//                       className="w-full bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center"
//                     >
//                       View Property Details
//                       <span className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1">→</span>
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//       </div>
//     </section>
//   );
// }


import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function BuildingProperty() {
  const [selectedType, setSelectedType] = useState("All");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { propertyId } = location.state || {};
  const selectedBuilder = location.state?.builderName;
  const builderId = location.state?.builderId;
  const { pathname } = useLocation();

  const statusColors = {
    "New Launch": "bg-green-500/20 text-green-400 border-green-500/30",
    "Under Construction": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "Completed": "bg-blue-500/20 text-blue-400 border-blue-500/30"
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://crm-bcgg.onrender.com/api/properties/buildings/by-project/${propertyId}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform API data to match our expected format
        const transformedProperties = data.map(building => ({
          id: building._id,
          buildingName: building.buildingName,
          type: building.type || "Residential",
          priceRange: building.priceRange || "Price on request",
          buildingArea: building.buildingArea || "Location not specified",
          floorsCount: building.floorsCount || 0,
          units: building.units || 0,
          photos: building.photos || [],
          videos: building.videos || [],
          description: building.description || "No description available",
          amenities: building.amenities || [],
          configuration: building.configuration || { apartmentConfigs: [] },
          status: building.status || "Under Construction",
          buildername: building.buildername || "Unknown Builder"
        }));
        
        setProperties(transformedProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    const typeMatch = selectedType === "All" || property.type === selectedType;
    const builderMatch = !selectedBuilder || property.buildername === selectedBuilder;
    return typeMatch && builderMatch;
  });

  const getBhkRange = (configs) => {
    if (!configs || configs.length === 0) return "N/A";
    const bhks = configs.map(c => parseInt(c.bhk.split(' ')[0]));
    return `${Math.min(...bhks)}-${Math.max(...bhks)} BHK`;
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
        <p>Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-red-500 text-center">
          <p className="font-bold">Error loading properties:</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 md:mb-6 mt-9">
            {selectedBuilder ? `${selectedBuilder} Properties` : "Explore Our Buildings"}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
           Discover buildings that combine strength, style, and smart design for today’s living.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {["All", "Residential", "Commercial", "Plots"].map((type) => (
              <motion.button
                key={type}
                onClick={() => setSelectedType(type)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg border text-sm md:text-base transition-all duration-200 
                  ${
                    selectedType === type
                      ? "border-black text-white bg-black shadow-md"
                      : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  }`}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="w-full max-w-6xl text-center py-12 md:py-20">
            <p className="text-gray-600">No properties found matching your criteria.</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {filteredProperties.map((property) => (
              <motion.div
                key={property.id}
                className="group flex flex-col overflow-hidden border border-gray-200 shadow-sm rounded-xl bg-white h-full hover:shadow-md transition-shadow duration-300"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.3
                    }
                  }
                }}
                whileHover={{
                  y: -5,
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="relative h-56 md:h-64 overflow-hidden">
                  {property.photos.length > 0 ? (
                    <img
                      src={property.photos[0]}
                      alt={property.buildingName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  {/* <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[property.status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
                      {property.status}
                    </span>
                  </div> */}
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                      {property.buildingName}
                    </h3>
                    <div className="flex items-center text-red-600 text-sm">
                      <FaMapMarkerAlt className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                      <span className="line-clamp-1">{property.buildingArea}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {property.description}
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-5 bg-gradient-to-r from-[#F8D78B] to-red-300 rounded-lg p-3">
                    <div className="text-center flex flex-col items-center">
                      <div className="flex items-center justify-center mb-1">
                        <FaBed className="h-4 w-4 text-gray-700" />
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {getBhkRange(property.configuration.apartmentConfigs)}
                      </div>
                      <div className="text-gray-500 text-xs">BHK</div>
                    </div>
                    <div className="text-center flex flex-col items-center">
                      <div className="flex items-center justify-center mb-1">
                        <FaRulerCombined className="h-4 w-4 text-gray-700" />
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {property.floorsCount}
                      </div>
                      <div className="text-gray-500 text-xs">Floors</div>
                    </div>
                    <div className="text-center flex flex-col items-center">
                      <div className="flex items-center justify-center mb-1">
                        <span className="text-sm font-bold text-gray-700">₹</span>
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {property.priceRange}
                      </div>
                      <div className="text-gray-500 text-xs">Price</div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="text-sm font-semibold text-gray-900 mb-2">Key Amenities</div>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600"
                        >
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{property.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    <button
                      onClick={() => {
                        navigate("/property", { state: { propertyId: property.id, builderId: builderId } });
                      }}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center"
                    >
                      View Property Details
                      <span className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}