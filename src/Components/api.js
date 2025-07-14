

import axios from "axios";
import BASE_URL from "../service/api";


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
      `${BASE_URL}/api/auth/reset-password/${token}`, 
      { newPassword }
    );
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};