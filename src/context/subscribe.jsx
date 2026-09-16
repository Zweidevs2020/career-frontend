import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getApiWithAuth } from "../utils/api"; // Your API call utility
import { API_URL } from "../utils/constants";
import { getToken } from "../utils/LocalStorage"; // Your token utility

const SubscribeContext = createContext();
const SCHOOL_SELECTION_PENDING = "myguidance_school_selection_pending";

const readPendingSchoolSelection = () => {
  try {
    return Boolean(getToken()) && sessionStorage.getItem(SCHOOL_SELECTION_PENDING) === "true";
  } catch {
    return false;
  }
};

export const useSubscribe = () => useContext(SubscribeContext);

export const SubscribeProvider = ({ children }) => {
  const [subscribe, setSubscribe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requiresSchoolSelection, setRequiresSchoolSelection] = useState(readPendingSchoolSelection);

  const updateSchoolSelection = useCallback((required) => {
    try {
      if (required) sessionStorage.setItem(SCHOOL_SELECTION_PENDING, "true");
      else sessionStorage.removeItem(SCHOOL_SELECTION_PENDING);
    } catch {
      // The current session still uses the in-memory requirement.
    }
    setRequiresSchoolSelection(required);
  }, []);

  const getUserData = useCallback(async () => {
    try {
      const token = getToken();
      if (token) {
        const response = await getApiWithAuth(API_URL.GETUSER);
        if (response?.data?.status === 200) {
          console.log("payload api", response.data);
          setSubscribe(response?.data?.data?.is_subscribed);
          if (typeof response?.data?.data?.requires_school_selection === "boolean") {
            updateSchoolSelection(response.data.data.requires_school_selection);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user data", error);
      setSubscribe(false); // If error occurs, assume not subscribed
    } finally {
      setLoading(false); // Once check is complete, stop loading
    }
  }, [updateSchoolSelection]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);
  console.log(subscribe, "from context");
  return (
    <SubscribeContext.Provider value={{ subscribe, loading, setSubscribe, requiresSchoolSelection, updateSchoolSelection }}>
      {children}
    </SubscribeContext.Provider>
  );
};
