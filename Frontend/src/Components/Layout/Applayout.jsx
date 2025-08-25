// src/Components/Layout/Applayout.jsx
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { SidebarProvider } from "../Context/SidebarContext";
import Headerbar from "../Navbar&Header/Headerbar";
import Navbar from "../Navbar&Header/Navbar";
import RouteChangeTracker from "../Utils/RouteChangeTracker";

function Applayout() {
  return (
    <SidebarProvider>
      <Navbar />
      <Headerbar />
      <RouteChangeTracker />
      <Outlet />
      <ToastContainer />
    </SidebarProvider>
  );
}
export default Applayout;
