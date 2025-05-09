import React, { useEffect, useState } from 'react'
import { useSidebar } from '../Context/SidebarContext';
import Creatable from 'react-select/creatable';
import ColorPicker from 'react-pick-color';
import { useNavigate } from 'react-router-dom';
import { useEtablissement } from '../contexts/EtablissementContext';
import axios from 'axios';
function ParametreInfo() {
  const { setNumEtablissement } = useEtablissement();
  const { isReduire } = useSidebar();
  const navigate = useNavigate()
  const [isclicked, setIsclicked] = useState(false)
  const [isadd, setisadd] = useState(true)
  const [listeEtablissement, setlisteEtablissement] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState()
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataEtablissement, setdataEtablissement] = useState({ nomEtablissement: "", adresse: "", email: "", slogant: "", contact: "", })
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [search, setSearch] = useState('')
  const [error, setError] = useState({ status: false, composant: "", message: "" })
  const [color, setColor] = useState('#fff');
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

    Object.entries(dataEtablissement).forEach(([key, value]) => {
      formData.append(key, value);
    });


    if (selectedFile) {
      const renamedFile = renameFile(selectedFile);
      formData.append('logo', renamedFile); // clé = "logo"
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/etablissement/ajouter/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.status !== 201) throw new Error("Erreur " + response.status);
      console.log("Établissement enregistré !");
    } catch (error) {
      console.error("Erreur :", error.message);
    } finally {
      console.log("Le tache est terminé")
    }
  }
  const removeEtablissement = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/etablissement/supprimer/${parseInt(id)}`)
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
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/etablissement/modifier/${id}`, dataEtablissement)
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status)
      }
      console.log("ajouter")
      getData()
    } catch (error) {
      console.error(error.message)
    } finally {
      console.log("Le tache est terminé")
    }
  }

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/etablissement/");
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setlisteEtablissement(response.data);
      setOriginalList(response.data);  // ✅ Mise à jour ici
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
      console.log("Le tache est terminé");
    }
  };
  const editetablissement = (numEtablissement) => {
    const selectedEtablissement = listeEtablissement.find((item) => item.numEtablissement === numEtablissement)
    if (selectedEtablissement) {
      setdataEtablissement({ ...dataEtablissement, nomEtablissement: selectedEtablissement.nomEtablissement, adresse: selectedEtablissement.adresse, email: selectedEtablissement.email, contact: selectedEtablissement.contact, logo: selectedEtablissement.logo, slogant: selectedEtablissement.slogant, })
      setId(selectedEtablissement.numEtablissement)
    }
  }
  const confirmerSuppression = (id) => {
    setId(id);
    setIsConfirmModalOpen(true);
  }


  useEffect(() => {
    getData()
  }, [])




  const versGeneral = () => {
    navigate('/parametre')
  }
  const versInfo = () => {
    navigate('/parametre/info-etablisement')
  }
  const versSecurite = () => {
    navigate('/parametre/securite')
  }
  const versProfile = () => {
    navigate('/parametre/profile')
  }
  return (
    <>

      {(isclicked) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center"
          tabIndex="-1"
        >
          <div className="bg-white w-[100%] sm:w-[90%] md:w-[70%] lg:w-[50%] max-h-[95%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              {isadd ? (<h1 className="text-blue-600 text-xl font-bold">Nouvelle etablissement</h1>) : (<h1 className="text-blue-600 text-xl font-bold">Modification d'une etablissement</h1>)}
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsclicked(false);
                  setError({ ...error, status: false })
                  setdataEtablissement({ nomEtablissement: "", adresse: "" })
                }}
              />
            </div>

            <div className="flex flex-row gap-5 h-[95%]">
              <div className='w-[50%]  h-[95%] '>
                <div className="flex flex-col w-full">
                  <label className="font-semibold text-sm mb-1">Nom de la etablissement</label>
                  <input
                    type="text"
                    value={dataEtablissement.nomEtablissement}
                    onChange={(e) => setdataEtablissement({ ...dataEtablissement, nomEtablissement: e.target.value })}
                    className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  {
                    (error.status && error.composant === "nomEtablissement") && (<p className='text-red-600 text-sm'>{error.message}</p>)
                  }
                </div>
                <div className="flex flex-col w-full">
                  <label className="font-semibold text-sm mb-1">Adresse:</label>
                  <input
                    type="text"
                    value={dataEtablissement.adresse}
                    onChange={(e) => setdataEtablissement({ ...dataEtablissement, adresse: e.target.value })}
                    className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  {
                    (error.status && error.composant === "adresse") && (<p className='text-red-600 text-sm'>{error.message}</p>)
                  }
                </div>
                <div className="flex flex-col w-full">
                  <label className="font-semibold text-sm mb-1">Contact:</label>
                  <input
                    type="text"
                    value={dataEtablissement.contact}
                    onChange={(e) => setdataEtablissement({ ...dataEtablissement, contact: e.target.value })}
                    className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  {
                    (error.status && error.composant === "contact") && (<p className='text-red-600 text-sm'>{error.message}</p>)
                  }
                </div>

                <div className="flex flex-col w-full">
                  <label className="font-semibold text-sm mb-1">Email :</label>
                  <input
                    type="text"
                    value={dataEtablissement.email}
                    onChange={(e) => setdataEtablissement({ ...dataEtablissement, email: e.target.value })}
                    className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  {
                    (error.status && error.composant === "email") && (<p className='text-red-600 text-sm'>{error.message}</p>)
                  }
                </div>
                <div className="flex flex-col w-full">
                  <label className="font-semibold text-sm mb-1">Slogan :</label>
                  <textarea
                    type="text"
                    value={dataEtablissement.slogan}
                    onChange={(e) => setdataEtablissement({ ...dataEtablissement, slogan: e.target.value })}
                    className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  {
                    (error.status && error.composant === "slogan") && (<p className='text-red-600 text-sm'>{error.message}</p>)
                  }
                </div>
              </div>
              <div className='w-[50%] flex justify-center items-center flex-col gap-2'>
                <div className="w-40 h-40 rounded-full bg-gray-200">
                  {preview && <img src={preview} alt="preview" className="w-40 h-40 rounded-full object-cover" />}
                </div>
                <div className="flex flex-col justify-center w-full">
                  <label className="font-semibold text-sm mb-1">Choisissez une image pour le logo : </label>

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
                  if (dataEtablissement.nomEtablissement.trim() !== "" && dataEtablissement.adresse.trim() !== "") {
                    if (isadd) {
                      sendData()
                      setdataEtablissement({ nomEtablissement: "", adresse: "" })
                      setIsclicked(false);
                      setError({ ...error, status: false })
                    }
                    else {
                      putData()
                      setdataEtablissement({ nomEtablissement: "", adresse: "" })
                      setIsclicked(false);
                      setError({ ...error, status: false })
                    }
                  } else {
                    (dataEtablissement.nomEtablissement.trim() === "") ? setError({ error, status: true, composant: "nomEtablissement", message: "Le nom du etablissement ne peut pas etre vide" }) : setError({ error, status: true, composant: "adresse", message: "Le code du etablissement ne peut pas etre vide" })
                  }
                }}
              >
                {isadd ? "AJOUTER" : "MODIFIER"}
              </button>
            </div>
          </div>
        </div>
      )}

      {
        (isConfirmModalOpen) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center"
            tabIndex="-1"
          >
            <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[90%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
              <div className="flex justify-between items-center w-full">
                <h1 className="text-blue-600 text-xl font-bold">Suppression etablissement</h1>
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
                <p>Etes vous sur de vouloir supprimer cette etablissement ?</p>
              </div>
              <input type="hidden" name="id" value={id} onChange={() => setId(e.target.value)} />
              <div className="w-full flex justify-center">
                <button
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                  onClick={() => {
                    if (id !== "") {
                      removeEtablissement(id)
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
      <div className={`${isReduire ? "left-20" : "left-56"} fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}>
        <div className='flex flex-row gap-3 mb-5'>
          <button className=' hover:scale-105 text-gray-500' onClick={versGeneral}>Géneral</button>
          <button className='font-bold hover:scale-105  text-bleu' onClick={versInfo}>Informations</button>
          <button className=' hover:scale-105 text-gray-500' onClick={versSecurite}>Securité</button>
          <button className=' hover:scale-105 text-gray-500' onClick={versProfile}>Profile</button>
        </div>
        <div className="flex justify-between w-full">
          <h1 className="font-bold text-gray-400">information de l'etablisement</h1>
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
          ) : listeEtablissement.length === 0 ? (
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
                    <th className="px-4 py-4">Logo</th>
                    <th className="px-4 py-4">Nom de la etablissement</th>
                    <th className="px-4 py-4">Contact</th>
                    <th className="px-4 py-4">Adresse</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4">Slogan</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {currentData.map((etablissement, index) => (
                    <tr key={index} className="border-b transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-100">
                      <td className="px-4 py-2 text-center">{etablissement.numEtablissement}</td>
                      <td className="px-4 py-2 text-center">{etablissement.logo}</td>
                      <td className="px-4 py-2 text-center">{etablissement.nomEtablissement}</td>
                      <td className="px-4 py-2 text-center">{etablissement.contact}</td>
                      <td className="px-4 py-2 text-center">{etablissement.adresse}</td>
                      <td className="px-4 py-2 text-center">{etablissement.email}</td>
                      <td className="px-4 py-2 text-center">{etablissement.slogan}</td>

                      <td className="px-4 py-2 flex justify-center items-center gap-2">
                        {setNumEtablissement(etablissement.numEtablissement)}
                        <button className="p-1 rounded hover:bg-gray-200">
                          <img src="/Icons/modifier.png" alt="Modifier" className="w-5" onClick={() => { setIsclicked(true); setisadd(false); editetablissement(etablissement.numEtablissement) }} />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-200" onClick={() => confirmerSuppression(etablissement.numEtablissement)}>
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
      </div >
    </>
  );


}

export default ParametreInfo