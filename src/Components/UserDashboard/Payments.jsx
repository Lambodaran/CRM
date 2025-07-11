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

const BASE_URL = "https://crm-bcgg.onrender.com";
const logindata = JSON.parse(sessionStorage.getItem("logindata"));

const propertyTypeIcons = {
  Apartment: <Building className="w-4 h-4 text-blue-500" />,
  Villa: <Home className="w-4 h-4 text-green-500" />,
  Office: <Briefcase className="w-4 h-4 text-gray-700" />,
  Land: <MapPin className="w-4 h-4 text-yellow-600" />,
};

const getStatusClass = (status) => {
  switch (status) {
    case "failed":
      return "text-red-700 bg-red-100";
    case "completed":
      return "text-green-700 bg-green-100";
    case "pending":
      return "text-yellow-700 bg-yellow-100";
    default:
      return "text-gray-600 bg-gray-200";
  }
};

const formatDate = (dateString) => {
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const PaymentListView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      // Check if logindata and token are available
      let currentLogindata = JSON.parse(sessionStorage.getItem("logindata"));
      if (!currentLogindata?.token) {
        // If logindata is not available, set error and stop loading
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/transactions/my`, {
          headers: {
            Authorization: `Bearer ${currentLogindata.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Poll for logindata if it's not immediately available
    const checkLoginData = () => {
      let currentLogindata = JSON.parse(sessionStorage.getItem("logindata"));
      if (currentLogindata?.token) {
        fetchTransactions();
      } else {
        // Retry every 500ms, up to 5 attempts
        let attempts = 0;
        const maxAttempts = 5;
        const interval = setInterval(() => {
          currentLogindata = JSON.parse(sessionStorage.getItem("logindata"));
          attempts++;
          if (currentLogindata?.token) {
            clearInterval(interval);
            fetchTransactions();
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            setError("Authentication token not found after retrying. Please log in.");
            setLoading(false);
          }
        }, 500);
      }
    };

    checkLoginData();
  }, []);

  const filteredData = transactions.filter((item) => {
    const matchesSearch =
      item._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.builder?.companyName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.property?.unitNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      item.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen font-sans flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white min-h-screen font-sans flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search payments..."
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
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2">Transaction ID</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Builder Name</th>
              <th className="px-4 py-2">Transaction Date</th>
              <th className="px-4 py-2">Property</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className="bg-white hover:bg-gray-50 shadow-sm rounded-md"
              >
                <td className="px-4 py-3">
                  <CheckSquare className="text-gray-400 w-5 h-5" />
                </td>
                <td className="px-4 py-3 text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                  {item.razorpayPaymentId}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  {item.builder?.companyName || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-4 py-3 text-sm flex items-center gap-1">
                  {item.property?.unitNumber || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                  Rs.{item.amount}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                  {item.paymentMethod}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Search className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">
            No transactions found
          </h3>
          <p className="text-sm text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentListView;