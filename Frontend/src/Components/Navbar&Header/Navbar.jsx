import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Headerbar from './Headerbar';

function Navbar() {
  const [lienActif, setLienActif] = useState("Dashboard")
  const [isReduire, setIsReduire] = useState(false)
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path) => pathname === path;

  const baseClasses = "flex flex-row justify-start items-center h-10 p-2 rounded-sm transition-all duration-200 hover:scale-105 hover:bg-gray-200 cursor-pointer";
  const activeClasses = "bg-gray-200 text-bleu font-semibold";

  return (
    <>
      <nav className={`${isReduire ? "container bg-white w-16 h-screen fixed top-0 left-0 p-2 flex flex-col gap-3 transition-all duration-700" : "container bg-white w-52 h-screen fixed top-0 left-0 p-2 flex flex-col gap-3  transition-all duration-700"}`}>

        {/* Logo */}
        <div className="flex flex-row justify-between items-center my-2">
          <h1 className='text-bleu font-bold text-xl'>ENI</h1>
          <img src='/Icons/vers-le-bas.png' alt='Reduire icon' className={`${isReduire ? "w-3 cursor-pointer rotate-[270deg]" : "me-1 w-4 cursor-pointer rotate-90"}`} onClick={() => setIsReduire(!isReduire)} />
        </div>

        {/* Menu links */}
        <Link to="/dashboard">
          <div className={`${baseClasses} ${isActive("/dashboard") ? activeClasses : ""}`} onClick={() => setLienActif("Dashboard")}>
            <img src='/Icons/icons8-tableau-de-bord-24.png' alt='dashboard icon' className='me-1' />
            <p className={`${isReduire ? "opacity-0 pointer-events-none transition-all duration-700" : "opacity-1  transition-all duration-700"}`}>Dashboard</p>
          </div>
        </Link>

        <Link to="/professeur">
          <div className={`${baseClasses} ${isActive("/professeur") ? activeClasses : ""}`} onClick={() => setLienActif("Professeur")}>
            <img src='/Icons/icons8-prof-60.png' alt='Prof icon' className='me-1 w-6' />
            <p className={`${isReduire ? "opacity-0 pointer-events-none transition-all duration-700" : "opacity-1  transition-all duration-700"}`}>Professeur</p>
          </div>
        </Link>

        <Link to="/salle">
          <div className={`${baseClasses} ${isActive("/salle") ? activeClasses : ""}`} onClick={() => setLienActif("Salle")}>
            <img src='/Icons/icons8-chambre-50.png' alt='Salle icon' className='me-1 w-6' />
            <p className={`${isReduire ? "opacity-0 pointer-events-none transition-all duration-700" : "opacity-1  transition-all duration-700"}`}>Salle</p>
          </div>
        </Link>

        <Link to="/matiere">
          <div className={`${baseClasses} ${isActive("/matiere") ? activeClasses : ""}`} onClick={() => setLienActif("Matières")}>
            <img src='/Icons/cahier.png' alt='Matière icon' className='me-1 w-6' />
            <p className={`${isReduire ? "opacity-0 pointer-events-none transition-all duration-700" : "opacity-1  transition-all duration-700"}`}>Matières</p>
          </div>
        </Link>

        <Link to="/classe">
          <div className={`${baseClasses} ${isActive("/classe") ? activeClasses : ""}`} onClick={() => setLienActif("Classe")}>
            <img src='/Icons/icons8-école-48.png' alt='Classe icon' className='me-1 w-6' />
            <p className={`${isReduire ? "opacity-0 pointer-events-none transition-all duration-700" : "opacity-1  transition-all duration-700"}`}>Classe</p>
          </div>
        </Link>

        <Link to="/mention">
          <div className={`${baseClasses} ${isActive("/mention") ? activeClasses : ""}`} onClick={() => setLienActif("Mention")}>
            <img src='/Icons/mention.png' alt='Mention icon' className='me-1 w-6' />
            <p className={`${isReduire ? "opacity-0 pointer-events-none transition-all duration-700" : "opacity-1  transition-all duration-700"}`}>Mention</p>
          </div>
        </Link>

        <Link to="/parcours">
          <div className={`${baseClasses} ${isActive("/parcours") ? activeClasses : ""}`} onClick={() => setLienActif("Parcours")}>
            <img src='/Icons/icons8-partage-de-connaissances-50.png' alt='Parcours icon' className='me-1 w-6' />
            <p className={`${isReduire ? "opacity-0 pointer-events-none transition-all duration-700" : "opacity-1  transition-all duration-700"}`}>Parcours</p>
          </div>
        </Link>

        <Link to="/edt">
          <div className={`${baseClasses} ${isActive("/edt") ? activeClasses : ""}`} onClick={() => setLienActif("Emploi du temps")}>
            <img src='/Icons/icons8-objet-avec-durée-50.png' alt='EDT icon' className='me-1 w-6' />
            <p className={`${isReduire ? "opacity-0 pointer-events-none transition-all duration-700" : "opacity-1  transition-all duration-700"}`}>Emploi du temps</p>
          </div>
        </Link>

        <Link to="/rapport">
          <div className={`${baseClasses} ${isActive("/rapport") ? activeClasses : ""}`} onClick={() => setLienActif("Rapport")}>
            <img src='/Icons/evaluation.png' alt='Rapport icon' className='me-1 w-6' />
            <p className={`${isReduire ? "opacity-0 pointer-events-none transition-all duration-700" : "opacity-1  transition-all duration-700"}`}>Rapport</p>
          </div>
        </Link>

        <Link to="/parametre">
          <div className={`${baseClasses} ${isActive("/parametre") ? activeClasses : ""}`} onClick={() => setLienActif("Paramètre")}>
            <img src='/Icons/icons8-paramètres-60.png' alt='Paramètre icon' className='me-1 w-6' />
            <p className={`${isReduire ? "opacity-0 pointer-events-none transition-all duration-700" : "opacity-1  transition-all duration-700"}`}>Paramètre</p>
          </div>
        </Link>

        <Link to="/utilisateur">
          <div className={`${baseClasses} ${isActive("/utilisateur") ? activeClasses : ""}`} onClick={() => setLienActif("Utilisateurs")}>
            <img src='/Icons/utilisateur.png' alt='Utilisateur icon' className='me-1 w-6' />
            <p className={`${isReduire ? "opacity-0 pointer-events-none transition-all duration-700" : "opacity-1  transition-all duration-700"}`}>Utilisateurs</p>
          </div>
        </Link>
      </nav>
      <Headerbar lien={lienActif} status={isReduire} />
    </>
  );
}

export default Navbar;
