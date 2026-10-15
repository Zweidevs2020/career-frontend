export const ACCOUNT_VIEWS = {
  COUNSELLOR: "counsellor",
  STUDENT: "student",
};

const ACTIVE_VIEW_KEY = "myguidance_active_view";

export const getActiveAccountView = () =>
  sessionStorage.getItem(ACTIVE_VIEW_KEY);

export const setActiveAccountView = (view) => {
  if (Object.values(ACCOUNT_VIEWS).includes(view)) {
    sessionStorage.setItem(ACTIVE_VIEW_KEY, view);
  }
};

export const clearActiveAccountView = () => {
  sessionStorage.removeItem(ACTIVE_VIEW_KEY);
};
