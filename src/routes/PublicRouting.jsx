import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/LocalStorage";
const PublicRoute = ({ children, restricted }) => {
  return getToken() && restricted ? (
    <Navigate to="/dashboard" />
  ) : (
    children
  );
};

export default PublicRoute;
