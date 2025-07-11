
// import React, { useState, useEffect } from "react";
// import axios from "axios";


// const BASE_URL = "https://crm-bcgg.onrender.com";

// const JsonTableDisplay = () => {
//   const [token, setToken] = useState("");
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = JSON.parse(sessionStorage.getItem("logindata"))?.token;
//         setToken(token);
//         const response = await axios.get(`${BASE_URL}/api/inquiries/builder`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setData(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//         console.error("Error fetching inquiries:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${BASE_URL}/api/inquiries/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setData(data.filter((item) => item._id !== id));
//     } catch (err) {
//       console.error("Error deleting inquiry:", err);
//       setError("Failed to delete inquiry");
//     }
//   };

//   const handleEdit = (item) => {
//     setEditingId(item._id);
//     setEditForm({
//       status: item.status,
//     });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       const updateData = {
//         status: editForm.status,
//       };

//       const response = await axios.put(
//         `${BASE_URL}/api/inquiries/${editingId}/status`,
//         updateData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setData(
//         data.map((item) => (item._id === editingId ? response.data : item))
//       );
//       setEditingId(null);
//     } catch (err) {
//       console.error("Error updating inquiry:", err);
//       setError("Failed to update inquiry");
//     }
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//   };

//   const allFields =
//     data.length > 0
//       ? Object.keys(data[0]).filter(
//           (field) => field !== "_id" && !field.startsWith("_")
//         )
//       : [];

//   const fieldDisplayNames = {
//     user: "User",
//     builder: "Builder",
//     project: "Project",
//     message: "Message",
//     contactEmail: "Contact Email",
//     contactPhone: "Contact Phone",
//     status: "Status",
//     createdAt: "Created At",
//     respondedAt: "Responded At",
//   };

//   const StatusBadge = ({ status }) => {
//     let bgColor = "";
//     let textColor = "";

//     switch (status) {
//       case "new":
//         bgColor = "bg-red-100";
//         textColor = "text-red-800";
//         break;
//       case "in-progress":
//         bgColor = "bg-blue-100";
//         textColor = "text-blue-800";
//         break;
//       case "closed":
//         bgColor = "bg-green-100";
//         textColor = "text-green-800";
//         break;
//       default:
//         bgColor = "bg-gray-100";
//         textColor = "text-gray-800";
//     }

//     return (
//       <span
//         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
//       >
//         {status}
//       </span>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
//           <h1 className="text-2xl font-bold text-gray-800 mb-6">
//             Inquiry Management
//           </h1>
//           <p>Loading inquiries...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
//           <h1 className="text-2xl font-bold text-gray-800 mb-6">
//             Inquiry Management
//           </h1>
//           <p className="text-red-500">Error: {error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">
//           Inquiry Management
//         </h1>

//         {data.length === 0 ? (
//           <p>No inquiries found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-100">
//                 <tr>
//                   {allFields.map((field, index) => (
//                     <th
//                       key={index}
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       {fieldDisplayNames[field] || field}
//                     </th>
//                   ))}
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {data.map((item) => (
//                   <tr key={item._id} className="hover:bg-gray-50">
//                     {allFields.map((field) => {
//                       if (editingId === item._id) {
//                         if (field === "status") {
//                           return (
//                             <td
//                               key={`${item._id}-${field}`}
//                               className="px-6 py-4 whitespace-nowrap"
//                             >
//                               <select
//                                 name="status"
//                                 value={editForm.status || ""}
//                                 onChange={handleEditChange}
//                                 className="border rounded p-1 w-full"
//                               >
//                                 <option value="new">New</option>
//                                 <option value="in-progress">In Progress</option>
//                                 <option value="closed">Closed</option>
//                               </select>
//                             </td>
//                           );
//                         } else {
//                           const fieldValue = item[field];
//                           return (
//                             <td
//                               key={`${item._id}-${field}`}
//                               className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
//                             >
//                               {field === "user" ? (
//                                 <div>
//                                   <div className="font-medium">
//                                     {fieldValue?.name}
//                                   </div>
//                                   <div className="text-gray-500">
//                                     {fieldValue?.email}
//                                   </div>
//                                 </div>
//                               ) : field === "builder" ? (
//                                 fieldValue?.companyName
//                               ) : field === "status" ? (
//                                 <StatusBadge status={fieldValue} />
//                               ) : Array.isArray(fieldValue) ? (
//                                 <ul className="list-disc pl-5">
//                                   {fieldValue.map((val, i) => (
//                                     <li key={i}>{val}</li>
//                                   ))}
//                                 </ul>
//                               ) : typeof fieldValue === "object" ? (
//                                 JSON.stringify(fieldValue)
//                               ) : typeof fieldValue === "boolean" ? (
//                                 fieldValue ? (
//                                   "Yes"
//                                 ) : (
//                                   "No"
//                                 )
//                               ) : fieldValue === null ? (
//                                 "N/A"
//                               ) : (
//                                 fieldValue
//                               )}
//                             </td>
//                           );
//                         }
//                       } else {
//                         const fieldValue = item[field];
//                         return (
//                           <td
//                             key={`${item._id}-${field}`}
//                             className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
//                           >
//                             {field === "user" ? (
//                               <div>
//                                 <div className="font-medium">
//                                   {fieldValue?.name}
//                                 </div>
//                                 <div className="text-gray-500">
//                                   {fieldValue?.email}
//                                 </div>
//                               </div>
//                             ) : field === "builder" ? (
//                               fieldValue?.companyName
//                             ) : field === "status" ? (
//                               <StatusBadge status={fieldValue} />
//                             ) : Array.isArray(fieldValue) ? (
//                               <ul className="list-disc pl-5">
//                                 {fieldValue.map((val, i) => (
//                                   <li key={i}>{val}</li>
//                                 ))}
//                               </ul>
//                             ) : typeof fieldValue === "object" ? (
//                               JSON.stringify(fieldValue)
//                             ) : typeof fieldValue === "boolean" ? (
//                               fieldValue ? (
//                                 "Yes"
//                               ) : (
//                                 "No"
//                               )
//                             ) : fieldValue === null ? (
//                               "N/A"
//                             ) : (
//                               fieldValue
//                             )}
//                           </td>
//                         );
//                       }
//                     })}
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       {editingId === item._id ? (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={handleSave}
//                             className="text-green-600 hover:text-green-900"
//                           >
//                             Save
//                           </button>
//                           <button
//                             onClick={handleCancel}
//                             className="text-gray-600 hover:text-gray-900"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleEdit(item)}
//                             className="text-blue-600 hover:text-blue-900"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item._id)}
//                             className="text-red-600 hover:text-red-900"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default JsonTableDisplay;


import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://crm-bcgg.onrender.com";

const JsonTableDisplay = () => {
  const [token, setToken] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("logindata"))?.token;
        setToken(token);
        const response = await axios.get(`${BASE_URL}/api/inquiries/builder`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching inquiries:", err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/inquiries/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(data.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting inquiry:", err);
      setError("Failed to delete inquiry");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditForm({
      status: item.status,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updateData = {
        status: editForm.status,
      };

      const response = await axios.put(
        `${BASE_URL}/api/inquiries/${editingId}/status`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(
        data.map((item) => (item._id === editingId ? response.data : item))
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error updating inquiry:", err);
      setError("Failed to update inquiry");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const allFields =
    data.length > 0
      ? Object.keys(data[0]).filter(
          (field) =>
            field !== "_id" && !field.startsWith("_") && field !== "builder"
        )
      : [];

  const fieldDisplayNames = {
    user: "User",
    project: "Project",
    message: "Message",
    contactEmail: "Contact Email",
    contactPhone: "Contact Phone",
    status: "Status",
    createdAt: "Created At",
    respondedAt: "Responded At",
  };

  const StatusBadge = ({ status }) => {
    let bgColor = "";
    let textColor = "";
    let dotColor = "";

     switch (status) {
      case "new":
        bgColor = "bg-red-50";
        textColor = "text-red-700";
        dotColor = "bg-red-500";
        break;
      case "in-progress":
        bgColor = "bg-blue-50";
        textColor = "text-blue-700";
        dotColor = "bg-blue-500";
        break;
      case "closed":
        bgColor = "bg-green-50";
        textColor = "text-green-700";
        dotColor = "bg-green-500";
        break;
      default:
        bgColor = "bg-gray-50";
        textColor = "text-gray-700";
        dotColor = "bg-gray-500";
    }

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        <span className={`w-2 h-2 mr-2 rounded-full ${dotColor}`}></span>
        {status}
      </span>
    );
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Inquiry Management
          </h1>
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Inquiry Management
        </h1>

        {data.length === 0 ? (
          <p>No inquiries found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {allFields.map((field, index) => (
                    <th
                      key={index}
                     className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {fieldDisplayNames[field] || field}
                    </th>
                  ))}
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    {allFields.map((field) => {
                      if (editingId === item._id) {
                        if (field === "status") {
                          return (
                            <td
                              key={`${item._id}-${field}`}
                              className="px-6 py-4 whitespace-nowrap"
                            >
                              <select
                                name="status"
                                value={editForm.status || ""}
                                onChange={handleEditChange}
                                className="border rounded p-3 w-[150px]"
                              >
                                <option value="new">New</option>
                                <option value="in-progress">In Progress</option>
                                <option value="closed">Closed</option>
                              </select>
                            </td>
                          );
                        } else {
                          const fieldValue = item[field];
                          return (
                            <td
                              key={`${item._id}-${field}`}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                            >
                              {field === "user" ? (
                                <div>
                                  <div className="font-medium">
                                    {fieldValue?.name}
                                  </div>
                                  <div className="text-gray-500">
                                    {fieldValue?.email}
                                  </div>
                                </div>
                              ) : field === "project" ? (
                                fieldValue?.projectName
                              ) : field === "status" ? (
                                <StatusBadge status={fieldValue} />
                              ) : Array.isArray(fieldValue) ? (
                                <ul className="list-disc pl-5">
                                  {fieldValue.map((val, i) => (
                                    <li key={i}>{val}</li>
                                  ))}
                                </ul>
                              ) : typeof fieldValue === "object" ? (
                                JSON.stringify(fieldValue)
                              ) : typeof fieldValue === "boolean" ? (
                                fieldValue ? (
                                  "Yes"
                                ) : (
                                  "No"
                                )
                              ) : fieldValue === null ? (
                                "N/A"
                              ) : (
                                fieldValue
                              )}
                            </td>
                          );
                        }
                      } else {
                        const fieldValue = item[field];
                        return (
                          <td
                            key={`${item._id}-${field}`}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                          >
                            {field === "user" ? (
                              <div>
                                <div className="font-medium">
                                  {fieldValue?.name}
                                </div>
                                <div className="text-gray-500">
                                  {fieldValue?.email}
                                </div>
                              </div>
                            ) : field === "project" ? (
                              fieldValue?.projectName
                            ) : field === "status" ? (
                              <StatusBadge status={fieldValue} />
                            ) : Array.isArray(fieldValue) ? (
                              <ul className="list-disc pl-5">
                                {fieldValue.map((val, i) => (
                                  <li key={i}>{val}</li>
                                ))}
                              </ul>
                            ) : typeof fieldValue === "object" ? (
                              JSON.stringify(fieldValue)
                            ) : typeof fieldValue === "boolean" ? (
                              fieldValue ? (
                                "Yes"
                              ) : (
                                "No"
                              )
                            ) : fieldValue === null ? (
                              "N/A"
                            ) : (
                              fieldValue
                            )}
                          </td>
                        );
                      }
                    })}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingId === item._id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonTableDisplay;
