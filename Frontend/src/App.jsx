import "./App.css";
// import 'react-calendar/dist/Calendar.css';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Classe from "./Components/ChildComponents/Classe";
import Dashboard from "./Components/ChildComponents/Dashboard";
import Edt from "./Components/ChildComponents/Edt";
import CreateNewEdt from "./Components/ChildComponents/Edt/CreateNewEdt";
import EditEdt from "./Components/ChildComponents/Edt/EditEdt";
import EdtRead from "./Components/ChildComponents/Edt/EdtRead";
import Matiere from "./Components/ChildComponents/Matiere";
import Mention from "./Components/ChildComponents/Mention";
import NotFound from "./Components/ChildComponents/NotFound";
import ParametreInfo from "./Components/ChildComponents/ParametreInfo";
import ParametreProfile from "./Components/ChildComponents/ParametreProfile";
import ParametreSecurite from "./Components/ChildComponents/ParametreSecurite";
import Parcours from "./Components/ChildComponents/Parcours";
import Professeur from "./Components/ChildComponents/Professeur";
import ProfesseurDetails from "./Components/ChildComponents/ProfesseurDetails";
import Rapport from "./Components/ChildComponents/Rapport";
import RapportGraphique from "./Components/ChildComponents/RapportGraphique";
import RapportsFiltres from "./Components/ChildComponents/RapportsFiltres";
import Salle from "./Components/ChildComponents/Salle";
import Utilisateur from "./Components/ChildComponents/Utilisateur";
import Applayout from "./Components/Layout/Applayout";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Applayout />,
      children: [
        {
          path: "",
          loader: () => redirect("/dashboard"),
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "professeur",
          element: <Professeur />,
        },
        {
          path: "professeur/detail/:id",
          element: <ProfesseurDetails />,
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
          path: "edt/nouveau-edt",
          element: <CreateNewEdt />,
        },
        {
          path: "edt/edit-edt",
          element: <EditEdt />,
        },
        {
          path: "edt/affichage-edt",
          element: <EdtRead />,
        },
        {
          path: "parametre",
          element: <ParametreInfo />,
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
          path: "rapport/rapport-graphique",
          element: <RapportGraphique />,
        },
        {
          path: "rapport/rapport-filtrage",
          element: <RapportsFiltres />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
        {
          path: "utilisateur",
          element: <Utilisateur />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
export default App;
