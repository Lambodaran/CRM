import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import _ from "lodash";
import BASE_URL from "../../service/api";


const Popup = ({
  selectedLocation,
  setSelectedLocation,
  isVisible,
  setIsVisible,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [stateError, setStateError] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // Debounced search query update
  const debouncedSetSearchQuery = useCallback(
    _.debounce((value) => setSearchQuery(value), 300),
    []
  );

  // Fetch states from builder profiles
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      setStateError(null);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/properties/builder-profile`
        );

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid data format received from API");
        }

        const stateMap = new Map();
        response.data.forEach((builder) => {
          if (builder.address?.state) {
            const normalizedState = builder.address.state.trim().toLowerCase();
            if (!stateMap.has(normalizedState)) {
              stateMap.set(normalizedState, builder.address.state);
            }
          }
        });

        const uniqueStates = Array.from(stateMap.entries()).map(
          ([_, stateName]) => ({
            id: stateName,
            name: stateName,
          })
        );

        uniqueStates.sort((a, b) => a.name.localeCompare(b.name));
        setStates(uniqueStates);
      } catch (error) {
        setStateError("Failed to fetch states. Please try again.");
        console.error("Error fetching states:", error);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // Reset search query when popup opens
  useEffect(() => {
    if (isVisible) {
      setSearchQuery("");
    }
  }, [isVisible]);

  // Prevent scrolling when popup is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  // Debug isVisible changes
  useEffect(() => {
    console.log("isVisible changed:", isVisible);
  }, [isVisible]);

  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle state selection with single click
  const handleStateSelect = async (e, stateId) => {
    e.stopPropagation();
    setIsSelecting(true);
    console.log("handleStateSelect triggered with stateId:", stateId);
    setSelectedLocation(stateId);
    setSearchQuery("");
    await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate delay
    setIsVisible(false);
    setIsSelecting(false);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setSearchQuery("");
    setIsVisible(false);
  };

  // Simplified detectLocation
  const detectLocation = (e) => {
    e.stopPropagation();
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          if (states.length > 0) {
            setSelectedLocation(states[0].name);
            setSearchQuery("");
            setIsVisible(false);
          } else {
            setLocationError("No states available to select");
          }
        } catch (error) {
          setLocationError("Could not determine your location");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setLocationError("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      ></div>

      {/* Popup Content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Select Your Location
              {selectedLocation && (
                <span className="text-sm text-gray-500 ml-2">
                  (Current: {selectedLocation})
                </span>
              )}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for your state"
                className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => debouncedSetSearchQuery(e.target.value)}
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {/* <button
              onClick={detectLocation}
              disabled={isLocating}
              className={`px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                isLocating
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
            >
              {isLocating ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8a0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Detecting...
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Detect my location
                </>
              )}
            </button> */}
          </div>

          {loadingStates ? (
            <div className="text-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-blue-500 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-2 text-gray-600">Loading states...</p>
            </div>
          ) : stateError ? (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {stateError}
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Select State
                {selectedLocation && (
                  <span className="text-sm text-gray-500 ml-2">
                    (Current: {selectedLocation})
                  </span>
                )}
              </h3>

              {filteredStates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No states found matching "{searchQuery}". Try a different search term or{" "}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-blue-500 hover:underline"
                  >
                    clear the search
                  </button>.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredStates.map((state) => (
                    <button
                      key={state.id}
                      className={`flex items-center justify-center p-4 rounded-lg transition-all border border-gray-200 hover:bg-gray-50 ${
                        isSelecting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={(e) => handleStateSelect(e, state.id)}
                      aria-label={`Select ${state.name}`}
                      disabled={isSelecting}
                    >
                      <span className="font-medium text-gray-800">
                        {state.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {locationError && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {locationError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;