import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../Context/SidebarContext";

function ParametreSecurite() {
  const navigate = useNavigate();
  const { isReduire } = useSidebar();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    confirmation: "",
    role: "",
    statut: "Actif",
    image: null,
  });
  const [preview, setPreview] = useState(null);

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
      setPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, tu peux envoyer form vers ton API
    alert("Compte ajouté !");
  };

  return (
    <>
      <div
        className={`${
          isReduire ? "left-20" : "left-56"
        } fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}
      >
        <div className="flex flex-row gap-3 mb-5">
          <button
            className=" hover:scale-105 text-gray-500 "
            onClick={versInfo}
          >
            Géneral
          </button>
          <button
            className=" hover:scale-105 text-gray-500"
            onClick={versProfile}
          >
            Profile
          </button>
          <button
            className="font-bold hover:scale-105  text-bleu"
            onClick={versSecurite}
          >
            Parametrage de compte
          </button>
        </div>
        {/* Formulaire d'ajout de compte */}
        <div className="flex justify-center">
          <form
            className="flex flex-col gap-4 w-full max-w-lg bg-white p-6 rounded shadow"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <h2 className="text-xl font-bold mb-2">
              Ajouter un compte utilisateur
            </h2>
            <div className="flex flex-col gap-1">
              <label className="font-semibold">Nom *</label>
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                required
                className="border p-2 rounded"
                placeholder="Nom"
              />
            </div>
            {/* <div className="flex flex-col gap-1">
              <label className="font-semibold">Prénom *</label>
              <input
                type="text"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                required
                className="border p-2 rounded"
                placeholder="Prénom"
              />
            </div> */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="border p-2 rounded"
                placeholder="Email"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-semibold">Mot de passe *</label>
              <input
                type="password"
                name="motDePasse"
                value={form.motDePasse}
                onChange={handleChange}
                required
                className="border p-2 rounded"
                placeholder="Mot de passe"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-semibold">
                Confirmation du mot de passe *
              </label>
              <input
                type="password"
                name="confirmation"
                value={form.confirmation}
                onChange={handleChange}
                required
                className="border p-2 rounded"
                placeholder="Confirmez le mot de passe"
              />
            </div>
            {/* <div className="flex flex-col gap-1">
              <label className="font-semibold">Rôle *</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              >
                <option value="">Sélectionnez un rôle</option>
                <option value="Admin">Admin</option>
                <option value="Utilisateur">Utilisateur</option>
                <option value="Professeur">Professeur</option>
              </select>
            </div> */}
            {/* <div className="flex flex-col gap-1">
              <label className="font-semibold">Statut *</label>
              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              >
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div> */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold">Photo de profil</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="border p-2 rounded"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Aperçu"
                  className="mt-2 w-24 h-24 object-cover rounded"
                />
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600"
            >
              Ajouter le compte
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ParametreSecurite;
