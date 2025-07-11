import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { motion } from "framer-motion";
import location1 from "../HomePage/Assets/location1.png";
import sqftIcon from "../HomePage/Assets/sqft.png";
import Larrow from "../HomePage/Assets/Larrow.png";
import Rarrow from "../HomePage/Assets/Rarrow.png";

const BASE_URL = "https://crm-bcgg.onrender.com";
const MEDIA_UPLOAD_URL = "https://z-backend-2xag.onrender.com/api/upload/type";

export default function ProjectManagement() {
  const location = useLocation();
  const id = location.state.builderId;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({ mode: "onBlur" });

  const [projects, setProjects] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterBuilder, setFilterBuilder] = useState("All");
  const [filterPropertyType, setFilterPropertyType] = useState("All");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [media, setMedia] = useState({
    photos: [],
    videos: [],
    threeDVideo: [],
  });
  const [amenities, setAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBuildersLoading, setIsBuildersLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const token = JSON.parse(sessionStorage.getItem("logindata"))?.token;

  useEffect(() => {
    fetchProjects();
    fetchBuilders();
  }, []);

  const fetchProjects = async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/properties/projects/by-builder/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProjects(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch projects"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBuilders = async () => {
    setIsBuildersLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/propertiesGet/builder/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBuilders(response.data ? [response.data] : []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch builder"
      );
    } finally {
      setIsBuildersLoading(false);
    }
  };

  const handleMediaUpload = async (type, files) => {
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setError(null);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(MEDIA_UPLOAD_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        return {
          url: response.data?.fileUrl || URL.createObjectURL(file),
          type: file.type.split("/")[0] || type,
          title: file.name,
        };
      });

      const uploadedMedia = await Promise.all(uploadPromises);
      setMedia((prev) => ({
        ...prev,
        [type]: [...(prev[type] || []), ...uploadedMedia],
      }));
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.response?.data?.message || "Failed to upload media");
    } finally {
      setIsLoading(false);
    }
  };

  const removeMedia = (type, index) => {
    setMedia((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (index) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const projectData = {
        ...data,
        builder: data.builder,
        amenities,
        media,
      };

      const url = isEditMode
        ? `${BASE_URL}/api/properties/project/${currentProjectId}`
        : `${BASE_URL}/api/properties/project`;

      const method = isEditMode ? "put" : "post";

      await axios[method](url, projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      resetForm();
      fetchProjects();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to save project"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    reset();
    setMedia({ photos: [], videos: [], threeDVideo: [] });
    setAmenities([]);
    setNewAmenity("");
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentProjectId(null);
    setError(null);
  };

  const handleEditProject = (project, e) => {
    e.stopPropagation();
    if (!project) return;

    setIsEditMode(true);
    setCurrentProjectId(project._id);

    const fieldsToSet = [
      "projectName",
      "propertyType",
      "price",
      "type",
      "status",
      "bed",
      "bath",
      "sqft",
      "units",
      "kitchen",
      "carpetArea",
      "mapView",
      "phase",
      "floor",
      "loanDetails",
      "downPayment",
      "possessionDate",
      "description",
      "specifications",
    ];

    fieldsToSet.forEach((field) => {
      if (project[field] !== undefined) {
        setValue(field, project[field]);
      }
    });

    if (project.location) {
      setValue("location.city", project.location.city || "");
      setValue("location.area", project.location.area || "");
      setValue("location.pincode", project.location.pincode || "");
    }

    setValue("builder", project.builder?._id || project.builder || "");
    setMedia(project.media || { photos: [], videos: [], threeDVideo: [] });
    setAmenities(project.amenities || []);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (projectId, e) => {
    e.stopPropagation();
    if (
      !projectId ||
      !window.confirm("Are you sure you want to delete this project?")
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`${BASE_URL}/api/properties/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProjects();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to delete project"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDescription = (projectId, e) => {
    e.stopPropagation();
    setExpandedDescriptions((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const filteredProjects = projects.filter((project) => {
    if (!project) return false;

    const matchesType =
      filterType === "All" ||
      (project.type && project.type.toLowerCase() === filterType.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ||
      (project.status &&
        project.status.toLowerCase() === filterStatus.toLowerCase());
    const matchesBuilder =
      filterBuilder === "All" ||
      (project.builder && project.builder.toString() === filterBuilder);
    const matchesPropertyType =
      filterPropertyType === "All" ||
      (project.propertyType &&
        project.propertyType.toLowerCase() ===
          filterPropertyType.toLowerCase());

    return (
      matchesType && matchesStatus && matchesBuilder && matchesPropertyType
    );
  });

  const priceValue = watch("price");
  const sqftValue = watch("sqft");
  const navigate = useNavigate();

  const handleCardClick = (projectId) => {
    navigate("/add-Builder", { state: { id: projectId } });
  };

  const goBack = () => navigate(-1);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(filteredProjects.length - itemsPerPage, 0)
        : prevIndex - itemsPerPage
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage >= filteredProjects.length
        ? 0
        : prevIndex + itemsPerPage
    );
  };

  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(
      currentIndex,
      Math.min(currentIndex + itemsPerPage, filteredProjects.length)
    );
  }, [filteredProjects, currentIndex]);

  return (
    <div className="flex flex-col h-screen overflow-auto bg-gray-100 p-4">
      <IoMdArrowBack
        onClick={goBack}
        className="mb-2 text-2xl cursor-pointer"
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 right-0 px-2 py-1"
            aria-label="Close error message"
          >
            ×
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-grow">
          <select
            className="border rounded p-2"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
          </select>
          <select
            className="border rounded p-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            className="border rounded p-2"
            value={filterBuilder}
            onChange={(e) => setFilterBuilder(e.target.value)}
            disabled={isBuildersLoading}
          >
            {/* <option value="All">All Builders</option> */}
            {builders.map((builder) => (
              <option key={builder._id} value={builder._id}>
                {builder.companyName || "Unknown Builder"}
              </option>
            ))}
          </select>
          <select
            className="border rounded p-2"
            value={filterPropertyType}
            onChange={(e) => setFilterPropertyType(e.target.value)}
          >
            <option value="All">All Properties</option>
            <option value="Plot">Plot</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ml-auto"
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Add Project"}
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative overflow-y-auto max-h-[95vh] transform transition-all duration-300 scale-100">
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-semibold transition-colors"
              aria-label="Close modal"
              disabled={isLoading}
            >
              ×
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {isEditMode ? "Edit Project" : "Create New Project"}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6 bg-gray-50 p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Basic Information
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name*
                  </label>
                  <input
                    {...register("projectName", {
                      required: "Project name is required",
                      minLength: {
                        value: 3,
                        message: "Project name must be at least 3 characters",
                      },
                      maxLength: {
                        value: 100,
                        message: "Project name cannot exceed 100 characters",
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="Enter project name"
                  />
                  {errors.projectName && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.projectName.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City*
                    </label>
                    <input
                      {...register("location.city", {
                        required: "City is required",
                        pattern: {
                          value: /^[A-Za-z\s-]+$/,
                          message:
                            "City must contain only letters, spaces, or hyphens",
                        },
                        minLength: {
                          value: 2,
                          message: "City must be at least 2 characters",
                        },
                        maxLength: {
                          value: 50,
                          message: "City cannot exceed 50 characters",
                        },
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                      placeholder="City"
                    />
                    {errors.location?.city && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.location.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area*
                    </label>
                    <input
                      {...register("location.area", {
                        required: "Area is required",
                        minLength: {
                          value: 3,
                          message: "Area must be at least 3 characters",
                        },
                        maxLength: {
                          value: 100,
                          message: "Area cannot exceed 100 characters",
                        },
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                      placeholder="Area"
                    />
                    {errors.location?.area && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.location.area.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode*
                    </label>
                    <input
                      {...register("location.pincode", {
                        required: "Pincode is required",
                        pattern: {
                          value: /^\d{6}$/,
                          message: "Pincode must be exactly 6 digits",
                        },
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                      placeholder="Pincode"
                    />
                    {errors.location?.pincode && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.location.pincode.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type*
                  </label>
                  <select
                    {...register("propertyType", {
                      required: "Property type is required",
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                  >
                    <option value="">Select property type</option>
                    <option value="Plot">Plot</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                  {errors.propertyType && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.propertyType.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price*
                  </label>
                  <input
                    {...register("price", {
                      required: "Price is required",
                      pattern: {
                        value: /^[0-9,]+$/,
                        message:
                          "Only numbers and commas are allowed (e.g., 50,000)",
                      },
                      validate: (value) => {
                        if (!value) return "Price is required";
                        const cleanValue = String(value).replace(/[$,]/g, "");
                        return (
                          parseFloat(cleanValue) > 0 ||
                          "Price must be greater than 0"
                        );
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="Enter price (e.g., 50,000)"
                  />
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type*
                  </label>
                  <select
                    {...register("type", {
                      required: "Type is required",
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                  >
                    <option value="">Select type</option>
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                  </select>
                  {errors.type && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.type.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status*
                  </label>
                  <select
                    {...register("status", {
                      required: "Status is required",
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                  >
                    <option value="">Select status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  {errors.status && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.status.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Builder*
                  </label>
                  <select
                    {...register("builder", {
                      required: "Builder is required",
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    disabled={isBuildersLoading}
                  >
                    <option value="">
                      {isBuildersLoading
                        ? "Loading builder..."
                        : "Select builder"}
                    </option>
                    {builders.map((builder) => (
                      <option key={builder._id} value={builder._id}>
                        {builder.companyName || "Unknown Builder"}
                      </option>
                    ))}
                  </select>
                  {errors.builder && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.builder.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms*
                  </label>
                  <input
                    type="number"
                    {...register("bed", {
                      required: "Bedrooms are required",
                      min: {
                        value: 0,
                        message: "Bedrooms cannot be negative",
                      },
                      max: {
                        value: 50,
                        message: "Bedrooms cannot exceed 50",
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="Enter number of bedrooms"
                  />
                  {errors.bed && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.bed.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms*
                  </label>
                  <input
                    type="number"
                    {...register("bath", {
                      required: "Bathrooms are required",
                      min: {
                        value: 0,
                        message: "Bathrooms cannot be negative",
                      },
                      max: {
                        value: 50,
                        message: "Bathrooms cannot exceed 50",
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="Enter number of bathrooms"
                  />
                  {errors.bath && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.bath.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Square Feet*
                  </label>
                  <input
                    type="number"
                    {...register("sqft", {
                      required: "Square feet is required",
                      min: {
                        value: 100,
                        message: "Square feet must be at least 100",
                      },
                      max: {
                        value: 1000000,
                        message: "Square feet cannot exceed 1,000,000",
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="Enter square feet"
                  />
                  {errors.sqft && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.sqft.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-6 bg-gray-50 p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Additional Details
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Units
                  </label>
                  <input
                    type="number"
                    {...register("units", {
                      min: {
                        value: 0,
                        message: "Units cannot be negative",
                      },
                      max: {
                        value: 10000,
                        message: "Units cannot exceed 10000",
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="Enter number of units"
                  />
                  {errors.units && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.units.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kitchen
                  </label>
                  <input
                    {...register("kitchen", {
                      maxLength: {
                        value: 50,
                        message:
                          "Kitchen description cannot exceed 50 characters",
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="Enter kitchen type"
                  />
                  {errors.kitchen && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.kitchen.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carpet Area
                  </label>
                  <input
                    {...register("carpetArea", {
                      pattern: {
                        value: /^\d+\s*(sqft|sqm)?$/,
                        message:
                          "Carpet area must be a number followed by optional 'sqft' or 'sqm'",
                      },
                      validate: (value) => {
                        if (!value) return true;
                        const carpetAreaValue = parseFloat(value);
                        const sqftValueNum = parseFloat(sqftValue);
                        return (
                          (!isNaN(carpetAreaValue) &&
                            !isNaN(sqftValueNum) &&
                            carpetAreaValue <= sqftValueNum) ||
                          "Carpet area cannot exceed total square feet"
                        );
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="Enter carpet area (e.g., 1800 sqft)"
                  />
                  {errors.carpetArea && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.carpetArea.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Map View URL
                  </label>
                  <input
                    {...register("mapView", {
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message:
                          "Map view must be a valid URL starting with http:// or https://",
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="Enter map view URL"
                  />
                  {errors.mapView && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.mapView.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phase
                  </label>
                  <input
                    {...register("phase", {
                      maxLength: {
                        value: 50,
                        message: "Phase cannot exceed 50 characters",
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="Enter phase"
                  />
                  {errors.phase && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.phase.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor
                  </label>
                  <input
                    type="number"
                    {...register("floor", {
                      min: {
                        value: 0,
                        message: "Floor cannot be negative",
                      },
                      max: {
                        value: 100,
                        message: "Floor cannot exceed 100",
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="Enter floor number"
                  />
                  {errors.floor && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.floor.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Details
                  </label>
                  <input
                    {...register("loanDetails", {
                      maxLength: {
                        value: 200,
                        message: "Loan details cannot exceed 200 characters",
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="Enter loan details"
                  />
                  {errors.loanDetails && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.loanDetails.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Down Payment
                  </label>
                  <input
                    {...register("downPayment", {
                      required: "Down payment is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Only numbers are allowed (e.g., 50000)",
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="Enter down payment (e.g., 50,000)"
                  />
                  {errors.downPayment && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.downPayment.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Possession Date
                  </label>
                  <input
                    type="date"
                    {...register("possessionDate", {
                      validate: (value) =>
                        !value ||
                        new Date(value) >= new Date().setHours(0, 0, 0, 0) ||
                        "Possession date must be today or in the future",
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                  />
                  {errors.possessionDate && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.possessionDate.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-6 bg-gray-50 p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Description
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description*
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Project description is required",
                      minLength: {
                        value: 10,
                        message: "Description must be at least 10 characters",
                      },
                      maxLength: {
                        value: 2000,
                        message: "Description cannot exceed 2000 characters",
                      },
                    })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="Describe your project in detail"
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specifications
                  </label>
                  <textarea
                    {...register("specifications", {
                      maxLength: {
                        value: 2000,
                        message: "Specifications cannot exceed 2000 characters",
                      },
                    })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="List project specifications"
                  />
                  {errors.specifications && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.specifications.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-6 bg-gray-50 p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Amenities
                </h2>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
                    placeholder="Add amenity (max 50 characters)"
                    maxLength={50}
                  />
                  <button
                    type="button"
                    onClick={addAmenity}
                    disabled={!newAmenity.trim()}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-indigo-100 px-4 py-2 rounded-full shadow-sm"
                    >
                      <span className="text-sm text-indigo-800">{amenity}</span>
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        className="ml-2 text-indigo-500 hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6 bg-gray-50 p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800">Media</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photos
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        handleMediaUpload("photos", e.target.files)
                      }
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="block w-full px-6 py-16 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-indigo-500 transition-all bg-white shadow-sm"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="mt-2 text-sm font-medium text-gray-600">
                          Upload photos
                        </span>
                      </div>
                    </label>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {media.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo.url}
                            alt={photo.title || `Photo ${index}`}
                            className="w-full h-32 object-cover rounded-lg shadow-md"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <button
                              type="button"
                              onClick={() => removeMedia("photos", index)}
                              className="text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                            >
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Videos
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={(e) =>
                        handleMediaUpload("videos", e.target.files)
                      }
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="block w-full px-6 py-16 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-indigo-500 transition-all bg-white shadow-sm"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="mt-2 text-sm font-medium text-gray-600">
                          Upload videos
                        </span>
                      </div>
                    </label>
                    <div className="mt-4 grid grid-cols-1 gap-4">
                      {media.videos.map((video, index) => (
                        <div key={index} className="relative group">
                          <video
                            src={video.url}
                            className="w-full h-32 object-cover rounded-lg shadow-md"
                            controls
                          />
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => removeMedia("videos", index)}
                              className="text-white"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      3D Videos
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={(e) =>
                        handleMediaUpload("threeDVideo", e.target.files)
                      }
                      className="hidden"
                      id="3dvideo-upload"
                    />
                    <label
                      htmlFor="3dvideo-upload"
                      className="block w-full px-6 py-16 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-indigo-500 transition-all bg-white shadow-sm"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                          />
                        </svg>
                        <span className="mt-2 text-sm font-medium text-gray-600">
                          Upload 3D videos
                        </span>
                      </div>
                    </label>
                    <div className="mt-4 grid grid-cols-1 gap-4">
                      {media.threeDVideo.map((video, index) => (
                        <div key={index} className="relative group">
                          <video
                            src={video.url}
                            className="w-full h-32 object-cover rounded-lg shadow-md"
                            controls
                          />
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => removeMedia("threeDVideo", index)}
                              className="text-white"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  disabled={isLoading}
                >
                  {isLoading
                    ? isEditMode
                      ? "Updating..."
                      : "Creating..."
                    : isEditMode
                    ? "Update Project"
                    : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && !isModalOpen ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <motion.div className="relative w-full max-w-7xl mx-auto px-10 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Project Listings</h2>
          </div>
          {filteredProjects.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              {projects.length === 0
                ? "No projects found. Create a new project to get started."
                : "No projects match the selected filters."}
            </p>
          ) : (
            <div className="relative flex items-center justify-center">
              {filteredProjects.length > itemsPerPage && (
                <button
                  onClick={goToPrevious}
                  className="absolute z-10 p-3 rounded-full hidden sm:block"
                  style={{
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: "-30px",
                  }}
                  aria-label="Previous Slide"
                >
                  <img src={Larrow} alt="Previous" className="w-6 h-6" />
                </button>
              )}
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-[90%] mx-auto">
                {visibleProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    className="rounded-lg overflow-hidden w-[90%] mx-auto"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                    }}
                    onClick={() => handleCardClick(project._id)}
                  >
                    <img
                      src={
                        project.media?.photos[0]?.url ||
                        "https://via.placeholder.com/400"
                      }
                      alt={project.projectName}
                      className="w-full h-40 sm:h-48 md:h-60 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-lg font-bold">
                        {project.projectName || "Unnamed Project"}
                      </h2>
                      <p className="text-lg mt-1 text-red-600 font-semibold">
                        {project.price
                          ? typeof project.price === "number"
                            ? `${parseFloat(project.price).toLocaleString()}`
                            : project.price
                          : "Contact for Price"}
                      </p>
                      <p className="text-sm mt-1 text-gray-500 flex items-center gap-2">
                        <img src={location1} alt="Location" className="w-4 h-4" />
                        {project.location &&
                          `${project.location.area}, ${project.location.city} ${project.location.pincode}`}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <img src={sqftIcon} alt="Size Icon" className="w-4 h-4" />
                          {project.sqft || "Unknown Size"}
                        </span>
                      </div>
                      <p className="text-sm mt-1 text-gray-600">
                        Builder: {builders.find((b) => b._id === project.builder)?.companyName || "Unknown"}
                      </p>
                      <p className="text-sm mt-1 text-gray-600">
                        Type: {project.propertyType}
                      </p>
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDescription(project._id, e);
                        }}
                        className="text-blue-600 underline self-start mt-2"
                        style={{ display: expandedDescriptions[project._id] ? "none" : "block" }}
                      >
                        Show More
                      </button> */}
                      {expandedDescriptions[project._id] && (
                        <div>
                          <p className="text-gray-600 mt-2">{project.description}</p>
                          <p className="text-gray-600 mt-2">{project.specifications}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDescription(project._id, e);
                            }}
                            className="text-blue-600 underline self-start mt-2"
                          >
                            Show Less
                          </button>
                        </div>
                      )}
                      <div className="mt-4 flex justify-between items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProject(project, e);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => handleDeleteProject(project._id, e)}
                          className="text-red-600 hover:text-red-800"
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              {filteredProjects.length > itemsPerPage && (
                <button
                  onClick={goToNext}
                  className="absolute z-10 p-3 text-xl font-bold hidden sm:block"
                  style={{
                    top: "50%",
                    transform: "translateY(-60%)",
                    right: "-30px",
                  }}
                  aria-label="Next Slide"
                >
                  <img src={Rarrow} alt="Next" className="w-6 h-6" />
                </button>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}