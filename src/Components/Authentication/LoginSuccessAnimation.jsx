import React, { useEffect, useState } from 'react';

const LoginSuccessAnimation = ({ isSignup }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Hide after 3 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-green-500 text-white rounded-lg p-6 shadow-lg flex items-center space-x-4 animate-bounce-in">
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <p className="text-lg font-semibold">
          {isSignup ? 'Successfully Signed Up!' : 'Successfully Logged In!'}
        </p>
      </div>
    </div>
  );
};

// Custom animation for bounce-in effect
const animationStyles = `
  @keyframes bounceIn {
    0% {
      transform: scale(0.3);
      opacity: 0;
    }
    50% {
      transform: scale(1.05);
      opacity: 1;
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }
  .animate-bounce-in {
    animation: bounceIn 0.6s ease-out;
  }
`;

// Inject animation styles
const styleSheet = document.createElement("style");
styleSheet.innerText = animationStyles;
document.head.appendChild(styleSheet);

export default LoginSuccessAnimation;