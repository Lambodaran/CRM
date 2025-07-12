import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaMapMarkerAlt, FaEnvelope, FaPhone, FaStickyNote, FaTable, FaAddressCard } from "react-icons/fa";

const BookingForm = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("table"); // Default to table view

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await fetch("https://crm-bcgg.onrender.com/api/bookingform");
        if (!response.ok) {
          throw new Error(`Failed to fetch booking details: ${response.statusText}`);
        }
        const data = await response.json();
        // Ensure data is an array; if it's a single object, wrap it in an array
        setBookingData(Array.isArray(data) ? data : [data]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookingData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 ">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-black-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 ">
        <div className="text-red-500 text-lg font-semibold ">{error}</div>
      </div>
    );
  }

  if (!bookingData.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 ">
        <div className="text-gray-500 text-lg font-semibold ">No booking data available</div>
      </div>
    );
  }

  // Table View Component
  const TableView = () => (
    <div className="overflow-y-auto max-h-[500px]">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-xl">
        <thead className="bg-black text-white sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold ">Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold ">Address</th>
            <th className="px-6 py-4 text-left text-sm font-semibold ">Email</th>
            <th className="px-6 py-4 text-left text-sm font-semibold ">Phone</th>
            <th className="px-6 py-4 text-left text-sm font-semibold ">Note</th>
          </tr>
        </thead>
        <tbody>
          {bookingData.map((booking, index) => (
            <tr
              key={index}
              className={`border-t border-gray-100 ${
                index % 2 === 0 ? "bg-black-50" : "bg-white"
              } hover:bg-black-100 transition duration-200`}
            >
              <td className="px-6 py-4 text-sm text-gray-800 ">
                {(booking.firstName || "N/A") + " " + (booking.lastName || "")}
              </td>
              <td className="px-6 py-4 text-sm text-gray-800 ">
                {(booking.address || "N/A") +
                  ", " +
                  (booking.city || "N/A") +
                  ", " +
                  (booking.country || "N/A") +
                  " " +
                  (booking.zipCode || "N/A")}
              </td>
              <td className="px-6 py-4 text-sm text-gray-800 ">{booking.email || "N/A"}</td>
              <td className="px-6 py-4 text-sm text-gray-800 ">{booking.phone || "N/A"}</td>
              <td className="px-6 py-4 text-sm text-gray-800 ">{booking.note || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Card View Component
  const CardView = () => (
    <div className="overflow-y-auto max-h-[500px] pr-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookingData.map((booking, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 border-2"
          >
            <div className="space-y-4">
              {/* Name Section */}
              <div className="flex items-center gap-3">
                <FaUser className="text-black-500 w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500 ">Full Name</p>
                  <p className="text-sm font-semibold text-gray-800 ">
                    {(booking.firstName || "N/A") + " " + (booking.lastName || "")}
                  </p>
                </div>
              </div>

              {/* Address Section */}
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-black-500 w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500 ">Address</p>
                  <p className="text-sm font-semibold text-gray-800 ">
                    {(booking.address || "N/A") +
                      ", " +
                      (booking.city || "N/A") +
                      ", " +
                      (booking.country || "N/A") +
                      " " +
                      (booking.zipCode || "N/A")}
                  </p>
                </div>
              </div>

              {/* Email Section */}
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-black-500 w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500 ">Email</p>
                  <p className="text-sm font-semibold text-gray-800 ">{booking.email || "N/A"}</p>
                </div>
              </div>

              {/* Phone Section */}
              <div className="flex items-center gap-3">
                <FaPhone className="text-black-500 w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-500 ">Phone</p>
                  <p className="text-sm font-semibold text-gray-800 ">{booking.phone || "N/A"}</p>
                </div>
              </div>

              {/* Note Section */}
              {booking.note && (
                <div className="flex items-center gap-3">
                  <FaStickyNote className="text-black-500 w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-500 ">Note</p>
                    <p className="text-sm font-semibold text-gray-800 ">{booking.note}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gradient-to-br from-black-50 to-gray-100 p-4  overflow-hidden">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;lack;700&display=swap');
          . {
            font-family: 'Poppins', sans-serif;
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 ">Enquiry Form</h1>

        {/* Tabbed Pane */}
        <div className="flex justify-start mb-6">
          <div className="bg-white rounded-lg shadow-md p-1 flex">
            <button
              onClick={() => setActiveTab("table")}
              className={`p-3 rounded-md transition duration-200 ${
                activeTab === "table"
                  ? "bg-black text-white"
                  : "text-grey hover:bg-gray-50"
              }`}
              title="Table View"
            >
              <FaTable className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab("card")}
              className={`p-3 rounded-md transition duration-200 ${
                activeTab === "card"
                  ? "bg-black text-white"
                  : "text-gray hover:bg-gray-50"
              }`}
              title="Card View"
            >
              <FaAddressCard className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-6">
          {activeTab === "table" ? <TableView /> : <CardView />}
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-black-500 text-white rounded-lg hover:bg-black transition duration-200 "
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;