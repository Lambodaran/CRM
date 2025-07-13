import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const extractErrorMessage = (error) => {
  if (error.response?.data) {
    const data = error.response.data;
    if (data.error) return Array.isArray(data.error) ? data.error[0] : data.error;
    if (data.email) return Array.isArray(data.email) ? data.email[0] : data.email;
    if (data.message) return Array.isArray(data.message) ? data.message[0] : data.message;
    return "An unexpected error occurred. Please try again.";
  }
  return error.message || "Failed to connect to the server. Please check your network.";
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [validationMessages, setValidationMessages] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Image carousel
  const images = [
    {
      url: "https://media.istockphoto.com/id/488120139/photo/modern-real-estate.jpg?s=612x612&w=0&k=20&c=88jk1VLSoYboMmLUx173sHs_XrZ9pH21as8lC7WINQs=",
      text: "Explore Luxury Apartments",
      link: "https://example.com/apartments"
    },
    {
      url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/560522500.jpg?k=ff828719eaa74e28da1470e46ececabe7f4db037594ee0fd3d23a142084a7827&o=&hp=1",
      text: "Discover Premium Villas",
      link: "https://example.com/villas"
    },
    {
      url: "https://media.istockphoto.com/id/1026205392/photo/beautiful-luxury-home-exterior-at-twilight.jpg?s=612x612&w=0&k=20&c=HOCqYY0noIVxnp5uQf1MJJEVpsH_d4WtVQ6-OwVoeDo=",
      text: "Find Your Dream Home",
      link: "https://example.com/homes"
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scrolling on large screens
  useEffect(() => {
    if (!isMobile) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isMobile]);

  // Image carousel effect (desktop only)
useEffect(() => {
  if (!isMobile) {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }
}, [isMobile, images.length]);

  // Clear validation messages after 4 seconds
  useEffect(() => {
    const timers = validationMessages.map((_, index) =>
      setTimeout(() => setValidationMessages((prev) => prev.filter((_, i) => i !== index)), 4000)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [validationMessages]);

  // Real-time email validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!value.trim()) {
      setEmailError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationMessages([]);
    setEmailError("");

    // Client-side validation
    if (!email.trim()) {
      setEmailError("Email is required");
      setValidationMessages((prev) => [
        ...prev,
        { text: "Email is required", type: "error" },
      ]);
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email format");
      setValidationMessages((prev) => [
        ...prev,
        { text: "Invalid email format", type: "error" },
      ]);
      return;
    }

    try {
      const response = await axios.post(
        "https://crm-bcgg.onrender.com/api/auth/forgot-password",
        { email }
      );

      setIsSuccess(true);
      setValidationMessages((prev) => [
        ...prev,
        { text: response.data.message || "Password reset link sent to your email!", type: "success" },
      ]);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      setValidationMessages((prev) => [
        ...prev,
        { text: errorMsg, type: "error" },
      ]);
      if (error.response?.data?.errors?.email) {
        setEmailError(error.response.data.errors.email);
      }
    }
  };

  return (
    <div className={`flex ${isMobile ? 'min-h-screen' : 'h-screen'} justify-center items-center bg-gray-100 font-sans px-4 py-10`}>
      {validationMessages.length > 0 && (
        <div className="fixed top-4 right-4 space-y-2 z-50" aria-live="polite">
          {validationMessages.map((message, index) => (
            <div
              key={index}
              className={`border-l-4 p-4 rounded shadow-md flex justify-between items-center ${
                message.type === "success"
                  ? "bg-green-100 border-green-500 text-green-700"
                  : "bg-red-100 border-red-500 text-red-700"
              }`}
              role="alert"
            >
              <p>{message.text}</p>
            </div>
          ))}
        </div>
      )}

    <div className={`relative w-full ${isMobile ? 'max-w-md' : 'max-w-7xl'} ${isMobile ? 'h-auto' : 'h-[90vh]'} bg-white shadow-2xl rounded-2xl overflow-hidden`}>
  {/* Main container with flex direction based on screen size */}
  <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'}`}>

         {/* Image Panel - Shows on all screens but with different sizing */}
    <div className={`${isMobile ? 'w-full h-56' : 'w-1/2 h-full'} relative overflow-hidden ${isMobile ? 'rounded-t-2xl' : 'rounded-r-2xl'}`}>
      <img
        src={images[currentImageIndex].url}
        alt={`Real estate image for ${images[currentImageIndex].text}`}
        className="w-full h-full object-cover brightness-90"
      />
      {/* <div className={`absolute text-white font-semibold ${isMobile ? 'bottom-4 left-4 text-lg' : 'bottom-12 left-12 text-xl'}`}>
        <a
          href={images[currentImageIndex].link}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {images[currentImageIndex].text}
        </a>
      </div> */}
    </div>

    {/* Form Panel - Consistent content with responsive layout */}
    <div className={`${isMobile ? 'w-full p-6' : 'w-full md:w-1/2 p-10'} bg-white flex flex-col`}>
      {!isMobile && (
        <nav className="flex mb-6 absolute top-4 left-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a
                href="/"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <svg
                  className="w-3 h-3 mr-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                Home
              </a>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  Forgot Password
                </span>
              </div>
            </li>
          </ol>
        </nav>
      )}
      
      <div className={`${isMobile ? 'w-full' : 'w-full max-w-md'} ${!isMobile ? '' : ''}`}>
        {isMobile && (
          <nav className="mb-4">
            <ol className="flex items-center text-sm">
              <li className="flex items-center">
                <a href="/" className="text-gray-700 hover:text-blue-600 flex items-center">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Home
                </a>
              </li>
              <li className="flex items-center ml-2">
                <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                </svg>
                <span className="text-gray-500">Forgot Password</span>
              </li>
            </ol>
          </nav>
        )}
        
        <h1 className={`${isMobile ? 'text-3xl text-center' : 'text-4xl'} font-bold mb-2`}>Reset Password</h1>
        <p className={`mb-6 text-gray-500 ${isMobile ? 'text-center' : ''}`}>Enter your email to receive a password reset link</p>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Your email"
              className={`w-full border ${
                emailError ? "border-red-500" : "border-gray-300"
              } rounded-md p-3 ${isMobile ? 'text-center' : ''}`}
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-full mb-4 hover:opacity-90 transition"
          >
            Send Reset Link
          </button>
        </form>
        
        <p className={`text-sm ${isMobile ? 'text-center' : 'text-center'}`}>
          Remembered your password?{" "}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
        </p>
      </div>
    </div>

 
  </div>
</div>
    </div>
  );
}