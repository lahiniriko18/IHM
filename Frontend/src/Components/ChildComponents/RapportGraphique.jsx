import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useSidebar } from "../Context/SidebarContext";
function RapportGraphique() {
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
  const data = [
    { name: "L1IG", value: 14},
    { name: "L1GB", value: 8 },
    { name: "L1SR", value: 5 },
    { name: "L2GB", value: 8 },
    { name: "L2IG", value: 20 },
    { name: "L2SR", value: 1 },
  ];
  const data01 = [
    {
      name: "Lundi",
      nb: 20,
    },
    {
      name: "Mardi",
      nb: 10,
    },
    {
      name: "Mercredi",
      nb: 7,
    },
    {
      name: "Jeudi",
      nb: 6,
    },
    {
      name: "vendredi",
      nb: 15,
    },
    {
      name: "Samedi",
      nb: 7,
    },

  ];
  const data02 = [
    { mois: "Janvier", valeur: 4000 },
    { mois: "Février", valeur: 3000 },
    { mois: "Mars", valeur: 2000 },
    { mois: "Avril", valeur: 2780 },
    { mois: "Mai", valeur: 1890 },
    { mois: "Juin", valeur: 2390 },
    { mois: "Juillet", valeur: 3490 },
    { mois: "Août", valeur: 4200 },
    { mois: "Septembre", valeur: 3100 },
    { mois: "Octobre", valeur: 3600 },
    { mois: "Novembre", valeur: 2800 },
    { mois: "Décembre", valeur: 4100 },
  ];
  return (
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
          className="cursor-pointer text-md "
          onClick={() => navigateTo("statistique")}
        >
          Rapports spécifiques
        </p>

        <p
          className="cursor-pointer text-md text-blue-400 font-bold"
          onClick={() => navigateTo("graphique")}
        >
          Visualisation
        </p>
      </div>
      <h1 className="mt-4 text-gray-500">Graphique de visualisation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-28">
        <div className="bg-white rounded border p-4 flex items-center justify-center h-[400px] flex-col">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center font-bold">
            Répartition des matieres par Niveau
          </p>
        </div>

        <div className="bg-white rounded border p-4 flex items-center justify-center h-[400px]  flex-col">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data01}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="nb" fill="#4953aa" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center font-bold">
            Nombre des salles occupé par semaine
          </p>
        </div>
        <div className="bg-white rounded border p-4 flex  justify-center h-[400px]  flex-col">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data02}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" interval={0} angle={-30} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="valeur"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-center font-bold">
            Évolution du nombre d’EDT créés par mois
          </p>
        </div>
      </div>
    </div>
  );
}

export default RapportGraphique