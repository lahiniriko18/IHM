import React from 'react'

function Navbar() {
  return (
    <nav className='container bg-white w-52 h-screen fixed top-0 left-0 p-2 flex flex-col gap-3'>
      <div className="flex flex-row justify-between">
        <h1 className='text-bleu font-bold'>LOGO</h1>
        <a href="">I</a>
      </div>

      <div className="flex flex-row justify-start items-center bg-gray-50 h-10 p-2 rounded-sm cursor-pointer text-bleu font-semibold">
        <img src='/Icons/icons8-tableau-de-bord-24.png' alt='dashboard icon' className='me-1' />
        <p>Dashboard</p>
      </div>

      <div className="flex flex-row justify-start items-center  h-10 p-2 rounded-sm cursor-pointer">
        <img src='/Icons/icons8-prof-60.png' alt='Prof icon' className='me-1 w-6' />
        <p>Professeur</p>
      </div>

      <div className="flex flex-row justify-start items-center  h-10 p-2 rounded-sm cursor-pointer">
        <img src='/Icons/icons8-chambre-50.png' alt='Salle icon' className='me-1 w-6' />
        <p>Salle</p>
      </div>

      <div className="flex flex-row justify-start items-center  h-10 p-2 rounded-sm cursor-pointer">
        <img src='/Icons/cahier.png' alt='Matière icon' className='me-1 w-6' />
        <p>Matières</p>
      </div>

      <div className=" rounded-sm cursor-pointer flex justify-between items-center">
        <div className='flex flex-row justify-start items-center  h-10 p-2'>
          <img src='/Icons/icons8-école-48.png' alt='Classe icon' className='me-1 w-6' />
          <p>Classe</p>
        </div>
      </div>
      <div className="flex flex-row justify-start items-center  h-10 p-2 rounded-sm cursor-pointer">
        <img src='/Icons/mention.png' alt='Mention icon' className='me-1 w-6' />
        <p>Mention</p>
      </div>

      <div className="flex flex-row justify-start items-center  h-10 p-2 rounded-sm cursor-pointer">
        <img src='/Icons/icons8-partage-de-connaissances-50.png' alt='Parcours icon' className='me-1 w-6' />
        <p>Parcours</p>
      </div>

      <div className="flex flex-row justify-start items-center  h-10 p-2 rounded-sm cursor-pointer">
        <img src='/Icons/icons8-objet-avec-durée-50.png' alt='EDT icon' className='me-1 w-6' />
        <p>Emploi du temps</p>
      </div>

      <div className="flex flex-row justify-start items-center  h-10 p-2 rounded-sm cursor-pointer">
        <img src='/Icons/evaluation.png' alt='Setting icon' className='me-1 w-6' />
        <p>Rapport</p>
      </div>

      <div className="flex flex-row justify-start items-center  h-10 p-2 rounded-sm cursor-pointer">
        <img src='/Icons/icons8-paramètres-60.png' alt='Setting icon' className='me-1 w-6' />
        <p>Paramètre</p>
      </div>

      <div className="flex flex-row justify-start items-center  h-10 p-2 rounded-sm cursor-pointer">
        <img src='/Icons/utilisateur.png' alt='User icon' className='me-1 w-6' />
        <p>Utilisateurs</p>
      </div>

    </nav>
  )
}

export default Navbar