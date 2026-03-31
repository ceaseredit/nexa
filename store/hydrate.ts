export const loadUser = () => {
  if (typeof window === "undefined") return null;
  return JSON.parse(localStorage.getItem("user") || "null");
};

export const loadAdmin = () => {
  if (typeof window === "undefined") return null;
  return JSON.parse(localStorage.getItem("admin") || "null");
};
