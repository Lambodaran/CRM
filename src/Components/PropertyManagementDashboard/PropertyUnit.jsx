
import React, { useState, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BASE_URL = "https://crm-bcgg.onrender.com";
const UPLOAD_URL = "https://z-backend-2xag.onrender.com/api/upload/type";
const UNITS_API = "/api/properties/unit";
const FLOORS_API = "/api/properties/floors";

export default function UnitList() {
  const location = useLocation();
  const id = location.state?.id; // Added optional chaining in case state is undefined
  const navigate = useNavigate();

  // Get token with safety checks
  const getToken = () => {
    try {
      const logindata = sessionStorage.getItem("logindata");
      return logindata ? JSON.parse(logindata)?.token : null;
    } catch (error) {
      console.error("Error parsing login data:", error);
      return null;
    }
  };

  const token = getToken();

  const [units, setUnits] = useState([]);
  const [floors, setFloors] = useState([]);
  const [floorsid, setFloorsid] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [filterFacing, setFilterFacing] = useState("All");
  const [filterBHK, setFilterBHK] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [coordinatesInput, setCoordinatesInput] = useState("");
  const [isCoordinatesValid, setIsCoordinatesValid] = useState(true);
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState(null); // Added for dropdown

  // New Unit form state
  const [newUnit, setNewUnit] = useState({
    floor: "",
    unitNumber: "",
    bhkType: "",
    sizeSqFt: "",
    facing: "East",
    price: {
      totalPrice: "",
      pricePerSqft: "",
    },
    availability: "available",
    description: "",
    photos: [],
    videos: [],
    plan3D: [],
    coordinates: {},
  });

  // Temporary fields for file uploads
  const [newPhoto, setNewPhoto] = useState({ file: null, title: "" });
  const [newVideo, setNewVideo] = useState({ file: null, title: "" });
  const [newPlan3D, setNewPlan3D] = useState({ file: null, title: "" });

  // Fetch units from API
  const fetchUnits = async () => {
    if (!id) return; // Don't fetch if no ID

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/api/properties/units/by-floor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch units");
      const data = await response.json();
      setUnits(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching units:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch floors from API
  const fetchFloors = async () => {
    try {
      const response = await fetch(`${BASE_URL}${FLOORS_API}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch floors");
      const data = await response.json();
      setFloors(data);
    } catch (err) {
      console.error("Error fetching floors:", err);
    }
  };

  const fetchFloorsid = async () => {
    if (!id) return; // Don't fetch if no ID

    try {
      const response = await fetch(
        `${BASE_URL}/api/propertiesGet/floor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch floors by id");
      const data = await response.json();
      setFloorsid(Array.isArray(data) ? data : [data]); // Ensure it's always an array
    } catch (err) {
      console.error("Error fetching floors:", err);
      setFloorsid([]);
    }
  };

  useEffect(() => {
    if (token) {
      // Only fetch if we have a token
      fetchUnits();
      fetchFloors();
      fetchFloorsid();
    } else {
      setError("Authentication token is missing. Please log in again.");
    }
  }, [id, token]);

  const openModal = (unit) => {
    setSelectedUnit(unit);
    setPhotoIndex(0);
  };

  const closeModal = () => setSelectedUnit(null);

  const nextPhoto = () => {
    if (!selectedUnit) return;
    setPhotoIndex((prev) => (prev + 1) % selectedUnit.photos.length);
  };

  const prevPhoto = () => {
    if (!selectedUnit) return;
    setPhotoIndex(
      (prev) =>
        (prev - 1 + selectedUnit.photos.length) % selectedUnit.photos.length
    );
  };

  const filteredUnits = units.filter((u) => {
    const matchesFacing = filterFacing === "All" || u.facing === filterFacing;
    const matchesBHK = filterBHK === "" || u.bhkType.includes(filterBHK);
    return matchesFacing && matchesBHK;
  });

  // Handlers for Add Unit modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // handle nested price fields
    if (name === "totalPrice" || name === "pricePerSqft") {
      setNewUnit((prev) => ({
        ...prev,
        price: {
          ...prev.price,
          [name]: value,
        },
      }));
    } else {
      setNewUnit((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle file upload to the upload API
  const uploadFile = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("File upload failed");
      return await response.json();
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleAddPhoto = async () => {
    if (!newPhoto.file) return;

    try {
      const uploadResponse = await uploadFile(newPhoto.file, "image");
      setNewUnit((prev) => ({
        ...prev,
        photos: [
          ...prev.photos,
          {
            url: uploadResponse.fileUrl,
            title: newPhoto.title || "Photo",
            type: "image",
          },
        ],
      }));
      setNewPhoto({ file: null, title: "" });
    } catch (error) {
      alert("Failed to upload photo");
    }
  };

  const handleRemovePhoto = (index) => {
    setNewUnit((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleAddVideo = async () => {
    if (!newVideo.file) return;

    try {
      const uploadResponse = await uploadFile(newVideo.file, "video");
      setNewUnit((prev) => ({
        ...prev,
        videos: [
          ...prev.videos,
          {
            url: uploadResponse.fileUrl,
            title: newVideo.title || "Video",
            type: "video",
          },
        ],
      }));
      setNewVideo({ file: null, title: "" });
    } catch (error) {
      alert("Failed to upload video");
    }
  };

  const handleRemoveVideo = (index) => {
    setNewUnit((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const handleAddPlan3D = async () => {
    if (!newPlan3D.file) return;

    try {
      const uploadResponse = await uploadFile(newPlan3D.file, "3d");
      setNewUnit((prev) => ({
        ...prev,
        plan3D: [
          ...prev.plan3D,
          {
            url: uploadResponse.fileUrl,
            title: newPlan3D.title || "3D Plan",
            type: "3d",
          },
        ],
      }));
      setNewPlan3D({ file: null, title: "" });
    } catch (error) {
      alert("Failed to upload 3D plan");
    }
  };

  const handleRemovePlan3D = (index) => {
    setNewUnit((prev) => ({
      ...prev,
      plan3D: prev.plan3D.filter((_, i) => i !== index),
    }));
  };

  

  const validateCoordinates = (value) => {
    try {
      // Check if it's in the format "A-101": [num, num, num, num]
      const parsed = JSON.parse(`{${value}}`);
      const key = Object.keys(parsed)[0];
      const coords = parsed[key];

      if (!Array.isArray(coords) || coords.length !== 4) {
        return false;
      }

      return coords.every((num) => typeof num === "number" && !isNaN(num));
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // First verify we have a valid token
    if (!token || token === "undefined") {
      alert("Authentication token is missing or invalid. Please log in again.");
      // You might want to redirect to login here
      return;
    }

    try {
      const url = isEditing
        ? `${BASE_URL}${UNITS_API}/${newUnit._id}`
        : `${BASE_URL}${UNITS_API}`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          // Add if needed:
          // "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(newUnit),
      });

      // More detailed error handling
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Authentication failed. Please log in again."
          );
        }
        throw new Error(
          `Failed to ${isEditing ? "update" : "create"} unit. Status: ${
            response.status
          }`
        );
      }

      await fetchUnits(); // Refresh the unit list
      resetForm();
      setAddModalOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting unit:", error);
      alert(`Error: ${error.message}`);

      // If it's an auth error, you might want to:
      if (error.message.includes("Authentication failed")) {
        // Clear the invalid token and redirect to login
        localStorage.removeItem("token");
        // Redirect to login page
      }
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setNewUnit({
      floor: "",
      unitNumber: "",
      bhkType: "",
      sizeSqFt: "",
      facing: "East",
      price: {
        totalPrice: "",
        pricePerSqft: "",
      },
      availability: "available",
      description: "",
      photos: [],
      videos: [],
      plan3D: [],
      coordinates: {},
    });
  };

  // Handle edit button click
  const handleEdit = (unit) => {
    setNewUnit({
      ...unit,
      // Ensure we have empty arrays if these fields are null/undefined
      photos: unit.photos || [],
      videos: unit.videos || [],
      plan3D: unit.plan3D || [],
      coordinates: unit.coordinates || {},
    });
    setIsEditing(true);
    setAddModalOpen(true);
  };

  // Handle delete unit
  const handleDelete = async (unitId) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;

    try {
      const response = await fetch(`${BASE_URL}${UNITS_API}/${unitId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete unit");

      await fetchUnits(); // Refresh the unit list
    } catch (error) {
      console.error("Error deleting unit:", error);
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (newUnit.coordinates && Object.keys(newUnit.coordinates).length > 0) {
      const formatted = Object.entries(newUnit.coordinates)
        .map(([key, value]) => `"${key}": [${value.join(", ")}]`)
        .join(", ");
      setCoordinatesInput(formatted);
    }
  }, [newUnit.coordinates]);

  // navigation
  const goBack = () => navigate(-1);

  return (
    <div className="flex flex-col h-screen overflow-auto bg-gray-100 p-4">
      <IoMdArrowBack onClick={goBack} className="mb-2 text-2xl" />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-grow">
          <select
            className="border rounded p-2"
            value={filterFacing}
            onChange={(e) => setFilterFacing(e.target.value)}
          >
            <option value="All">All Directions</option>
            <option value="East">East</option>
            <option value="West">West</option>
            <option value="North">North</option>
            <option value="South">South</option>
          </select>
          <input
            type="text"
            placeholder="Filter by BHK (e.g., 2BHK)"
            value={filterBHK}
            onChange={(e) => setFilterBHK(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ml-auto"
          onClick={() => {
            resetForm();
            setIsEditing(false);
            setAddModalOpen(true);
          }}
        >
          Add Unit
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-[90%] mx-auto">
          {filteredUnits.length === 0 ? (
            <p className="text-center col-span-full text-gray-700">
              No units found.
            </p>
          ) : (
            filteredUnits.map((unit, index) => (
              <motion.div
                key={unit._id}
                className="rounded-lg w-[90%] mx-auto bg-white shadow-md"
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                }}
                role="button"
                aria-label={`View details for ${unit.unitNumber}`}
              >
                {unit.photos?.length > 0 ? (
                  <img
                    src={unit.photos[0].url}
                    alt={unit.photos[0].title}
                    className="w-full h-40 sm:h-48 md:h-60 object-cover cursor-pointer"
                    onClick={() => openModal(unit)}
                  />
                ) : (
                  <div
                    className="w-full h-40 sm:h-48 md:h-60 bg-gray-300 flex items-center justify-center text-gray-600 cursor-pointer"
                    onClick={() => openModal(unit)}
                  >
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1">
                    {unit.unitNumber} - {unit.bhkType}
                  </h3>
                  <p className="text-lg text-red-600 font-semibold mb-1">
                    ₹{unit.price?.totalPrice?.toLocaleString() || "Contact for Price"}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 12.414a2 2 0 10-2.828 2.828l4.243 4.243a2 2 0 002.828-2.828z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 19a8 8 0 100-16 8 8 0 000 16z"
                      />
                    </svg>
                    Facing: {unit.facing}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8h16M4 12h16M4 16h16"
                        />
                      </svg>
                      {unit.sizeSqFt || "Unknown Size"} sq.ft
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Status: {unit.availability}
                  </p>
                  <div className="relative z-10 mt-2">
                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpenIndex(dropdownOpenIndex === index ? null : index);
                      }}
                      className="relative bg-gray-200 p-2 rounded text-sm hover:bg-gray-300"
                      aria-haspopup="true"
                      aria-expanded={dropdownOpenIndex === index}
                      aria-controls={`details-${index}`}
                    >
                      Details ▼
                    </button> */}
                    {dropdownOpenIndex === index && (
                      <div
                        id={`details-${index}`}
                        className="absolute top-0 right-0 bg-white border rounded shadow mt-2 p-3 w-56 z-20"
                      >
                        <p>
                          <strong>Floor:</strong>{" "}
                          {floorsid.find((f) => f._id === unit.floor)?.floorNumber || "N/A"}
                        </p>
                        <p>
                          <strong>BHK:</strong> {unit.bhkType || "N/A"}
                        </p>
                        <p>
                          <strong>Size:</strong> {unit.sizeSqFt || "N/A"} sq.ft
                        </p>
                        <p>
                          <strong>Price per Sq.ft:</strong> ₹
                          {unit.price?.pricePerSqft?.toLocaleString() || "N/A"}
                        </p>
                        <p>
                          <strong>Description:</strong>{" "}
                          {unit.description || "None"}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="bg-blue-600 text-white p-2 text-sm rounded hover:bg-blue-700 flex-grow"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(unit);
                        setDropdownOpenIndex(null);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="bg-yellow-600 text-white p-2 text-sm rounded hover:bg-yellow-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(unit);
                        setDropdownOpenIndex(null);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white p-2 text-sm rounded hover:bg-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(unit._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {/* View Unit Details Modal */}
      {selectedUnit && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold mb-3">
              {selectedUnit.unitNumber} - {selectedUnit.bhkType}
            </h2>
            <p className="mb-2 text-gray-700">{selectedUnit.description}</p>
            <p className="mb-2 text-gray-700">Facing: {selectedUnit.facing}</p>
            <p className="mb-2 text-gray-700">
              Size: {selectedUnit.sizeSqFt} sq.ft
            </p>
            <p className="mb-2 text-gray-700">
              Price: ₹{selectedUnit.price?.totalPrice?.toLocaleString()}
            </p>
            <p className="mb-4 text-gray-700">
              Availability: {selectedUnit.availability}
            </p>

            <div className="flex gap-4 mb-4">
              <button
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                onClick={() => {
                  handleEdit(selectedUnit);
                  closeModal();
                }}
              >
                Edit Unit
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => {
                  handleDelete(selectedUnit._id);
                  closeModal();
                }}
              >
                Delete Unit
              </button>
            </div>

            <div className="mb-4">
              <strong>Photos:</strong>
              {selectedUnit.photos?.length > 0 ? (
                <div className="relative mt-2">
                  <img
                    src={selectedUnit.photos[photoIndex].url}
                    alt={`Photo ${photoIndex + 1}`}
                    className="rounded max-h-96 w-full object-contain"
                  />
                  {selectedUnit.photos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r hover:bg-opacity-75"
                      >
                        ‹
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l hover:bg-opacity-75"
                      >
                        ›
                      </button>
                    </>
                  )}
                  <p className="text-center mt-1 text-gray-600">
                    Photo {photoIndex + 1} / {selectedUnit.photos.length}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 mt-2">No photos available.</p>
              )}
            </div>

            <div className="mb-4">
              <strong>Videos:</strong>
              {selectedUnit.videos?.length > 0 ? (
                <div className="space-y-4 mt-2">
                  {selectedUnit.videos.map((video, i) => (
                    <video
                      key={i}
                      controls
                      src={video.url}
                      className="w-full max-h-64 rounded"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 mt-2">No videos available.</p>
              )}
            </div>

            <div>
              <strong>3D Plans:</strong>
              {selectedUnit.plan3D?.length > 0 ? (
                <div className="space-y-4 mt-2">
                  {selectedUnit.plan3D.map((plan, i) => (
                    <div key={i} className="border rounded p-2">
                      <p className="font-medium">{plan.title || "3D Plan"}</p>
                      <a
                        href={plan.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View 3D Plan
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 mt-2">No 3D plans available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Unit Modal */}
      {addModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-auto"
          onClick={() => setAddModalOpen(false)}
        >
          <form
            className="bg-white rounded-lg max-w-3xl w-full max-h-full overflow-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold mb-6">
              {isEditing ? "Edit Unit" : "Add New Unit"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Floor</label>
                <select
                  name="floor"
                  value={newUnit.floor}
                  onChange={handleInputChange}
                  required
                  className="border rounded p-2 w-full"
                >
                  <option value="">Select Floor</option>
                  {Array.isArray(floorsid) &&
                    floorsid.map((floor) => (
                      <option key={floor._id} value={floor._id}>
                        {floor.floorNumber}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Unit Number</label>
                <input
                  type="text"
                  name="unitNumber"
                  value={newUnit.unitNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. A-101"
                  className="border rounded p-2 w-full"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">BHK Type</label>
                <input
                  type="text"
                  name="bhkType"
                  value={newUnit.bhkType}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 2BHK"
                  className="border rounded p-2 w-full"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Size (sq.ft)</label>
                <input
                  type="number"
                  name="sizeSqFt"
                  value={newUnit.sizeSqFt}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 850"
                  className="border rounded p-2 w-full"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Facing</label>
                <select
                  name="facing"
                  value={newUnit.facing}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full"
                  required
                >
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Availability</label>
                <select
                  name="availability"
                  value={newUnit.availability}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full"
                  required
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Total Price (₹)
                </label>
                <input
                  type="number"
                  name="totalPrice"
                  value={newUnit.price.totalPrice}
                  onChange={handleInputChange}
                  placeholder="e.g. 4500000"
                  className="border rounded p-2 w-full"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Price per Sq.ft (₹)
                </label>
                <input
                  type="number"
                  name="pricePerSqft"
                  value={newUnit.price.pricePerSqft}
                  onChange={handleInputChange}
                  placeholder="e.g. 5294"
                  className="border rounded p-2 w-full"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                name="description"
                value={newUnit.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter description"
                className="border rounded p-2 w-full"
              />
            </div>

            
            <div className="col-span-full">
              <label className="block font-semibold mb-1">Coordinates</label>
              <input
                type="text"
                name="coordinates"
                value={coordinatesInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setCoordinatesInput(value); // ✅ Always update input field immediately

                  const isValid = validateCoordinates(value);
                  setIsCoordinatesValid(isValid); // ✅ Update validity

                  if (isValid) {
                    try {
                      const parsed = JSON.parse(`{${value}}`);
                      setNewUnit((prev) => ({
                        ...prev,
                        coordinates: parsed,
                      }));
                    } catch (error) {
                      console.error("Error parsing coordinates:", error);
                    }
                  } else {
                    setNewUnit((prev) => ({
                      ...prev,
                      coordinates: {},
                    }));
                  }
                }}
                placeholder='e.g. "A-101": [13.0827, 80.2707, 13.0830, 80.2708]'
                className={`border rounded p-2 w-full ${
                  !isCoordinatesValid && coordinatesInput
                    ? "border-red-500"
                    : ""
                }`}
              />

              <p className="text-sm text-gray-500 mt-1">
                Format: UnitNumber: [lat1, long1, lat2, long2]
              </p>
            </div>

            {/* Photos */}
            <div className="mt-6">
              <h3 className="font-bold mb-2">Photos</h3>

              <div className="flex gap-2 items-center mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewPhoto((prev) => ({
                      ...prev,
                      file: e.target.files[0],
                    }))
                  }
                  className="border rounded p-2 flex-grow"
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={newPhoto.title}
                  onChange={(e) =>
                    setNewPhoto((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="border rounded p-2 flex-grow"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Add
                </button>
              </div>

              {newUnit.photos.length === 0 && (
                <p className="text-gray-600">No photos added.</p>
              )}

              <ul className="list-disc list-inside space-y-1 max-h-32 overflow-auto border rounded p-2 bg-gray-50">
                {newUnit.photos.map((photo, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>
                      {photo.title || "No Title"} -{" "}
                      {(photo.url || "").substring(0, 30)}
                      ...
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Videos */}
            <div className="mt-6">
              <h3 className="font-bold mb-2">Videos</h3>

              <div className="flex gap-2 items-center mb-2">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setNewVideo((prev) => ({
                      ...prev,
                      file: e.target.files[0],
                    }))
                  }
                  className="border rounded p-2 flex-grow"
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={newVideo.title}
                  onChange={(e) =>
                    setNewVideo((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="border rounded p-2 flex-grow"
                />
                <button
                  type="button"
                  onClick={handleAddVideo}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Add
                </button>
              </div>

              {newUnit.videos.length === 0 && (
                <p className="text-gray-600">No videos added.</p>
              )}

              <ul className="list-disc list-inside space-y-1 max-h-32 overflow-auto border rounded p-2 bg-gray-50">
                {newUnit.videos.map((video, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>
                      {video.title || "No Title"} -{" "}
                      {(video.url || "").substring(0, 30)}
                      ...
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(i)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3D Plans */}
            <div className="mt-6">
              <h3 className="font-bold mb-2">3D Plans</h3>

              <div className="flex gap-2 items-center mb-2">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setNewPlan3D((prev) => ({
                      ...prev,
                      file: e.target.files[0],
                    }))
                  }
                  className="border rounded p-2 flex-grow"
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={newPlan3D.title}
                  onChange={(e) =>
                    setNewPlan3D((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="border rounded p-2 flex-grow"
                />
                <button
                  type="button"
                  onClick={handleAddPlan3D}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Add
                </button>
              </div>

              {newUnit.plan3D.length === 0 && (
                <p className="text-gray-600">No 3D plans added.</p>
              )}

              <ul className="list-disc list-inside space-y-1 max-h-32 overflow-auto border rounded p-2 bg-gray-50">
                {newUnit.plan3D.map((plan, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>
                      {plan.title || "No Title"} -{" "}
                      {(plan.url || "").substring(0, 30)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePlan3D(i)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setAddModalOpen(false);
                  setIsEditing(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isEditing ? "Update Unit" : "Save Unit"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

