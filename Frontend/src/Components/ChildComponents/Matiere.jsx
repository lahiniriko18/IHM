import React, { useEffect, useState } from 'react'
import { useSidebar } from '../Context/SidebarContext';
import Creatable from 'react-select/creatable';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
function Matiere() {
  const { isReduire } = useSidebar();
  const [listeMatiere, setListeMatiere] = useState([]);
  const [originalList, setOriginalList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState()
  const [listeClasse, setListeClasse] = useState([]);
  const [dataMatiere, setDataMatiere] = useState({ nomMatiere: "", codeMatiere: "", niveauParcours: [], professeurs: [] })
  const [isclicked, setIsclicked] = useState(false)
  const [isadd, setisadd] = useState(true)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirmModalOpenError, setIsConfirmModalOpenError] = useState(false);
  const [listeProfesseur, setlisteProfesseur] = useState([]);
  const [search, setSearch] = useState('')
  const navigate = useNavigate();
  const [error, setError] = useState({ status: false, composant: "", message: "" })
  const getDataClasse = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/niveau-parcours/");
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setListeClasse(response.data);

    } catch (error) {
      console.error(error.message);
    }
  };
  const getDataProfesseurs = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/professeur/");
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setlisteProfesseur(response.data);
    } catch (error) {
      if (error.response) {
        console.error("Erreur du serveur :", error.response.data)
      } else {
        console.error("Erreur inconnue :", error.message)
      }
    }
  };
  const sendData = async () => {
    const formData = new FormData();
    Object.entries(dataMatiere).forEach(([key, value]) => {
      if (key !== "niveauParcours" && key !== "professeurs") {
        formData.append(key, value);
      }
    });
    if (Array.isArray(dataMatiere.niveauParcours)) {
      dataMatiere.niveauParcours.forEach((val) => {
        formData.append('niveauParcours[]', val);
      });
    }
    if (Array.isArray(dataMatiere.professeurs)) {
      dataMatiere.professeurs.forEach((val) => {
        formData.append('professeurs[]', val);
      });
    }
    try {
      console.log("Donneés envoyer au backend", formData)
      const response = await axios.post("http://127.0.0.1:8000/api/matiere/ajouter/", formData)

      if (response.status !== 201) {
        throw new Error('Erreur code : ' + response.status)
      }
      console.log("ajouter")
      getData()
    } catch (error) {
      console.error(error.response.data)
    } finally { }
  }
  const getMatiereByOne = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/matiere/${id}`);
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      return response.data;
    } catch (error) {
      console.error(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  const removeMatiere = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/matiere/supprimer/${parseInt(id)}`)
      if (response.status !== 200 && response.status !== 204) {
        throw new Error(`Erreur lors de la suppression : Code ${response.status}`)
      }
      console.log(`Utilisateur ${id} supprimé avec succès`);
      getData()
    } catch (error) {
      console.log("Erreur:", error.message)
    }
  }

  const putData = async () => {
    const formData = new FormData();
    Object.entries(dataMatiere).forEach(([key, value]) => {
      if (key !== "niveauParcours" && key !== "professeurs") {
        formData.append(key, value);
      }
    });
    if (Array.isArray(dataMatiere.niveauParcours)) {
      dataMatiere.niveauParcours.forEach((val) => {
        formData.append('niveauParcours[]', val);
      });
    }
    if (Array.isArray(dataMatiere.professeurs)) {
      dataMatiere.professeurs.forEach((val) => {
        formData.append('professeurs[]', val);
      });
    }
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/matiere/modifier/${id}`, formData)
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status)
      }
      console.log("ajouter")
      getData()
    } catch (error) {
      console.error(response.data.message)
    } finally { }
  }

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/matiere/");
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setListeMatiere(response.data);
      setOriginalList(response.data);  // ✅ Mise à jour ici
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  const optionsClasse = listeClasse
    // .sort((a, b) => a.numNiveauParcours.localeCompare(b.numNiveauParcours))
    .map((Classe) => ({
      value: Classe.numNiveauParcours,
      label: Classe.niveau + (Classe.numParcours.codeParcours ? Classe.numParcours.codeParcours : " - " + Classe.numParcours.nomParcours),
    }));
  const optionsProfesseur = listeProfesseur
    .sort((a, b) => a.nomProfesseur.localeCompare(b.nomProfesseur))
    .map((Professeur) => ({
      value: Professeur.numProfesseur,
      label: `${Professeur.sexe === "Masculin" ? 'Mr' : 'Mme'} ` +
        (Professeur.nomCourant
          ? Professeur.nomCourant
          : Professeur.prenomProfesseur
            ? Professeur.prenomProfesseur
            : Professeur.nomProfesseur)
    }));
  const editMatiere = async (numMatiere) => {
    const selectedMatiere = await getMatiereByOne(numMatiere);
    if (selectedMatiere) {
      setId(selectedMatiere.numMatiere);
      setisadd(false);
      setIsclicked(true);
      setDataMatiere({
        nomMatiere: selectedMatiere.nomMatiere || "",
        codeMatiere: selectedMatiere.codeMatiere || "",
        niveauParcours: Array.isArray(selectedMatiere.niveauParcours)
          ? selectedMatiere.niveauParcours.map((m) =>
            typeof m === "object" && m !== null
              ? m.numNiveauParcours || m.value || ""
              : m
          )
          : [],
        professeurs: Array.isArray(selectedMatiere.professeurs) ?
          selectedMatiere.professeurs.map((m) =>
            typeof m === "object" && m !== null
              ? m.numProfesseur || m.value || ""
              : m
          ) : [],
      });
    }
  };
  const confirmerSuppression = (id) => {
    setId(id);
    setIsConfirmModalOpen(true);
  }

  function handleSearch(e) {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() !== "") {
      const filtered = originalList.filter((matiere) =>
        matiere.nomMatiere.toLowerCase().includes(value.toLowerCase()) ||
        matiere.codeMatiere.toLowerCase().includes(value.toLowerCase()) ||
        matiere.numMatiere.toString().includes(value)
      );
      setListeMatiere(filtered);
    } else {
      setListeMatiere(originalList);
    }
  }
  const versProfesseur = () => {
    navigate('/professeur')
  }
  useEffect(() => {
    getData()
    getDataClasse()
    getDataProfesseurs();
  }, [])


  const nombreElemParParge = 8;
  const [pageActuel, setPageActuel] = useState(1);
  const totalPages = Math.ceil(listeMatiere.length / nombreElemParParge);
  const currentData = listeMatiere.slice(
    (pageActuel - 1) * nombreElemParParge,
    pageActuel * nombreElemParParge
  );
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
      {(isclicked) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center"
          tabIndex="-1"
        >
          <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[90%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              {isadd ? (<h1 className="text-blue-600 text-xl font-bold">Nouvelle Matiere</h1>) : (<h1 className="text-blue-600 text-xl font-bold">Modification d'une Matiere</h1>)}
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsclicked(false);
                  setError({ ...error, status: false })
                  setDataMatiere({ nomMatiere: "", codeMatiere: "" })
                }}
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Nom de la Matiere</label>
              <input
                type="text"
                value={dataMatiere.nomMatiere || ""}
                onChange={(e) => setDataMatiere({ ...dataMatiere, nomMatiere: e.target.value })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {
                (error.status && error.composant === "nomMatiere") && (<p className='text-red-600 text-sm'>{error.message}</p>)
              }
            </div>
            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Professeur(s):</label>
              <Creatable
                isClearable
                isMulti
                isValidNewOption={() => false}
                placeholder="Choisir le(s) professeur(s)"
                options={optionsProfesseur}
                onChange={(selectedOption) => {
                  setDataMatiere((prev) => ({
                    ...prev,
                    professeurs: Array.isArray(selectedOption)
                      ? selectedOption.map((opt) => opt.value)
                      : []
                  }));
                }}
                value={optionsProfesseur.filter((option) =>
                  (dataMatiere.professeurs || []).includes(option.value)
                )}
                className="text-sm"
              />
              {
                (error.status && error.composant === "prof") && (<p className='text-red-600 text-sm'>{error.message}</p>)
              }
            </div>
            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Enseigné dans:</label>
              <Creatable
                isClearable
                isMulti
                isValidNewOption={() => false}
                placeholder="Choisir le classe"
                options={optionsClasse}
                onChange={(selectedOption) => {
                  setDataMatiere((prev) => ({
                    ...prev,
                    niveauParcours: Array.isArray(selectedOption)
                      ? selectedOption.map((opt) => opt.value)
                      : []
                  }));
                }}
                value={optionsClasse.filter((option) =>
                  (dataMatiere.niveauParcours || []).includes(option.value)
                )}
                className="text-sm"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Code matiere</label>
              <input
                type="text"
                value={dataMatiere.codeMatiere || ""}
                onChange={(e) => setDataMatiere({ ...dataMatiere, codeMatiere: e.target.value })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {
                (error.status && error.composant === "codeMatiere") && (<p className='text-red-600 text-sm'>{error.message}</p>)
              }
            </div>


            <input type="hidden" name="id" value={id} onChange={() => setId(e.target.value)} />
            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  if (dataMatiere.nomMatiere.trim() === "") {
                    setError({ error, status: true, composant: "nomMatiere", message: "Le nom du matiere ne peut pas etre vide" })
                  }
                  else if (dataMatiere.professeurs.length === 0) {
                    setError({ error, status: true, composant: "prof", message: "Selectionner au moins un professeur" })
                  } else {
                    if (isadd) {
                      // console.log(dataMatiere)
                      sendData()
                      setDataMatiere({ nomMatiere: "", codeMatiere: "" })
                      setIsclicked(false);
                      setError({ ...error, status: false })
                    }
                    else {
                      putData()
                      setDataMatiere({ nomMatiere: "", codeMatiere: "" })
                      setIsclicked(false);
                      setError({ ...error, status: false })
                    }
                  }
                }}
              >
                {isadd ? "AJOUTER" : "MODIFIER"}
              </button>
            </div>
          </div>
        </div >
      )
      }

      {
        (isConfirmModalOpen) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center"
            tabIndex="-1"
          >
            <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[90%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
              <div className="flex justify-between items-center w-full">
                <h1 className="text-blue-600 text-xl font-bold">Suppression Matiere</h1>
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
                <p>Etes vous sur de vouloir supprimer cette matière ?</p>
              </div>
              <input type="hidden" name="id" value={id} onChange={() => setId(e.target.value)} />
              <div className="w-full flex justify-center">
                <button
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                  onClick={() => {
                    if (id !== "") {
                      removeMatiere(id)
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
      {
        (isConfirmModalOpenError) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center"
            tabIndex="-1"
          >
            <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%] max-h-[90%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
              <div className="flex justify-between items-center w-full">
                <h1 className="text-blue-600 text-xl font-bold">Creation Matiere</h1>
                <img
                  src="/Icons/annuler.png"
                  alt="Quitter"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => {
                    setIsConfirmModalOpenError(false);

                  }}
                />
              </div>
              <div className="flex flex-row gap-2">
                <img src="/Icons/attention.png" alt="Attention" />
                <p>Pour suivre la creation de matiere ,il faut au moins un professeur dans la section professeur</p>
              </div>

              <div className="w-full flex justify-center gap-7 items-center">
                <button
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                  onClick={() => {
                    setIsConfirmModalOpenError(false);
                  }}
                >
                  Ok
                </button>
                <button
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    versProfesseur();
                  }}
                >
                  Creer-un
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
          <h1 className="font-bold">Liste des Matieres enregistrées</h1>
          <button className="button flex gap-3 hover:scale-105 transition duration-200" onClick={() => {

            if (Object.entries(listeProfesseur).length > 0) {
              setIsclicked(true);
              setisadd(true);
            } else {
              setIsConfirmModalOpenError(true)
            }
          }}>
            <img src="/Icons/plus-claire.png" alt="Plus" className='w-6 h-6' /> Nouveau
          </button>
        </div>
        {
          isLoading ? (
            <div className="w-full h-40 flex flex-col items-center  justify-center mt-[10%]">
              <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-2">Chargement des données...</p>
            </div>
          ) : listeMatiere.length === 0 ? (
            <div className="w-full h-40 flex flex-col items-center justify-center mt-[10%]">
              <img src="/Icons/vide.png" alt="Vide" className='w-14' />
              <p className='text-gray-400'>Aucun données trouvé</p>
            </div>
          ) : (
            <div>
              <div className="w-full border rounded-t-lg overflow-hidden">
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-500 text-white text-sm">
                      <th className="px-4 py-4">#</th>
                      <th className="px-4 py-4">Nom de la Matiere</th>
                      <th className="px-4 py-4">Code de la Matiere</th>
                      <th className="px-4 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {currentData.map((Matiere, index) => (
                      <tr key={index} className="border-b transition-all duration-300  hover:bg-gray-100">
                        <td className="px-4 py-2 text-center">{Matiere.numMatiere}</td>
                        <td className="px-4 py-2 text-center">{Matiere.nomMatiere}</td>
                        <td className="px-4 py-2 text-center">{Matiere.codeMatiere}</td>
                        <td className="px-4 py-2 flex justify-center items-center gap-2">
                          <button className="p-1 rounded hover:bg-gray-200">
                            <img src="/Icons/modifier.png" alt="Modifier" className="w-5" onClick={async () => { setIsclicked(true); setisadd(false); await editMatiere(Matiere.numMatiere) }} />
                          </button>
                          <button className="p-1 rounded hover:bg-gray-200" onClick={() => confirmerSuppression(Matiere.numMatiere)}>
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

export default Matiere