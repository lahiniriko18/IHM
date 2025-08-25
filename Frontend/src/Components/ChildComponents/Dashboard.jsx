import axios from "axios";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSidebar } from "../Context/SidebarContext";

function CardStat({ value, icon, label }) {
  return (
    <div className="bg-white flex-1 min-w-[150px] flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
      <p className="font-bold">{value ?? 0}</p>
      <div className="flex items-center gap-3">
        <img src={icon} alt={label} className="w-5" />
        <p>{label}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [listeEDT, setListeEdt] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const getStats = async () => {
    try {
      const { data, status } = await axios.get(
        "http://127.0.0.1:8000/api/statistique/effectif"
      );
      if (status !== 200) throw new Error("Erreur API stats");

      setStats(data);
      setData(
        Object.entries(data).map(([key, value]) => ({
          name: key,
          valeur: value,
        }))
      );
    } catch (error) {
      console.error("Erreur:", error.message);
    }
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const { data, status } = await axios.get(
        "http://127.0.0.1:8000/api/edt/dernier"
      );
      if (status !== 200) throw new Error("Erreur API EDT");

      setListeEdt([data]);
    } catch (error) {
      console.error("Erreur :", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStats();
    getData();
  }, []);

  const { isReduire } = useSidebar();

  return (
    <div
      className={`${
        isReduire
          ? "fixed h-screen right-0 top-12 left-16"
          : "fixed h-screen right-0 top-12 left-52"
      } ps-5 pt-3 z-40 flex flex-col gap-5 overflow-auto duration-700 transition-all`}
    >
      {/* --- Stats --- */}
      <div className="flex flex-wrap gap-4 justify-between w-full pe-2">
        <CardStat
          value={stats.edt}
          icon="/Icons/icons8-objet-avec-durée-50.png"
          label="Edt créer"
        />
        <CardStat
          value={stats.professeur}
          icon="/Icons/icons8-prof-60.png"
          label="Professeur"
        />
        <CardStat
          value={stats.matiere}
          icon="/Icons/cahier.png"
          label="Matière"
        />
        <CardStat
          value={stats.classe}
          icon="/Icons/icons8-école-48.png"
          label="Classe"
        />
        <CardStat
          value={stats.parcours}
          icon="/Icons/mention.png"
          label="Parcours"
        />
      </div>

      {/* --- Chart + Calendar --- */}
      <div className="flex flex-col lg:flex-row justify-between w-full pe-2 gap-4">
        <div className="flex-1 p-4 bg-white rounded flex flex-col gap-2">
          <p className="font-bold text-bleu">Récapitulatif</p>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="valeur"
                  stroke="#2139e2"
                  fill="#2139e2"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-full lg:w-[30%] p-4 bg-white rounded">
          <p className="font-bold text-bleu">Calendrier</p>
          <Calendar />
        </div>
      </div>

      {/* --- Table --- */}
      <div className="bg-white border w-full p-4 rounded flex flex-col gap-2">
        <p className="text-bleu font-bold">Derniers emplois du temps créés</p>

        {isLoading ? (
          <div className="w-full h-40 flex flex-col items-center justify-center mt-[10%]">
            <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-2">Chargement des données...</p>
          </div>
        ) : listeEDT.length === 0 ||
          listeEDT.every((obj) => Object.keys(obj).length === 0) ? (
          <div className="w-full h-40 flex flex-col items-center justify-center">
            <img src="/Icons/vide.png" alt="Aucune donnée" className="w-14" />
            <p className="text-gray-400">Aucune donnée trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg mt-4 bg-white shadow border">
            <table className="table-auto w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Classe</th>
                  <th className="px-4 py-3">Début</th>
                  <th className="px-4 py-3">Fin</th>
                  <th className="px-4 py-3">Utilisateur</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listeEDT.map((EDT, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-2 text-center">{index + 1}</td>
                    <td className="px-4 py-2 text-center">
                      {EDT.niveauParcours}
                    </td>
                    <td className="px-4 py-2 text-center">{EDT.dateDebut}</td>
                    <td className="px-4 py-2 text-center">{EDT.dateFin}</td>
                    <td className="px-4 py-2 text-center">Avotra</td>
                    <td className="px-4 py-2 text-center">
                      <button className="p-1 rounded hover:bg-gray-200">
                        <img
                          src="/Icons/afficher.png"
                          alt="Voir"
                          className="w-5"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
