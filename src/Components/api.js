

import axios from "axios";

const baseUrl = "https://crm-bcgg.onrender.com";

// Helper function to extract error messages
const extractErrorMessage = (error) => {
  if (error.response) {
    return error.response.data.message || 
           error.response.data.error || 
           'An error occurred';
  } else if (error.request) {
    return 'No response from server';
  } else {
    return error.message || 'An unexpected error occurred';
  }
};

export const AuthResetPassword = async ({ token, newPassword }) => {
  try {
    const res = await axios.post(
      `${baseUrl}/api/auth/reset-password/${token}`, 
      { newPassword }
    );
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};