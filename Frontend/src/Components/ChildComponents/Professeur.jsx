import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Creatable from "react-select/creatable";
import { toast } from "react-toastify";
import { useSidebar } from "../Context/SidebarContext";
function Professeur() {
  const { isReduire } = useSidebar();
  const navigate = useNavigate();

  // ---------- State ----------
  const [numEtablissement, setNumEtablissement] = useState();
  const [search, setSearch] = useState("");
  const [listeProfesseur, setlisteProfesseur] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [listeMatiere, setListeMatiere] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [id, setId] = useState();
  const [isclicked, setIsclicked] = useState(false);
  const [isadd, setisadd] = useState(true);

  // Upload/preview image
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("Aucun fichier choisi");
  const [isphotosDeleted, setIsphotosDeleted] = useState(false);

  // Delete modal / selection
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeleteByCheckBox, setDeleteByChekbox] = useState(true);
  const [checkedRows, setCheckedRows] = useState([]);

  // Pagination
  const nombreElemParPage = 8;
  const [pageActuel, setPageActuel] = useState(1);

  // Erreurs formulaire
  const [error, setError] = useState({
    status: false,
    composant: "",
    message: "",
  });

  // Données formulaire
  const [dataProfesseur, setdataProfesseur] = useState({
    nomProfesseur: "",
    prenomProfesseur: "",
    nomCourant: "",
    grade: "",
    sexe: "",
    photos: null,
    contact: "",
    adresse: "",
    email: "",
    numEtablissement: null,
    matieres: [],
  });

  const allChecked =
    checkedRows.length === listeProfesseur.length && listeProfesseur.length > 0;

  // ---------- Helpers ----------
  const renameFile = (file) => {
    const extension = file.name.split(".").pop();
    const newFileName = `image_${Date.now()}.${extension}`;
    return new File([file], newFileName, { type: file.type });
  };

  const buildFormData = (payload, file, deleted) => {
    const formData = new FormData();

    // Champs simples
    Object.entries(payload).forEach(([key, value]) => {
      if (key !== "matieres" && key !== "photos") {
        formData.append(key, value ?? "");
      }
    });

    // Matieres[]
    if (Array.isArray(payload.matieres)) {
      payload.matieres.forEach((val) => {
        formData.append("matieres[]", val);
      });
    }

    // Image selon les 3 cas
    if (file) {
      console.log("oui");
      const renamedFile = renameFile(file);
      formData.append("photos", renamedFile); // Cas 1: nouvelle image
    } else if (deleted) {
      formData.append("photos", ""); // Cas 2: image supprimée → null
    }
    // Cas 3: pas de changement → NE RIEN ENVOYER pour `photos`
    return formData;
  };

  // ---------- API ----------
  const getDataMatiere = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/matiere/");
      if (res.status !== 200) throw new Error("Erreur code : " + res.status);
      setListeMatiere(res.data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getDataOneProf = async (pid) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/professeur/detail/${pid}`
      );
      if (res.status !== 200) throw new Error("Erreur code : " + res.status);
      return res.data;
    } catch (e) {
      toast.error(e.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getNumEtablissement = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/etablissement/");
      if (res.status !== 200) throw new Error("Erreur code : " + res.status);
      if (res.data.length > 0) {
        setNumEtablissement(parseInt(res.data[0].numEtablissement));
      } else {
        setError({
          status: true,
          composant: "Etablissement",
          message: "Aucun établissement trouvé !",
        });
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/professeur/");
      if (res.status !== 200) throw new Error("Erreur code : " + res.status);
      setlisteProfesseur(res.data);
      setOriginalList(res.data);
    } catch (e) {
      if (e.response) {
        toast.error("Erreur du serveur :", e.response.data);
      } else {
        toast.error("Erreur inconnue :", e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendData = async (payload) => {
    try {
      const formData = buildFormData(payload, selectedFile, isphotosDeleted);
      const res = await axios.post(
        "http://127.0.0.1:8000/api/professeur/ajouter/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.status !== 201) throw new Error("Erreur " + res.status);
      await getData();
      toast.success("Professeur enregistré !");
    } catch (e) {
      toast.error("Erreur:", e.response?.data || e.message);
    }
  };

  const putData = async (payload) => {
    try {
      const formData = buildFormData(payload, selectedFile, isphotosDeleted);
      const res = await axios.put(
        `http://127.0.0.1:8000/api/professeur/modifier/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.status !== 200) throw new Error("Erreur code : " + res.status);
      toast.success("✅ Professeur modifié !");
      await getData();
    } catch (e) {
      if (e.response) {
        toast.error(
          `❌ Erreur serveur : ${e.response.data.message || "Bad request"}`
        );
      } else {
        toast.error("⚠️ Erreur inconnue : " + e.message);
      }
    }
  };

  const removeProfesseur = async (pid) => {
    try {
      const res = await axios.delete(
        `http://127.0.0.1:8000/api/professeur/supprimer/${parseInt(pid)}`
      );
      if (res.status !== 200 && res.status !== 204) {
        throw new Error(`Erreur lors de la suppression : Code ${res.status}`);
      }
      toast.success(`Professeur ${pid} supprimé avec succès`);
      await getData();
    } catch (e) {
      toast.error("Erreur:", e.message);
    }
  };

  const removeProfesseurByCkeckBox = async () => {
    const formData = new FormData();
    if (Array.isArray(checkedRows)) {
      checkedRows.forEach((val) =>
        formData.append("numProfesseurs[]", parseInt(val))
      );
    }
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/professeur/supprimer/liste/",
        formData
      );
      if (res.status !== 200 && res.status !== 204) {
        throw new Error(`Erreur lors de la suppression : Code ${res.status}`);
      }
      toast.success(`Professeurs supprimés avec succès`);
      await getData();
      setCheckedRows([]); // reset
    } catch (e) {
      toast.error("Erreur:", e.response?.data?.status || e.message);
    }
  };

  // ---------- Effects ----------
  useEffect(() => {
    getData();
    getNumEtablissement();
    getDataMatiere();
  }, []);

  useEffect(() => {
    if (numEtablissement) {
      setdataProfesseur((prev) => ({
        ...prev,
        numEtablissement: parseInt(numEtablissement),
      }));
    }
  }, [numEtablissement]);

  // ---------- Options Select ----------
  const optionsMatiere = listeMatiere
    .slice()
    .sort((a, b) => a.nomMatiere.localeCompare(b.nomMatiere))
    .map((Matiere) => ({
      value: Matiere.numMatiere,
      label: Matiere.nomMatiere
        ? Matiere.nomMatiere
        : Matiere.codeMatiere
        ? `(${Matiere.codeMatiere})`
        : "",
    }));

  // ---------- Validation ----------
  const validateForm = () => {
    let isValid = true;

    const contactRegex =
      /^(\+261\s?(32|33|34|37|38)\s?\d{2}\s?\d{3}\s?\d{2}|(032|033|034|037|038)\s?\d{2}\s?\d{3}\s?\d{2})$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (dataProfesseur.nomProfesseur.trim() === "") {
      setError({
        composant: "nomProfesseur",
        status: true,
        message: "Nom ne peut pas être vide !",
      });
      isValid = false;
    } else if (dataProfesseur.adresse.trim() === "") {
      setError({
        composant: "adresse",
        status: true,
        message: "L'adresse ne peut pas être vide !",
      });
      isValid = false;
    } else if (!contactRegex.test(dataProfesseur.contact.trim())) {
      setError({
        composant: "contact",
        status: true,
        message: "Le contact doit respecter le format requis !",
      });
      isValid = false;
    } else if (!emailRegex.test(dataProfesseur.email.trim())) {
      setError({
        composant: "email",
        status: true,
        message: "L'email doit être valide !",
      });
      isValid = false;
    } else {
      setError({ status: false, composant: "", message: "" });
    }

    return isValid;
  };

  // ---------- Handlers ----------
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() !== "") {
      const v = value.toLowerCase();
      const filtered = originalList.filter(
        (p) =>
          (p.nomProfesseur || "").toLowerCase().includes(v) ||
          (p.prenomProfesseur || "").toLowerCase().includes(v) ||
          (p.adresse || "").toLowerCase().includes(v) ||
          (p.contact || "").toLowerCase().includes(v) ||
          (p.email || "").toLowerCase().includes(v) ||
          (p.numProfesseur || "").toString().includes(value)
      );
      setlisteProfesseur(filtered);
      setPageActuel(1);
    } else {
      setlisteProfesseur(originalList);
    }
  };

  const versDetails = (pid) => navigate(`/professeur/detail/${pid}`);

  const handleCheck = (pid) => {
    setCheckedRows((prev) =>
      prev.includes(pid) ? prev.filter((i) => i !== pid) : [...prev, pid]
    );
  };

  const handleCheckAll = () => {
    if (allChecked) {
      setCheckedRows([]);
    } else {
      setCheckedRows(listeProfesseur.map((item) => item.numProfesseur));
    }
  };

  const handleDeletephotos = () => {
    setSelectedFile(null);
    setPreview(null);
    setIsphotosDeleted(true);
    setFileName("Aucun fichier choisi");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
      setIsphotosDeleted(false);
      setFileName(file.name);
    }
  };

  const editProfesseur = async (numProfesseur) => {
    const p = await getDataOneProf(numProfesseur);
    if (!p) return;

    setId(p.numProfesseur);
    setPreview(p.photos ? `${p.photos}` : null);
    setSelectedFile(null);
    setFileName("Aucun fichier choisi");
    setIsphotosDeleted(false);

    setisadd(false);
    setIsclicked(true);

    setdataProfesseur({
      nomProfesseur: p.nomProfesseur || "",
      prenomProfesseur: p.prenomProfesseur || "",
      nomCourant: p.nomCourant || "",
      grade: p.grade || "",
      sexe: p.sexe || "",
      photos: p.photos || "",
      contact: p.contact || "",
      adresse: p.adresse || "",
      email: p.email || "",
      numEtablissement: p.numEtablissement || null,
      matieres: Array.isArray(p.matieres)
        ? p.matieres.map((m) =>
            typeof m === "object" && m !== null
              ? m.numMatiere || m.value || ""
              : m
          )
        : [],
    });
  };

  const confirmerSuppression = (pid) => {
    setId(pid);
    setIsConfirmModalOpen(true);
  };

  // ---------- Pagination ----------
  const totalPages = Math.ceil(listeProfesseur.length / nombreElemParPage);
  const currentData = listeProfesseur.slice(
    (pageActuel - 1) * nombreElemParPage,
    pageActuel * nombreElemParPage
  );

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (pageActuel <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (pageActuel >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", pageActuel, "...", totalPages);
      }
    }
    return pages;
  };

  // ---------- Render ----------
  return (
    <>
      {/* Modal add/edit */}
      {isclicked && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center">
          <div className="bg-white w-[100%] sm:w-[90%] md:w-[70%] lg:w-[60%] max-h-[95%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-blue-600 text-xl font-bold">
                {isadd
                  ? "Nouvelle Professeur"
                  : "Modification d'une Professeur"}
              </h1>
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsclicked(false);
                  setError({ ...error, status: false });
                  setdataProfesseur({
                    nomProfesseur: "",
                    prenomProfesseur: "",
                    adresse: "",
                    contact: "",
                    email: "",
                    nomCourant: "",
                    photos: "",
                    grade: "",
                    sexe: "",
                    matieres: [],
                  });
                  setSelectedFile(null);
                  setPreview(null);
                  setIsphotosDeleted(false);
                  setFileName("Aucun fichier choisi");
                }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left: form */}
              <div className="flex flex-col gap-3">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <label className="font-semibold text-sm mb-1">
                      Nom professeur
                    </label>
                    <input
                      type="text"
                      value={dataProfesseur.nomProfesseur || ""}
                      onChange={(e) =>
                        setdataProfesseur({
                          ...dataProfesseur,
                          nomProfesseur: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {error.status && error.composant === "nomProfesseur" && (
                      <p className="text-red-600 text-sm">{error.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold text-sm mb-1">Prénom</label>
                    <input
                      type="text"
                      value={dataProfesseur.prenomProfesseur || ""}
                      onChange={(e) =>
                        setdataProfesseur({
                          ...dataProfesseur,
                          prenomProfesseur: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {error.status && error.composant === "prenomProfesseur" && (
                      <p className="text-red-600 text-sm">{error.message}</p>
                    )}
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <label className="font-semibold text-sm mb-1">Grade</label>
                    <input
                      type="text"
                      value={dataProfesseur.grade || ""}
                      onChange={(e) =>
                        setdataProfesseur({
                          ...dataProfesseur,
                          grade: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {error.status && error.composant === "grade" && (
                      <p className="text-red-600 text-sm">{error.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold text-sm mb-1">
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={dataProfesseur.adresse || ""}
                      onChange={(e) =>
                        setdataProfesseur({
                          ...dataProfesseur,
                          adresse: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {error.status && error.composant === "adresse" && (
                      <p className="text-red-600 text-sm">{error.message}</p>
                    )}
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <label className="font-semibold text-sm mb-1">
                      Nom courant
                    </label>
                    <input
                      type="text"
                      value={dataProfesseur.nomCourant || ""}
                      onChange={(e) =>
                        setdataProfesseur({
                          ...dataProfesseur,
                          nomCourant: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {error.status && error.composant === "nomCourant" && (
                      <p className="text-red-600 text-sm">{error.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold text-sm mb-1">Sexe</label>
                    <Creatable
                      isClearable
                      placeholder="Sexe"
                      options={[
                        { value: "Masculin", label: "Masculin" },
                        { value: "Féminin", label: "Féminin" },
                      ]}
                      value={
                        dataProfesseur.sexe
                          ? {
                              label: dataProfesseur.sexe,
                              value: dataProfesseur.sexe,
                            }
                          : null
                      }
                      onChange={(opt) =>
                        setdataProfesseur({
                          ...dataProfesseur,
                          sexe: opt ? opt.value : "",
                        })
                      }
                    />
                  </div>
                </div>

                {/* Row 4: Matières */}
                <div className="flex flex-col">
                  <label className="font-semibold text-sm mb-1">Matière</label>
                  <Creatable
                    isClearable
                    isMulti
                    isValidNewOption={() => false}
                    placeholder="Choisir la matière"
                    options={optionsMatiere}
                    onChange={(opts) => {
                      setdataProfesseur((prev) => ({
                        ...prev,
                        matieres: Array.isArray(opts)
                          ? opts.map((o) => o.value)
                          : [],
                      }));
                    }}
                    value={optionsMatiere.filter((o) =>
                      (dataProfesseur.matieres || []).includes(o.value)
                    )}
                    className="text-sm"
                  />
                </div>

                {/* Row 5 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <label className="font-semibold text-sm mb-1">Email</label>
                    <input
                      type="text"
                      value={dataProfesseur.email || ""}
                      onChange={(e) =>
                        setdataProfesseur({
                          ...dataProfesseur,
                          email: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {error.status && error.composant === "email" && (
                      <p className="text-red-600 text-sm">{error.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold text-sm mb-1">
                      Contact
                    </label>
                    <input
                      type="text"
                      value={dataProfesseur.contact || ""}
                      onChange={(e) =>
                        setdataProfesseur({
                          ...dataProfesseur,
                          contact: e.target.value,
                        })
                      }
                      className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {error.status && error.composant === "contact" && (
                      <p className="text-red-600 text-sm">{error.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: photo */}
              <div className="w-full lg:w-[90%] mx-auto flex justify-center items-center flex-col gap-3">
                <div className="w-40 h-40 rounded-full bg-gray-200 relative">
                  {preview && (
                    <img
                      src="/Icons/supprimer.png"
                      alt="Supprimer"
                      title="Supprimer la photo"
                      className="absolute top-0 left-36 w-7 cursor-pointer hover:scale-105 duration-200"
                      onClick={handleDeletephotos}
                    />
                  )}
                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-40 h-40 rounded-full object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-col justify-center w-full">
                  <label className="font-semibold text-sm mb-1">
                    Choisissez une photo :
                  </label>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm border px-4 py-2 w-full rounded text-gray-600">
                      {fileName}
                    </span>
                    <label
                      htmlFor="fichier"
                      className="cursor-pointer text-white px-3 py-2 rounded text-sm  transition"
                    >
                      <img src="/Icons/dossier.png" alt="Parcourir" />
                    </label>
                  </div>

                  <input
                    id="fichier"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <input
              type="hidden"
              name="id"
              value={id || ""}
              onChange={(e) => setId(e.target.value)}
            />

            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  if (!validateForm()) return;

                  const updatePayload = {
                    ...dataProfesseur,
                    numEtablissement: numEtablissement,
                  };

                  if (isadd) {
                    sendData(updatePayload);
                  } else {
                    putData(updatePayload);
                  }

                  // Reset contrôlé après action
                  setSelectedFile(null);
                  setPreview(null);
                  setIsphotosDeleted(false);
                  setFileName("Aucun fichier choisi");
                  setIsclicked(false);
                  setdataProfesseur({
                    nomProfesseur: "",
                    prenomProfesseur: "",
                    adresse: "",
                    contact: "",
                    email: "",
                    nomCourant: "",
                    photos: "",
                    grade: "",
                    sexe: "",
                    matieres: [],
                  });
                }}
              >
                {isadd ? "AJOUTER" : "MODIFIER"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center">
          <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[90%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-blue-600 text-xl font-bold">
                Suppression professeur
              </h1>
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setId("");
                }}
              />
            </div>

            <div className="flex flex-row gap-2">
              <img src="/Icons/attention.png" alt="Attention" />
              <p>
                Êtes-vous sûr de vouloir supprimer le(s) professeur(s)
                sélectionné(s) ?
              </p>
            </div>

            <input
              type="hidden"
              name="id"
              value={id || ""}
              onChange={(e) => setId(e.target.value)}
            />

            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  if (isDeleteByCheckBox) {
                    if (checkedRows.length !== 0) removeProfesseurByCkeckBox();
                  } else {
                    if (id) removeProfesseur(id);
                  }
                  setIsConfirmModalOpen(false);
                }}
              >
                VALIDER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LISTE + FILTRE (centrés, responsives) */}
      <div
        className={`${
          isReduire
            ? "fixed h-screen right-0 top-14 left-20"
            : "fixed h-screen right-0 top-14 left-56"
        } p-5 z-40 overflow-auto bg-white transition-all duration-700`}
      >
        {/* Wrapper centré */}
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-3">
          {/* Titre + FILTRE + Nouveau */}
          <div className="w-full">
            <h1 className="font-bold mb-3">
              Liste des Professeurs enregistrées
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <input
                type="text"
                placeholder="Filtrer par nom, email, adresse..."
                value={search}
                onChange={handleSearch}
                className="border p-2 rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />

              <button
                className="button flex gap-3 hover:scale-105 transition duration-200"
                onClick={() => {
                  setIsclicked(true);
                  setisadd(true);
                  setId(undefined);
                  setPreview(null);
                  setSelectedFile(null);
                  setIsphotosDeleted(false);
                  setFileName("Aucun fichier choisi");
                  setdataProfesseur({
                    nomProfesseur: "",
                    prenomProfesseur: "",
                    nomCourant: "",
                    grade: "",
                    sexe: "",
                    photos: "",
                    contact: "",
                    adresse: "",
                    email: "",
                    numEtablissement: numEtablissement ?? null,
                    matieres: [],
                  });
                }}
              >
                <img
                  src="/Icons/plus-claire.png"
                  alt="Plus"
                  className="w-6 h-6"
                />
                Nouveau
              </button>
            </div>
          </div>

          {/* Liste */}
          {isLoading ? (
            <div className="w-full h-40 flex flex-col items-center justify-center mt-[5%]">
              <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-2">Chargement des données...</p>
            </div>
          ) : listeProfesseur.length === 0 ? (
            <div className="w-full h-40 flex flex-col items-center justify-center mt-[5%]">
              <img src="/Icons/vide.png" alt="Vide" className="w-14" />
              <p className="text-gray-400">Aucune donnée trouvée</p>
            </div>
          ) : (
            <div>
              <div className="w-full border rounded-t-lg overflow-x-auto">
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-500 text-white text-sm">
                      <th className="px-4 py-4 cursor-pointer relative">
                        <input
                          className="cursor-pointer"
                          type="checkbox"
                          checked={allChecked}
                          onChange={handleCheckAll}
                        />
                        {checkedRows.length > 0 && (
                          <button
                            className="absolute right-[-6px] rounded hover:bg-opacity-80"
                            onClick={() => {
                              confirmerSuppression(1);
                              setDeleteByChekbox(true);
                            }}
                            title="Supprimer la sélection"
                          >
                            <img
                              src="/Icons/supprimer.png"
                              alt="Supprimer"
                              className="w-5"
                            />
                          </button>
                        )}
                      </th>
                      <th className="px-4 py-4">#</th>
                      <th className="px-4 py-4">Nom</th>
                      <th className="px-4 py-4">Prénom</th>
                      <th className="px-4 py-4">Email</th>
                      <th className="px-4 py-4">Adresse</th>
                      <th className="px-4 py-4">Contact</th>
                      <th className="px-4 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {currentData.map((p, index) => (
                      <tr
                        key={p.numProfesseur ?? index}
                        className="border-b transition-all duration-300 hover:bg-gray-100"
                      >
                        <td className="px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            className="cursor-pointer"
                            checked={checkedRows.includes(p.numProfesseur)}
                            onChange={() => handleCheck(p.numProfesseur)}
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          {p.numProfesseur}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {p.nomProfesseur}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {p.prenomProfesseur}
                        </td>
                        <td className="px-4 py-2 text-center">{p.email}</td>
                        <td className="px-4 py-2 text-center">{p.adresse}</td>
                        <td className="px-4 py-2 text-center">{p.contact}</td>
                        <td className="px-4 py-2 flex justify-center items-center gap-2">
                          <button
                            className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-200"
                            title="Modifier"
                            onClick={async () => {
                              await editProfesseur(p.numProfesseur);
                            }}
                          >
                            <img
                              src="/Icons/modifier.png"
                              alt="Modifier"
                              className="w-5 h-5"
                            />
                          </button>

                          <button
                            className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-200"
                            title="Supprimer"
                            onClick={() => {
                              setDeleteByChekbox(false);
                              confirmerSuppression(p.numProfesseur);
                            }}
                          >
                            <img
                              src="/Icons/supprimer.png"
                              alt="Supprimer"
                              className="w-5 h-5"
                            />
                          </button>

                          <button
                            className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-200"
                            title="Afficher"
                            onClick={() => versDetails(p.numProfesseur)}
                          >
                            <img
                              src="/Icons/afficher.png"
                              alt="Afficher"
                              className="w-5 h-5"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <footer className="w-full flex justify-center gap-2 p-4">
                <button
                  onClick={() => setPageActuel((prev) => Math.max(prev - 1, 1))}
                  disabled={pageActuel === 1}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 hover:scale-105 transition duration-200 disabled:opacity-50"
                  title="Page précédente"
                >
                  <img
                    src="/Icons/vers-le-bas.png"
                    alt="Précédent"
                    className="w-5 rotate-90"
                  />
                </button>

                {getPageNumbers().map((page, idx) => (
                  <button
                    key={`${page}-${idx}`}
                    onClick={() =>
                      typeof page === "number" && setPageActuel(page)
                    }
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition duration-200 ${
                      page === pageActuel
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:scale-105"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setPageActuel((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={pageActuel === totalPages}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 hover:scale-105 transition duration-200 disabled:opacity-50"
                  title="Page suivante"
                >
                  <img
                    src="/Icons/vers-le-bas.png"
                    alt="Suivant"
                    className="w-5 rotate-[270deg]"
                  />
                </button>
              </footer>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Professeur;
