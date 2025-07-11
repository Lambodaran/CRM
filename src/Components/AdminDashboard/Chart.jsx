import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const token = JSON.parse(sessionStorage.getItem("logindata"))?.token;
const BASE_URL = "https://crm-bcgg.onrender.com";

export default function DashboardChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/dashboard/admin`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();

        // Transform the API data into chart-friendly format
        const transformedData = [
          {
            name: "Properties",
            Total: data.totalProperties,
          },
          {
            name: "Transactions",
            Total: data.totalTransactions,
          },
          {
            name: "Leads",
            Total: data.totalLeads,
          },
        ];

        setChartData(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white shadow-lg rounded-lg w-full animate-pulse">
        {/* Skeleton for header */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
          {/* Placeholder for select (commented out in original, but included for consistency) */}
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
        </div>
        {/* Skeleton for chart */}
        <div className="w-full h-[300px] bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Dashboard Overview</h2>
        {/* <select className="border rounded px-2 py-1 text-sm">
          <option value="summary">Summary</option>
        </select> */}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}