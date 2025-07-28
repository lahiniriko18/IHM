import React, { useEffect, useState } from 'react'
import { useSidebar } from '../Context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import Creatable from 'react-select/creatable';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

import * as XLSX from "xlsx";
import { parseISO, format, addDays, startOfWeek, } from "date-fns";
function Edt() {
  const [isclicked, setIsclicked] = useState(false)
  const [search, setSearch] = useState(null);
  const [isadd, setisadd] = useState(true)
  const location = useLocation();
  const [listeEDT, setListeEdt] = useState([]);

  const [listeClasse, setListeClasse] = useState([]);

  // const [numEdtUpdate, SetNumEdtupdate] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [dataEdt, setDataEdt] = useState({
    date_debut: "",
    date_fin: "",
    niveau: "",
    mode_creation: "",
    parcours: null,
    excel: null,
    numEdtUpdate: [],
    action: "",
  })
  const [error, setError] = useState({ status: false, composant: "", message: "" })
  const [id, setId] = useState()
  const navigate = useNavigate();

  // API
  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/edt/");
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      console.log(response.data)
      setListeEdt(response.data);
      setOriginalList(response.data)
      setIsLoading(false);
    } catch (error) {
      if (error.response) {
        console.error("Erreur du serveur :", error.response.data)
      } else {
        console.error("Erreur inconnue :", error.message)
      }
    }
  };
  const verifierEdt = async () => {
    const data = { dateDebut: formatDateToDDMMYYYY(dataEdt.date_debut), numNiveauParcours: dataEdt.niveau }
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/edt/ajouter/verifier/", data);
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      return response.data
    } catch (error) {
      if (error.response) {
        console.error("Erreur du serveur :", error.response.data)

      } else {
        console.error("Erreur inconnue :", error.message)

      }
    }
  };
  const removeEdt = async () => {
    const formdata = new FormData();
    if (Array.isArray(dataEdt.numEdtUpdate)) {
      dataEdt.numEdtUpdate.forEach((val) => {
        formdata.append('numEdts[]', parseInt(val));
      });
    }
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/edt/supprimer/liste/`, formdata)
      if (response.status !== 200 && response.status !== 204) {
        throw new Error(`Erreur lors de la suppression : Code ${response.status}`)
      }
      console.log(`supprimé avec succès`);
      getData()
    } catch (error) {
      console.log("Erreur:", error.message)
    }
  }
  const getDataClasse = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/niveau-parcours/");
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setListeClasse(response.data);

    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }


  const optionCreation = [
    { value: 'manuel', label: 'Manuellement' },
    { value: 'excel', label: 'Importez depuis excel' },
  ]

  useEffect(() => {
    getData()
    getDataClasse()
 
  }, [])



  useEffect(() => {
    if (location.state?.refresh) {
      getData();

      // Optionnel : nettoyer le flag pour éviter de rappeler à chaque fois

    }
  }, [location.state]);

  const optionsClasse = listeClasse
    .map((Classe) => ({
      value: Classe.numNiveauParcours,
      label: Classe.niveau + (Classe.numParcours.codeParcours ? Classe.numParcours.codeParcours : " - " + Classe.numParcours.nomParcours),
    }));

  // const optionsParcours = listeParcours
  //   .sort((a, b) => a.nomParcours.localeCompare(b.nomParcours)) // Trie par `nomParcours`
  //   .map((Parcours) => ({
  //     value: Parcours.numParcours,
  //     label: Parcours.nomParcours + (Parcours.codeParcours ? ` (${Parcours.codeParcours})` : ""),
  //   }));
  const confirmerSuppression = () => {

    setIsConfirmModalOpen(true);
  }

  const handleStartDateChange = (event) => {
    const selectedDate = parseISO(event.target.value);
    const lundi = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const samedi = addDays(lundi, 5);
    setDataEdt({
      ...dataEdt,
      date_debut: format(lundi, "yyyy-MM-dd"),
      date_fin: format(samedi, "yyyy-MM-dd"),
    });
  };

  function handleSearch(e) {
    const value = e.target.value;
    setSearch(value);
    if (value.trim() !== "") {
      const filtered = originalList.filter((Edt) =>
        Edt.niveauParcours.toLowerCase().includes(value.toLowerCase()) ||
        (Edt.dateDebut.toLowerCase().includes(value.toLowerCase())) ||
        Edt.dateFin.toLowerCase().includes(value.toLowerCase())
      );
      setListeEdt(filtered);
    } else {
      setListeEdt(originalList);
    }
  }
  const versGeneral = () => {
    navigate('/edt')
  }
  const versCreationEdt = (dataEdtToSend) => {
    navigate('/edt/nouveau-edt', { state: { objectStateEdt: dataEdtToSend } });
  }
  const versAFfichage = () => {
    navigate('/edt/affichage-edt')
  }
  // const [modeCreation, setModeCreation] = useState(null);
  const nombreElemParParge = 6;
  const [pageActuel, setPageActuel] = useState(1);
  const totalPages = Math.ceil(listeEDT.length / nombreElemParParge);
  const currentData = listeEDT.slice((pageActuel - 1) * nombreElemParParge, pageActuel * nombreElemParParge);
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
  const { isReduire } = useSidebar();
  return (
    <>
      {/* modal */}
      {(isclicked) ? (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center"
          tabIndex="-1"
        >
          <div className={" w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[90%]  bg-white overflow-y-auto p-5 rounded-lg shadow-lg space-y-4 "} >
            <div className="flex justify-between items-center w-full">
              {isadd ? (<h1 className="text-blue-600 text-xl font-bold">Nouvelle EDT</h1>) : (<h1 className="text-blue-600 text-xl font-bold">Modification d'une EDT</h1>)}
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsclicked(false)
                  setDataEdt({
                    date_debut: "",
                    date_fin: "",
                    niveau: null,
                    mode_creation: "",
                    parcours: null,
                    excel: null
                  });
                  setError({ ...error, status: false })
                }}
              />
            </div>
            <div className={`flex flex-col`} >
              <div className={`w-full`}>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col w-full">
                    <label className="font-semibold text-sm mb-1">Date debut:</label>
                    <input
                      type="date"
                      onChange={handleStartDateChange}
                      value={dataEdt.date_debut}
                      className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>

                  {(error.status && error.composant === "date_debut") && (
                    <p className="text-red-600 text-sm">{error.message}</p>
                  )}
                  <div className={`${(dataEdt.date_debut.trim() == "") ? "pointer-events-none text-gray-400" : ""} flex flex-col w-full`}>
                    <label className="font-semibold text-sm mb-1">Date fin</label>
                    <input
                      type="date"
                      onChange={handleStartDateChange}
                      value={dataEdt.date_fin}
                      className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>
                  {(error.status && error.composant === "date_fin") && (
                    <p className="text-red-600 text-sm">{error.message}</p>
                  )}
                  <div className="w-100">
                    {(error.status && error.composant === "date_debut") && (
                      <p className="text-red-600 text-sm">{error.message}</p>
                    )}
                    {(error.status && error.composant === "date_fin") && (
                      <p className="text-red-600 text-sm">{error.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  <label className="font-semibold text-sm mb-1">Niveau</label>
                  <Creatable
                    isClearable
                    isValidNewOption={() => false}
                    placeholder="Choisissez  un classe"
                    options={optionsClasse}
                    onChange={(selectedOption) => {
                      setDataEdt((prev) => ({
                        ...prev,
                        niveau: selectedOption ? selectedOption.value : null
                      }));
                    }}
                    value={
                      optionsClasse.find(
                        (option) => option.value === dataEdt.niveau
                      ) || null}
                    className="text-sm"
                  />
                  {
                    (error.status && error.composant === "niveau") && (<p className='text-red-600 text-sm'>{error.message}</p>)
                  }
                </div>


                <div className="flex flex-col w-full">
                  <label className="font-semibold text-sm mb-1">Mode creation</label>
                  <Creatable
                    isClearable
                    isValidNewOption={() => false}
                    placeholder="Choisissez un modèle"
                    onChange={(selectedOption) => {
                      setDataEdt((prev) => ({
                        ...prev,
                        mode_creation: selectedOption ? selectedOption.value : null
                      }));
                    }}
                    value={
                      optionCreation.find(
                        (option) => option.value === dataEdt.mode_creation
                      ) || null}
                    options={optionCreation}
                    className="text-sm"
                  />
                </div>
                {
                  (error.status && error.composant === "creation") && (<p className='text-red-600 text-sm'>{error.message}</p>)
                }
              </div>
            
            </div>

            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={async () => {
                  if (dataEdt.date_debut.trim() == "" || dataEdt.date_fin.trim() == "") {
                    setError({ status: true, composant: "date_debut", message: "La date ne peut pas vide" });
                  } else if (!dataEdt.niveau) {
                    setError({ status: true, composant: "niveau", message: "Le niveau ne peut pas vide " });
                  } else if (!dataEdt.mode_creation) {
                    setError({ status: true, composant: "creation", message: "Il faut choisir la modele de creation" });
                  } else {
                    const a = await verifierEdt();
                    if (a) {
                      setError({ status: true, composant: "creation", message: "Edt existe dejà" });
                    } else {
                      setIsclicked(false)
                      versCreationEdt(dataEdt);
                      setDataEdt({
                        date_debut: "",
                        date_fin: "",
                        niveau: null,
                        mode_creation: "",
                        parcours: null,
                        excel: null
                      });
                      setError({ ...error, status: false })
                    }
                  }
                }}
              >
                SUIVANT
              </button>
            </div>
          </div >
        </div >
      ) : ""
      }
      {
        (isConfirmModalOpen) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center"
            tabIndex="-1"
          >
            <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[90%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
              <div className="flex justify-between items-center w-full">
                <h1 className="text-blue-600 text-xl font-bold">Suppression d'une edt</h1>
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
                <p>Etes vous sur de vouloir supprimer cette edt ?</p>
              </div>
              <input type="hidden" name="id" value={id || ""} onChange={(e) => setId(e.target.value)} />
              <div className="w-full flex justify-center">
                <button
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                  onClick={() => {
                    if (dataEdt.numEdtUpdate.length !== 0) {
                      removeEdt()
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
          value={search || ""}
          onChange={handleSearch}
          className="border p-2 ps-12 relative rounded w-[50%]  focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <img src="/Icons/rechercher.png" alt="Search" className='w-6 absolute left-[26%]' />
      </div>


      <div className={`${isReduire ? "left-20" : "left-56"} fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}>
        <div className="flex flex-col gap-1">
          <div className='flex flex-row gap-3 mb-5'>
            <button className='font-bold hover:scale-105 text-bleu' onClick={versGeneral}>Géneral</button>
            <button className=' hover:scale-105 text-gray-500' onClick={() => {
              versCreationEdt()
            }}>Creation</button>
            <button className=' hover:scale-105 text-gray-500' onClick={versAFfichage}>Affichage</button>
            {/* <button className=' hover:scale-105 text-gray-500' onClick={versProfile}>Profile</button> */}
          </div>
          <div className="flex justify-between items-center w-full">
            <h1 className="font-bold">Liste des emplois du temps enregistrées</h1>
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
            ) : listeEDT.length === 0 ? (
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
                        <th className="px-4 py-4">Classe</th>
                        <th className="px-4 py-4">Date de debut</th>
                        <th className="px-4 py-4">Date de fin</th>
                        <th className="px-4 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {currentData.map((EDT, index) => (
                        <tr key={index} className="border-b transition-all duration-300 hover:bg-gray-100">
                          <td className="px-4 py-2 text-center">{index + 1}</td>
                          <td className="px-4 py-2 text-center">{EDT.niveauParcours}</td>
                          <td className="px-4 py-2 text-center">{EDT.dateDebut}</td>
                          <td className="px-4 py-2 text-center">{EDT.dateFin}</td>
                          <td className="px-4 py-2 flex justify-center items-center gap-2">
                            <button className="p-1 rounded hover:bg-gray-200">
                              <img
                                src="/Icons/modifier.png"
                                alt="Modifier"
                                className="w-5"
                                onClick={() => {
                                  if (Array.isArray(EDT.numEdts) && EDT.numEdts.length > 0) {
                                    const newNumEdtUpdate = EDT.numEdts.slice();
                                    const newDataEdt = { ...dataEdt, action: "edit", numEdtUpdate: newNumEdtUpdate };
                                    setDataEdt(newDataEdt);
                                    navigate('/edt/edit-edt', { state: { objectStateEdt: newDataEdt } });
                                  } else {
                                    console.log("Aucun reference de l'edt trouvé ce qui  empeche la modification")
                                  }
                                }}
                              />
                            </button>
                            <button className="p-1 rounded hover:bg-gray-200">
                              <img src="/Icons/supprimer.png" alt="Supprimer" className="w-5" onClick={() => {
                                if (Array.isArray(EDT.numEdts) && EDT.numEdts.length > 0) {
                                  const newNumEdtUpdate = EDT.numEdts.slice();
                                  const newDataEdt = { ...dataEdt, action: "edit", numEdtUpdate: newNumEdtUpdate };
                                  setDataEdt(newDataEdt);
                                  confirmerSuppression();
                                } else {
                                  console.log("Aucun reference de l'edt trouvé ce qui  empeche la suppression");
                                }
                              }} />
                            </button>
                            <button className="p-1 rounded hover:bg-gray-200">
                              <img src="/Icons/afficher.png" alt="Supprimer" className="w-5" />
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
      </div >
    </>
  );
}

export default Edt