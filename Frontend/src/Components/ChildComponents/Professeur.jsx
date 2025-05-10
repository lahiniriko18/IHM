import React, { useEffect, useState } from 'react'

import Creatable, { useCreatable } from 'react-select/creatable';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../Context/SidebarContext';
import axios from 'axios';
function Professeur() {
  const { isReduire } = useSidebar();
  const [search, setSearch] = useState('')
  const [listeProfesseur, setlisteProfesseur] = useState([]);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalList, setOriginalList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState()
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [error, setError] = useState({ status: false, composant: "", message: "" })
  const [dataProfesseur, setdataProfesseur] = useState({
    nomProfesseur: "",
    prenomProfesseur: "",
    nomCourant: "",
    grade: "",
    sexe: "",
    photos: "",
    contact: "",
    adresse: "",
    email: "",  // Il manquait `email`
    numEtablissement: null
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
      document.getElementById('file-name').textContent = file.name;
    }
  };
  const renameFile = (file) => {
    const extension = file.name.split('.').pop();
    const newFileName = `image_${Date.now()}.${extension}`;
    return new File([file], newFileName, { type: file.type });
  };
  const sendData = async () => {
    const formData = new FormData();

    Object.entries(dataProfesseur).forEach(([key, value]) => {
      formData.append(key, value);
    });


    if (selectedFile) {
      const renamedFile = renameFile(selectedFile);
      formData.append('photos', renamedFile); // clé = "photos"
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/professeur/ajouter/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.status !== 201) throw new Error("Erreur " + response.status);
      getData()
      console.log("Établissement enregistré !");
    } catch (error) {
      console.error("Erreur :", error.message);
    } finally {

    }
  }
  const removeProfesseur = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/professeur/supprimer/${parseInt(id)}`)
      if (response.status !== 200 && response.status !== 204) {
        throw new Error(`Erreur lors de la suppression : Code ${response.status}`)
      }
      console.log(`professeur ${id} supprimé avec succès`);
      getData()
    } catch (error) {
      console.log("Erreur:", error.message)
    }
  }
  const putData = async () => {
    const formData = new FormData();

    Object.entries(dataProfesseur).forEach(([key, value]) => {
      formData.append(key, value);
    });


    if (selectedFile) {
      const renamedFile = renameFile(selectedFile);
      formData.append('photos', renamedFile); // clé = "photos"
    }
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/professeur/modifier/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status)
      }
      console.log("ajouter")
      getData()
    } catch (error) {
      if (error.response) {
        console.error("Erreur du serveur :", error.response.data)
      } else {
        console.error("Erreur inconnue :", error.message)
      }
    } finally {

    }
  }

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/professeur/");
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setlisteProfesseur(response.data);
      setOriginalList(response.data);

    } catch (error) {
      if (error.response) {
        console.error("Erreur du serveur :", error.response.data)
      } else {
        console.error("Erreur inconnue :", error.message)
      }
    } finally {
      setIsLoading(false);
      ;
    }
  };
  const editProfesseur = (numProfesseur) => {
    const selectedprofesseur = listeProfesseur.find((item) => item.numProfesseur === numProfesseur);
    if (selectedprofesseur) {
      setdataProfesseur({
        nomProfesseur: selectedprofesseur.nomProfesseur,
        adresse: selectedprofesseur.adresse,
        email: selectedprofesseur.email,
        contact: selectedprofesseur.contact,
        description: selectedprofesseur.description,
        nomCourant: selectedprofesseur.nomCourant,
        photos: selectedprofesseur.photos,
        grade: selectedprofesseur.grade,
        sexe: selectedprofesseur.sexe,
      });
      setId(selectedprofesseur.numProfesseur);
      // Affiche l'image si elle existe
      if (selectedprofesseur.photos) {
        setPreview(`${selectedprofesseur.photos}`);
      } else {
        setPreview(null);
      }
      setisadd(false);
      setIsclicked(true);
    }
  };

  const confirmerSuppression = (id) => {
    setId(id);
    setIsConfirmModalOpen(true);
  }

  useEffect(() => {
    getData()
    console.log(listeProfesseur);


  }, [])

  const validateForm = () => {
    let isValid = true;

    // Expression régulière pour valider le contact (avec ou sans espaces)
    const contactRegex = /^(\+261\s?(32|33|34|37|38)\s?\d{2}\s?\d{3}\s?\d{2}|(032|033|034|037|038)\s?\d{2}\s?\d{3}\s?\d{2})$/;
    // Expression régulière pour valider l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Vérification du nomProfesseur de l'établissement
    if (dataProfesseur.nomProfesseur.trim() === "") {
      setError({ composant: "nomProfesseur", status: true, message: "Nom ne peut pas être vide !" });
      isValid = false;
    }
    // Vérification de l'adresse
    else if (dataProfesseur.adresse.trim() === "") {
      setError({ composant: "adresse", status: true, message: "L'adresse ne peut pas être vide !" });
      isValid = false;
    }
    // Vérification du contact (doit correspondre au format spécifié)
    else if (!contactRegex.test(dataProfesseur.contact.trim())) {
      setError({ composant: "contact", status: true, message: "Le contact doit respecter le format requis !" });
      isValid = false;
    }
    // Vérification de l'email (doit être un email valide)
    else if (!emailRegex.test(dataProfesseur.email.trim())) {
      setError({ composant: "email", status: true, message: "L'email doit être valide !" });
      isValid = false;
    }
    // Réinitialisation des erreurs si tout est valide
    else {
      setError({ status: false, composant: "", message: "" });
    }

    return isValid;
  };
  function handleSearch(e) {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() !== "") {
      const filtered = originalList.filter((Parcours) =>
        Parcours.nomParcours.toLowerCase().includes(value.toLowerCase()) ||
        Parcours.codeParcours.toLowerCase().includes(value.toLowerCase()) ||
        Parcours.numParcours.toString().includes(value)
      );
      setListeParcours(filtered);
    } else {
      setListeParcours(originalList);
    }
  }
  const navigate = useNavigate();
  const versDetails = () => {
    navigate('/professeur/detail/1')
  }
  const [isclicked, setIsclicked] = useState(false)
  const [isadd, setisadd] = useState(true)
  const nombreElemParPage = 8;
  const [pageActuel, setPageActuel] = useState(1);

  const totalPages = Math.ceil(listeProfesseur.length / nombreElemParPage);
  const currentData = listeProfesseur.slice((pageActuel - 1) * nombreElemParPage, pageActuel * nombreElemParPage);

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
          <div className="bg-white  w-[100%] sm:w-[90%] md:w-[70%] lg:w-[60%] max-h-[95%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              {isadd ? (<h1 className="text-blue-600 text-xl font-bold">Nouvelle Professeur</h1>) : (<h1 className="text-blue-600 text-xl font-bold">Modification d'une Professeur</h1>)}
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsclicked(false);
                  setError({ ...error, status: false })
                  setdataProfesseur({ nomProfesseur: "", prenomProfesseur: "", adresse: "", contact: "", email: "", nomCourant: "", photos: "", grade: "", sexe: "" })
                  setSelectedFile(null)
                  setPreview(null)
                }}
              />
            </div>
            <div className="flex flex-row gap-5 h-[95%]">
              {/* left section */}
              <div className='flex gap-3 flex-col '>
                <div className="flex flex-row w-full gap-2 items-center justify-between">
                  <div className="flex flex-col w-full">
                    <label className="font-semibold text-sm mb-1">Nom professeur</label>
                    <input
                      type="text"
                      value={dataProfesseur.nomProfesseur}
                      onChange={(e) => setdataProfesseur({ ...dataProfesseur, nomProfesseur: e.target.value })}
                      className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {
                      (error.status && error.composant === "nomProfesseur") && (<p className='text-red-600 text-sm'>{error.message}</p>)
                    }
                  </div>

                  <div className="flex flex-col w-full">
                    <label>Prénom</label>
                    <input
                      type="text"
                      value={dataProfesseur.prenomProfesseur}
                      onChange={(e) => setdataProfesseur({ ...dataProfesseur, prenomProfesseur: e.target.value })}
                      className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />

                  </div>
                  {
                    (error.status && error.composant === "prenomProfesseur") && (<p className='text-red-600 text-sm'>{error.message}</p>)
                  }
                </div>
                <div className="flex flex-col w-full">
                  <label className="font-semibold text-sm mb-1">Grade :</label>
                  <input
                    type="text"
                    value={dataProfesseur.grade}
                    onChange={(e) => setdataProfesseur({ ...dataProfesseur, grade: e.target.value })}
                    className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  {
                    (error.status && error.composant === "grade") && (<p className='text-red-600 text-sm'>{error.message}</p>)
                  }
                </div>
                <div className="flex flex-col w-full">
                  <label className="font-semibold text-sm mb-1">Adresse :</label>
                  <input
                    type="text"
                    value={dataProfesseur.adresse}
                    onChange={(e) => setdataProfesseur({ ...dataProfesseur, adresse: e.target.value })}
                    className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  {
                    (error.status && error.composant === "adresse") && (<p className='text-red-600 text-sm'>{error.message}</p>)
                  }
                </div>


                <div className="flex flex-row w-full gap-2 items-center justify-between">
                  <div className="flex flex-col w-full">
                    <label className="font-semibold text-sm mb-1">Nom courant :</label>
                    <input
                      type="text"
                      value={dataProfesseur.nomCourant}
                      onChange={(e) => setdataProfesseur({ ...dataProfesseur, nomCourant: e.target.value })}
                      className="border border-gray-300 leading-9 px-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {
                      (error.status && error.composant === "nomCourant") && (<p className='text-red-600 text-sm'>{error.message}</p>)
                    }
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="font-semibold text-sm mb-1">Sexe</label>
                    <Creatable
                      isClearable
                      placeholder="Sexe"
                      options={[
                        { value: 'Masculin', label: 'Masculin' },
                        { value: 'Feminin', label: 'Feminin' },
                      ]}
                      value={dataProfesseur.sexe ? { label: dataProfesseur.sexe, value: dataProfesseur.sexe } : null}
                      onChange={(selectedOption) =>
                        setdataProfesseur({ ...dataProfesseur, sexe: selectedOption ? selectedOption.value : "" })
                      }
                    />

                  </div>
                </div>

                <div className="flex flex-row w-full gap-2 items-center justify-between">

                  <div className="flex flex-col w-full">
                    <label className="font-semibold text-sm mb-1">Email</label>
                    <input
                      type="text"
                      value={dataProfesseur.email}
                      onChange={(e) => setdataProfesseur({ ...dataProfesseur, email: e.target.value })}
                      className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {
                      (error.status && error.composant === "email") && (<p className='text-red-600 text-sm'>{error.message}</p>)
                    }
                  </div>


                  <div className="flex flex-col w-full">
                    <label className="font-semibold text-sm mb-1">Contact</label>
                    <input
                      type="text"
                      value={dataProfesseur.contact}
                      onChange={(e) => setdataProfesseur({ ...dataProfesseur, contact: e.target.value })}
                      className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {
                      (error.status && error.composant === "contact") && (<p className='text-red-600 text-sm'>{error.message}</p>)
                    }
                  </div>

                </div>
              </div>
              {/*right section */}
              <div className='w-[50%] flex justify-center items-center flex-col gap-2'>
                <div className="w-40 h-40 rounded-full bg-gray-200">
                  {preview && <img src={preview} alt="preview" className="w-40 h-40 rounded-full object-cover" />}
                </div>
                <div className="flex flex-col justify-center w-full">
                  <label className="font-semibold text-sm mb-1">Choisissez une photo : </label>

                  <div className="flex items-center justify-between gap-4">

                    <span id="file-name" className="text-sm border px-4 py-2 w-full rounded text-gray-600">Aucun fichier choisi</span>
                    <label
                      htmlFor="fichier"
                      className="cursor-pointer text-white px-4 py-2 rounded text-sm"
                    >
                      <img src="/Icons/dossier.png" alt="" />
                    </label>
                  </div>

                  <input
                    id="fichier"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <input type="hidden" name="id" value={id} onChange={() => setId(e.target.value)} />
            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  if (validateForm()) {
                    if (isadd) {
                      sendData();
                    } else {
                      putData();
                    }
                    setdataProfesseur({ nomProfesseur: "", prenomProfesseur: "", adresse: "", contact: "", email: "", nomCourant: "", photos: "", grade: "", sexe: "" })
                    setSelectedFile(null)
                    setIsclicked(false);
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
                <h1 className="text-blue-600 text-xl font-bold">Suppression professeur</h1>
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
                <p>Etes vous sur de vouloir supprimer cette professeur ?</p>
              </div>
              <input type="hidden" name="id" value={id} onChange={() => setId(e.target.value)} />
              <div className="w-full flex justify-center">
                <button
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                  onClick={() => {
                    if (id !== "") {
                      removeProfesseur(id)
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
          <h1 className="font-bold">Liste des Professeurs enregistrées</h1>
          <button className="button flex gap-3 hover:scale-105 transition duration-200" onClick={() => { setIsclicked(true); setisadd(true); }}>
            <img src="/Icons/plus-claire.png" alt="Plus" className='w-6 h-6' /> Nouveau
          </button>
        </div>
        {
          isLoading ? (
            <div className="w-full h-40 flex flex-col items-center  justify-center mt-[10%]">
              <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-2">Chargement des données...</p>
            </div>
          ) : listeProfesseur.length === 0 ? (
            <div className="w-full h-40 flex flex-col items-center justify-center mt-[10%]">
              <img src="/Icons/vide.png" alt="Vide" className='w-14' />
              <p className='text-gray-400'>Aucun données trouvé</p>
            </div>
          ) : (<div>
            <div className="w-full border rounded-t-lg overflow-hidden">
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr className="bg-blue-500 text-white text-sm">
                    <th className="px-4 py-4">#</th>
                    <th className="px-4 py-4">Nom du Prof.</th>
                    <th className="px-4 py-4">adresse</th>
                    <th className="px-4 py-4">Grade</th>
                    <th className="px-4 py-4">Sexe</th>
                    <th className="px-4 py-4">Contact</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {currentData.map((Professeur, index) => (
                    <tr key={index} className="border-b transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-100">
                      <td className="px-4 py-2 text-center">{Professeur.numEtablissement}</td>
                      <td className="px-4 py-2 text-center">{Professeur.nomProfesseur}</td>
                      <td className="px-4 py-2 text-center">{Professeur.adresse}</td>
                      <td className="px-4 py-2 text-center">{Professeur.grade}</td>
                      <td className="px-4 py-2 text-center">{Professeur.sexe}</td>
                      <td className="px-4 py-2 text-center">{Professeur.contact}</td>
                      <td className="px-4 py-2 flex justify-center items-center gap-2">
                        <button className="p-1 rounded hover:bg-gray-200">
                          <img src="/Icons/modifier.png" alt="Modifier" className="w-5" onClick={() => { setIsclicked(true); setisadd(false); editProfesseur(Professeur.numEtablissement) }} />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-200" onClick={() => confirmerSuppression(Professeur.numProfesseur)}>
                          <img src="/Icons/supprimer.png" alt="Supprimer" className="w-5" />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-200">
                          <img src="/Icons/afficher.png" alt="Supprimer" className="w-5" onClick={versDetails} />
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

export default Professeur