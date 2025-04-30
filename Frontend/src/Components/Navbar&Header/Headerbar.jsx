import React, { useState, useRef, useEffect } from 'react';

function Headerbar({ lien, status }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`${status ? "fixed top-0 right-0 left-16 h-14 flex justify-between items-center ps-5 pe-4 z-50  transition-all duration-700" : "fixed top-0 right-0 left-52 h-14 flex justify-between items-center ps-5 pe-4 z-50  transition-all duration-700"}`}>
      <h1 className="text-blue-600 font-extrabold text-2xl">{lien}</h1>

      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-10 h-10 bg-blue-600 text-white font-bold flex items-center justify-center rounded-full">
            Av
          </div>
          <img src="/Icons/vers-le-bas.png" className="w-4" alt="flèche bas" />
        </div>


        <div
          className={`absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50 transition-all duration-200 transform ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
        >
          <ul className="text-sm text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profil</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Paramètres</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Déconnexion</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Headerbar;
