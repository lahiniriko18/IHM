import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../Context/SidebarContext";
function ParametreProfile() {
  const navigate = useNavigate();
  const { isReduire } = useSidebar();
  const [color, setColor] = useState("#fff");
  const versGeneral = () => {
    navigate("/parametre");
  };
  const versInfo = () => {
    navigate("/parametre/info-etablisement");
  };
  const versSecurite = () => {
    navigate("/parametre/securite");
  };
  const versProfile = () => {
    navigate("/parametre/profile");
  };
  return (
    <>
      <div
        className={`${
          isReduire ? "left-20" : "left-56"
        } fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}
      >
        <div className="flex flex-row gap-3 mb-5">
          {/* <button className=' hover:scale-105 text-gray-500' onClick={versGeneral}>Géneral</button> */}
          <button
            className=" hover:scale-105 text-gray-500 "
            onClick={versInfo}
          >
            Géneral
          </button>
          <button
            className="font-bold hover:scale-105  text-bleu"
            onClick={versProfile}
          >
            Profile
          </button>
          <button
            className=" hover:scale-105 text-gray-500"
            onClick={versSecurite}
          >
            Parametrage de compte
          </button>
        </div>
        <div className="flex w-full justify-between items-center mb-5">
          <h1>Informations des utilisateurs</h1>
          <button className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200">
            Nouveau Compte
          </button>
        </div>
        <div className="w-full border rounded-t-lg overflow-hidden mb-8">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-blue-500 text-white text-sm">
                <th className="px-4 py-4">#</th>
                <th className="px-4 py-4">Nom</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Rôle</th>
                <th className="px-4 py-4">Statut</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                {
                  id: 1,
                  nom: "Avotra",
                  email: "avotra@example.com",
                  role: "Admin",
                  statut: "Actif",
                },
                {
                  id: 2,
                  nom: "Jean",
                  email: "jean@example.com",
                  role: "Utilisateur",
                  statut: "Inactif",
                },
              ].map((user) => (
                <tr
                  key={user.id}
                  className="border-b transition-all duration-300 hover:bg-gray-100"
                >
                  <td className="px-4 py-2 text-center">{user.id}</td>
                  <td className="px-4 py-2 text-center">{user.nom}</td>
                  <td className="px-4 py-2 text-center">{user.email}</td>
                  <td className="px-4 py-2 text-center">{user.role}</td>
                  <td className="px-4 py-2 text-center">{user.statut}</td>
                  <td className="px-4 py-2 flex justify-center items-center gap-2">
                    <button className="p-1 rounded hover:bg-gray-200">
                      <img
                        src="/Icons/modifier.png"
                        alt="Modifier"
                        className="w-5"
                      />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-200">
                      <img
                        src="/Icons/supprimer.png"
                        alt="Supprimer"
                        className="w-5"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ParametreProfile;
