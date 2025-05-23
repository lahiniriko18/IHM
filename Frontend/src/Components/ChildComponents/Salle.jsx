import React, { useEffect, useState } from 'react';
import { useSidebar } from '../Context/SidebarContext';
import axios from "axios"
function Salle() {
  const { isReduire } = useSidebar();
  const [isclicked, setIsclicked] = useState(false);
  const [listeSalle, setListeSalle] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [isadd, setisadd] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState()
  const [dataSalle, setDataSalle] = useState({ nomSalle: "", lieuSalle: "" })
  const nombreElemParParge = 8;
  const [pageActuel, setPageActuel] = useState(1);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [search, setSearch] = useState('')
  const [error, setError] = useState({ status: false, composant: "", message: "" })
  const [isDeleteByCheckBox, setDeleteByChekbox] = useState(true);
  const [checkedRows, setCheckedRows] = useState([]);
  const allChecked = checkedRows.length === listeSalle.length && listeSalle.length > 0;

  const handleCheck = (id) => {
    setCheckedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCheckAll = () => {
    if (allChecked) {
      setCheckedRows([]);
    } else {
      setCheckedRows(listeSalle.map((item) => item.numSalle));
    }
  };
  const sendData = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/salle/ajouter/", dataSalle)
      if (response.status !== 201) {
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
  const removeSalle = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/salle/supprimer/${parseInt(id)}`)
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
      const response = await axios.put(`http://127.0.0.1:8000/api/salle/modifier/${id}`, dataSalle)
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
      const response = await axios.get("http://127.0.0.1:8000/api/salle/");
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setListeSalle(response.data);
      setOriginalList(response.data);

      // ✅ Mise à jour ici
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
      console.log("Le tache est terminé");
    }
  };
  const removeSalleByCkeckBox = async () => {
    const formData = new FormData();
    if (Array.isArray(checkedRows)) {
      checkedRows.forEach((val) => {
        formData.append('numSalles[]', parseInt(val));
      });
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/salle/supprimer/liste/", formData);

      if (response.status !== 200 && response.status !== 204) {
        throw new Error(`Erreur lors de la suppression : Code ${response.status}`);
      }

      console.log(`salles supprimés avec succès`);
      getData();
      setCheckedRows([]) // Recharge la liste après suppression
    } catch (error) {
      console.error("Erreur:", error.response.data?.status || error.message);
    }
  };
  const editSalle = (numSalle) => {
    const selectedSalle = listeSalle.find((item) => item.numSalle === numSalle)
    if (selectedSalle) {
      setDataSalle({ ...dataSalle, nomSalle: selectedSalle.nomSalle, lieuSalle: selectedSalle.lieuSalle })
      setId(selectedSalle.numSalle)
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
      const filtered = originalList.filter((Salle) =>
        Salle.nomSalle.toLowerCase().includes(value.toLowerCase()) ||
        Salle.lieuSalle.toLowerCase().includes(value.toLowerCase()) ||
        Salle.numSalle.toString().includes(value)
      );
      setListeSalle(filtered);
    } else {
      setListeSalle(originalList);
    }
  }

  useEffect(() => {
    getData()

  }, [])
  const totalPages = Math.ceil(listeSalle.length / nombreElemParParge);
  const currentData = listeSalle.slice((pageActuel - 1) * nombreElemParParge, pageActuel * nombreElemParParge);

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
                <h1 className="text-blue-600 text-xl font-bold">Nouvelle salle</h1>
              ) : (
                <h1 className="text-blue-600 text-xl font-bold">Modification d'une salle</h1>
              )}
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsclicked(false);
                  setError({ ...error, status: false })
                  setDataSalle({ nomSalle: "", lieuSalle: "" })
                }}
              />
            </div>



            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Nom de la salle</label>
              <input
                type="text"
                value={dataSalle.nomSalle}
                onChange={(e) => setDataSalle({ ...dataSalle, nomSalle: e.target.value })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {
                (error.status && error.composant === "nomSalle") && (<p className='text-red-600 text-sm'>{error.message}</p>)
              }
            </div>

            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Lieu de la salle</label>
              <input
                type="text"
                value={dataSalle.lieuSalle}
                onChange={(e) => setDataSalle({ ...dataSalle, lieuSalle: e.target.value })}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {
                (error.status && error.composant === "lieuSalle") && (<p className='text-red-600 text-sm'>{error.message}</p>)
              }
            </div>

            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  if (dataSalle.nomSalle.trim() !== "" && dataSalle.lieuSalle.trim() !== "") {
                    if (isadd) {
                      sendData()
                      setDataSalle({ nomSalle: "", lieuSalle: "" })
                      setIsclicked(false);
                      setError({ ...error, status: false })
                    }
                    else {
                      putData()
                      setDataSalle({ nomSalle: "", lieuSalle: "" })
                      setIsclicked(false);
                      setError({ ...error, status: false })
                    }
                  } else {
                    (dataSalle.nomSalle.trim() === "") ? setError({ error, status: true, composant: "nomSalle", message: "Le nom du Salle ne peut pas etre vide" }) : setError({ error, status: true, composant: "lieuSalle", message: "Le lieu de la Salle ne peut pas etre vide" })
                  }
                }}
              >
                {isadd ? 'AJOUTER' : 'MODIFIER'}
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
                <h1 className="text-blue-600 text-xl font-bold">Suppression Salle</h1>
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
                <p>Etes vous sur de vouloir supprimer cette salle ?</p>
              </div>
              <input type="hidden" name="id" value={id} onChange={() => setId(e.target.value)} />
              <div className="w-full flex justify-center">
                <button
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                  onClick={() => {
                    if (id !== "") {
                      removeSalle(id)
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
      <div className="absolute top-0 left-[25%]  w-[60%]  h-14 flex justify-center items-center z-[51]">
        <input
          type="text"
          placeholder="Rechercher ici..."
          value={search}
          onChange={handleSearch}
          className="border p-2 ps-12 relative rounded w-[50%]  focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <img src="/Icons/rechercher.png" alt="Search" className="w-6 absolute left-[26%]" />
      </div>

      <div
        className={`${isReduire
          ? 'fixed h-screen right-0 top-14 left-20 p-5 z-40 flex flex-col gap-3 overflow-auto bg-white rounded  transition-all duration-700'
          : 'fixed h-screen right-0 top-14 left-56 p-5 z-40 flex flex-col gap-3 overflow-auto bg-white rounded  transition-all duration-700'
          }`}
      >
        <div className="flex justify-between w-full">
          <h1 className="font-bold">Liste des salles enregistrées</h1>
          <button
            className="button flex gap-3 hover:scale-105 transition duration-200"
            onClick={() => {
              setIsclicked(true);
              setisadd(true);
            }}
          >
            <img src="/Icons/plus-claire.png" alt="Plus" className="w-6 h-6" /> Nouveau
          </button>
        </div>
        {
          isLoading ? (
            <div className="w-full h-40 flex flex-col items-center  justify-center mt-[10%]">
              <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-2">Chargement des données...</p>
            </div>
          ) : listeSalle.length === 0 ? (
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
                    <th className="px-4 py-4">Nom de la salle</th>
                    <th className="px-4 py-4">Lieu de la salle</th>
                    <th className="px-4 py-4">Statut actuel de la salle</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {currentData.map((Salle, index) => (


                    <tr key={index} className="border-b transition-all duration-300  hover:bg-gray-100">
                      <td className="px-4 py-2 text-center">{Salle.numSalle}</td>
                      <td className="px-4 py-2 text-center">{Salle.nomSalle}</td>
                      <td className="px-4 py-2 text-center">{Salle.lieuSalle}</td>
                      <td className="px-4 py-2 text-center">

                        <span
                          className={`px-2 py-1 rounded text-white text-xs font-semibold
                           ${Salle.statut ? "bg-green-600" : "bg-red-500"}`}
                        >
                          {Salle.statut ? "libre" : "Occupé"}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex justify-center items-center gap-2">
                        <button className="p-1 rounded hover:bg-gray-200">
                          <img src="/Icons/modifier.png" alt="Modifier" className="w-5" onClick={() => { setIsclicked(true); setisadd(false); editSalle(Salle.numSalle) }} />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-200" onClick={() => confirmerSuppression(Salle.numSalle)}>
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
  );
}

export default Salle;