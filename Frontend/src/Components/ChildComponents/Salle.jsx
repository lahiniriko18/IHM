import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSidebar } from "../Context/SidebarContext";
function Salle() {
  const { isReduire } = useSidebar();
  const [isclicked, setIsclicked] = useState(false);
  const [listeSalle, setListeSalle] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [isadd, setisadd] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState();
  const [dataSalle, setDataSalle] = useState({ nomSalle: "", lieuSalle: "" });
  const [pageActuel, setPageActuel] = useState(1);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isDeleteByCheckBox, setDeleteByChekbox] = useState(true);
  const [checkedRows, setCheckedRows] = useState([]);
  const [tri, setTri] = useState(""); // Nouveau état pour le tri
  const [error, setError] = useState({
    status: "",
    composant: "",
    message: "",
  });
  const nombreElemParPage = 8;
  const allChecked =
    checkedRows.length === listeSalle.length && listeSalle.length > 0;

  // ---------- Handlers ----------
  const handleCheck = (id) => {
    setCheckedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const handleCheckAll = () => {
    setCheckedRows(allChecked ? [] : listeSalle.map((item) => item.numSalle));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim() !== "") {
      const filtered = originalList.filter(
        (Salle) =>
          Salle.nomSalle.toLowerCase().includes(value.toLowerCase()) ||
          Salle.lieuSalle.toLowerCase().includes(value.toLowerCase()) ||
          Salle.numSalle.toString().includes(value)
      );
      setListeSalle(filtered);
    } else {
      setListeSalle(originalList);
    }
  };

  const handleTri = (e) => {
    const value = e.target.value;
    setTri(value);
    let sorted = [...listeSalle];
    if (value === "nom") {
      sorted.sort((a, b) => a.nomSalle.localeCompare(b.nomSalle));
    } else if (value === "lieu") {
      sorted.sort((a, b) => a.lieuSalle.localeCompare(b.lieuSalle));
    } else {
      sorted.sort((a, b) => a.statut.localeCompare(b.statut));
    }
    setListeSalle(sorted);
  };

  // ---------- CRUD ----------
  const sendData = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/salle/ajouter/",
        dataSalle
      );
      if (response.status !== 201)
        throw new Error("Erreur code : " + response.status);
      toast.success("✅ Salle ajoutée avec succès");
      getData();
    } catch (error) {
      toast.error("❌ Erreur ajout salle : " + error.message);
    }
  };

  const putData = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/salle/modifier/${id}`,
        dataSalle
      );
      if (response.status !== 200)
        throw new Error("Erreur code : " + response.status);
      toast.success(" Salle modifiée avec succès");
      getData();
    } catch (error) {
      toast.error("❌ Erreur modification : " + error.message);
    }
  };

  const removeSalle = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/salle/supprimer/${id}`
      );
      if (![200, 204].includes(response.status))
        throw new Error("Erreur suppression : " + response.status);
      toast.success(" Salle supprimée avec succès");
      getData();
    } catch (error) {
      toast.error("❌ Erreur suppression : " + error.message);
    }
  };

  const removeSalleByCkeckBox = async () => {
    const formData = new FormData();
    checkedRows.forEach((val) => formData.append("numSalles[]", parseInt(val)));
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/salle/supprimer/liste/",
        formData
      );
      if (![200, 204].includes(response.status))
        throw new Error("Erreur suppression multiple");
      toast.success("salle(s) supprimée(s)");
      getData();
      setCheckedRows([]);
    } catch (error) {
      toast.error("❌ Erreur suppression multiple : " + error.message);
    }
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/salle/");
      if (response.status !== 200)
        throw new Error("Erreur code : " + response.status);
      setListeSalle(response.data);
      setOriginalList(response.data);
    } catch (error) {
      toast.error("❌ Erreur chargement : " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- useEffect ----------
  useEffect(() => {
    getData();
  }, []);

  // ---------- Pagination ----------
  const totalPages = Math.ceil(listeSalle.length / nombreElemParPage);
  const currentData = listeSalle.slice(
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

  return (
    <>
      {/* modal */}
      {isclicked && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center"
          tabIndex="-1"
        >
          <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[90%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              {isadd ? (
                <h1 className="text-blue-600 text-xl font-bold">
                  Nouvelle salle
                </h1>
              ) : (
                <h1 className="text-blue-600 text-xl font-bold">
                  Modification d'une salle
                </h1>
              )}
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsclicked(false);
                  setError({ ...error, status: false });
                  setDataSalle({ nomSalle: "", lieuSalle: "" });
                }}
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">
                Nom de la salle
              </label>
              <input
                type="text"
                value={dataSalle.nomSalle}
                onChange={(e) =>
                  setDataSalle({ ...dataSalle, nomSalle: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {error.status && error.composant === "nomSalle" && (
                <p className="text-red-600 text-sm">{error.message}</p>
              )}
            </div>

            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">
                Lieu de la salle
              </label>
              <input
                type="text"
                value={dataSalle.lieuSalle}
                onChange={(e) =>
                  setDataSalle({ ...dataSalle, lieuSalle: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {error.status && error.composant === "lieuSalle" && (
                <p className="text-red-600 text-sm">{error.message}</p>
              )}
            </div>

            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  if (
                    dataSalle.nomSalle.trim() !== "" &&
                    dataSalle.lieuSalle.trim() !== ""
                  ) {
                    if (isadd) {
                      sendData();
                      setDataSalle({ nomSalle: "", lieuSalle: "" });
                      setIsclicked(false);
                      // setError({ ...error, status: false });
                    } else {
                      putData();
                      setDataSalle({ nomSalle: "", lieuSalle: "" });
                      setIsclicked(false);
                      setError({ ...error, status: false });
                    }
                  } else {
                    dataSalle.nomSalle.trim() === ""
                      ? setError({
                          error,
                          status: true,
                          composant: "nomSalle",
                          message: "Le nom du Salle ne peut pas etre vide",
                        })
                      : setError({
                          error,
                          status: true,
                          composant: "lieuSalle",
                          message: "Le lieu de la Salle ne peut pas etre vide",
                        });
                  }
                }}
              >
                {isadd ? "AJOUTER" : "MODIFIER"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isConfirmModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center"
          tabIndex="-1"
        >
          <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[90%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-blue-600 text-xl font-bold">
                Suppression Salle
              </h1>
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setId("");
                }}
              />
            </div>
            <div className="flex flex-row gap-2">
              <img src="/Icons/attention.png" alt="Attention" />
              <p>Etes vous sur de vouloir supprimer ?</p>
            </div>
            <input
              type="hidden"
              name="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  if (isDeleteByCheckBox) {
                    if (checkedRows.length !== 0) {
                      removeSalleByCkeckBox();
                    }
                  } else {
                    if (id !== "") {
                      removeSalle(id);
                    }
                  }
                  setIsConfirmModalOpen(false);
                }}
              >
                VALIDER
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`${
          isReduire
            ? "fixed h-screen right-0 top-14 left-20"
            : "fixed h-screen right-0 top-14 left-56"
        } p-5 z-40 overflow-auto bg-white transition-all duration-700`}
      >
        {/* Wrapper centré */}
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-lg">Liste des salles enregistrées</h1>
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => {
                setIsclicked(true);
                setisadd(true);
              }}
            >
              <img
                src="/Icons/plus-claire.png"
                alt="Plus"
                className="w-5 h-5"
              />
              Nouveau
            </button>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="🔍 Rechercher..."
              value={search}
              onChange={handleSearch}
              className="border p-2 rounded w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={tri}
              onChange={handleTri}
              className="border p-2 rounded w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Trier par --</option>
              <option value="nom">Nom de la salle</option>
              <option value="lieu">Lieu de la salle</option>
              <option value="status">Disponibilité de la salle</option>
            </select>
          </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center mt-10">
              <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-2">Chargement des données...</p>
            </div>
          ) : listeSalle.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-10">
              <img src="/Icons/vide.png" alt="Vide" className="w-14" />
              <p className="text-gray-400">Aucune donnée trouvée</p>
            </div>
          ) : (
            <div>
              <div className="w-full border rounded-t-lg overflow-x-auto">
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-500 text-white text-sm">
                      <th className=" relative px-4 py-4">
                        <input
                          type="checkbox"
                          checked={allChecked}
                          onChange={handleCheckAll}
                          className="cursor-pointer"
                        />
                        {checkedRows.length > 0 && (
                          <button
                            className="absolute right-1 rounded hover:bg-opacity-80"
                            onClick={() => {
                              setIsConfirmModalOpen(true);
                              setDeleteByChekbox(true);
                            }}
                            title="Supprimer la sélection"
                          >
                            <img
                              src="/Icons/supprimer.png"
                              alt="Supprimer"
                              className="w-5"
                            />
                          </button>
                        )}
                      </th>
                      <th className="px-4 py-4">#</th>
                      <th className="px-4 py-4">Nom de la salle</th>
                      <th className="px-4 py-4">Lieu de la salle</th>
                      <th className="px-4 py-4">Statut</th>
                      <th className="px-4 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {currentData.map((Salle, index) => (
                      <tr
                        key={index}
                        className="border-b transition hover:bg-gray-100"
                      >
                        <td className="px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={checkedRows.includes(Salle.numSalle)}
                            onChange={() => handleCheck(Salle.numSalle)}
                            className="cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          {Salle.numSalle}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {Salle.nomSalle}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {Salle.lieuSalle}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                              Salle.statut ? "bg-green-600" : "bg-red-500"
                            }`}
                          >
                            {Salle.statut ? "Libre" : "Occupé"}
                          </span>
                        </td>
                        <td className="px-4 py-2 flex justify-center gap-2">
                          <button
                            className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-200"
                            onClick={() => {
                              setIsclicked(true);
                              setisadd(false);
                              setDataSalle({
                                nomSalle: Salle.nomSalle,
                                lieuSalle: Salle.lieuSalle,
                              });
                              setId(Salle.numSalle);
                            }}
                          >
                            <img
                              src="/Icons/modifier.png"
                              alt="Modifier"
                              className="w-5 h-5"
                            />
                          </button>
                          <button
                            className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-200"
                            onClick={() => {
                              setId(Salle.numSalle);
                              setIsConfirmModalOpen(true);
                              setDeleteByChekbox(false);
                            }}
                          >
                            <img
                              src="/Icons/supprimer.png"
                              alt="Supprimer"
                              className="w-5 h-5"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ---------- Pagination ---------- */}
              <footer className="w-full flex justify-center gap-2 p-4">
                <button
                  onClick={() => setPageActuel((prev) => Math.max(prev - 1, 1))}
                  disabled={pageActuel === 1}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 hover:scale-105 disabled:opacity-50"
                >
                  <img
                    src="/Icons/vers-le-bas.png"
                    alt="Précédent"
                    className="w-5 rotate-90"
                  />
                </button>

                {getPageNumbers().map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      typeof page === "number" && setPageActuel(page)
                    }
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
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
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 hover:scale-105 disabled:opacity-50"
                >
                  <img
                    src="/Icons/vers-le-bas.png"
                    alt="Suivant"
                    className="w-5 rotate-[270deg]"
                  />
                </button>
              </footer>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Salle;
