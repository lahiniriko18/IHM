import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../../Context/SidebarContext';

function EdtNew() {
  const [isclicked, setIsclicked] = useState(false)
  const [isadd, setisadd] = useState(true)
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
  // const versProfile = () => {
  //   navigate('/parametre/profile')
  // }
  const [modeCreation, setModeCreation] = useState(null);
  const { isReduire } = useSidebar();
  return (
    <>
      {/* modal */}
      {(isclicked) ? (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center"
          tabIndex="-1"
        >
          <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[95%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              {isadd ? (<h1 className="text-blue-600 text-xl font-bold">Nouvelle EDT</h1>) : (<h1 className="text-blue-600 text-xl font-bold">Modification d'une EDT</h1>)}
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsclicked(false);
                  setModeCreation(null)
                }}
              />
            </div>

            <div className="flex w-full flex-row gap-2">
              <div className="flex flex-col w-full">
                <label className="font-semibold text-sm mb-1">Date debut</label>
                <input
                  type="date"
                  onChange={(e) => setIdMatiere(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="font-semibold text-sm mb-1">Date fin</label>
                <input
                  type="date"
                  onChange={(e) => setIdMatiere(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            </div>

            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Niveau</label>
              <Creatable
                isClearable
                isValidNewOption={() => false} // Empêche l'utilisateur d'écrire
                placeholder="Choisissez  un classe"
                options={[
                  { value: 'l1', label: 'L1' },
                  { value: 'l2', label: 'L2' },
                  { value: 'l3', label: 'L3' }
                ]}
                className="text-sm"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Parcours</label>
              <Creatable
                isClearable
                isValidNewOption={() => false} // Empêche l'utilisateur d'écrire
                placeholder="Choisissez  un parcour"

                options={[
                  { value: 'Parcours A', label: 'Parcours A' },
                  { value: 'Parcours B', label: 'Parcours B' },
                  { value: 'Parcours C', label: 'Parcours C' }
                ]}
                className="text-sm"
              />
            </div>

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
            {modeCreation === 'excel' && (
              <div className="flex flex-col w-full">
                <label className="font-semibold text-sm mb-1">Choisissez le fichier</label>

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
                  onChange={(e) => {
                    const fileName = e.target.files?.[0]?.name || 'Aucun fichier choisi';
                    document.getElementById('file-name').textContent = fileName;
                  }}
                  className="hidden"
                />
              </div>)}


            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  setIsclicked(false)
                  versCreationEdt();
                }}
              >
                {modeCreation === 'excel' ? 'VALIDER' : 'AJOUTER'}
              </button>

            </div>
          </div>
        </div>
      ) : ""}

      {/*Search */}

      <div className={`${isReduire ? "left-20" : "left-56"} fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}>
        <div className="flex flex-col gap-1">
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
        </div>
      </div >
    </>
  );
}

export default EdtNew