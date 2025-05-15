import React, { useEffect, useState } from 'react'
import { useSidebar } from '../Context/SidebarContext';
import Creatable, { useCreatable } from 'react-select/creatable';
import axios from 'axios';
function Classe() {
  const [groupe, setGroupe] = useState();
  const { isReduire } = useSidebar();
  const [isclicked, setIsclicked] = useState(false)
  const [isadd, setisadd] = useState(true)
  const [listeClasse, setListeClasse] = useState([]);
  const [listeParcours, setListeParcours] = useState([]);
  const [listeGroupe, setListeGroupe] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState()
  const [dataClasse, setDataClasse] = useState({
    niveau: "",
    groupe: "",
    parcours: null
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [search, setSearch] = useState('')
  const [error, setError] = useState({ status: false, composant: "", message: "" })

  const sendData = async (ClasseData) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/classe/ajouter/", ClasseData);
      if (response.status !== 201) throw new Error('Erreur code : ' + response.status);
      console.log("ajouter");
      getData();
    } catch (error) {
      console.error("Erreur:", error.response?.data || error.message);
    }
  };

  const putData = async (ClasseData) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/classe/modifier/${id}`, ClasseData,);
      if (response.status !== 200) throw new Error('Erreur code : ' + response.status);
      console.log("modifié");
      getData();
    } catch (error) {
      console.error("Erreur:", error.response?.data || error.message);
    }
  };

  const removeClasse = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/classe/supprimer/${parseInt(id)}`)
      if (response.status !== 200 && response.status !== 204) {
        throw new Error(`Erreur lors de la suppression : Code ${response.status}`)
      }
      console.log(`Classe ${id} supprimé avec succès`);
      getData()
    } catch (error) {
      console.log("Erreur:", error.message)
    }
  }
  const [rows, setRows] = useState([]);

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/classe/");
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setListeClasse(response.data);
      setOriginalList(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getDataparcours = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/parcours/");
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setListeParcours(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {

    }
  };
  const editClasse = (numClasse) => {
    const selectedClasse = listeClasse.find((item) => item.numClasse === numClasse)
    if (selectedClasse) {
      setDataClasse({
        ...dataClasse,
        niveau: selectedClasse.niveau,
        parcours: selectedClasse.parcours?.numParcours ?? null,
        ancienParcours: selectedClasse.parcours?.numParcours ?? null,
        groupe: selectedClasse.groupe ? selectedClasse.groupe.toString().split(" ").slice(1).join(" ") : "",
      });

      setId(selectedClasse.numClasse)
      // console.log(dataClasse)

    }
  }
  const isExistClasse = (data, isEdit = false, currentId = null) => {
    const existingClasse = listeClasse.find((classe) => {
      if (isEdit && classe.numClasse === currentId) {
        return false;
      }

      return (
        classe.niveau === data.niveau.toUpperCase() &&
        classe.parcours?.numParcours === data.parcours &&
        classe.groupe === (data.groupe ? `Groupe ${data.groupe}` : null)
      );
    });

    return !!existingClasse; // Retourne true si une correspondance est trouvée, sinon false
  };
  const confirmerSuppression = (id) => {
    setId(id);
    setIsConfirmModalOpen(true);
  }

  function handleSearch(e) {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() !== "") {
      const filtered = originalList.filter((Classe) =>
        Classe.niveau.toLowerCase().includes(value.toLowerCase()) ||
        (Classe.groupe && Classe.groupe.toLowerCase().includes(value.toLowerCase())) ||
        Classe.parcours.nomParcours.toLowerCase().includes(value.toLowerCase()) ||
        Classe.numClasse.toString().includes(value)
      );
      setListeClasse(filtered);
    } else {
      setListeClasse(originalList);
    }
  }
  useEffect(() => {
    getData()
    getDataparcours()
  }, [])

  const optionsParcours = listeParcours.map((Parcours) => ({
    value: Parcours.numParcours,
    label: Parcours.nomParcours
  }));
  const optionGroupe = listeGroupe.map((Groupe) => ({
    value: Groupe.numGroupe,
    label: Groupe.nomGroupe
  }));

  const [optionNiveau, setOptionNiveau] = useState([
    { value: 'L1', label: "L1" },
    { value: 'L2', label: "L2" },
    { value: 'L3', label: "L3" },
    { value: 'M1', label: "M1" },
    { value: 'M2', label: "M2" },
  ]);
  const nombreElemParParge = 8;
  const [pageActuel, setPageActuel] = useState(1);

  const totalPages = Math.ceil(listeClasse.length / nombreElemParParge);
  const currentData = listeClasse.slice((pageActuel - 1) * nombreElemParParge, pageActuel * nombreElemParParge);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (pageActuel <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (pageActuel >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', pageActuel, '...', totalPages);
      }
    }
    return pages;
  }

  return (
    <>
      {/* modal */}
      {(isclicked) ? (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center"
          tabIndex="-1"
        >
          <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[90%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              {isadd ? (<h1 className="text-blue-600 text-xl font-bold">Nouvelle Classe</h1>) : (<h1 className="text-blue-600 text-xl font-bold">Modification d'une Classe</h1>)}
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsclicked(false)
                  setDataClasse({ niveau: "", groupe: null, niveau: null });
                  setError({ ...error, status: false })
                }}
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Niveau :</label>
              <Creatable
                isClearable
                placeholder="Choisissez ou créez un niveau"
                onChange={(selectedOption) => {
                  setDataClasse((prev) => ({
                    ...prev,
                    niveau: selectedOption ? selectedOption.value : null
                  }));
                }}
                isValidNewOption={() => false}
            
                onCreateOption={(inputValue) => {
                  const newValue = inputValue.toLowerCase();
                  setDataClasse((prev) => ({
                    ...prev,
                    niveau: newValue
                  }));
                  setOptionNiveau([...optionNiveau, { value: newValue, label: inputValue }]);
                }}
                value={optionNiveau.find((option) => option.value === dataClasse.niveau) || null}
                options={optionNiveau}
                className="text-sm"
              />
              {
                (error.status && error.composant === "niveau") && (<p className='text-red-600 text-sm'>{error.message}</p>)
              }
            </div>


            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Parcours :</label>
              <Creatable
                isClearable
                placeholder="Choisissez ou créez un Classe"
                options={optionsParcours}
                onChange={(selectedOption) => {
                  setDataClasse((prev) => ({
                    ...prev,
                    parcours: selectedOption ? selectedOption.value : null
                  }));
                }}
                isValidNewOption={() => false}
                value={
                  optionsParcours.find(
                    (option) => option.value === dataClasse.parcours
                  ) || null}
                className="text-sm"
              />
              {
                (error.status && error.composant === "parcours") && (<p className='text-red-600 text-sm'>{error.message}</p>)
              }
            </div>

            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Groupe :</label>
              <input type="text" value={dataClasse.groupe} onChange={(e) => setDataClasse({ ...dataClasse, groupe: e.target.value })} className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="ex:1,2 ou A,B ou vide" />
              {
                (error.status && error.composant === "groupe") && (<p className='text-red-600 text-sm'>{error.message}</p>)
              }
              {
                (error.status && error.composant === "global") && (<p className='text-red-600 text-sm'>{error.message}</p>)
              }
            </div>
            <input type="hidden" name="id" value={id} onChange={() => setId(e.target.value)} />

            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  if ((dataClasse.niveau && dataClasse.niveau.trim() !== "") && (dataClasse.parcours && dataClasse.niveau.trim() !== "")) {
                    if (isadd) {
                      const updateClasse = {
                        ...dataClasse,
                      };

                      if (isExistClasse(updateClasse)) {
                        setError({
                          status: true,
                          composant: "global",
                          message: "Classe existe déjà",
                        });
                      } else {
                        sendData(updateClasse);
                        setDataClasse({ niveau: "", groupe: null, parcours: null });
                        setError({ status: false, composant: "", message: "" });
                        setIsclicked(false);
                      }
                    } else {
                      const updateClasse = {
                        ...dataClasse,
                        ancienParcours: dataClasse.ancienParcours,
                      };

                      if (isExistClasse(updateClasse, true, id)) {
                        setError({
                          status: true,
                          composant: "global",
                          message: "Classe existe déjà",
                        });
                      } else {
                        putData(updateClasse);
                        setDataClasse({ niveau: "", groupe: null, parcours: null });
                        setError({ status: false, composant: "", message: "" });
                        setIsclicked(false);
                      }
                    }

                  } else {
                    if (!dataClasse.niveau || dataClasse.niveau.trim() === "") {
                      setError({
                        status: true,
                        composant: "niveau",
                        message: "Le niveau ne peut pas être vide",
                      });
                    } else if (!dataClasse.parcours) {
                      setError({
                        status: true,
                        composant: "parcours",
                        message: "Le parcours ne peut pas être vide",
                      });
                    }
                  }
                }}
              >
                {isadd ? "AJOUTER" : "MODIFIER"}
              </button>
            </div>
          </div>
        </div>
      ) : ""}
      {
        (isConfirmModalOpen) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center"
            tabIndex="-1"
          >
            <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[90%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
              <div className="flex justify-between items-center w-full">
                <h1 className="text-blue-600 text-xl font-bold">Suppression Classe</h1>
                <img
                  src="/Icons/annuler.png"
                  alt="Quitter"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setId('')
                  }}
                />
              </div>
              <div className="flex flex-row gap-2">
                <img src="/Icons/attention.png" alt="Attention" />
                <p>Etes vous sur de vouloir supprimer cette Classe ?</p>
              </div>
              <input type="hidden" name="id" value={id} onChange={() => setId(e.target.value)} />
              <div className="w-full flex justify-center">
                <button
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                  onClick={() => {
                    if (id !== "") {
                      removeClasse(id)
                    }
                    setIsConfirmModalOpen(false);
                  }}
                >
                  VALIDER
                </button>
              </div>
            </div>
          </div >
        )
      }
      {/*Search */}
      <div className="absolute top-0 left-[25%]  w-[60%]  h-14 flex justify-center items-center z-[51]">

        <input
          type="text"
          placeholder='Rechercher ici...'
          value={search}
          onChange={handleSearch}
          className="border p-2 ps-12 relative rounded w-[50%]  focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <img src="/Icons/rechercher.png" alt="Search" className='w-6 absolute left-[26%]' />
      </div>

      {/*Listes*/}
      <div className={`${isReduire ? "fixed h-screen right-0 top-14 left-20 p-5 z-40 flex flex-col gap-3 overflow-auto bg-white rounded  transition-all duration-700" : "fixed h-screen right-0 top-14 left-56 p-5 z-40 flex flex-col gap-3 overflow-auto bg-white rounded  transition-all duration-700"}`}>
        <div className="flex justify-between w-full">
          <h1 className="font-bold">Liste des Classes enregistrées</h1>
          <button className="button flex gap-3 hover:scale-105 transition duration-200" onClick={() => { setIsclicked(true); setisadd(true); }}>
            <img src="/Icons/plus-claire.png" alt="Plus" className='w-6 h-6' /> Nouveau
          </button>
        </div>
        {
          isLoading ? (
            <div className="w-full h-40 flex flex-col items-center  justify-center </div>mt-[10%]">
              <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-2">Chargement des données...</p>
            </div>
          ) : listeClasse.length === 0 ? (
            <div className="w-full h-40 flex flex-col items-center justify-center mt-[10%]">
              <img src="/Icons/vide.png" alt="Vide" className='w-14' />
              <p className='text-gray-400'>Aucun données trouvé</p>
            </div>
          ) : (<div>  <div className="w-full border rounded-t-lg overflow-hidden">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-blue-500 text-white text-sm">
                  <th className="px-4 py-4">#</th>
                  <th className="px-4 py-4">Niveau</th>
                  <th className="px-4 py-4">Groupe</th>
                  <th className="px-4 py-4">Parcours</th>
                  <th className="px-4 py-4">Code</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {currentData.map((Classe, index) => (
                  <tr key={index} className="border-b transition-all duration-300  hover:bg-gray-100">

                    <td className="px-4 py-2 text-center">{Classe.numClasse}</td>
                    <td className="px-4 py-2 text-center">{Classe.niveau.toUpperCase()}</td>
                    <td className="px-4 py-2 text-center">
                      {Classe.groupe ? Classe.groupe : "Aucun groupe"}
                    </td>
                    <td className="px-4 py-2 text-center">{Classe.parcours ? Classe.parcours.nomParcours : "Aucun parcours"}</td>
                    <td className="px-4 py-2 text-center">
                      {[
                        Classe.niveau ? Classe.niveau.toUpperCase() : null, // Niveau
                        Classe.parcours?.codeParcours || null,             // Code du parcours
                        Classe.groupe
                          ? (!Classe.parcours // Si le parcours est absent
                            ? `GP${Classe.groupe.split(" ").slice(1).join("")}` // Ajouter "GP" devant le groupe
                            : Classe.groupe.split(" ").slice(1).join("")) // Sinon, juste retirer "Groupe"
                          : null // Si le groupe est null
                      ]
                        .filter(Boolean) // Filtrer les valeurs nulles ou undefined
                        .join("") || "Aucun code"}
                    </td>
                    <td className="px-4 py-2 flex justify-center items-center gap-2">
                      <button className="p-1 rounded hover:bg-gray-200">
                        <img src="/Icons/modifier.png" alt="Modifier" className="w-5" onClick={() => { setIsclicked(true); setisadd(false); editClasse(Classe.numClasse) }} />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-200" onClick={() => confirmerSuppression(Classe.numClasse)}>
                        <img src="/Icons/supprimer.png" alt="Supprimer" className="w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

            <footer className="w-full flex justify-center gap-2 p-4">
              {/* Flèche précédente */}
              <button
                onClick={() => setPageActuel((prev) => Math.max(prev - 1, 1))}
                disabled={pageActuel === 1}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 hover:scale-105 transition duration-200 disabled:opacity-50"
              >
                <img src="/Icons/vers-le-bas.png" alt="Précédent" className="w-5 rotate-90" />
              </button>

              {/* Numéros de page */}
              {getPageNumbers().map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof page === 'number' && setPageActuel(page)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition duration-200 ${page === pageActuel ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:scale-105'
                    }`}
                >
                  {page}
                </button>
              ))}

              {/* Flèche suivante */}
              <button
                onClick={() => setPageActuel((prev) => Math.min(prev + 1, totalPages))}
                disabled={pageActuel === totalPages}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 hover:scale-105 transition duration-200 disabled:opacity-50"
              >
                <img src="/Icons/vers-le-bas.png" alt="Suivant" className="w-5 rotate-[270deg]" />
              </button>
            </footer>
          </div>)
        }


      </div>
    </>
  )
}

export default Classe