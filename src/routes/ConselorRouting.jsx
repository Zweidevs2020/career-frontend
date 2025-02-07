import React from "react";
import { Navigate } from "react-router-dom";

// Function to get token from cookies
const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return value;
    }
  }
  return null; // Return null if cookie not found
};

const ConselorPrivateRoute = ({ children, restricted = false }) => {
  const token = getCookie("conselorToken"); // Get token from cookies

  return token ? children : <Navigate to="/" />;
};

export default ConselorPrivateRoute;
