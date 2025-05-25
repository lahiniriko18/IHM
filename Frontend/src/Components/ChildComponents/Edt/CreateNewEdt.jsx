import React, { useEffect, useState } from 'react'
import { useSidebar } from '../../Context/SidebarContext';
import Creatable from 'react-select/creatable';
import axios from 'axios';
function CreateNewEdt() {
  const { isReduire } = useSidebar();
  const [modele, setModele] = useState(1);
  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [isOpenHours, setIsOpenHours] = useState(false)
  const initialStateEdt = location.state?.dataEdt || {}
  const [objectStateEdt, setObjectStateEdt] = useState(initialStateEdt)
  const [numNiveauParcours, setNumNiveauParcours] = useState(null)
  const [listeMatiere, setListeMatiere] = useState([]);
  const [listeSalle, setListeSalle] = useState([]);
  const [listeClasse, setListeClasse] = useState([]);
  const [niveauSelected, setNiveauSelected] = useState([]);
  const [listeProfesseur, setlisteProfesseur] = useState([]);
  const [professeursFiltres, setProfesseursFiltres] = useState([]);
  const [date, setDate] = useState({ date_debut: "", date_fin: "" })
  const [formHoraire, setFormHoraire] = useState({ heureDebut: "", heureFin: "" });
  const [formCreneau, setFormCreneau] = useState({
    classe: null,
    matiere: null,
    professeur: null,
    salle: null,
  });
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
          dataEdtState.niveau,
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
  //Fin de l'API

  //Function & Code ankoatrin'ny api & useffect 

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

  // maka num niveau-parcours + date de debut et fin au premier rendu
  useEffect(() => {
    objectStateEdt.niveau ? setNumNiveauParcours(objectStateEdt.niveau) : null
    objectStateEdt.date_debut && objectStateEdt.date_fin ? setDate({ ...date, date_debut: objectStateEdt.date_debut, date_fin: objectStateEdt.date_fin }) : ""
  }, [])
  return (
    <>
      {
        (isOpenAdd) && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[52] flex justify-center items-center">
            <div className="bg-white w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] max-h-[95%] overflow-y-auto p-5 rounded-lg shadow-lg space-y-4">
              <div className="flex justify-between items-center w-full">
                <h1 className="text-blue-600 text-xl font-bold"> Jour - Heure </h1>
                <img
                  src="/Icons/annuler.png"
                  alt="Quitter"
                  onClick={() => {
                    setIsOpenAdd(false);
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
              <div className="w-full flex justify-center">
                <button className="button">
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

              <div className="w-full flex justify-center">
                <button className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700">
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
            <button className='hover:scale-105 text-gray-500' >Géneral</button>
            <button className='font-bold hover:scale-105 text-blue-600'>Creation</button>
            <button className='hover:scale-105 text-gray-500' >Affichage</button>
            <button className='hover:scale-105 text-gray-500' >Modification</button>
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
                <input type="date" value={objectStateEdt.date_debut || ""} name="date_debut" id="date_debut" className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
              <div className='flex items-center'>
                <p className='w-40'>Date fin : </p>
                <input
                  type="date" value={objectStateEdt.date_fin || ""} className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition" name='date_fin' id="date_fin"
                />
              </div>
            </div>

            <button className="button">Creer l'EDT</button>
          </div>
        </div>
        <div className="h-[73%] overflow-x-auto w-full m-4">
          {
            modele === 1 ? (
              <div className="w-full border border-white rounded-t-lg overflow-x-auto">
                <table className='border w-full text-sm border-black'>
                  <thead className='sticky top-0 z-10'>
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
                            {ligne.Horaire.heureDebut} - {ligne.Horaire.heureFin}
                          </span>
                          <img src="/Icons/modifier.png" alt="" className="absolute bottom-2 right-1 w-5 cursor-pointer" />
                        </td>
                        {
                          Object.keys(ligne).filter(key => key !== 'Horaire').map((jour, j) => (
                            <td key={jour} className="border-2 cursor-pointer h-24 relative">
                              <div className="flex flex-row justify-start items-center w-full h-full" key={value}>
                                {ligne[jour].map((caseItem, value) => (
                                  <div className='p-2 flex flex-col h-full relative hover:bg-gray-200 active:bg-gray-300 min-h-28 border-gray-300' key={value}>
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
                    className='w-8 cursor-pointer' />
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto w-full bg-white rounded-lg">
                <table className="min-w-[750px] w-full text-sm border border-black">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th className="border-2 border-t-white py-6 border-l-white"></th>
                      <th key={j} className="border bg-blue-500 text-white text-center relative">08h - 10h</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 text-center font-semibold bg-gray-50 w-32 min-w-[20px] max-w-[120px]">
                        Lundi
                      </td>
                      <td className="border cursor-pointer min-h-32 min-w-[120px] relative">
                        <div className="flex flex-row justify-start items-center w-full h-full">
                          <div className={`p-2 flex flex-col h-full relative  hover:bg-gray-200 active:bg-gray-300 min-h-28 border-gray-300`}>
                            a
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex justify-end mt-2">
                  <button
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                  >
                    <img src="/Icons/plus.png" alt="Ajouter une colonne" className="w-5" />
                    Ajouter une colonne
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  )
}

export default CreateNewEdt