import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoginSuccessAnimation from "./LoginSuccessAnimation";
import BASE_URL from "../../service/api";

const extractErrorMessage = (error) => {
  if (error.response?.data) {
    const data = error.response.data;
    if (data.error)
      return Array.isArray(data.error) ? data.error[0] : data.error;
    if (data.password)
      return Array.isArray(data.password) ? data.password[0] : data.password;
    if (data.email)
      return Array.isArray(data.email) ? data.email[0] : data.email;
    if (data.username)
      return Array.isArray(data.username) ? data.username[0] : data.username;
    if (data.message)
      return Array.isArray(data.message) ? data.message[0] : data.message;
    return "An unexpected error occurred. Please try again.";
  }
  return error.message || "An unexpected error occurred.";
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // State declarations
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [validationMessages, setValidationMessages] = useState([]);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
  });
  const [signupName, setSignupName] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupCompanyName, setSignupCompanyName] = useState("");
  const [signupRole, setSignupRole] = useState("directBuilder");
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [signupErrors, setSignupErrors] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpResendTimer, setOtpResendTimer] = useState(30);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [userId, setUserId] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const images = [
    {
      url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80',
      text: (
        <a
          href="https://example.com/apartments"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        ></a>
      ),
    },
    {
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      text: (
        <a
          href="https://example.com/villas"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        ></a>
      ),
    },
    {
      url:  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      text: (
        <a
          href="https://example.com/homes"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        ></a>
      ),
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timers = validationMessages.map((_, index) =>
      setTimeout(
        () =>
          setValidationMessages((prev) => prev.filter((_, i) => i !== index)),
        4000
      )
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [validationMessages]);

  useEffect(() => {
    setValidationMessages([]);
  }, [showSignup]);

  // OTP timer effect
  useEffect(() => {
    let timer;
    if (showOtp && otpResendTimer > 0) {
      timer = setTimeout(() => {
        setOtpResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpResendTimer === 0) {
      setCanResendOtp(true);
    }
    return () => clearTimeout(timer);
  }, [showOtp, otpResendTimer]);

  const resetOtpTimer = () => {
    setOtpResendTimer(30);
    setCanResendOtp(false);
  };

  const handleOtpResend = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/resend-otp`,
        {
          userId: userId,
        }
      );

      resetOtpTimer();
      setValidationMessages([
        { text: "New OTP has been sent to your email", type: "success" },
      ]);
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      setValidationMessages([{ text: errorMsg, type: "error" }]);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus to next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setOtpError("Please enter a 6-digit OTP");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/verify-otp`,
        {
          userId: userId,
          otp: enteredOtp,
        }
      );

      setIsSignupSuccess(true);
      setTimeout(() => {
        setShowOtp(false);
        setShowSignup(false);
        setIsSignupSuccess(false);
        resetSignupForm();
      }, 3000);
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      setOtpError(errorMsg);
    }
  };

  const resetSignupForm = () => {
    setSignupName("");
    setSignupUsername("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupPhone("");
    setSignupCompanyName("");
    setSignupErrors({
      name: "",
      username: "",
      email: "",
      password: "",
      phone: "",
    });
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setIsSignupLoading(false);
    setUserId("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginErrors({ email: "", password: "" });
    setValidationMessages([]);
    setIsLoginLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        {
          identifier: loginEmail,
          password: loginPassword,
        }
      );

      const data = response.data;
      setIsLoginSuccess(true);
      sessionStorage.setItem("logindata", JSON.stringify(data));

      setTimeout(() => {
        const redirectState = location.state || {
          from: sessionStorage.getItem("redirectPath") || null,
          buildingId: sessionStorage.getItem("buildingId") || null,
          builderId: sessionStorage.getItem("builderId") || null,
          unitId: sessionStorage.getItem("unitId") || null,
        };

        sessionStorage.removeItem("redirectPath");
        sessionStorage.removeItem("buildingId");
        sessionStorage.removeItem("builderId");
        sessionStorage.removeItem("unitId");

        if (redirectState.from && redirectState.from !== "/") {
          navigate(redirectState.from, {
            state: {
              buildingId: redirectState.buildingId,
              builderId: redirectState.builderId,
              unitId: redirectState.unitId,
            },
          });
        }
        else if (data.user?.role === "admin") {
          navigate("/admin");
        } else if (data.user?.role === "user") {
          navigate("/user");
        } else if (data.user?.role === "directBuilder") {
          navigate("/properties");
        }
        else {
          navigate("/");
        }

        setIsLoginLoading(false);
      }, 3000);
    } catch (error) {
      setIsLoginLoading(false);
      const errorMsg = extractErrorMessage(error);
      setValidationMessages((prev) => [
        ...prev,
        { text: errorMsg, type: "error" },
      ]);

      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        setLoginErrors({
          email: serverErrors.email || serverErrors.username || "",
          password: serverErrors.password || "",
        });
      }
    }
  };

  const validateSignupFields = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      username: "",
      email: "",
      password: "",
      phone: "",
    };

    if (!signupName.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    } else if (!/^[A-Za-z\s-]+$/.test(signupName)) {
      newErrors.name =
        "Full name must contain only letters, spaces, and hyphens";
      isValid = false;
    }

    if (!signupUsername.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (!/^[A-Za-z0-9]+$/.test(signupUsername)) {
      newErrors.username = "Username must contain only letters and numbers";
      isValid = false;
    } else if (signupUsername.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    if (!signupEmail.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!signupPassword) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (signupPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(signupPassword)
    ) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)";
      isValid = false;
    }

    if (signupPhone && !/^[6-9]\d{9}$/.test(signupPhone)) {
      newErrors.phone =
        "Phone number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9";
      isValid = false;
    }

    setSignupErrors(newErrors);
    if (!isValid) {
      Object.keys(newErrors).forEach((key) => {
        if (newErrors[key]) {
          setValidationMessages((prev) => [
            ...prev,
            { text: newErrors[key], type: "error" },
          ]);
        }
      });
    }
    return isValid;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setValidationMessages([]);
    if (!validateSignupFields()) {
      setIsSignupLoading(false);
      return;
    }
    setIsSignupLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/signup`,
        {
          name: signupName,
          email: signupEmail,
          username: signupUsername,
          password: signupPassword,
          phone: signupPhone || "",
          companyName: signupRole === "directBuilder" ? signupCompanyName : "",
        }
      );

      setUserId(response.data.userId);
      setShowOtp(true);
      resetOtpTimer();
      setIsSignupLoading(false);

      setValidationMessages([
        { text: "OTP has been sent to your email", type: "success" },
      ]);
    } catch (error) {
      setIsSignupLoading(false);
      const errorMsg = extractErrorMessage(error);
      setValidationMessages((prev) => [
        ...prev,
        { text: errorMsg, type: "error" },
      ]);

      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        setSignupErrors({
          name: serverErrors.name || "",
          username: serverErrors.username || "",
          email: serverErrors.email || "",
          password: serverErrors.password || "",
          phone: serverErrors.phone || "",
        });
      }
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setSignupName(value);
    if (!value.trim()) {
      setSignupErrors((prev) => ({ ...prev, name: "Full name is required" }));
    } else if (!/^[A-Za-z\s-]+$/.test(value)) {
      setSignupErrors((prev) => ({
        ...prev,
        name: "Full name must contain only letters, spaces, and hyphens",
      }));
    } else {
      setSignupErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setSignupUsername(value);
    if (!value.trim()) {
      setSignupErrors((prev) => ({
        ...prev,
        username: "Username is required",
      }));
    } else if (!/^[A-Za-z0-9]+$/.test(value)) {
      setSignupErrors((prev) => ({
        ...prev,
        username: "Username must contain only letters and numbers",
      }));
    } else if (value.length < 3) {
      setSignupErrors((prev) => ({
        ...prev,
        username: "Username must be at least 3 characters",
      }));
    } else {
      setSignupErrors((prev) => ({ ...prev, username: "" }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setSignupEmail(value);
    if (!value.trim()) {
      setSignupErrors((prev) => ({ ...prev, email: "Email is required" }));
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setSignupErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
    } else {
      setSignupErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setSignupPhone(value);
      if (value && !/^[6-9]\d{9}$/.test(value)) {
        setSignupErrors((prev) => ({
          ...prev,
          phone:
            "Phone number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9",
        }));
      } else {
        setSignupErrors((prev) => ({ ...prev, phone: "" }));
      }
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setSignupPassword(value);
    if (!value) {
      setSignupErrors((prev) => ({
        ...prev,
        password: "Password is required",
      }));
    } else if (value.length < 8) {
      setSignupErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters",
      }));
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(value)) {
      setSignupErrors((prev) => ({
        ...prev,
        password:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
      }));
    } else {
      setSignupErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  // Mobile view - stacked layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-100 font-sans p-4 overflow-auto">
        {(isLoginSuccess || isSignupSuccess) && (
          <LoginSuccessAnimation isSignup={isSignupSuccess} />
        )}
        
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

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Mobile header with image */}
          <div className="relative h-48">
            <img
              src={images[currentImageIndex].url}
              alt="Real Estate"
              className="w-full h-full object-cover brightness-90"
            />
            <div className="absolute bottom-4 left-4 text-white text-lg font-semibold">
              {images[currentImageIndex].text}
            </div>
          </div>

          {/* Mobile content area */}
          <div className="p-6">
            {!showOtp ? (
              !showSignup ? (
                // Mobile Login Form
                <>
                  <nav className="flex mb-4" aria-label="Breadcrumb">
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
                            Login
                          </span>
                        </div>
                      </li>
                    </ol>
                  </nav>

                  <h1 className="text-3xl font-bold mb-2">Hi there!</h1>
                  <p className="mb-6 text-gray-500">Welcome</p>
                  
                  <form onSubmit={handleLogin} noValidate>
                    <div className="mb-4">
                      <input
                        type="email"
                        placeholder="Your email or username"
                        className={`w-full border ${
                          loginErrors.email ? "border-red-500" : "border-gray-300"
                        } rounded-md p-3`}
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          setLoginErrors({ ...loginErrors, email: "" });
                        }}
                        required
                      />
                      {loginErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {loginErrors.email}
                        </p>
                      )}
                    </div>
                    <div className="relative mb-2">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Password"
                        className={`w-full border ${
                          loginErrors.password
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md p-3 pr-10`}
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          setLoginErrors((prev) => ({ ...prev, password: "" }));
                        }}
                        required
                      />
                      {loginErrors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {loginErrors.password}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                      >
                        {showLoginPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    <div className="text-right text-sm mb-6">
                      <a
                        href="/forgotpassword"
                        className="text-blue-500 hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-black text-white py-3 rounded-full mb-4 hover:opacity-90 transition flex items-center justify-center"
                      disabled={isLoginLoading}
                    >
                      {isLoginLoading ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={20} />
                          Logging In...
                        </>
                      ) : (
                        "Log In"
                      )}
                    </button>
                  </form>
                  <p className="text-sm text-center">
                    Don't have an account?{" "}
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => {
                        setShowSignup(true);
                        setValidationMessages([]);
                      }}
                    >
                      Sign up
                    </button>
                  </p>
                </>
              ) : (
                // Mobile Signup Form
                <>
                  <nav className="flex mb-4" aria-label="Breadcrumb">
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
                            Sign Up
                          </span>
                        </div>
                      </li>
                    </ol>
                  </nav>

                  <h1 className="text-3xl font-bold mb-4">Join Us!</h1>
                  <p className="mb-6 text-gray-500">
                    Create an account to continue
                  </p>
                  
                  <form onSubmit={handleSignup} noValidate>
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className={`w-full border ${
                          signupErrors.name ? "border-red-500" : "border-gray-300"
                        } rounded-md p-3`}
                        value={signupName}
                        onChange={handleNameChange}
                        required
                      />
                      {signupErrors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {signupErrors.name}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Username"
                        className={`w-full border ${
                          signupErrors.username
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md p-3`}
                        value={signupUsername}
                        onChange={handleUsernameChange}
                        required
                      />
                      {signupErrors.username && (
                        <p className="text-red-500 text-xs mt-1">
                          {signupErrors.username}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <input
                        type="email"
                        placeholder="Email"
                        className={`w-full border ${
                          signupErrors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md p-3`}
                        value={signupEmail}
                        onChange={handleEmailChange}
                        required
                      />
                      {signupErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {signupErrors.email}
                        </p>
                      )}
                    </div>
                    <div className="relative mb-4">
                      <div className="relative">
                        <input
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="Password"
                          className={`w-full border ${
                            signupErrors.password
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md p-3 pr-10`}
                          value={signupPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowSignupPassword(!showSignupPassword)
                          }
                          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                        >
                          {showSignupPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {signupErrors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {signupErrors.password}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <input
                        type="tel"
                        placeholder="Phone"
                        className={`w-full border ${
                          signupErrors.phone
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md p-3`}
                        value={signupPhone}
                        onChange={handlePhoneChange}
                      />
                      {signupErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {signupErrors.phone}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-black text-white py-3 rounded-full mb-4 hover:opacity-90 transition flex items-center justify-center"
                      disabled={isSignupLoading}
                    >
                      {isSignupLoading ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={20} />
                          Signing Up...
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                  </form>
                  <p className="text-sm text-center">
                    Already have an account?
                    <button
                      className="text-blue-500 hover:underline ml-1"
                      onClick={() => {
                        setShowSignup(false);
                        setValidationMessages([]);
                      }}
                    >
                      Log in
                    </button>
                  </p>
                </>
              )
            ) : (
              // Mobile OTP Verification
              <>
                <nav className="flex mb-4" aria-label="Breadcrumb">
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
                          OTP Verification
                        </span>
                      </div>
                    </li>
                  </ol>
                </nav>

                <h1 className="text-3xl font-bold mb-2">Verify OTP</h1>
                <p className="mb-6 text-gray-500">
                  We've sent a 6-digit code to your email
                </p>
                
                <form onSubmit={handleOtpSubmit}>
                  <div className="mb-6">
                    <div className="flex justify-between space-x-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                          key={index}
                          id={`otp-input-${index}`}
                          type="text"
                          maxLength="1"
                          value={otp[index]}
                          onChange={(e) => handleOtpChange(e, index)}
                          className={`w-10 h-12 text-center border ${
                            otpError ? "border-red-500" : "border-gray-300"
                          } rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-black`}
                          pattern="\d*"
                          inputMode="numeric"
                        />
                      ))}
                    </div>
                    {otpError && (
                      <p className="text-red-500 text-xs mt-2">{otpError}</p>
                    )}
                  </div>
                  <div className="mb-6 text-center">
                    {canResendOtp ? (
                      <button
                        type="button"
                        onClick={handleOtpResend}
                        className="text-blue-500 hover:underline"
                      >
                        Resend OTP
                      </button>
                    ) : (
                      <p className="text-gray-500">
                        Resend OTP in {otpResendTimer} seconds
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-full mb-4 hover:opacity-90 transition flex items-center justify-center"
                  >
                    Verify OTP
                  </button>
                </form>
                <p className="text-sm text-center">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                      setShowOtp(false);
                      setOtpError("");
                    }}
                  >
                    Back to Sign Up
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop view - side by side layout
  return (
    <div className="flex h-screen justify-center items-center bg-gray-100 font-sans px-4 py-10  overflow-hidden">
      {(isLoginSuccess || isSignupSuccess) && (
        <LoginSuccessAnimation isSignup={isSignupSuccess} />
      )}
      
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

      <div className="relative w-full max-w-7xl h-[90vh] bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Panels container */}
        <div
          className={`absolute top-0 left-0 w-full h-full flex transition-transform duration-700 ${
            showSignup ? "-translate-x-1/2" : "translate-x-0"
          }`}
        >
          {/* Login Panel */}
          <div className="w-1/2 flex flex-col justify-center items-center p-6 sm:p-10 bg-white relative">
            <nav
              className="flex mb-6 absolute top-4 left-4"
              aria-label="Breadcrumb"
            >
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
                      Login
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            <div className="w-full max-w-md">
              <h1 className="text-4xl sm:text-5xl font-bold mb-2">Hi there!</h1>
              <p className="mb-8 text-gray-500">Welcome</p>
              <form onSubmit={handleLogin} noValidate>
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Your email or username"
                    className={`w-full border ${
                      loginErrors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md p-3`}
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setLoginErrors({ ...loginErrors, email: "" });
                    }}
                    required
                  />
                  {loginErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {loginErrors.email}
                    </p>
                  )}
                </div>
                <div className="relative mb-2">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    className={`w-full border ${
                      loginErrors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md p-3 pr-10`}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    required
                  />
                  {loginErrors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {loginErrors.password}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                  >
                    {showLoginPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                <div className="text-right text-sm mb-6">
                  <a
                    href="/forgotpassword"
                    className="text-blue-500 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-full mb-4 hover:opacity-90 transition flex items-center justify-center"
                  disabled={isLoginLoading}
                >
                  {isLoginLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Logging In...
                    </>
                  ) : (
                    "Log In"
                  )}
                </button>
              </form>
              <p className="text-sm text-center">
                Don't have an account?{" "}
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => {
                    setShowSignup(true);
                    setValidationMessages([]);
                  }}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>

          {/* Signup Panel */}
          {!showOtp ? (
            <div className="w-1/2 flex flex-col justify-center items-center p-6 sm:p-10 bg-white relative">
              <nav
                className="flex mb-6 absolute top-4 left-4"
                aria-label="Breadcrumb"
              >
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
                        Sign Up
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
              <div className="w-full max-w-md">
                <h1 className="text-4xl sm:text-5xl font-bold mb-2 mt-8">
                  Join Us!
                </h1>
                <p className="mb-8 text-gray-500">
                  Create an account to continue
                </p>
                <form onSubmit={handleSignup} noValidate>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className={`w-full border ${
                        signupErrors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md p-3`}
                      value={signupName}
                      onChange={handleNameChange}
                      required
                    />
                    {signupErrors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {signupErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Username"
                      className={`w-full border ${
                        signupErrors.username
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md p-3`}
                      value={signupUsername}
                      onChange={handleUsernameChange}
                      required
                    />
                    {signupErrors.username && (
                      <p className="text-red-500 text-xs mt-1">
                        {signupErrors.username}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <input
                      type="email"
                      placeholder="Email"
                      className={`w-full border ${
                        signupErrors.email
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md p-3`}
                      value={signupEmail}
                      onChange={handleEmailChange}
                      required
                    />
                    {signupErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {signupErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="relative mb-4">
                    <div className="relative">
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="Password"
                        className={`w-full border ${
                          signupErrors.password
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md p-3 pr-10`}
                        value={signupPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowSignupPassword(!showSignupPassword)
                        }
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                      >
                        {showSignupPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {signupErrors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {signupErrors.password}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <input
                      type="tel"
                      placeholder="Phone"
                      className={`w-full border ${
                        signupErrors.phone
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md p-3`}
                      value={signupPhone}
                      onChange={handlePhoneChange}
                    />
                    {signupErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {signupErrors.phone}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-full mb-4 hover:opacity-90 transition flex items-center justify-center"
                    disabled={isSignupLoading}
                  >
                    {isSignupLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Signing Up...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </form>
                <p className="text-sm text-center">
                  Already have an account?
                  <button
                    className="text-blue-500 hover:underline ml-1"
                    onClick={() => {
                      setShowSignup(false);
                      setValidationMessages([]);
                    }}
                  >
                    Log in
                  </button>
                </p>
              </div>
            </div>
          ) : (
            // OTP Verification Panel
            <div className="w-1/2 flex flex-col justify-center items-center p-6 sm:p-10 bg-white relative">
              <nav
                className="flex mb-6 absolute top-4 left-4"
                aria-label="Breadcrumb"
              >
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
                        OTP Verification
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
              <div className="w-full max-w-md">
                <h1 className="text-4xl sm:text-5xl font-bold mb-2">
                  Verify OTP
                </h1>
                <p className="mb-8 text-gray-500">
                  We've sent a 6-digit code to your email
                </p>
                <form onSubmit={handleOtpSubmit}>
                  <div className="mb-6">
                    <div className="flex justify-between space-x-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                          key={index}
                          id={`otp-input-${index}`}
                          type="text"
                          maxLength="1"
                          value={otp[index]}
                          onChange={(e) => handleOtpChange(e, index)}
                          className={`w-12 h-12 text-center border ${
                            otpError ? "border-red-500" : "border-gray-300"
                          } rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-black`}
                          pattern="\d*"
                          inputMode="numeric"
                        />
                      ))}
                    </div>
                    {otpError && (
                      <p className="text-red-500 text-xs mt-2">{otpError}</p>
                    )}
                  </div>
                  <div className="mb-6 text-center">
                    {canResendOtp ? (
                      <button
                        type="button"
                        onClick={handleOtpResend}
                        className="text-blue-500 hover:underline"
                      >
                        Resend OTP
                      </button>
                    ) : (
                      <p className="text-gray-500">
                        Resend OTP in {otpResendTimer} seconds
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-full mb-4 hover:opacity-90 transition flex items-center justify-center"
                  >
                    Verify OTP
                  </button>
                </form>
                <p className="text-sm text-center">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                      setShowOtp(false);
                      setOtpError("");
                    }}
                  >
                    Back to Sign Up
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right side image + text */}
        <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden rounded-r-2xl">
          <img
            src={images[currentImageIndex].url}
            alt="Real Estate"
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute bottom-12 left-12 text-white text-lg sm:text-xl font-semibold">
            {images[currentImageIndex].text}
          </div>
        </div>
      </div>
    </div>
  );
}