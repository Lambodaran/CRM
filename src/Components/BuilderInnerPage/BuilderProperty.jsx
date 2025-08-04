// import { useState, useEffect } from "react";
// import { FaMapMarkerAlt, FaBed } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import { motion } from "framer-motion";
// import axios from "axios";

// export default function PropertyCards() {
//   const [selectedType, setSelectedType] = useState("All");
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { propertyId } = location.state;
//   const selectedBuilder = location.state?.builderName;
//   const builderId = location.state?.builderId; // Get builderId from location state

//   const BASE_URL = "https://crm-bcgg.onrender.com";
//   const token = JSON.parse(sessionStorage.getItem("logindata"))?.token;

//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         let url = `${BASE_URL}/api/properties/projects`;
        
//         // If builderId is available, fetch properties by builder
//         if (builderId) {
//           url = `${BASE_URL}/api/properties/projects/by-builder/${builderId}`;
//         }

//         const response = await axios.get(url, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
        
//         // Transform API data to match your expected format
//         const formattedProperties = response.data.map(property => ({
//   id: property._id,
//   name: property.projectName,
//   type: property.propertyType || "Apartments",
//   price: property.price ? `₹${property.price}` : "Price on request",
//   location: `${property.location?.city || 'Unknown City'}, ${property.location?.area || ''}`,
//   bed: property.bed || 0,
//   bath: property.bath || 0,
//   sqft: property.sqft || 0 ,
//   // buildername: property.builder?.companyName || "Unknown Builder",
//   images: property.media?.photos?.length > 0 
//     ? property.media.photos.map(photo => photo.url) 
//     : ["https://cdnassets.hw.net/04/2c/967deff449bd8a24c5fbb96dccd2/6474f8a03a894163ac235432988b491f.png"],
//   videos: property.media?.videos?.map(video => video.url) || [],
//   threeDVideos: property.media?.threeDVideo?.map(video => video.url) || [],
//   description: property.description || '',
//   amenities: property.amenities || [],
//   possessionDate: property.possessionDate,
//   specifications: property.specifications || ''
// }));

//         setProperties(formattedProperties);
//       } catch (err) {
//         console.error("Failed to fetch properties:", err);
//         setError("Failed to load properties. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, [builderId, token]);

//   // Filter by both type and builder if builder is selected
//   const filteredProperties = properties.filter((property) => {
//     const typeMatch = selectedType === "All" || property.type === selectedType;
//     const builderMatch =
//       !selectedBuilder || property.buildername === selectedBuilder;
//     return typeMatch && builderMatch;
//   });

//   if (loading) {
//     return (
//       <div className="p-4 md:p-6 flex flex-col items-center">
//         <div className="w-full max-w-6xl text-center py-20">
//           <p>Loading properties...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 md:p-6 flex flex-col items-center">
//         <div className="w-full max-w-6xl text-center py-20 text-red-500">
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 flex flex-col items-center">
//       <motion.div
//         className="w-full max-w-5xl text-center mb-6"
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         viewport={{ amount: 0.5 }}
//       >
//         <p className="text-lg font-semibold mb-4">
//           {selectedBuilder
//             ? `${selectedBuilder} Properties`
//             : "Explore the properties that suit your lifestyle"}
//         </p>
//         <div className="flex flex-wrap justify-center gap-3">
//           {["All", "Apartments", "Villas", "Plots", "Land"].map((type) => (
//             <motion.button
//               key={type}
//               onClick={() => setSelectedType(type)}
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               className={`px-4 py-2 rounded-full border text-sm md:text-base transition-all duration-300 ${
//                 selectedType === type
//                   ? "border-orange-500 text-orange-500 bg-orange-100 shadow-md"
//                   : "border-gray-500 text-gray-500 bg-transparent"
//               }`}
//             >
//               {type}
//             </motion.button>
//           ))}
//         </div>
//       </motion.div>
      
//       {filteredProperties.length === 0 ? (
//         <div className="w-full max-w-6xl text-center py-20">
//           <p>No properties found matching your criteria.</p>
//         </div>
//       ) : (
//         <motion.div
//           className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           viewport={{ amount: 0.5 }}
//         >
//           {filteredProperties.map((property, index) => (
//             <motion.div
//               key={property.id}
//               className="rounded-2xl overflow-hidden relative"
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.2 }}
//               viewport={{ amount: 0.5 }}
//             >
//               <div className="relative">
//                 <img
//                   src={property.images[0]}
//                   alt={property.name}
//                   className="w-full h-48 sm:h-56 object-cover"
//                 />
//                 {/* <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-medium px-3 py-1 rounded">
//                   {property.projectName}
//                 </div> */}
//               </div>
//               <div className="p-4 md:p-5">
//                 <span className="bg-orange-400 text-white text-xs font-semibold px-2 py-1 rounded">
//                   New Launch
//                 </span>
//                 <h2 className="text-lg font-semibold mt-2 text-left">
//                   {property.name}
//                 </h2>
//                 <p className="text-orange-600 font-bold text-sm text-left">
//                   {property.price}
//                 </p>
//                 <p className="text-gray-600 flex items-center text-sm mt-2 text-left">
//                   <FaMapMarkerAlt className="mr-2" /> {property.location}
//                 </p>
//                 <p className="text-gray-600 flex items-center text-sm mt-2 text-left">
//                   <FaBed className="mr-2" /> {property.bed} Beds, {property.bath}{" "}
//                   Baths, {property.sqft} sqft
//                 </p>
//                 <div className="flex mt-4">
//                   <button
//                    onClick={() => {  console.log("Clicked property ID:", property.id);navigate("/property", { state: { propertyId: property.id ,builderId: builderId} });
// }}
//                     className="bg-black text-white px-4 py-2 rounded-lg text-sm md:text-base"
//                   >
//                     View More
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>
//       )}
//     </div>
//   );
// }





import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import BASE_URL from "../../service/api";

export default function PropertyCards() {
  const [selectedType, setSelectedType] = useState("All");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { propertyId } = location.state;
  const selectedBuilder = location.state?.builderName;
  const builderId = location.state?.builderId;
    const { pathname } = useLocation();

  

  const token = JSON.parse(sessionStorage.getItem("logindata"))?.token;

  const statusColors = {
    "New Launch": "bg-green-500/20 text-green-400 border-green-500/30",
    "Under Construction": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "Completed": "bg-blue-500/20 text-blue-400 border-blue-500/30"
  };

    useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to top when this page loads
  }, [pathname]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let url = `${BASE_URL}/api/properties/projects`;
        if (builderId) {
          url = `${BASE_URL}/api/properties/projects/by-builder/${builderId}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const formattedProperties = response.data.map(property => ({
          id: property._id,
          name: property.projectName,
          type: property.propertyType || "Apartments",
          price: property.price ? `₹${property.price}` : "Price on request",
          location: `${property.location?.city || 'Unknown City'}, ${property.location?.area || ''}`,
          bed: property.bed || 0,
          bath: property.bath || 0,
          sqft: property.sqft || 0,
          images: property.media?.photos?.length > 0 
            ? property.media.photos.map(photo => photo.url) 
            : ["https://cdnassets.hw.net/04/2c/967deff449bd8a24c5fbb96dccd2/6474f8a03a894163ac235432988b491f.png"],
          videos: property.media?.videos?.map(video => video.url) || [],
          threeDVideos: property.media?.threeDVideo?.map(video => video.url) || [],
          description: property.description || '',
          amenities: property.amenities || [],
          possessionDate: property.possessionDate,
          specifications: property.specifications || '',
          status: property.status || "New Launch"
        }));

        setProperties(formattedProperties);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [builderId, token]);

  

  const filteredProperties = properties.filter((property) => {
    const typeMatch = selectedType === "All" || property.type === selectedType;
    const builderMatch = !selectedBuilder || property.buildername === selectedBuilder;
    return typeMatch && builderMatch;
  });

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center">
        <div className="w-full max-w-6xl text-center py-20">
          <p>Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center">
        <div className="w-full max-w-6xl text-center py-20 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-[390px]">
        <div className="text-center mb-6">
          {/* <div className="text-orange-500 text-sm font-light tracking-widest mb-4">
            PROPERTY PORTFOLIO
          </div> */}
          {/* <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 mt-9">
            {selectedBuilder ? `${selectedBuilder} Properties` : "Explore Our Properties"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover properties that blend luxury, comfort, and modern living tailored to your lifestyle.
          </p> */}
          <div className="flex flex-wrap justify-center gap-3 mb-6 -ml-[100px]">
            {["All", "Apartments", "Villas", "Plots"].map((type) => (
             <motion.button
  key={type}
  onClick={() => setSelectedType(type)}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  className={`px-4 py-2 rounded border text-sm md:text-base transition-all duration-300 
    ${
      selectedType === type
        ? "border-black text-white bg-black shadow-md"
        : "border-black text-black bg-white hover:bg-black hover:text-white hover:border-black"
    }`}
>
                {type}
              </motion.button>
            ))}
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="w-full max-w-6xl text-center py-20">
            <p>No properties found matching your criteria.</p>
          </div>
        ) : (
          <motion.div
  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
  // initial={{ opacity: 0, y: 50 }}
  // whileInView={{ opacity: 1, y: 0 }}
  // transition={{ duration: 0.5 }}
  // viewport={{ once: true, amount: 0.2 }} // Changed amount and added once
>
  {filteredProperties.map((property) => (
    <motion.div
      key={property.id}
      className="group overflow-hidden border-0 shadow-xl transition-all duration-300 hover:shadow-2xl rounded-2xl bg-white"
      // initial={{ opacity: 0, y: 20 }}
      // whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
                <div className="relative h-64 overflow-hidden p-4 ">
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-[500px] h-full object-cover transition-transform duration-700  rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white-900/60 to-transparent"></div>
                  {/* <div className="absolute top-4 left-4">
                    <span className={`${statusColors[property.status] || statusColors["New Launch"]} border px-2 py-1 rounded text-xs font-semibold`}>
                      {property.status}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-orange-500/90 text-gray-900 border-orange-500 border px-2 py-1 rounded text-xs font-semibold">
                      {property.type}
                    </span>
                  </div> */}
                  <div className="absolute bottom-4 left-4">
                    {/* <div className="text-white font-semibold text-lg">
                      {property.price}
                    </div> */}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {property.name}
                  </h3>
                  <div className="flex items-center text-red-600 mb-4">
                    <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                    <span>{property.location}</span>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {property.description || "A premium property offering modern amenities and a prime location."}
                  </p>
<div className="grid grid-cols-3 gap-6 mb-6 text-sm bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg h-[80px] p-2">                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <FaBed className="h-4 w-4 text-black-500" />
                      </div>
                      <div className="font-semibold text-gray-900">{property.bed}</div>
                      <div className="text-gray-600">Beds</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <FaBath className="h-4 w-4 text-black-500" />
                      </div>
                      <div className="font-semibold text-gray-900">{property.bath}</div>
                      <div className="text-gray-600">Baths</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <FaRulerCombined className="h-4 w-4 text-black-500" />
                      </div>
                      <div className="font-semibold text-gray-900">{property.sqft}</div>
                      <div className="text-gray-600">Sqft</div>
                    </div>
                  </div>
                  <div className="mb-6">
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
                        <span className="text-xs text-black">
                          +{property.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      console.log("Clicked property ID:", property.id);
                      navigate("/building", { state: { propertyId: property.id, builderId: builderId } });
                    }}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center"
                  >
                    View Buildings List
                    <span className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
