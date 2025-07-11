



// import React, { useState, useEffect } from "react";

// const BASE_URL = "https://crm-bcgg.onrender.com";

// const CardSection = ({
//   autoSlideInterval = 5000,
//   className = "",
//   height = "300px", // Added customizable height
// }) => {
//   const [currentAdIndex, setCurrentAdIndex] = useState(0);
//   const [ads, setAds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch ads from backend API
//   useEffect(() => {
//     const fetchAds = async () => {
//       try {
//         const logindata = JSON.parse(sessionStorage.getItem("logindata"));
//         if (!logindata?.token) {
//           throw new Error("No authentication token found");
//         }

//         const response = await fetch(`${BASE_URL}/api/ads/`, {
//           headers: {
//             Authorization: `Bearer ${logindata.token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to fetch ads: ${response.status}`);
//         }

//         const data = await response.json();

//         // Filter only active ads and map to the expected format
//         const formattedAds = data
//           .filter((ad) => ad.isActive)
//           .map((ad) => ({
//             id: ad._id,
//             title: ad.title,
//             description: ad.description,
//             image: ad.image,
//             ctaText: ad.ctaText || "View Offer",
//             redirectUrl: ad.redirectUrl || "#",
//           }));

//         setAds(formattedAds);
//       } catch (err) {
//         console.error("Error fetching ads:", err);
//         setError(err.message);

//         // Fallback to default ads if API fails
//         setAds([
//           {
//             id: "default-1",
//             title: "Limited Time Offer",
//             description: "Get 50% off on your first property booking!",
//             image:
//               "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
//             ctaText: "Book Now",
//             redirectUrl: "#",
//           },
//           {
//             id: "default-2",
//             title: "New Properties Added",
//             description: "Explore our latest luxury properties!",
//             image:
//               "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
//             ctaText: "Explore",
//             redirectUrl: "#",
//           },
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAds();
//   }, []);

//   // Auto-slide functionality
//   useEffect(() => {
//     if (ads.length <= 1) return; // Don't auto-slide if only one ad

//     const interval = setInterval(() => {
//       setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
//     }, autoSlideInterval);

//     return () => clearInterval(interval);
//   }, [ads.length, autoSlideInterval]);

//   const goToNext = () => {
//     setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
//   };

//   const goToPrev = () => {
//     setCurrentAdIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
//   };

//   const handleCtaClick = (url) => {
//     if (url && url !== "#") {
//       window.open(url, "_blank");
//     }
//   };

//   if (loading) {
//     return (
//       <div
//         className={`flex justify-center items-center p-4 rounded-lg w-full ${className}`}
//         style={{ height }}
//       >
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//           <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         className={`flex flex-col justify-center items-center p-4 rounded-lg w-full bg-red-50 ${className}`}
//         style={{ height }}
//       >
//         <p className="text-red-500 mb-2">Error loading ads</p>
//         <p className="text-sm text-gray-600">{error}</p>
//       </div>
//     );
//   }

//   if (ads.length === 0) {
//     return (
//       <div
//         className={`flex justify-center items-center p-4 rounded-lg w-full bg-gray-50 ${className}`}
//         style={{ height }}
//       >
//         <p className="text-gray-500">No active ads available</p>
//       </div>
//     );
//   }

//   const currentAd = ads[currentAdIndex];

//   return (
//     <div
//       className={`relative rounded-lg w-full overflow-hidden group ${className}`}
//       style={{ height }}
//     >
//       {/* Navigation arrows - only show if multiple ads */}
//       {ads.length > 1 && (
//         <>
//           <button
//             onClick={goToPrev}
//             className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-30 text-white rounded-full p-2 hover:bg-opacity-50 transition-all opacity-0 group-hover:opacity-100"
//             aria-label="Previous ad"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </button>

//           <button
//             onClick={goToNext}
//             className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-30 text-white rounded-full p-2 hover:bg-opacity-50 transition-all opacity-0 group-hover:opacity-100"
//             aria-label="Next ad"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </button>
//         </>
//       )}

//       {/* Ad Section with background image */}
//       <div
//         className="w-full h-full bg-cover bg-center transition-all duration-500 ease-in-out"
//         style={{
//           backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${currentAd.image})`,
//         }}
//       >
//         <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
//           {/* <h2 className="text-2xl font-bold mb-1">{currentAd.title}</h2> */}
//           <p className="text-lg mb-4">{currentAd.description}</p>
//           {/* <button
//             onClick={() => handleCtaClick(currentAd.redirectUrl)}
//             className="bg-white text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
//           >
           
//           </button> */}
//         </div>
//       </div>

//       {/* Indicator dots - only show if multiple ads */}
//       {ads.length > 1 && (
//         <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
//           {ads.map((ad, index) => (
//             <button
//               key={ad.id}
//               onClick={() => setCurrentAdIndex(index)}
//               className={`w-3 h-3 rounded-full transition-all ${
//                 index === currentAdIndex
//                   ? "bg-white w-6"
//                   : "bg-white bg-opacity-50"
//               }`}
//               aria-label={`Go to ad ${index + 1}`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CardSection;




import React, { useState, useEffect } from "react";

const BASE_URL = "https://crm-bcgg.onrender.com";
const logindata = JSON.parse(sessionStorage.getItem("logindata"));

const CardSection = ({ autoSlideInterval = 3000, className = "" }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ads from backend API
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/ads/`, {
          headers: {
            Authorization: `Bearer ${logindata?.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Filter only active ads and keep only image and redirectUrl
        const formattedAds = data
          .filter((ad) => ad.isActive)
          .map((ad) => ({
            adImage: ad.image,
            redirectUrl: ad.redirectUrl,
          }));

        setAds(formattedAds);
      } catch (err) {
        console.error("Error fetching ads:", err);
        setError(err.message);

        // Fallback to default ads if API fails (images only)
        setAds([
          {
            adImage:
              "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            redirectUrl: "https://example.com/offers",
          },
          {
            adImage:
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            redirectUrl: "https://example.com/properties",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [ads.length, autoSlideInterval]);

  const handleImageClick = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center p-4 rounded-lg w-full h-[300px] ${className}`}
      >
        <p>Loading ads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex justify-center items-center p-4 rounded-lg w-full h-[300px] ${className}`}
      >
        <p>Error loading ads: {error}</p>
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div
        className={`flex justify-center items-center p-4 rounded-lg w-full h-[300px] ${className}`}
      >
        <p>No active ads available</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[300px] overflow-hidden ${className}`}>
      {/* Slideshow images */}
      <div className="relative w-full h-full">
        {ads.map((ad, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentAdIndex ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => handleImageClick(ad.redirectUrl)}
            style={{ cursor: ad.redirectUrl ? "pointer" : "default" }}
          >
            <img
              src={ad.adImage}
              alt="Advertisement"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Indicator dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {ads.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentAdIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentAdIndex
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CardSection;
