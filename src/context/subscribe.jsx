import React, { createContext, useContext, useState, useEffect } from "react";
import { getApiWithAuth } from "../utils/api"; // Your API call utility
import { API_URL } from "../utils/constants";
import { getToken } from "../utils/LocalStorage"; // Your token utility

const SubscribeContext = createContext();

export const useSubscribe = () => useContext(SubscribeContext);

export const SubscribeProvider = ({ children }) => {
  const [subscribe, setSubscribe] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    try {
      const token = getToken();
      if (token) {
        const response = await getApiWithAuth(API_URL.GETUSER);
        if (response?.data?.status === 200) {
          console.log("payload api", response.data);
          setSubscribe(response?.data?.data?.is_subscribed);
        }
      }
    } catch (error) {
      console.error("Error fetching user data", error);
      setSubscribe(false); // If error occurs, assume not subscribed
    } finally {
      setLoading(false); // Once check is complete, stop loading
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  console.log(subscribe, "from context");
  return (
    <SubscribeContext.Provider value={{ subscribe, loading, setSubscribe }}>
      {children}
    </SubscribeContext.Provider>
  );
};
