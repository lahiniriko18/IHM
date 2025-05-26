import React, { useEffect, useState } from 'react'
import { useSidebar } from '../../Context/SidebarContext';
import Creatable from 'react-select/creatable';
import axios from 'axios';
import { startOfWeek, addDays, format, parseISO } from "date-fns";
import { useLocation, useNavigate } from 'react-router-dom';

function CreateNewEdt() {
  const { isReduire } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const [modele, setModele] = useState(1);
  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [isOpenHours, setIsOpenHours] = useState(false)
  const [horaireError, setHoraireError] = useState("");
  const initialStateEdt = location.state?.objectStateEdt || {}
  const [objectStateEdt, setObjectStateEdt] = useState(initialStateEdt)
  const [numNiveauParcours, setNumNiveauParcours] = useState(null)
  const [listeMatiere, setListeMatiere] = useState([]);
  const [listeSalle, setListeSalle] = useState([]);
  const [listeClasse, setListeClasse] = useState([]);
  const [niveauSelected, setNiveauSelected] = useState([]);
  const [listeProfesseur, setlisteProfesseur] = useState([]);
  const [professeursFiltres, setProfesseursFiltres] = useState([]);
  const [formError, setFormError] = useState("");
  const [date, setDate] = useState({ date_debut: "", date_fin: "" })
  const [formHoraire, setFormHoraire] = useState({ heureDebut: "", heureFin: "" });
  const [formCreneau, setFormCreneau] = useState({
    classe: null,
    matiere: null,
    professeur: null,
    salle: null,
  });
  const [caseSelectionne, setCaseSelectionne] = useState(null)
  const [objectEdt, setObjectEdt] = useState(() => {
    const nombreCase = Math.max(2, listeClasse.lenght || 0)
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const ligneInitiale = {
      Horaire: { heureDebut: "", heureFin: "" }
    };
    jours.forEach(jour => {
      ligneInitiale[jour] = Array.from({ length: nombreCase }, () => ({
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
          numNiveauParcours ? numNiveauParcours : objectStateEdt.niveau,
        ],

        contenu: [ligneInitiale]
      }
    };
  })

  //API
  const getDataClasse = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/classe/niveau-parcours/${numNiveauParcours}`);
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setListeClasse(response.data);

    } catch (error) {
      console.error(error.message);
    }
  };
  const getNiveau = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/niveau-parcours/${numNiveauParcours}`);
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setNiveauSelected(response.data);

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
      const response = await axios.get(`http://127.0.0.1:8000/api/matiere/niveau-parcours/${numNiveauParcours}`);
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
      const response = await axios.get(`http://127.0.0.1:8000/api/professeur/niveau-parcours/${numNiveauParcours}`);
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
  const sendData = async () => {
    const contenuNettoye = objectEdt.donnee.contenu.map(ligne => {
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
        ...objectEdt.donnee,
        contenu: contenuNettoye,
      },
    };
    console.log(dataToSend);
    // try {
    //   const response = await axios.post(`http://127.0.0.1:8000/api/edt/ajouter/liste/`, dataToSend);
    //   if (response.status !== 200) {
    //     throw new Error('Erreur code : ' + response.status);
    //   }
    //   getDataClasse()
    //   getDataSalle();
    //   getDataMatiere();
    //   getDataProfesseurs();
    //   return true;
    // } catch (error) {
    //   console.error(error.response.data);
    //   return false;
    // }
  }
  //Fin de l'API



  //Function & Code ankoatrin'ny api & useffect 

  // Navigation 
  const versGeneral = () => {
    navigate('/edt');
  };

  const versAFfichage = () => {
    navigate('/edt/affichage-edt');
  };
  const versCreationEdt = () => navigate('/edt/nouveau-edt');

  // Ajout de nouvelle ligne de donnéés
  const ajouterNouveauLigne = () => {
    const horaireVide = objectEdt.donnee.contenu.some(
      l => !l.Horaire.heureDebut || !l.Horaire.heureFin
    );
    if (horaireVide) {
      alert("Veuillez d'abord remplir tous les horaires existants avant d'ajouter une nouvelle colonne.");
      return;
    }
    const nombreCreneaux = Math.max(2, listeClasse.length || 0);
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

    setObjectEdt(prev => ({
      ...prev,
      donnee: {
        ...prev.donnee,
        contenu: [...prev.donnee.contenu, nouvelleLigne]
      }
    }));
  };

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


  //Recuper le nom d'une proprieté a partir de son id :

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

  // verification de l'heure debut et fin
  const verifierHeure = (heure) => {
    return (typeof heure === "string" && heure.includes(":")
      ? heure
      : heure
        ? String(heure).padStart(2, "0") + ":00"
        : "")
  }
  // Formater le date au bonne semaine 
  const formatDate = (date) => {
    const selectedDate = parseISO(date);
    const lundi = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const samedi = addDays(lundi, 5);
    setObjectStateEdt({ ...objectStateEdt, date_debut: format(lundi, "yyyy-MM-dd"), date_fin: format(samedi, "yyyy-MM-dd") })
  }
  const handleDateChange = (event) => {
    const selectedDate = parseISO(event.target.value);
    const lundi = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const samedi = addDays(lundi, 5);
    setObjectStateEdt({ ...objectStateEdt, date_debut: format(lundi, "yyyy-MM-dd"), date_fin: format(samedi, "yyyy-MM-dd") })
  };

  // Envoyer le donnée au django
  const envoyerDonnee = () => {
    const horaireVide = objectEdt.donnee.contenu.some(
      l => !l.Horaire.heureDebut || !l.Horaire.heureFin
    );
    if (horaireVide) {
      alert("Veuillez remplir tous les horaires avant d'enregistrer.");
    } else {
      const ok = sendData();
      if (ok) {
        versGeneral();
      }
    }
  }
  // Validation formulaire d'ajout  Creanau
  const ValidationCrenau = () => {
    // Vérification des champs vides
    if (!formCreneau.classe || !formCreneau.matiere || !formCreneau.professeur || !formCreneau.salle) {
      setFormError("Tous les champs sont obligatoires.");
      return;
    }

    // Récupère l'index selon le modèle
    const Index = modele === 1 ? caseSelectionne?.ligneIdx : caseSelectionne?.colonneIndex;
    const jour = caseSelectionne?.jour;
    const crenauIdx = caseSelectionne?.crenauIdx ?? 0;

    // Sécurité : vérifie que tout existe
    if (
      typeof Index !== "number" ||
      !jour ||
      !objectEdt.donnee.contenu[Index] ||
      !Array.isArray(objectEdt.donnee.contenu[Index][jour])
    ) {
      setFormError("Erreur interne : impossible de trouver la case à modifier.");
      return;
    }


    const autresCreneaux = objectEdt.donnee.contenu[Index][jour].filter((_, i) => i !== crenauIdx);
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
    setObjectEdt(prev => {
      const newData = { ...prev };
      newData.donnee.contenu[Index][jour][crenauIdx] = { ...formCreneau };
      return newData;
    });
    setIsOpenAdd(false);
    setCaseSelectionne(null);
  }

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
      setHoraireError("L'heure de début doit être inférieure à l'heure de fin.");
      return;
    }

    // Vérifie si l'horaire existe déjà (sauf la colonne en cours d'édition)
    const Index = modele === 1 ? caseSelectionne.ligneIdx : caseSelectionne.colonneIndex;
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
    // Vérifie si l'horaire ajouté est inférieur à un horaire déjà existant
    const debutMinutes = parseInt(formHoraire.heureDebut.split(":")[0], 10) * 60 + parseInt(formHoraire.heureDebut.split(":")[1], 10);
    const finMinutes = parseInt(formHoraire.heureFin.split(":")[0], 10) * 60 + parseInt(formHoraire.heureFin.split(":")[1], 10);
    const conflit = objectEdt.donnee.contenu.some((l, i) => {
      if (i === Index) return false;
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

    setObjectEdt(prev => {
      const newData = { ...prev };
      const Index = modele === 1 ? caseSelectionne.ligneIdx : caseSelectionne.colonneIndex;
      if (typeof Index === "number" && newData.donnee.contenu[Index]) {
        newData.donnee.contenu[Index].Horaire = { ...formHoraire };
      }
      return newData;
    });
    setHoraireError("");
    setIsOpenHours(false);
  }

  // ****Affichage dans le form 
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

  //useEffect

  // mi-inserer ny valeur ny titre 
  useEffect(() => {
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
    const lundi = parseISO(objectStateEdt.date_debut)
    const titre = {};
    jours.forEach((jour, index) => {
      const jourDate = addDays(lundi, index);
      titre[jour] = format(jourDate, "dd-MM-yyyy");
      setObjectEdt(prev => ({
        ...prev,
        donnee: {
          ...prev.donnee,
          titre: [
            titre,
            prev.donnee.titre?.[1] ?? numNiveauParcours
          ]
        }
      }));
    });
  }, [objectStateEdt.date_debut])
  // maka liste Rehetra a chaque changement num
  useEffect(() => {
    if (numNiveauParcours) {
      getDataClasse()
      getDataSalle()
      getDataMatiere()
      getDataProfesseurs()
      getNiveau()
    }
  }, [numNiveauParcours])
  //useffect qui change le valeur du prof chaque changement matiere
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
  // maka num niveau-parcours + date de debut et fin au premier rendu
  useEffect(() => {
    objectStateEdt.niveau ? setNumNiveauParcours(objectStateEdt.niveau) : null
    if (objectStateEdt.date_debut && objectStateEdt.date_fin) {
      formatDate(objectStateEdt.date_debut)
    }
  }, [])
  return (
    <>
      {
        (isOpenAdd) && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center">
            <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[95%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
              <div className="flex justify-between items-center w-full">
                <h1 className="text-blue-600 text-xl font-bold">
                  {caseSelectionne?.jour}{" "}
                  {caseSelectionne
                    ? `${formatHeure(objectEdt.donnee.contenu[caseSelectionne.ligneIdx]?.Horaire.heureDebut)} - ${formatHeure(objectEdt.donnee.contenu[caseSelectionne.ligneIdx]?.Horaire.heureFin)}`
                    : ""}
                </h1>
                <img
                  src="/Icons/annuler.png"
                  alt="Quitter"
                  onClick={() => {
                    setIsOpenAdd(false);
                    setCaseSelectionne(null)
                    setFormError("")
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
                    setFormCreneau(prev => ({
                      ...prev,
                      classe: selectedOption ? selectedOption.value : null
                    }));
                  }}
                  value={optionsClasse.find(option => option.value === formCreneau.classe) || null}
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
                    setFormCreneau(prev => ({
                      ...prev,
                      matiere: selectedOption ? selectedOption.value : null,
                      professeur: null,
                    }));
                  }}
                  value={optionsMatiere.find(option => option.value === formCreneau.matiere) || null}
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
                    setFormCreneau(prev => ({
                      ...prev,
                      salle: selectedOption ? selectedOption.value : null
                    }));
                  }}
                  value={optionsSalle.find(option => option.value === formCreneau.salle) || null}
                  placeholder="Choisir le salle"
                  className="text-sm"
                />
              </div>
              {formError && <div className="text-red-600 text-sm mb-2">{formError}</div>}
              <div className="w-full flex justify-center">
                <button
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                  onClick={() => {
                    ValidationCrenau()
                  }}
                >
                  VALIDER
                </button>
              </div>
            </div>
          </div>
        )
      }
      {
        (isOpenHours) && (
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
                <label className="font-semibold text-sm mb-1">Heure de début :</label>
                <input
                  type="time"
                  className='border p-2'
                  value={formHoraire.heureDebut}
                  onChange={e => setFormHoraire(prev => ({ ...prev, heureDebut: e.target.value }))}
                />
                <label className="font-semibold text-sm mb-1" >Heure de fin : </label>
                <input
                  type="time"
                  value={formHoraire.heureFin}
                  onChange={e => setFormHoraire(prev => ({ ...prev, heureFin: e.target.value }))}
                  className='border p-2'
                />
              </div>
              {horaireError && <div className="text-red-600 text-sm mb-2">{horaireError}</div>}
              <div className="w-full flex justify-center">
                <button className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700" onClick={() => {
                  validerHoraire()
                }}>
                  VALIDER
                </button>
              </div>
            </div>
          </div>
        )
      }

      <div className={`${isReduire ? "left-20" : "left-56"} fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}>
        <div className="flex flex-col gap-1 h-full">
          <div className='flex gap-3'>
            <button className='hover:scale-105 text-gray-500' onClick={versGeneral}>Géneral</button>
            <button className='font-bold hover:scale-105 text-blue-600' onClick={versCreationEdt}>Creation</button>
            <button className='hover:scale-105 text-gray-500' onClick={versAFfichage}>Affichage</button>

          </div>

          <div className="flex justify-between items-center ">
            <span className="text-blue-600 font-bold flex flex-row items-center z-50">
              Création EDT pour : <p className='ms-2'>
                {niveauSelected && niveauSelected.niveau
                  ? (
                    niveauSelected.niveau +
                    (
                      niveauSelected.numParcours
                        ? (niveauSelected.numParcours.codeParcours
                          ? niveauSelected.numParcours.codeParcours
                          : " - " + niveauSelected.numParcours.nomParcours
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
                <input type="date" value={objectStateEdt.date_debut || ""} onChange={handleDateChange} name="date_debut" id="date_debut" className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
              <div className='flex items-center'>
                <p className='w-40'>Date fin : </p>
                <input
                  type="date" value={objectStateEdt.date_fin || ""} readOnly onChange={() => setObjectStateEdt({ ...objectStateEdt, date_fin: e.target.value })} className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition" name='date_fin' id="date_fin"
                />
              </div>
            </div>

            <button className="button" onClick={envoyerDonnee}>Creer l'EDT</button>
          </div>
          <div className="h-[73%] overflow-x-auto w-full m-4">
            {
              modele === 1 ? (
                <div className="w-full border border-white rounded-t-lg overflow-x-auto">
                  <table className='border w-full text-sm border-black'>
                    <thead className='sticky top-0 z-10' >
                      <tr>
                        <th className="border-2 border-t-white border-l-white"></th>
                        {Object.keys(objectEdt.donnee.contenu[0]).filter(key => key !== 'Horaire').map((jour, index) => (
                          <th key={index} className="border px-2 py-3 text-center text-white bg-blue-500">
                            {jour}
                          </th>))}
                      </tr>
                    </thead>
                    <tbody>
                      {objectEdt.donnee.contenu.map((ligne, i) => (
                        <tr key={i}>
                          <td className="border-2 p-2 font-semibold relative  min-w-[120px]">
                            <span className="flex justify-center">
                              {formatHeure(ligne.Horaire.heureDebut)} - {formatHeure(ligne.Horaire.heureFin)}
                            </span>
                            <img src="/Icons/modifier.png" alt="" className="absolute bottom-2 right-1 w-5 cursor-pointer" onClick={() => {
                              setCaseSelectionne({ ligneIdx: i });
                              setFormHoraire({ ...objectEdt.donnee.contenu[i].Horaire });
                              setIsOpenHours(true);
                            }} />
                          </td>
                          {
                            Object.keys(ligne).filter(key => key !== 'Horaire').map((jour, j) => (
                              <td key={jour} className="border-2 cursor-pointer h-24 relative">
                                <div className="flex flex-row justify-start items-center w-full h-full" key={j}>
                                  {ligne[jour].map((caseItem, value) => (
                                    <div className={`p-2 flex flex-col h-full relative
                                    ${value < ligne[jour].length - 1 ? "border-r border-dashed border-gray-300" : ""}
                                    hover:bg-gray-200 active:bg-gray-300`}
                                      style={{ width: `${100 / ligne[jour].length}%`, minWidth: 120 }} key={value} onClick={() => {
                                        setCaseSelectionne({ ligneIdx: i, jour, crenauIdx: value });
                                        const creneau = objectEdt.donnee.contenu[i][jour][value];
                                        setFormCreneau({ ...creneau });
                                        setIsOpenAdd(true);
                                      }}>
                                      <span className='flex flex-col w-full '>
                                        <span className='flex flex-col w-full'>
                                          <p>{getClasseLabel(caseItem.classe ? caseItem.classe : caseItem.numClasse)}</p>
                                          <p>{getMatiereLabel(caseItem.matiere ? caseItem.matiere : caseItem.numMatiere)}</p>
                                          <p>{getProfLabel(caseItem.professeur ? caseItem.professeur : "")}</p>
                                          <p>{getSalleLabel(caseItem.salle ? caseItem.salle : caseItem.numSalle)}</p>
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
                      className='w-8 cursor-pointer' onClick={ajouterNouveauLigne} />

                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto w-full bg-white rounded-lg">
                  <table className="min-w-[750px] w-full text-sm border border-black">
                    <thead className="sticky top-0 z-10">
                      <tr>
                        <th className="border-2 border-t-white py-6 border-l-white"></th>
                        {
                          objectEdt.donnee.contenu.map((ligne, index) => (
                            <th key={j} className="border bg-blue-500 text-white text-center relative">{formatHeure(ligne.Horaire.heureDebut) - formatHeure(ligne.Horaire.heureFin)}
                              <img
                                src="/Icons/modifier.png"
                                alt=""
                                className="absolute bottom-2 right-1 w-5 cursor-pointer"
                                onClick={() => {
                                  setCaseSelectionne({ colonneIndex: index });
                                  setFormHoraire({
                                    heureDebut: verifierHeure(ligne.Horaire.heureDebut),
                                    heureFin: verifierHeure(ligne.Horaire.heureFin),
                                  });
                                  setIsOpenHours(true);
                                }}
                              />
                              {j > 0 && (
                                <button
                                  className="absolute top-2 right-10 text-red-600"
                                  onClick={() => {
                                    setObjectEdt(prev => ({
                                      ...prev,
                                      donnee: {
                                        ...prev.donnee,
                                        contenu: prev.donnee.contenu.filter((_, index) => index !== j)
                                      }
                                    }));
                                  }}
                                >
                                  <img src="/Icons/retirer.png" alt="Retirer" className="w-5 cursor-pointer" />
                                </button>
                              )}
                            </th>
                          ))
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {object.keys(objectEdt.donnee.contenu[0]).filter(key => key !== "Horaire").map((jour, i) => (
                        <tr>
                          <td key={i} className="border p-2 text-center font-semibold bg-gray-50 w-32 min-w-[20px] max-w-[120px]">
                            {jour}
                          </td>
                          {
                            objectEdt.donnee.contenu.map((colonne, j) => (
                              <td key={j} className="border cursor-pointer min-h-32 min-w-[120px] relative">
                                <div className="flex flex-row justify-start items-center w-full h-full">
                                  {
                                    colonne[jour]?.map((caseItem, index, arr) => (
                                      <div key={index} className={`p-2 flex flex-col h-full relative
                                      ${index < arr.length - 1 ? "border-r border-dashed border-gray-300" : ""}
                                      hover:bg-gray-200 active:bg-gray-300 min-h-28`}
                                        style={{
                                          width: `${100 / arr.length}%`,
                                          minWidth: 120
                                        }}
                                        onClick={() => {
                                          setCaseSelectionne({ jour, numLigne: j, colonneIndex: index });
                                          const creneau = objectEdt.donnee.contenu[i][jour][index];
                                          setFormCreneau({ ...creneau });
                                          setIsOpenAdd(true);
                                        }}
                                      >
                                        <span className="flex flex-col w-full">
                                          <span className="flex flex-col w-full">
                                            <p>{getClasseLabel(caseItem.classe)}</p>
                                            <p>{getMatiereLabel(caseItem.matiere)}</p>
                                            <p>{getProfLabel(caseItem.professeur)}</p>
                                            <p>{getSalleLabel(caseItem.salle)}</p>
                                          </span>
                                        </span>
                                      </div>
                                    ))
                                  }
                                </div>
                              </td>
                            ))
                          }
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end mt-2">
                    <button
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                    >
                      <img src="/Icons/plus.png" alt="Ajouter une colonne" className="w-5" onClick={ajouterNouveauLigne} />
                      Ajouter une colonne
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>

      </div>
    </>
  )
}

export default CreateNewEdt