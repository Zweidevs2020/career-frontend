/* eslint-disable no-console */
import { message } from "antd";
import axios from "axios";
import { getToken } from "./LocalStorage";
const BASE_URL = process.env.REACT_APP_BASE_URL;
console.log("Base URL:", BASE_URL);
console.log("Axios Version:", process.env.REACT_APP_BASE_URL);
const baseInstance = axios.create({
  baseURL: BASE_URL,
});

let isHandlingUnauthorized = false;

const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return value;
    }
  }
  return null;
};

const clearAuthStorage = () => {
  localStorage.clear();
  sessionStorage.clear();

  document.cookie.split(";").forEach((cookie) => {
    document.cookie = cookie
      .replace(/^ +/, "")
      .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
  });

  delete baseInstance.defaults.headers.common["Authorization"];
};

const handleUnauthorizedResponse = () => {
  const hasActiveSession = getToken() || getCookie("conselorToken");

  if (!hasActiveSession || isHandlingUnauthorized) {
    return;
  }

  isHandlingUnauthorized = true;
  clearAuthStorage();
  message.warning("Your session has expired. Please sign in again.");

  setTimeout(() => {
    window.location.replace("/");
  }, 700);
};

const isUserMeRequest = (config) => {
  try {
    const requestUrl = new URL(config?.url || "", config?.baseURL || BASE_URL);
    return requestUrl.pathname.replace(/\/$/, "") === "/user/me";
  } catch (error) {
    return (config?.url || "").replace(/\/$/, "") === "user/me";
  }
};

baseInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.response?.status === 401 &&
      isUserMeRequest(error?.config)
    ) {
      handleUnauthorizedResponse();
    }

    return Promise.reject(error);
  }
);

export const getApiWithoutAuth = async (url) => {
  try {
    const res = await baseInstance.get(url);
    return {
      data: res.data,
    };
  } catch (err) {
    return err.response;
  }
};

export const getApiWithAuth = async (url) => {
  await setApiHeader();
  try {
    const res = await baseInstance.get(url);

    return {
      data: res,
    };
  } catch (err) {
    return err.response;
  }
};

export const patchApiWithAuth = async (url, body) => {
  await setApiHeader();
  try {
    const res = await baseInstance.patch(url, body);
    return {
      data: res,
    };
  } catch (err) {
    return err.response;
  }
};
export const patchApiWithOutAuth = async (url, body) => {
  try {
    const res = await baseInstance.patch(url, body);
    return {
      data: res.data,
    };
  } catch (err) {
    return err.response;
  }
};

export const putApiWithAuth = async (url, body) => {
  await setApiHeader();
  try {
    const res = await baseInstance.put(url, body);

    return {
      data: res.data,
    };
  } catch (err) {
    return err.response;
  }
};

export const deleteApiWithAuth = async (url) => {
 
  await setApiHeader();
  try {
    const res = await baseInstance.delete(url);

    return {
      data: res,
    };
  } catch (err) {
    return err.response;
  }
};

export const postApiWithAuth = async (url, body) => {
  await setApiHeader();
  try {
    const res = await baseInstance.post(url, body);

    return {
      data: res,
    };
  } catch (err) {
    return err.response;
  }
};
export const postApiWithoutAuth = async (url, body) => {
  try {
    const res = await baseInstance.post(url, body);
    return res;
  } catch (err) {
    return err.response;
  }
};


export const deleteMultipleStudents = async (student_ids) => {
  const token = getCookie("conselorToken");
  try {
    const res = await baseInstance.post(
      `user/counselor/delete-multiple/`,
      { student_ids: student_ids },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return {
      data: res.data,
      status: res.status,
    };
  } catch (err) {
    return err.response;
  }
};


export const postFormDataAPI = async (url, body) => {
  baseInstance.defaults.headers.common["Content-Type"] = "multipart/form-data";
  await setApiHeader();
  try {
    const res = await baseInstance.post(url, body);
    return res.data;
  } catch (err) {
    return err.response;
  }
};

const setApiHeader = async () => {
  baseInstance.defaults.headers.common["Authorization"] =
    "Bearer " + getToken();
};
