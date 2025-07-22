
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import axios from "axios";
import { motion } from "framer-motion";
import BASE_URL from "../../service/api";

const UPLOAD_URL = "https://z-backend-2xag.onrender.com/api/upload/type";
const token = JSON.parse(sessionStorage.getItem("logindata"))?.token;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export default function BuildingList() {
  const location = useLocation();
  const id = location?.state?.id;
  const [buildings, setBuildings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState(null);
  const [filterProject, setFilterProject] = useState("All");
  const [filterBuildingName, setFilterBuildingName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Added for amenities dropdown
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [amenities, setAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [locationAdvantages, setLocationAdvantages] = useState([]);
  const [newLocationAdvantage, setNewLocationAdvantage] = useState({
    place: "",
    distance: "",
  });
  // Added missing state declarations
  const [apartmentConfigs, setApartmentConfigs] = useState([]);
  const [newApartmentConfig, setNewApartmentConfig] = useState({
    bhk: "",
    unitType: "",
    builtUpArea: "",
    pricePerSqft: "",
    priceRange: "",
  });
  const [unitPlans, setUnitPlans] = useState([]);
  const [clubhousePlans, setClubhousePlans] = useState([]);
  const [masterPlans, setMasterPlans] = useState([]);
  const [elevationImages, setElevationImages] = useState([]);
  const [interiorsImages, setInteriorsImages] = useState([]);
  const [amenitiesImages, setAmenitiesImages] = useState([]);
  const [siteProgressImages, setSiteProgressImages] = useState([]);
  const [walkthroughVideos, setWalkthroughVideos] = useState([]);

  const type = [
    "Residential",
    "Commercial",
    "Industrial",
    "Mixed Use",
    "Agricultural",
    "Special Purpose",
  ];

  useEffect(() => {
    fetchBuildings();
    fetchProjectDetails();
  }, []);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const fetchBuildings = async () => {
    if (!token) {
      alert("Please log in to continue");
      navigate("/login");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `/api/properties/buildings/by-project/${id}`
      );
      setBuildings(response.data);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      alert("Failed to fetch buildings");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectDetails = async () => {
    if (!token) {
      alert("Please log in to continue");
      navigate("/login");
      return;
    }
    try {
      const response = await axiosInstance.get(
        `/api/propertiesGet/project/${id}`
      );
      setSelectedProject(response.data);
      setProjects([response.data]);
    } catch (error) {
      console.error("Error fetching project details:", error);
      alert("Failed to fetch project details");
    }
  };

  const openModal = (building = null) => {
    if (building) {
      setSelectedBuilding(building);
      setIsEditMode(true);
      setValue("project", building.project._id || building.project || "");
      setValue("buildingName", building.buildingName || "");
      setValue("floorsCount", building.floorsCount || "");
      setValue("description", building.description || "");
      setValue("buildingArea", building.buildingArea || "");
      setValue("priceRange", building.priceRange || "");
      setValue("units", building.units || "");
      setValue("type", building.type || "");
      setValue("salientFeatures", building.salientFeatures?.join("\n") || "");
      setValue("projectOverview", building.projectOverview || "");
      setValue("locationMapImage", building.locationMapImage || "");
      setValue("marketPrice", building.configuration?.marketPrice || "");
      setValue("casagrandPrice", building.configuration?.casagrandPrice || "");
      setValue("offerPrice", building.configuration?.offerPrice || "");
      setAmenities(building.amenities || []);
      setPhotos(building.photos || []);
      setVideos(building.videos || []);
      setLocationAdvantages(building.locationAdvantages || []);
      setApartmentConfigs(building.configuration?.apartmentConfigs || []);
      setUnitPlans(building.floorPlans?.unit || []);
      setClubhousePlans(building.floorPlans?.clubhouse || []);
      setMasterPlans(building.floorPlans?.master || []);
      setElevationImages(building.gallery?.elevation || []);
      setInteriorsImages(building.gallery?.interiors || []);
      setAmenitiesImages(building.gallery?.amenities || []);
      setSiteProgressImages(building.gallery?.siteProgress || []);
      setWalkthroughVideos(building.gallery?.walkthrough || []);
    } else {
      reset();
      setAmenities([]);
      setPhotos([]);
      setVideos([]);
      setPhotoFiles([]);
      setVideoFiles([]);
      setLocationAdvantages([]);
      setNewLocationAdvantage({ place: "", distance: "" });
      setApartmentConfigs([]);
      setNewApartmentConfig({
        bhk: "",
        unitType: "",
        builtUpArea: "",
        pricePerSqft: "",
        priceRange: "",
      });
      setUnitPlans([]);
      setClubhousePlans([]);
      setMasterPlans([]);
      setElevationImages([]);
      setInteriorsImages([]);
      setAmenitiesImages([]);
      setSiteProgressImages([]);
      setWalkthroughVideos([]);
      setIsEditMode(false);
    }
    setIsDropdownOpen(false);
    setShowModal(true);
  };

  const clearForm = () => {
    reset();
    setAmenities([]);
    setPhotos([]);
    setVideos([]);
    setPhotoFiles([]);
    setVideoFiles([]);
    setNewAmenity("");
    setLocationAdvantages([]);
    setNewLocationAdvantage({ place: "", distance: "" });
    setApartmentConfigs([]);
    setNewApartmentConfig({
      bhk: "",
      unitType: "",
      builtUpArea: "",
      pricePerSqft: "",
      priceRange: "",
    });
    setUnitPlans([]);
    setClubhousePlans([]);
    setMasterPlans([]);
    setElevationImages([]);
    setInteriorsImages([]);
    setAmenitiesImages([]);
    setSiteProgressImages([]);
    setWalkthroughVideos([]);
    setIsDropdownOpen(false);
  };

  const handleAddApartmentConfig = () => {
    if (
      newApartmentConfig.bhk &&
      newApartmentConfig.unitType &&
      newApartmentConfig.builtUpArea &&
      newApartmentConfig.pricePerSqft &&
      newApartmentConfig.priceRange
    ) {
      setApartmentConfigs([...apartmentConfigs, newApartmentConfig]);
      setNewApartmentConfig({
        bhk: "",
        unitType: "",
        builtUpArea: "",
        pricePerSqft: "",
        priceRange: "",
      });
    }
  };

  const handleRemoveApartmentConfig = (index) => {
    setApartmentConfigs(apartmentConfigs.filter((_, i) => i !== index));
  };

  const uploadSingleFile = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await axios.post(UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      const uploadedUrl =
        response.data.url ||
        response.data.urls?.[0] ||
        response.data.imageUrl ||
        response.data.fileUrl;

      if (!uploadedUrl) {
        throw new Error("No URL found in the server response");
      }

      return uploadedUrl;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      throw error;
    }
  };

  const handleFileUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    let validTypes, maxFiles, currentFiles, setFiles, setFileObjects;

    switch (type) {
      case "photo":
        validTypes = ["image/jpeg", "image/png", "image/gif"];
        maxFiles = 5;
        currentFiles = photos;
        setFiles = setPhotos;
        setFileObjects = setPhotoFiles;
        break;
      case "video":
        validTypes = ["video/mp4", "video/webm"];
        maxFiles = 3;
        currentFiles = videos;
        setFiles = setVideos;
        setFileObjects = setVideoFiles;
        break;
      case "unitPlans":
      case "clubhousePlans":
      case "masterPlans":
      case "elevationImages":
      case "interiorsImages":
      case "amenitiesImages":
      case "siteProgressImages":
        validTypes = ["image/jpeg", "image/png", "image/gif"];
        maxFiles = Infinity;
        currentFiles =
          type === "unitPlans"
            ? unitPlans
            : type === "clubhousePlans"
            ? clubhousePlans
            : type === "masterPlans"
            ? masterPlans
            : type === "elevationImages"
            ? elevationImages
            : type === "interiorsImages"
            ? interiorsImages
            : type === "amenitiesImages"
            ? amenitiesImages
            : siteProgressImages;
        setFiles =
          type === "unitPlans"
            ? setUnitPlans
            : type === "clubhousePlans"
            ? setClubhousePlans
            : type === "masterPlans"
            ? setMasterPlans
            : type === "elevationImages"
            ? setElevationImages
            : type === "interiorsImages"
            ? setInteriorsImages
            : type === "amenitiesImages"
            ? setAmenitiesImages
            : setSiteProgressImages;
        break;
      case "walkthroughVideos":
        validTypes = ["video/mp4", "video/webm"];
        maxFiles = Infinity;
        currentFiles = walkthroughVideos;
        setFiles = setWalkthroughVideos;
        break;
      default:
        validTypes = ["image/jpeg", "image/png", "image/gif"];
        maxFiles = 5;
    }

    const remainingSlots = maxFiles - currentFiles.length;

    if (files.length > remainingSlots && maxFiles !== Infinity) {
      alert(`You can only upload up to ${maxFiles} ${type}s.`);
      return;
    }

    const validFiles = files.filter((file) => validTypes.includes(file.type));
    if (validFiles.length !== files.length) {
      alert(
        `Please upload only ${
          type.includes("video")
            ? "videos (MP4, WebM)"
            : "images (JPEG, PNG, GIF)"
        }.`
      );
      return;
    }

    try {
      setUploadingMedia(true);
      setUploadProgress(0);

      const tempUrls = validFiles.map((file) => URL.createObjectURL(file));
      setFiles((prev) => [...prev, ...tempUrls]);

      const uploadedUrls = [];
      for (const file of validFiles) {
        const uploadedUrl = await uploadSingleFile(file, type);
        uploadedUrls.push(uploadedUrl);
      }

      setFiles((prev) => {
        const newFiles = [...prev];
        for (let i = 0; i < tempUrls.length; i++) {
          const index = newFiles.indexOf(tempUrls[i]);
          if (index !== -1) {
            newFiles[index] = uploadedUrls[i];
          }
        }
        return newFiles.filter((url) => typeof url === "string" || url instanceof File);
      });

      if (setFileObjects && type !== "walkthroughVideos") {
        setFileObjects((prev) => [...prev, ...validFiles]);
      }

      tempUrls.forEach((url) => URL.revokeObjectURL(url));
    } catch (error) {
      console.error(`Error uploading ${type}s:`, error);
      alert(
        `Failed to upload ${type}s: ${
          error.response?.data?.message || error.message
        }`
      );
      setFiles((prev) => prev.filter((url) => !tempUrls.includes(url)));
      if (setFileObjects && type !== "walkthroughVideos") {
        setFileObjects((prev) =>
          prev.filter((_, i) => i >= prev.length - validFiles.length)
        );
      }
    } finally {
      setUploadingMedia(false);
      setUploadProgress(0);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const buildingData = {
        ...data,
        amenities,
        photos: photos.filter((p) => typeof p === "string"),
        videos: videos.filter((v) => typeof v === "string"),
        mapViewUrl: data.locationMapImage || "",
        locationAdvantages,
        apartmentConfigs,
        unitPlans: unitPlans.filter((p) => typeof p === "string"),
        clubhousePlans: clubhousePlans.filter((p) => typeof p === "string"),
        masterPlans: masterPlans.filter((p) => typeof p === "string"),
        elevationImages: elevationImages.filter((p) => typeof p === "string"),
        interiorsImages: interiorsImages.filter((p) => typeof p === "string"),
        amenitiesImages: amenitiesImages.filter((p) => typeof p === "string"),
        siteProgressImages: siteProgressImages.filter((p) => typeof p === "string"),
        walkthroughVideos: walkthroughVideos.filter((v) => typeof v === "string"),
      };

      if (isEditMode && selectedBuilding) {
        await axiosInstance.put(
          `/api/properties/building/${selectedBuilding._id}`,
          buildingData
        );
        alert("Building updated successfully!");
      } else {
        await axiosInstance.post("/api/properties/building", buildingData);
        alert("Building added successfully!");
      }

      await fetchBuildings();
      setShowModal(false);
      reset();
    } catch (error) {
      console.error("Error saving building:", error);
      alert(
        `Failed to ${isEditMode ? "update" : "add"} building: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBuilding = async (id) => {
    if (!window.confirm("Are you sure you want to delete this building?")) {
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.delete(`/api/properties/building/${id}`);
      alert("Building deleted successfully!");
      await fetchBuildings();
    } catch (error) {
      console.error("Error deleting building:", error);
      alert("Failed to delete building");
    } finally {
      setIsLoading(false);
    }
  };

  const removeMedia = (index, type) => {
    const mediaMap = {
      photo: { files: photos, setFiles: setPhotos, fileArray: photoFiles, setFileArray: setPhotoFiles },
      video: { files: videos, setFiles: setVideos, fileArray: videoFiles, setFileArray: setVideoFiles },
      unitPlans: { files: unitPlans, setFiles: setUnitPlans },
      clubhousePlans: { files: clubhousePlans, setFiles: setClubhousePlans },
      masterPlans: { files: masterPlans, setFiles: setMasterPlans },
      elevationImages: { files: elevationImages, setFiles: setElevationImages },
      interiorsImages: { files: interiorsImages, setFiles: setInteriorsImages },
      amenitiesImages: { files: amenitiesImages, setFiles: setAmenitiesImages },
      siteProgressImages: { files: siteProgressImages, setFiles: setSiteProgressImages },
      walkthroughVideos: { files: walkthroughVideos, setFiles: setWalkthroughVideos },
    };
    const { files, setFiles, fileArray, setFileArray } = mediaMap[type] || {};
    if (files && setFiles) {
      setFiles(files.filter((_, i) => i !== index));
      if (fileArray && setFileArray) {
        setFileArray(fileArray.filter((_, i) => i !== index));
      }
    }
  };

  const filteredBuildings = buildings.filter((b) => {
    const matchesProject =
      filterProject === "All" ||
      b.project._id === filterProject ||
      b.project === filterProject;
    const matchesName =
      filterBuildingName === "" ||
      b.buildingName.toLowerCase().includes(filterBuildingName.toLowerCase());
    return matchesProject && matchesName;
  });

  const handleAddfloorClick = (id) => {
    navigate("/PropertyFloor", {
      state: { id },
    });
  };

  const goBack = () => navigate(-1);

  const handleAddLocationAdvantage = () => {
    if (newLocationAdvantage.place && newLocationAdvantage.distance) {
      setLocationAdvantages([...locationAdvantages, newLocationAdvantage]);
      setNewLocationAdvantage({ place: "", distance: "" });
    }
  };

  const handleRemoveLocationAdvantage = (index) => {
    setLocationAdvantages(locationAdvantages.filter((_, i) => i !== index));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity("");
      setIsDropdownOpen(false);
    }
  };

  const handleRemoveAmenity = (index) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBuilding(null);
    setPhotoIndex(0);
    clearForm();
  };

  return (
    <div className="flex flex-col h-screen overflow-auto bg-gray-100 p-4">
      <IoMdArrowBack
        onClick={goBack}
        className="mb-2 text-2xl cursor-pointer"
      />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-grow">
          <select
            className="border rounded p-2"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
          >
            <option value="All">All Projects</option>
            {selectedProject && (
              <option key={selectedProject._id} value={selectedProject._id}>
                {selectedProject.projectName}
              </option>
            )}
          </select>
          <input
            type="text"
            placeholder="Filter by building name"
            value={filterBuildingName}
            onChange={(e) => setFilterBuildingName(e.target.value)}
            className="border rounded p-2 w-64"
          />
        </div>
        <button
          type="button"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition ml-auto"
          onClick={() => openModal()}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Add Building"}
        </button>
      </div>

      {/* Buildings Grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-[90%] mx-auto">
        {isLoading && !showModal ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredBuildings.length === 0 ? (
          <p className="text-center col-span-full text-gray-700">
            No buildings found.
          </p>
        ) : (
          filteredBuildings.map((building, index) => (
            <motion.div
              key={building._id}
              className="rounded-lg w-[90%] mx-auto bg-white shadow-md"
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
              }}
              onClick={() => handleAddfloorClick(building._id)}
              role="button"
              aria-label={`View floors for ${building.buildingName}`}
            >
              {building.photos?.length > 0 ? (
                <img
                  src={building.photos[0]}
                  alt={building.buildingName}
                  className="w-full h-40 sm:h-48 md:h-60 object-cover"
                />
              ) : (
                <div className="w-full h-40 sm:h-48 md:h-60 bg-gray-300 flex items-center justify-center text-gray-600">
                  No Image
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">
                  {building.buildingName}
                </h3>
                <p className="text-lg text-black font-semibold mb-1">
                  {building.priceRange || "Contact for Price"}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 12.414a2 2 0 10-2.828 2.828l4.243 4.243a2 2 0 002.828-2.828z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                  {selectedProject?.projectName || "N/A"}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8h16M4 12h16M4 16h16"
                      />
                    </svg>
                    {building.buildingArea || "Unknown Area"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Type: {building.type || "N/A"}
                </p>
                <div className="relative z-10 mt-2"></div>
                <div className="flex space-x-2 mt-4">
                  <button
                    className="bg-black text-white p-2 text-sm rounded hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(building);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white p-2 text-sm rounded hover:bg-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBuilding(building._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Add/Edit Building Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-3 text-gray-600 text-2xl"
              onClick={closeModal}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {isEditMode ? "Edit Building" : "Add New Building"}
            </h2>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Uploading files... {uploadProgress}%
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Project Selection */}
              <div>
                <label
                  htmlFor="project"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Project*
                </label>
                <select
                  id="project"
                  {...register("project", { required: "Project is required" })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.project ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.projectName}
                    </option>
                  ))}
                </select>
                {errors.project && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.project.message}
                  </p>
                )}
              </div>

              {/* Building Name */}
              <div>
                <label
                  htmlFor="buildingName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Building Name*
                </label>
                <input
                  type="text"
                  id="buildingName"
                  {...register("buildingName", {
                    required: "Building name is required",
                    minLength: {
                      value: 3,
                      message: "Building name must be at least 3 characters",
                    },
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.buildingName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter building name"
                />
                {errors.buildingName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.buildingName.message}
                  </p>
                )}
              </div>

              {/* Floors Count */}
              <div>
                <label
                  htmlFor="floorsCount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Number of Floors
                </label>
                <input
                  type="number"
                  id="floorsCount"
                  {...register("floorsCount", {
                    min: {
                      value: 1,
                      message: "Number of floors must be at least 1",
                    },
                  })}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.floorsCount ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter number of floors"
                />
                {errors.floorsCount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.floorsCount.message}
                  </p>
                )}
              </div>

              {/* Units Count */}
              <div>
                <label
                  htmlFor="units"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Number of Units
                </label>
                <input
                  type="number"
                  id="units"
                  {...register("units", {
                    min: {
                      value: 1,
                      message: "Number of units must be at least 1",
                    },
                  })}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.units ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter number of units"
                />
                {errors.units && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.units.message}
                  </p>
                )}
              </div>

              {/* Building Area */}
              <div>
                <label
                  htmlFor="buildingArea"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Building Area (location)
                </label>
                <input
                  type="text"
                  id="buildingArea"
                  {...register("buildingArea")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter building area location"
                />
              </div>

              {/* Price Range */}
              <div>
                <label
                  htmlFor="priceRange"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price Range
                </label>
                <input
                  type="text"
                  id="priceRange"
                  {...register("priceRange")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g. 1.8 cr - 3 cr"
                />
              </div>

              {/* Property Type Dropdown */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Property Type
                </label>
                <select
                  id="type"
                  {...register("type")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select property type</option>
                  {type.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salient Features */}
              <div>
                <label
                  htmlFor="salientFeatures"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Salient Features (One per line)
                </label>
                <textarea
                  id="salientFeatures"
                  {...register("salientFeatures", {
                    maxLength: {
                      value: 500,
                      message: "Salient features cannot exceed 500 characters",
                    },
                  })}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.salientFeatures
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter salient features of the building, one per line..."
                />
                {errors.salientFeatures && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.salientFeatures.message}
                  </p>
                )}
              </div>

              {/* Project Overview */}
              <div>
                <label
                  htmlFor="projectOverview"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Project Overview
                </label>
                <textarea
                  id="projectOverview"
                  {...register("projectOverview", {
                    maxLength: {
                      value: 1000,
                      message: "Project overview cannot exceed 1000 characters",
                    },
                  })}
                  rows="4"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.projectOverview
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter detailed project overview..."
                />
                {errors.projectOverview && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.projectOverview.message}
                  </p>
                )}
              </div>

              {/* Location Advantages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Advantages
                </label>
                <div className="space-y-2 mb-2">
                  {locationAdvantages.map((advantage, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="flex-1">
                        {advantage.place} ({advantage.distance})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLocationAdvantage(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newLocationAdvantage.place}
                    onChange={(e) =>
                      setNewLocationAdvantage({
                        ...newLocationAdvantage,
                        place: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Place (e.g., Airport)"
                  />
                  <input
                    type="text"
                    value={newLocationAdvantage.distance}
                    onChange={(e) =>
                      setNewLocationAdvantage({
                        ...newLocationAdvantage,
                        distance: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Distance (e.g., 12 km)"
                  />
                  <button
                    type="button"
                    onClick={handleAddLocationAdvantage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Location Map Image */}
              <div>
                <label
                  htmlFor="locationMapImage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location Map Image URL
                </label>
                <input
                  type="text"
                  id="locationMapImage"
                  {...register("locationMapImage", {
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message:
                        "Must be a valid URL starting with http:// or https://",
                    },
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.locationMapImage
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter location map image URL"
                />
                {errors.locationMapImage && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.locationMapImage.message}
                  </p>
                )}
              </div>

              {/* Configuration Section */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Configuration</h3>

                {/* Market Price */}
                <div className="mb-4">
                  <label
                    htmlFor="marketPrice"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Market Price
                  </label>
                  <input
                    type="text"
                    id="marketPrice"
                    {...register("marketPrice")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. ₹ 9000/Sqft"
                  />
                </div>

                {/* Casagrand Price */}
                <div className="mb-4">
                  <label
                    htmlFor="casagrandPrice"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Builder Price
                  </label>
                  <input
                    type="text"
                    id="casagrandPrice"
                    {...register("casagrandPrice")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. ₹ 4799/Sqft"
                  />
                </div>

                {/* Offer Price */}
                <div className="mb-4">
                  <label
                    htmlFor="offerPrice"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Offer Price
                  </label>
                  <input
                    type="text"
                    id="offerPrice"
                    {...register("offerPrice")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. ₹ 4499/Sqft"
                  />
                </div>

                {/* Apartment Configurations */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apartment Configurations
                  </label>
                  <div className="space-y-4 mb-4">
                    {Array.isArray(apartmentConfigs) && apartmentConfigs.length > 0 ? (
                      apartmentConfigs.map((config, index) => (
                        <div key={index} className="border p-3 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {config.bhk} - {config.unitType}
                              </p>
                              <p className="text-sm">
                                Built-up Area: {config.builtUpArea}
                              </p>
                              <p className="text-sm">
                                Price/Sqft: {config.pricePerSqft}
                              </p>
                              <p className="text-sm">
                                Price Range: {config.priceRange}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveApartmentConfig(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No configurations added.</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          BHK
                        </label>
                        <input
                          type="text"
                          value={newApartmentConfig.bhk}
                          onChange={(e) =>
                            setNewApartmentConfig({
                              ...newApartmentConfig,
                              bhk: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="e.g. 2 BHK"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Unit Type
                        </label>
                        <input
                          type="text"
                          value={newApartmentConfig.unitType}
                          onChange={(e) =>
                            setNewApartmentConfig({
                              ...newApartmentConfig,
                              unitType: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="e.g. Apartment"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Built-up Area
                      </label>
                      <input
                        type="text"
                        value={newApartmentConfig.builtUpArea}
                        onChange={(e) =>
                          setNewApartmentConfig({
                            ...newApartmentConfig,
                            builtUpArea: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="e.g. 1012 Sqft - 1177 Sqft"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Price/Sqft
                        </label>
                        <input
                          type="text"
                          value={newApartmentConfig.pricePerSqft}
                          onChange={(e) =>
                            setNewApartmentConfig({
                              ...newApartmentConfig,
                              pricePerSqft: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="e.g. Rs 4499 / Sqft"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Price Range
                        </label>
                        <input
                          type="text"
                          value={newApartmentConfig.priceRange}
                          onChange={(e) =>
                            setNewApartmentConfig({
                              ...newApartmentConfig,
                              priceRange: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="e.g. 53L to 60L Onwards"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddApartmentConfig}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Add Configuration
                    </button>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities
                </label>

                {/* Selected Amenities Display */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {amenities.map((amenity, index) => {
                    const iconMap = {
                      "air conditioner": "❄️",
                      "fire extinguisher": "🧯",
                      "sports field": "🏟️",
                      "smoking area": "🚬",
                      "kids zone": "🧒",
                      "pet friendly": "🐶",
                      elevator: "🛗",
                      laundry: "🧺",
                      "swimming pool": "🏊‍♂️",
                      gym: "🏋️",
                      parking: "🚗",
                      security: "🛡️",
                      "24x7 security": "🛡️",
                      "power backup": "🔌",
                      clubhouse: "🏠",
                      "children play area": "🧸",
                      garden: "🌳",
                      cctv: "📹",
                      surveillance: "📹",
                    };

                    const lowerAmenity = amenity.toLowerCase();
                    const icon =
                      Object.entries(iconMap).find(([key]) =>
                        lowerAmenity.includes(key)
                      )?.[1] || "✅";

                    return (
                      <div
                        key={index}
                        className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                      >
                        <span className="mr-1">{icon}</span>
                        {amenity}
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenity(index)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Dropdown Input */}
                <div className="relative">
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newAmenity}
                        onChange={(e) => {
                          setNewAmenity(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        onBlur={() =>
                          setTimeout(() => setIsDropdownOpen(false), 200)
                        }
                        placeholder="Search or select amenities..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      {isDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {[
                            "❄️ Air Conditioner",
                            "🧯 Fire Extinguisher",
                            "🏟️ Sports Field",
                            "🚬 Smoking Area",
                            "🧒 Kids Zone",
                            "🐶 Pet Friendly",
                            "🛗 Elevator",
                            "🧺 Laundry",
                            "🏊‍♂️ Swimming Pool",
                            "🏋️ Gym ",
                            "🚗 Parking",
                            "🛡️ 24x7 Security",
                            "🔌 Power Backup",
                            "🏠 Clubhouse",
                            "🧸 Children's Play Area",
                            "🌳 Garden ",
                            "📹 CCTV Surveillance",
                          ]
                            .filter((option) =>
                              option
                                .toLowerCase()
                                .includes(newAmenity.toLowerCase())
                            )
                            .map((option, i) => (
                              <div
                                key={i}
                                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  const amenityText = option
                                    .replace(/[^\w\s/]/g, "")
                                    .trim();
                                  if (!amenities.includes(amenityText)) {
                                    setAmenities([...amenities, amenityText]);
                                  }
                                  setIsDropdownOpen(false);
                                  setNewAmenity("");
                                }}
                              >
                                {option}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAmenity}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Photos Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Building Photos (Max 5)
                </label>
                <div className="flex items-center space-x-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="px-3 py-2 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors">
                      <span className="text-sm text-gray-600">
                        Select photos
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/gif"
                        onChange={(e) => handleFileUpload(e, "photo")}
                        className="hidden max-files-5"
                        disabled={uploadingMedia || photos.length >= 5}
                      />
                    </div>
                  </label>
                  <span className="text-sm text-gray-500">
                    {photos.length} selected (Max 5)
                  </span>
                </div>
                {photos.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={
                            typeof photo === "string"
                              ? photo
                              : URL.createObjectURL(photo)
                          }
                          alt={`Building ${index}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeMedia(index, "photo")}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Videos Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Building Videos (Max 3)
                </label>
                <div className="flex items-center space-x-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="px-3 py-2 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors">
                      <span className="text-sm text-gray-600">
                        Select videos
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="video/mp4,video/webm"
                        onChange={(e) => handleFileUpload(e, "video")}
                        className="hidden max-files-5"
                        disabled={uploadingMedia || videos.length >= 3}
                      />
                    </div>
                  </label>
                  <span className="text-sm text-gray-500">
                    {videos.length} selected (Max 3)
                  </span>
                </div>
                {videos.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {videos.map((video, index) => (
                      <div key={index} className="relative group">
                        <video
                          src={
                            typeof video === "string"
                              ? video
                              : URL.createObjectURL(video)
                          }
                          className="w-full h-auto rounded"
                          controls
                        />
                        <button
                          type="button"
                          onClick={() => removeMedia(index, "video")}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Floor Plans Section */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Floor Plans</h3>

                {/* Unit Plans */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Plans
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="px-3 py-2 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors">
                        <span className="text-sm text-gray-600">
                          Add Unit Plan Images
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "unitPlans")}
                          className="hidden"
                          disabled={uploadingMedia}
                        />
                      </div>
                    </label>
                  </div>
                  {unitPlans.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {unitPlans.map((plan, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={
                              typeof plan === "string"
                                ? plan
                                : URL.createObjectURL(plan)
                            }
                            alt={`Unit Plan ${index + 1}`}
                            className="w-full h-32 object-contain border rounded bg-gray-100"
                          />
                          <button
                            type="button"
                            onClick={() => removeMedia(index, "unitPlans")}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Clubhouse Plans */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clubhouse Plans
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="px-3 py-2 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors">
                        <span className="text-sm text-gray-600">
                          Add Clubhouse Plan Images
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e, "clubhousePlans")
                          }
                          className="hidden"
                          disabled={uploadingMedia}
                        />
                      </div>
                    </label>
                  </div>
                  {clubhousePlans.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {clubhousePlans.map((plan, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={
                              typeof plan === "string"
                                ? plan
                                : URL.createObjectURL(plan)
                            }
                            alt={`Clubhouse Plan ${index + 1}`}
                            className="w-full h-32 object-contain border rounded bg-gray-100"
                          />
                          <button
                            type="button"
                            onClick={() => removeMedia(index, "clubhousePlans")}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Master Plans */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Master Plans
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="px-3 py-2 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors">
                        <span className="text-sm text-gray-600">
                          Add Master Plan Images
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "masterPlans")}
                          className="hidden"
                          disabled={uploadingMedia}
                        />
                      </div>
                    </label>
                  </div>
                  {masterPlans.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {masterPlans.map((plan, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={
                              typeof plan === "string"
                                ? plan
                                : URL.createObjectURL(plan)
                            }
                            alt={`Master Plan ${index + 1}`}
                            className="w-full h-32 object-contain border rounded bg-gray-100"
                          />
                          <button
                            type="button"
                            onClick={() => removeMedia(index, "masterPlans")}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Section */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Gallery</h3>

                {/* Elevation Images */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Elevation Images
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="px-3 py-2 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors">
                        <span className="text-sm text-gray-600">
                          Add Elevation Images
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e, "elevationImages")
                          }
                          className="hidden"
                          disabled={uploadingMedia}
                        />
                      </div>
                    </label>
                  </div>
                  {elevationImages.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {elevationImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={
                              typeof image === "string"
                                ? image
                                : URL.createObjectURL(image)
                            }
                            alt={`Elevation ${index + 1}`}
                            className="w-full h-32 object-cover border rounded"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeMedia(index, "elevationImages")
                            }
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interiors Images */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interiors Images
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="px-3 py-2 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors">
                        <span className="text-sm text-gray-600">
                          Add Interiors Images
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e, "interiorsImages")
                          }
                          className="hidden"
                          disabled={uploadingMedia}
                        />
                      </div>
                    </label>
                  </div>
                  {interiorsImages.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {interiorsImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={
                              typeof image === "string"
                                ? image
                                : URL.createObjectURL(image)
                            }
                            alt={`Interiors ${index + 1}`}
                            className="w-full h-32 object-cover border rounded"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeMedia(index, "interiorsImages")
                            }
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Amenities Images */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities Images
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="px-3 py-2 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors">
                        <span className="text-sm text-gray-600">
                          Add Amenities Images
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e, "amenitiesImages")
                          }
                          className="hidden"
                          disabled={uploadingMedia}
                        />
                      </div>
                    </label>
                  </div>
                  {amenitiesImages.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {amenitiesImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={
                              typeof image === "string"
                                ? image
                                : URL.createObjectURL(image)
                            }
                            alt={`Amenities ${index + 1}`}
                            className="w-full h-32 object-cover border rounded"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeMedia(index, "amenitiesImages")
                            }
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Site Progress Images */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Progress Images
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="px-3 py-2 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors">
                        <span className="text-sm text-gray-600">
                          Add Site Progress Images
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e, "siteProgressImages")
                          }
                          className="hidden"
                          disabled={uploadingMedia}
                        />
                      </div>
                    </label>
                  </div>
                  {siteProgressImages.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {siteProgressImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={
                              typeof image === "string"
                                ? image
                                : URL.createObjectURL(image)
                            }
                            alt={`Site Progress ${index + 1}`}
                            className="w-full h-32 object-cover border rounded"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeMedia(index, "siteProgressImages")
                            }
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Walkthrough Videos */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Walkthrough Videos
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="px-3 py-2 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors">
                        <span className="text-sm text-gray-600">
                          Add Walkthrough Videos
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="video/*"
                          onChange={(e) =>
                            handleFileUpload(e, "walkthroughVideos")
                          }
                          className="hidden"
                          disabled={uploadingMedia}
                        />
                      </div>
                    </label>
                  </div>
                  {walkthroughVideos.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      {walkthroughVideos.map((video, index) => (
                        <div key={index} className="relative group">
                          <video
                            src={
                              typeof video === "string"
                                ? video
                                : URL.createObjectURL(video)
                            }
                            className="w-full h-auto rounded"
                            controls
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeMedia(index, "walkthroughVideos")
                            }
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  {...register("description", {
                    maxLength: {
                      value: 500,
                      message: "Description cannot exceed 500 characters",
                    },
                  })}
                  rows="4"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter building description..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  disabled={isLoading || uploadingMedia}
                >
                  {isLoading
                    ? "Saving..."
                    : isEditMode
                    ? "Update Building"
                    : "Save Building"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
