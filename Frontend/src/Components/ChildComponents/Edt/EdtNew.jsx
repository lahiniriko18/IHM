import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../../Context/SidebarContext';
import Creatable, { useCreatable } from 'react-select/creatable';

function EdtNew() {
  const [isNewValue, setIsNewValue] = useState(false)
  const [isEditHours, setIsEditHours] = useState(false)
  const navigate = useNavigate();
  const versGeneral = () => {
    navigate('/edt')
  }
  const versCreationEdt = () => {
    navigate('/edt/nouveau-edt')
  }
  const versAFfichage = () => {
    navigate('/edt/affichage-edt')
  }
  const [modeCreation, setModeCreation] = useState(null);
  const { isReduire } = useSidebar();
  const [ligne, setLigne] = useState(1)
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const [horaires, setHoraires] = useState([{
    id: 1,
    heure_debut: 8,
    heure_fin: 10
  },])
  const [selectedCell, setSelectedCell] = useState(null);

  const handleClick = (jour, horaire) => {
    setSelectedCell({ jour, horaire });
    alert(`Ajouter un cours pour ${jour} à ${horaire}`);
  };
  return (
    <>

      {(isNewValue) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center"
          tabIndex="-1"
        >
          <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[95%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-blue-600 text-xl font-bold">Lundi 8h-10H</h1>
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsNewValue(false);
                  setModeCreation(null)
                }}
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Groupe</label>
              <Creatable
                isClearable
                // isValidNewOption={() => false} // Empêche l'utilisateur d'écrire
                placeholder="Choisissez le groupe"
                options={[
                  { value: '1', label: 'Groupe 1' },
                  { value: '2', label: 'Groupe 2 ' },
                  { value: '3', label: 'Groupe 3' }
                ]}
                className="text-sm"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Matière</label>
              <Creatable
                isClearable
                isValidNewOption={() => false} // Empêche l'utilisateur d'écrire
                placeholder="Choisissez  le matiere"

                options={[
                  { value: '2', label: 'Python' },
                  { value: '4', label: 'Mathematique Discrete' },
                  { value: '78', label: 'OCC' }
                ]}
                className="text-sm"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Professeur</label>
              <Creatable
                isClearable
                isValidNewOption={() => false} // Empêche l'utilisateur d'écrire
                placeholder="Choisissez le professeur"

                options={[
                  { value: '3', label: 'Mr Fontaine' },
                  { value: '45', label: 'Mr haja' },
                  { value: '21', label: 'Mr Josué' }
                ]}
                className="text-sm"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Salle</label>
              <Creatable
                isClearable
                isValidNewOption={() => false} // Empêche l'utilisateur d'écrire
                placeholder="Choisissez le salle"

                options={[
                  { value: '3', label: '106' },
                  { value: '45', label: '11' },
                  { value: '21', label: '005' }
                ]}
                className="text-sm"
              />
            </div>


            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  setIsNewValue(false)
                  versCreationEdt();
                }}
              >
                VALIDER
              </button>

            </div>
          </div>
        </div>
      )}


      {(isEditHours) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center"
          tabIndex="-1"
        >
          <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[95%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-blue-600 text-xl font-bold">Horaire </h1>
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsEditHours(false);
                }}
              />
            </div>

            <div className="flex w-full flex-col gap-2">
              <div className="flex flex-col w-full">
                <label className="font-semibold text-sm mb-1">heure du debut</label>
                <input
                  type="time"
                  className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="font-semibold text-sm mb-1">heure fin fin</label>
                <input
                  type="time"
                  className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            </div>

            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  setIsEditHours(false)
                }}
              >
                VALIDER
              </button>

            </div>
          </div>
        </div>
      )}



      <div className={`${isReduire ? "left-20" : "left-56"} fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}>
        <div className="flex flex-col gap-2">
          <div className='flex flex-row gap-3 mb-5'>
            <button className=' hover:scale-105 text-gray-500' onClick={versGeneral}>Géneral</button>
            <button className=' font-bold hover:scale-105 text-bleu' onClick={versCreationEdt}>Creation</button>
            <button className=' hover:scale-105 text-gray-500' onClick={versAFfichage}>Affichage</button>
          </div>
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-bleu font-bold">Creation EDT pour <span>L1 IG</span></h1>
            <div className="flex flex-row gap-2 items-center w-[70%]  pe-8">
              <div className='flex flex-row items-center'>
                <p className='w-40'>Date debut : </p>
                <input
                  type="date"
                  className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
              <div className='flex flex-row items-center'>
                <p className='w-40'>Date de fin : </p>
                <input
                  type="date"
                  className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            </div>
          </div>

          {/* tableau */}
          <div className="overflow-x-auto">
            <table className="table-fixed border border-black w-full text-sm">
              <thead>
                <tr>
                  <th className="border border-black border-t-white border-l-white"></th>
                  {jours.map((jour) => (
                    <th key={jour} className="border border-black p-2">{jour}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horaires.map((horaire, i) => (
                  <tr key={i}>
                    <td className="border border-black p-2 font-semibold relative ">
                      <span className="flex flex-row items-center justify-center">
                        <p>{horaire.heure_debut}h</p>
                        <i>-</i>
                        <p>{horaire.heure_fin}h</p>
                      </span>
                      <img src="/Icons/modifier.png" alt="" className="absolute bottom-6 right-1 w-6 cursor-pointer" onClick={() => {
                        setIsEditHours(true);
                        setIsNewValue(false)
                      }} />
                    </td>
                    {jours.map((jour) => (
                      <td
                        key={jour}
                        className="border border-black h-16 cursor-pointer"
                      >
                        <div className="flex h-full">
                          <div className="w-1/2  hover:bg-blue-100 transition flex justify-center items-center border-r  border-gray-300" onClick={() => {
                            setIsEditHours(false);
                            setIsNewValue(true)
                          }} >
                            <img src="/Icons/plus.png" alt="" className="w-6 h-6" />
                          </div>
                          <div className="w-1/2  hover:bg-blue-100 transition flex justify-center items-center" onClick={() => {
                            setIsEditHours(false);
                            setIsNewValue(true)
                          }} >
                            <img src="/Icons/plus.png" alt="" className="w-6 h-6 " />
                          </div>
                        </div>

                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div >
    </>
  );
}

export default EdtNew