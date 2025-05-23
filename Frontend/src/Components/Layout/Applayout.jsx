// src/Components/Layout/Applayout.jsx
import React, { useState } from 'react';
import Headerbar from '../Navbar&Header/Headerbar';
import Navbar from '../Navbar&Header/Navbar';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '../Context/SidebarContext';
import RouteChangeTracker from '../Utils/RouteChangeTracker';


function Applayout() {
  const [status, setStatus] = useState(false)
  return (
    <SidebarProvider>
      <Navbar />
      <Headerbar />
      <RouteChangeTracker />
      <Outlet />
    </SidebarProvider>
  );
}
export default Applayout;
