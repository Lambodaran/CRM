import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PropertiesPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("https://crm-bcgg.onrender.com/api/properties/project");
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await response.json();
        setProperties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handlePropertyClick = (propertyId) => {
    console.log("Navigating with property ID:", propertyId);
    navigate("/property", { state: { propertyId } });
  };

  const formatLocation = (location) => {
    if (!location) return "Location not available";
    if (typeof location === "string") return location;
    return `${location.area || ""}, ${location.city || ""} ${location.pincode ? `- ${location.pincode}` : ""}`.trim();
  };

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

  if (properties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4 text-center">
        No properties found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {properties.map((property, index) => {
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
              <p className="text-lg mt-1 text-red-600 font-semibold">
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
  );
};

export default PropertiesPage;