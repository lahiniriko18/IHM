import "./App.css";
import { createBrowserRouter, Route, RouterProvider, createRoutesFromElements } from 'react-router-dom'
import Dashboard from "./Components/ChildComponents/Dashboard";
import Applayout from "./Components/Layout/Applayout";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Applayout />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        }
      ]
    }
  ])
  return <RouterProvider router={router} />
}
export default App;
