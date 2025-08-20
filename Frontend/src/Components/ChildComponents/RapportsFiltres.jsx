import { useNavigate } from "react-router-dom";
import Creatable from "react-select/creatable";
import { useSidebar } from "../Context/SidebarContext";
function RapportsFiltres() {
    const navigate = useNavigate();
  const { isReduire } = useSidebar();
  const navigateTo = (path) => {
    if (path === "rapport") {
      navigate("/rapport");
    } else if (path === "statistique") {
      navigate("/rapport/rapport-filtrage");
    } else if (path === "graphique") {
      navigate("/rapport/rapport-graphique");
    }
  };
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
            className="cursor-pointer  text-md "
            onClick={() => navigateTo("rapport")}
          >
            Stat General
          </p>
          <p
            className="cursor-pointer text-md font-bold text-blue-400"
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
        <h1 className="mt-4">Donnée specifique du professeur</h1>
        <div className="bg-white top-32 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="flex flex-col ">
              <Creatable isClearable placeholder="Rechercher un professeur" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-2 items-center">
              <p>Date de debut</p>
              <input
                type="date"
                className="border rounded p-1"
                placeholder="Date de debut"
              />
            </div>
            <div className="flex gap-2 items-center">
              <p>Date de fin</p>
              <input
                type="date"
                className="border rounded p-1"
                placeholder="Date de fin"
              />
            </div>
          </div>
          <div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              Imprimer le rapport
            </button>
          </div>
        </div>
        <div className="border border-gray-400 rounded p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/Icons/icons8-prof-60.png"
              alt="Professeur"
              className="w-6"
            />
            <p>Professeur : </p>
          </div>
          <div className="flex items-center gap-2">
            <img
              src="/Icons/icons8-école-48.png"
              alt="Classe"
              className="w-6"
            />
            <p>Classe:</p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/Icons/cahier.png" alt="Matiere" className="w-6" />
            <p>Matière : </p>
          </div>
          <div className="flex items-center gap-2">
            <img
              src="/Icons/icons8-objet-avec-durée-50.png"
              alt="Edt"
              className="w-6"
            />
            <p>Nombre d'heure : </p>
          </div>
        </div>
        <table className="w-full text-sm border-black border-collapse">
          <thead className="text-lef">
            <th className="border-r max-w-10 border-b border-black border-t-0 border-l-0"></th>
            <th className="border border-black">Lundi</th>
            <th className="border border-black">Mardi</th>
            <th className="border border-black">Mercredi</th>
            <th className="border border-black">Jeudi</th>
            <th className="border border-black">Vendredi</th>
            <th className="border border-black">Samedi</th>
          </thead>
          <tbody className="">
            <tr className="border">
              <td className="border border-black min-h-24">08h-10h</td>
              <td className="border border-black min-h-24">Math</td>
              <td className="border border-black min-h-24">Physique</td>
              <td className="border border-black min-h-24">Anglais</td>
              <td className="border border-black min-h-24">Histoire</td>
              <td className="border border-black min-h-24">Géographie</td>
              <td className="border border-black min-h-24">Sport</td>
            </tr>
            <tr className="border">
              <td className="border border-black min-h-24">10h-12h</td>
              <td className="border border-black min-h-24">Chimie</td>
              <td className="border border-black min-h-24">Biologie</td>
              <td className="border border-black min-h-24">Informatique</td>
              <td className="border border-black min-h-24">Philosophie</td>
              <td className="border border-black min-h-24">Arts Plastiques</td>
              <td className="border border-black min-h-24">Musique</td>
            </tr>
            <tr className="border">
              <td className="border border-black min-h-24">12h-14h</td>
              <td className="border border-black min-h-24">Pause Déjeuner</td>
              <td className="border border-black min-h-24">Pause Déjeuner</td>
              <td className="border border-black min-h-24">Pause Déjeuner</td>
              <td className="border border-black min-h-24">Pause Déjeuner</td>
              <td className="border border-black min-h-24">Pause Déjeuner</td>
              <td className="border border-black min-h-24">Pause Déjeuner</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default RapportsFiltres;
