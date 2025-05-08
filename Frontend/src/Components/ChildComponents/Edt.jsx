import React, { useState } from 'react'
import { useSidebar } from '../Context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import Creatable, { useCreatable } from 'react-select/creatable';

function Edt() {
  const [isclicked, setIsclicked] = useState(false)
  const [search, setSearch] = useState(null);
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

  const listeEDT = Array.from({ length: 16 }, (_, i) => `S${String(i + 1).padStart(3, '0')}`);
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
      <div className="absolute top-0 left-[25%]  w-[60%]  h-14 flex justify-center items-center z-[51]">

        <input
          type="text"
          placeholder='Rechercher ici...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 ps-12 relative rounded w-[50%]  focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <img src="/Icons/rechercher.png" alt="Search" className='w-6 absolute left-[26%]' />
      </div>
      <div className={`${isReduire ? "left-20" : "left-56"} fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}>
        <div className="flex flex-col gap-1">
          <div className='flex flex-row gap-3 mb-5'>
            <button className='font-bold hover:scale-105 text-bleu' onClick={versGeneral}>Géneral</button>
            <button className=' hover:scale-105 text-gray-500' onClick={versCreationEdt}>Creation</button>
            <button className=' hover:scale-105 text-gray-500' onClick={versAFfichage}>Affichage</button>
            {/* <button className=' hover:scale-105 text-gray-500' onClick={versProfile}>Profile</button> */}
          </div>
          <div className="flex justify-between items-center w-full">
            <h1 className="font-bold">Liste des emplois du temps enregistrées</h1>
            <button className="button flex gap-3 hover:scale-105 transition duration-200" onClick={() => { setIsclicked(true); setisadd(true); }}>
              <img src="/Icons/plus-claire.png" alt="Plus" className='w-6 h-6' /> Nouveau
            </button>
          </div>
          <div className="w-full border rounded-t-lg overflow-hidden">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-blue-500 text-white text-sm">
                  <th className="px-4 py-4">#</th>
                  <th className="px-4 py-4">EDT</th>
                  <th className="px-4 py-4">Date de debut</th>
                  <th className="px-4 py-4">Date de fin</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {currentData.map((EDT, index) => (
                  <tr key={index} className="border-b transition-all duration-300 hover:bg-gray-100">
                    <td className="px-4 py-2 text-center">{(pageActuel - 1) * nombreElemParParge + index + 1}</td>
                    <td className="px-4 py-2 text-center">L1IG</td>
                    <td className="px-4 py-2 text-center">05/05/2024</td>
                    <td className="px-4 py-2 text-center">15/05/2024</td>
                    <td className="px-4 py-2 flex justify-center items-center gap-2">
                      <button className="p-1 rounded hover:bg-gray-200">
                        <img src="/Icons/modifier.png" alt="Modifier" className="w-5" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-200">
                        <img src="/Icons/supprimer.png" alt="Supprimer" className="w-5" />
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

        </div>
      </div >
    </>
  );
}

export default Edt