import React, { useState } from 'react'
import { useSidebar } from '../Context/SidebarContext';
import Creatable, { useCreatable } from 'react-select/creatable';

function Classe() {
  const { isReduire } = useSidebar();
  const [idClasse, setIdClasse] = useState("")
  const [nomClasse, setNomClasse] = useState("")
  const [isclicked, setIsclicked] = useState(false)
  const [parcours, setParcours] = useState(null);
  const [groupe, setGroupe] = useState(null);
  const [search, setSearch] = useState(null);

  const [isadd, setisadd] = useState(true)
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

  const listeClasse = Array.from({ length: 16 }, (_, i) => `S${String(i + 1).padStart(3, '0')}`);
  const nombreElemParParge = 8;
  const [pageActuel, setPageActuel] = useState(1);

  const totalPages = Math.ceil(listeClasse.length / nombreElemParParge);
  const currentData = listeClasse.slice((pageActuel - 1) * nombreElemParParge, pageActuel * nombreElemParParge);

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
          <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[90%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              {isadd ? (<h1 className="text-blue-600 text-xl font-bold">Nouvelle Classe</h1>) : (<h1 className="text-blue-600 text-xl font-bold">Modification d'une Classe</h1>)}
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => setIsclicked(false)}
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Identifiant de la Classe</label>
              <input
                type="text"
                value={idClasse}
                onChange={(e) => setIdClasse(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Niveau</label>
              <Creatable
                isClearable
                placeholder="Choisissez ou créez un niveau"
                onChange={(newValue) => setNomClasse(newValue)}
                options={[
                  { value: ' l1', label: 'L1' },
                ]}
                className="text-sm"
              />
            </div>


            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Parcours</label>
              <Creatable
                isClearable
                placeholder="Choisissez ou créez un parcours"
                onChange={(newValue) => setParcours(newValue)}
                options={[
                  { value: ' Parcours A', label: ' Parcours A' },
                  { value: ' Parcours B', label: ' Parcours B' },
                  { value: 'Parcours C', label: 'Parcours C' }
                ]}
                className="text-sm"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Groupe</label>
              <Creatable
                isClearable
                placeholder="Choisissez ou créez un groupe"
                onChange={(newValue) => setGroupe(newValue)}
                options={[
                  { value: ' Parcours A', label: ' Parcours A' },
                  { value: ' Parcours B', label: ' Parcours B' },
                  { value: 'Parcours C', label: 'Parcours C' }
                ]}
                className="text-sm"
              />
            </div>

            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  console.log(isadd ? "Classe ajoutée" : "Classe modifiée", { idClasse, nomClasse, parcours, groupe });
                  setIsclicked(false);
                }}
              >
                {isadd ? "AJOUTER" : "MODIFIER"}
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

      {/*Listes*/}
      <div className={`${isReduire ? "fixed h-screen right-0 top-14 left-20 p-5 z-40 flex flex-col gap-3 overflow-auto bg-white rounded  transition-all duration-700" : "fixed h-screen right-0 top-14 left-56 p-5 z-40 flex flex-col gap-3 overflow-auto bg-white rounded  transition-all duration-700"}`}>
        <div className="flex justify-between w-full">
          <h1 className="font-bold">Liste des Classes enregistrées</h1>
          <button className="button flex gap-3 hover:scale-105 transition duration-200" onClick={() => { setIsclicked(true); setisadd(true); }}>
            <img src="/Icons/plus-claire.png" alt="Plus" className='w-6 h-6' /> Nouveau
          </button>
        </div>

        <div className="w-full border rounded-t-lg overflow-hidden">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-blue-500 text-white text-sm">
                <th className="px-4 py-4">#</th>
                <th className="px-4 py-4">Niveau</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentData.map((Classe, index) => (
                <tr key={index} className="hover:bg-gray-100 border-b">
                  <td className="px-4 py-2 text-center">{(pageActuel - 1) * nombreElemParParge + index + 1}</td>
                  <td className="px-4 py-2 text-center">{Classe}</td>

                  <td className="px-4 py-2 flex justify-center items-center gap-2">
                    <button className="p-1 rounded hover:bg-gray-200">
                      <img src="/Icons/modifier.png" alt="Modifier" className="w-5" onClick={() => { setIsclicked(true); setisadd(false); }} />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-200">
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

      </div>
    </>
  )
}

export default Classe