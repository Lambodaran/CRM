import { useState, useEffect } from "react";

// Default image for properties with no photos
const defaultImage = "https://via.placeholder.com/150?text=No+Image";

const NewProperties = () => {
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

        // Map backend data to component's expected structure
        const mappedProperties = data.map((item) => ({
          id: item._id,
          name: item.projectName,
          price: item.price, // Placeholder since price is not in backend data
          image: item.media.photos.length > 0 ? item.media.photos[0].url : defaultImage,
        }));

        setProperties(mappedProperties);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white shadow rounded-lg max-w-md w-full mr-3 animate-pulse">
        {/* Skeleton for header */}
        <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
        {/* Skeleton for property items */}
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
            >
              {/* Skeleton for image */}
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              {/* Skeleton for text */}
              <div className="flex-1 px-4 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-md w-full mr-3">
      <h2 className="text-xl font-semibold mb-4">New properties</h2>
      <div className="space-y-4">
        {properties.map((property) => (
          <div
            key={property.id}
            className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
          >
            <img
              src={property.image}
              alt={property.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 px-4">
              <p className="text-sm font-medium">{property.name}</p>
              <p className="text-lg font-bold">{property.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewProperties;