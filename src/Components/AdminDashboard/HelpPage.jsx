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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("logindata"))?.token;
        setToken(token);
        const response = await axios.get(`${BASE_URL}/api/inquiries/`, {
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

  // Filter data based on search and status
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.builder?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.project?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contactPhone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Function to handle delete
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

  // Function to start editing
  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditForm({
      ...item,
      builderName: item.builder?.companyName || "",
      userName: item.user?.name || "",
      projectName: item.project?.name || "",
    });
  };

  // Function to handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Function to save edits
   const handleSave = async () => {
    try {
      const updateData = {
        status: editForm.status,
        message: editForm.message,
        contactEmail: editForm.contactEmail,
        contactPhone: editForm.contactPhone,
      };

      const response = await axios.put(
        `${BASE_URL}/api/inquiries/${editingId}/status/admin`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(
        data.map((item) =>
          item._id === editingId
            ? {
                ...item, // Preserve existing fields like user, builder, project
                ...response.data, // Overwrite with updated fields from API
              }
            : item
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error updating inquiry:", err);
      setError("Failed to update inquiry");
    }
  };


  // Function to cancel editing
  const handleCancel = () => {
    setEditingId(null);
  };

  // Get all field names from the first item (if data exists)
  const allFields =
    data.length > 0
      ? Object.keys(data[0]).filter(
          (field) => field !== "_id" && !field.startsWith("_")
        )
      : [];

  // Custom field display names
  const fieldDisplayNames = {
    user: "User",
    builder: "Builder",
    project: "Project",
    message: "Message",
    contactEmail: "Email",
    contactPhone: "Phone",
    status: "Status",
    createdAt: "Created",
    respondedAt: "Responded",
  };

  // Status badge component
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-600">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading inquiries</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inquiry Management</h1>
          <p className="mt-2 text-gray-600">View and manage all customer inquiries</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search inquiries..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <label htmlFor="status-filter" className="mr-2 text-sm font-medium text-gray-700">
                  Status:
                </label>
                <select
                  id="status-filter"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="bg-indigo-50 px-3 py-1 rounded-lg text-indigo-800 text-sm font-medium">
                Total: {filteredData.length}
              </div>
            </div>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No inquiries found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "There are currently no inquiries in the system"}
            </p>
          </div>
        ) : (
       <div className="bg-white rounded-xl shadow-sm overflow-hidden">
<div className="bg-white rounded-xl shadow-sm overflow-hidden">
  <div 
    className="w-full overflow-auto" 
    style={{ 
      maxHeight: 'calc(100vh - 250px)', // Adjust this value as needed
      minHeight: '200px' // Minimum height when there's little data
    }}
  >
    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {allFields.map((field, index) => (
                          <th
                            key={index}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {fieldDisplayNames[field] || field}
                          </th>
                        ))}
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          {allFields.map((field) => {
                            if (editingId === item._id) {
                              // Render editable fields when in edit mode
                              if (field === "builder") {
                                return (
                                  <td
                                    key={`${item._id}-${field}`}
                                    className="px-6 py-4 whitespace-nowrap align-top"
                                  >
                                    <input
                                      type="text"
                                      name="builderName"
                                      value={editForm.builderName || ""}
                                      onChange={handleEditChange}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                                      disabled
                                    />
                                  </td>
                                );
                              } else if (field === "user") {
                                return (
                                  <td
                                    key={`${item._id}-${field}`}
                                    className="px-6 py-4 whitespace-nowrap align-top"
                                  >
                                    <input
                                      type="text"
                                      name="userName"
                                      value={editForm.userName || ""}
                                      onChange={handleEditChange}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                                      disabled
                                    />
                                  </td>
                                );
                              } else if (field === "project") {
                                return (
                                  <td
                                    key={`${item._id}-${field}`}
                                    className="px-6 py-4 whitespace-nowrap align-top"
                                  >
                                    <input
                                      type="text"
                                      name="projectName"
                                      value={editForm.projectName || ""}
                                      onChange={handleEditChange}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                                      disabled
                                    />
                                  </td>
                                );
                              } else if (field === "status") {
                                return (
                                  <td
                                    key={`${item._id}-${field}`}
                                    className="px-6 py-4 whitespace-nowrap align-top"
                                  >
                                    <select
                                      name="status"
                                      value={editForm.status || ""}
                                      onChange={handleEditChange}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                                    >
                                      <option value="new">New</option>
                                      <option value="in-progress">In Progress</option>
                                      <option value="closed">Closed</option>
                                    </select>
                                  </td>
                                );
                              } else if (field === "createdAt" || field === "respondedAt") {
                                return (
                                  <td
                                    key={`${item._id}-${field}`}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top"
                                  >
                                    {formatDate(editForm[field])}
                                  </td>
                                );
                              } else {
                                return (
                                  <td
                                    key={`${item._id}-${field}`}
                                    className="px-6 py-4 whitespace-nowrap align-top"
                                  >
                                    <input
                                      type="text"
                                      name={field}
                                      value={editForm[field] || ""}
                                      onChange={handleEditChange}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                                    />
                                  </td>
                                );
                              }
                            } else {
                              // Render normal fields
                              const fieldValue = item[field];
                              return (
                                <td
                                  key={`${item._id}-${field}`}
                                  className={`px-6 py-4 whitespace-nowrap text-sm align-top ${
                                    field === "createdAt" || field === "respondedAt"
                                      ? "text-gray-500"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {field === "user" ? (
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span className="text-indigo-600 font-medium">
                                          {fieldValue?.name?.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                      <div className="ml-4">
                                        <div className="font-medium text-gray-900">
                                          {fieldValue?.name}
                                        </div>
                                        <div className="text-gray-500">{fieldValue?.email}</div>
                                      </div>
                                    </div>
                                  ) : field === "builder" ? (
                                    <div className="font-medium">{fieldValue?.companyName}</div>
                                  ) : field === "project" ? (
                                    <div className="font-medium">{fieldValue?.name}</div>
                                  ) : field === "status" ? (
                                    <StatusBadge status={fieldValue} />
                                  ) : field === "createdAt" || field === "respondedAt" ? (
                                    formatDate(fieldValue)
                                  ) : field === "message" ? (
                                    <div className="max-w-xs truncate" title={fieldValue}>
                                      {fieldValue}
                                    </div>
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
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        Yes
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                        No
                                      </span>
                                    )
                                  ) : fieldValue === null ? (
                                    <span className="text-gray-400">N/A</span>
                                  ) : (
                                    fieldValue
                                  )}
                                </td>
                              );
                            }
                          })}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                            {editingId === item._id ? (
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={handleSave}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="text-indigo-600 hover:text-indigo-900"
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
              </div>
            </div>
          // </div>
        )}
      </div>
    </div>
  );
};

export default JsonTableDisplay;
