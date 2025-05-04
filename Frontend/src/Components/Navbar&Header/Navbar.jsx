import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Headerbar from './Headerbar';
import { useSidebar } from '../Context/SidebarContext';

function Navbar() {
  const { isReduire, setIsReduire } = useSidebar();
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  const baseClasses = "flex flex-row justify-start items-center h-10 p-2 rounded-sm transition-all duration-200 hover:scale-105 hover:bg-gray-200 cursor-pointer";
  const activeClasses = "bg-gray-200 text-bleu font-semibold";

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: "icons8-tableau-de-bord-24.png" },
    { to: "/professeur", label: "Professeur", icon: "icons8-prof-60.png" },
    { to: "/salle", label: "Salle", icon: "icons8-chambre-50.png" },
    { to: "/matiere", label: "Matières", icon: "cahier.png" },
    { to: "/classe", label: "Classe", icon: "icons8-école-48.png" },
    { to: "/mention", label: "Mention", icon: "mention.png" },
    { to: "/parcours", label: "Parcours", icon: "icons8-partage-de-connaissances-50.png" },
    { to: "/edt", label: "Emploi du temps", icon: "icons8-objet-avec-durée-50.png" },
    { to: "/rapport", label: "Rapport", icon: "evaluation.png" },
    { to: "/parametre", label: "Paramètre", icon: "icons8-paramètres-60.png" },
    { to: "/utilisateur", label: "Utilisateurs", icon: "utilisateur.png" },
  ];

  return (
    <>
      <nav className={`${isReduire ? "z-[51] container bg-white w-16 h-screen fixed top-0 left-0 p-2 flex flex-col gap-3 transition-all duration-700" : "container bg-white z-[51] w-52 h-screen fixed top-0 left-0 p-2 flex flex-col gap-3 transition-all duration-700"}`}>
        {/* Logo + bouton réduire */}
        <div className="flex flex-row justify-between items-center ">
          <h1 className='text-bleu font-bold text-xl'>ENI</h1>
          <img
            src='/Icons/vers-le-bas.png'
            alt='Réduire'
            className={`${isReduire ? "w-3 cursor-pointer rotate-[270deg]" : "me-1 w-4 cursor-pointer rotate-90"} transition-all duration-700`}
            onClick={() => setIsReduire(!isReduire)}
          />
        </div>

        {/* Liens dynamiques */}
        {navLinks.map(({ to, label, icon }) => (
          <Link to={to} key={to}>
            <div className={`${baseClasses} ${isActive(to) ? activeClasses : ""}`}>
              <img src={`/Icons/${icon}`} alt={`${label} icon`} className='me-1 w-6' />
              <p className={`${isReduire ? "opacity-0 pointer-events-none" : "opacity-1"} transition-all duration-700`}>
                {label}
              </p>
            </div>
          </Link>
        ))}
      </nav>
      <Headerbar />
    </>
  );
}

export default Navbar;
