




// import React, { useState, useEffect } from "react";
// import { Dialog, Menu } from "@headlessui/react";
// import { Plus, MoreVertical, Edit, Trash2, MapPin } from "lucide-react";
// import axios from "axios";

// export default function BrokerAgentPage() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);
//   const [filterType, setFilterType] = useState("All");
//   const [properties, setProperties] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [brokers, setBrokers] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [token, setToken] = useState(null);
//   const [formData, setFormData] = useState({
//     user: "",
//     companyName: "",
//     avatarUrl: "",
//     properties: "",
//     name: "",
//     email: "",
//     phone: "",
//     location: "",
//     selectType: "",
//     activeListings: "",
//     closedDeals: "",
//     commissionRate: "",
//   });

//   const BASE_URL = "https://crm-bcgg.onrender.com";

//   // Get token when component mounts
//   useEffect(() => {
//     const storedToken = JSON.parse(sessionStorage.getItem("logindata"))?.token;
//     if (storedToken) {
//       setToken(storedToken);
//     }
//   }, []);

//   // Fetch data when token changes
//   useEffect(() => {
//     if (!token) return;

//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [brokersRes, usersRes, propertiesRes] = await Promise.all([
//           fetch(`${BASE_URL}/api/broker/all`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${BASE_URL}/api/users`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${BASE_URL}/api/properties/units`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         if (!brokersRes.ok || !usersRes.ok || !propertiesRes.ok) {
//           throw new Error("Failed to fetch data");
//         }

//         const [brokersData, usersData, propertiesData] = await Promise.all([
//           brokersRes.json(),
//           usersRes.json(),
//           propertiesRes.json(),
//         ]);

//         setBrokers(
//           brokersData.map((broker) => ({
//             ...broker,
//             user: broker.user || null,
//           }))
//         );
//         setUsers(usersData);
//         setProperties(propertiesData);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         alert("Failed to load data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     const interval = setInterval(() => {
//       fetchBrokers();
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [token]); // Add token as dependency

//   const fetchBrokers = async () => {
//     if (!token) return;

//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/api/broker/all`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error("Failed to fetch brokers");

//       const data = await res.json();
//       const formattedBrokers = data.map((broker) => ({
//         ...broker,
//         user: broker.user || null,
//       }));
//       setBrokers(formattedBrokers);
//     } catch (err) {
//       console.error("Error fetching brokers:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUsers = async () => {
//     if (!token) return;

//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/api/users`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error("Failed to fetch users");

//       const data = await res.json();
//       setUsers(data);
//     } catch (err) {
//       console.error("Error fetching users:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProperties = async () => {
//     if (!token) return;

//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/api/properties/units`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error("Failed to fetch properties");

//       const data = await res.json();
//       setProperties(data);
//     } catch (err) {
//       console.error("Error fetching properties:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const uploadSingleFile = async (file) => {
//     if (!token) return;

//     const uploadData = new FormData();
//     uploadData.append("file", file);

//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "https://z-backend-2xag.onrender.com/api/upload",
//         uploadData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//           onUploadProgress: (progressEvent) => {
//             if (progressEvent.total) {
//               const percentCompleted = Math.round(
//                 (progressEvent.loaded * 100) / progressEvent.total
//               );
//               setUploadProgress(percentCompleted);
//             }
//           },
//         }
//       );
//       return (
//         response.data.fileUrl || response.data.url || response.data.urls?.[0]
//       );
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     try {
//       setUploadProgress(0);
//       const fileUrl = await uploadSingleFile(file);
//       setFormData((prev) => ({
//         ...prev,
//         avatarUrl: fileUrl,
//       }));
//       setPreviewUrl(fileUrl);
//     } catch (error) {
//       alert("File upload failed. Please try again.");
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     if (!token) {
//       alert("Authentication token is missing. Please login again.");
//       return;
//     }

//     const payload = {
//       ...formData,
//       activeListings: parseInt(formData.activeListings) || 0,
//       closedDeals: parseInt(formData.closedDeals) || 0,
//       commissionRate: parseInt(formData.commissionRate) || 0,
//     };

//     setLoading(true);
//     try {
//       if (isEdit && editIndex !== null) {
//         const brokerToEdit = brokers[editIndex];
//         const res = await fetch(`${BASE_URL}/api/broker/${brokerToEdit._id}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         });
//         if (!res.ok) throw new Error("Failed to update broker");
//       } else {
//         const res = await fetch(`${BASE_URL}/api/broker/`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         });
//         if (!res.ok) throw new Error("Failed to add broker");
//       }
//       await fetchBrokers();
//       setIsOpen(false);
//       resetForm();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save broker. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       user: "",
//       companyName: "",
//       avatarUrl: "",
//       properties: "",
//       name: "",
//       email: "",
//       phone: "",
//       location: "",
//       selectType: "",
//       activeListings: "",
//       closedDeals: "",
//       commissionRate: "",
//     });
//     setPreviewUrl("");
//     setSelectedFile(null);
//     setUploadProgress(0);
//     setIsEdit(false);
//     setEditIndex(null);
//   };

//   const handleEdit = (index) => {
//     const brokerToEdit = brokers[index];
//     setFormData({
//       user: brokerToEdit.user?._id || brokerToEdit.user || "",
//       companyName: brokerToEdit.companyName || "",
//       avatarUrl: brokerToEdit.avatarUrl || "",
//       properties: brokerToEdit.properties || "",
//       name: brokerToEdit.name || "",
//       email: brokerToEdit.email || "",
//       phone: brokerToEdit.phone || "",
//       location: brokerToEdit.location || "",
//       selectType: brokerToEdit.selectType || "",
//       activeListings: brokerToEdit.activeListings?.toString() || "",
//       closedDeals: brokerToEdit.closedDeals?.toString() || "",
//       commissionRate: brokerToEdit.commissionRate?.toString() || "",
//     });
//     setPreviewUrl(brokerToEdit.avatarUrl || "");
//     setIsEdit(true);
//     setEditIndex(index);
//     setIsOpen(true);
//   };

//   const handleDelete = async (index) => {
//     if (!token) {
//       alert("Authentication token is missing. Please login again.");
//       return;
//     }

//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this broker?"
//     );
//     if (!confirmDelete) return;

//     setLoading(true);
//     try {
//       const brokerToDelete = brokers[index];
//       const res = await fetch(`${BASE_URL}/api/broker/${brokerToDelete._id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!res.ok) throw new Error("Failed to delete broker");
//       await fetchBrokers();
//     } catch (err) {
//       console.error("Delete error:", err);
//       alert("Failed to delete broker. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredBrokers =
//     filterType === "All"
//       ? brokers
//       : brokers.filter((b) => b.selectType === filterType);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
//       <h1 className="font-semibold text-xl text-gray-800 mb-6">
//         Brokers & Agents
//       </h1>

//       {/* Top Controls */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//         <div className="flex gap-3 w-full md:w-auto">
//           <input
//             type="text"
//             placeholder="Search brokers & agents..."
//             className="border rounded px-4 py-2 shadow-sm md:w-64"
//           />
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             className="border px-3 py-2 rounded shadow-sm text-sm"
//           >
//             <option value="All">All Types</option>
//             <option value="Broker">Broker</option>
//             <option value="Agent">Agent</option>
//             <option value="Internal">Internal</option>
//           </select>
//         </div>
//         <button
//           onClick={() => setIsOpen(true)}
//           className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 flex items-center gap-2"
//         >
//           <Plus size={18} /> Add Broker/Agent
//         </button>
//       </div>

//       {/* Cards Grid */}
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {filteredBrokers.map((broker, idx) => (
//           <div key={idx} className="bg-white rounded-xl shadow-md p-5 relative">
//             <Menu as="div" className="absolute right-4 top-4 text-right z-10">
//               <Menu.Button className="p-1 hover:bg-gray-100 rounded-full">
//                 <MoreVertical size={20} />
//               </Menu.Button>
//               <Menu.Items className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-md z-20">
//                 <div className="px-4 py-2 font-semibold text-sm text-gray-700">
//                   Actions
//                 </div>
//                 <Menu.Item>
//                   {({ active }) => (
//                     <button
//                       onClick={() => handleEdit(idx)}
//                       className={`w-full px-4 py-2 text-sm flex items-center gap-2 ${
//                         active ? "bg-gray-100" : ""
//                       }`}
//                     >
//                       <Edit size={16} /> Edit
//                     </button>
//                   )}
//                 </Menu.Item>
//                 <Menu.Item>
//                   {({ active }) => (
//                     <button
//                       onClick={() => handleDelete(idx)}
//                       className={`w-full px-4 py-2 text-sm text-red-600 flex items-center gap-2 ${
//                         active ? "bg-gray-100" : ""
//                       }`}
//                     >
//                       <Trash2 size={16} /> Delete
//                     </button>
//                   )}
//                 </Menu.Item>
//               </Menu.Items>
//             </Menu>

//             <div className="flex flex-col">
//               <div className="flex items-start gap-4">
//                 <img
//                   src={broker.avatarUrl || "https://via.placeholder.com/80"}
//                   className="w-20 h-20 rounded-full mb-2"
//                   alt={broker.name}
//                 />
//                 <div>
//                   <span className="bg-purple-500 text-white w-[100px] text-center text-xs px-3 py-1 rounded-full mb-2">
//                     {broker.selectType}
//                   </span>
//                   <div className="flex items-center gap-2 text-lg">
//                     {broker.name}
//                     <span className="flex items-center text-sm text-gray-500 gap-1">
//                       <MapPin size={14} className="text-gray-400" />
//                       {broker.location}
//                     </span>
//                   </div>
//                   {broker.companyName && (
//                     <div className="text-sm text-gray-600 mt-1">
//                       {broker.companyName}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className="text-sm text-gray-600 mt-2 space-y-1">
//                 <div className="flex items-center gap-2">
//                   <span>📧</span> {broker.email}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span>📞</span> {broker.phone}
//                 </div>
//                 {broker.user && (
//                   <div className="flex items-center gap-2">
//                     <span>👤</span>
//                     {typeof broker.user === "object"
//                       ? broker.user.name ||
//                         broker.user.username ||
//                         broker.user.email ||
//                         "User"
//                       : broker.user}
//                   </div>
//                 )}
//               </div>
//               <div className="flex justify-between w-full mt-4 border-t pt-3 text-sm">
//                 <div className="w-1/3 text-center">
//                   <div className="text-purple-700 font-bold">
//                     {broker.activeListings || 0}
//                   </div>
//                   <div className="text-gray-500">Listings</div>
//                 </div>
//                 <div className="w-1/3 text-center">
//                   <div className="text-purple-700 font-bold">
//                     {broker.closedDeals || 0}
//                   </div>
//                   <div className="text-gray-500">Deals</div>
//                 </div>
//                 <div className="w-1/3 text-center">
//                   <div className="text-purple-700 font-bold">
//                     {broker.commissionRate || 0}%
//                   </div>
//                   <div className="text-gray-500">Commission</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal Dialog */}
//       <Dialog
//         open={isOpen}
//         onClose={() => setIsOpen(false)}
//         className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
//       >
//         <Dialog.Panel className="bg-white p-6 rounded shadow-md w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
//           <Dialog.Title className="text-lg font-bold mb-4">
//             {isEdit ? "Edit Broker/Agent" : "Add Broker/Agent"}
//           </Dialog.Title>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="space-y-1 sm:col-span-2">
//               <label
//                 htmlFor="user"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 User
//               </label>
//               <select
//                 id="user"
//                 name="user"
//                 value={formData.user}
//                 onChange={handleChange}
//                 className="border p-2 rounded w-full"
//               >
//                 <option value="">Select User</option>
//                 {users.map((user) => (
//                   <option key={user._id} value={user._id}>
//                     {user.name || user.email}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="space-y-1">
//               <label
//                 htmlFor="companyName"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Company Name
//               </label>
//               <input
//                 id="companyName"
//                 name="companyName"
//                 value={formData.companyName}
//                 onChange={handleChange}
//                 className="border p-2 rounded w-full"
//                 placeholder="Company Name"
//               />
//             </div>
//             <div className="space-y-1">
//               <label
//                 htmlFor="avatarUrl"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Avatar Image
//               </label>
//               <div className="flex items-center gap-4">
//                 {(previewUrl || formData.avatarUrl) && (
//                   <img
//                     src={formData.avatarUrl}
//                     className="w-16 h-16 rounded-full object-cover"
//                     alt="Preview"
//                   />
//                 )}
//                 <div className="flex-1">
//                   <input
//                     type="file"
//                     id="avatarUrl"
//                     name="avatarUrl"
//                     onChange={handleFileChange}
//                     className="border p-2 rounded w-full"
//                     accept="image/*"
//                   />
//                   {uploadProgress > 0 && uploadProgress < 100 && (
//                     <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
//                       <div
//                         className="bg-purple-600 h-2.5 rounded-full"
//                         style={{ width: `${uploadProgress}%` }}
//                       ></div>
//                     </div>
//                   )}
//                   {formData.avatarUrl && (
//                     <p className="text-xs text-gray-500 mt-1 truncate">
//                       {formData.avatarUrl}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-1">
//               <label
//                 htmlFor="properties"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Properties
//               </label>
//               <select
//                 id="properties"
//                 name="properties"
//                 value={formData.properties}
//                 onChange={handleChange}
//                 className="border p-2 rounded w-full"
//               >
//                 <option value="">Select Property</option>
//                 {properties.map((property) => (
//                   <option key={property._id} value={property._id}>
//                     {property.unitNumber || property.name || property._id}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="space-y-1">
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Email
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="border p-2 rounded w-full"
//                 placeholder="Email"
//               />
//             </div>
//             <div className="space-y-1">
//               <label
//                 htmlFor="phone"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Phone
//               </label>
//               <input
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="border p-2 rounded w-full"
//                 placeholder="Phone"
//               />
//             </div>
//             <div className="space-y-1">
//               <label
//                 htmlFor="location"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Location
//               </label>
//               <input
//                 id="location"
//                 name="location"
//                 value={formData.location}
//                 onChange={handleChange}
//                 className="border p-2 rounded w-full"
//                 placeholder="Location"
//               />
//             </div>
//             <div className="space-y-1">
//               <label
//                 htmlFor="selectType"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Type
//               </label>
//               <select
//                 id="selectType"
//                 name="selectType"
//                 value={formData.selectType}
//                 onChange={handleChange}
//                 className="border p-2 rounded w-full"
//               >
//                 <option value="">Select Type</option>
//                 <option value="Internal">Internal</option>
//                 <option value="Broker">Broker</option>
//                 <option value="Agent">Agent</option>
//               </select>
//             </div>
//             <div className="space-y-1">
//               <label
//                 htmlFor="activeListings"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Active Listings
//               </label>
//               <input
//                 id="activeListings"
//                 name="activeListings"
//                 value={formData.activeListings}
//                 onChange={handleChange}
//                 className="border p-2 rounded w-full"
//                 placeholder="Active Listings"
//                 type="number"
//               />
//             </div>
//             <div className="space-y-1">
//               <label
//                 htmlFor="closedDeals"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Closed Deals
//               </label>
//               <input
//                 id="closedDeals"
//                 name="closedDeals"
//                 value={formData.closedDeals}
//                 onChange={handleChange}
//                 className="border p-2 rounded w-full"
//                 placeholder="Closed Deals"
//                 type="number"
//               />
//             </div>
//             <div className="space-y-1">
//               <label
//                 htmlFor="commissionRate"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Commission Rate (%)
//               </label>
//               <input
//                 id="commissionRate"
//                 name="commissionRate"
//                 value={formData.commissionRate}
//                 onChange={handleChange}
//                 className="border p-2 rounded w-full"
//                 placeholder="Commission Rate"
//                 type="number"
//               />
//             </div>
//           </div>
//           <div className="flex justify-end gap-3 mt-6">
//             <button
//               onClick={() => setIsOpen(false)}
//               className="px-4 py-2 rounded border"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
//             >
//               Save
//             </button>
//           </div>
//         </Dialog.Panel>
//       </Dialog>
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import { Dialog, Menu } from "@headlessui/react";
import { Plus, MoreVertical, Edit, Trash2, MapPin } from "lucide-react";
import axios from "axios";

export default function BrokerAgentPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [properties, setProperties] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [brokers, setBrokers] = useState([]);
  const [users, setUsers] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [token, setToken] = useState(null);

  const [formData, setFormData] = useState({
    user: "",
    companyName: "",
    avatarUrl: "",
    properties: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    selectType: "",
    activeListings: "",
    closedDeals: "",
    commissionRate: "",
  });

  const BASE_URL = "https://crm-bcgg.onrender.com";

  // Initialize token and fetch data
  useEffect(() => {
    const initialize = async () => {
      try {
        const tokenData = JSON.parse(
          sessionStorage.getItem("logindata")
        )?.token;
        if (!tokenData) {
          throw new Error("No authentication token found");
        }
        setToken(tokenData);

        const [brokersRes, usersRes, propertiesRes] = await Promise.all([
          fetch(`${BASE_URL}/api/broker/all`, {
            headers: { Authorization: `Bearer ${tokenData}` },
          }),
          fetch(`${BASE_URL}/api/users`, {
            headers: { Authorization: `Bearer ${tokenData}` },
          }),
          fetch(`${BASE_URL}/api/properties/units`, {
            headers: { Authorization: `Bearer ${tokenData}` },
          }),
        ]);

        const [brokersData, usersData, propertiesData] = await Promise.all([
          brokersRes.json(),
          usersRes.json(),
          propertiesRes.json(),
        ]);

        setBrokers(
          brokersData.map((broker) => ({
            ...broker,
            user: broker.user || null,
          }))
        );
        setUsers(usersData);
        setProperties(propertiesData);
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // Auto refresh effect
  useEffect(() => {
    let interval;
    if (autoRefreshEnabled && token) {
      interval = setInterval(() => {
        fetchBrokers();
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [autoRefreshEnabled, token]);

  const fetchBrokers = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/api/broker/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBrokers(
        data.map((broker) => ({ ...broker, user: broker.user || null }))
      );
    } catch (err) {
      console.error("Error fetching brokers:", err);
      alert("Failed to fetch brokers. Please try again.");
    }
  };

  const uploadSingleFile = async (file) => {
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      setUploadProgress(0);
      const response = await axios.post(
        "https://z-backend-2xag.onrender.com/api/upload",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          },
        }
      );
      return (
        response.data.fileUrl || response.data.url || response.data.urls?.[0]
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileUrl = await uploadSingleFile(file);
      setFormData((prev) => ({ ...prev, avatarUrl: fileUrl }));
      setPreviewUrl(fileUrl);
    } catch (error) {
      alert("File upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      activeListings: parseInt(formData.activeListings) || 0,
      closedDeals: parseInt(formData.closedDeals) || 0,
      commissionRate: parseInt(formData.commissionRate) || 0,
    };

    try {
      setLoading(true);
      if (isEdit && editIndex !== null) {
        const brokerToEdit = brokers[editIndex];
        const res = await fetch(`${BASE_URL}/api/broker/${brokerToEdit._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update broker");
      } else {
        const res = await fetch(`${BASE_URL}/api/broker/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to add broker");
      }
      await fetchBrokers();
      setIsOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to save broker. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      user: "",
      companyName: "",
      avatarUrl: "",
      properties: "",
      name: "",
      email: "",
      phone: "",
      location: "",
      selectType: "",
      activeListings: "",
      closedDeals: "",
      commissionRate: "",
    });
    setPreviewUrl("");
    setSelectedFile(null);
    setUploadProgress(0);
    setIsEdit(false);
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const brokerToEdit = brokers[index];
    setFormData({
      user: brokerToEdit.user?._id || brokerToEdit.user || "",
      companyName: brokerToEdit.companyName || "",
      avatarUrl: brokerToEdit.avatarUrl || "",
      properties: brokerToEdit.properties || "",
      name: brokerToEdit.name || "",
      email: brokerToEdit.email || "",
      phone: brokerToEdit.phone || "",
      location: brokerToEdit.location || "",
      selectType: brokerToEdit.selectType || "",
      activeListings: brokerToEdit.activeListings?.toString() || "",
      closedDeals: brokerToEdit.closedDeals?.toString() || "",
      commissionRate: brokerToEdit.commissionRate?.toString() || "",
    });
    setPreviewUrl(brokerToEdit.avatarUrl || "");
    setIsEdit(true);
    setEditIndex(index);
    setIsOpen(true);
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this broker?")) return;

    try {
      setLoading(true);
      const brokerToDelete = brokers[index];
      const res = await fetch(`${BASE_URL}/api/broker/${brokerToDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete broker");
      await fetchBrokers();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete broker. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBrokers =
    filterType === "All"
      ? brokers
      : brokers.filter((b) => b.selectType === filterType);

  if (loading && brokers.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Please login to access this page</div>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50 md:p-6">
      <h1 className="mb-6 text-xl font-semibold text-gray-800">
        Brokers & Agents
      </h1>

      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search brokers & agents..."
            className="px-4 py-2 rounded border shadow-sm md:w-64"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-sm rounded border shadow-sm"
          >
            <option value="All">All Types</option>
            <option value="Broker">Broker</option>
            <option value="Agent">Agent</option>
            <option value="Internal">Internal</option>
          </select>
        </div>

        <div className="flex gap-4 items-center">
          {/* <div className="flex gap-2 items-center">
            <label htmlFor="autoRefresh" className="text-sm text-gray-700">
              Auto Refresh
            </label>
            <div className="inline-block relative mr-2 w-10 align-middle select-none">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefreshEnabled}
                onChange={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                className="sr-only"
              />
              <div
                className={`block w-10 h-6 rounded-full ${autoRefreshEnabled ? 'bg-purple-600' : 'bg-gray-300'}`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${autoRefreshEnabled ? 'transform translate-x-4' : ''}`}
              ></div>
            </div>
          </div> */}

          <button
            onClick={() => setIsOpen(true)}
            className="flex gap-2 items-center px-4 py-2 text-white bg-purple-600 rounded shadow hover:bg-purple-700"
          >
            <Plus size={18} /> Add Broker/Agent
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBrokers.map((broker, idx) => (
          <div key={idx} className="relative p-5 bg-white rounded-xl shadow-md">
            <Menu as="div" className="absolute top-4 right-4 z-10 text-right">
              <Menu.Button className="p-1 rounded-full hover:bg-gray-100">
                <MoreVertical size={20} />
              </Menu.Button>
              <Menu.Items className="absolute right-0 z-20 mt-2 w-44 bg-white rounded border shadow-md">
                <div className="px-4 py-2 text-sm font-semibold text-gray-700">
                  Actions
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => handleEdit(idx)}
                      className={`w-full px-4 py-2 text-sm flex items-center gap-2 ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <Edit size={16} /> Edit
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => handleDelete(idx)}
                      className={`w-full px-4 py-2 text-sm text-red-600 flex items-center gap-2 ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>

            <div className="flex flex-col">
              <div className="flex gap-4 items-start">
                <img
                  src={broker.avatarUrl || "https://via.placeholder.com/80"}
                  className="mb-2 w-20 h-20 rounded-full"
                  alt={broker.name}
                />
                <div>
                  <span className="bg-purple-500 text-white w-[100px] text-center text-xs px-3 py-1 rounded-full mb-2">
                    {broker.selectType}
                  </span>
                  <div className="flex gap-2 items-center text-lg">
                    {broker.name}
                    <span className="flex gap-1 items-center text-sm text-gray-500">
                      <MapPin size={14} className="text-gray-400" />
                      {broker.location}
                    </span>
                  </div>
                  {broker.companyName && (
                    <div className="mt-1 text-sm text-gray-600">
                      {broker.companyName}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <div className="flex gap-2 items-center">
                  <span>📧</span> {broker.email}
                </div>
                <div className="flex gap-2 items-center">
                  <span>📞</span> {broker.phone}
                </div>
                {broker.user && (
                  <div className="flex gap-2 items-center">
                    <span>👤</span>
                    {typeof broker.user === "object"
                      ? broker.user.name ||
                        broker.user.username ||
                        broker.user.email ||
                        "User"
                      : broker.user}
                  </div>
                )}
              </div>
              <div className="flex justify-between pt-3 mt-4 w-full text-sm border-t">
                <div className="w-1/3 text-center">
                  <div className="font-bold text-purple-700">
                    {broker.activeListings || 0}
                  </div>
                  <div className="text-gray-500">Listings</div>
                </div>
                <div className="w-1/3 text-center">
                  <div className="font-bold text-purple-700">
                    {broker.closedDeals || 0}
                  </div>
                  <div className="text-gray-500">Deals</div>
                </div>
                <div className="w-1/3 text-center">
                  <div className="font-bold text-purple-700">
                    {broker.commissionRate || 0}%
                  </div>
                  <div className="text-gray-500">Commission</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-30"
      >
        <Dialog.Panel className="bg-gray-50 p-8 rounded-2xl shadow-xl w-full max-w-6xl mx-auto max-h-[85vh] overflow-y-auto ring-1 ring-gray-200 overflow-x-hidden">
          <Dialog.Title className="mb-6 text-2xl font-semibold text-gray-800">
            {isEdit ? "Edit Broker/Agent" : "Add Broker/Agent"}
          </Dialog.Title>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="user"
                className="block text-sm font-medium text-gray-700"
              >
                User
              </label>
              <select
                id="user"
                name="user"
                value={formData.user}
                onChange={handleChange}
                className="block p-3 w-full bg-white rounded-lg border border-gray-300 transition duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="block p-3 w-full rounded-lg border border-gray-300 transition duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Company Name"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="avatarUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Avatar Image
              </label>
              <div className="flex gap-4 items-center">
                {(previewUrl || formData.avatarUrl) && (
                  <img
                    src={formData.avatarUrl}
                    className="object-cover w-16 h-16 rounded-full border-2 border-gray-200"
                    alt="Preview"
                  />
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    id="avatarUrl"
                    name="avatarUrl"
                    onChange={handleFileChange}
                    className="block p-3 w-full rounded-lg border border-gray-300 transition duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                    accept="image/*"
                  />
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-3 w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                  {formData.avatarUrl && (
                    <p className="mt-2 text-xs text-gray-500 truncate">
                      {formData.avatarUrl}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="properties"
                className="block text-sm font-medium text-gray-700"
              >
                Properties
              </label>
              <select
                id="properties"
                name="properties"
                value={formData.properties}
                onChange={handleChange}
                className="block p-3 w-full bg-white rounded-lg border border-gray-300 transition duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select Property</option>
                {properties.map((property) => (
                  <option key={property._id} value={property._id}>
                    {property.unitNumber || property.name || property._id}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block p-3 w-full rounded-lg border border-gray-300 transition duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Email"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block p-3 w-full rounded-lg border border-gray-300 transition duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Phone"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="block p-3 w-full rounded-lg border border-gray-300 transition duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Location"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="selectType"
                className="block text-sm font-medium text-gray-700"
              >
                Type
              </label>
              <select
                id="selectType"
                name="selectType"
                value={formData.selectType}
                onChange={handleChange}
                className="block p-3 w-full bg-white rounded-lg border border-gray-300 transition duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select Type</option>
                <option value="Internal">Internal</option>
                <option value="Broker">Broker</option>
                <option value="Agent">Agent</option>
              </select>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="activeListings"
                className="block text-sm font-medium text-gray-700"
              >
                Active Listings
              </label>
              <input
                id="activeListings"
                name="activeListings"
                value={formData.activeListings}
                onChange={handleChange}
                className="block p-3 w-full rounded-lg border border-gray-300 transition duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Active Listings"
                type="number"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="closedDeals"
                className="block text-sm font-medium text-gray-700"
              >
                Closed Deals
              </label>
              <input
                id="closedDeals"
                name="closedDeals"
                value={formData.closedDeals}
                onChange={handleChange}
                className="block p-3 w-full rounded-lg border border-gray-300 transition duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Closed Deals"
                type="number"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="commissionRate"
                className="block text-sm font-medium text-gray-700"
              >
                Commission Rate (%)
              </label>
              <input
                id="commissionRate"
                name="commissionRate"
                value={formData.commissionRate}
                onChange={handleChange}
                className="block p-3 w-full rounded-lg border border-gray-300 transition duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Commission Rate"
                type="number"
              />
            </div>
          </div>
          <div className="flex gap-4 justify-end mt-8">
            <button
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}