import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../../Context/SidebarContext';
import Creatable from 'react-select/creatable';
import { useLocation } from 'react-router-dom';
import { parseISO, getDay, format, addDays, isAfter } from 'date-fns';
import axios from 'axios';

function EdtNew() {
  const location = useLocation();
  const initialEdt = location.state?.dataEdt || {};
  const [dataEdtState, setDataEdtState] = useState(initialEdt);
  const [isNewValue, setIsNewValue] = useState(false);
  const [isEditHours, setIsEditHours] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [listeMatiere, setListeMatiere] = useState([]);
  const [listeSalle, setListeSalle] = useState([]);
  const [listeClasse, setListeClasse] = useState([]);
  const [professeursFiltres, setProfesseursFiltres] = useState([]);
  const [listeClasseSelected, setListeClasseSelected] = useState([]);
  const [listeProfesseur, setlisteProfesseur] = useState([]);
  const [horaireError, setHoraireError] = useState("");
  const [formHoraire, setFormHoraire] = useState({ heureDebut: "", heureFin: "" });
  const { isReduire } = useSidebar();
  const [formCreneau, setFormCreneau] = useState({
    classe: null,
    matiere: null,
    professeur: null,
    salle: null,
  });
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [selectedCreneau, setSelectedCreneau] = useState(null);
  const [modele, setModele] = useState(1);
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const [horaires, setHoraires] = useState([{ id: 1, heure_debut: "", heure_fin: "" }]);
  const [error, setError] = useState({ status: false, composant: "", message: "" })
  const [dataNewEdt, setDataNewEdt] = useState(() => {
    const saved = localStorage.getItem("dataNewEdt");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { }
    }
    // Génère dynamiquement la première ligne selon le nombre de créneaux
    const nombreCreneaux = Math.max(2, listeClasse.length || 0);
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const ligneInitiale = {
      Horaire: { heureDebut: "", heureFin: "" }
    };
    jours.forEach(jour => {
      ligneInitiale[jour] = Array.from({ length: nombreCreneaux }, () => ({
        classe: null,
        matiere: null,
        professeur: null,
        salle: null
      }));
    });
    return {
      donnee: {
        titre: [
          { Lundi: "", Mardi: "", Mercredi: "", Jeudi: "", Vendredi: "", Samedi: "" },
          dataEdtState.niveau,
        ],

        contenu: [ligneInitiale]
      }
    };
  });
  useEffect(() => {
    // Ne fait rien si la liste est vide
    if (!listeClasse || listeClasse.length === 0) return;
    const nombreCreneaux = Math.max(2, listeClasse.length);
    setDataNewEdt(prev => {
      const newContenu = prev.donnee.contenu.map(ligne => {
        const newLigne = { ...ligne };
        Object.keys(newLigne)
          .filter(key => key !== "Horaire")
          .forEach(jour => {
            // Ajuste le nombre de créneaux pour chaque jour
            const anciens = newLigne[jour] || [];
            if (anciens.length < nombreCreneaux) {
              // Ajoute des créneaux vides si besoin
              newLigne[jour] = [
                ...anciens,
                ...Array.from({ length: nombreCreneaux - anciens.length }, () => ({
                  classe: null,
                  matiere: null,
                  professeur: null,
                  salle: null
                }))
              ];
            } else if (anciens.length > nombreCreneaux) {
              // Coupe si trop de créneaux
              newLigne[jour] = anciens.slice(0, nombreCreneaux);
            }
          });
        return newLigne;
      });
      return {
        ...prev,
        donnee: {
          ...prev.donnee,
          contenu: newContenu
        }
      };
    });
  }, [listeClasse]);

  useEffect(() => {

    const handleBeforeUnload = (e) => {
      if (localStorage.getItem("dataNewEdt")) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);




  useEffect(() => {
    if (!dataEdtState.date_debut || !dataEdtState.date_fin) return;

    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const dateDebut = parseISO(dataEdtState.date_debut);
    const dateFin = parseISO(dataEdtState.date_fin);

    const titreDates = {};
    jours.forEach((jour, idx) => {
      const currentDate = addDays(dateDebut, idx);
      titreDates[jour] = currentDate <= dateFin ? format(currentDate, "dd-MM-yyyy") : "";
    });

    setDataNewEdt(prev => ({
      ...prev,
      donnee: {
        ...prev.donnee,
        titre: [
          titreDates,
          prev.donnee.titre?.[1] ?? dataEdtState.niveau
        ]
      }
    }));
  }, [dataEdtState.date_debut, dataEdtState.date_fin]);
  
  useEffect(() => {
    if (dataEdtState.action === "edit") {
      setDataEdtState({ ...dataEdtState, niveau: dataNewEdt.donnee.titre[1], })
    }
  }, [dataNewEdt])
  useEffect(() => {
    if (!formCreneau.matiere) {
      setProfesseursFiltres([]);
      return;
    }
    setProfesseursFiltres(
      listeProfesseur.filter((prof) =>
        Array.isArray(prof.matieres) &&
        prof.matieres.some((m) => m.numMatiere === formCreneau.matiere)
      )
    );
  }, [formCreneau.matiere, listeProfesseur]);
  const handleClickCreneau = (horaireIdx, jour, creneauIdx) => {
    setSelectedCreneau({ horaireIdx, jour, creneauIdx });
    setIsNewValue(true); // Ouvre le modal
  };
  const versGeneral = () => {
    if (localStorage.getItem("dataNewEdt")) {
      if (window.confirm("Des données non sauvegardées existent. Voulez-vous vraiment quitter ?")) {
        localStorage.removeItem("dataNewEdt");
        setDataNewEdt({
          donnee: {
            titre: [
              { Lundi: "", Mardi: "", Mercredi: "", Jeudi: "", Vendredi: "", Samedi: "" },
              dataEdtState.niveau,
            ],
            contenu: [
              {
                Horaire: { heureDebut: "", heureFin: "" },
                Lundi: [{ classe: null, matiere: null, professeur: null, salle: null }, { classe: null, 7: null, professeur: null, salle: null }],
                Mardi: [{ classe: null, matiere: null, professeur: null, salle: null }, { classe: null, matiere: null, professeur: null, salle: null }],
                Mercredi: [{ classe: null, matiere: null, professeur: null, salle: null }, { classe: null, matiere: null, professeur: null, salle: null }],
                Jeudi: [{ classe: null, matiere: null, professeur: null, salle: null }, { classe: null, matiere: null, professeur: null, salle: null }],
                Vendredi: [{ classe: null, matiere: null, professeur: null, salle: null }, { classe: null, matiere: null, professeur: null, salle: null }],
                Samedi: [{ classe: null, matiere: null, professeur: null, salle: null }, { classe: null, matiere: null, professeur: null, salle: null }]
              }
            ]
          }
        });
        navigate('/edt');
      }
    } else {
      navigate('/edt');
    }
  };

  const versAFfichage = () => {
    if (localStorage.getItem("dataNewEdt")) {
      if (window.confirm("Des données non sauvegardées existent. Voulez-vous vraiment quitter ?")) {
        localStorage.removeItem("dataNewEdt");
        setDataNewEdt({
          donnee: {
            titre: [
              { Lundi: "", Mardi: "", Mercredi: "", Jeudi: "", Vendredi: "", Samedi: "" },
              dataEdtState.niveau,
            ],
            contenu: [
              {
                Horaire: { heureDebut: "", heureFin: "" },
                Lundi: [{ classe: null, matiere: null, professeur: null, salle: null }, { classe: null, matiere: null, professeur: null, salle: null }],
                Mardi: [{ classe: null, matiere: null, professeur: null, salle: null }, { classe: null, matiere: null, professeur: null, salle: null }],
                Mercredi: [{ classe: null, matiere: null, professeur: null, salle: null }, { classe: null, matiere: null, professeur: null, salle: null }],
                Jeudi: [{ classe: null, matiere: null, professeur: null, salle: null }, { classe: null, matiere: null, professeur: null, salle: null }],
                Vendredi: [{ classe: null, matiere: null, professeur: null, salle: null }, { classe: null, matiere: null, professeur: null, salle: null }],
                Samedi: [{ classe: null, matiere: null, professeur: null, salle: null }, { classe: null, matiere: null, professeur: null, salle: null }]
              }
            ]
          }
        });
        navigate('/edt/affichage-edt');
      }
    } else {
      navigate('/edt/affichage-edt');
    }
  };
  const versCreationEdt = () => navigate('/edt/nouveau-edt');

  const ajouterColonne = () => {
    const horaireVide = dataNewEdt.donnee.contenu.some(
      l => !l.Horaire.heureDebut || !l.Horaire.heureFin
    );
    if (horaireVide) {
      alert("Veuillez d'abord remplir tous les horaires existants avant d'ajouter une nouvelle colonne.");
      return;
    }
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const nouvelleLigne = {
      Horaire: {
        heureDebut: "",
        heureFin: ""
      }
    };

    jours.forEach(jour => {
      nouvelleLigne[jour] = Array.from({ length: nombreCreneaux }, () => ({
        classe: null,
        matiere: null,
        professeur: null,
        salle: null
      }));
    });

    setDataNewEdt(prev => ({
      ...prev,
      donnee: {
        ...prev.donnee,
        contenu: [...prev.donnee.contenu, nouvelleLigne]
      }
    }));
  };
  function formatHeure(heureStr) {
    if (!heureStr && heureStr !== 0) return "";
    // Si c'est un nombre, on le convertit en string format "08:00"
    if (typeof heureStr === "number") {
      return `${heureStr}h`;
    }
    if (typeof heureStr === "string") {
      const [h, m] = heureStr.split(":");
      return m === "00" ? `${parseInt(h, 10)}h` : `${parseInt(h, 10)}h:${m}`;
    }
    return "";
  }

  const handleStartDateChange = (e) => {
    let selected = parseISO(e.target.value);
    const day = getDay(selected);
    let errorMessage = "";

    if (day === 6) {
      selected = addDays(selected, 2);
      errorMessage = "Le samedi n’est pas autorisé. La date a été ajustée au lundi suivant.";
    } else if (day === 0) {
      selected = addDays(selected, 1);
      errorMessage = "Le dimanche n’est pas autorisé. La date a été ajustée au lundi suivant.";
    }

    const correctedStart = format(selected, "yyyy-MM-dd");
    const dayOfWeek = getDay(selected);
    const daysUntilSaturday = 6 - dayOfWeek;
    const suggestedEnd = addDays(selected, daysUntilSaturday);
    const correctedEnd = format(suggestedEnd, "yyyy-MM-dd");

    setDataEdtState({
      ...dataEdtState,
      date_debut: correctedStart,
      date_fin: correctedEnd,
    });

    if (errorMessage) {
      setError({ status: true, composant: "date_debut", message: errorMessage });
    } else {
      setError({ ...error, status: false });
    }
  };
  const handleEndDateChange = (e) => {
    const chosenEnd = parseISO(e.target.value);
    const start = parseISO(dataEdtState.date_debut);

    const dayOfWeek = getDay(start);
    const maxEnd = addDays(start, 6 - dayOfWeek);

    if (isAfter(chosenEnd, maxEnd)) {
      setError({
        status: true,
        composant: "date_fin",
        message: "La date de fin ne peut pas dépasser le samedi suivant la date de début.",
      });
      return;
    }

    setDataEdtState({ ...dataEdtState, date_fin: e.target.value });
    setError({ ...error, status: false });
  };
  function normalizeContenu(contenu, nombreCreneaux) {
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return contenu.map(ligne => {
      const newLigne = { ...ligne };
      jours.forEach(jour => {
        const anciens = newLigne[jour] || [];
        if (anciens.length < nombreCreneaux) {
          newLigne[jour] = [
            ...anciens,
            ...Array.from({ length: nombreCreneaux - anciens.length }, () => ({
              classe: null,
              matiere: null,
              professeur: null,
              salle: null
            }))
          ];
        } else if (anciens.length > nombreCreneaux) {
          newLigne[jour] = anciens.slice(0, nombreCreneaux);
        }
      });
      return newLigne;
    });
  }

  const getDataClasse = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/classe/niveau-parcours/${dataEdtState.niveau}`);
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setListeClasse(response.data);

    } catch (error) {
      console.error(error.message);
    }
  };
  const sendData = async () => {
    const contenuNettoye = dataNewEdt.donnee.contenu.map(ligne => {
      const nouvelleLigne = {
        Horaire: { ...ligne.Horaire },
      };

      // Pour chaque jour (Lundi, Mardi, etc.)
      Object.keys(ligne).forEach(jour => {
        if (jour === "Horaire") return;

        nouvelleLigne[jour] = ligne[jour].map(creneau => {
          const estVide = Object.values(creneau).every(val => val === null);
          return estVide ? {} : creneau;
        });
      });

      return nouvelleLigne;
    });

    const dataToSend = {
      donnee: {
        ...dataNewEdt.donnee,
        contenu: contenuNettoye,
      },
    };
    // console.log(dataToSend);

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/edt/ajouter/liste/`, dataToSend);
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      getDataClasse()
      getDataSalle();
      getDataMatiere();
      getDataProfesseurs();
      return true;
    } catch (error) {
      console.error(error.response.data);
      return false;
    }
  }
  const getDataClasseSelected = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/niveau-parcours/${id}`);
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setListeClasseSelected(response.data);

    } catch (error) {
      console.error(error.response.data);
    }
  };
  const getDataSalle = async () => {

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/salle/");
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setListeSalle(response.data);

    } catch (error) {
      console.error(error.message);
    }
  };
  const getDataMatiere = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/matiere/niveau-parcours/${dataEdtState.niveau}`);
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setListeMatiere(response.data)
    } catch (error) {
      console.error(error.message);
    }
  };
  const getDataProfesseurs = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/professeur/niveau-parcours/${dataEdtState.niveau}`);
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setlisteProfesseur(response.data);
    } catch (error) {
      if (error.response) {
        console.error("Erreur du serveur :", error.response.data)
      } else {
        console.error("Erreur inconnue :", error.message)
      }
    }
  };
  const getDataEdit = async () => {
    const formdata = new FormData();
    if (Array.isArray(dataEdtState.numEdtUpdate)) {
      dataEdtState.numEdtUpdate.forEach((val) => {
        formdata.append('numEdts[]', parseInt(val));
      });
    }
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/edt/modifier/donnee/`, formdata);
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setDataNewEdt(response.data);
      // console.log(response.data)
    } catch (error) {
      if (error.response) {
        console.error("Erreur du serveur :", error.response.data)
      } else {
        console.error("Erreur inconnue :", error.message)
      }
    }
  }
  useEffect(() => {
    if (dataEdtState.niveau) {
      getDataClasse()
      getDataSalle();
      getDataMatiere();
      getDataProfesseurs();
    }
  }, [dataEdtState.niveau])
  useEffect(() => {
    if (dataEdtState.action === "edit") {
      // setDataEdtState({ ...dataEdtState})
      getDataEdit();

    }
  }, [])
  useEffect(() => {
    if (dataEdtState.action === "edit" && dataNewEdt.donnee?.contenu) {
      setDataNewEdt(prev => ({
        ...prev,
        donnee: {
          ...prev.donnee,
          contenu: normalizeContenu(prev.donnee.contenu, Math.max(2, listeClasse.length))
        }
      }));
    }
  }, [dataNewEdt, listeClasse.length]);
  useEffect(() => {
    getDataClasseSelected(dataEdtState.action != "edit" ? dataEdtState.niveau : dataNewEdt.donnee.titre[1]);
  }, [dataEdtState.niveau]);

  useEffect(() => {
    const { date_debut, date_fin, ...cleaned } = dataNewEdt;
    localStorage.setItem("dataNewEdt", JSON.stringify(cleaned));
  }, [dataNewEdt]);


  useEffect(() => {
    const saved = localStorage.getItem("dataNewEdt");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const { date_debut, date_fin, ...cleaned } = parsed;
        localStorage.setItem("dataNewEdt", JSON.stringify(cleaned));
      } catch { }
    }
  }, []);

  const optionsClasse = listeClasse
    .map((Classe) => {
      const parcoursLabels = Array.isArray(Classe.parcours)
        ? Classe.parcours.map(p =>
          p.codeParcours
            ? p.codeParcours
            : p.nomParcours
              ? `-${p.nomParcours}-`
              : ""
        ).join(" / ")
        : "";

      return {
        value: Classe.numClasse,
        label:
          Classe.niveau +
          parcoursLabels +
          (Classe.groupe ? Classe.groupe.toString().split(" ").slice(1).join(" ") : ""),
      };
    });
  // ...existing code...
  const nombreCreneaux = Math.max(2, listeClasse.length);
  // ...existing code...
  const optionsProfesseur = listeProfesseur
    .sort((a, b) => a.nomProfesseur.localeCompare(b.nomProfesseur))
    .map((Professeur) => ({
      value: Professeur.numProfesseur,
      label: `${Professeur.sexe === "Masculin" ? 'Mr' : 'Mme'} ` +
        (Professeur.nomCourant
          ? Professeur.nomCourant
          : Professeur.prenomProfesseur
            ? Professeur.prenomProfesseur
            : Professeur.nomProfesseur)
    }));
  const optionsSalle = listeSalle
    .filter(Salle => Salle.status = true)
    .filter((Salle, index, self) =>
      index === self.findIndex((c) => c.nomSalle === Salle.nomSalle)
    )
    .map((Salle) => ({
      value: Salle.numSalle,
      label: Salle.nomSalle,
    }));

  const optionsMatiere = listeMatiere.sort((a, b) => a.nomMatiere.localeCompare(b.nomMatiere))
    .map((Matiere) => ({
      value: Matiere.numMatiere,
      label: Matiere.nomMatiere ? Matiere.nomMatiere : (Matiere.codeMatiere ? ` (${Matiere.codeMatiere})` : ""),
    }));
  const getClasseLabel = (numClasse) => {
    const found = listeClasse.find(c => c.numClasse === numClasse);
    if (!found) return "";
    const parcours = Array.isArray(found.parcours) && found.parcours.length > 0 ? found.parcours[0] : {};
    return (
      found.niveau +
      (parcours.codeParcours
        ? parcours.codeParcours
        : parcours.nomParcours
          ? `-${parcours.nomParcours}-`
          : ""
      ) +
      (found.groupe ? found.groupe.toString().split(" ").slice(1).join(" ") : "")
    );
  };

  const getMatiereLabel = (numMatiere) => {
    const found = listeMatiere.find(m => m.numMatiere === numMatiere);
    return found ? (found.codeMatiere || found.nomMatiere || "") : "";
  };

  const getProfLabel = (numProfesseur) => {
    const found = listeProfesseur.find(p => p.numProfesseur === numProfesseur);
    if (!found) return "";
    return (found.nomCourant
      ? found.nomCourant
      : found.prenomProfesseur
        ? found.prenomProfesseur
        : found.nomProfesseur);
  };

  const getSalleLabel = (numSalle) => {
    const found = listeSalle.find(s => s.numSalle === numSalle);
    return found ? found.nomSalle : "";
  };
  return (
    <>
      {/* Modal de création */}
      {(isNewValue) && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center">
          <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[95%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-blue-600 text-xl font-bold">
                {selectedCell?.jour}{" "}
                {selectedCell
                  ? `${formatHeure(dataNewEdt.donnee.contenu[selectedCell.ligneIdx]?.Horaire.heureDebut)} - ${formatHeure(dataNewEdt.donnee.contenu[selectedCell.ligneIdx]?.Horaire.heureFin)}`
                  : ""}
              </h1>
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsNewValue(false);
                  setSelectedCell(null);
                  setFormError("");
                }}
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Classe</label>
              <Creatable
                isClearable
                isValidNewOption={() => false}
                placeholder="Choisir le classe"
                options={optionsClasse}
                onChange={(selectedOption) => {
                  setFormCreneau(prev => ({
                    ...prev,
                    classe: selectedOption ? selectedOption.value : null
                  }));
                }}
                value={optionsClasse.find(option => option.value === formCreneau.classe) || null}
                className="text-sm"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Matiere</label>
              <Creatable
                isClearable
                isValidNewOption={() => false}
                placeholder="Choisir le matiere"
                options={optionsMatiere}
                onChange={(selectedOption) => {
                  setFormCreneau(prev => ({
                    ...prev,
                    matiere: selectedOption ? selectedOption.value : null,
                    professeur: null,
                  }));
                }}
                value={optionsMatiere.find(option => option.value === formCreneau.matiere) || null}
                className="text-sm"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Professeur</label>
              <Creatable
                isClearable
                isValidNewOption={() => false}
                placeholder="Choisir le professeur"
                options={professeursFiltres.map((Professeur) => ({
                  value: Professeur.numProfesseur,
                  label: `${Professeur.sexe === "Masculin" ? 'Mr' : 'Mme'} ` +
                    (Professeur.nomCourant
                      ? Professeur.nomCourant
                      : Professeur.prenomProfesseur
                        ? Professeur.prenomProfesseur
                        : Professeur.nomProfesseur)
                }))}
                onChange={(selectedOption) => {
                  setFormCreneau(prev => ({
                    ...prev,
                    professeur: selectedOption ? selectedOption.value : null
                  }));
                }}
                value={
                  professeursFiltres
                    .map((Professeur) => ({
                      value: Professeur.numProfesseur,
                      label: `${Professeur.sexe === "Masculin" ? 'Mr' : 'Mme'} ` +
                        (Professeur.nomCourant
                          ? Professeur.nomCourant
                          : Professeur.prenomProfesseur
                            ? Professeur.prenomProfesseur
                            : Professeur.nomProfesseur)
                    }))
                    .find((option) => option.value === formCreneau.professeur) || null
                }
                className="text-sm"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="font-semibold text-sm mb-1">Salle</label>
              <Creatable
                isClearable
                isValidNewOption={() => false}
                placeholder="Choisir le salle"
                options={optionsSalle}
                onChange={(selectedOption) => {
                  setFormCreneau(prev => ({
                    ...prev,
                    salle: selectedOption ? selectedOption.value : null
                  }));
                }}
                value={optionsSalle.find(option => option.value === formCreneau.salle) || null}
                className="text-sm"
              />

            </div>
            {formError && <div className="text-red-600 text-sm mb-2">{formError}</div>}
            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  // Vérification des champs vides
                  if (!formCreneau.classe || !formCreneau.matiere || !formCreneau.professeur || !formCreneau.salle) {
                    setFormError("Tous les champs sont obligatoires.");
                    return;
                  }

                  // Récupère l'index selon le modèle
                  const idx = modele === 1 ? selectedCell?.ligneIdx : selectedCell?.colIdx;
                  const jour = selectedCell?.jour;
                  const creneauIdx = selectedCell?.creneauIdx ?? 0;

                  // Sécurité : vérifie que tout existe
                  if (
                    typeof idx !== "number" ||
                    !jour ||
                    !dataNewEdt.donnee.contenu[idx] ||
                    !Array.isArray(dataNewEdt.donnee.contenu[idx][jour])
                  ) {
                    setFormError("Erreur interne : impossible de trouver la case à modifier.");
                    return;
                  }


                  const autresCreneaux = dataNewEdt.donnee.contenu[idx][jour].filter((_, i) => i !== creneauIdx);
                  if (autresCreneaux.some(c => c.classe === formCreneau.classe)) {
                    setFormError("Les deux créneaux d'un même jour/heure ne peuvent pas avoir la même classe.");
                    return;
                  } else if (autresCreneaux.some(c => c.salle === formCreneau.salle)) {
                    setFormError("Les deux créneaux d'un même jour/heure ne peuvent pas avoir la même salle.");
                    return;
                  } else if (autresCreneaux.some(c => c.professeur === formCreneau.professeur)) {
                    setFormError("Les deux créneaux d'un même jour/heure ne peuvent pas avoir le même professeur.");
                    return;
                  }

                  setFormError("");
                  setDataNewEdt(prev => {
                    const newData = { ...prev };
                    newData.donnee.contenu[idx][jour][creneauIdx] = { ...formCreneau };
                    return newData;
                  });
                  setIsNewValue(false);
                  setSelectedCell(null);
                }}
              >
                VALIDER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition des heures */}
      {(isEditHours) && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center">
          <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[95%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-blue-600 text-xl font-bold">Horaire</h1>
              <img
                src="/Icons/annuler.png"
                alt="Quitter"
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsEditHours(false);
                  setHoraireError("");
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm mb-1">Heure de début</label>
              <input
                type="time"
                className='border p-2'
                value={formHoraire.heureDebut}
                onChange={e => setFormHoraire(prev => ({ ...prev, heureDebut: e.target.value }))}
              />
              <label className="font-semibold text-sm mb-1" >Heure de fin</label>
              <input
                type="time"
                className='border p-2'
                value={formHoraire.heureFin}
                onChange={e => setFormHoraire(prev => ({ ...prev, heureFin: e.target.value }))}
              />
            </div>
            {horaireError && <div className="text-red-600 text-sm mb-2">{horaireError}</div>}
            <div className="w-full flex justify-center">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700"
                onClick={() => {
                  if (!formHoraire.heureDebut || !formHoraire.heureFin) {
                    setHoraireError("Les deux champs sont obligatoires.");
                    return;
                  }
                  if (formHoraire.heureDebut >= formHoraire.heureFin) {
                    setHoraireError("L'heure de début doit être inférieure à l'heure de fin.");
                    return;
                  }

                  // Vérifie si l'horaire existe déjà (sauf la colonne en cours d'édition)
                  const idx = modele === 1 ? selectedCell.ligneIdx : selectedCell.colIdx;
                  const existe = dataNewEdt.donnee.contenu.some(
                    (l, i) =>
                      i !== idx &&
                      l.Horaire.heureDebut === formHoraire.heureDebut &&
                      l.Horaire.heureFin === formHoraire.heureFin
                  );
                  if (existe) {
                    setHoraireError("Cet horaire existe déjà dans le tableau.");
                    return;
                  }

                  // Vérifie si l'horaire ajouté est inférieur à un horaire déjà existant
                  const debutMinutes = parseInt(formHoraire.heureDebut.split(":")[0], 10) * 60 + parseInt(formHoraire.heureDebut.split(":")[1], 10);
                  const finMinutes = parseInt(formHoraire.heureFin.split(":")[0], 10) * 60 + parseInt(formHoraire.heureFin.split(":")[1], 10);
                  const conflit = dataNewEdt.donnee.contenu.some((l, i) => {
                    if (i === idx) return false;
                    const d = l.Horaire.heureDebut;
                    const f = l.Horaire.heureFin;
                    if (!d || !f) return false;
                    const dMin = parseInt(d.split(":")[0], 10) * 60 + parseInt(d.split(":")[1], 10);
                    const fMin = parseInt(f.split(":")[0], 10) * 60 + parseInt(f.split(":")[1], 10);
                    // Si le nouvel horaire commence avant ou finit avant un existant
                    return debutMinutes < dMin || finMinutes < fMin;
                  });
                  if (conflit) {
                    setHoraireError("L'horaire ajouté est inférieur à un horaire déjà existant.");
                    return;
                  }

                  setDataNewEdt(prev => {
                    const newData = { ...prev };
                    const idx = modele === 1 ? selectedCell.ligneIdx : selectedCell.colIdx;
                    if (typeof idx === "number" && newData.donnee.contenu[idx]) {
                      newData.donnee.contenu[idx].Horaire = { ...formHoraire };
                    }
                    return newData;
                  });
                  setHoraireError("");
                  setIsEditHours(false);
                }}
              >
                VALIDER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${isReduire ? "left-20" : "left-56"} fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}>
        <div className="flex flex-col gap-1 h-full">
          <div className='flex gap-3'>
            <button className='hover:scale-105 text-gray-500' onClick={versGeneral}>Géneral</button>
            <button className='font-bold hover:scale-105 text-blue-600'>Creation</button>
            <button className='hover:scale-105 text-gray-500' onClick={versAFfichage}>Affichage</button>
          </div>

          <div className="flex justify-between items-center ">
            <span className="text-blue-600 font-bold flex flex-row items-center z-50">Création EDT pour :
              <p className='ms-2'>
                {listeClasseSelected && listeClasseSelected.niveau
                  ? (
                    listeClasseSelected.niveau +
                    (
                      listeClasseSelected.numParcours
                        ? (listeClasseSelected.numParcours.codeParcours
                          ? listeClasseSelected.numParcours.codeParcours
                          : " - " + listeClasseSelected.numParcours.nomParcours
                        )
                        : ""
                    )
                  )
                  : ""
                }
              </p>
            </span>
            <div className="flex gap-2 items-center">
              <div className='flex items-center'>
                <p className='w-40'>Date début : </p>
                <input
                  type="date"
                  onChange={handleStartDateChange}
                  value={
                    dataEdtState.action === "edit"
                      ? (
                        dataNewEdt.donnee?.titre?.[0]?.Lundi &&
                          /^\d{2}-\d{2}-\d{4}$/.test(dataNewEdt.donnee.titre[0].Lundi)
                          ? format(parseISO(dataNewEdt.donnee.titre[0].Lundi.split('-').reverse().join('-')), "yyyy-MM-dd")
                          : ""
                      )
                      : (dataEdtState.date_debut || "")
                  }
                  className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
              <div className='flex items-center'>
                <p className='w-40'>Date fin : </p>
                <input
                  type="date"
                  onChange={handleEndDateChange}
                  value={
                    dataEdtState.action === "edit"
                      ? (
                        dataNewEdt.donnee?.titre?.[0]?.Lundi &&
                          /^\d{2}-\d{2}-\d{4}$/.test(dataNewEdt.donnee.titre[0].Lundi)
                          ? format(parseISO(dataNewEdt.donnee.titre[0].Samedi.split('-').reverse().join('-')), "yyyy-MM-dd")
                          : ""
                      )
                      : (dataEdtState.date_fin || "")
                  }
                  className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            </div>
            <button className="button"
              onClick={async () => {
                const horaireVide = dataNewEdt.donnee.contenu.some(
                  l => !l.Horaire.heureDebut || !l.Horaire.heureFin
                );
                if (horaireVide) {
                  alert("Veuillez remplir tous les horaires avant d'enregistrer.");
                } else {
                  const ok = await sendData();
                  if (ok) {
                    localStorage.removeItem("dataNewEdt");
                    versGeneral();
                  }
                }
              }}

            >Enregistrer</button>
          </div>

          {/* Tableau selon le modèle */}
          <div className="h-[73%] overflow-x-auto w-full m-4">
            {modele === 1 ? (
              <div className="w-full border border-white rounded-t-lg overflow-x-auto">
                <table className='border w-full text-sm border-black'>
                  <thead className='sticky top-0 z-10'>
                    <tr>
                      <th className="border-2 border-t-white border-l-white"></th>
                      {Object.keys(dataNewEdt.donnee.contenu[0])
                        .filter((key) => key !== "Horaire")
                        .map((jour) => (
                          <th key={jour} className="border px-2 py-3 text-center text-white bg-blue-500">
                            {jour}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataNewEdt.donnee.contenu.map((ligne, i) => (
                      <tr key={i}>
                        <td className="border-2 p-2 font-semibold relative  min-w-[120px]">
                          <span className="flex justify-center">
                            {formatHeure(ligne.Horaire.heureDebut)} - {formatHeure(ligne.Horaire.heureFin)}
                          </span>
                          <img src="/Icons/modifier.png" alt="" className="absolute bottom-2 right-1 w-5 cursor-pointer" onClick={() => {
                            setSelectedCell({ ligneIdx: i });
                            setFormHoraire({ ...dataNewEdt.donnee.contenu[i].Horaire });
                            setIsEditHours(true);
                          }} />
                          {i > 0 && (
                            <button
                              className="absolute top-2  right-16 text-red-600"
                              onClick={() => {
                                setDataNewEdt(prev => ({
                                  ...prev,
                                  donnee: {
                                    ...prev.donnee,
                                    contenu: prev.donnee.contenu.filter((_, idx) => idx !== i)
                                  }
                                }));
                              }}
                            >
                              <img src="/Icons/retirer.png" alt="" className="w-5 cursor-pointer" />
                            </button>
                          )}
                        </td>
                        {Object.keys(ligne)
                          .filter((key) => key !== "Horaire")
                          .map((jour) => (
                            <td key={jour} className="border-2 cursor-pointer h-24 relative" style={{ minWidth: ligne[jour].length * 120 }}>
                              <div className="flex flex-row justify-start items-center w-full h-full">
                                {ligne[jour].map((creneau, idx) => (
                                  <div
                                    key={idx}
                                    className={`p-2 flex flex-col h-full relative
                                    ${idx < ligne[jour].length - 1 ? "border-r border-dashed border-gray-300" : ""}
                                    hover:bg-gray-200 active:bg-gray-300`}
                                    style={{ width: `${100 / ligne[jour].length}%`, minWidth: 120 }}
                                    onClick={() => {
                                      setSelectedCell({ ligneIdx: i, jour, creneauIdx: idx });
                                      const creneau = dataNewEdt.donnee.contenu[i][jour][idx];
                                      setFormCreneau({ ...creneau });
                                      setIsNewValue(true);
                                    }}
                                  >
                                    <span className='flex flex-col w-full '>
                                      <span className='flex flex-col w-full'>
                                        <p>{getClasseLabel(creneau.classe ? creneau.classe : creneau.numClasse)}</p>
                                        <p>{getMatiereLabel(creneau.matiere ? creneau.matiere : creneau.numMatiere)}</p>
                                        <p>{getProfLabel(creneau.professeur ? creneau.professeur : "")}</p>
                                        <p>{getSalleLabel(creneau.salle ? creneau.salle : creneau.numSalle)}</p>
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
                    className='w-8 cursor-pointer'
                    onClick={ajouterColonne}
                  />
                </div>
              </div>
            ) : (
              < div className="overflow-x-auto w-full bg-white rounded-lg">
                <table className="min-w-[750px] w-full text-sm border border-black">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th className="border-2 border-t-white py-6 border-l-white"></th>
                      {dataNewEdt.donnee.contenu.map((ligne, j) => (
                        <th key={j} className="border bg-blue-500 text-white text-center relative">
                          {formatHeure(ligne.Horaire.heureDebut)} - {formatHeure(ligne.Horaire.heureFin)}
                          <img
                            src="/Icons/modifier.png"
                            alt=""
                            className="absolute bottom-2 right-1 w-5 cursor-pointer"
                            onClick={() => {
                              setSelectedCell({ colIdx: j });
                              setFormHoraire({
                                heureDebut: typeof ligne.Horaire.heureDebut === "string" && ligne.Horaire.heureDebut.includes(":")
                                  ? ligne.Horaire.heureDebut
                                  : ligne.Horaire.heureDebut
                                    ? String(ligne.Horaire.heureDebut).padStart(2, "0") + ":00"
                                    : "",
                                heureFin: typeof ligne.Horaire.heureFin === "string" && ligne.Horaire.heureFin.includes(":")
                                  ? ligne.Horaire.heureFin
                                  : ligne.Horaire.heureFin
                                    ? String(ligne.Horaire.heureFin).padStart(2, "0") + ":00"
                                    : "",
                              });
                              setIsEditHours(true);
                            }}
                          />
                          {j > 0 && (
                            <button
                              className="absolute top-2 right-10 text-red-600"
                              onClick={() => {
                                setDataNewEdt(prev => ({
                                  ...prev,
                                  donnee: {
                                    ...prev.donnee,
                                    contenu: prev.donnee.contenu.filter((_, idx) => idx !== j)
                                  }
                                }));
                              }}
                            >
                              <img src="/Icons/retirer.png" alt="Retirer" className="w-5 cursor-pointer" />
                            </button>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {jours.map((jour, i) => (
                      <tr key={i} className="transition">
                        <td className="border p-2 text-center font-semibold bg-gray-50 w-32 min-w-[20px] max-w-[120px]">
                          {jour}
                        </td>
                        {dataNewEdt.donnee.contenu.map((ligne, j) => (
                          <td key={j} className="border cursor-pointer min-h-32 min-w-[120px] relative">
                            <div className="flex flex-row justify-start items-center w-full h-full">
                              {ligne[jour]?.map((creneau, idx, arr) => (
                                <div
                                  key={idx}
                                  className={`p-2 flex flex-col h-full relative
            ${idx < arr.length - 1 ? "border-r border-dashed border-gray-300" : ""}
            hover:bg-gray-200 active:bg-gray-300 min-h-28`}
                                  style={{
                                    width: `${100 / arr.length}%`,
                                    minWidth: 120
                                  }}
                                  onClick={() => {
                                    setSelectedCell({ jour, colIdx: j, creneauIdx: idx });
                                    setFormCreneau({ ...creneau });
                                    setIsNewValue(true);
                                  }}
                                >
                                  <span className="flex flex-col w-full">
                                    <span className="flex flex-col w-full">
                                      <p>{getClasseLabel(creneau.classe)}</p>
                                      <p>{getMatiereLabel(creneau.matiere)}</p>
                                      <p>{getProfLabel(creneau.professeur)}</p>
                                      <p>{getSalleLabel(creneau.salle)}</p>
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
                      const horaireVide = dataNewEdt.donnee.contenu.some(
                        l => !l.Horaire.heureDebut || !l.Horaire.heureFin
                      );
                      if (horaireVide) {
                        alert("Veuillez d'abord remplir tous les horaires existants avant d'ajouter une nouvelle colonne.");
                        return;
                      }
                      setHoraires([...horaires, { heure_debut: null, heure_fin: null }]);
                      setDataNewEdt(prev => ({
                        ...prev,
                        donnee: {
                          ...prev.donnee,
                          contenu: [
                            ...prev.donnee.contenu,
                            {
                              Horaire: { heureDebut: "", heureFin: "" },
                              ...Object.fromEntries(jours.map(jour => [
                                jour,
                                Array.from({ length: Math.max(2, listeClasse.length) }, () => ({
                                  classe: null,
                                  matiere: null,
                                  professeur: null,
                                  salle: null
                                }))
                              ]))
                            }
                          ]
                        }
                      }));
                    }}
                  >
                    <img src="/Icons/plus.png" alt="Ajouter une colonne" className="w-5" />
                    Ajouter une colonne
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div >
    </>
  );
}

export default EdtNew;
