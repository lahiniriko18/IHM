import "./App.css";
// import 'react-calendar/dist/Calendar.css';
import { createBrowserRouter, Route, RouterProvider, createRoutesFromElements, redirect } from 'react-router-dom'
import Dashboard from "./Components/ChildComponents/Dashboard";
import Professeur from "./Components/ChildComponents/Professeur";
import Salle from "./Components/ChildComponents/Salle";
import Classe from "./Components/ChildComponents/Classe";
import Matiere from "./Components/ChildComponents/Matiere";
import Parcours from "./Components/ChildComponents/Parcours";
import Utilisateur from "./Components/ChildComponents/Utilisateur";
import Parametre from "./Components/ChildComponents/Parametre";
import Edt from "./Components/ChildComponents/Edt";
import Mention from "./Components/ChildComponents/Mention";
import Rapport from "./Components/ChildComponents/Rapport";
import Applayout from "./Components/Layout/Applayout";
import ProfesseurDetails from "./Components/ChildComponents/ProfesseurDetails";
import ParametreInfo from "./Components/ChildComponents/ParametreInfo";
import ParametreSecurite from "./Components/ChildComponents/ParametreSecurite";
import ParametreProfile from "./Components/ChildComponents/ParametreProfile";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Applayout />,
      children: [
        {
          path: "",
          loader: () => redirect("/dashboard")
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "professeur",
          element: <Professeur />
        },
        {
          path: "professeur/detail/:id",
          element: <ProfesseurDetails />
        },
        {
          path: "salle",
          element: <Salle />,
        },
        {
          path: "matiere",
          element: <Matiere />,
        },
        {
          path: "classe",
          element: <Classe />,
        },
        {
          path: "mention",
          element: <Mention />,
        },
        {
          path: "parcours",
          element: <Parcours />,
        },
        {
          path: "edt",
          element: <Edt />,
        },
        {
          path: "parametre",
          element: <Parametre />,
        },
        {
          path: "parametre/info-etablisement",
          element: <ParametreInfo />,
        },
        {
          path: "parametre/securite",
          element: <ParametreSecurite />,
        },
        {
          path: "parametre/profile",
          element: <ParametreProfile />,
        },
        {
          path: "rapport",
          element: <Rapport />,
        },
        {
          path: "utilisateur",
          element: <Utilisateur />,
        },
      ]
    }
  ])

  return <RouterProvider router={router} />
}
export default App;
