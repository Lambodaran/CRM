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
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
  });

  // Get token and user ID from session storage
  const logindata = JSON.parse(sessionStorage.getItem("logindata"));
  const token = logindata?.token;
  const userId = logindata?.user?.id;

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name) return "Name is required";
    if (!nameRegex.test(name)) return "Name must contain only letters and spaces";
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[A-Za-z0-9]+$/;
    if (!username) return "Username is required";
    if (!usernameRegex.test(username)) return "Username must contain only letters and numbers";
    return "";
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone) return "Phone number is required";
    if (!phoneRegex.test(phone)) return "Invalid Indian phone number (must be 10 digits, starting with 6-9)";
    return "";
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

        // Fetch unit numbers for liked units
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

    // Validate input
    let error = "";
    if (field === "name") error = validateName(value);
    else if (field === "email") error = validateEmail(value);
    else if (field === "username") error = validateUsername(value);
    else if (field === "phone") error = validatePhone(value);

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleImageUpload = async (field, file) => {
    if (!file) return;

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
      alert(`Failed to upload ${field}. Please try again.`);
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async () => {
    // Validate all fields before saving
    const nameError = validateName(user.name);
    const emailError = validateEmail(user.email);
    const usernameError = validateUsername(user.username);
    const phoneError = validatePhone(user.phone);

    setErrors({
      name: nameError,
      email: emailError,
      username: usernameError,
      phone: phoneError,
    });

    if (nameError || emailError || usernameError || phoneError) {
      alert("Please fix the errors before saving.");
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
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-purple-100 flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-100 py-6 px-4 sm:py-10 sm:px-6">
      <div className="relative max-w-6xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Banner */}
        <div
          className="h-40 sm:h-48 bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              user.profilebanner || "https://via.placeholder.com/1200x300"
            })`,
            backgroundColor: !user.profilebanner ? "#eee" : undefined,
          }}
        >
          {isEditing && (
            <div className="absolute right-4 top-4 bg-white bg-opacity-80 p-2 rounded">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload("profilebanner", e.target.files[0])
                }
                className="text-xs sm:text-sm"
              />
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end relative">
            {/* Profile Picture and Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end w-full">
              <div className="relative -mt-16 sm:-mt-12 ml-0 sm:ml-4">
                <img
                  src={user.profilepic || "https://via.placeholder.com/100"}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md object-cover"
                />
                {isEditing && (
                  <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
                    <input
                      type="file"
                      accept="image/*"
                      className="w-6 h-6 opacity-0 absolute cursor-pointer"
                      onChange={(e) =>
                        handleImageUpload("profilepic", e.target.files[0])
                      }
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7.414a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0012.586 2H4zm6 5a3 3 0 110 6 3 3 0 010-6z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="mt-3 sm:mt-0 sm:ml-6 flex-1">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* Edit Button */}
            <div className="mt-4 sm:mt-0 w-full sm:w-auto flex justify-end">
              <button
                className="text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-100 transition flex items-center text-sm sm:text-base"
                onClick={isEditing ? handleSubmit : handleEditClick}
              >
                {isEditing ? (
                  "Save Changes"
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
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
            {/* General Info */}
            <div className="bg-gray-50 rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-4">General Information</h3>
              <div className="space-y-4">
                <Field
                  label="Name"
                  value={user.name}
                  isEditing={isEditing}
                  onChange={(val) => handleInputChange("name", val)}
                  error={errors.name}
                />
                <Field
                  label="Email"
                  value={user.email}
                  isEditing={isEditing}
                  onChange={(val) => handleInputChange("email", val)}
                  error={errors.email}
                />
                <Field
                  label="Username"
                  value={user.username}
                  isEditing={isEditing}
                  onChange={(val) => handleInputChange("username", val)}
                  error={errors.username}
                />
                <Field
                  label="Role"
                  value={user.role}
                  isEditing={isEditing}
                  readOnly={true}
                />
                <Field
                  label="Phone"
                  value={user.phone}
                  isEditing={isEditing}
                  onChange={(val) => handleInputChange("phone", val)}
                  error={errors.phone}
                />
              </div>
            </div>

            {/* Professional Info */}
            <div className="bg-gray-50 rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Professional Details</h3>
              <div className="space-y-4">
                <Field
                  label="Company Name"
                  value={user.companyName}
                  isEditing={isEditing}
                  onChange={(val) => handleInputChange("companyName", val)}
                />
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
  error = "",
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      value={value || ""}
      readOnly={!isEditing || readOnly}
      onChange={(e) => onChange && onChange(e.target.value)}
      className={`bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 ${
        !isEditing || readOnly ? "cursor-not-allowed bg-gray-100" : ""
      } ${error ? "border-red-500" : ""}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default ProfileCard;