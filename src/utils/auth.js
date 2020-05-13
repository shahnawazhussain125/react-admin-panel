export const isUserAuthenticated = () => {
  let admin = JSON.parse(localStorage.getItem("admin"));
  return admin ? true : false;
};
