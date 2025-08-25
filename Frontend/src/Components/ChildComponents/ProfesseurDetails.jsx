import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSidebar } from "../Context/SidebarContext";

function ProfesseurDetails() {
  const { isReduire } = useSidebar();
  const { id } = useParams();

  const [listeProfesseur, setListeProfesseur] = useState({});
  const [matieresAvecNiveaux, setMatieresAvecNiveaux] = useState([]);

  // ---------- Fetch Data ----------
  const getMatiereByOne = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/matiere/${id}`
      );
      if (response.status !== 200)
        throw new Error("Erreur code : " + response.status);
      return response.data;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/professeur/detail/${id}`
      );
      if (response.status !== 200)
        throw new Error("Erreur code : " + response.status);

      setListeProfesseur(response.data);

      if (response.data.matieres?.length > 0) {
        const matieresDetails = await Promise.all(
          response.data.matieres.map(async (m) => {
            const matiereDetail = await getMatiereByOne(m.numMatiere);
            return {
              ...m,
              niveaux: matiereDetail ? matiereDetail.niveauParcours : [],
            };
          })
        );
        setMatieresAvecNiveaux(matieresDetails);
      }
    } catch (error) {
      console.error("Erreur :", error.response?.data || error.message);
    }
  };

  // ---------- Pagination ----------
  const [pageActuel, setPageActuel] = useState(1);
  const nombreElemParPage = 4;
  const totalPages = Math.ceil(matieresAvecNiveaux.length / nombreElemParPage);
  const currentData = matieresAvecNiveaux.slice(
    (pageActuel - 1) * nombreElemParPage,
    pageActuel * nombreElemParPage
  );

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (pageActuel <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (pageActuel >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", pageActuel, "...", totalPages);
    }
    return pages;
  };

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`${
        isReduire
          ? "fixed h-screen right-0 top-14 left-20"
          : "fixed h-screen right-0 top-14 left-56"
      } p-5 z-40 overflow-auto bg-white transition-all duration-700`}
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
        <p className="font-bold text-bleu text-xl">Détail du Professeur</p>

        {/* ----------- Informations Professeur ----------- */}
        <div className="flex flex-col border rounded p-4 gap-6">
          <p className="text-center font-bold">Informations</p>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Photo */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src={listeProfesseur.photos || "/public/Images/images.jpg"}
                alt="preview"
                className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover"
              />
            </div>

            {/* Infos Texte */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <Info label="Nom" value={listeProfesseur.nomProfesseur} />
              <Info label="Prénoms" value={listeProfesseur.prenomProfesseur} />
              <Info label="Contact" value={listeProfesseur.contact} />
              <Info label="Email" value={listeProfesseur.email} />
              <Info label="Adresse" value={listeProfesseur.adresse} />
              <Info label="Sexe" value={listeProfesseur.sexe} />
              <Info label="Grade" value={listeProfesseur.grade} />
              <Info label="Nom Courant" value={listeProfesseur.nomCourant} />
            </div>
          </div>
        </div>

        {/* ----------- Matières Enseignées ----------- */}
        <div className="flex flex-col border rounded p-4 gap-4">
          <p className="text-center font-bold">Matières Enseignées</p>

          {currentData.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="border w-full text-sm md:text-base">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1">#</th>
                      <th className="border px-2 py-1">Matière</th>
                      <th className="border px-2 py-1">Niveaux</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((matiere, index) => (
                      <tr key={matiere.numMatiere} className="text-center">
                        <td className="border px-2 py-1">{index + 1}</td>
                        <td className="border px-2 py-1">
                          {matiere.nomMatiere}
                        </td>
                        <td className="border px-2 py-1">
                          {matiere.niveaux.map((n) => n.niveau).join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-2 p-4 flex-wrap">
                <button
                  onClick={() => setPageActuel((prev) => Math.max(prev - 1, 1))}
                  disabled={pageActuel === 1}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 hover:scale-105 transition duration-200 disabled:opacity-50"
                  title="Page précédente"
                >
                  <img
                    src="/Icons/vers-le-bas.png"
                    alt="Précédent"
                    className="w-5 rotate-90"
                  />
                </button>

                {getPageNumbers().map((page, idx) => (
                  <button
                    key={`${page}-${idx}`}
                    onClick={() =>
                      typeof page === "number" && setPageActuel(page)
                    }
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition duration-200 ${
                      page === pageActuel
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:scale-105"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setPageActuel((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={pageActuel === totalPages}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 hover:scale-105 transition duration-200 disabled:opacity-50"
                  title="Page suivante"
                >
                  <img
                    src="/Icons/vers-le-bas.png"
                    alt="Suivant"
                    className="w-5 rotate-[270deg]"
                  />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400">
              # Pas de matière enseignée pour ce professeur
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ Composant réutilisable pour afficher une info
const Info = ({ label, value }) => (
  <span className="flex flex-col sm:flex-row sm:items-center gap-1">
    <label className="font-bold">{label} :</label>
    <p className="text-gray-600 font-semibold break-words">{value || "-"}</p>
  </span>
);

export default ProfesseurDetails;
