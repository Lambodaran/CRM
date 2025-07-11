// import { FaBuilding, FaRupeeSign, FaTasks, FaExpand } from "react-icons/fa";

// const token = JSON.parse(sessionStorage.getItem("logindata"))?.token;
// const BASE_URL = "https://crm-bcgg.onrender.com";

// const stats = [
//   {
//     id: 1,
//     title: "Total Transactions",
//     value: "50",
//     icon: <FaBuilding className="text-blue-500 text-3xl" />,
//     change: "+30%",
//     changeText: "Higher than last month",
//     changeColor: "text-green-500",
//   },
//   {
//     id: 2,
//     title: "Total Revenue",
//     value: "₹20,00,000",
//     icon: <FaRupeeSign className="text-blue-500 text-3xl" />,
//     change: "-15%",
//     changeText: "Lesser than last month",
//     changeColor: "text-red-500",
//   },
//   {
//     id: 3,
//     title: "Ongoing Projects",
//     value: "17",
//     icon: <FaTasks className="text-blue-500 text-3xl" />,
//     change: "+30%",
//     changeText: "Higher than last month",
//     changeColor: "text-green-500",
//   },
//   {
//     id: 4,
//     title: "Total units",
//     value: "10,000",
//     icon: <FaExpand className="text-blue-500 text-3xl" />,
//     change: "+30%",
//     changeText: "Higher than last month",
//     changeColor: "text-green-500",
//   },
// ];

// export default function DashboardStats() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
//       {stats.map((stat) => (
//         <div key={stat.id} className="bg-white shadow-md p-6 rounded-lg">
//           <div className="flex justify-between items-center">
//             <h3 className="text-gray-600 text-sm">{stat.title}</h3>
//             <h3 className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
//               {stat.icon}
//             </h3>
//           </div>

//           <p className="text-2xl font-bold mt-2">{stat.value}</p>
//           <div className="border mt-2"></div>
//           <div className="mt-2 text-sm flex items-center">
//             <span className={`${stat.changeColor} font-semibold`}>
//               {stat.change}
//             </span>
//             <span className="text-gray-500 ml-2">{stat.changeText}</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }




import { FaBuilding, FaRupeeSign, FaTasks, FaExpand } from "react-icons/fa";
import { useEffect, useState } from "react";

const BASE_URL = "https://crm-bcgg.onrender.com";

export default function DashboardStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data from session storage
        const logindata = JSON.parse(sessionStorage.getItem("logindata"));
        if (!logindata || !logindata.token) {
          throw new Error("User not authenticated");
        }

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
        const builderId = builderProfile._id;

        // Then, get dashboard stats
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

        // Map the API response to your stats format
        const mappedStats = [
          {
            id: 1,
            title: "Total Transactions",
            value: dashboardData.builderTransactions.toString(),
            icon: <FaBuilding className="text-blue-500 text-3xl" />,
            // change: "+30%", // You might want to get this from API too
            // changeText: "Higher than last month",
            changeColor: "text-green-500",
          },
          {
            id: 2,
            title: "Total Revenue",
            value: `₹${dashboardData.builderAmount.toLocaleString()}`,
            icon: <FaRupeeSign className="text-blue-500 text-3xl" />,
            // change: "-15%", // You might want to get this from API too
            // changeText: "Lesser than last month",
            changeColor: "text-red-500",
          },
          {
            id: 3,
            title: "Ongoing Projects",
            value: dashboardData.builderProperties.toString(),
            icon: <FaTasks className="text-blue-500 text-3xl" />,
            // change: "+30%", // You might want to get this from API too
            // changeText: "Higher than last month",
            changeColor: "text-green-500",
          },
          {
            id: 4,
            title: "Total units",
            value: dashboardData.totalunits?.toString() || "0", // Using optional chaining in case totalunits is not provided
            icon: <FaExpand className="text-blue-500 text-3xl" />,
            // change: "+30%", // You might want to get this from API too
            // changeText: "Higher than last month",
             changeColor: "text-green-500",
          },
        ];

        setStats(mappedStats);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);

        // Set default stats in case of error
        setStats([
          {
            id: 1,
            title: "Total Transactions",
            value: "0",
            icon: <FaBuilding className="text-blue-500 text-3xl" />,
            change: "+0%",
            changeText: "Data not available",
            changeColor: "text-gray-500",
          },
          {
            id: 2,
            title: "Total Revenue",
            value: "₹0",
            icon: <FaRupeeSign className="text-blue-500 text-3xl" />,
            change: "+0%",
            changeText: "Data not available",
            changeColor: "text-gray-500",
          },
          {
            id: 3,
            title: "Ongoing Projects",
            value: "0",
            icon: <FaTasks className="text-blue-500 text-3xl" />,
            change: "+0%",
            changeText: "Data not available",
            changeColor: "text-gray-500",
          },
          {
            id: 4,
            title: "Total units",
            value: "0",
            icon: <FaExpand className="text-blue-500 text-3xl" />,
            change: "+0%",
            changeText: "Data not available",
            changeColor: "text-gray-500",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {[1, 2, 3, 4].map((id) => (
          <div
            key={id}
            className="bg-white shadow-md p-6 rounded-lg animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="border mt-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}. Showing placeholder data.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {stats.map((stat) => (
        <div key={stat.id} className="bg-white shadow-md p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-600 text-sm">{stat.title}</h3>
            <h3 className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
              {stat.icon}
            </h3>
          </div>

          <p className="text-2xl font-bold mt-2">{stat.value}</p>
          <div className="border mt-2"></div>
          <div className="mt-2 text-sm flex items-center">
            <span className={`${stat.changeColor} font-semibold`}>
              {stat.change}
            </span>
            <span className="text-gray-500 ml-2">{stat.changeText}</span>
          </div>
        </div>
      ))}
    </div>
  );
}