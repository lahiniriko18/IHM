import React, { useEffect, useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { useSidebar } from '../../Context/SidebarContext';
import Creatable from 'react-select/creatable';
import { useLocation } from 'react-router-dom';
import { parseISO, getDay, format, addDays, isAfter } from 'date-fns';
import axios from 'axios';
import Professeur from '../Professeur';

function EdtNew() {
  const location = useLocation();
  const { dataEdt } = location.state || {};
  const [isNewValue, setIsNewValue] = useState(false);
  const [isEditHours, setIsEditHours] = useState(false);
  const [intervalHoraire, setIntervalHoraire] = useState(2);
  const [selectedCell, setSelectedCell] = useState(null);
  const [listeMatiere, setListeMatiere] = useState([]);
  const [listeSalle, setListeSalle] = useState([]);
  const [listeClasse, setListeClasse] = useState([]);
  const [professeursFiltres, setProfesseursFiltres] = useState([]);
  const [listeClasseSelected, setListeClasseSelected] = useState([]);
  const [listeProfesseur, setlisteProfesseur] = useState([]);
  const navigate = useNavigate();
  const [horaireError, setHoraireError] = useState("");
  const [formHoraire, setFormHoraire] = useState({ heureDebut: "", heureFin: "" });
  const { isReduire } = useSidebar();
  const [formCreneau, setFormCreneau] = useState({
    classe: null,
    matiere: null,
    professeur: null,
    salle: null,
  });
  const [formError, setFormError] = useState("");
  const [selectedCreneau, setSelectedCreneau] = useState(null);
  const [modele, setModele] = useState(1); // 1 = horaire en ligne ; 2 = horaire en colonne
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const [horaires, setHoraires] = useState([{ id: 1, heure_debut: 8, heure_fin: 10 }]);
  const [error, setError] = useState({ status: false, composant: "", message: "" })
  const [dataNewEdt, setDataNewEdt] = useState({
    donnee: {
      titre: [
        {
          lundi: "",/*date debut au lundi */
          mardi: "",/*date debut au lundi +1 */
          mercredi: "",/*date debut au lundi +3 */
          jeudi: "",
          vendredi: "",
          samedi: "",
        },
        {
          classe: {
            numClasse: null,
            niveau: "",
            groupe: ""
          },
          parcours: {
            numParcours: null,
            numMention: null,
            nomParcours: "",
            codeParcours: ""
          },
          constitue: true
        }
      ],
      contenu: [
        {
          Horaire: {
            heureDebut: "",
            heureFin: ""
          },
          Lundi: [
            {
              classe: null,
              matiere: null,
              professeur: null,
              salle: null
            },
            {
              classe: null,
              matiere: null,
              professeur: null,
              salle: null
            },
          ],
          Mardi: [
            {
              classe: null,
              matiere: null,
              professeur: null,
              salle: null
            },
            {
              classe: null,
              matiere: null,
              professeur: null,
              salle: null
            },
          ],
          Mercredi: [
            {
              classe: null,
              matiere: null,
              professeur: null,
              salle: null
            },
            {
              classe: null,
              matiere: null,
              professeur: null,
              salle: null
            },
          ],
          Jeudi: [
            {
              classe: null,
              matiere: null,
              professeur: null,
              salle: null
            },
            {
              classe: null,
              matiere: null,
              professeur: null,
              salle: null
            },
          ],
          Vendredi: [
            {
              classe: null,
              matiere: null,
              professeur: null,
              salle: null
            },
            {
              classe: null,
              matiere: null,
              professeur: null,
              salle: null
            },
          ],
          Samedi: [
            {
              classe: null,
              matiere: null,
              professeur: null,
              salle: null
            },
            {
              classe: null,
              matiere: null,
              professeur: null,
              salle: null
            },
          ],
        },
      ]
    }
  })
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
  const handleValider = (nouvelleValeur) => {
    if (!selectedCreneau) return;
    setDataNewEdt((prev) => {
      const newData = { ...prev };
      // Copie profonde pour éviter la mutation directe
      newData.donnee.contenu = newData.donnee.contenu.map((ligne, i) => {
        if (i !== selectedCreneau.horaireIdx) return ligne;
        return {
          ...ligne,
          [selectedCreneau.jour]: ligne[selectedCreneau.jour].map((cell, idx) =>
            idx === selectedCreneau.creneauIdx ? { ...cell, ...nouvelleValeur } : cell
          ),
        };
      });
      return newData;
    });
    setIsNewValue(false);
    setSelectedCreneau(null);
  };
  const versGeneral = () => navigate('/edt');
  const versCreationEdt = () => navigate('/edt/nouveau-edt');
  const versAFfichage = () => navigate('/edt/affichage-edt');

  const ajouterColonne = () => {
    // Crée un nouvel horaire (tu peux adapter les heures comme tu veux)
    const lastHoraire = dataNewEdt.donnee.contenu[dataNewEdt.donnee.contenu.length - 1]?.Horaire || { heureDebut: 8, heureFin: 10 };
    const newHeureDebut = parseInt(lastHoraire.heureFin, 10);
    const newHeureFin = newHeureDebut + 2;

    // Crée une nouvelle ligne vide pour chaque jour
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const nouvelleLigne = {
      Horaire: {
        heureDebut: "",
        heureFin: ""
      }
    };

    jours.forEach(jour => {
      nouvelleLigne[jour] = [
        { classe: null, matiere: null, professeur: null, salle: null },
        { classe: null, matiere: null, professeur: null, salle: null }
      ];
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
    if (!heureStr) return "";
    const [h, m] = heureStr.split(":");
    return m === "00" ? `${parseInt(h, 10)}h` : `${parseInt(h, 10)}h:${m}`;
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

    setDataNewEdt({
      ...dataEdt,
      date_debut: correctedStart,
      date_fin: correctedEnd,
    });

    if (errorMessage) {
      setError({ status: true, composant: "date_debut", message: errorMessage });
    } else {
      setError({ ...error, status: false });
    }
  };

  const handleChangeMatiere = (e) => {
    const value = e.target.value;
    setDataNewEdt({ ...dataEdt, matiere: value })
    listeProfesseur.filter((p) => p.matieres.numMatiere == value)

  }
  const handleEndDateChange = (e) => {
    const chosenEnd = parseISO(e.target.value);
    const start = parseISO(dataEdt.date_debut);

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
    setDataNewEdt({ ...dataEdt, date_fin: e.target.value });
    setError({ ...error, status: false });
  };
  const handleClick = (jour, horaire) => {
    setSelectedCell({ jour, horaire });
    setIsNewValue(true);
    setIsEditHours(false);
  };
  const getDataClasse = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/classe/niveau-parcours/${dataEdt.niveau}`);
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setListeClasse(response.data);

    } catch (error) {
      console.error(error.message);
    }
  };
  const getDataClasseSelected = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/niveau-parcours/${id}`);
      if (response.status !== 200) {
        throw new Error('Erreur code : ' + response.status);
      }
      setListeClasseSelected(response.data);

    } catch (error) {
      console.error(error.message);
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
      const response = await axios.get(`http://127.0.0.1:8000/api/matiere/niveau-parcours/${dataEdt.niveau}`);
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
      const response = await axios.get(`http://127.0.0.1:8000/api/professeur/niveau-parcours/${dataEdt.niveau}`);
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
  useEffect(() => {
    getDataClasse()
    // getDataParcours();

    getDataSalle();
    getDataMatiere();
    getDataProfesseurs();
  }, [])
  useEffect(() => {
    if (dataEdt) {
      getDataClasseSelected(dataEdt.niveau)
      setDataNewEdt({ ...dataNewEdt, date_debut: dataEdt.date_debut, date_fin: dataEdt.date_fin })
    }
    console.log(dataEdt)
  }, [])
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
    // .sort((a, b) => a.niveau.localeCompare(b.niveau))
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
                {selectedCell?.jour} {selectedCell?.horaire?.heure_debut}h-{selectedCell?.horaire?.heure_fin}h
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
                    professeur: null // reset le prof si la matière change
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
                  // Vérification des deux créneaux de la même case
                  const { ligneIdx, jour, creneauIdx } = selectedCell;
                  const autresCreneaux = dataNewEdt.donnee.contenu[ligneIdx][jour].filter((_, idx) => idx !== creneauIdx);
                  if (autresCreneaux.some(c => c.classe === formCreneau.classe)) {
                    setFormError("Les deux créneaux d'un même jour ne peuvent pas avoir la même classe.");
                    return;
                  }
                  setFormError("");
                  setDataNewEdt(prev => {
                    const newData = { ...prev };
                    newData.donnee.contenu[ligneIdx][jour][creneauIdx] = { ...formCreneau };
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
                  setDataNewEdt(prev => {
                    const newData = { ...prev };
                    newData.donnee.contenu[selectedCell.ligneIdx].Horaire = { ...formHoraire };
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
            <button className='font-bold hover:scale-105 text-blue-600' onClick={versCreationEdt}>Creation</button>
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
              </p></span>
            <div className="flex gap-2 items-center w-[70%] pe-8">
              <div className='flex items-center'>
                <p className='w-40'>Date début : </p>
                <input
                  type="date"
                  onChange={handleStartDateChange}
                  value={dataNewEdt.date_debut || ""}
                  className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
              <div className='flex items-center'>
                <p className='w-40'>Date fin : </p>
                <input
                  type="date"
                  onChange={handleEndDateChange}
                  value={dataNewEdt.date_fin || ""} // Toujours une string
                  className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            </div>
          </div>

          {/* Tableau selon le modèle */}
          <div className="h-[73%]  w-full m-4">
            {modele === 1 ? (
              <div className="w-full border border-white rounded-t-lg overflow-hidden">
                <table className='table-fixed border w-full text-sm border-black'>
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
                        <td className="border-2 p-2 font-semibold relative">
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
                            <td key={jour} className="border-2 cursor-pointer h-24 relative">
                              <div className="flex flex-row justify-start items-center w-full h-full">
                                {ligne[jour].map((creneau, idx) => (
                                  <div
                                    key={idx}
                                    className={`p-2 flex flex-col w-1/2 h-full relative
                                            ${idx === 0 ? "border-r border-dashed border-gray-300" : ""}
                                            hover:bg-gray-200 active:bg-gray-300`}
                                    onClick={() => {
                                      setSelectedCell({ ligneIdx: i, jour, creneauIdx: idx });
                                      const creneau = dataNewEdt.donnee.contenu[i][jour][idx];
                                      setFormCreneau({ ...creneau });
                                      setIsNewValue(true);
                                    }}
                                  >
                                    <span className='flex flex-col w-full '>
                                      <span className='flex flex-col w-full'>
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
                  <img
                    src="/Icons/plus.png"
                    alt="Ajouter une ligne"
                    className='w-8 cursor-pointer'
                    onClick={ajouterColonne}
                  />
                </div>
              </div>
            ) : (
              <div className="overflow-auto  h-full">
                <table className="table-fixed border w-full text-sm border-black">
                  <thead className='sticky top-0 z-10'>
                    <tr>
                      <th className="border  border-t-white border-l-white"></th>
                      {horaires.map((horaire, index) => (
                        <th key={index} className="border p-2 text-center bg-gray-100">
                          <p>{horaire.heure_debut}h - {horaire.heure_fin}h</p>
                          <img src="/Icons/modifier.png" alt="" className="absolute bottom-2 right-1 w-5 cursor-pointer" onClick={() => setIsEditHours(true)} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {jours.map((jour, i) => (
                      <tr key={i}>
                        <td className="border p-2 text-center font-semibold">{jour}

                        </td>
                        {horaires.map((horaire, j) => (
                          <td key={j} className="border cursor-pointer h-20 relative" onClick={() => handleClick(jour, horaire)}>
                            <div className="absolute inset-0 flex items-center justify-center hover:bg-gray-200">
                              <img src="/Icons/plus.png" alt="" className="w-6 h-6" />
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
                    alt="Ajouter une colonne"
                    className='w-8 cursor-pointer'
                    onClick={ajouterColonne}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EdtNew;
