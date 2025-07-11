import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiX, FiClock, FiCheckCircle, FiAlertCircle, FiMail, FiPhone, FiMessageSquare } from "react-icons/fi";

const BASE_URL = "https://crm-bcgg.onrender.com";

const InquiryManagement = () => {
  const [token, setToken] = useState("");
  const [inquiries, setInquiries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [builders, setBuilders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newInquiry, setNewInquiry] = useState({
    builder: "",
    project: "",
    message: "",
    contactEmail: "",
    contactPhone: "",
    status: "new",
  });

  useEffect(() => {
    fetchInquiries();
    fetchBuilders();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(sessionStorage.getItem("logindata"))?.token;
      setToken(token);
      
      const response = await axios.get(`${BASE_URL}/api/inquiries/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInquiries(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  const fetchBuilders = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/properties/builder-profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBuilders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch builders");
    }
  };

  const fetchProjectsByBuilder = async (builderId) => {
    if (!builderId) {
      setProjects([]);
      return;
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/api/properties/projects/by-builder/${builderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch projects");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInquiry({
      ...newInquiry,
      [name]: value,
    });
  };

  const handleBuilderChange = async (e) => {
    const builderId = e.target.value;
    setNewInquiry({
      ...newInquiry,
      builder: builderId,
      project: "",
    });
    await fetchProjectsByBuilder(builderId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userData = JSON.parse(sessionStorage.getItem("logindata"))?.user;

      const payload = {
        ...newInquiry,
        user: userData?._id,
      };

      const response = await axios.post(`${BASE_URL}/api/inquiries`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInquiries([...inquiries, response.data]);
      setNewInquiry({
        builder: "",
        project: "",
        message: "",
        contactEmail: "",
        contactPhone: "",
        status: "new",
      });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create inquiry");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "new":
        return <FiClock className="text-blue-500 mr-1" />;
      case "in-progress":
        return <FiAlertCircle className="text-yellow-500 mr-1" />;
      case "resolved":
        return <FiCheckCircle className="text-green-500 mr-1" />;
      default:
        return <FiClock className="text-gray-500 mr-1" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Inquiry Management</h1>
          <p className="text-gray-600">View and manage all your property inquiries</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 md:mt-0 flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all transform hover:scale-105"
          disabled={loading}
        >
          <FiPlus className="mr-2" />
          {loading ? "Loading..." : "New Inquiry"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <FiAlertCircle className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-2xl relative transform transition-all duration-300 scale-95 animate-fadeIn">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold transition-colors"
              aria-label="Close"
              disabled={loading}
            >
              <FiX />
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Inquiry</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label
                    className="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="builder"
                  >
                    Builder
                  </label>
                  <select
                    id="builder"
                    name="builder"
                    value={newInquiry.builder}
                    onChange={handleBuilderChange}
                    className="block w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                    disabled={loading}
                  >
                    <option value="">Select Builder</option>
                    {builders.map((builder) => (
                      <option key={builder._id} value={builder._id}>
                        {builder.builderName ||
                          builder.companyName ||
                          `Builder ${builder._id}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label
                    className="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="project"
                  >
                    Project
                  </label>
                  <select
                    id="project"
                    name="project"
                    value={newInquiry.project}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 py-2 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    disabled={!newInquiry.builder || loading}
                  >
                    <option value="">Select Project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.projectName || `Project ${project._id}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label
                    className="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="contactEmail"
                  >
                    Contact Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={newInquiry.contactEmail}
                      onChange={handleInputChange}
                      className="pl-10 shadow appearance-none border rounded-lg w-full py-2 px-4 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="contactPhone"
                  >
                    Contact Phone
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      id="contactPhone"
                      name="contactPhone"
                      value={newInquiry.contactPhone}
                      onChange={handleInputChange}
                      className="pl-10 shadow appearance-none border rounded-lg w-full py-2 px-4 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label
                    className="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <div className="relative">
                    <FiMessageSquare className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      id="message"
                      name="message"
                      value={newInquiry.message}
                      onChange={handleInputChange}
                      className="pl-10 shadow appearance-none border rounded-lg w-full py-2 px-4 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                      rows={4}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition-all transform hover:scale-105"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Submit Inquiry"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading && !showForm ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Builder",
                    "Project",
                    "Status",
                    "Created",
                    "Responded",
                    "Message",
                    "Contact",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inquiries.length > 0 ? (
                  inquiries.map((inq) => (
                    <tr key={inq._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {inq.builder?.companyName ||
                            inq.builder?.companyName ||
                            inq.builder ||
                            "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {inq.project?.projectName || inq.project || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(inq.status)}
                          <span className={`text-sm font-medium ${
                            inq.status === "new"
                              ? "text-blue-600"
                              : inq.status === "in-progress"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}>
                            {inq.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(inq.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {inq.respondedAt ? formatDate(inq.respondedAt) : "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 line-clamp-2 max-w-xs">
                          {inq.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          {inq.contactEmail && (
                            <div className="flex items-center text-sm text-gray-700">
                              <FiMail className="mr-1 text-gray-500" />
                              {inq.contactEmail}
                            </div>
                          )}
                          {inq.contactPhone && (
                            <div className="flex items-center text-sm text-gray-700">
                              <FiPhone className="mr-1 text-gray-500" />
                              {inq.contactPhone}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <FiMessageSquare className="text-4xl text-gray-300 mb-4" />
                        <p className="text-lg">No inquiries found</p>
                        <p className="text-sm mt-2">
                          Create your first inquiry to get started
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryManagement;