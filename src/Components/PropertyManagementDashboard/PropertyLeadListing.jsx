import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Search,
  Home,
  Building,
  Briefcase,
  MapPin,
  ChevronDown,
  Equal,
} from "lucide-react";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import {
  Plus,
  MoreVertical,
  BarChart2,
  List,
  Clock,
  Filter,
  Edit,
  GripVertical,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const propertyTypeIcons = {
  Apartment: <Building className="w-4 h-4 text-blue-500" />,
  Villa: <Home className="w-4 h-4 text-green-500" />,
  Office: <Briefcase className="w-4 h-4 text-gray-700" />,
  Land: <MapPin className="w-4 h-4 text-yellow-600" />,
};


// const token = JSON.parse(sessionStorage.getItem("logindata"))?.token;

const BASE_URL = "https://crm-bcgg.onrender.com";


const getStatusClass = (status) => {
  switch (status) {
    case "PENDING":
      return "text-blue-700 bg-blue-100";
    case "IN PROGRESS":
      return "text-yellow-800 bg-yellow-100";
    case "NEGOTIATION":
      return "text-purple-700 bg-purple-100";
    case "COMPLETED":
      return "text-green-700 bg-green-100";
    case "not interested":
      return "text-red-700 bg-red-100";
    default:
      return "text-gray-600 bg-gray-200";
  }
};

const getPriorityIcon = (priority) => {
  switch (priority) {
    case "Low":
      return (
        <div className="flex items-center gap-1 text-blue-500 text-sm">
          <ChevronDown className="w-4 h-4" />
          Low
        </div>
      );
    case "Medium":
      return (
        <div className="flex items-center gap-1 text-yellow-500 text-sm">
          <Equal className="w-4 h-4" />
          Medium
        </div>
      );
    case "High":
      return (
        <div className="flex items-center gap-1 text-red-600 text-sm">
          <MdKeyboardDoubleArrowUp className="w-4 h-4" />
          High
        </div>
      );
    default:
      return "Low";
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const LeadsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
      const fetchLeads = async () => {
        const userData = JSON.parse(sessionStorage.getItem("logindata"));
        const userId = userData?.user?.id; // Get user ID from session storage
        const token = userData?.token;
      try {
          const response = await axios.get(`${BASE_URL}/api/leads/assigned/${userId}`, {
              headers: {
                  "Authorization":`Bearer ${token}`,
              }
          });
          
        setLeads(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  const filteredData = leads?.map((lead) => ({
      id: lead._id,
      summary:
        lead.notes && lead.notes.length > 0 ? lead.notes[0].note : "No notes",
      status: lead.status || "PENDING",
      assignee: lead.userName || "Unknown",
      dueDate: formatDate(lead.createdAt),
      propertyType: lead.interestedIn?.unit?.unitNumber || "Unknown",
      avatar: `https://i.pravatar.cc/150?u=${lead.userEmail}`,
      priority: "Medium", // Default priority since it's not in API
    }))
    .filter((item) => {
      const matchesSearch = item.summary
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      const matchesType =
        typeFilter === "All" || item.propertyType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

  const handlePriorityChange = (id, value) => {
    // In a real app, you would update this in the backend
    console.log(`Priority changed for ${id} to ${value}`);
    setDropdownOpen(null);
  };

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      <h2 className="text-xl font-semibold mb-4">Leads List</h2>

      <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow-sm">
        <div className="flex border rounded-md overflow-hidden">
          <button
            onClick={() => navigate("/propertyleads")}
            className="p-2 border-r hover:bg-gray-200"
          >
            <BarChart2 size={18} className="text-gray-600" />
          </button>
          <button
            // onClick={() => navigate("/listingpage")}
            className="p-2 border-r hover:bg-gray-200"
          >
            <List size={18} className="text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex border rounded-md overflow-hidden">
            <button className="p-2 border-r hover:bg-gray-200">
              <Filter size={18} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200">
              <Edit size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-60 pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          <option value="new">New</option>
          <option value="interested">Intrested</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
          <option value="not interested">Not Interested</option>
        </select>

        {/* Property Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="All">All Properties</option>
          {Array.from(
            new Set(
              leads.map(
                (lead) => lead.interestedIn?.unit?.unitNumber || "Unknown"
              )
            )
          ).map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-sm text-gray-600">
            <th></th>
            <th>Summary</th>
            <th>Status</th>
            <th>Assignee</th>
            <th>Due date</th>

            <th>Property</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr
              key={item.id}
              className="bg-white hover:bg-gray-50 shadow-sm rounded-md"
            >
              <td className="p-2">
                <CheckSquare className="text-gray-400 w-5 h-5" />
              </td>
              <td className="p-2 text-sm text-gray-800 font-medium">
                {item.summary}
              </td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusClass(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </td>
              <td className="p-2 text-sm flex items-center gap-2">
                {/* <img
                  src={item.avatar}
                  alt={item.assignee}
                  className="w-6 h-6 rounded-full"
                /> */}
                {item.assignee}
              </td>
              <td className="p-2 text-sm text-gray-700">{item.dueDate}</td>

              <td className="p-2 text-sm flex items-center gap-1">
                <Building className="w-4 h-4 text-blue-500" />
                {item.propertyType}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsList;
