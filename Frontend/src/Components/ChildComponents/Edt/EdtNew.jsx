import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../../Context/SidebarContext';
import Creatable from 'react-select/creatable';

function EdtNew() {
  const [isNewValue, setIsNewValue] = useState(false);
  const [isEditHours, setIsEditHours] = useState(false);
  const [intervalHoraire, setIntervalHoraire] = useState(2);
  const [selectedCell, setSelectedCell] = useState(null);

  const navigate = useNavigate();
  const { isReduire } = useSidebar();
  const [modele, setModele] = useState(1); // 1 = horaire en ligne ; 2 = horaire en colonne
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const [horaires, setHoraires] = useState([{ id: 1, heure_debut: 8, heure_fin: 10 }]);

  const versGeneral = () => navigate('/edt');
  const versCreationEdt = () => navigate('/edt/nouveau-edt');
  const versAFfichage = () => navigate('/edt/affichage-edt');

  const ajouterColonne = () => {
    const last = horaires[horaires.length - 1];
    const newStart = last.heure_fin;
    const newEnd = parseFloat((newStart + intervalHoraire).toFixed(2));
    const nouvelleColonne = {
      id: horaires.length + 1,
      heure_debut: newStart,
      heure_fin: newEnd
    };
    setHoraires([...horaires, nouvelleColonne]);
  };

  const handleClick = (jour, horaire) => {
    setSelectedCell({ jour, horaire });
    setIsNewValue(true);
    setIsEditHours(false);
  };

  return (
    <>
      {/* Modal de création */}
      {(isNewValue) && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center">
          <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[95%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-blue-600 text-xl font-bold">
                {selectedCell?.jour} {selectedCell?.horaire?.heure_debut}h-{selectedCell?.horaire?.heure_fin}h
              </h1>
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsNewValue(false);
                  setSelectedCell(null);
                }}
              />
            </div>

            {["Groupe", "Matière", "Professeur", "Salle"].map((label, i) => (
              <div key={i} className="flex flex-col w-full">
                <label className="font-semibold text-sm mb-1">{label}</label>
                <Creatable
                  isClearable
                  isValidNewOption={() => false}
                  placeholder={`Choisissez le ${label.toLowerCase()}`}
                  options={
                    label === "Groupe" ? [{ value: '1', label: 'Groupe 1' }, { value: '2', label: 'Groupe 2' }]
                      : label === "Matière" ? [{ value: '2', label: 'Python' }, { value: '4', label: 'Math Discrete' }]
                        : label === "Professeur" ? [{ value: '3', label: 'Mr Fontaine' }, { value: '21', label: 'Mr Josué' }]
                          : [{ value: '3', label: '106' }, { value: '21', label: '005' }]
                  }
                  className="text-sm"
                />
              </div>
            ))}

            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  setIsNewValue(false);
                  versCreationEdt();
                }}
              >
                VALIDER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition des heures */}
      {(isEditHours) && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center">
          <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[95%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-blue-600 text-xl font-bold">Horaire</h1>
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => setIsEditHours(false)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm mb-1">Heure de début</label>
              <input type="time" className="border p-2 rounded w-full" />
              <label className="font-semibold text-sm mb-1">Heure de fin</label>
              <input type="time" className="border p-2 rounded w-full" />
            </div>

            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700"
                onClick={() => setIsEditHours(false)}
              >
                VALIDER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${isReduire ? "left-20" : "left-56"} fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}>
        <div className="flex flex-col gap-1 h-full">
          <div className='flex gap-3'>
            <button className='hover:scale-105 text-gray-500' onClick={versGeneral}>Géneral</button>
            <button className='font-bold hover:scale-105 text-blue-600' onClick={versCreationEdt}>Creation</button>
            <button className='hover:scale-105 text-gray-500' onClick={versAFfichage}>Affichage</button>
          </div>

          <div className="flex justify-between items-center ">
            <span className="text-blue-600 font-bold flex flex-row items-center z-50">Création EDT pour :
              <Creatable
                isClearable
                isValidNewOption={() => false}
                placeholder="L1IG"
                options={
                  [{ value: '1', label: 'L1IG' },
                  { value: '1', label: 'L2IG' },
                  { value: '1', label: 'L3SR' },]
                }
                className="text-sm"
              /></span>
            <div className="flex gap-2 items-center w-[70%] pe-8">
              <div className='flex items-center'>
                <p className='w-40'>Date début : </p>
                <input type="date" className="border p-2 rounded w-full" />
              </div>
              <div className='flex items-center'>
                <p className='w-40'>Date fin : </p>
                <input type="date" className="border p-2 rounded w-full" />
              </div>
            </div>
          </div>

          {/* Tableau selon le modèle */}
          <div className="h-[73%]  w-full m-4">
            {modele === 1 ? (
              <div className="overflow-auto h-full">
                <table className="table-fixed border w-full text-sm border-black">
                  <thead className='sticky top-0 z-10'>
                    <tr>
                      <th className="border border-t-white border-l-white"></th>
                      {jours.map((jour) => (
                        <th key={jour} className="border p-2 text-center bg-gray-100">{jour}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {horaires.map((horaire, i) => (
                      <tr key={i}>
                        <td className="border p-2 font-semibold relative">
                          <span className="flex justify-center">{horaire.heure_debut}h - {horaire.heure_fin}h</span>
                          <img src="/Icons/modifier.png" alt="" className="absolute bottom-2 right-1 w-5 cursor-pointer" onClick={() => setIsEditHours(true)} />
                        </td>
                        {jours.map((jour) => (
                          <td key={jour} className="border cursor-pointer h-20 relative" onClick={() => handleClick(jour, horaire)}>
                            <div className="absolute inset-0 flex items-center justify-center hover:bg-gray-200">
                              <img src="/Icons/plus.png" alt="" className="w-6 h-6" />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-2">
                  <img
                    src="/Icons/plus.png"
                    alt="Ajouter une ligne"
                    className='w-8 cursor-pointer'
                    onClick={ajouterColonne}
                  />
                </div>
              </div>
            ) : (
              <div className="overflow-auto  h-full">
                <table className="table-fixed border w-full text-sm border-black">
                  <thead className='sticky top-0 z-10'>
                    <tr>
                      <th className="border  border-t-white border-l-white"></th>
                      {horaires.map((horaire, index) => (
                        <th key={index} className="border p-2 text-center bg-gray-100">
                          <p>{horaire.heure_debut}h - {horaire.heure_fin}h</p>
                          <img src="/Icons/modifier.png" alt="" className="absolute bottom-2 right-1 w-5 cursor-pointer" onClick={() => setIsEditHours(true)} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {jours.map((jour, i) => (
                      <tr key={i}>
                        <td className="border p-2 text-center font-semibold">{jour}

                        </td>
                        {horaires.map((horaire, j) => (
                          <td key={j} className="border cursor-pointer h-20 relative" onClick={() => handleClick(jour, horaire)}>
                            <div className="absolute inset-0 flex items-center justify-center hover:bg-gray-200">
                              <img src="/Icons/plus.png" alt="" className="w-6 h-6" />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-2">
                  <img
                    src="/Icons/plus.png"
                    alt="Ajouter une colonne"
                    className='w-8 cursor-pointer'
                    onClick={ajouterColonne}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EdtNew;
