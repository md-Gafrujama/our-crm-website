import React from "react";
import { Navigate, Outlet } from "react-router-dom";
function ProtectedRoute() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  return isLoggedIn === "true" 
    ? React.createElement(Outlet) 
    : React.createElement(Navigate, { to: "/login" });
}
export default ProtectedRoute;