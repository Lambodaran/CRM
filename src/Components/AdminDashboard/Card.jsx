import React, { useState, useEffect } from "react";
import card1 from "../AdminDashboard/Assets/card1.png";
import card2 from "../AdminDashboard/Assets/card2.png";
import card3 from "../AdminDashboard/Assets/card3.png";
import card4 from "../AdminDashboard/Assets/card4.png";

const token = JSON.parse(sessionStorage.getItem("logindata"))?.token;
const BASE_URL = "https://crm-bcgg.onrender.com";

const Card = () => {
  const [dashboardData, setDashboardData] = useState(null);
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
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      id: 1,
      image: <img src={card1} alt="" />,
      title: "Total Properties",
      value: dashboardData?.totalProperties || 0,
      // percentage: "+30%",
      // trend: "up",
      // description: "Higher than last month",
    },
    {
      id: 2,
      image: <img src={card2} alt="" />,
      title: "Total Transactions",
      value: dashboardData?.totalTransactions || 0,
      // percentage: "-15%",
      // trend: "down",
      // description: "Lesser than last month",
    },
    {
      id: 3,
      image: <img src={card3} alt="" />,
      title: "Total Amount",
      value: dashboardData?.totalAmount
        ? `₹${dashboardData.totalAmount.toLocaleString()}`
        : "₹0",
      // percentage: "+30%",
      // trend: "up",
      // description: "Higher than last month",
    },
    {
      id: 4,
      image: <img src={card4} alt="" />,
      title: "Total Leads",
      value: dashboardData?.totalLeads || 0,
      // percentage: "+30%",
      // trend: "up",
      // description: "Higher than last month",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-4 animate-pulse">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-start border border-gray-200 w-full"
          >
            {/* Skeleton for Image */}
            <div className="bg-gray-200 rounded-full w-8 h-8"></div>
            {/* Skeleton for Title */}
            <div className="h-6 w-2/3 bg-gray-200 rounded mt-2"></div>
            {/* Skeleton for Value */}
            <div className="h-8 w-1/2 bg-gray-200 rounded mt-1"></div>
            {/* Skeleton for Percentage/Description */}
            <div className="h-4 w-3/4 bg-gray-200 rounded mt-1"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-4">
      {cards.map(
        ({ id, image, title, value, percentage, trend, description }) => (
          <div
            key={id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-start border border-gray-200 w-full"
          >
            {/* Image */}
            <div className="bg-sky-100 rounded-full flex items-center justify-center w-8 h-8">
              <div className="text-2xl">{image}</div>
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold mt-2">{title}</h2>

            {/* Value */}
            <h3 className="text-2xl font-bold mt-1">{value}</h3>

            {/* Percentage Change */}
            <p
              className={`text-sm font-medium mt-1 flex items-center ${
                trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {percentage}{" "}
              <span className="text-gray-600 ml-1">{description}</span>
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default Card;