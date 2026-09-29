export const setToken = (token) => {
  localStorage.setItem("access_token", token);
};

export const setRefreshToken = (token) => {
  if (token) localStorage.setItem("refresh_token", token);
};

export const getToken = () => {
  var data = localStorage.getItem("access_token", "");
  if (data) {
    return data;
  } else return null;
};

export const removeToken = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
