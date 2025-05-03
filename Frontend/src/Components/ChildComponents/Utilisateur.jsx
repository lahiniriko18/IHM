import React, { useState } from 'react';
import { useSidebar } from '../Context/SidebarContext';

function Utilisateur() {
  const { isReduire } = useSidebar();
  const [isclicked, setIsclicked] = useState(false);
  const [isadd, setisadd] = useState(true);
  const [islog, setislog] = useState(false);
  const [search, setSearch] = useState("");
  const initialForm = {
    id: '',
    nom: '',
    email: '',
    password: '',
    newPassword: '',
  };
  const [formData, setFormData] = useState(initialForm);


  const [utilisateurs, setUtilisateurs] = useState([
    { id: 'S001', nom: 'Avotra', email: 'avotra@mail.com', status: 'connecté' },
    { id: 'S002', nom: 'Jean', email: 'jean@mail.com', status: 'déconnecté' },
    { id: 'S003', nom: 'Lina', email: 'lina@mail.com', status: 'en attente' },
    { id: 'S004', nom: 'Paul', email: 'paul@mail.com', status: 'déconnecté' },
    { id: 'S005', nom: 'Marie', email: 'marie@mail.com', status: 'déconnecté' },
    { id: 'S006', nom: 'Tina', email: 'tina@mail.com', status: 'déconnecté' },
    { id: 'S007', nom: 'Lucas', email: 'lucas@mail.com', status: 'en attente' },
    { id: 'S008', nom: 'Sarah', email: 'sarah@mail.com', status: 'déconnecté' },
    { id: 'S009', nom: 'David', email: 'david@mail.com', status: 'déconnecté' },
  ]);

  const parPage = 6;
  const [pageActuel, setPageActuel] = useState(1);
  const totalPages = Math.ceil(utilisateurs.length / parPage);
  const currentData = utilisateurs.slice((pageActuel - 1) * parPage, pageActuel * parPage);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (pageActuel <= 3) {
      pages.push(1, 2, 3, '...', totalPages);
    } else if (pageActuel >= totalPages - 2) {
      pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', pageActuel, '...', totalPages);
    }
    return pages;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isadd) {
      setUtilisateurs(prev => [...prev, { ...formData, status: 'connecté' }]);
    } else {
      setUtilisateurs(prev =>
        prev.map(user => user.id === formData.id ? { ...user, ...formData } : user)
      );
    }
    setIsclicked(false);
    setFormData({ id: '', nom: '', email: '', password: '' });
  };

  return (
    <>
      {isclicked && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center">
          {
            islog ? (<div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] p-6 rounded-lg space-y-4 shadow-lg max-h-[90%] overflow-y-auto">
              <div className="flex justify-between">
                <h1 className="text-xl font-bold text-blue-600">
                  Connexion
                </h1>
                <button onClick={() => {
                  setIsclicked(false);
                  setislog(false)
                  setFormData({ id: '', nom: '', email: '', password: '' });
                }}>
                  <img src="/Icons/annuler.png" alt="Close" className="w-6 h-6" />
                </button>
              </div>

              {['email', 'password'].map(field => (
                <div key={field} className="flex flex-col">
                  <label className="text-sm font-medium mb-1 capitalize">{field}</label>
                  <input
                    type={field === 'password' ? 'password' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}
              <p className="text-right font-bold text-bleu cursor-pointer text-sm underline">Mot de passe oublié</p>
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                >
                  Se connecter
                </button>
              </div>
            </div>) : (<div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] p-6 rounded-lg space-y-4 shadow-lg max-h-[90%] overflow-y-auto">
              <div className="flex justify-between">
                <h1 className="text-xl font-bold text-blue-600">
                  {isadd ? "Nouvel Utilisateur" : "Modifier Utilisateur"}
                </h1>
                <button onClick={() => {
                  setIsclicked(false);
                  setFormData({ id: '', nom: '', email: '', password: '' });
                }}>
                  <img src="/Icons/annuler.png" alt="Close" className="w-6 h-6" />
                </button>
              </div>

              {['nom', 'email', 'password'].map(field => (
                <div key={field} className="flex flex-col">
                  <label className="text-sm font-medium mb-1 capitalize">{field}</label>
                  <input
                    type={field === 'password' ? 'password' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}

              {!isadd && (
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              )}


              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                >
                  {isadd ? "AJOUTER" : "MODIFIER"}
                </button>
              </div>
            </div>)

          }
        </div>
      )}


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
        <div className="flex justify-between mb-4">
          <h1 className="font-bold">Liste des Utilisateurs</h1>
          <button
            onClick={() => { setisadd(true); setIsclicked(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:scale-105 transition"
          >
            <img src="/Icons/plus-claire.png" alt="Ajouter" className="w-5 h-5" />
            Nouveau
          </button>
        </div>

        <div className="overflow-hidden border rounded-t-lg">
          <table className="w-full text-sm table-auto border-collapse">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 border-b">
                  <td className="px-4 py-2 text-center">{(pageActuel - 1) * parPage + index + 1}</td>
                  <td className="px-4 py-2 text-center">{user.nom}</td>
                  <td className="px-4 py-2 text-center">{user.email}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-semibold
                           ${user.status === "connecté" ? "bg-green-600" :
                          user.status === "déconnecté" ? "bg-red-500" :
                            "bg-yellow-500"}
                    `}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-4 py-2 flex justify-center items-center gap-2">
                    {
                      (user.status == "connecté") ? (<>
                        <button
                          onClick={() => {
                            setisadd(false); setFormData(user); setIsclicked(true);
                          }}
                          className="hover:bg-gray-200 p-1 rounded"
                        >
                          <img src="/Icons/modifier.png" className="w-5" alt="Modifier" />
                        </button>
                        <button
                          onClick={() => setUtilisateurs(prev => prev.filter(u => u.id !== user.id))}
                          className="hover:bg-gray-200 p-1 rounded"
                        >
                          <img src="/Icons/supprimer.png" className="w-5" alt="Supprimer" />
                        </button></>) : <> <button className="bg-blue-400 text-white font-bold rounded p-2 hover:scale-105" onClick={() => { setislog(true); setIsclicked(true) }}>Se connecter</button></>
                    }

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center gap-2 py-4">
          <button
            onClick={() => setPageActuel(p => Math.max(1, p - 1))}
            disabled={pageActuel === 1}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
          >
            <img src="/Icons/vers-le-bas.png" className="w-5 rotate-90" />
          </button>
          {getPageNumbers().map((page, i) => (
            <button
              key={i}
              onClick={() => typeof page === 'number' && setPageActuel(page)}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${pageActuel === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setPageActuel(p => Math.min(totalPages, p + 1))}
            disabled={pageActuel === totalPages}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
          >
            <img src="/Icons/vers-le-bas.png" className="w-5 rotate-[270deg]" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Utilisateur;
