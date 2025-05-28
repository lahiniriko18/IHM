import React, { useEffect, useState } from 'react'
import { useSidebar } from '../Context/SidebarContext';
import Calendar from 'react-calendar'
import axios from "axios"
function Dashboard() {
  const [listeEDT, setListeEdt] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const getStats = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/statistique/effectif")
      if (response.status != 200) {
        throw new Error(`Erreur lors de la récupération des données: Code ${response.status}`)
      }

      setStats(response.data)

    } catch (error) {
      console.log("Erreur:", error.message)
    } finally {
      console.log('La tâche est terminée')
    }
  }
  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/edt/dernier");
      // console.log("Données brutes reçues :", response.data); // 👈 Ajoute ceci
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setListeEdt([response.data]);
      setIsLoading(false);
    } catch (error) {
      if (error.response) {
        console.error("Erreur du serveur :", error.response.data)
      } else {
        console.error("Erreur inconnue :", error.message)
      }
    }
  };

  useEffect(() => {
    getStats()
    getData();
  }, [])
  function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }

  const { isReduire } = useSidebar();
  return (
    <div className={`${isReduire ? "fixed h-screen  right-0 top-12 left-16 ps-5  pt-3 z-40 flex flex-wrap flex-col gap-5 justify-start items-start overflow-auto duration-700 transition-all" : "fixed h-screen  right-0 top-12 left-52 ps-5  pt-3 z-40 flex flex-wrap flex-col gap-5 justify-start items-start overflow-auto duration-700 transition-all"}`}>
      {/* Card stats */}
      <div className="flex flex-wrap gap-4 justify-between w-full pe-2">
        <div className="bg-white w-48 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
          <p className="font-bold">{stats.edt ?? 0}</p>
          <div className="flex items-center gap-3">
            <img src="/Icons/icons8-objet-avec-durée-50.png" alt="Edt" className='w-5' />
            <p>Edt créer</p>
          </div>
        </div>

        <div className="bg-white w-48 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
          <p className="font-bold">{stats.professeur ?? 0}</p>
          <div className="flex items-center gap-3">
            <img src="/Icons/icons8-prof-60.png" alt="Professeur" className='w-5' />
            <p>Professeur</p>
          </div>
        </div>

        <div className="bg-white w-48 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
          <p className="font-bold">{stats.matiere ?? 0}</p>
          <div className="flex items-center gap-3">
            <img src="/Icons/cahier.png" alt="Matiere" className='w-5' />
            <p>Matière</p>
          </div>
        </div>

        <div className="bg-white w-48 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
          <p className="font-bold">{stats.classe ?? 0}</p>
          <div className="flex items-center gap-3">
            <img src="/Icons/icons8-école-48.png" alt="Classe" className='w-5' />
            <p>Classe</p>
          </div>
        </div>

        <div className="bg-white w-48 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
          <p className="font-bold">{stats.parcours ?? 0}</p>
          <div className="flex items-center gap-3">
            <img src="/Icons/mention.png" alt="Mention" className='w-5' />
            <p>Parcours</p>
          </div>
        </div>


      </div>
      {/* end Card stats */}
      {/* <div>

        <p>{stats.total_edt ?? 0}</p>

      </div> */}

      <div className="flex justify-between w-full pe-2 flex-wrap">
        <div className="w-[68%] p-4  bg-white  rounded flex flex-col gap-2">
          <p className="font-bold text-bleu">
            Horaires
          </p>
          <div className="flex flex-row justify-between items-start flex-wrap ps-10">
            <img src="/Images/curves.png" alt="Courbe " className='w-80' />
            <div className=' me-10'>
              <p className="font-semibold">Legendes:</p>
              <p>-Bla</p>
              <p>-Bla</p>
              <p>-Bla</p>
            </div>
          </div>
        </div>

        <div className="w-[30%] p-4 bg-white h-100 rounded">
          <p className="font-bold text-bleu">
            Calendrier
          </p>
          <div className=''>
            <Calendar />
          </div>
        </div>
      </div>

      <div className="h-40 bg-white  border w-full p-4 flex gap-0 flex-col">
        <p className="text-bleu font-bold">Liste de derniere emploi du temps creé</p>

        {
          isLoading ? (
            <div className="w-full h-40 flex flex-col items-center  justify-center </div>mt-[10%]">
              <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-2">Chargement des données...</p>
            </div>
          ) :
            (listeEDT.length === 0 || listeEDT.every(obj => Object.keys(obj).length === 0)) ? (
              <div className="w-full h-40  flex flex-col items-center justify-center">
                <img src="/Icons/vide.png" alt="Vide" className='w-14' />
                <p className='text-gray-400'>Aucun données trouvé</p>
              </div>) : (

              <div className='overflow-hidden rounded-t-lg mt-4 bg-white shadow border w-full'>
                <table className="table-auto w-full rounded-xl border-collapse ">
                  <thead>
                    <tr className="bg-blue-500 text-white text-sm">
                      <th className="px-4 py-3 ">#</th>
                      <th className="px-4 py-3 ">Classe</th>
                      <th className="px-4 py-3 ">Date de début</th>
                      <th className="px-4 py-3 ">Date de fin</th>
                      <th className="px-4 py-3 ">Utilisateur</th>
                      <th className="px-4 py-3 ">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {(listeEDT).map((EDT, index) => (
                      <tr key={index} className="hover:bg-gray-100 -t">
                        <td className="px-4 py-2  text-center">{index + 1}</td>
                        <td className="px-4 py-2  text-center">{EDT.niveauParcours}</td>
                        <td className="px-4 py-2  text-center">{EDT.dateDebut}</td>
                        <td className="px-4 py-2  text-center">{EDT.dateFin}</td>
                        <td className="px-4 py-2  text-center">Avotra</td>
                        <td className="px-4 py-2  text-center">
                          <button className="p-1 rounded hover:bg-gray-200">
                            <img src="/Icons/afficher.png" alt="actions" className="w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
        }
      </div>
    </div>
  )
}

export default Dashboard;
