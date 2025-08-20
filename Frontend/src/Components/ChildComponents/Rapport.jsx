import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../Context/SidebarContext";
function Rapport() {
  const navigate = useNavigate();
  const { isReduire } = useSidebar();
  const [stats, setStats] = useState({});
  const getStats = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/statistique/effectif"
      );
      if (response.status != 200) {
        throw new Error(
          `Erreur lors de la récupération des données: Code ${response.status}`
        );
      }

      setStats(response.data);
      console.log("Statistiques récupérées avec succès:", response.data);
    } catch (error) {
      console.log("Erreur:", error.message);
    } finally {
      console.log("La tâche est terminée");
    }
  };
  const navigateTo = (path) => {
    if (path === "rapport") {
      navigate("/rapport");
    } else if (path === "statistique") {
      navigate("/rapport/rapport-filtrage");
    } else if (path === "graphique") {
      navigate("/rapport/rapport-graphique");
    }
  };
  useEffect(() => {
    getStats();
  }, []);
  return (
    <>
      <div
        className={`${
          isReduire
            ? "fixed h-screen right-0 top-14 left-20 p-5 z-40 flex flex-col gap-3 overflow-auto bg-white rounded  transition-all duration-700"
            : "fixed h-screen right-0 top-14 left-56 p-5 z-40 flex flex-col gap-3 overflow-auto bg-white rounded  transition-all duration-700"
        }`}
      >
        <div className="fixed w-full top-16 flex items-center gap-4">
          <p
            className="cursor-pointer font-bold text-md text-blue-400"
            onClick={() => navigateTo("rapport")}
          >
            Stat General
          </p>
          <p
            className="cursor-pointer text-md"
            onClick={() => navigateTo("statistique")}
          >
            Rapports spécifiques
          </p>

          <p
            className="cursor-pointer text-md"
            onClick={() => navigateTo("graphique")}
          >
            Visualisation
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-between w-full pe-2 mt-8">
          <div className="bg-white shadow w-40 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
            <p className="font-bold">{stats.edt ?? 0}</p>
            <div className="flex items-center gap-3">
              <img
                src="/Icons/icons8-objet-avec-durée-50.png"
                alt="Edt"
                className="w-5"
              />
              <p>Edt créer</p>
            </div>
          </div>

          <div className="bg-white shadow w-40 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
            <p className="font-bold">{stats.professeur ?? 0}</p>
            <div className="flex items-center gap-3">
              <img
                src="/Icons/icons8-prof-60.png"
                alt="Professeur"
                className="w-5"
              />
              <p>Professeur</p>
            </div>
          </div>

          <div className="bg-white shadow w-40 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
            <p className="font-bold">{stats.matiere ?? 0}</p>
            <div className="flex items-center gap-3">
              <img src="/Icons/cahier.png" alt="Matiere" className="w-5" />
              <p>Matière</p>
            </div>
          </div>
          <div className="bg-white shadow w-40 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
            <p className="font-bold">{stats.salle ?? 0}</p>
            <div className="flex items-center gap-3">
              <img
                src="/Icons/icons8-école-48.png"
                alt="Classe"
                className="w-5"
              />
              <p>Salle</p>
            </div>
          </div>
          <div className="bg-white shadow w-40 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
            <p className="font-bold">{stats.classe ?? 0}</p>
            <div className="flex items-center gap-3">
              <img
                src="/Icons/icons8-école-48.png"
                alt="Classe"
                className="w-5"
              />
              <p>Classe</p>
            </div>
          </div>
          <div className="bg-white shadow w-40 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
            <p className="font-bold">{stats.mention ?? 0}</p>
            <div className="flex items-center gap-3">
              <img src="/Icons/mention.png" alt="Mention" className="w-5" />
              <p>Mention</p>
            </div>
          </div>
          <div className="bg-white shadow w-40 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
            <p className="font-bold">{stats.parcours ?? 0}</p>
            <div className="flex items-center gap-3">
              <img src="/Icons/mention.png" alt="Mention" className="w-5" />
              <p>Parcours</p>
            </div>
          </div>
        </div>
        <h1 className="mt-2 text-blue-400">Tableau recaputilatif</h1>
        <div className="w-full border rounded-t-lg overflow-hidden">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Nom</th>
                <th className="px-4 py-2 text-left">Nombre</th>
              </tr>
            </thead>
            <tbody>
              {[
                { nom: "Edt créer", nombre: stats.edt ?? 0 },
                { nom: "Professeur", nombre: stats.professeur ?? 0 },
                { nom: "Matière", nombre: stats.matiere ?? 0 },
                { nom: "Salle", nombre: stats.salle ?? 0 },
                { nom: "Classe", nombre: stats.classe ?? 0 },
                { nom: "Mention", nombre: stats.mention ?? 0 },
                { nom: "Parcours", nombre: stats.parcours ?? 0 },
              ].map((item, idx) => (
                <tr
                  key={item.nom}
                  className="border-b transition-all duration-300  hover:bg-gray-100"
                >
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{item.nom}</td>
                  <td className="px-4 py-2">{item.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Rapport;
