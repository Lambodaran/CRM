import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../service/api";

const UPLOAD_URL = "https://z-backend-2xag.onrender.com/api/upload/type";

const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    role: "",
    profilepic: "",
    profilebanner: "",
    phone: "",
    companyName: "",
    likedUnits: [],
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [uploadErrors, setUploadErrors] = useState({ profilepic: "", profilebanner: "" });

  // Get token and user ID from session storage
  const logindata = JSON.parse(sessionStorage.getItem("logindata"));
  const token = logindata?.token;
  const userId = logindata?.user?.id;

  // Validation function for text fields
  const validateField = (field, value) => {
    switch (field) {
      case "name":
        if (!value || value.length < 2) {
          return "Name is required and must be at least 2 characters";
        }
        return "";
      case "email":
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "A valid email is required";
        }
        return "";
      case "username":
        if (!value || !/^[a-zA-Z0-9_-]{3,}$/.test(value)) {
          return "Username is required and must be at least 3 characters (alphanumeric, underscores, or hyphens)";
        }
        return "";
      case "phone":
        if (value && !/^\+?[\d\s-]{10,12}$/.test(value)) {
          return "Phone number must be 10-12 digits (optional country code)";
        }
        return "";
      case "companyName":
        if (value && value.length < 2) {
          return "Company name must be at least 2 characters if provided";
        }
        return "";
      default:
        return "";
    }
  };

  // Validation function for file uploads
  const validateFile = (file, field) => {
    if (!file) return null;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    if (!allowedTypes.includes(file.type)) {
      return `Please upload a valid image file (JPEG, PNG, or GIF) for ${field === "profilepic" ? "profile picture" : "banner"}`;
    }
    if (file.size > maxSize) {
      return `File size exceeds 5MB for ${field === "profilepic" ? "profile picture" : "banner"}`;
    }
    return null;
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const likedUnitsWithNumbers = await Promise.all(
          response.data.likedUnits.map(async (unitId) => {
            try {
              const unitResponse = await axios.get(
                `${BASE_URL}/api/properties/unit/${unitId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              return unitResponse.data.unitNumber || unitId;
            } catch (error) {
              console.error(`Error fetching unit ${unitId}:`, error);
              return unitId;
            }
          })
        );

        setUser({
          ...response.data,
          likedUnits: likedUnitsWithNumbers,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, token]);

  const handleInputChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  const handleImageUpload = async (field, file) => {
    const fileError = validateFile(file, field);
    if (fileError) {
      setUploadErrors((prev) => ({ ...prev, [field]: fileError }));
      return;
    }

    setUploadErrors((prev) => ({ ...prev, [field]: "" }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", field === "profilepic" ? "profile" : "banner");

      const response = await axios.post(UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.fileUrl) {
        setUser((prev) => ({ ...prev, [field]: response.data.fileUrl }));
      }
    } catch (error) {
      console.error(`Error uploading ${field}:`, error);
      setUploadErrors((prev) => ({
        ...prev,
        [field]: `Failed to upload ${field === "profilepic" ? "profile picture" : "banner"}. Please try again.`,
      }));
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setValidationErrors({});
    setUploadErrors({ profilepic: "", profilebanner: "" });
  };

  const handleSubmit = async () => {
    const errors = {};
    Object.keys(user).forEach((field) => {
      if (["name", "email", "username", "phone", "companyName"].includes(field)) {
        const error = validateField(field, user[field]);
        if (error) errors[field] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      alert("Please fix the validation errors before submitting.");
      return;
    }

    try {
      const { likedUnits, ...userDataToUpdate } = user;

      await axios.put(`${BASE_URL}/api/users/${userId}`, userDataToUpdate, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsEditing(false);
      setValidationErrors({});
      setUploadErrors({ profilepic: "", profilebanner: "" });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-100 flex items-center justify-center">
        <div className="text-lg sm:text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-purple-100 flex items-center justify-center">
        <div className="text-lg sm:text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-100 py-6 px-4 sm:py-10 sm:px-6">
      <div className="relative max-w-6xl mx-auto bg-white rounded-3xl shadow-lg">
        {/* Banner */}
        <div
          className="h-32 sm:h-48 bg-cover bg-center rounded-t-3xl"
          style={{
            backgroundImage: `url(${
              user.profilebanner || "https://via.placeholder.com/1200x300"
            })`,
            backgroundColor: !user.profilebanner ? "#eee" : undefined,
          }}
        >
          {isEditing && (
            <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
              <label className="flex items-center justify-center bg-white text-black border text-sm font-medium px-4 py-2 rounded-lg cursor-pointer  transition min-w-[120px]">
                Upload Banner
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  className="hidden"
                  onChange={(e) => handleImageUpload("profilebanner", e.target.files[0])}
                  aria-label="Upload banner image"
                />
              </label>
              {uploadErrors.profilebanner && (
                <p className="text-red-500 text-xs mt-1 text-right max-w-[200px]">
                  {uploadErrors.profilebanner}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Profile + Edit */}
        <div className="relative -mt-12 sm:-mt-16 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <div className="relative self-center sm:self-auto">
                <img
                  src={user.profilepic || "https://via.placeholder.com/100"}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md object-cover"
                />
                {isEditing && (
                  <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
                    <label className="flex items-center justify-center bg-black text-white text-sm font-medium w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer hover:bg-purple-700 transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7.414a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0012.586 2H4zm6 5a3 3 0 110 6 3 3 0 010-6z" />
                      </svg>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        className="hidden"
                        onChange={(e) => handleImageUpload("profilepic", e.target.files[0])}
                        aria-label="Upload profile picture"
                      />
                    </label>
                    {uploadErrors.profilepic && (
                      <p className="text-red-500 text-xs mt-1 absolute -bottom-6 left-0 w-32 sm:w-40">
                        {uploadErrors.profilepic}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-4 sm:mt-16 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
              </div>
            </div>
            <button
              className="mt-4 sm:mt-16 text-purple-700 px-4 py-2 rounded hover:bg-purple-100 transition flex items-center justify-center sm:justify-start"
              onClick={isEditing ? handleSubmit : handleEditClick}
            >
              {isEditing ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 13V9h3l-4-4-4 4h3v4H0v2h7v-4H4z" />
                  </svg>
                  Save
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.379-8.379-2.828-2.828z" />
                  </svg>
                  Edit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 px-4 sm:px-6 py-6 sm:py-10">
          {/* General Info */}
          <div className="bg-gray-50 rounded-xl shadow p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">General Information</h3>
            <div className="space-y-3 sm:space-y-4">
              <Field
                label="Name"
                value={user.name}
                isEditing={isEditing}
                onChange={(val) => handleInputChange("name", val)}
                error={validationErrors.name}
              />
              <Field
                label="Email"
                value={user.email}
                isEditing={isEditing}
                onChange={(val) => handleInputChange("email", val)}
                error={validationErrors.email}
              />
              <Field
                label="Username"
                value={user.username}
                isEditing={isEditing}
                onChange={(val) => handleInputChange("username", val)}
                error={validationErrors.username}
              />
              <Field
                label="Role"
                value={user.role}
                readOnly={true}
                isEditing={isEditing}
              />
              <Field
                label="Phone"
                value={user.phone}
                isEditing={isEditing}
                onChange={(val) => handleInputChange("phone", val)}
                error={validationErrors.phone}
              />
            </div>
          </div>

          {/* Professional Info */}
          <div className="bg-gray-50 rounded-xl shadow p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Professional Details</h3>
            <div className="space-y-3 sm:space-y-4">
              <Field
                label="Company Name"
                value={user.companyName}
                isEditing={isEditing}
                onChange={(val) => handleInputChange("companyName", val)}
                error={validationErrors.companyName}
              />
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Liked Units
                </label>
                <div className="flex flex-wrap gap-2">
                  {user.likedUnits.length > 0 ? (
                    user.likedUnits.map((unit, index) => (
                      <div
                        key={index}
                        className="bg-purple-100 text-purple-800 px-2 sm:px-3 py-1 rounded-full text-sm"
                      >
                        <span>{unit}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No liked units</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Field Component
const Field = ({
  label,
  value,
  isEditing = false,
  onChange,
  readOnly = false,
  error,
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      value={value || ""}
      readOnly={!isEditing || readOnly}
      onChange={(e) => onChange && onChange(e.target.value)}
      className={`bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 w-full ${
        !isEditing || readOnly ? "cursor-not-allowed bg-gray-100" : ""
      } ${error ? "border-red-500" : ""}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default ProfileCard;