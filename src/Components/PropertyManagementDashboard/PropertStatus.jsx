// import React, { useState } from "react";
// import status1 from "../PropertyManagementDashboard/Assets/status1.png";
// import status2 from "../PropertyManagementDashboard/Assets/status2.png";
// import status3 from "../PropertyManagementDashboard/Assets/status3.png";
// import status4 from "../PropertyManagementDashboard/Assets/status4.png";
// import status5 from "../PropertyManagementDashboard/Assets/status5.png";
// import status6 from "../PropertyManagementDashboard/Assets/status6.png";

// const token = JSON.parse(sessionStorage.getItem("logindata"))?.token;
// const BASE_URL = "https://crm-bcgg.onrender.com";

// const properties = [
//   {
//     id: 1,
//     image: status1,
//     name: "Sunset Apartments",
//     address: "24, Broad Street, TN",
//     info: "Rental Income: ₹25,000/mo",
//   },
//   {
//     id: 2,
//     image: status2,
//     name: "Sunset Apartments",
//     address: "24, Broad Street, TN",
//     info: "Awaiting permit: Approval",
//   },
//   {
//     id: 3,
//     image: status3,
//     name: "Sunset Apartments",
//     address: "24, Broad Street, TN",
//     info: "Quote price: 15,00,000",
//   },
//   {
//     id: 4,
//     image: status4,
//     name: "Oakwood Residency",
//     address: "12, Elm Street, NY",
//     info: "Under maintenance",
//   },
//   {
//     id: 5,
//     image: status5,
//     name: "Maple Heights",
//     address: "77, Pine Avenue, CA",
//     info: "Rental Income: ₹18,500/mo",
//   },
//   {
//     id: 6,
//     image: status6,
//     name: "River View Towers",
//     address: "102, River Lane, TX",
//     info: "New listing",
//   },
// ];

// const PropertyStatus = () => {
//   const [showAll, setShowAll] = useState(false);

//   const displayedProperties = showAll ? properties : properties.slice(0, 3);

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">Property Status</h2>
//         <button
//           onClick={() => setShowAll(!showAll)}
//           className="text-blue-500 text-sm"
//         >
//           {showAll ? "Show less" : "View all"}
//         </button>
//       </div>

//       {/* Property List */}
//       <div>
//         {displayedProperties.map((property) => (
//           <div
//             key={property.id}
//             className="flex items-center mb-4 border-b pb-2"
//           >
//             <img
//               src={property.image}
//               alt={property.name}
//               className="w-16 h-16 rounded-md object-cover mr-4"
//             />
//             <div>
//               <h3 className="font-semibold">{property.name}</h3>
//               <p className="text-gray-500 text-sm">{property.address}</p>
//               <p className="text-gray-700 text-sm">{property.info}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PropertyStatus;






import React, { useState, useEffect } from "react";
import status1 from "../PropertyManagementDashboard/Assets/status1.png";
import status2 from "../PropertyManagementDashboard/Assets/status2.png";
import status3 from "../PropertyManagementDashboard/Assets/status3.png";
import status4 from "../PropertyManagementDashboard/Assets/status4.png";
import status5 from "../PropertyManagementDashboard/Assets/status5.png";
import status6 from "../PropertyManagementDashboard/Assets/status6.png";

const BASE_URL = "https://crm-bcgg.onrender.com";

const PropertyStatus = () => {
  const [showAll, setShowAll] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Get user data from session storage
        const logindata = JSON.parse(sessionStorage.getItem("logindata"));
        if (!logindata || !logindata.token) {
          throw new Error("User not authenticated");
        }

        const token = logindata.token;
        const userId = logindata.user?.id;

        // First, get builderId
        const builderProfileResponse = await fetch(
          `${BASE_URL}/api/properties/builder-profile/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!builderProfileResponse.ok) {
          throw new Error("Failed to fetch builder profile");
        }

        const builderProfile = await builderProfileResponse.json();
        const builderId = builderProfile._id;

        // Then, get projects
        const projectsResponse = await fetch(
          `${BASE_URL}/api/properties/projects/by-builder/${builderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!projectsResponse.ok) {
          throw new Error("Failed to fetch projects");
        }

        const projectsData = await projectsResponse.json();

        // Map the API response to your properties format
        const mappedProperties = projectsData.map((project, index) => {
          // Use placeholder images if no photos available
          const placeholderImages = [
            status1,
            status2,
            status3,
            status4,
            status5,
            status6,
          ];
          const imageUrl =
            project.media?.photos?.[0]?.url || placeholderImages[index % 6];

          // Format address
          const address = `${project.location?.area || ""}, ${
            project.location?.city || ""
          }, ${project.location?.pincode || ""}`;

          // Create info based on project status
          let info = "";
          if (project.status === "Active" && project.type === "For Sale") {
            info = `Quote price: ₹${project.price?.toLocaleString() || "0"}`;
          } else if (
            project.status === "Active" &&
            project.type === "For Rent"
          ) {
            info = `Rental Income: ₹${
              project.price?.toLocaleString() || "0"
            }/mo`;
          } else {
            info = `Status: ${project.status}`;
          }

          return {
            id: project._id,
            image: imageUrl,
            name: project.projectName || "Unnamed Project",
            address: address.trim(),
            info: info,
            amenities: project.amenities?.join(", ") || "No amenities listed",
          };
        });

        setProperties(mappedProperties);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching properties:", err);

        // Set default properties in case of error
        setProperties([
          {
            id: 1,
            image: status1,
            name: "Sunset Apartments",
            address: "24, Broad Street, TN",
            info: "Rental Income: ₹25,000/mo",
            amenities: "Swimming pool, Gym",
          },
          {
            id: 2,
            image: status2,
            name: "Sunset Apartments",
            address: "24, Broad Street, TN",
            info: "Awaiting permit: Approval",
            amenities: "Park, Play area",
          },
          {
            id: 3,
            image: status3,
            name: "Sunset Apartments",
            address: "24, Broad Street, TN",
            info: "Quote price: 15,00,000",
            amenities: "Club house, Security",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const displayedProperties = showAll ? properties : properties.slice(0, 3);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Property Status</h2>
          <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {[1, 2, 3].map((id) => (
          <div key={id} className="flex items-center mb-4 border-b pb-2">
            <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Property Status</h2>
          <span className="text-red-500 text-sm">Error loading data</span>
        </div>
        <p className="text-red-500 text-sm mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Property Status</h2>
        {properties.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-500 text-sm"
          >
            {showAll ? "Show less" : "View all"}
          </button>
        )}
      </div>

      {/* Property List */}
      <div>
        {displayedProperties.map((property) => (
          <div
            key={property.id}
            className="flex items-center mb-4 border-b pb-2"
          >
            <img
              src={property.image}
              alt={property.name}
              className="w-16 h-16 rounded-md object-cover mr-4"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const placeholders = [
                  status1,
                  status2,
                  status3,
                  status4,
                  status5,
                  status6,
                ];
                e.target.src = placeholders[Math.floor(Math.random() * 6)];
              }}
            />
            <div>
              <h3 className="font-semibold">{property.name}</h3>
              <p className="text-gray-500 text-sm">{property.address}</p>
              <p className="text-gray-700 text-sm">{property.info}</p>
              <p className="text-gray-500 text-xs mt-1">
                Amenities: {property.amenities}
              </p>
            </div>
          </div>
        ))}
        {properties.length === 0 && (
          <p className="text-gray-500 text-sm">No properties found</p>
        )}
      </div>
    </div>
  );
};

export default PropertyStatus;
