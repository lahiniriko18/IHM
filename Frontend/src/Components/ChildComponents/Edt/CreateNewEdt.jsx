import axios from "axios";
import { addDays, format, parseISO, startOfWeek } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import html2canvas from "html2canvas";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useLocation, useNavigate } from "react-router-dom";
import Creatable from "react-select/creatable";
import * as XLSX from "xlsx";
import { useSidebar } from "../../Context/SidebarContext";

function CreateNewEdt() {
  const { isReduire } = useSidebar();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [file, setFile] = useState(null);
  const fileTypes = ["XLS", "XLSX"];
  const [hover, setHover] = useState(false);
  const location = useLocation();
  const [modele, setModele] = useState(1);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenHours, setIsOpenHours] = useState(false);
  const [setting, setSetting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alertModal, setAlertModal] = useState({
    status: false,
    type: "",
    message: "",
  });
  const [horaireError, setHoraireError] = useState("");
  const initialStateEdt = location.state?.objectStateEdt || {};
  const [objectStateEdt, setObjectStateEdt] = useState(initialStateEdt);
  const [numNiveauParcours, setNumNiveauParcours] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [listeMatiere, setListeMatiere] = useState([]);
  const [listeSalle, setListeSalle] = useState([]);
  const [listeClasse, setListeClasse] = useState([]);
  const [listeNiveau, setListeNiveau] = useState([]);
  const [niveauSelected, setNiveauSelected] = useState([]);
  const [listeProfesseur, setlisteProfesseur] = useState([]);
  const [professeursFiltres, setProfesseursFiltres] = useState([]);
  const [error, setError] = useState({
    status: false,
    composant: "",
    message: "",
  });
  const [formError, setFormError] = useState("");
  const [date, setDate] = useState({ date_debut: "", date_fin: "" });
  const [formHoraire, setFormHoraire] = useState({
    heureDebut: "",
    heureFin: "",
  });
  const [formCreneau, setFormCreneau] = useState({
    classe: null,
    matiere: null,
    professeur: null,
    salle: null,
  });
  const [previewData, setPreviewData] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const previewRef = useRef();
  const [caseSelectionne, setCaseSelectionne] = useState(null);
  const initialObjectEdt = () => {
    const nombreCase = Math.max(2, listeClasse.lenght || 0);
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const ligneInitiale = {
      Horaire: { heureDebut: "", heureFin: "" },
    };
    jours.forEach((jour) => {
      ligneInitiale[jour] = Array.from({ length: nombreCase }, () => ({
        classe: null,
        matiere: null,
        professeur: null,
        salle: null,
      }));
    });
    return {
      donnee: {
        titre: [
          {
            Lundi: "",
            Mardi: "",
            Mercredi: "",
            Jeudi: "",
            Vendredi: "",
            Samedi: "",
          },
          numNiveauParcours ? numNiveauParcours : objectStateEdt.niveau,
        ],

        contenu: [ligneInitiale],
      },
    };
  };
  const [objectEdt, setObjectEdt] = useState(initialObjectEdt());

  //API
  const getDataNiveau = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/niveau-parcours/"
      );
      if (response.status !== 200) {
        throw new Error("Erreur code : " + response.status);
      }
      setListeNiveau(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error.message);
    }
  };
  const getDataClasse = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/classe/niveau-parcours/${numNiveauParcours}`
      );
      if (response.status !== 200) {
        throw new Error("Erreur code : " + response.status);
      }
      setListeClasse(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };
  const getNiveau = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/niveau-parcours/${numNiveauParcours}`
      );
      if (response.status !== 200) {
        throw new Error("Erreur code : " + response.status);
      }
      setNiveauSelected(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };
  const getDataSalle = async (donnees) => {
    // console.log(donnees);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/salle/liste/verifier/",
        donnees
      );
      if (response.status !== 200) {
        throw new Error("Erreur code : " + response.status);
      }
      setListeSalle(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };
  const getDataMatiere = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/matiere/niveau-parcours/${numNiveauParcours}`
      );
      if (response.status !== 200) {
        throw new Error("Erreur code : " + response.status);
      }
      setListeMatiere(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };
  const getDataProfesseurs = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/professeur/niveau-parcours/${numNiveauParcours}`
      );
      if (response.status !== 200) {
        throw new Error("Erreur code : " + response.status);
      }
      setlisteProfesseur(response.data);
    } catch (error) {
      if (error.response) {
        console.error("Erreur du serveur :", error.response.data);
      } else {
        console.error("Erreur inconnue :", error.message);
      }
    }
  };
  const sendData = async () => {
    const contenuNettoye = objectEdt.donnee.contenu.map((ligne) => {
      const nouvelleLigne = {
        Horaire: { ...ligne.Horaire },
      };
      Object.keys(ligne).forEach((jour) => {
        if (jour === "Horaire") return;

        nouvelleLigne[jour] = ligne[jour].map((creneau) => {
          const estVide = Object.values(creneau).every((val) => val === null);
          return estVide ? {} : creneau;
        });
      });
      return nouvelleLigne;
    });

    const dataToSend = {
      donnee: {
        ...objectEdt.donnee,
        contenu: contenuNettoye,
      },
    };
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/edt/ajouter/liste/`,
        dataToSend
      );
      if (response.status !== 200) {
        throw new Error("Erreur code : " + response.status);
      }
      getDataClasse();
      // getDataSalle();
      getDataMatiere();
      getDataProfesseurs();
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  };
  const verifierEdt = async () => {
    const data = {
      dateDebut: formatDateToDDMMYYYY(objectStateEdt.date_debut),
      numNiveauParcours: numNiveauParcours || objectStateEdt.niveau,
    };
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/edt/ajouter/verifier/",
        data
      );
      if (response.status !== 200) {
        throw new Error("Erreur code : " + response.status);
      }
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Erreur du serveur :", error.response.data);
      } else {
        console.error("Erreur inconnue :", error.message);
      }
    }
  };
  //Fin de l'API

  //Function & Code ankoatrin'ny api & useffect
  // Navigation
  const versGeneral = () => {
    navigate("/edt");
  };

  const versAFfichage = () => {
    navigate("/edt/affichage-edt");
  };
  const versCreationEdt = () => navigate("/edt/nouveau-edt");

  // Ajout de nouvelle ligne de donnéés
  function ajouterNouveauLigne(desc) {
    if (desc === "ligne") {
      const horaireVide = objectEdt.donnee.contenu.some(
        (l) => !l.Horaire.heureDebut || !l.Horaire.heureFin
      );
      if (horaireVide) {
        setAlertModal({
          ...alertModal,
          status: true,
          type: "alarm",
          message:
            "Veuillez d'abord remplir tous les horaires existants avant d'ajouter une nouvelle colonne.",
        });
        return;
      }
      const nombreCreneaux = Math.max(2, listeClasse.length || 0);
      const jours = [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
      ];
      const nouvelleLigne = {
        Horaire: {
          heureDebut: "",
          heureFin: "",
        },
      };

      jours.forEach((jour) => {
        nouvelleLigne[jour] = Array.from({ length: nombreCreneaux }, () => ({
          classe: null,
          matiere: null,
          professeur: null,
          salle: null,
        }));
      });

      setObjectEdt((prev) => ({
        ...prev,
        donnee: {
          ...prev.donnee,
          contenu: [...prev.donnee.contenu, nouvelleLigne],
        },
      }));
    } else {
      const jours = [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
      ];
      const horaireVide = objectEdt.donnee.contenu.some(
        (l) => !l.Horaire.heureDebut || !l.Horaire.heureFin
      );
      if (horaireVide) {
        setAlertModal({
          ...alertModal,
          status: true,
          type: "alarm",
          message:
            "Veuillez d'abord remplir tous les horaires existants avant d'ajouter une nouvelle colonne.",
        });
        return;
      }
      setFormHoraire({ heure_debut: "", heure_fin: "" });
      setObjectEdt((prev) => ({
        ...prev,
        donnee: {
          ...prev.donnee,
          contenu: [
            ...prev.donnee.contenu,
            {
              Horaire: { heureDebut: "", heureFin: "" },
              ...Object.fromEntries(
                jours.map((jour) => [
                  jour,
                  Array.from(
                    { length: Math.max(2, listeClasse.length) },
                    () => ({
                      classe: null,
                      matiere: null,
                      professeur: null,
                      salle: null,
                    })
                  ),
                ])
              ),
            },
          ],
        },
      }));
    }
  }

  // formatage de l'horaire
  function formatHeure(heureStr) {
    if (!heureStr && heureStr !== 0) return "";
    if (typeof heureStr === "number") {
      return `${heureStr}h`;
    }
    if (typeof heureStr === "string") {
      const [h, m] = heureStr.split(":");
      return m === "00" ? `${parseInt(h, 10)}h` : `${parseInt(h, 10)}h:${m}`;
    }
    return "";
  }
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setFile(null);
      setError({
        status: true,
        composant: "fichier",
        message: "Seuls les fichiers Excel (.xls, .xlsx) sont acceptés.",
      });
      return;
    }

    setFile(file);
    setError({ status: false, composant: "", message: "" });

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      setPreviewData(jsonData);

      // Attendre que le DOM soit mis à jour avant de capturer
      setTimeout(() => {
        if (previewRef.current) {
          html2canvas(previewRef.current).then((canvas) => {
            setImagePreviewUrl(canvas.toDataURL("image/png"));
          });
        }
      }, 300);
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  //Recuper le nom d'une proprieté a partir de son id :

  const getNiveauLabel = (numNiveau) => {
    const found = listeNiveau.find((c) => c.numNiveauParcours === numNiveau);
    if (!found) return "";
    return (
      found.niveau +
      (found.numParcours.codeParcours
        ? found.numParcours.codeParcours
        : " - " + found.numParcours.nomParcours)
    );
  };
  const getClasseLabel = (numClasse) => {
    const found = listeClasse.find((c) => c.numClasse === numClasse);
    if (!found) return "";
    const parcours =
      Array.isArray(found.parcours) && found.parcours.length > 0
        ? found.parcours[0]
        : {};
    return (
      found.niveau +
      (parcours.codeParcours
        ? parcours.codeParcours
        : parcours.nomParcours
        ? `-${parcours.nomParcours}-`
        : "") +
      (found.groupe
        ? found.groupe.toString().split(" ").slice(1).join(" ")
        : "")
    );
  };

  const getMatiereLabel = (numMatiere) => {
    const found = listeMatiere.find((m) => m.numMatiere === numMatiere);
    return found ? found.codeMatiere || found.nomMatiere || "" : "";
  };

  const getProfLabel = (numProfesseur) => {
    const found = listeProfesseur.find(
      (p) => p.numProfesseur === numProfesseur
    );
    if (!found) return "";
    return found.nomCourant
      ? found.nomCourant
      : found.prenomProfesseur
      ? found.prenomProfesseur
      : found.nomProfesseur;
  };

  const getSalleLabel = (numSalle) => {
    const found = listeSalle.find((s) => s.numSalle === numSalle);
    return found ? found.nomSalle : "";
  };
  const telechargerFichier = async (numero) => {
    if (!objectStateEdt.niveau) {
      setError({
        ...error,
        status: true,
        composant: "niveau",
        message: "Selectionner d'abord le niveau!",
      });
      return;
    }
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/edt/telecharger/`,
        {
          niveauParcours: objectStateEdt.niveau,
          typeFichier: numero,
          dateDebut: objectStateEdt.date_debut
            ? formatDateToDDMMYYYY(objectStateEdt.date_debut)
            : null,
          dateFin: objectStateEdt.date_fin
            ? formatDateToDDMMYYYY(objectStateEdt.date_debut)
            : null,
        },
        {
          responseType: "blob", // Important pour gérer les fichiers binaires
        }
      );

      // Créer une URL temporaire pour le fichier
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `modele-${numero}.xlsx`); // Nom du fichier téléchargé
      document.body.appendChild(link);
      link.click(); // Simule un clic pour télécharger le fichier
      link.remove(); // Supprime le lien après le téléchargement
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
    }
  };
  // verification de l'heure debut et fin
  const verifierHeure = (heure) => {
    return typeof heure === "string" && heure.includes(":")
      ? heure
      : heure
      ? String(heure).padStart(2, "0") + ":00"
      : "";
  };
  // Formater le date au bonne semaine
  const formatDate = (date) => {
    const selectedDate = parseISO(date);
    const lundi = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const samedi = addDays(lundi, 5);
    setObjectStateEdt({
      ...objectStateEdt,
      date_debut: format(lundi, "yyyy-MM-dd"),
      date_fin: format(samedi, "yyyy-MM-dd"),
    });
  };
  function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }
  const handleDateChange = (event) => {
    const date = event.target.value;
    if (date) {
      const selectedDate = parseISO(date);
      const lundi = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const samedi = addDays(lundi, 5);
      setObjectStateEdt((prev) => ({
        ...prev,
        date_debut: format(lundi, "yyyy-MM-dd"),
        date_fin: format(samedi, "yyyy-MM-dd"),
      }));
    } else {
      setObjectStateEdt((prev) => ({
        ...prev,
        date_debut: "",
        date_fin: "",
      }));
    }
  };
  const verifierNull = () => {
    // Retourne true si TOUTES les cases sont vides, false sinon
    return objectEdt.donnee.contenu.every((ligne) =>
      Object.keys(ligne)
        .filter((key) => key !== "Horaire")
        .every((jour) =>
          ligne[jour].every(
            (casItem) =>
              !casItem.classe &&
              !casItem.matiere &&
              !casItem.professeur &&
              !casItem.salle
          )
        )
    );
  };
  //envoyer le fichier vers django
  const envoyerFichier = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("fichier", file); // "file" doit correspondre au nom attendu par Django
    try {
      const response = await axios.post(
        "http://localhost:8000/api/edt/ajouter/excel/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status !== 201 && response.status !== 200)
        throw new Error("Erreur");
      console.log("Ajouter avec succès 😄");
    } catch (error) {
      console.error(
        "Erreur exacte de l'ajout :",
        error.response || error.message
      );
    } finally {
      console.log("Requête terminée et exécutée");
    }
  };
  // Envoyer le donnée au django
  const envoyerDonnee = async () => {
    const horaireVide = objectEdt.donnee.contenu.some(
      (l) => !l.Horaire.heureDebut || !l.Horaire.heureFin
    );
    if (!numNiveauParcours) {
      setAlertModal({
        ...alertModal,
        status: true,
        type: "alarm",
        message:
          "Veuillez selectionner le classe et remplir tous les donnée avant de d'envoyer",
      });
    } else if (!objectStateEdt.date_debut) {
      setAlertModal({
        ...alertModal,
        status: true,
        type: "alarm",
        message:
          "Veuillez entrer  le date avant de d'enregistrer l'emploi du temps",
      });
    } else if (horaireVide) {
      setAlertModal({
        ...alertModal,
        status: true,
        type: "alarm",
        message: "Veuillez remplir les données du horaire avant de d'envoyer ",
      });
    } else if (verifierNull()) {
      setAlertModal({
        ...alertModal,
        status: true,
        type: "alarm",
        message: "L'edt ne peut pas etre vide ,il faudra au moins une seance ",
      });
    } else {
      const ok = await sendData();
      if (ok) {
        versGeneral();
      }
    }
  };
  // Validation formulaire d'ajout  Creanau
  const ValidationCrenau = () => {
    // Vérification des champs vides
    if (
      !formCreneau.classe ||
      !formCreneau.matiere ||
      !formCreneau.professeur ||
      !formCreneau.salle
    ) {
      setFormError("Tous les champs sont obligatoires.");
      return;
    }

    // Récupère l'index selon le modèle
    const Index =
      modele === 1 ? caseSelectionne?.ligneIdx : caseSelectionne?.colIdx;
    const jour = caseSelectionne?.jour;
    const crenauIdx = caseSelectionne?.crenauIdx ?? 0;

    // Sécurité : vérifie que tout existe
    if (
      typeof Index !== "number" ||
      !jour ||
      !objectEdt.donnee.contenu[Index] ||
      !Array.isArray(objectEdt.donnee.contenu[Index][jour])
    ) {
      setFormError(
        "Erreur interne : impossible de trouver la case à modifier."
      );
      return;
    }

    const autresCreneaux = objectEdt.donnee.contenu[Index][jour].filter(
      (_, i) => i !== crenauIdx
    );
    if (autresCreneaux.some((c) => c.classe === formCreneau.classe)) {
      setFormError(
        "Les deux créneaux d'un même jour/heure ne peuvent pas avoir la même classe."
      );
      return;
    } else if (autresCreneaux.some((c) => c.salle === formCreneau.salle)) {
      setFormError(
        "Les deux créneaux d'un même jour/heure ne peuvent pas avoir la même salle."
      );
      return;
    } else if (
      autresCreneaux.some((c) => c.professeur === formCreneau.professeur)
    ) {
      setFormError(
        "Les deux créneaux d'un même jour/heure ne peuvent pas avoir le même professeur."
      );
      return;
    }

    setFormError("");
    setObjectEdt((prev) => {
      const newData = { ...prev };
      newData.donnee.contenu[Index][jour][crenauIdx] = { ...formCreneau };
      return newData;
    });
    setIsOpenAdd(false);
    setCaseSelectionne(null);
  };

  // formatage d l'heure en dd-MM-yyyy
  function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }
  //Validation form horaire
  const validerHoraire = () => {
    if (!formHoraire.heureDebut || !formHoraire.heureFin) {
      setHoraireError("Les deux champs sont obligatoires.");
      return;
    }
    if (formHoraire.heureDebut >= formHoraire.heureFin) {
      setHoraireError(
        "L'heure de début doit être inférieure à l'heure de fin."
      );
      return;
    }

    const Index =
      modele === 1 ? caseSelectionne.ligneIdx : caseSelectionne.colonneIndex;

    // Vérifie si l'horaire existe déjà (sauf la colonne en cours d'édition)
    const existe = objectEdt.donnee.contenu.some(
      (l, i) =>
        i !== Index &&
        l.Horaire.heureDebut === formHoraire.heureDebut &&
        l.Horaire.heureFin === formHoraire.heureFin
    );
    if (existe) {
      setHoraireError("Cet horaire existe déjà dans le tableau.");
      return;
    }

    // Vérifie qu'il n'y a pas de chevauchement ou d'inclusion
    const debutMinutes =
      parseInt(formHoraire.heureDebut.split(":")[0], 10) * 60 +
      parseInt(formHoraire.heureDebut.split(":")[1], 10);
    const finMinutes =
      parseInt(formHoraire.heureFin.split(":")[0], 10) * 60 +
      parseInt(formHoraire.heureFin.split(":")[1], 10);

    const chevauchement = objectEdt.donnee.contenu.some((l, i) => {
      if (i === Index) return false;
      const d = l.Horaire.heureDebut;
      const f = l.Horaire.heureFin;
      if (!d || !f) return false;
      const dMin =
        parseInt(d.split(":")[0], 10) * 60 + parseInt(d.split(":")[1], 10);
      const fMin =
        parseInt(f.split(":")[0], 10) * 60 + parseInt(f.split(":")[1], 10);

      // Si le nouvel horaire commence ou finit à l'intérieur d'un horaire existant
      // ou s'il englobe un horaire existant
      return (
        (debutMinutes > dMin && debutMinutes < fMin) || // commence à l'intérieur
        (finMinutes > dMin && finMinutes < fMin) || // finit à l'intérieur
        (debutMinutes <= dMin && finMinutes >= fMin) // englobe l'existant
      );
    });
    if (chevauchement) {
      setHoraireError(
        "L'horaire saisi chevauche ou est inclus dans un horaire existant."
      );
      return;
    }

    setObjectEdt((prev) => {
      const newData = { ...prev };
      if (typeof Index === "number" && newData.donnee.contenu[Index]) {
        newData.donnee.contenu[Index].Horaire = { ...formHoraire };
      }
      return newData;
    });
    setHoraireError("");
    setIsOpenHours(false);
  };

  // Mise a jour de titre
  const miseAjourtitre = () => {
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const lundi = parseISO(objectStateEdt.date_debut);
    const titre = {};
    jours.forEach((jour, index) => {
      const jourDate = addDays(lundi, index);
      titre[jour] = format(jourDate, "dd-MM-yyyy");
    });
    setObjectEdt((prev) => ({
      ...prev,
      donnee: {
        ...prev.donnee,
        titre: [titre, prev.donnee.titre?.[1] ?? objectStateEdt.niveau],
      },
    }));
  };
  // ****Affichage dans le form
  const optionsNiveau = listeNiveau.map((Classe) => ({
    value: Classe.numNiveauParcours,
    label:
      Classe.niveau +
      (Classe.numParcours.codeParcours
        ? Classe.numParcours.codeParcours
        : " - " + Classe.numParcours.nomParcours),
  }));
  const optionsClasse = listeClasse.map((Classe) => {
    const parcoursLabels = Array.isArray(Classe.parcours)
      ? Classe.parcours
          .map((p) =>
            p.codeParcours
              ? p.codeParcours
              : p.nomParcours
              ? `-${p.nomParcours}-`
              : ""
          )
          .join(" / ")
      : "";

    return {
      value: Classe.numClasse,
      label:
        Classe.niveau +
        parcoursLabels +
        (Classe.groupe
          ? Classe.groupe.toString().split(" ").slice(1).join(" ")
          : ""),
    };
  });
  const optionCreation = [
    { value: "manuel", label: "Manuellement" },
    { value: "excel", label: "Importez depuis excel" },
  ];
  const optionsSalle =
    listeSalle.length > 0
      ? listeSalle
          .filter((Salle) => (Salle.status = true))
          .filter(
            (Salle, index, self) =>
              index === self.findIndex((c) => c.nomSalle === Salle.nomSalle)
          )
          .map((Salle) => ({
            value: Salle.numSalle,
            label: Salle.nomSalle,
          }))
      : [];
  const optionsMatiere = listeMatiere
    .sort((a, b) => a.nomMatiere.localeCompare(b.nomMatiere))
    .map((Matiere) => ({
      value: Matiere.numMatiere,
      label: Matiere.nomMatiere
        ? Matiere.nomMatiere
        : Matiere.codeMatiere
        ? ` (${Matiere.codeMatiere})`
        : "",
    }));
  const optionsProfesseur = listeProfesseur
    .sort((a, b) => a.nomProfesseur.localeCompare(b.nomProfesseur))
    .map((Professeur) => ({
      value: Professeur.numProfesseur,
      label:
        `${Professeur.sexe === "Masculin" ? "Mr" : "Mme"} ` +
        (Professeur.nomCourant
          ? Professeur.nomCourant
          : Professeur.prenomProfesseur
          ? Professeur.prenomProfesseur
          : Professeur.nomProfesseur),
    }));

  //useEffect

  // maka num niveau-parcours + date de debut et fin au premier rendu
  useEffect(() => {
    setIsLoading(true);
    getDataNiveau();
    objectStateEdt.niveau ? setNumNiveauParcours(objectStateEdt.niveau) : null;
    if (objectStateEdt.date_debut && objectStateEdt.date_fin) {
      miseAjourtitre();
      formatDate(objectStateEdt.date_debut);
    }
    setIsLoading(false);
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // mi-inserer ny valeur ny titre
  useEffect(() => {
    if (objectStateEdt?.date_debut) {
      miseAjourtitre();
    }
  }, [objectStateEdt]); // plutôt que seulement .date_debut
  useEffect(() => {
    objectStateEdt.mode_creation == "manuel" && setFile(null);
  }, [objectStateEdt.mode_creation]);
  // maka liste Rehetra a chaque changement num
  useEffect(() => {
    if (numNiveauParcours) {
      getDataClasse();
      // getDataSalle()
      getDataMatiere();
      getDataProfesseurs();
      getNiveau();
    }
  }, [numNiveauParcours]);
  //useffect qui change le valeur du prof chaque changement matiere
  useEffect(() => {
    if (!formCreneau.matiere) {
      setProfesseursFiltres([]);
      return;
    }
    setProfesseursFiltres(
      listeProfesseur.filter(
        (prof) =>
          Array.isArray(prof.matieres) &&
          prof.matieres.some((m) => m.numMatiere === formCreneau.matiere)
      )
    );
  }, [formCreneau.matiere, listeProfesseur]);

  // mametraka ny isan'ny crenau
  useEffect(() => {
    const checkEdt = async () => {
      if (!numNiveauParcours || listeClasse.length === 0) {
        setObjectEdt(initialObjectEdt());
        return;
      }
      const a = await verifierEdt();

      if (a) {
        setAlertModal({
          ...alertModal,
          status: true,
          type: "error",
          message: `L'edt du ${getNiveauLabel(
            numNiveauParcours
          )} à ce date (${formatDateToDDMMYYYY(
            objectStateEdt.date_debut
          )} au ${formatDateToDDMMYYYY(
            objectStateEdt.date_fin
          )}) est exite dejà`,
        });
        setObjectStateEdt({ ...objectStateEdt, date_debut: "", date_fin: "" });
        return;
      }
      const nombreCase = Math.max(2, listeClasse.length);
      const jours = [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
      ];
      const ligneInitiale = {
        Horaire: { heureDebut: "", heureFin: "" },
      };
      jours.forEach((jour) => {
        ligneInitiale[jour] = Array.from({ length: nombreCase }, () => ({
          classe: null,
          matiere: null,
          professeur: null,
          salle: null,
        }));
      });

      // Calcul du titre ici, à partir de la date_debut
      let titreJours = {};
      if (objectStateEdt.date_debut) {
        const lundi = parseISO(objectStateEdt.date_debut);
        jours.forEach((jour, index) => {
          const jourDate = addDays(lundi, index);
          titreJours[jour] = format(jourDate, "dd-MM-yyyy");
        });
      } else {
        jours.forEach((jour) => (titreJours[jour] = ""));
      }

      setObjectEdt({
        donnee: {
          titre: [titreJours, numNiveauParcours ?? objectStateEdt.niveau],
          contenu: [ligneInitiale],
        },
      });
    };
    checkEdt(); // <-- On appelle la fonction ici !
  }, [listeClasse, numNiveauParcours, objectStateEdt.date_debut]);

  //mametraka valeur @numNiveauparcours
  useEffect(() => {
    setNumNiveauParcours(objectStateEdt.niveau);
  }, [objectStateEdt]);

  return (
    <>
      {isOpenAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center">
          <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[95%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-blue-600 text-xl font-bold">
                {caseSelectionne?.jour}{" "}
                {caseSelectionne
                  ? `${formatHeure(
                      modele == 1
                        ? objectEdt.donnee.contenu[caseSelectionne.ligneIdx]
                            ?.Horaire.heureDebut
                        : objectEdt.donnee.contenu[caseSelectionne.colIdx]
                            ?.Horaire.heureDebut
                    )} - ${formatHeure(
                      modele == 1
                        ? objectEdt.donnee.contenu[caseSelectionne.ligneIdx]
                            ?.Horaire.heureFin
                        : objectEdt.donnee.contenu[caseSelectionne.colIdx]
                            ?.Horaire.heureFin
                    )}`
                  : ""}
              </h1>
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                onClick={() => {
                  setIsOpenAdd(false);
                  setCaseSelectionne(null);
                  setFormError("");
                }}
                className="w-6 h-6 cursor-pointer"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Classe</label>
              <Creatable
                isClearable
                options={optionsClasse}
                isValidNewOption={() => false}
                onChange={(selectedOption) => {
                  setFormCreneau((prev) => ({
                    ...prev,
                    classe: selectedOption ? selectedOption.value : null,
                  }));
                }}
                value={
                  optionsClasse.find(
                    (option) => option.value === formCreneau.classe
                  ) || null
                }
                placeholder="Choisir la classe"
                className="text-sm"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Matiere</label>
              <Creatable
                isClearable
                options={optionsMatiere}
                isValidNewOption={() => false}
                onChange={(selectedOption) => {
                  setFormCreneau((prev) => ({
                    ...prev,
                    matiere: selectedOption ? selectedOption.value : null,
                    professeur: null,
                  }));
                }}
                value={
                  optionsMatiere.find(
                    (option) => option.value === formCreneau.matiere
                  ) || null
                }
                placeholder="Choisir le matière"
                className="text-sm"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Professeur</label>
              <Creatable
                isClearable
                isValidNewOption={() => false}
                options={professeursFiltres.map((Professeur) => ({
                  value: Professeur.numProfesseur,
                  label:
                    `${Professeur.sexe === "Masculin" ? "Mr" : "Mme"} ` +
                    (Professeur.nomCourant
                      ? Professeur.nomCourant
                      : Professeur.prenomProfesseur
                      ? Professeur.prenomProfesseur
                      : Professeur.nomProfesseur),
                }))}
                onChange={(selectedOption) => {
                  setFormCreneau((prev) => ({
                    ...prev,
                    professeur: selectedOption ? selectedOption.value : null,
                  }));
                }}
                value={
                  professeursFiltres
                    .map((Professeur) => ({
                      value: Professeur.numProfesseur,
                      label:
                        `${Professeur.sexe === "Masculin" ? "Mr" : "Mme"} ` +
                        (Professeur.nomCourant
                          ? Professeur.nomCourant
                          : Professeur.prenomProfesseur
                          ? Professeur.prenomProfesseur
                          : Professeur.nomProfesseur),
                    }))
                    .find(
                      (option) => option.value === formCreneau.professeur
                    ) || null
                }
                placeholder="Choisir le professeur"
                className="text-sm"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Salle</label>
              <Creatable
                isClearable
                options={optionsSalle}
                isValidNewOption={() => false}
                onChange={(selectedOption) => {
                  setFormCreneau((prev) => ({
                    ...prev,
                    salle: selectedOption ? selectedOption.value : null,
                  }));
                }}
                value={
                  optionsSalle.find(
                    (option) => option.value === formCreneau.salle
                  ) || null
                }
                placeholder="Choisir le salle"
                className="text-sm"
              />
            </div>
            {formError && (
              <div className="text-red-600 text-sm mb-2">{formError}</div>
            )}
            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  ValidationCrenau();
                }}
              >
                VALIDER
              </button>
            </div>
          </div>
        </div>
      )}
      {isOpenHours && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center">
          <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[95%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-blue-600 text-xl font-bold">Horaire</h1>
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                onClick={() => {
                  setIsOpenHours(false);
                }}
                className="w-6 h-6 cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm mb-1">
                Heure de début :
              </label>
              <input
                type="time"
                className="border p-2"
                value={formHoraire.heureDebut}
                onChange={(e) =>
                  setFormHoraire((prev) => ({
                    ...prev,
                    heureDebut: e.target.value,
                  }))
                }
              />
              <label className="font-semibold text-sm mb-1">
                Heure de fin :{" "}
              </label>
              <input
                type="time"
                value={formHoraire.heureFin}
                onChange={(e) =>
                  setFormHoraire((prev) => ({
                    ...prev,
                    heureFin: e.target.value,
                  }))
                }
                className="border p-2"
              />
            </div>
            {horaireError && (
              <div className="text-red-600 text-sm mb-2">{horaireError}</div>
            )}
            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700"
                onClick={() => {
                  validerHoraire();
                }}
              >
                VALIDER
              </button>
            </div>
          </div>
        </div>
      )}
      {alertModal.status && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center"
          tabIndex="-1"
        >
          <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[90%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              {alertModal.type == "info" && (
                <h1 className="text-blue-600 text-xl font-bold">Information</h1>
              )}
              {alertModal.type == "error" && (
                <h1 className="text-blue-600 text-xl font-bold">Erreur</h1>
              )}
              {alertModal.type == "alarm" && (
                <h1 className="text-blue-600 text-xl font-bold">Attention</h1>
              )}
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setAlertModal({
                    ...alertModal,
                    status: false,
                    type: "",
                    message: "",
                  });
                }}
              />
            </div>
            <div className="flex flex-row gap-2">
              {alertModal.type == "info" && (
                <img src="/Icons/info.png" alt="Attention" />
              )}
              {alertModal.type == "alarm" && (
                <img src="/Icons/attention.png" alt="Attention" />
              )}
              {alertModal.type == "error" && (
                <img src="/Icons/annuler.png" alt="Attention" />
              )}
              <p>{alertModal.message}</p>
            </div>
            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  setAlertModal({
                    ...alertModal,
                    status: false,
                    type: "",
                    message: "",
                  });
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className={`${
          isReduire ? "left-20" : "left-56"
        } fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}
      >
        <div className="flex flex-col gap-1 h-full">
          <div className="flex gap-3">
            <button
              className="hover:scale-105 text-gray-500"
              onClick={versGeneral}
            >
              Géneral
            </button>
            <button
              className="font-bold hover:scale-105 text-blue-600"
              onClick={versCreationEdt}
            >
              Creation
            </button>
            <button
              className="hover:scale-105 text-gray-500"
              onClick={versAFfichage}
            >
              Affichage
            </button>
          </div>

          <div className="flex justify-between items-center ">
            <span className="text-blue-600 font-bold flex flex-row items-center z-50">
              Création EDT pour :{" "}
              <Creatable
                isClearable
                options={optionsNiveau}
                isValidNewOption={() => false}
                onChange={(selectedOption) => {
                  setObjectStateEdt((prev) => ({
                    ...prev,
                    niveau: selectedOption ? selectedOption.value : null,
                  }));
                }}
                value={
                  optionsNiveau.find(
                    (option) => option.value === objectStateEdt.niveau
                  ) || null
                }
                placeholder=" "
                className="text-sm min-w-20 border-0"
              />
            </span>

            <div className="flex flex-row items-center gap-2">
              <img
                src="/Icons/parametre.png"
                alt="Settings"
                className={`w-7 cursor-pointer transition-all duration-500 ease-in-out
    ${
      setting
        ? "rotate-180 scale-110 translate-x-1"
        : "rotate-0 scale-100 translate-x-0"
    }
  `}
                onClick={() => setSetting(!setting)}
              />
              <AnimatePresence mode="wait">
                {setting ? (
                  <motion.div
                    key="setting-panel"
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex gap-2 items-center"
                  >
                    <div className="flex items-center">
                      <p className="">Mode: </p>
                      <Creatable
                        isClearable
                        isValidNewOption={() => false}
                        placeholder="Choisissez un modèle"
                        onChange={(selectedOption) => {
                          setObjectStateEdt((prev) => ({
                            ...prev,
                            mode_creation: selectedOption
                              ? selectedOption.value
                              : null,
                          }));
                        }}
                        value={
                          optionCreation.find(
                            (option) =>
                              option.value === objectStateEdt.mode_creation
                          ) || null
                        }
                        options={optionCreation}
                        className="text-sm z-50"
                      />
                    </div>
                    <div className="flex items-center">
                      <p className="w-40">Modele du tableau: {modele} </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="date-panel"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeIn" }}
                    className="flex gap-2 items-center"
                  >
                    <div className="flex items-center">
                      <p className="w-40">Date début : </p>
                      <input
                        type="date"
                        value={objectStateEdt.date_debut || ""}
                        onChange={handleDateChange}
                        name="date_debut"
                        id="date_debut"
                        className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      />
                    </div>
                    <div className="flex items-center">
                      <p className="w-40">Date fin : </p>
                      <input
                        type="date"
                        value={objectStateEdt.date_fin || ""}
                        readOnly
                        onChange={() =>
                          setObjectStateEdt({
                            ...objectStateEdt,
                            date_fin: e.target.value,
                          })
                        }
                        className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        name="date_fin"
                        id="date_fin"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              className="button"
              onClick={() => async () => {
                if (!file) {
                  envoyerDonnee();
                } else {
                  await envoyerFichier();
                  navigate("/edt");
                }
              }}
            >
              Creer l'EDT
            </button>
          </div>

          <div className="h-[73%] overflow-x-auto w-full m-4">
            {objectStateEdt.mode_creation != "manuel" ? (
              <div className="flex flex-col gap-8 w-full px-5">
                <div className="flex justify-between items-center w-full flex-row">
                  <div>
                    {file && (
                      <img
                        src="/Icons/annuler.png"
                        className="w-6 cursor-pointer"
                        alt="Sypprimer le fichier telecharger"
                        onClick={() => setFile(null)}
                      />
                    )}
                  </div>
                  <span
                    className="relative"
                    onMouseOver={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={() => {
                      setHover(false);
                      setIsOpen(!isOpen);
                    }}
                    ref={dropdownRef}
                  >
                    <img
                      src="/Icons/telecharger.png"
                      alt="Télécharger"
                      className="cursor-pointer w-5"
                    />
                    {hover && !isOpen && (
                      <p className="absolute w-44 right-0 px-2 py-2 bg-gray-200 text-gray-600 rounded text-sm">
                        Télécharger un modèle
                      </p>
                    )}
                    <div
                      className={`absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50 transition-all duration-200 transform ${
                        isOpen
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95 pointer-events-none"
                      }`}
                    >
                      <ul className="text-sm text-gray-700">
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            telechargerFichier(1);
                          }}
                        >
                          Modele 1
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            telechargerFichier(2);
                          }}
                        >
                          Modele 2
                        </li>
                        {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Déconnexion</li> */}
                      </ul>
                    </div>
                  </span>
                </div>
                <div className="flex flex-col  h-full">
                  {/* Zone FileUploader modifiée avec hauteur augmentée */}
                  <div className="relative w-full h-[385px] border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition duration-200 overflow-hidden">
                    <div
                      {...getRootProps()}
                      className="absolute inset-0 z-10 cursor-pointer"
                      style={{ outline: "none" }}
                    >
                      <input {...getInputProps()} />
                    </div>

                    {/* UI fixe */}
                    {!file ? (
                      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none">
                        <img
                          src="/Icons/upload.png"
                          alt="Upload"
                          className="w-16 h-16 mb-4"
                        />
                        <p className="text-gray-500 text-sm text-center">
                          Glissez-déposez un fichier ici ou cliquez pour le
                          sélectionner
                        </p>
                        <p className="text-gray-400 text-xs mt-2 text-center">
                          Formats acceptés : XLS, XLSX
                        </p>
                      </div>
                    ) : (
                      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none">
                        <img
                          src="/Images/excel.png"
                          alt="Excel"
                          className="w-16 h-16 mb-4"
                        />
                        <p className="text-gray-500 text-sm text-center">
                          Fichier sélectionné: {file.name}
                        </p>
                        <p className="text-gray-400 text-xs mt-2 text-center">
                          Cliquer dans le cadre pour modifier le fichier
                          telecharger
                        </p>
                      </div>
                    )}
                  </div>
                  {error.status && error.composant === "fichier" && (
                    <p className="text-red-600 text-sm">{error.message}</p>
                  )}
                </div>
              </div>
            ) : isLoading ? (
              <div className="w-full h-40 flex flex-col items-center  justify-center </div>mt-[10%]">
                <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                <p className="text-gray-400 mt-2">Chargement des données...</p>
              </div>
            ) : !numNiveauParcours ? (
              <div className="w-full h-40 flex flex-col items-center justify-center mt-[10%]">
                <img src="/Icons/vide.png" alt="Vide" className="w-14" />
                <p className="text-gray-400">Aucun niveau trouvé</p>
              </div>
            ) : modele === 1 ? (
              <div className="w-full border border-white rounded-t-lg overflow-x-auto">
                <table className="border w-full text-sm border-black">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th className="border-2 border-t-white border-l-white"></th>
                      {Object.keys(objectEdt.donnee.contenu[0])
                        .filter((key) => key !== "Horaire")
                        .map((jour, index) => (
                          <th
                            key={index}
                            className="border px-2 py-3 text-center text-white bg-blue-500"
                          >
                            {jour}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {objectEdt.donnee.contenu.map((ligne, i) => (
                      <tr key={i}>
                        <td className="border-2 p-2 font-semibold relative  min-w-[120px]">
                          <span className="flex justify-center">
                            {formatHeure(ligne.Horaire.heureDebut)} -{" "}
                            {formatHeure(ligne.Horaire.heureFin)}
                          </span>
                          <img
                            src="/Icons/modifier.png"
                            alt=""
                            className="absolute bottom-2 right-1 w-5 cursor-pointer"
                            onClick={() => {
                              setCaseSelectionne({ ligneIdx: i });
                              setFormHoraire({
                                ...objectEdt.donnee.contenu[i].Horaire,
                              });
                              setIsOpenHours(true);
                            }}
                          />
                          {i > 0 && (
                            <button
                              className="absolute top-2  right-20 text-red-600"
                              onClick={() => {
                                setObjectEdt((prev) => ({
                                  ...prev,
                                  donnee: {
                                    ...prev.donnee,
                                    contenu: prev.donnee.contenu.filter(
                                      (_, idx) => idx !== i
                                    ),
                                  },
                                }));
                              }}
                            >
                              <img
                                src="/Icons/retirer.png"
                                alt=""
                                className="w-5 cursor-pointer"
                              />
                            </button>
                          )}
                        </td>
                        {Object.keys(ligne)
                          .filter((key) => key !== "Horaire")
                          .map((jour, j) => (
                            <td
                              key={jour}
                              className="border-2 cursor-pointer h-24 relative"
                            >
                              <div
                                className="flex flex-row justify-start items-center w-full h-full"
                                key={j}
                              >
                                {ligne[jour].map((caseItem, value) => (
                                  <div
                                    className={`p-2 flex flex-col h-full relative
                                    ${
                                      value < ligne[jour].length - 1
                                        ? "border-r border-dashed border-gray-300"
                                        : ""
                                    }
                                    hover:bg-gray-200 active:bg-gray-300`}
                                    style={{
                                      width: `${100 / ligne[jour].length}%`,
                                      minWidth: 120,
                                    }}
                                    key={value}
                                    onClick={async () => {
                                      if (!numNiveauParcours) {
                                        setAlertModal({
                                          ...alertModal,
                                          status: true,
                                          type: "alarm",
                                          message:
                                            "Le classe est vide ,Selectionner le d'abord!",
                                        });
                                      } else if (!objectStateEdt.date_debut) {
                                        setAlertModal({
                                          ...alertModal,
                                          status: true,
                                          type: "info",
                                          message:
                                            "Pour la verification de la disponibilité de la salle,selectionner le date du debut svp!",
                                        });
                                      } else if (
                                        !objectEdt.donnee.contenu[i].Horaire
                                          .heureDebut
                                      ) {
                                        setAlertModal({
                                          ...alertModal,
                                          status: true,
                                          type: "info",
                                          message:
                                            "Pour la verification de la disponibilité de la salle,entrer l' horaire!",
                                        });
                                      } else {
                                        setCaseSelectionne({
                                          ligneIdx: i,
                                          jour,
                                          crenauIdx: value,
                                        });
                                        const creneau =
                                          objectEdt.donnee.contenu[i][jour][
                                            value
                                          ];
                                        setFormCreneau({ ...creneau });
                                        await getDataSalle({
                                          date: formatDateToDDMMYYYY(
                                            objectStateEdt.date_debut
                                          ),
                                          heureDebut:
                                            objectEdt.donnee.contenu[i].Horaire
                                              .heureDebut,
                                          heureFin:
                                            objectEdt.donnee.contenu[i].Horaire
                                              .heureFin,
                                        });
                                        setIsOpenAdd(true);
                                      }
                                    }}
                                  >
                                    <span className="flex flex-col w-full  relative ">
                                      <span className="flex flex-col w-full">
                                        {(() => {
                                          const isValid =
                                            caseItem.classe &&
                                            caseItem.matiere &&
                                            caseItem.professeur &&
                                            caseItem.salle;
                                          return (
                                            isValid && (
                                              <img
                                                src="/Icons/supprimer.png"
                                                className="absolute right-1 w-4 hover:scale-125 transition-all duration-200"
                                                alt=""
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setObjectEdt((prev) => {
                                                    const newData = { ...prev };
                                                    newData.donnee.contenu[i][
                                                      jour
                                                    ][value] = {
                                                      classe: null,
                                                      matiere: null,
                                                      professeur: null,
                                                      salle: null,
                                                    };
                                                    return newData;
                                                  });
                                                }}
                                              />
                                            )
                                          );
                                        })()}
                                        <p>
                                          {getClasseLabel(
                                            caseItem.classe
                                              ? caseItem.classe
                                              : caseItem.numClasse
                                          )}
                                        </p>
                                        <p>
                                          {getMatiereLabel(
                                            caseItem.matiere
                                              ? caseItem.matiere
                                              : caseItem.numMatiere
                                          )}
                                        </p>
                                        <p>
                                          {getProfLabel(
                                            caseItem.professeur
                                              ? caseItem.professeur
                                              : ""
                                          )}
                                        </p>
                                        <p>
                                          {getSalleLabel(
                                            caseItem.salle
                                              ? caseItem.salle
                                              : caseItem.numSalle
                                          )}
                                        </p>
                                      </span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-2">
                  <img
                    src="/Icons/plus.png"
                    alt="Ajouter une ligne"
                    className="w-8 cursor-pointer"
                    onClick={() => {
                      ajouterNouveauLigne("ligne");
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto w-full bg-white rounded-lg">
                <table className="min-w-[750px] w-full text-sm border border-black">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th className="border-2 border-t-white py-6 border-l-white"></th>
                      {objectEdt.donnee.contenu.map((ligne, j) => (
                        <th
                          key={j}
                          className="border bg-blue-500 text-white text-center relative"
                        >
                          {formatHeure(ligne.Horaire.heureDebut)} -{" "}
                          {formatHeure(ligne.Horaire.heureFin)}
                          <img
                            src="/Icons/modifier.png"
                            alt=""
                            className="absolute bottom-2 right-1 w-5 cursor-pointer"
                            onClick={() => {
                              setCaseSelectionne({ colonneIndex: j });
                              setFormHoraire({
                                heureDebut: verifierHeure(
                                  ligne.Horaire.heureDebut
                                ),
                                heureFin: verifierHeure(ligne.Horaire.heureFin),
                              });
                              setIsOpenHours(true);
                            }}
                          />
                          {j > 0 && (
                            <button
                              className="absolute top-2 right-10 text-red-600"
                              onClick={() => {
                                setObjectEdt((prev) => ({
                                  ...prev,
                                  donnee: {
                                    ...prev.donnee,
                                    contenu: prev.donnee.contenu.filter(
                                      (_, index) => index !== j
                                    ),
                                  },
                                }));
                              }}
                            >
                              <img
                                src="/Icons/retirer.png"
                                alt="Retirer"
                                className="w-5 cursor-pointer"
                              />
                            </button>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(objectEdt.donnee.contenu[0])
                      .filter((key) => key !== "Horaire")
                      .map((jour, i) => (
                        <tr key={i}>
                          <td className="border p-2 text-center font-semibold bg-gray-50 w-32 min-w-[20px] max-w-[120px]">
                            {jour}
                          </td>
                          {objectEdt.donnee.contenu.map((colonne, j) => (
                            <td
                              key={j}
                              className="border cursor-pointer min-h-32 min-w-[120px] relative"
                            >
                              <div className="flex flex-row justify-start items-center w-full h-full">
                                {colonne[jour]?.map((caseItem, index, arr) => (
                                  <div
                                    key={index}
                                    className={`p-2 flex flex-col h-full relative
                                      ${
                                        index < arr.length - 1
                                          ? "border-r border-dashed border-gray-300"
                                          : ""
                                      }
                                      hover:bg-gray-200 active:bg-gray-300 min-h-28`}
                                    style={{
                                      width: `${100 / arr.length}%`,
                                      minWidth: 120,
                                    }}
                                    onClick={async () => {
                                      if (!numNiveauParcours) {
                                        setAlertModal({
                                          ...alertModal,
                                          status: true,
                                          type: "alarm",
                                          message:
                                            "Le classe est vide ,Selectionner le d'abord!",
                                        });
                                      } else if (!objectStateEdt.date_debut) {
                                        setAlertModal({
                                          ...alertModal,
                                          status: true,
                                          type: "info",
                                          message:
                                            "Pour la verification de la disponibilité de la salle,selectionner le date du debut svp!",
                                        });
                                      } else if (
                                        !objectEdt.donnee.contenu[i].Horaire
                                          .heureDebut
                                      ) {
                                        setAlertModal({
                                          ...alertModal,
                                          status: true,
                                          type: "info",
                                          message:
                                            "Pour la verification de la disponibilité de la salle,entrer l' horaire!",
                                        });
                                      } else {
                                        setCaseSelectionne({
                                          jour,
                                          colIdx: j,
                                          crenauIdx: index,
                                        });
                                        const creneau =
                                          objectEdt.donnee.contenu[j][jour][
                                            index
                                          ];
                                        setFormCreneau({ ...creneau });
                                        await getDataSalle({
                                          date: formatDateToDDMMYYYY(
                                            objectStateEdt.date_debut
                                          ),
                                          heureDebut:
                                            objectEdt.donnee.contenu[i].Horaire
                                              .heureDebut,
                                          heureFin:
                                            objectEdt.donnee.contenu[i].Horaire
                                              .heureFin,
                                        });
                                        setIsOpenAdd(true);
                                      }
                                    }}
                                  >
                                    <span className="flex flex-col w-full relative">
                                      {(() => {
                                        const isValid =
                                          caseItem.classe &&
                                          caseItem.matiere &&
                                          caseItem.professeur &&
                                          caseItem.salle;
                                        return (
                                          isValid && (
                                            <img
                                              src="/Icons/supprimer.png"
                                              className="absolute right-1 w-4 hover:scale-125 transition-all duration-200"
                                              alt=""
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setObjectEdt((prev) => {
                                                  const newData = { ...prev };
                                                  newData.donnee.contenu[j][
                                                    jour
                                                  ][index] = {
                                                    classe: null,
                                                    matiere: null,
                                                    professeur: null,
                                                    salle: null,
                                                  };
                                                  return newData;
                                                });
                                              }}
                                            />
                                          )
                                        );
                                      })()}
                                      <span className="flex flex-col w-full">
                                        <p>{getClasseLabel(caseItem.classe)}</p>
                                        <p>
                                          {getMatiereLabel(caseItem.matiere)}
                                        </p>
                                        <p>
                                          {getProfLabel(caseItem.professeur)}
                                        </p>
                                        <p>{getSalleLabel(caseItem.salle)}</p>
                                      </span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-2">
                  <button
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                    onClick={() => {
                      ajouterNouveauLigne("colonne");
                    }}
                  >
                    <img
                      src="/Icons/plus.png"
                      alt="Ajouter une colonne"
                      className="w-5"
                    />
                    Ajouter une colonne
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default CreateNewEdt;
