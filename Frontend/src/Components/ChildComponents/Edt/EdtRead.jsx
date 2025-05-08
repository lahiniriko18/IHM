import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../../Context/SidebarContext';
import Creatable from 'react-select/creatable';

function EdtRead() {
  const { isReduire } = useSidebar();
  const navigate = useNavigate();
  const versGeneral = () => navigate('/edt');
  const versCreationEdt = () => navigate('/edt/nouveau-edt');
  const versAFfichage = () => navigate('/edt/affichage-edt');
  const [modele, setModele] = useState(1); // 1 = horaire en ligne ; 2 = horaire en colonne
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const [horaires, setHoraires] = useState([{ id: 1, heure_debut: 8, heure_fin: 10 }]);
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
  return (
    <div className={`${isReduire ? "left-20" : "left-56"} fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}>
      <div className="flex flex-col gap-1 h-full">
        <div className='flex gap-3'>
          <button className='hover:scale-105 text-gray-500' onClick={versGeneral}>Géneral</button>
          <button className=' hover:scale-105 text-gray-500' onClick={versCreationEdt}>Creation</button>
          <button className='font-bold hover:scale-105  text-blue-600' onClick={versAFfichage}>Affichage</button>
        </div>

        <div className="flex justify-between items-center  ">
          <span className="text-blue-600 font-bold flex flex-row items-center z-50">Affichage EDT pour :
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
                        {/* <img src="/Icons/modifier.png" alt="" className="absolute bottom-2 right-1 w-5 cursor-pointer" onClick={() => setIsEditHours(true)} /> */}
                      </td>
                      {jours.map((jour) => (
                        <td key={jour} className="border cursor-pointer h-20 relative" onClick={() => handleClick(jour, horaire)}>
                          <div className="absolute inset-0 flex items-center justify-center hover:bg-gray-200">
                            {/* <img src="/Icons/plus.png" alt="" className="w-6 h-6" /> */}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* <div className="flex justify-end mt-2">
                <img
                  src="/Icons/plus.png"
                  alt="Ajouter une ligne"
                  className='w-8 cursor-pointer'
                  onClick={ajouterColonne}
                />
              </div> */}
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
                        {/* <img src="/Icons/modifier.png" alt="" className="absolute bottom-2 right-1 w-5 cursor-pointer" onClick={() => setIsEditHours(true)} /> */}
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
                            edt
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* <div className="flex justify-end mt-2">
                <img
                  src="/Icons/plus.png"
                  alt="Ajouter une colonne"
                  className='w-8 cursor-pointer'
                  onClick={ajouterColonne}
                />
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EdtRead