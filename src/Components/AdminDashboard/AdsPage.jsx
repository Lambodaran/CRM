


// import React, { useState, useEffect } from "react";
// import { Plus, Trash2, Edit } from "lucide-react";
// import { Dialog } from "@headlessui/react";
// import axios from "axios";

// const token = JSON.parse(sessionStorage.getItem("logindata"))?.token;
// const BASE_URL =  "https://crm-bcgg.onrender.com";

// const AdsPage = () => {
//   const [ads, setAds] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     image: "",
//     redirectUrl: "",
//     isActive: true,
//   });
//   const [editId, setEditId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [imageFile, setImageFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);

//   const role = "admin";

//   // Fetch all ads on component mount
//   useEffect(() => {
//     fetchAds();
//   }, []);

//   const fetchAds = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`${BASE_URL}/api/ads/all`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setAds(response.data);
//     } catch (err) {
//       console.error("Error fetching ads:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setImageFile(file);
//     setIsUploading(true);

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await axios.post(
//         `https://z-backend-2xag.onrender.com/api/upload/type`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setFormData((prev) => ({
//         ...prev,
//         image: response.data.fileUrl,
//       }));
//     } catch (err) {
//       console.error("Error uploading image:", err);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editId) {
//         // Update existing ad
//         await axios.put(`${BASE_URL}/api/ads/${editId}`, formData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       } else {
//         // Create new ad
//         await axios.post(`${BASE_URL}/api/ads/`, formData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       }
//       fetchAds(); // Refresh the ads list
//       setIsOpen(false);
//       setFormData({ title: "", image: "", redirectUrl: "", isActive: true });
//       setEditId(null);
//       setImageFile(null);
//     } catch (err) {
//       console.error("Error saving ad:", err);
//     }
//   };

//   const handleEdit = (ad) => {
//     setFormData({
//       title: ad.title,
//       image: ad.image,
//       redirectUrl: ad.redirectUrl,
//       isActive: ad.isActive,
//     });
//     setEditId(ad._id);
//     setIsOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this ad?")) return;
//     try {
//       await axios.delete(`${BASE_URL}/api/ads/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       fetchAds(); // Refresh the ads list
//     } catch (err) {
//       console.error("Error deleting ad:", err);
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Ad Banners</h1>
//         {role === "admin" && (
//           <button
//             onClick={() => {
//               setIsOpen(true);
//               setEditId(null);
//               setFormData({
//                 title: "",
//                 image: "",
//                 redirectUrl: "",
//                 isActive: true,
//               });
//             }}
//             className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             <Plus className="mr-2" size={18} />
//             Add Ad
//           </button>
//         )}
//       </div>

//       {/* Loading state */}
//       {isLoading && <div className="text-center py-4">Loading ads...</div>}

//       {/* Ads Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {ads.map((ad) => (
//           <div key={ad._id} className="bg-white rounded-lg shadow-md relative">
//             <div className="aspect-w-16">
//               <img
//                 src={ad.image}
//                 alt={ad.title}
//                 className="w-full object-contain"
//               />
//             </div>
//             <h3 className="text-lg font-semibold mt-2 p-2">{ad.title}</h3>
//             <a
//               href={ad.redirectUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 text-sm p-2"
//             >
//               Visit Link
//             </a>
//             <div className="text-sm mt-1 p-2">
//               Status:{" "}
//               <span className={ad.isActive ? "text-green-600" : "text-red-500"}>
//                 {ad.isActive ? "Active" : "Inactive"}
//               </span>
//             </div>

//             {/* Admin controls */}
//             {role === "admin" && (
//               <div className="absolute bottom-2 p-2 right-2 flex gap-2">
//                 <button
//                   onClick={() => handleEdit(ad)}
//                   className="text-blue-600 hover:text-blue-800"
//                 >
//                   <Edit size={18} />
//                 </button>
//                 <button
//                   onClick={() => handleDelete(ad._id)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       <Dialog
//         open={isOpen}
//         onClose={() => setIsOpen(false)}
//         className="relative z-50"
//       >
//         <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
//             <Dialog.Title className="text-lg font-bold mb-4">
//               {editId ? "Edit Ad" : "Create New Ad"}
//             </Dialog.Title>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium">Title</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-3 py-2 border rounded mt-1"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">Image</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="w-full px-3 py-2 border rounded mt-1"
//                 />
//                 {isUploading && (
//                   <p className="text-sm text-gray-500">Uploading image...</p>
//                 )}
//                 {formData.image && !isUploading && (
//                   <div className="mt-2">
//                     <img
//                       src={formData.image}
//                       alt="Preview"
//                       className="h-20 object-contain"
//                     />
//                     <p className="text-xs text-gray-500 mt-1">
//                       Image URL: {formData.image}
//                     </p>
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">
//                   Redirect URL
//                 </label>
//                 <input
//                   type="url"
//                   name="redirectUrl"
//                   value={formData.redirectUrl}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-3 py-2 border rounded mt-1"
//                 />
//               </div>
//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   name="isActive"
//                   checked={formData.isActive}
//                   onChange={handleInputChange}
//                 />
//                 <label className="text-sm">Active</label>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsOpen(false)}
//                   className="px-4 py-2 rounded bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//                   disabled={isUploading}
//                 >
//                   {editId ? "Update" : "Create"}
//                 </button>
//               </div>
//             </form>
//           </Dialog.Panel>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default AdsPage;


import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { Dialog } from "@headlessui/react";
import axios from "axios";

const BASE_URL = "https://crm-bcgg.onrender.com";
const IMAGE_UPLOAD_URL = "https://z-backend-2xag.onrender.com/api/upload/type";

const AdsPage = () => {
  // State management
  const [ads, setAds] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    redirectUrl: "",
    isActive: true,
  });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const role = "admin";

  // Get token from sessionStorage
  const getToken = () => {
    try {
      const logindata = sessionStorage.getItem("logindata");
      return logindata ? JSON.parse(logindata)?.token : null;
    } catch (err) {
      console.error("Error parsing token:", err);
      return null;
    }
  };

  // Fetch all ads on component mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchAds();
    } else {
      setError("Authentication token not found. Please login again.");
    }
  }, []);

  const fetchAds = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(`${BASE_URL}/api/ads/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAds(response.data);
    } catch (err) {
      console.error("Error fetching ads:", err);
      setError(
        err.response?.data?.message || "Failed to fetch ads. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size (optional)
    if (!file.type.match("image.*")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = getToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.post(IMAGE_UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData((prev) => ({
        ...prev,
        image: response.data.fileUrl,
      }));
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(
        err.response?.data?.message ||
          "Failed to upload image. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      const token = getToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.redirectUrl.trim()) {
        throw new Error("Redirect URL is required");
      }
      if (!formData.image) {
        throw new Error("Please upload an image");
      }

      const apiCall = editId
        ? axios.put(`${BASE_URL}/api/ads/${editId}`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : axios.post(`${BASE_URL}/api/ads/`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });

      const response = await apiCall;

      setSuccess(
        editId ? "Ad updated successfully!" : "Ad created successfully!"
      );
      await fetchAds();

      // Reset form only if successful
      setIsOpen(false);
      setFormData({ title: "", image: "", redirectUrl: "", isActive: true });
      setEditId(null);
      setImageFile(null);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving ad:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save ad. Please try again."
      );
    }
  };

  const handleEdit = (ad) => {
    setFormData({
      title: ad.title,
      image: ad.image,
      redirectUrl: ad.redirectUrl,
      isActive: ad.isActive,
    });
    setEditId(ad._id);
    setIsOpen(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      await axios.delete(`${BASE_URL}/api/ads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Ad deleted successfully!");
      await fetchAds();

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting ad:", err);
      setError(
        err.response?.data?.message || "Failed to delete ad. Please try again."
      );
    }
  };

  return (
    <div className="p-6">
      {/* Status messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ad Banners</h1>
        {role === "admin" && (
          <button
            onClick={() => {
              setIsOpen(true);
              setEditId(null);
              setFormData({
                title: "",
                image: "",
                redirectUrl: "",
                isActive: true,
              });
              setError(null);
            }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            <Plus className="mr-2" size={18} />
            Add Ad
          </button>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p>Loading ads...</p>
        </div>
      )}

      {/* Ads Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.length > 0 ? (
            ads.map((ad) => (
              <div
                key={ad._id}
                className="bg-white rounded-lg shadow-md overflow-hidden relative hover:shadow-lg transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x150?text=Image+Not+Found";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{ad.title}</h3>
                  <a
                    href={ad.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Visit Link
                  </a>
                  <div className="text-sm mt-2">
                    Status:{" "}
                    <span
                      className={
                        ad.isActive ? "text-green-600" : "text-red-500"
                      }
                    >
                      {ad.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Admin controls */}
                  {role === "admin" && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(ad)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(ad._id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No ads found. Create your first ad!
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-6">
              <Dialog.Title className="text-lg font-bold mb-4">
                {editId ? "Edit Ad" : "Create New Ad"}
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter ad title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                      Uploading image...
                    </div>
                  )}
                  {formData.image && !isUploading && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="h-20 object-contain border rounded"
                      />
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {formData.image}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Redirect URL *
                  </label>
                  <input
                    type="url"
                    name="redirectUrl"
                    value={formData.redirectUrl}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUploading || !formData.image}
                  >
                    {isUploading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {editId ? "Updating..." : "Creating..."}
                      </span>
                    ) : editId ? (
                      "Update"
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default AdsPage;
