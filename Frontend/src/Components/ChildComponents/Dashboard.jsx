import React from 'react'

function Dashboard() {
  return (
    <div className="fixed h-screen  right-0 top-12 left-52 ps-5  pt-3 z-40 flex flex-wrap flex-col gap-5 justify-start items-start overflow-auto">
      {/* Card stats */}
      <div className="flex flex-wrap gap-4 justify-between w-full pe-2">
        <div className="bg-white w-48 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
          <p className="font-bold">92</p>
          <div className="flex items-center gap-3">
            <img src="/Icons/icons8-objet-avec-durée-50.png" alt="Edt" className='w-5' />
            <p>Edt créer</p>
          </div>
        </div>

        <div className="bg-white w-48 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
          <p className="font-bold">25</p>
          <div className="flex items-center gap-3">
            <img src="/Icons/icons8-prof-60.png" alt="Professeur" className='w-5' />
            <p>Professeur</p>
          </div>
        </div>

        <div className="bg-white w-48 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
          <p className="font-bold">102</p>
          <div className="flex items-center gap-3">
            <img src="/Icons/cahier.png" alt="Matiere" className='w-5' />
            <p>Matière</p>
          </div>
        </div>

        <div className="bg-white w-48 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
          <p className="font-bold">8</p>
          <div className="flex items-center gap-3">
            <img src="/Icons/icons8-école-48.png" alt="Classe" className='w-5' />
            <p>Classe</p>
          </div>
        </div>

        <div className="bg-white w-48 flex flex-col justify-start p-3 rounded gap-3 cursor-pointer transition-all duration-500 hover:scale-105">
          <p className="font-bold">2</p>
          <div className="flex items-center gap-3">
            <img src="/Icons/mention.png" alt="Mention" className='w-5' />
            <p>Parcours</p>
          </div>
        </div>


      </div>
      {/* end Card stats */}

      <div className="flex justify-between w-full pe-2 flex-wrap">
        <div className="w-[68%] p-4 h-60 bg-white h-100 rounded flex flex-col gap-2">
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
        </div>
      </div>

      <div className="flex w-full bg-white h-48 p-4">
        <table className="table-auto w-full rounded-xl border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white text-sm">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Classe</th>
              <th className="px-4 py-2 border">Date de début</th>
              <th className="px-4 py-2 border">Date de fin</th>
              <th className="px-4 py-2 border">Utilisateur</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[...Array(2)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-100 border-t">
                <td className="px-4 py-2 border text-center">{index + 1}</td>
                <td className="px-4 py-2 border text-center">Avotra</td>
                <td className="px-4 py-2 border text-center">DR</td>
                <td className="px-4 py-2 border text-center">M</td>
                <td className="px-4 py-2 border text-center">0340721283</td>

                <td className="px-4 py-2 border text-center">
                  <button className="p-1 rounded hover:bg-gray-200">
                    <img src="/Icons/afficher.png" alt="actions" className="w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default Dashboard;
