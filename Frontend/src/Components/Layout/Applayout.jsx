import React from 'react'
import Headerbar from '../Navbar&Header/Headerbar'
import Navbar from '../Navbar&Header/Navbar'
import { Outlet } from 'react-router-dom'

function Applayout() {
  return (
    <>
      <Navbar />
      <Headerbar />
      <Outlet />
    </>
  )
}

export default Applayout