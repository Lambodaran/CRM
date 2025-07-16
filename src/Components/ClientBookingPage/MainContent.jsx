


// import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import {
//   FaCheck,
//   FaMapMarkerAlt,
//   FaMoneyBillWave,
//   FaRulerCombined,
//   FaHome,
//   FaBuilding,
// } from "react-icons/fa";
// import Page from "./Page";
// import { useLocation, useNavigate } from "react-router-dom";
// import KeyAmenities from "../PropertyInnerPage/KeyAmenities";

// const BASE_URL = "https://crm-bcgg.onrender.com";
// //const token = JSON.parse(sessionStorage.getItem("logindata"))?.token;

// function ArihantPage() {
//   const location = useLocation();
//   const buildingid =
//     location?.state?.buildingId || sessionStorage.getItem("buildingId");
//   const builderId =
//     location?.state?.builderId || sessionStorage.getItem("builderId");
//   const navigate = useNavigate();
//   console.log(builderId,buildingid);
  

//   /* ========== STATE VARIABLES ========== */
//   const [buildingData, setBuildingData] = useState(null);
//   const [buildingImage, setBuildingImage] = useState(null);
//   const [buildings, setBuildings] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [units, setUnits] = useState([]);
//   const [selectedBuilding, setSelectedBuilding] = useState(null);
//   const [selectedFloor, setSelectedFloor] = useState(null);
//   const [selectedUnit, setSelectedUnit] = useState(null);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalImage, setModalImage] = useState(null);
//   const [scale, setScale] = useState(1);
//   const [bookingSuccess, setBookingSuccess] = useState(false);
//   const [loading, setLoading] = useState({
//     buildings: true,
//     building: true,
//     floors: false,
//     units: false,
//   });
//   const [paymentProcessing, setPaymentProcessing] = useState(false);
//   const[token, setToken]=useState("")

//   useEffect(() => {
//     const usertoken = JSON.parse(sessionStorage.getItem("logindata"));
//     if (usertoken) {
//       setToken(usertoken?.token)
//     }
//   }, [])
//   console.log(token);
  

//   useEffect(() => {
//     if (sessionStorage.getItem("buildingId")) {
//       sessionStorage.removeItem("buildingId");
//       sessionStorage.removeItem("builderId");
//     }
//   }, []);

//   /* ========== FETCH ALL BUILDINGS ========== */
//   useEffect(() => {
//     const fetchBuildings = async () => {
//       try {
//         const response = await fetch(
//           `${BASE_URL}/api/propertiesGet/building/${buildingid}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!response.ok) throw new Error("Failed to fetch buildings");
//         const data = await response.json();

//         const buildingsArray = Array.isArray(data) ? data : [data];
//         setBuildings(buildingsArray);
//         setLoading((prev) => ({ ...prev, buildings: false }));

//         if (buildingid) {
//           const building =
//             buildingsArray.find((b) => b._id === buildingid) || data;
//           if (building) {
//             setSelectedBuilding(building);
//             setBuildingData(building);
//             if (building.photos && building.photos.length > 0) {
//               setBuildingImage(building.photos[0]);
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching buildings:", error);
//         setLoading((prev) => ({ ...prev, buildings: false }));
//       }
//     };

//     fetchBuildings();
//   }, [buildingid, token]);

//   /* ========== FETCH BUILDING DATA WHEN SELECTED ========== */
//   useEffect(() => {
//     if (!selectedBuilding) return;

//     setBuildingData(selectedBuilding);
//     setBuildingImage(selectedBuilding.photos[0]);
//   }, [selectedBuilding]);

//   /* ========== FETCH FLOORS WHEN BUILDING IS SELECTED ========== */
//   useEffect(() => {
//     const fetchFloors = async () => {
//       if (!selectedBuilding?._id) return;
//       setLoading((prev) => ({ ...prev, floors: true }));
//       try {
//         const response = await fetch(
//           `${BASE_URL}/api/properties/floors/by-building/${selectedBuilding._id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!response.ok) throw new Error("Failed to fetch floors");
//         const data = await response.json();
//         setFloors(Array.isArray(data) ? data : []);
//         setLoading((prev) => ({ ...prev, floors: false }));
//       } catch (error) {
//         console.error("Error fetching floors:", error);
//         setLoading((prev) => ({ ...prev, floors: false }));
//       }
//     };

//     fetchFloors();
//   }, [selectedBuilding, token]);

//   /* ========== FETCH UNITS WHEN FLOOR IS SELECTED ========== */
//   useEffect(() => {
//     const fetchUnits = async () => {
//       if (!selectedFloor?._id) return;
//       setLoading((prev) => ({ ...prev, units: true }));
//       try {
//         const response = await fetch(
//           `${BASE_URL}/api/properties/units/by-floor/${selectedFloor._id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!response.ok) throw new Error("Failed to fetch units");
//         const data = await response.json();
//         setUnits(data ? data : []);
//         setLoading((prev) => ({ ...prev, units: false }));
//       } catch (error) {
//         console.error("Error fetching units:", error);
//         setLoading((prev) => ({ ...prev, units: false }));
//       }
//     };

//     fetchUnits();
//   }, [selectedFloor, token]);

//   /* ========== TEXT CONTENT ========== */
//   const textPart1 = `One of our finest creations, in a neighborhood that checks all the boxes.
//     Staying at Hunters Road means you are exceptionally close to business,
//     as it's adjacent to Purasawakkam, one of the largest commercial markets in Chennai.

//     ${
//       buildingData?.buildingName || "This property"
//     } is exceptional not just in its exterior facade,
//     but equally stunning in its meticulous planning and every detail.`;

//   const textPart2 = `Only 45 bespoke residences that allow you design customisations,
//     and 8 of them come with private terraces. The project is planned as per vastu
//     around a well designed central courtyard. Tucked away from the main road,
//     your home is in a quiet and clean sanctuary. Enter the 10 ft driveway
//     and you will feel like a dream coming true.`;

//   const handleToggle = () => setIsExpanded(!isExpanded);

//   /* ========== HANDLE SELECTION CHANGES ========== */
//   const handleBuildingChange = (selectedOption) => {
//     const building = buildings.find((b) => b._id === selectedOption.value);
//     setSelectedBuilding(building);
//     setSelectedFloor(null);
//     setSelectedUnit(null);
//   };

//   const handleFloorChange = (selectedOption) => {
//     const floor = floors.find((f) => f._id === selectedOption.value);
//     setSelectedFloor(floor);
//     setSelectedUnit(null);
//   };

//   const handleUnitSelect = (unit) => {
//     if (unit.availability === "available") {
//       setSelectedUnit(unit);
//     }
//   };

//   /* ========== MODAL FUNCTIONS ========== */
//   const openModal = (imageSrc) => {
//     setModalImage(imageSrc);
//     setIsModalOpen(true);
//     setScale(1);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setModalImage(null);
//   };

//   const handleZoomIn = () => setScale((prev) => prev + 0.25);
//   const handleZoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.25));

  

//   /* ========== RAZORPAY PAYMENT INTEGRATION ========== */
//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => {
//         resolve(true);
//       };
//       script.onerror = () => {
//         resolve(false);
//       };
//       document.body.appendChild(script);
//     });
//   };

//   const postToLeads = async (unitId) => {
//   try {
//     const response = await fetch(`${BASE_URL}/api/leads/auto`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         unitId: unitId
//       }),
//     });
    
//     if (!response.ok) {
//       throw new Error("Failed to create lead");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error creating lead:", error);
//     throw error;
//   }
// };

//   const createRazorpayOrder = async () => {
//     try {
//       console.log(builderId);
      
//       const response = await fetch(`${BASE_URL}/api/transactions/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           amount: selectedUnit.price.totalPrice,
//           builderId: builderId,
//           propertyId: selectedUnit._id,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to create Razorpay order");
//       }

//       const data = await response.json();

//       // Ensure we're getting the full order ID
//       if (!data.order || !data.order.id) {
//         throw new Error("Invalid order data received from server");
//       }

//       return data.order.id;
//     } catch (error) {
//       console.error("Error creating Razorpay order:", error);
//       throw error;
//     }
//   };

//   const verifyPayment = async (paymentData) => {
//     try {
//       // Make sure we're sending the full order ID
//       const verificationData = {
//         razorpay_order_id: paymentData.razorpay_order_id,
//         razorpay_payment_id: paymentData.razorpay_payment_id,
//         razorpay_signature: paymentData.razorpay_signature,
//       };

//       const response = await fetch(`${BASE_URL}/api/transactions/verify`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(verificationData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Payment verification failed");
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Error verifying payment:", error);
//       throw error;
//     }
//   };


//   const handleBookNow = async () => {
//     if (!selectedUnit) return;
//     if (paymentProcessing) return;

    
//     // const userData = JSON.parse(sessionStorage.getItem("logindata"));
//     // if (!userData) {
//     //   // Store both the path and the building ID
//     //   sessionStorage.setItem("redirectPath", window.location.pathname);
//     //   sessionStorage.setItem("buildingId", buildingid);
//     //   sessionStorage.setItem("builderId", builderId);
//     //   window.location.href = "/login";
//     //   return;
//     // }

//     const userData = JSON.parse(sessionStorage.getItem("logindata"));
//     if (!userData) {
//       // Store all necessary data in sessionStorage
//       sessionStorage.setItem("redirectPath", window.location.pathname);
//       sessionStorage.setItem("buildingId", buildingid);
//       sessionStorage.setItem("builderId", builderId);
    
//       navigate("/login", {
//         state: {
//           from: window.location.pathname,
//           buildingId: buildingid,
//           builderId: builderId,
//         }
//       });
//       return;
//     }

//     setPaymentProcessing(true);
    

//     try {
//       // 1. Create booking first
//       const bookingResponse = await fetch(`${BASE_URL}/api/booking`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userData.token}`,
//         },
//         body: JSON.stringify({
//           unitId: selectedUnit._id,
//         }),
//       });

//       if (!bookingResponse.ok) {
//         throw new Error("Booking failed");
//       }

//       // 2. Load Razorpay script
//       const razorpayLoaded = await loadRazorpayScript();
//       if (!razorpayLoaded) {
//         throw new Error("Razorpay SDK failed to load");
//       }

//       // 3. Create Razorpay order
//       const orderId = await createRazorpayOrder();

//       // 4. Initialize Razorpay payment
//       const options = {
//         key: "rzp_test_E0aQEsxCsOjngr",
//         amount: selectedUnit.price.totalPrice,
//         currency: "INR",
//         name: "ABV Properties",
//         description: `Booking for Unit ${selectedUnit.unitNumber}`,
//         order_id: orderId,
//         handler: async function (response) {
//           try {
//             console.log("Full Razorpay response:", response);

//             const isVerified = await verifyPayment({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//             });

//             if (isVerified) {
//               setBookingSuccess(true);
//               navigate("/popperpage", {
//                 state: {
//                   paymentSuccess: true,
//                   unitDetails: selectedUnit,
//                 },
//               });
//             } else {
//               // If verification fails, create a lead
//               await postToLeads(selectedUnit._id);
//               alert("Payment verification failed. Please contact support.");
//             }
//           } catch (error) {
//             console.error("Payment processing error:", error);
//             // On any error, create a lead
//             await postToLeads(selectedUnit._id);
//             alert(`Payment failed: ${error.message}`);
//           } finally {
//             setPaymentProcessing(false);
//           }
//         },
//         prefill: {
//           name: "Customer Name",
//           email: "customer@example.com",
//           contact: "9999999999",
//         },
//         theme: {
//           color: "#FAE696",
//         },
//       };

//       const rzp = new window.Razorpay(options);

//       // Add explicit handling for payment cancellation
//       rzp.on("payment.failed", async function (response) {
//         console.error("Payment Failed:", response.error);
//         try {
//           // Create lead when payment fails
//           await postToLeads(selectedUnit._id);
//           alert(`Payment failed: ${response.error.description}`);
//         } catch (error) {
//           console.error("Error creating lead after payment failure:", error);
//           alert(
//             "Payment failed and we couldn't save your interest. Please contact support."
//           );
//         } finally {
//           setPaymentProcessing(false);
//         }
//       });

//       rzp.open();
//     } catch (error) {
//       console.error("Error in booking/payment processing:", error);
//       try {
//         // If any error occurs before payment starts, create a lead
//         await postToLeads(selectedUnit._id);
//       } catch (leadError) {
//         console.error("Error creating lead:", leadError);
//       }
//       alert(`An error occurred: ${error.message}`);
//     } finally {
//       setPaymentProcessing(false);
//     }
//   };

 

//   const customSelectStyles = {
//     control: (provided) => ({
//       ...provided,
//       borderColor: "#D1D5DB",
//       "&:hover": {
//         borderColor: "#F59E0B",
//       },
//       boxShadow: "none",
//       minHeight: "40px",
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected ? "#F59E0B" : "white",
//       color: state.isSelected ? "white" : "#4B5563",
//       "&:hover": {
//         backgroundColor: "#FBBF24",
//         color: "white",
//       },
//     }),
//     menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//   };

//   // Prepare units data for the Page component
//   const getUnitsForFloorPlan = () => {
//     if (!units.length || !selectedFloor?.coordinates) return [];

//     return units.map((unit) => ({
//       id: unit._id,
//       label: unit.unitNumber,
//       available: unit.availability === "available",
//       price: unit.price?.totalPrice,
//       area: unit.sizeSqFt,
//       type: unit.bhkType,
//       coordinates: selectedFloor.coordinates[unit.unitNumber],
//     }));
//   };

//   return (
//     <div className="mx-auto bg-white">
//       {/* Top Section */}
//       <div className="mx-auto p-4 flex flex-col lg:flex-row gap-6 bg-white items-start">
//         {/* Left: Building image */}
//         <div
//           className="relative overflow-hidden"
//           style={{ width: "800px", height: "500px" }}
//         >
//           {buildingImage ? (
//             <img
//               src={buildingImage}
//               alt={buildingData?.buildingName || "Building"}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//               {loading.building ? "Loading image..." : "No image available"}
//             </div>
//           )}
//         </div>

//         {/* RIGHT: Building details */}
//         <div
//           className="relative p-6 flex flex-col bg-white"
//           style={{
//             width: "800px",
//             height: "500px",
//             overflowY: isExpanded ? "auto" : "hidden",
//           }}
//         >
//           <div className="flex items-center mb-4">
//             <span className="text-yellow-600 uppercase font-semibold tracking-wide text-sm mr-2">
//               About
//             </span>
//             <div className="flex-1 h-px bg-yellow-600" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-snug">
//             {buildingData?.buildingName || "Loading..."} - Price, Floor Plans,
//             Reviews
//           </h2>

//           <div className="text-sm text-gray-700 leading-relaxed">
//             {textPart1
//               .split("\n")
//               .filter((p) => p.trim().length > 0)
//               .map((paragraph, idx) => (
//                 <p key={idx} className="mb-4 last:mb-0">
//                   {paragraph.trim()}
//                 </p>
//               ))}
//             {isExpanded && (
//               <div className="mt-4">
//                 {textPart2
//                   .split("\n")
//                   .filter((p) => p.trim().length > 0)
//                   .map((paragraph, idx) => (
//                     <p key={idx} className="mb-4 last:mb-0">
//                       {paragraph.trim()}
//                     </p>
//                   ))}
//               </div>
//             )}
//           </div>
//           <button
//             onClick={handleToggle}
//             className="mt-4 text-[#C8A158] font-medium hover:underline self-start"
//           >
//             {isExpanded ? "Read Less" : "Read More"}
//           </button>
//         </div>
//       </div>

//       {/* ========== FLOOR SELECTION SECTION ========== */}
//       <div className="max-w-6xl mx-auto my-10 px-4 flex flex-col md:flex-row gap-6 justify-center">
//         {/* LEFT: Floor Plan */}
//         <div className="md:w-2/3 bg-orange-50 shadow-md rounded-lg p-6">
//           <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
//             Select Available Spaces
//           </h2>

//           {/* BUILDING DROPDOWN */}
//           <div className="w-full mb-4">
//             <Select
//               options={buildings.map((building) => ({
//                 value: building._id,
//                 label: building.buildingName,
//               }))}
//               value={
//                 selectedBuilding
//                   ? {
//                       value: selectedBuilding._id,
//                       label: selectedBuilding.buildingName,
//                     }
//                   : null
//               }
//               onChange={handleBuildingChange}
//               placeholder={
//                 loading.buildings ? "Loading buildings..." : "Select Building"
//               }
//               isDisabled={loading.buildings || buildings.length === 0}
//               styles={customSelectStyles}
//               menuPortalTarget={document.body}
//             />
//           </div>

//           {/* FLOOR DROPDOWN */}
//           <div className="flex flex-col sm:flex-row gap-4 mb-6">
//             <div className="w-full">
//               <Select
//                 options={floors.map((floor) => ({
//                   value: floor._id,
//                   label: `Floor ${floor.floorNumber}`,
//                 }))}
//                 value={
//                   selectedFloor
//                     ? {
//                         value: selectedFloor._id,
//                         label: `Floor ${selectedFloor.floorNumber}`,
//                       }
//                     : null
//                 }
//                 onChange={handleFloorChange}
//                 placeholder={
//                   loading.floors ? "Loading floors..." : "Select Floor"
//                 }
//                 isDisabled={
//                   loading.floors || floors.length === 0 || !selectedBuilding
//                 }
//                 styles={customSelectStyles}
//                 menuPortalTarget={document.body}
//               />
//             </div>
//           </div>

//           {/* Show the Floor Plan with Units */}
//           <div className="relative">
//             {selectedFloor ? (
//               loading.units ? (
//                 <div className="h-64 flex items-center justify-center">
//                   Loading units...
//                 </div>
//               ) : units.length > 0 ? (
//                 <div className="relative">
//                   <Page
//                     onAreaSelect={handleUnitSelect}
//                     spaces={getUnitsForFloorPlan()}
//                     units={units}
//                     floorPlanImage={selectedFloor.image}
//                   />
//                 </div>
//               ) : (
//                 <div className="h-64 flex items-center justify-center text-gray-500">
//                   No units available for this floor
//                 </div>
//               )
//             ) : (
//               <div className="h-64 flex items-center justify-center text-gray-500">
//                 {!selectedBuilding
//                   ? "Please select a building first"
//                   : floors.length === 0 && !loading.floors
//                   ? "No floors available for this building"
//                   : "Please select a floor to view units"}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* RIGHT: Details Card */}
//         <div
//           className="md:w-1/3 border border-orange-100 bg-[#FFF8ED] rounded-lg shadow-sm"
//           style={{ height: "500px" }}
//         >
//           <div className="h-full w-full p-6 overflow-y-auto">
//             {selectedUnit ? (
//               <>
//                 <h3 className="text-2xl font-bold text-orange-600 mb-4">
//                   {selectedUnit.unitNumber}
//                 </h3>
//                 <div className="space-y-3">
//                   <div className="flex items-center">
//                     <FaMapMarkerAlt className="text-yellow-600 mr-2" />
//                     <span>Location: {selectedUnit?.facing || "N/A"}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaMoneyBillWave className="text-yellow-600 mr-2" />
//                     <span>
//                       Price: ₹{selectedUnit.price.totalPrice || "N/A"}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaRulerCombined className="text-yellow-600 mr-2" />
//                     <span>
//                       Size: {selectedUnit.price.pricePerSqft || "N/A"} Sq.Ft
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaHome className="text-yellow-600 mr-2" />
//                     <span>Type: {selectedUnit.bhkType || "N/A"}</span>
//                   </div>

//                   {selectedUnit?.photos && (
//                     <img
//                       src={selectedUnit.photos[0].url}
//                       alt={`Floor ${selectedFloor.floorNumber} Plan`}
//                       className="mt-4 w-full h-auto object-cover max-h-40 border-2 border-[#C8A158] cursor-pointer"
//                       onClick={() => openModal(selectedUnit.image)}
//                     />
//                   )}
//                 </div>

//                 <button
//                   onClick={handleBookNow}
//                   disabled={paymentProcessing}
//                   className={`mt-6 px-6 py-2 ${
//                     paymentProcessing ? "bg-gray-400" : "bg-[#FAE696]"
//                   } text-black font-semibold rounded hover:bg-[#C8A158]/90 uppercase w-full`}
//                 >
//                   {paymentProcessing ? "Processing..." : "Book Now"}
//                 </button>
//               </>
//             ) : (
//               <>
//                 <h3 className="text-2xl font-bold text-orange-600 mb-4">
//                   {selectedBuilding?.buildingName || "Select a Building"}
//                 </h3>
//                 <div className="space-y-3">
//                   <div className="flex items-center">
//                     <FaMapMarkerAlt className="text-yellow-600 mr-2" />
//                     <span>
//                       Location: {selectedBuilding?.buildingArea || "N/A"}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaMoneyBillWave className="text-yellow-600 mr-2" />
//                     <span>
//                       Price Range: {selectedBuilding?.priceRange || "N/A"}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaRulerCombined className="text-yellow-600 mr-2" />
//                     <span>
//                       Total Units: {selectedFloor?.totalUnits || "N/A"}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaBuilding className="text-yellow-600 mr-2" />
//                     <span>Type: {selectedBuilding?.type || "N/A"}</span>
//                   </div>
//                 </div>
//                 <p className="mt-4 text-gray-700">
//                   {selectedFloor
//                     ? "Click on an available unit in the floor plan to view details and book."
//                     : selectedBuilding
//                     ? "Select a floor to view available units."
//                     : "Select a building to get started."}
//                 </p>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ========== MODAL FOR IMAGE ZOOM ========== */}
//       {isModalOpen && modalImage && (
//         <div
//           className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60"
//           onClick={closeModal}
//         >
//           <div
//             className="relative bg-white p-4 rounded shadow-md max-w-4xl w-full h-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-2 right-2 text-black font-bold text-xl"
//               onClick={closeModal}
//             >
//               &times;
//             </button>
//             <div className="flex justify-center mb-2 space-x-4">
//               <button
//                 onClick={handleZoomOut}
//                 className="bg-gray-200 px-3 py-1 rounded font-semibold hover:bg-gray-300"
//               >
//                 -
//               </button>
//               <button
//                 onClick={handleZoomIn}
//                 className="bg-gray-200 px-3 py-1 rounded font-semibold hover:bg-gray-300"
//               >
//                 +
//               </button>
//             </div>
//             <div className="flex justify-center items-center overflow-auto">
//               <img
//                 src={modalImage}
//                 alt="Floor Plan Zoom"
//                 style={{
//                   transform: `scale(${scale})`,
//                   transition: "transform 0.3s ease",
//                 }}
//                 className="max-h-[80vh] object-contain"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       <KeyAmenities />

//       {/* ========== BOOKING FORM SECTION ========== */}

//       {/* <div className="flex justify-center w-full">
//         <div className="w-full md:w-1/2 bg-white p-6">
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
//             Booking Details
//           </h2>
//           <form className="space-y-4">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <input
//                 type="text"
//                 placeholder="First name*"
//                 required
//                 className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//               />
//               <input
//                 type="text"
//                 placeholder="Last name*"
//                 required
//                 className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//               />
//             </div>
//             <input
//               type="text"
//               placeholder="United States ( US )*"
//               required
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//             />
//             <input
//               type="text"
//               placeholder="Street Address*"
//               required
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//             />
//             <input
//               type="text"
//               placeholder="Town / City*"
//               required
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//             />
//             <input
//               type="text"
//               placeholder="ZIP Code"
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//             />
//             <input
//               type="email"
//               placeholder="Email Address*"
//               required
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//             />
//             <input
//               type="text"
//               placeholder="Phone*"
//               required
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//             />
//             <textarea
//               rows="3"
//               placeholder="Add Something"
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
//             />
//             <button
//               type="submit"
//               className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition font-semibold"
//             >
//               Submit
//             </button>
//           </form>
//         </div>
//       </div> */}
//     </div>
//   );
// }

// export default ArihantPage;









// import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import {
//   FaCheck,
//   FaMapMarkerAlt,
//   FaMoneyBillWave,
//   FaRulerCombined,
//   FaHome,
//   FaBuilding,
// } from "react-icons/fa";
// import Page from "./Page";
// import { useLocation, useNavigate } from "react-router-dom";
// import KeyAmenities from "../PropertyInnerPage/KeyAmenities";
// import { CiBookmark } from "react-icons/ci";
// import { IoMdBookmark } from "react-icons/io";


// const BASE_URL = "https://crm-bcgg.onrender.com";

// function ArihantPage() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Get initial state from location or sessionStorage
//   const [buildingid, setBuildingid] = useState(
//     location.state?.buildingId || sessionStorage.getItem("buildingId") || ""
//   );
//   const [builderId, setBuilderId] = useState(
//     location.state?.builderId || sessionStorage.getItem("builderId") || ""
//   );
//   const [selectedUnitId, setSelectedUnitId] = useState(
//     location.state?.unitId || sessionStorage.getItem("unitId") || null
//   );

//   /* ========== STATE VARIABLES ========== */
//   const [buildingData, setBuildingData] = useState(null);
//   const [buildingImage, setBuildingImage] = useState(null);
//   const [buildings, setBuildings] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [units, setUnits] = useState([]);
//   const [selectedBuilding, setSelectedBuilding] = useState(null);
//   const [selectedFloor, setSelectedFloor] = useState(null);
//   const [selectedUnit, setSelectedUnit] = useState(null);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalImage, setModalImage] = useState(null);
//   const [scale, setScale] = useState(1);
//   const [bookingSuccess, setBookingSuccess] = useState(false);
//   const [loading, setLoading] = useState({
//     buildings: true,
//     building: true,
//     floors: false,
//     units: false,
//   });
//   const [paymentProcessing, setPaymentProcessing] = useState(false);
//   const [token, setToken] = useState("");
//   const [bookmarks, setBookmarks] = useState([]);

//   // Persist state to sessionStorage when it changes
//   useEffect(() => {
//     if (buildingid) sessionStorage.setItem("buildingId", buildingid);
//     if (builderId) sessionStorage.setItem("builderId", builderId);
//     if (selectedUnitId) sessionStorage.setItem("unitId", selectedUnitId);
//   }, [buildingid, builderId, selectedUnitId]);

//   // Clear sessionStorage when component unmounts
//   useEffect(() => {
//     return () => {
//       sessionStorage.removeItem("buildingId");
//       sessionStorage.removeItem("builderId");
//       sessionStorage.removeItem("unitId");
//     };
//   }, []);

//   useEffect(() => {
//     const usertoken = JSON.parse(sessionStorage.getItem("logindata"));
//     if (usertoken) {
//       setToken(usertoken?.token);
//     }
//   }, []);

//   /* ========== BOOKMARK FUNCTIONALITY ========== */
//   useEffect(() => {
//     const fetchBookmarks = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}/api/saved-property`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setBookmarks(data);
//         }
//       } catch (error) {
//         console.error("Error fetching bookmarks:", error);
//       }
//     };

//     if (token) {
//       fetchBookmarks();
//     }
//   }, [token]);

//   const toggleBookmark = async () => {
//     const userData = JSON.parse(sessionStorage.getItem("logindata"));
//     if (!userData) {
//       // Store all necessary data in sessionStorage
//       sessionStorage.setItem("redirectPath", window.location.pathname);
//       sessionStorage.setItem("buildingId", buildingid);
//       sessionStorage.setItem("builderId", builderId);
//       if (selectedUnit) {
//         sessionStorage.setItem("unitId", selectedUnit._id);
//       }

//       navigate("/login", {
//         state: {
//           from: window.location.pathname,
//           buildingId: buildingid,
//           builderId: builderId,
//           unitId: selectedUnit?._id || null,
//         },
//       });
//       return;
//     }

//     try {
//       // Check if the current unit is already bookmarked
//       const existingBookmark = bookmarks.find(
//         (bookmark) => bookmark.unitId === selectedUnit?._id
//       );

//       if (existingBookmark) {
//         // Delete bookmark
//         await fetch(`${BASE_URL}/api/saved-property/${existingBookmark._id}`, {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setBookmarks(bookmarks.filter((b) => b._id !== existingBookmark._id));
//       } else if (selectedUnit) {
//         // Add new bookmark
//         const response = await fetch(`${BASE_URL}/api/saved-property`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             unitId: selectedUnit._id,
//           }),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to save property");
//         }

//         const savedProperty = await response.json();
//         setBookmarks([...bookmarks, savedProperty]);
//       }
//     } catch (error) {
//       console.error("Error toggling bookmark:", error);
//       alert("Failed to update bookmark. Please try again.");
//     }
//   };

//   /* ========== FETCH ALL BUILDINGS ========== */
//   useEffect(() => {
//     const fetchBuildings = async () => {
//       try {
//         const response = await fetch(
//           `${BASE_URL}/api/propertiesGet/building/${buildingid}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!response.ok) throw new Error("Failed to fetch buildings");
//         const data = await response.json();

//         const buildingsArray = Array.isArray(data) ? data : [data];
//         setBuildings(buildingsArray);
//         setLoading((prev) => ({ ...prev, buildings: false }));

//         if (buildingid) {
//           const building =
//             buildingsArray.find((b) => b._id === buildingid) || data;
//           if (building) {
//             setSelectedBuilding(building);
//             setBuildingData(building);
//             if (building.photos && building.photos.length > 0) {
//               setBuildingImage(building.photos[0]);
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching buildings:", error);
//         setLoading((prev) => ({ ...prev, buildings: false }));
//       }
//     };

//     fetchBuildings();
//   }, [buildingid, token]);

//   /* ========== FETCH BUILDING DATA WHEN SELECTED ========== */
//   useEffect(() => {
//     if (!selectedBuilding) return;

//     setBuildingData(selectedBuilding);
//     setBuildingImage(selectedBuilding.photos[0]);
//   }, [selectedBuilding]);

//   /* ========== FETCH FLOORS WHEN BUILDING IS SELECTED ========== */
//   useEffect(() => {
//     const fetchFloors = async () => {
//       if (!selectedBuilding?._id) return;
//       setLoading((prev) => ({ ...prev, floors: true }));
//       try {
//         const response = await fetch(
//           `${BASE_URL}/api/properties/floors/by-building/${selectedBuilding._id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!response.ok) throw new Error("Failed to fetch floors");
//         const data = await response.json();
//         setFloors(Array.isArray(data) ? data : []);
//         setLoading((prev) => ({ ...prev, floors: false }));
//       } catch (error) {
//         console.error("Error fetching floors:", error);
//         setLoading((prev) => ({ ...prev, floors: false }));
//       }
//     };

//     fetchFloors();
//   }, [selectedBuilding, token]);

//   /* ========== FETCH UNITS WHEN FLOOR IS SELECTED ========== */
//   useEffect(() => {
//     const fetchUnits = async () => {
//       if (!selectedFloor?._id) return;
//       setLoading((prev) => ({ ...prev, units: true }));
//       try {
//         const response = await fetch(
//           `${BASE_URL}/api/properties/units/by-floor/${selectedFloor._id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!response.ok) throw new Error("Failed to fetch units");
//         const data = await response.json();
//         setUnits(data ? data : []);
//         setLoading((prev) => ({ ...prev, units: false }));
//       } catch (error) {
//         console.error("Error fetching units:", error);
//         setLoading((prev) => ({ ...prev, units: false }));
//       }
//     };

//     fetchUnits();
//   }, [selectedFloor, token]);

//   /* ========== TEXT CONTENT ========== */
//   const textPart1 = `One of our finest creations, in a neighborhood that checks all the boxes.
//     Staying at Hunters Road means you are exceptionally close to business,
//     as it's adjacent to Purasawakkam, one of the largest commercial markets in Chennai.

//     ${
//       buildingData?.buildingName || "This property"
//     } is exceptional not just in its exterior facade,
//     but equally stunning in its meticulous planning and every detail.`;

//   const textPart2 = `Only 45 bespoke residences that allow you design customisations,
//     and 8 of them come with private terraces. The project is planned as per vastu
//     around a well designed central courtyard. Tucked away from the main road,
//     your home is in a quiet and clean sanctuary. Enter the 10 ft driveway
//     and you will feel like a dream coming true.`;

//   const handleToggle = () => setIsExpanded(!isExpanded);

//   /* ========== HANDLE SELECTION CHANGES ========== */
//   const handleBuildingChange = (selectedOption) => {
//     const building = buildings.find((b) => b._id === selectedOption.value);
//     setSelectedBuilding(building);
//     setSelectedFloor(null);
//     setSelectedUnit(null);
//   };

//   const handleFloorChange = (selectedOption) => {
//     const floor = floors.find((f) => f._id === selectedOption.value);
//     setSelectedFloor(floor);
//     setSelectedUnit(null);
//   };

//   const handleUnitSelect = (unit) => {
//     if (unit.availability === "available") {
//       setSelectedUnit(unit);
//     }
//   };

//   /* ========== MODAL FUNCTIONS ========== */
//   const openModal = (imageSrc) => {
//     setModalImage(imageSrc);
//     setIsModalOpen(true);
//     setScale(1);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setModalImage(null);
//   };

//   const handleZoomIn = () => setScale((prev) => prev + 0.25);
//   const handleZoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.25));

//   /* ========== RAZORPAY PAYMENT INTEGRATION ========== */
//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => {
//         resolve(true);
//       };
//       script.onerror = () => {
//         resolve(false);
//       };
//       document.body.appendChild(script);
//     });
//   };

//   const postToLeads = async (unitId) => {
//     try {
//       const response = await fetch(`${BASE_URL}/api/leads/auto`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           unitId: unitId,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to create lead");
//       }
//       return await response.json();
//     } catch (error) {
//       console.error("Error creating lead:", error);
//       throw error;
//     }
//   };

//   const createRazorpayOrder = async () => {
//     try {
//       console.log(builderId);

//       const response = await fetch(`${BASE_URL}/api/transactions/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           amount: selectedUnit.price.totalPrice,
//           builderId: builderId,
//           propertyId: selectedUnit._id,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to create Razorpay order");
//       }

//       const data = await response.json();

//       if (!data.order || !data.order.id) {
//         throw new Error("Invalid order data received from server");
//       }

//       return data.order.id;
//     } catch (error) {
//       console.error("Error creating Razorpay order:", error);
//       throw error;
//     }
//   };

//   const verifyPayment = async (paymentData) => {
//     try {
//       const verificationData = {
//         razorpay_order_id: paymentData.razorpay_order_id,
//         razorpay_payment_id: paymentData.razorpay_payment_id,
//         razorpay_signature: paymentData.razorpay_signature,
//       };

//       const response = await fetch(`${BASE_URL}/api/transactions/verify`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(verificationData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Payment verification failed");
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Error verifying payment:", error);
//       throw error;
//     }
//   };

//   const handleBookNow = async () => {
//     if (!selectedUnit) return;
//     if (paymentProcessing) return;

//     const userData = JSON.parse(sessionStorage.getItem("logindata"));
//     if (!userData) {
//       sessionStorage.setItem("redirectPath", window.location.pathname);
//       sessionStorage.setItem("buildingId", buildingid);
//       sessionStorage.setItem("builderId", builderId);

//       navigate("/login", {
//         state: {
//           from: window.location.pathname,
//           buildingId: buildingid,
//           builderId: builderId,
//         },
//       });
//       return;
//     }

//     setPaymentProcessing(true);

//     try {
//       const bookingResponse = await fetch(`${BASE_URL}/api/booking`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userData.token}`,
//         },
//         body: JSON.stringify({
//           unitId: selectedUnit._id,
//         }),
//       });

//       if (!bookingResponse.ok) {
//         throw new Error("Booking failed");
//       }

//       const razorpayLoaded = await loadRazorpayScript();
//       if (!razorpayLoaded) {
//         throw new Error("Razorpay SDK failed to load");
//       }

//       const orderId = await createRazorpayOrder();

//       const options = {
//         key: "rzp_test_E0aQEsxCsOjngr",
//         amount: selectedUnit.price.totalPrice,
//         currency: "INR",
//         name: "ABV Properties",
//         description: `Booking for Unit ${selectedUnit.unitNumber}`,
//         order_id: orderId,
//         handler: async function (response) {
//           try {
//             console.log("Full Razorpay response:", response);

//             const isVerified = await verifyPayment({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//             });

//             if (isVerified) {
//               setBookingSuccess(true);
//               navigate("/popperpage", {
//                 state: {
//                   paymentSuccess: true,
//                   unitDetails: selectedUnit,
//                 },
//               });
//             } else {
//               await postToLeads(selectedUnit._id);
//               alert("Payment verification failed. Please contact support.");
//             }
//           } catch (error) {
//             console.error("Payment processing error:", error);
//             await postToLeads(selectedUnit._id);
//             alert(`Payment failed: ${error.message}`);
//           } finally {
//             setPaymentProcessing(false);
//           }
//         },
//         prefill: {
//           name: "Customer Name",
//           email: "customer@example.com",
//           contact: "9999999999",
//         },
//         theme: {
//           color: "#FAE696",
//         },
//       };

//       const rzp = new window.Razorpay(options);

//       rzp.on("payment.failed", async function (response) {
//         console.error("Payment Failed:", response.error);
//         try {
//           await postToLeads(selectedUnit._id);
//           alert(`Payment failed: ${response.error.description}`);
//         } catch (error) {
//           console.error("Error creating lead after payment failure:", error);
//           alert(
//             "Payment failed and we couldn't save your interest. Please contact support."
//           );
//         } finally {
//           setPaymentProcessing(false);
//         }
//       });

//       rzp.open();
//     } catch (error) {
//       console.error("Error in booking/payment processing:", error);
//       try {
//         await postToLeads(selectedUnit._id);
//       } catch (leadError) {
//         console.error("Error creating lead:", leadError);
//       }
//       alert(`An error occurred: ${error.message}`);
//     } finally {
//       setPaymentProcessing(false);
//     }
//   };

//   const customSelectStyles = {
//     control: (provided) => ({
//       ...provided,
//       borderColor: "#D1D5DB",
//       "&:hover": {
//         borderColor: "#F59E0B",
//       },
//       boxShadow: "none",
//       minHeight: "40px",
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected ? "#F59E0B" : "white",
//       color: state.isSelected ? "white" : "#4B5563",
//       "&:hover": {
//         backgroundColor: "#FBBF24",
//         color: "white",
//       },
//     }),
//     menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//   };

//   const getUnitsForFloorPlan = () => {
//     if (!units.length || !selectedFloor?.coordinates) return [];

//     return units.map((unit) => ({
//       id: unit._id,
//       label: unit.unitNumber,
//       available: unit.availability === "available",
//       price: unit.price?.totalPrice,
//       area: unit.sizeSqFt,
//       type: unit.bhkType,
//       coordinates: selectedFloor.coordinates[unit.unitNumber],
//     }));
//   };

//   const isBookmarked =selectedUnit && bookmarks.some((b) => b.unitId === selectedUnit._id);

//   return (
//     <div className="mx-auto bg-white">
//       {/* Top Section */}
//       <div className="mx-auto p-4 flex flex-col lg:flex-row gap-6 bg-white items-start">
//         {/* Left: Building image */}
//         <div
//           className="relative overflow-hidden"
//           style={{ width: "800px", height: "500px" }}
//         >
//           {buildingImage ? (
//             <img
//               src={buildingImage}
//               alt={buildingData?.buildingName || "Building"}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//               {loading.building ? "Loading image..." : "No image available"}
//             </div>
//           )}
//         </div>

//         {/* RIGHT: Building details */}
//         <div
//           className="relative p-6 flex flex-col bg-white"
//           style={{
//             width: "800px",
//             height: "500px",
//             overflowY: isExpanded ? "auto" : "hidden",
//           }}
//         >
//           <div className="flex items-center mb-4">
//             <span className="text-yellow-600 uppercase font-semibold tracking-wide text-sm mr-2">
//               About
//             </span>
//             <div className="flex-1 h-px bg-yellow-600" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-snug">
//             {buildingData?.buildingName || "Loading..."} - Price, Floor Plans,
//             Reviews
//           </h2>

//           <div className="text-sm text-gray-700 leading-relaxed">
//             {textPart1
//               .split("\n")
//               .filter((p) => p.trim().length > 0)
//               .map((paragraph, idx) => (
//                 <p key={idx} className="mb-4 last:mb-0">
//                   {paragraph.trim()}
//                 </p>
//               ))}
//             {isExpanded && (
//               <div className="mt-4">
//                 {textPart2
//                   .split("\n")
//                   .filter((p) => p.trim().length > 0)
//                   .map((paragraph, idx) => (
//                     <p key={idx} className="mb-4 last:mb-0">
//                       {paragraph.trim()}
//                     </p>
//                   ))}
//               </div>
//             )}
//           </div>
//           <button
//             onClick={handleToggle}
//             className="mt-4 text-[#C8A158] font-medium hover:underline self-start"
//           >
//             {isExpanded ? "Read Less" : "Read More"}
//           </button>
//         </div>
//       </div>

//       {/* ========== FLOOR SELECTION SECTION ========== */}
//       <div className="max-w-6xl mx-auto my-10 px-4 flex flex-col md:flex-row gap-6 justify-center">
//         {/* LEFT: Floor Plan */}
//         <div className="md:w-2/3 bg-orange-50 shadow-md rounded-lg p-6">
//           <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
//             Select Available Spaces
//           </h2>

//           {/* BUILDING DROPDOWN */}
//           <div className="w-full mb-4">
//             <Select
//               options={buildings.map((building) => ({
//                 value: building._id,
//                 label: building.buildingName,
//               }))}
//               value={
//                 selectedBuilding
//                   ? {
//                       value: selectedBuilding._id,
//                       label: selectedBuilding.buildingName,
//                     }
//                   : null
//               }
//               onChange={handleBuildingChange}
//               placeholder={
//                 loading.buildings ? "Loading buildings..." : "Select Building"
//               }
//               isDisabled={loading.buildings || buildings.length === 0}
//               styles={customSelectStyles}
//               menuPortalTarget={document.body}
//             />
//           </div>

//           {/* FLOOR DROPDOWN */}
//           <div className="flex flex-col sm:flex-row gap-4 mb-6">
//             <div className="w-full">
//               <Select
//                 options={floors.map((floor) => ({
//                   value: floor._id,
//                   label: `Floor ${floor.floorNumber}`,
//                 }))}
//                 value={
//                   selectedFloor
//                     ? {
//                         value: selectedFloor._id,
//                         label: `Floor ${selectedFloor.floorNumber}`,
//                       }
//                     : null
//                 }
//                 onChange={handleFloorChange}
//                 placeholder={
//                   loading.floors ? "Loading floors..." : "Select Floor"
//                 }
//                 isDisabled={
//                   loading.floors || floors.length === 0 || !selectedBuilding
//                 }
//                 styles={customSelectStyles}
//                 menuPortalTarget={document.body}
//               />
//             </div>
//           </div>

//           {/* Show the Floor Plan with Units */}
//           <div className="relative">
//             {selectedFloor ? (
//               loading.units ? (
//                 <div className="h-64 flex items-center justify-center">
//                   Loading units...
//                 </div>
//               ) : units.length > 0 ? (
//                 <div className="relative">
//                   <Page
//                     onAreaSelect={handleUnitSelect}
//                     spaces={getUnitsForFloorPlan()}
//                     units={units}
//                     floorPlanImage={selectedFloor.image}
//                   />
//                 </div>
//               ) : (
//                 <div className="h-64 flex items-center justify-center text-gray-500">
//                   No units available for this floor
//                 </div>
//               )
//             ) : (
//               <div className="h-64 flex items-center justify-center text-gray-500">
//                 {!selectedBuilding
//                   ? "Please select a building first"
//                   : floors.length === 0 && !loading.floors
//                   ? "No floors available for this building"
//                   : "Please select a floor to view units"}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* RIGHT: Details Card */}
//         <div
//           className="md:w-1/3 border border-orange-100 bg-[#FFF8ED] rounded-lg shadow-sm"
//           style={{ height: "500px" }}
//         >
//           <div className="h-full w-full p-6 overflow-y-auto">
//             {selectedUnit ? (
//               <>
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-2xl font-bold text-orange-600">
//                     {selectedUnit.unitNumber}
//                   </h3>
//                   {isBookmarked ? (
//                     <IoMdBookmark
//                       className="text-2xl text-black-500 cursor-pointer"
//                       onClick={toggleBookmark}
//                     />
//                   ) : (
//                     <CiBookmark
//                       className="cursor-pointer text-2xl"
//                       onClick={toggleBookmark}
//                     />
//                   )}
//                 </div>
//                 <div className="space-y-3">
//                   <div className="flex items-center">
//                     <FaMapMarkerAlt className="text-yellow-600 mr-2" />
//                     <span>Location: {selectedUnit?.facing || "N/A"}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaMoneyBillWave className="text-yellow-600 mr-2" />
//                     <span>
//                       Price: ₹{selectedUnit.price.totalPrice || "N/A"}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaRulerCombined className="text-yellow-600 mr-2" />
//                     <span>
//                       Size: {selectedUnit.price.pricePerSqft || "N/A"} Sq.Ft
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaHome className="text-yellow-600 mr-2" />
//                     <span>Type: {selectedUnit.bhkType || "N/A"}</span>
//                   </div>

//                   {selectedUnit?.photos && (
//                     <img
//                       src={selectedUnit.photos[0].url}
//                       alt={`Floor ${selectedFloor.floorNumber} Plan`}
//                       className="mt-4 w-full h-auto object-cover max-h-40 border-2 border-[#C8A158] cursor-pointer"
//                       onClick={() => openModal(selectedUnit.image)}
//                     />
//                   )}
//                 </div>

//                 <button
//                   onClick={handleBookNow}
//                   disabled={paymentProcessing}
//                   className={`mt-6 px-6 py-2 ${
//                     paymentProcessing ? "bg-gray-400" : "bg-[#FAE696]"
//                   } text-black font-semibold rounded hover:bg-[#C8A158]/90 uppercase w-full`}
//                 >
//                   {paymentProcessing ? "Processing..." : "Book Now"}
//                 </button>
//               </>
//             ) : (
//               <>
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-2xl font-bold text-orange-600">
//                     {selectedBuilding?.buildingName || "Select a Building"}
//                   </h3>
//                   {bookmarks.includes(buildingid) ? (
//                     <IoMdBookmark
//                       className="text-2xl text-black-500 cursor-pointer"
//                       onClick={toggleBookmark}
//                     />
//                   ) : (
//                     <CiBookmark
//                       className="cursor-pointer text-2xl"
//                       onClick={toggleBookmark}
//                     />
//                   )}
//                 </div>
//                 <div className="space-y-3">
//                   <div className="flex items-center">
//                     <FaMapMarkerAlt className="text-yellow-600 mr-2" />
//                     <span>
//                       Location: {selectedBuilding?.buildingArea || "N/A"}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaMoneyBillWave className="text-yellow-600 mr-2" />
//                     <span>
//                       Price Range: {selectedBuilding?.priceRange || "N/A"}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaRulerCombined className="text-yellow-600 mr-2" />
//                     <span>
//                       Total Units: {selectedFloor?.totalUnits || "N/A"}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaBuilding className="text-yellow-600 mr-2" />
//                     <span>Type: {selectedBuilding?.type || "N/A"}</span>
//                   </div>
//                 </div>
//                 <p className="mt-4 text-gray-700">
//                   {selectedFloor
//                     ? "Click on an available unit in the floor plan to view details and book."
//                     : selectedBuilding
//                     ? "Select a floor to view available units."
//                     : "Select a building to get started."}
//                 </p>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ========== MODAL FOR IMAGE ZOOM ========== */}
//       {isModalOpen && modalImage && (
//         <div
//           className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60"
//           onClick={closeModal}
//         >
//           <div
//             className="relative bg-white p-4 rounded shadow-md max-w-4xl w-full h-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-2 right-2 text-black font-bold text-xl"
//               onClick={closeModal}
//             >
//               &times;
//             </button>
//             <div className="flex justify-center mb-2 space-x-4">
//               <button
//                 onClick={handleZoomOut}
//                 className="bg-gray-200 px-3 py-1 rounded font-semibold hover:bg-gray-300"
//               >
//                 -
//               </button>
//               <button
//                 onClick={handleZoomIn}
//                 className="bg-gray-200 px-3 py-1 rounded font-semibold hover:bg-gray-300"
//               >
//                 +
//               </button>
//             </div>
//             <div className="flex justify-center items-center overflow-auto">
//               <img
//                 src={modalImage}
//                 alt="Floor Plan Zoom"
//                 style={{
//                   transform: `scale(${scale})`,
//                   transition: "transform 0.3s ease",
//                 }}
//                 className="max-h-[80vh] object-contain"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       <KeyAmenities />
//     </div>
//   );
// }

// export default ArihantPage;




import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  FaCheck,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaRulerCombined,
  FaHome,
  FaBuilding,
} from "react-icons/fa";
import Page from "./Page";
import { useLocation, useNavigate } from "react-router-dom";
import KeyAmenities from "../PropertyInnerPage/KeyAmenities";
import { IoMdBookmark } from "react-icons/io";
import BASE_URL from "../../service/api";


function ArihantPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // State for property selection
  const [buildingid, setBuildingid] = useState(
    location.state?.propertyId || sessionStorage.getItem("propertyId") || ""
  );
  const [builderId, setBuilderId] = useState(
    location.state?.builderId || sessionStorage.getItem("builderId") || ""
  );
  const [selectedUnitId, setSelectedUnitId] = useState(
    location.state?.unitId || sessionStorage.getItem("unitId") || null
  );

  // Property data states
  const [buildingData, setBuildingData] = useState(null);
  const [buildingImage, setBuildingImage] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);

  // UI states
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState({
    buildings: true,
    building: true,
    floors: false,
    units: false,
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarkActionLoading, setBookmarkActionLoading] = useState(false);

  // Loan calculator state
  const [showLoanCalculator, setShowLoanCalculator] = useState(false);
  const toggleLoanCalculator = () => {
    setShowLoanCalculator(!showLoanCalculator);
  };

  // Authentication and bookmark states
  const [token, setToken] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [validationMessages, setValidationMessages] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: 'India',
    address: '',
    city: '',
    zipCode: '',
    email: '',
    phone: '',
    note: '',
  });
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    phone: '',
    email: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  const extractErrorMessage = (error) => {
    if (error.response && error.response.data) {
      const { data } = error.response;
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (data.errors) {
        if (Array.isArray(data.errors)) return data.errors[0];
        if (typeof data.errors === 'object') {
          return Object.values(data.errors)[0] || 'An unexpected error occurred';
        }
      }
    }
    return error.message || 'An unexpected error occurred. Please try again.';
  };

  // Persist state to sessionStorage
  useEffect(() => {
    if (buildingid) sessionStorage.setItem("buildingId", buildingid);
    if (builderId) sessionStorage.setItem("builderId", builderId);
    if (selectedUnitId) sessionStorage.setItem("unitId", selectedUnitId);
  }, [buildingid, builderId, selectedUnitId]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("buildingId");
      sessionStorage.removeItem("builderId");
      sessionStorage.removeItem("unitId");
    };
  }, []);

  // Get user token
  useEffect(() => {
    const usertoken = JSON.parse(sessionStorage.getItem("logindata"));
    if (usertoken) {
      setToken(usertoken?.token);
    }
  }, []);

  /* ========== BOOKMARK FUNCTIONALITY ========== */
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!token || !selectedUnit?._id) return;
      setBookmarkLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/saved-property`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setBookmarks(data);
          const isUnitBookmarked = data.some(
            (b) => b.unit?._id === selectedUnit._id
          );
          setIsBookmarked(isUnitBookmarked);
        } else if (response.status === 401) {
          sessionStorage.removeItem("logindata");
          navigate("/login", {
            state: {
              from: window.location.pathname,
              buildingId: buildingid,
              builderId: builderId,
              unitId: selectedUnit?._id || null,
            },
          });
        } else {
          console.error(
            "Failed to fetch bookmarks:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error.message);
      } finally {
        setBookmarkLoading(false);
      }
    };

    fetchBookmarks();
  }, [token, selectedUnit?._id, navigate, buildingid, builderId]);

  const toggleBookmark = async () => {
    const userData = JSON.parse(sessionStorage.getItem('logindata'));
    if (!userData) {
      sessionStorage.setItem('redirectPath', window.location.pathname);
      sessionStorage.setItem('buildingId', buildingid);
      sessionStorage.setItem('builderId', builderId);
      if (selectedUnit) {
        sessionStorage.setItem('unitId', selectedUnit._id);
      }
      setValidationMessages((prev) => [
        ...prev,
        { text: 'Please log in to bookmark a unit.', type: 'error' },
      ]);
      navigate('/login', {
        state: {
          from: window.location.pathname,
          buildingId: buildingid,
          builderId: builderId,
          unitId: selectedUnit?._id || null,
        },
      });
      return;
    }

    if (!selectedUnit?._id) {
      setValidationMessages((prev) => [
        ...prev,
        { text: 'Please select a unit to bookmark.', type: 'error' },
      ]);
      return;
    }

    setBookmarkActionLoading(true);

    try {
      const existingBookmark = bookmarks.find(
        (bookmark) => bookmark.unit?._id === selectedUnit._id
      );

      if (existingBookmark?._id) {
        // Unbookmark - DELETE request
        const response = await fetch(
          `${BASE_URL}/api/saved-property/${existingBookmark._id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setBookmarks(bookmarks.filter((b) => b._id !== existingBookmark._id));
          setIsBookmarked(false);
          setValidationMessages((prev) => [
            ...prev,
            { text: 'Unit removed from bookmarks.', type: 'success' },
          ]);
        } else if (response.status === 401) {
          setValidationMessages((prev) => [
            ...prev,
            { text: 'Unauthorized access. Please log in again.', type: 'error' },
          ]);
          sessionStorage.removeItem('logindata');
          navigate('/login', {
            state: {
              from: window.location.pathname,
              buildingId: buildingid,
              builderId: builderId,
              unitId: selectedUnit._id,
            },
          });
        } else {
          const errorData = await response.json().catch(() => ({}));
          setValidationMessages((prev) => [
            ...prev,
            { text: extractErrorMessage({ response: { data: errorData } }), type: 'error' },
          ]);
        }
      } else {
        // Bookmark - POST request
        const response = await fetch(`${BASE_URL}/api/saved-property`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            unitId: selectedUnit._id,
          }),
        });

        if (response.ok) {
          const savedProperty = await response.json();
          setBookmarks([...bookmarks, savedProperty]);
          setIsBookmarked(true);
          setValidationMessages((prev) => [
            ...prev,
            { text: 'Unit added to bookmarks.', type: 'success' },
          ]);
        } else if (response.status === 400 && (await response.json()).message === 'Already saved') {
          setIsBookmarked(true);
          setValidationMessages((prev) => [
            ...prev,
            { text: 'Unit is already bookmarked.', type: 'error' },
          ]);
        } else if (response.status === 401) {
          setValidationMessages((prev) => [
            ...prev,
            { text: 'Unauthorized access. Please log in again.', type: 'error' },
          ]);
          sessionStorage.removeItem('logindata');
          navigate('/login', {
            state: {
              from: window.location.pathname,
              buildingId: buildingid,
              builderId: builderId,
              unitId: selectedUnit._id,
            },
          });
        } else {
          const errorData = await response.json().catch(() => ({}));
          setValidationMessages((prev) => [
            ...prev,
            { text: extractErrorMessage({ response: { data: errorData } }), type: 'error' },
          ]);
        }
      }
    } catch (error) {
      setValidationMessages((prev) => [
        ...prev,
        { text: extractErrorMessage(error), type: 'error' },
      ]);
    } finally {
      setBookmarkActionLoading(false);
      if (token && selectedUnit?._id) {
        try {
          const response = await fetch(`${BASE_URL}/api/saved-property`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setBookmarks(data);
            const isUnitBookmarked = data.some(
              (b) => b.unit?._id === selectedUnit._id
            );
            setIsBookmarked(isUnitBookmarked);
          }
        } catch (fetchError) {
          setValidationMessages((prev) => [
            ...prev,
            { text: extractErrorMessage(fetchError), type: 'error' },
          ]);
        }
      }
    }
  };

  /* ========== PROPERTY DATA FETCHING ========== */
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/propertiesGet/building/${buildingid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          setValidationMessages((prev) => [
            ...prev,
            { text: `Failed to fetch buildings: ${response.statusText}`, type: 'error' },
          ]);
          throw new Error('Failed to fetch buildings');
        }
        const data = await response.json();

        const buildingsArray = Array.isArray(data) ? data : [data];
        setBuildings(buildingsArray);
        setLoading((prev) => ({ ...prev, buildings: false }));

        if (buildingid) {
          const building =
            buildingsArray.find((b) => b._id === buildingid) || data;
          if (building) {
            setSelectedBuilding(building);
            setBuildingData(building);
            if (building.photos && building.photos.length > 0) {
              setBuildingImage(building.photos[0]);
            }
          }
        }
      } catch (error) {
        setValidationMessages((prev) => [
          ...prev,
          { text: extractErrorMessage(error), type: 'error' },
        ]);
        setLoading((prev) => ({ ...prev, buildings: false }));
      }
    };

    fetchBuildings();
  }, [buildingid, token]);

  useEffect(() => {
    if (!selectedBuilding) return;
    setBuildingData(selectedBuilding);
    setBuildingImage(selectedBuilding.photos[0]);
  }, [selectedBuilding]);

  useEffect(() => {
    const fetchFloors = async () => {
      if (!selectedBuilding?._id) return;
      setLoading((prev) => ({ ...prev, floors: true }));
      try {
        const response = await fetch(
          `${BASE_URL}/api/properties/floors/by-building/${selectedBuilding._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          setValidationMessages((prev) => [
            ...prev,
            { text: `Failed to fetch floors: ${response.statusText}`, type: 'error' },
          ]);
          throw new Error('Failed to fetch floors');
        }
        const data = await response.json();
        setFloors(Array.isArray(data) ? data : []);
        setLoading((prev) => ({ ...prev, floors: false }));
      } catch (error) {
        setValidationMessages((prev) => [
          ...prev,
          { text: extractErrorMessage(error), type: 'error' },
        ]);
        setLoading((prev) => ({ ...prev, floors: false }));
      }
    };

    fetchFloors();
  }, [selectedBuilding, token]);

  useEffect(() => {
    const fetchUnits = async () => {
      if (!selectedFloor?._id) return;
      setLoading((prev) => ({ ...prev, units: true }));
      try {
        const response = await fetch(
          `${BASE_URL}/api/properties/units/by-floor/${selectedFloor._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          setValidationMessages((prev) => [
            ...prev,
            { text: `Failed to fetch units: ${response.statusText}`, type: 'error' },
          ]);
          throw new Error('Failed to fetch units');
        }
        const data = await response.json();
        setUnits(data ? data : []);
        setLoading((prev) => ({ ...prev, units: false }));
      } catch (error) {
        setValidationMessages((prev) => [
          ...prev,
          { text: extractErrorMessage(error), type: 'error' },
        ]);
        setLoading((prev) => ({ ...prev, units: false }));
      }
    };

    fetchUnits();
  }, [selectedFloor, token]);

  /* ========== ERROR MESSAGE ========== */
  useEffect(() => {
    if (validationMessages.length > 0) {
      const timer = setTimeout(() => {
        setValidationMessages([]);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [validationMessages]);

  /* ========== UI HANDLERS ========== */
  const handleToggle = () => setIsExpanded(!isExpanded);

  const handleBuildingChange = (selectedOption) => {
    const building = buildings.find((b) => b._id === selectedOption.value);
    setSelectedBuilding(building);
    setSelectedFloor(null);
    setSelectedUnit(null);
    setIsBookmarked(false);
  };

  const handleFloorChange = (selectedOption) => {
    const floor = floors.find((f) => f._id === selectedOption.value);
    setSelectedFloor(floor);
    setSelectedUnit(null);
    setIsBookmarked(false);
  };

  const handleUnitSelect = (unit) => {
    if (unit.availability === "available") {
      setSelectedUnit(unit);
    }
  };

  /* ========== IMAGE MODAL ========== */
  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
    setIsModalOpen(true);
    setScale(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  const handleZoomIn = () => setScale((prev) => prev + 0.25);
  const handleZoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.25));

  /* ========== PAYMENT INTEGRATION ========== */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const postToLeads = async (unitId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/leads/auto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          unitId: unitId,
        }),
      });

      if (!response.ok) {
        setValidationMessages((prev) => [
          ...prev,
          { text: `Failed to create lead: ${response.statusText}`, type: 'error' },
        ]);
        throw new Error('Failed to create lead');
      }
      return await response.json();
    } catch (error) {
      setValidationMessages((prev) => [
        ...prev,
        { text: extractErrorMessage(error), type: 'error' },
      ]);
      throw error;
    }
  };

  const createRazorpayOrder = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/transactions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: selectedUnit.price.totalPrice,
          builderId: builderId,
          propertyId: selectedUnit._id,
        }),
      });

      if (response.status === 409) {
        setValidationMessages((prev) => [
          ...prev,
          { text: 'This property already has a transaction and cannot be booked again.', type: 'error' },
        ]);
        throw new Error('This property already has a transaction and cannot be booked again');
      }

      if (!response.ok) {
        setValidationMessages((prev) => [
          ...prev,
          { text: `Failed to create Razorpay order: ${response.statusText}`, type: 'error' },
        ]);
        throw new Error('Failed to create Razorpay order');
      }

      const data = await response.json();

      if (!data.order || !data.order.id) {
        setValidationMessages((prev) => [
          ...prev,
          { text: 'Invalid order data received from server.', type: 'error' },
        ]);
        throw new Error('Invalid order data received from server');
      }

      return data.order.id;
    } catch (error) {
      setValidationMessages((prev) => [
        ...prev,
        { text: extractErrorMessage(error), type: 'error' },
      ]);
      throw error;
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      const verificationData = {
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
      };

      const response = await fetch(`${BASE_URL}/api/transactions/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(verificationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setValidationMessages((prev) => [
          ...prev,
          { text: errorData.message || 'Payment verification failed.', type: 'error' },
        ]);
        throw new Error(errorData.message || 'Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      setValidationMessages((prev) => [
        ...prev,
        { text: extractErrorMessage(error), type: 'error' },
      ]);
      throw error;
    }
  };

  const handleBookNow = async () => {
    if (!selectedUnit) {
      setValidationMessages((prev) => [
        ...prev,
        { text: 'Please select a unit to book.', type: 'error' },
      ]);
      return;
    }
    if (paymentProcessing) return;

    const userData = JSON.parse(sessionStorage.getItem('logindata'));
    if (!userData) {
      sessionStorage.setItem('redirectPath', window.location.pathname);
      sessionStorage.setItem('buildingId', buildingid);
      sessionStorage.setItem('builderId', builderId);
      setValidationMessages((prev) => [
        ...prev,
        { text: 'Please log in to book a unit.', type: 'error' },
      ]);
      navigate('/login', {
        state: {
          from: window.location.pathname,
          buildingId: buildingid,
          builderId: builderId,
        },
      });
      return;
    }

    setPaymentProcessing(true);

    try {
      const bookingResponse = await fetch(`${BASE_URL}/api/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          unitId: selectedUnit._id,
        }),
      });

      if (bookingResponse.status === 409) {
        setValidationMessages((prev) => [
          ...prev,
          { text: 'This unit has already been booked by a customer.', type: 'error' },
        ]);
        await postToLeads(selectedUnit._id);
        setPaymentProcessing(false);
        return;
      }

      if (!bookingResponse.ok) {
        setValidationMessages((prev) => [
          ...prev,
          { text: `Booking failed: ${bookingResponse.statusText}`, type: 'error' },
        ]);
        setPaymentProcessing(false);
        throw new Error('Booking failed');
      }

      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        setValidationMessages((prev) => [
          ...prev,
          { text: 'Razorpay SDK failed to load.', type: 'error' },
        ]);
        setPaymentProcessing(false);
        throw new Error('Razorpay SDK failed to load');
      }

      const orderId = await createRazorpayOrder();

      const options = {
        key: 'rzp_test_E0aQEsxCsOjngr',
        amount: selectedUnit.price.totalPrice,
        currency: 'INR',
        name: 'ABV Properties',
        description: `Booking for Unit ${selectedUnit.unitNumber}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const isVerified = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (isVerified) {
              setBookingSuccess(true);
              setValidationMessages((prev) => [
                ...prev,
                { text: 'Payment successful! Booking confirmed.', type: 'success' },
              ]);
              navigate('/popperpage', {
                state: {
                  paymentSuccess: true,
                  unitDetails: selectedUnit,
                },
              });
            } else {
              await postToLeads(selectedUnit._id);
              setValidationMessages((prev) => [
                ...prev,
                { text: 'Payment verification failed. Please contact support.', type: 'error' },
              ]);
            }
          } catch (error) {
            await postToLeads(selectedUnit._id);
            setValidationMessages((prev) => [
              ...prev,
              { text: `Payment failed: ${extractErrorMessage(error)}`, type: 'error' },
            ]);
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#FAE696',
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', async function (response) {
        try {
          await postToLeads(selectedUnit._id);
          setValidationMessages((prev) => [
            ...prev,
            { text: `Payment failed: ${response.error.description}`, type: 'error' },
          ]);
        } catch (error) {
          setValidationMessages((prev) => [
            ...prev,
            { text: 'Payment failed and we couldn’t save your interest. Please contact support.', type: 'error' },
          ]);
        } finally {
          setPaymentProcessing(false);
        }
      });

      rzp.open();
    } catch (error) {
      setValidationMessages((prev) => [
        ...prev,
        { text: extractErrorMessage(error), type: 'error' },
      ]);
      setPaymentProcessing(false);
    }
  };

  /* ========== HELPER FUNCTIONS ========== */
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "black",
      backgroundColor: "white",
      color: "black",
      "&:hover": {
        borderColor: "black",
      },
      boxShadow: "none",
      minHeight: "40px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "black" : "white",
      color: state.isSelected ? "white" : "#4B5563",
      "&:hover": {
        backgroundColor: "white",
        color: "black",
      },
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const getUnitsForFloorPlan = () => {
    if (!units.length || !selectedFloor?.coordinates) return [];

    return units.map((unit) => ({
      id: unit._id,
      label: unit.unitNumber,
      available: unit.availability === "available",
      price: unit.price?.totalPrice,
      area: unit.sizeSqFt,
      type: unit.bhkType,
      coordinates: selectedFloor.coordinates[unit.unitNumber],
    }));
  };

  /* ========== FORM FUNCTION ========== */
  const validateName = (name) => /^[A-Za-z\s]+$/.test(name);
  const validateText = (text) => /^[A-Za-z0-9\s,.]+$/.test(text);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  const validateForm = () => {
    const errors = [];
    const newFieldErrors = { ...fieldErrors };

    if (!formData.firstName.trim()) {
      newFieldErrors.firstName = 'First name is required';
      errors.push('First name is required');
    }

    if (!formData.lastName.trim()) {
      newFieldErrors.lastName = 'Last name is required';
      errors.push('Last name is required');
    }

    if (!formData.address.trim()) {
      newFieldErrors.address = 'Address is required';
      errors.push('Address is required');
    }

    if (!formData.city.trim()) {
      newFieldErrors.city = 'City is required';
      errors.push('City is required');
    }

    if (!formData.phone.trim()) {
      newFieldErrors.phone = 'Phone is required';
      errors.push('Phone is required');
    } else if (!validatePhone(formData.phone)) {
      newFieldErrors.phone = 'Invalid Indian phone number';
      errors.push('Invalid Indian phone number');
    }

    if (!formData.email.trim()) {
      newFieldErrors.email = 'Email is required';
      errors.push('Email is required');
    } else if (!validateEmail(formData.email)) {
      newFieldErrors.email = 'Invalid email format';
      errors.push('Invalid email format');
    }

    setFieldErrors(newFieldErrors);
    return errors;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let error = '';
    let processedValue = value;

    switch(name) {
      case 'firstName':
      case 'lastName':
        if (value && !validateName(value)) {
          error = 'Only letters and spaces allowed';
        }
        break;
      case 'address':
      case 'city':
      case 'country':
        if (value && !validateText(value)) {
          error = 'Only letters, numbers, spaces, commas and periods allowed';
        }
        break;
      case 'phone':
        processedValue = value.replace(/[^0-9]/g, '');
        if (processedValue && !validatePhone(processedValue)) {
          error = 'Must be 10 digits starting with 6-9';
        }
        break;
      case 'email':
        if (value && !validateEmail(value)) {
          error = 'Please enter a valid email';
        }
        break;
    }

    setFieldErrors(prev => ({ ...prev, [name]: error }));
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setValidationMessages(validationErrors.map(text => ({ text, type: 'error' })));
      return;
    }

    setFormSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL}/api/bookingform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Submission failed');

      const data = await response.json();
      setValidationMessages([{ text: 'Booking submitted successfully!', type: 'success' }]);

      setFormData({
        firstName: '',
        lastName: '',
        country: 'India',
        address: '',
        city: '',
        zipCode: '',
        email: '',
        phone: '',
        note: ''
      });
      setFieldErrors({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        phone: '',
        email: ''
      });
    } catch (error) {
      setValidationMessages([{ text: extractErrorMessage(error), type: 'error' }]);
    } finally {
      setFormSubmitting(false);
    }
  };

  /* ========== TEXT CONTENT ========== */
  const textPart1 = `One of our finest creations, in a neighborhood that checks all the boxes.
    Staying at Hunters Road means you are exceptionally close to business,
    as it's adjacent to Purasawakkam, one of the largest commercial markets in Chennai.

    ${
      buildingData?.buildingName || "This property"
    } is exceptional not just in its exterior facade,
    but equally stunning in its meticulous planning and every detail.`;

  const textPart2 = `Only 45 bespoke residences that allow you design customisations,
    and 8 of them come with private terraces. The project is planned as per vastu
    around a well designed central courtyard. Tucked away from the main road,
    your home is in a quiet and clean sanctuary. Enter the 10 ft driveway
    and you will feel like a dream coming true.`;

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      {/* Validation Messages */}
      {validationMessages.length > 0 && (
        <div className="fixed top-4 right-4 space-y-2 z-50" aria-live="polite">
          {validationMessages.map((message, index) => (
            <div
              key={index}
              className={`border-l-4 p-4 rounded shadow-md flex justify-between items-center ${
                message.type === 'success'
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'bg-red-100 border-red-500 text-red-700'
              }`}
              role="alert"
            >
              <p>{message.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Top Section */}
      <div className="text-3xl sm:text-4xl md:text-5xl font-semibold  pt-6 mb-6">
        About {buildingData?.buildingName || "Loading..."}
      </div>

      {/* Image and Description Section */}
      <div className="flex flex-col lg:flex-row gap-12 mb-10">
        <div className="w-full lg:w-1/2">
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-3xl">
            {buildingImage ? (
              <img
                src={buildingImage}
                alt={buildingData?.buildingName || "Building"}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex justify-center items-center w-full h-full bg-gray-200">
                {loading.building ? "Loading image..." : "No image available"}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-auto pl-12 p-4">
          <div className="text-sm leading-relaxed text-gray-700">
            {textPart1
              .split("\n")
              .filter((p) => p.trim().length > 0)
              .map((paragraph, idx) => (
                <p key={idx} className="mb-4 last:mb-0">
                  {paragraph.trim()}
                </p>
              ))}
            {isExpanded && (
              <div className="mt-4">
                {textPart2
                  .split("\n")
                  .filter((p) => p.trim().length > 0)
                  .map((paragraph, idx) => (
                    <p key={idx} className="mb-4 last:mb-0">
                      {paragraph.trim()}
                    </p>
                  ))}
              </div>
            )}
          </div>
          <button
            onClick={handleToggle}
            className="mt-4 text-black font-medium hover:underline"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        </div>
      </div>

      {/* Selection and Details Section */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        <div className="w-full lg:w-1/2">
        <div className="mb-4">
          <div className="bg-white rounded-lg p-6 shadow-md border-2 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
              Select Available Spaces
            </h2>
            {/* Building Selector */}
            <div className="mb-4">
              <Select
                options={buildings.map((building) => ({
                  value: building._id,
                  label: building.buildingName,
                }))}
                value={
                  selectedBuilding
                    ? {
                        value: selectedBuilding._id,
                        label: selectedBuilding.buildingName,
                      }
                    : null
                }
                onChange={handleBuildingChange}
                placeholder={
                  loading.buildings ? "Loading buildings..." : "Select Building"
                }
                isDisabled={loading.buildings || buildings.length === 0}
                styles={customSelectStyles}
                menuPortalTarget={document.body}
              />
            </div>
            </div>

            {/* Floor Selector */}
                      <div className="bg-white rounded-lg p-6 shadow-md border-2">

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
                Select Floor
              </h3>
              {loading.floors ? (
                <div className="flex justify-center items-center h-16">
                  Loading floors...
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {floors.length > 0 ? (
                    floors.map((floor) => (
                      <div
                        key={floor._id}
                        onClick={() => handleFloorChange({ value: floor._id, label: `Floor ${floor.floorNumber}` })}
                        className={`p-2 border rounded-lg cursor-pointer text-center transition-all ${
                          selectedFloor?._id === floor._id
                          ? 'border-black bg-black text-white hover:border-black'
                          :'border-black bg-white text-black font-medium hover:bg-black hover:text-white'
                        }`}
                      >
                        Floor {floor.floorNumber}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-gray-500 py-4">
                      {selectedBuilding ? "No floors available for this building" : "Please select a building first"}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Floor Plan */}
            <div className="relative w-full">
              {selectedFloor ? (
                loading.units ? (
                  <div className="flex justify-center items-center h-64">
                    Loading units...
                  </div>
                ) : units.length > 0 ? (
                  <div className="relative">
                    <Page
                      onAreaSelect={handleUnitSelect}
                      spaces={getUnitsForFloorPlan()}
                      units={units}
                      floorPlanImage={selectedFloor.image}
                    />
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-64 text-gray-500">
                    No units available for this floor
                  </div>
                )
              ) : (
                <div className="flex justify-center items-center h-64 text-gray-500">
                  {!selectedBuilding
                    ? "Please select a building first"
                    : floors.length === 0 && !loading.floors
                    ? "No floors available for this building"
                    : "Please select a floor to view units"}
                </div>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Unit/Building Details */}
<div className="w-full lg:w-1/2 bg-[#F1F1F1] rounded-2xl shadow-md p-6 h-[600px]">
          {selectedUnit ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-black">
                  {selectedUnit.unitNumber}
                </h3>
                <button
                  onClick={toggleBookmark}
                  className="focus:outline-none"
                  aria-label="Toggle bookmark"
                >
                  {isBookmarked ? (
                    <IoMdBookmark className="text-2xl text-black" />
                  ) : (
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      className="text-2xl text-gray-500"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="Bookmark">
                        <path d="M17.6,21.945a1.483,1.483,0,0,1-1.01-.4l-4.251-3.9a.5.5,0,0,0-.68,0L7.409,21.545a1.5,1.5,0,0,1-2.516-1.1V4.57a2.5,2.5,0,0,1,2.5-2.5h9.214a2.5,2.5,0,0,1,2.5,2.5V20.442a1.481,1.481,0,0,1-.9,1.374A1.507,1.507,0,0,1,17.6,21.945ZM12,16.51a1.5,1.5,0,0,1,1.018.395l4.251,3.9a.5.5,0,0,0,.839-.368V4.57a1.5,1.5,0,0,0-1.5-1.5H7.393a1.5,1.5,0,0,0-1.5,1.5V20.442a.5.5,0,0,0,.839.368L10.983,16.9A1.5,1.5,0,0,1,12,16.51Z"></path>
                      </g>
                    </svg>
                  )}
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-black" />
                  <span>Location: {selectedUnit?.facing || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <FaMoneyBillWave className="mr-2 text-black" />
                  <span>
                    Price: ₹
                    {selectedUnit.price.totalPrice?.toLocaleString() || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaRulerCombined className="mr-2 text-black" />
                  <span>Size: {selectedUnit.sizeSqFt || "N/A"} Sq.Ft</span>
                </div>
                <div className="flex items-center">
                  <FaHome className="mr-2 text-black" />
                  <span>Type: {selectedUnit.bhkType || "N/A"}</span>
                </div>

                {selectedUnit?.photos?.[0]?.url && (
                  <img
                    src={selectedUnit.photos[0].url}
                    alt={`Unit ${selectedUnit.unitNumber}`}
                    className="mt-4 w-full h-48 sm:h-60 object-cover rounded-lg cursor-pointer"
                    onClick={() => openModal(selectedUnit.photos[0].url)}
                  />
                )}
              </div>

              <button
                onClick={handleBookNow}
                disabled={paymentProcessing}
                className={`mt-6 w-full px-6 py-2 text-white font-semibold rounded transition ${
                  paymentProcessing ? "bg-gray-400" : "bg-black hover:bg-gray-800"
                }`}
              >
                {paymentProcessing ? "Processing..." : "Book Now"}
              </button>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-black">
                  {selectedBuilding?.buildingName || "Select a Building"}
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-black" />
                  <span className="font-bold">Location:</span>
                </div>
                <div className="ml-6">{selectedBuilding?.buildingArea || "N/A"}</div>
                <div className="flex items-center">
                  <FaMoneyBillWave className="mr-2 text-black" />
                  <span className="font-bold">Price Range:</span>
                </div>
                <div className="ml-6">{selectedBuilding?.priceRange || "N/A"}</div>
                <div className="flex items-center">
                  <FaRulerCombined className="mr-2 text-black" />
                  <span className="font-bold">Total Units:</span>
                </div>
                <div className="ml-6">{selectedBuilding?.totalUnits || "N/A"}</div>
                <div className="flex items-center">
                  <FaBuilding className="mr-2 text-black" />
                  <span className="font-bold">Type:</span>
                </div>
                <div className="ml-6">{selectedBuilding?.type || "N/A"}</div>
              </div>
              <p className="mt-6 text-gray-700">
                {selectedFloor
                  ? "Click on an available unit in the floor plan to view details and book."
                  : selectedBuilding
                  ? "Select a floor to view available units."
                  : "Select a building to get started."}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && modalImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60"
          onClick={closeModal}
        >
          <div
            className="relative p-4 w-full max-w-4xl max-h-[90vh] bg-white rounded shadow-md overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-xl font-bold text-black"
              onClick={closeModal}
            >
              ×
            </button>
            <div className="flex justify-center mb-2 space-x-4">
              <button
                onClick={handleZoomOut}
                className="px-3 py-1 font-semibold bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <button
                onClick={handleZoomIn}
                className="px-3 py-1 font-semibold bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
            <div className="flex justify-center items-center">
              <img
                src={modalImage}
                alt="Floor Plan Zoom"
                style={{
                  transform: `scale(${scale})`,
                  transition: "transform 0.3s ease",
                }}
                className="max-h-[80vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Loan Calculator Modal */}
      {showLoanCalculator && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative bg-white p-6 rounded-2xl shadow-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={toggleLoanCalculator}
              className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-black"
            >
              ×
            </button>
            <div className="mb-5">
              <KeyAmenities />
            </div>
         <div className="flex justify-end">
  <button
    onClick={toggleLoanCalculator}
    className="bg-black text-white font-bold px-10 py-3 rounded-xl"
  >
    Close
  </button>
</div>
          </div>
        </div>
      )}

      {/* Booking Form Section */}
      <div className="w-full  p-6 rounded-lg  mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-medium text-gray-800 mb-4 sm:mb-0">
          Enquiry Form 
          </h2>
          <button
            onClick={toggleLoanCalculator}
            className="w-full sm:w-auto bg-black text-white font-bold px-6 py-3 rounded-2xl"
          >
            Loan Calculator
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleFormChange}
                placeholder="First name*"
                required
                className={`w-full border rounded px-3 py-2 focus:outline-none placeholder-gray-500 ${
                  fieldErrors.firstName ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-orange-500'
                }`}
              />
              {fieldErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
              )}
            </div>
            <div className="w-full">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleFormChange}
                placeholder="Last name*"
                required
                className={`w-full border rounded px-3 py-2 focus:outline-none placeholder-gray-500 ${
                  fieldErrors.lastName ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-orange-500'
                }`}
              />
              {fieldErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleFormChange}
              placeholder="Country*"
              required
              className={`w-full border rounded px-3 py-2 focus:outline-none placeholder-gray-500 ${
                fieldErrors.country ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-orange-500'
              }`}
            />
            {fieldErrors.country && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.country}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              placeholder="Street Address*"
              required
              className={`w-full border rounded px-3 py-2 focus:outline-none placeholder-gray-500 ${
                fieldErrors.address ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-orange-500'
              }`}
            />
            {fieldErrors.address && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.address}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleFormChange}
              placeholder="Town / City*"
              required
              className={`w-full border rounded px-3 py-2 focus:outline-none placeholder-gray-500 ${
                fieldErrors.city ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-orange-500'
              }`}
            />
            {fieldErrors.city && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.city}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleFormChange}
              placeholder="ZIP Code"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="Email Address*"
              required
              className={`w-full border rounded px-3 py-2 focus:outline-none placeholder-gray-500 ${
                fieldErrors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-orange-500'
              }`}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              placeholder="Phone* (10-digit Indian number)"
              required
              maxLength="10"
              className={`w-full border rounded px-3 py-2 focus:outline-none placeholder-gray-500 ${
                fieldErrors.phone ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-orange-500'
              }`}
            />
            {fieldErrors.phone && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>
            )}
          </div>

          <div>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleFormChange}
              rows="3"
              placeholder="Additional notes"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={formSubmitting}
            className={`w-[220px] bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition font-medium ${
              formSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {formSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ArihantPage;