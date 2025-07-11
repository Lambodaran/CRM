

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

const BASE_URL = "https://crm-bcgg.onrender.com";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const logindata = JSON.parse(sessionStorage.getItem("logindata"));

        const token = logindata.token;
        const userId = logindata?.user?.id; // Assuming userId is stored in logindata

        // First, get builderId
        const builderProfileResponse = await fetch(
          `${BASE_URL}/api/properties/builder-profile/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!builderProfileResponse.ok) {
          throw new Error("Failed to fetch builder profile");
        }

        const builderProfile = await builderProfileResponse.json();
        const builderid = builderProfile._id;

        const response = await axios.get(
          `${BASE_URL}/api/transactions/${builderid}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Helper function to handle property display
  const renderProperty = (property) => {
    if (typeof property === "object" && property !== null) {
      return property.unitNumber || property._id || "N/A";
    }
    return property || "N/A";
  };

  // Function to handle download
  const handleDownload = () => {
    // Format the data for Excel
    const excelData = transactions.map((transaction) => ({
      Date: new Date(transaction.createdAt).toLocaleDateString(),
      User: transaction.user?.name || "N/A",
      Phone: transaction.user?.phone || "N/A",
      Email: transaction.user?.email || "N/A",
      "Property Name": renderProperty(transaction.property),
      "Payment Id": transaction.razorpayPaymentId || "N/A",
      Amount: transaction.amount || "N/A",
      Status: transaction.status || "N/A",
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "transactions.xlsx", {
      compression: true,
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full overflow-auto">
      {/* <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2> */}
      <div className="flex items-center justify-between mb-4">
        {/*gap-4 */}
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          <Download className="w-5 h-5" />
          Download
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Date</th>
                <th className="text-left p-2 font-medium">User</th>
                <th className="text-left p-2 font-medium">Phone</th>
                <th className="text-left p-2 font-medium">Email</th>
                <th className="text-left p-2 font-medium">Property Name</th>
                <th className="text-left p-2 font-medium">Payment Id</th>
                <th className="text-left p-2 font-medium">Amount</th>
                <th className="text-left p-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="p-2">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2">{transaction.user?.name}</td>
                  <td className="p-2">{transaction.user?.phone}</td>
                  <td className="p-2">{transaction.user?.email}</td>
                  <td className="p-2">
                    {renderProperty(transaction.property)}
                  </td>
                  <td className="p-2">{transaction.razorpayPaymentId}</td>
                  <td className="p-2">{transaction.amount}</td>
                  <td className="p-2">
                    <span
                      className={`font-medium ${
                        transaction.status === "Paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      • {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
