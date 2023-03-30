/* eslint-disable no-console */
import axios from "axios";
import { getToken } from "./LocalStorage";
const BASE_URL = process.env.REACT_APP_LINK_BASE_URL;
const baseInstance = axios.create({
  baseURL: BASE_URL,
});

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
      data: res.data,
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
      data: res.data,
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
      data: res.data,
    };
  } catch (err) {
    return err.response;
  }
};
export const postApiWithoutAuth = async (url, body) => {
  try {
    const res = await baseInstance.post(url, body);
    return res.data;
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
