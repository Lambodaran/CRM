import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BASE_URL = "https://crm-bcgg.onrender.com";

function IncomeChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("yearly");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const logindata = JSON.parse(sessionStorage.getItem("logindata"));
        if (!logindata || !logindata.token) {
          throw new Error("User not authenticated");
        }

        const token = logindata.token;
        const userId = logindata.user?.id;

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
        const builderId = builderProfile._id;

        const dashboardResponse = await fetch(
          `${BASE_URL}/api/dashboard/${builderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!dashboardResponse.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const dashboardData = await dashboardResponse.json();

        const { saleData, rentData, labels } = processChartData(
          dashboardData,
          timeRange
        );

        setChartData({
          labels,
          datasets: [
            {
              label: "Sale",
              data: saleData,
              backgroundColor: "rgba(59, 130, 246, 0.6)",
              borderColor: "rgb(59, 130, 246)",
              borderWidth: 1,
            },
            {
              label: "Rent",
              data: rentData,
              backgroundColor: "rgba(34, 197, 94, 0.6)",
              borderColor: "rgb(34, 197, 94)",
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const processChartData = (data, range) => {
    const currentYear = new Date().getFullYear();

    if (range === "yearly") {
      return {
        labels: Array.from({ length: 6 }, (_, i) => currentYear - 5 + i),
        saleData: [100, 450, 300, 480, 280, data.builderAmount / 1000 || 900],
        rentData: [
          300,
          650,
          320,
          720,
          550,
          (data.builderAmount * 0.7) / 1000 || 800,
        ],
      };
    } else if (range === "monthly") {
      return {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        saleData: Array.from({ length: 12 }, (_, i) =>
          Math.floor(Math.random() * 500 + 200)
        ),
        rentData: Array.from({ length: 12 }, (_, i) =>
          Math.floor(Math.random() * 500 + 300)
        ),
      };
    } else {
      return {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        saleData: Array.from({ length: 4 }, (_, i) =>
          Math.floor(Math.random() * 800 + 400)
        ),
        rentData: Array.from({ length: 4 }, (_, i) =>
          Math.floor(Math.random() * 800 + 600)
        ),
      };
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ₹${(
              context.raw * 1000
            ).toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "rgb(107, 114, 128)" },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        min: 0,
        ticks: {
          color: "rgb(107, 114, 128)",
          callback: function (value) {
            return `₹${value}k`;
          },
          padding: 10,
        },
        grid: {
          color: "rgb(229, 231, 235)",
          drawBorder: false,
          drawTicks: false,
        },
      },
    },
    interaction: { mode: "index", intersect: false },
  };

  if (loading) {
    return (
      <div className="w-full sm:w-[600px] p-3 sm:p-4 rounded-lg shadow-sm mx-auto my-8 bg-gray-50 animate-pulse">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2 sm:gap-0">
          <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
          <div className="h-6 w-1/2 sm:w-1/3 bg-gray-200 rounded"></div>
        </div>
        <div className="h-56 bg-gray-100 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full sm:w-[600px] p-3 sm:p-4 rounded-lg shadow-sm mx-auto my-8 bg-white">
        <div className="text-red-500 text-center py-8">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-[600px] p-3 sm:p-4 rounded-lg shadow-sm bg-white mx-auto my-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2 sm:gap-0">
        <h2 className="text-lg font-semibold text-gray-800">Total Income</h2>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-sm flex-shrink-0"></span>
            <span className="text-xs text-gray-600">Sale</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-sm flex-shrink-0"></span>
            <span className="text-xs text-gray-600">Rent</span>
          </div>
          <div className="relative">
            <select
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded py-0.5 pl-2 pr-6 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 cursor-pointer"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-gray-500">
              <svg
                className="fill-current h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M5.516 7.548a.75.75 0 011.06 0L10 10.97l3.424-3.423a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 010-1.06z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="h-56">
        {chartData ? (
          <Bar options={options} data={chartData} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}

export default IncomeChart;