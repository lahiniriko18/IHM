import React, { useEffect, useRef, useState } from 'react'
import { useSidebar } from '../Context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import Creatable from 'react-select/creatable';
import axios from 'axios';
import { FileUploader } from "react-drag-drop-files";
import * as XLSX from "xlsx";
import { parseISO, format, addDays, getDay, isAfter, isBefore, startOfWeek, } from "date-fns";
function Edt() {
  const [isclicked, setIsclicked] = useState(false)
  const [search, setSearch] = useState(null);
  const [isadd, setisadd] = useState(true)
  const [isOpen, setIsOpen] = useState(false);
  const [hover, setHover] = useState(false)
  const [listeEDT, setListeEdt] = useState([]);
  const [listeParcours, setListeParcours] = useState([]);
  const [listeClasse, setListeClasse] = useState([]);
  const dropdownRef = useRef(null);
  const [numEdtUpdate, SetNumEdtupdate] = useState([]);
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
  const [file, setFile] = useState(null);
  const fileTypes = ["XLS", "XLSX"];
  {/* API*/ }
  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/edt/");
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
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

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/edt/ajouter/verifier/", { dateDebut: dataEdt.date_debut, numNiveauParcours: dataEdt.niveau });
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      return response.data
    } catch (error) {
      if (error.response) {
        console.error("Erreur du serveur :", error.response.data)
        return null
      } else {
        console.error("Erreur inconnue :", error.message)
        return null
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
  const getDataParcours = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/parcours/");
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setListeParcours(response.data);

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
  const telechargerFichier = async (numero) => {
    if (!dataEdt.niveau) {
      setError({ ...error, status: true, composant: "niveau", message: "Selectionner d'abord le niveau!" })
      return
    }
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/edt/telecharger/`, { niveauParcours: dataEdt.niveau, typeFichier: numero, dateDebut: dataEdt.date_debut ? formatDateToDDMMYYYY(dataEdt.date_debut) : null, dateFin: dataEdt.date_fin ? formatDateToDDMMYYYY(dataEdt.date_debut) : null }, {
        responseType: "blob", // Important pour gérer les fichiers binaires
      });

      // Créer une URL temporaire pour le fichier
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `modele-${numero}.xlsx`); // Nom du fichier téléchargé
      document.body.appendChild(link);
      link.click(); // Simule un clic pour télécharger le fichier
      link.remove(); // Supprime le lien après le téléchargement
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
    }
  };
  const handleChange = (file) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result; // 
      const data = new Uint8Array(arrayBuffer); // 
      const binaryStr = Array.from(data).map((byte) => String.fromCharCode(byte)).join(""); // 

      const workbook = XLSX.read(binaryStr, { type: "binary" });


      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];


      const jsonData = XLSX.utils.sheet_to_json(sheet);
      console.log("Données Excel :", jsonData);
    };

    reader.readAsArrayBuffer(file);
  };
  const handleTypeError = (err) => {
    setFile(null);
    setError({ status: true, composant: "fichier", message: "Type de fichier invalide. Seuls les fichiers .xls et .xlsx sont autorisés." });
  };
  {/*Execution de requete */ }
  useEffect(() => {
    getDataClasse()
    getDataParcours()
    getData()
  }, [])

  useEffect(() => {
    if (error.status) {
      const stop = setTimeout(() => {
        setError({ ...error, status: false })
      }, 4000);
    }
  }, [error])
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const optionsClasse = listeClasse
    // .sort((a, b) => a.niveau.localeCompare(b.niveau))
    // .filter((classe, index, self) =>
    //   index === self.findIndex((c) => c.niveau === classe.niveau)
    // )
    .map((Classe) => ({
      value: Classe.numNiveauParcours,
      label: Classe.niveau + (Classe.numParcours.codeParcours ? Classe.numParcours.codeParcours : " - " + Classe.numParcours.nomParcours),
    }));

  const optionsParcours = listeParcours
    .sort((a, b) => a.nomParcours.localeCompare(b.nomParcours)) // Trie par `nomParcours`
    .map((Parcours) => ({
      value: Parcours.numParcours,
      label: Parcours.nomParcours + (Parcours.codeParcours ? ` (${Parcours.codeParcours})` : ""),
    }));
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
        Edt.niveau.toLowerCase().includes(value.toLowerCase()) ||
        (Edt.groupe && Edt.groupe.toLowerCase().includes(value.toLowerCase())) ||
        Edt.parcours.nomParcours.toLowerCase().includes(value.toLowerCase()) ||
        Edt.numEdt.toString().includes(value)
      );
      setListeEdt(filtered);
    } else {
      setListeClasse(originalList);
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
  const [modeCreation, setModeCreation] = useState(null);
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
          <div className={`${modeCreation === "excel" ? "w-[100%] sm:w-[90%] md:w-[70%] lg:w-[60%] max-h-[95%]" : " w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[90%]"}  bg-white overflow-y-auto p-5 rounded-lg shadow-lg space-y-4 `} >
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
            <div className={modeCreation === 'excel' ? `flex flex-row ` : `flex flex-col`} >
              <div className={modeCreation === 'excel' ? `w-1/2 flex flex-col gap-4 ` : `w-full`}>
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
                {/* <div className="flex flex-col w-full">
                  <label className="font-semibold text-sm mb-1">Parcours</label>
                  <Creatable
                    isClearable
                    isValidNewOption={() => false} // Empêche l'utilisateur d'écrire
                    placeholder="Choisissez  un parcour"

                    options={optionsParcours}
                    onChange={(selectedOption) => {
                      setDataEdt((prev) => ({
                        ...prev,
                        parcours: selectedOption ? selectedOption.value : null
                      }));
                    }}
                    value={
                      optionsParcours.find(
                        (option) => option.value === dataEdt.parcours
                      ) || null}
                    className="text-sm"
                  />
                  {
                    (error.status && error.composant === "parcours") && (<p className='text-red-600 text-sm'>{error.message}</p>)
                  }
                </div> */}

                <div className="flex flex-col w-full">
                  <label className="font-semibold text-sm mb-1">Mode creation</label>
                  <Creatable
                    isClearable
                    isValidNewOption={() => false}
                    placeholder="Choisissez un modèle"
                    onChange={(value) => setModeCreation(value?.value || null)}
                    options={[
                      { value: 'manuel', label: 'Manuellement' },
                      { value: 'excel', label: 'Importez depuis excel' },
                    ]}
                    className="text-sm"
                  />
                </div>
              </div>
              {
                modeCreation === "excel" && (
                  <div className='flex flex-col gap-8 w-1/2 px-5'>
                    <div className="flex justify-end">
                      <span
                        className="relative"
                        onMouseOver={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        onClick={() => {
                          setHover(false)
                          setIsOpen(!isOpen)
                        }} ref={dropdownRef}>
                        <img
                          src="/Icons/telecharger.png"
                          alt="Télécharger"
                          className="cursor-pointer w-5"
                        />
                        {(hover && !isOpen) && (
                          <p className="absolute w-44 right-0 px-2 py-2 bg-gray-200 text-gray-600 rounded text-sm">
                            Télécharger un modèle
                          </p>
                        )}
                        <div
                          className={`absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50 transition-all duration-200 transform ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                            }`}
                        >
                          <ul className="text-sm text-gray-700">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { telechargerFichier(1) }}>Modele 1</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { telechargerFichier(2) }}>Modele 2</li>
                            {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Déconnexion</li> */}
                          </ul>
                        </div>
                      </span>
                    </div>
                    <div className="flex flex-col  h-full">
                      <h3 className="font-semibold text-sm mb-1">Importer un fichier Excel</h3>
                      {/* Zone FileUploader modifiée avec hauteur augmentée */}
                      <div className="relative w-full h-[200px] border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition duration-200 overflow-hidden group">
                        {/* FileUploader invisible mais prend toute la zone */}
                        <div className="absolute inset-0 z-10">
                          <FileUploader
                            handleChange={handleChange}
                            name="file"
                            types={fileTypes}
                            multiple={false}
                            onTypeError={handleTypeError}
                            children={
                              <div className="w-full h-full cursor-pointer"></div> // zone cliquable vide
                            }
                          />
                        </div>

                        {/* Contenu visible et non cliquable */}
                        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none">
                          <img src="/Icons/upload.png" alt="Upload" className="w-16 h-16 mb-4" />
                          <p className="text-gray-500 text-sm text-center">
                            Glissez-déposez un fichier ici ou cliquez pour le sélectionner
                          </p>
                          <p className="text-gray-400 text-xs mt-2 text-center">
                            Formats acceptés : XLS, XLSX
                          </p>
                        </div>
                      </div>

                      {
                        (error.status && error.composant === "fichier") && (<p className='text-red-600 text-sm'>{error.message}</p>)
                      }
                      {file && <p className="text-sm mt-2">Fichier sélectionné : {file.name}</p>}
                    </div>
                  </div>)
              }
            </div>



            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  if (dataEdt.date_debut.trim() == "" || dataEdt.date_fin.trim() == "") {
                    setError({ status: true, composant: "date_debut", message: "La date ne peut pas vide" });
                  } else if (!dataEdt.niveau) {
                    setError({ status: true, composant: "niveau", message: "Le niveau ne peut pas vide " });
                  }
                  else {

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
                }}
              >
                {modeCreation === 'excel' ? 'VALIDER' : 'SUIVANT'}
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
              <input type="hidden" name="id" value={id || ""} onChange={() => setId(e.target.value)} />
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
          // value={search}
          // onChange={handleSearch}
          className="border p-2 ps-12 relative rounded w-[50%]  focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <img src="/Icons/rechercher.png" alt="Search" className='w-6 absolute left-[26%]' />
      </div>


      <div className={`${isReduire ? "left-20" : "left-56"} fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}>
        <div className="flex flex-col gap-1">
          <div className='flex flex-row gap-3 mb-5'>
            <button className='font-bold hover:scale-105 text-bleu' onClick={versGeneral}>Géneral</button>
            <button className=' hover:scale-105 text-gray-500' onClick={() => {
              const champsRemplis = dataEdt.date_debut && dataEdt.date_fin && dataEdt.niveau && dataEdt.parcours; {/*&& dataEdt.mode_creation*/ }

              champsRemplis ? versCreationEdt(dataEdt) : setIsclicked(true)
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
                              // onClick={() => {
                              //   if (Array.isArray(EDT.numEdts) && EDT.numEdts.length > 0) {
                              //     const newNumEdtUpdate = EDT.numEdts.slice();
                              //     const newDataEdt = { ...dataEdt, action: "edit", numEdtUpdate: newNumEdtUpdate };
                              //     SetNumEdtupdate(newNumEdtUpdate);
                              //     setDataEdt(newDataEdt);
                              //     navigate('/edt/nouveau-edt', { state: { dataEdt: newDataEdt } });
                              //   } else {
                              //     SetNumEdtupdate([]);
                              //     console.log("Aucun reference de l'edt trouvé ce qui  empeche la modification")
                              //   }
                              // }}
                              />
                            </button>
                            <button className="p-1 rounded hover:bg-gray-200">
                              <img src="/Icons/supprimer.png" alt="Supprimer" className="w-5" onClick={() => {
                                if (Array.isArray(EDT.numEdts) && EDT.numEdts.length > 0) {
                                  const newNumEdtUpdate = EDT.numEdts.slice();
                                  const newDataEdt = { ...dataEdt, action: "edit", numEdtUpdate: newNumEdtUpdate };
                                  SetNumEdtupdate(newNumEdtUpdate);
                                  setDataEdt(newDataEdt);
                                  confirmerSuppression()
                                } else {
                                  SetNumEdtupdate([]);
                                  console.log("Aucun reference de l'edt trouvé ce qui  empeche la suppression")
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