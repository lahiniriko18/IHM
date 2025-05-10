import React, { useEffect, useState } from 'react'
import { useSidebar } from '../Context/SidebarContext';
import axios from 'axios';

function Mention() {
  const [numEtablissement, setNumEtablissement] = useState();
  const { isReduire } = useSidebar();
  const [isclicked, setIsclicked] = useState(false)
  const [isadd, setisadd] = useState(true)
  const [listeMention, setListeMention] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState()
  const [dataMention, setDataMention] = useState({
    nomMention: "",
    codeMention: "",
    numEtablissement: null,
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [search, setSearch] = useState('')
  const [error, setError] = useState({ status: false, composant: "", message: "" })
  const getNumEtablissement = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/etablissement/");
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      if (response.data.length > 0) {
        setNumEtablissement(parseInt(response.data[0].numEtablissement));
      } else {
        setError({ status: true, composant: "Etablissement", message: "Aucun établissement trouvé !" });
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
      console.log("Le tache est terminé");
    }
  };
  const sendData = async (mentionData) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/mention/ajouter/", mentionData);
      if (response.status !== 201) throw new Error('Erreur code : ' + response.status);
      console.log("ajouter");
      getData();
    } catch (error) {
      console.error("Erreur:", error.response?.data || error.message);
    }
  };

  const putData = async (mentionData) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/mention/modifier/${id}`, mentionData);
      if (response.status !== 200) throw new Error('Erreur code : ' + response.status);
      console.log("modifié");
      getData();
    } catch (error) {
      console.error("Erreur:", error.response?.data || error.message);
    }
  };

  const removeMention = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/mention/supprimer/${parseInt(id)}`)
      if (response.status !== 200 && response.status !== 204) {
        throw new Error(`Erreur lors de la suppression : Code ${response.status}`)
      }
      console.log(`mention ${id} supprimé avec succès`);
      getData()
    } catch (error) {
      console.log("Erreur:", error.message)
    }
  }

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/mention/");
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setListeMention(response.data);
      setOriginalList(response.data);  // ✅ Mise à jour ici
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
      console.log("Le tache est terminé");
    }
  };
  const editMention = (numMention) => {
    const selectedMention = listeMention.find((item) => item.numMention === numMention)
    if (selectedMention) {
      setDataMention({ ...dataMention, nomMention: selectedMention.nomMention, codeMention: selectedMention.codeMention })
      setId(selectedMention.numMention)
    }
  }
  const confirmerSuppression = (id) => {
    setId(id);
    setIsConfirmModalOpen(true);
  }

  function handleSearch(e) {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() !== "") {
      const filtered = originalList.filter((mention) =>
        mention.nomMention.toLowerCase().includes(value.toLowerCase()) ||
        mention.codeMention.toLowerCase().includes(value.toLowerCase()) ||
        mention.numMention.toString().includes(value)
      );
      setListeMention(filtered);
    } else {
      setListeMention(originalList);
    }
  }
  useEffect(() => {
    if (numEtablissement) {
      setDataMention((prev) => ({
        ...prev,
        numEtablissement: parseInt(numEtablissement),
      }));
    }
  }, [numEtablissement]);
  useEffect(() => {
    getNumEtablissement()
    getData()

  }, [])
  const nombreElemParParge = 8;
  const [pageActuel, setPageActuel] = useState(1);

  const totalPages = Math.ceil(listeMention.length / nombreElemParParge);
  const currentData = listeMention.slice((pageActuel - 1) * nombreElemParParge, pageActuel * nombreElemParParge);

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
              {isadd ? (<h1 className="text-blue-600 text-xl font-bold">Nouvelle Mention</h1>) : (<h1 className="text-blue-600 text-xl font-bold">Modification d'une Mention</h1>)}
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsclicked(false);
                  setError({ ...error, status: false })
                  setDataMention({ nomMention: "", codeMention: "" })
                }}
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Nom de la Mention</label>
              <input
                type="text"
                value={dataMention.nomMention}
                onChange={(e) => setDataMention({ ...dataMention, nomMention: e.target.value })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {
                (error.status && error.composant === "nomMention") && (<p className='text-red-600 text-sm'>{error.message}</p>)
              }
            </div>

            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Code de la Mention</label>
              <input
                type="text"
                value={dataMention.codeMention}
                onChange={(e) => setDataMention({ ...dataMention, codeMention: e.target.value })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {
                (error.status && error.composant === "codeMention") && (<p className='text-red-600 text-sm'>{error.message}</p>)
              }
            </div>
            <input type="hidden" name="id" value={id} onChange={() => setId(e.target.value)} />

            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  if (dataMention.nomMention.trim() !== "" && dataMention.codeMention.trim() !== "") {
                    if (isadd) {
                      setDataMention((prev) => {
                        const updated = { ...prev, numEtablissement: numEtablissement };
                        sendData(updated);
                        return { nomMention: "", codeMention: "" };

                      });
                    } else {
                      setDataMention((prev) => {
                        const updated = { ...prev, numEtablissement: numEtablissement };
                        putData(updated);
                        return { nomMention: "", codeMention: "" };

                      });
                    }

                  } else {
                    (dataMention.nomMention.trim() === "") ? setError({ error, status: true, composant: "nomMention", message: "Le nom du mention ne peut pas etre vide" }) : setError({ error, status: true, composant: "codeMention", message: "Le code du mention ne peut pas etre vide" })

                  } setIsclicked(false);
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
                <h1 className="text-blue-600 text-xl font-bold">Suppression Mention</h1>
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
                <p>Etes vous sur de vouloir supprimer cette mention ?</p>
              </div>
              <input type="hidden" name="id" value={id} onChange={() => setId(e.target.value)} />
              <div className="w-full flex justify-center">
                <button
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                  onClick={() => {
                    if (id !== "") {
                      removeMention(id)
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
          <h1 className="font-bold">Liste des Mentions enregistrées</h1>
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
          ) : listeMention.length === 0 ? (
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
                    <th className="px-4 py-4">Nom de la Mention</th>
                    <th className="px-4 py-4">Code de la Mention</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {currentData.map((Mention, index) => (
                    <tr key={index} className="border-b transition-all duration-300  hover:bg-gray-100">
                      <td className="px-4 py-2 text-center">{Mention.numMention}</td>
                      <td className="px-4 py-2 text-center">{Mention.nomMention}</td>
                      <td className="px-4 py-2 text-center">{Mention.codeMention}</td>

                      <td className="px-4 py-2 flex justify-center items-center gap-2">
                        <button className="p-1 rounded hover:bg-gray-200">
                          <img src="/Icons/modifier.png" alt="Modifier" className="w-5" onClick={() => { setIsclicked(true); setisadd(false); editMention(Mention.numMention) }} />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-200" onClick={() => confirmerSuppression(Mention.numMention)}>
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

export default Mention