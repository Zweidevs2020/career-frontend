export const setToken = (token) => {
  localStorage.setItem("access_token", token);
};

export const getToken = () => {
  var data = localStorage.getItem("access_token", "");
  if (data) {
    return data;
  } else return null;
};

export const removeToken = () => {
  localStorage.removeItem("access_token");
};