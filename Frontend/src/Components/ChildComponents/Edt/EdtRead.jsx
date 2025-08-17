import axios from "axios";
import { addDays, format, parseISO, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Creatable from "react-select/creatable";
import { useSidebar } from "../../Context/SidebarContext";

function EdtRead() {
  const { isReduire } = useSidebar();
  const navigate = useNavigate();
  const versGeneral = () => navigate("/edt");
  const versCreationEdt = () => navigate("/edt/nouveau-edt");
  const versAFfichage = () => navigate("/edt/affichage-edt");
  const [modele, setModele] = useState(1);
  const [listeMatiere, setListeMatiere] = useState([]);
  const [listeSalle, setListeSalle] = useState([]);
  const [listeClasse, setListeClasse] = useState([]);
  const [listeEdtAvecNiveau, setListeEdtAvecNiveau] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listeNiveau, setListeNiveau] = useState([]);
  const [niveauSelected, setNiveauSelected] = useState([]);
  const [edt, setEdt] = useState(listeEdtAvecNiveau || []);
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const [listeProfesseur, setlisteProfesseur] = useState([]);
  const [ObjectParametre, setObjectParametre] = useState({
    numNiveauParcours: [],
    dateDebut: "",
    dateFin: "",
  });
  const [matieresParNiveau, setMatieresParNiveau] = useState({});
  const [profsParNiveau, setProfsParNiveau] = useState({});
  const [classesParNiveau, setClassesParNiveau] = useState({});
  const [sallesParNiveau, setSallesParNiveau] = useState({});
  const handleDateChange = (event) => {
    const date = event.target.value;
    if (date) {
      const selectedDate = parseISO(date);
      const lundi = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const samedi = addDays(lundi, 5);
      setObjectParametre((prev) => ({
        ...prev,
        dateDebut: format(lundi, "yyyy-MM-dd"),
        dateFin: format(samedi, "yyyy-MM-dd"),
      }));
    } else {
      setObjectParametre((prev) => ({
        ...prev,
        dateDebut: "",
        dateFin: "",
      }));
    }
  };
  function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }

  //api

  // const getDataSalle = async (donnees) => {

  //   try {
  //     const response = await axios.post(
  //       "http://127.0.0.1:8000/api/salle/liste/verifier/",
  //       donnees
  //     );
  //     if (response.status !== 200) {
  //       throw new Error("Erreur code : " + response.status);
  //     }
  //     setListeSalle(response.data);
  //   } catch (error) {
  //     console.error(error.response.data);
  //   }
  // };

  const getDataMatiere = async (numNiveauParcours) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/matiere/niveau-parcours/${numNiveauParcours}`
      );
      if (response.status !== 200)
        throw new Error("Erreur code : " + response.status);
      setMatieresParNiveau((prev) => ({
        ...prev,
        [numNiveauParcours]: response.data,
      }));
    } catch (error) {
      console.error(error.message);
    }
  };

  const getDataProfesseurs = async (numNiveauParcours) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/professeur/niveau-parcours/${numNiveauParcours}`
      );
      if (response.status !== 200)
        throw new Error("Erreur code : " + response.status);
      setProfsParNiveau((prev) => ({
        ...prev,
        [numNiveauParcours]: response.data,
      }));
    } catch (error) {
      console.error(error.message);
    }
  };

  const getDataClasse = async (numNiveauParcours) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/classe/niveau-parcours/${numNiveauParcours}`
      );
      if (response.status !== 200)
        throw new Error("Erreur code : " + response.status);
      setClassesParNiveau((prev) => ({
        ...prev,
        [numNiveauParcours]: response.data,
      }));
    } catch (error) {
      console.error(error.message);
    }
  };

  const getDataSalle = async (numNiveauParcours) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/salle/niveau-parcours/${numNiveauParcours}`
      );
      if (response.status !== 200)
        throw new Error("Erreur code : " + response.status);
      setSallesParNiveau((prev) => ({
        ...prev,
        [numNiveauParcours]: response.data,
      }));
    } catch (error) {
      console.error(error.message);
    }
  };
  const getDataNiveau = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/niveau-parcours/"
      );
      if (response.status !== 200) {
        throw new Error("Erreur code : " + response.status);
      }
      setListeNiveau(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getEdtAvecNiveau = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/edt/niveau-semaine/",
        {
          date: formatDateToDDMMYYYY(ObjectParametre.dateDebut),
          numNiveauParcours: ObjectParametre.numNiveauParcours,
        }
      );
      if (response.status !== 200) {
        throw new Error("Erreur code : " + response.status);
      }
      setListeEdtAvecNiveau(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };
  const optionsNiveau = listeNiveau.map((Classe) => ({
    value: Classe.numNiveauParcours,
    label:
      Classe.niveau +
      (Classe.numParcours.codeParcours
        ? Classe.numParcours.codeParcours
        : " - " + Classe.numParcours.nomParcours),
  }));
  const getMatiereLabel = (numMatiere, numNiveau) => {
    const matieres = matieresParNiveau[numNiveau] || [];
    const found = matieres.find((m) => m.numMatiere === numMatiere);
    return found ? found.codeMatiere || found.nomMatiere || "" : "";
  };

  const getProfLabel = (numProfesseur, numNiveau) => {
    const profs = profsParNiveau[numNiveau] || [];
    const found = profs.find((p) => p.numProfesseur === numProfesseur);
    if (!found) return "";
    return found.nomCourant
      ? found.nomCourant
      : found.prenomProfesseur
      ? found.prenomProfesseur
      : found.nomProfesseur;
  };

  const getClasseLabel = (numClasse, numNiveau) => {
    const classes = classesParNiveau[numNiveau] || [];
    const found = classes.find((c) => c.numClasse === numClasse);
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

  const getSalleLabel = (numSalle, numNiveau) => {
    const salles = sallesParNiveau[numNiveau] || [];
    const found = salles.find((s) => s.numSalle === numSalle);
    return found ? found.nomSalle : "";
  };

  useEffect(() => {
    if (
      ObjectParametre.numNiveauParcours.length > 0 &&
      ObjectParametre.dateDebut
    ) {
      getEdtAvecNiveau();
    }
  }, [ObjectParametre]);

  useEffect(() => {
    ObjectParametre.numNiveauParcours.forEach((numNiveau) => {
      getDataMatiere(numNiveau);
      getDataProfesseurs(numNiveau);
      getDataClasse(numNiveau);
      getDataSalle(numNiveau);
    });
  }, [ObjectParametre.numNiveauParcours]);
  useEffect(() => {
    getDataNiveau();
    // getDataClasse();
    // getDataMatiere();
    // getDataSalle();
    // getDataProfesseurs();
    // getNiveau();
  }, []);
  return (
    <div
      className={`${
        isReduire ? "left-20" : "left-56"
      } fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}
    >
      <div className="flex flex-col gap-1 h-full ">
        <div className="flex gap-3">
          <button
            className="hover:scale-105 text-gray-500"
            onClick={versGeneral}
          >
            Géneral
          </button>
          <button
            className=" hover:scale-105 text-gray-500"
            onClick={versCreationEdt}
          >
            Creation
          </button>
          <button
            className="font-bold hover:scale-105  text-blue-600"
            onClick={versAFfichage}
          >
            Affichage
          </button>
        </div>

        <div className="flex justify-between items-center sticky top-0 w-full  z-30">
          <span className="text-blue-600 font-bold flex flex-row items-center z-50">
            Niveau :
            <Creatable
              isClearable
              isMulti
              isValidNewOption={() => false}
              placeholder="Choisir le niveau"
              options={optionsNiveau}
              onChange={(selectedOption) => {
                setObjectParametre((prev) => ({
                  ...prev,
                  numNiveauParcours: Array.isArray(selectedOption)
                    ? selectedOption.map((opt) => opt.value)
                    : [],
                }));
              }}
              value={optionsNiveau.filter((option) =>
                (ObjectParametre.numNiveauParcours || []).includes(option.value)
              )}
              className="text-sm"
            />
          </span>
          <div className="flex gap-2 items-center  pe-8">
            <div className="flex items-center">
              <p className="w-40">Date début : </p>
              <input
                type="date"
                value={ObjectParametre.dateDebut || ""}
                onChange={handleDateChange}
                name="dateDebut"
                id="dateDebut"
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="flex items-center">
              <p className="w-40">Date fin : </p>
              <input
                type="date"
                value={ObjectParametre.dateFin || ""}
                readOnly
                onChange={() =>
                  setObjectParametre({
                    ...ObjectParametre,
                    dateFin: e.target.value,
                  })
                }
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                name="dateFin"
                id="dateFin"
              />
            </div>
          </div>
          <div>
            <button className="button">Imprimer</button>
          </div>
        </div>

        {/* Tableau selon le modèle */}
        <div className="h-[73%]  w-full m-4">
          {
            /* {isLoading ? (
            <div className="w-full h-40 flex flex-col items-center  justify-center </div>mt-[10%]">
              <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-2">Chargement des données...</p>
            </div>
          ) : ObjectParametre.numNiveauParcours.length === 0 ? (
            <div className="w-full h-40 flex flex-col items-center justify-center mt-[10%]">
              <img src="/Icons/vide.png" alt="Vide" className="w-14" />
              <p className="text-gray-400">
                Veuillez sélectionner au moins un niveau
              </p>
            </div>
          ) :*/ modele === 1 ? (
              <div className="h-full">
                <div className="text-center font-bold mb-4">
                  Emploi du temps pour la semaine du {ObjectParametre.dateDebut}{" "}
                  au {ObjectParametre.dateFin}
                </div>
                <div className="overflow-y-auto h-[500px] w-full">
                  {listeEdtAvecNiveau.donnee &&
                    Object.keys(listeEdtAvecNiveau.donnee).map((key) => {
                      const contenu =
                        listeEdtAvecNiveau.donnee[key].contenu || [];
                      const numNiveau = Number(
                        listeEdtAvecNiveau.donnee[key].numNiveauParcours
                      );
                      const joursNiveau =
                        contenu.length > 0
                          ? Object.keys(contenu[0]).filter(
                              (j) => j !== "Horaire"
                            )
                          : [];
                      return (
                        <div
                          key={key}
                          className="mb-8 overflow-auto min-h-[550px]"
                        >
                          <h2 className="text-center font-bold text-lg mb-2">
                            {key}
                          </h2>
                          <table className=" w-full text-sm border-black border-collapse">
                            <thead className="">
                              <tr>
                                <th className="border-r border-b border-black border-t-0 border-l-0"></th>
                                {joursNiveau.map((jour, index) => (
                                  <th
                                    key={index}
                                    className="border border-black"
                                  >
                                    {jour}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {contenu.map((ligne, i) => (
                                <tr key={i} className="border border-black">
                                  <td className="border border-black  min-w-[120px]">
                                    <span className="flex justify-center">
                                      {ligne.Horaire?.heureDebut} -{" "}
                                      {ligne.Horaire?.heureFin}
                                    </span>
                                  </td>
                                  {joursNiveau.map((jour, j) => (
                                    <td
                                      key={j}
                                      className="border border-black min-h-24"
                                    >
                                      <div className="flex flex-row justify-start items-center w-full h-full">
                                        {(ligne[jour] || []).map(
                                          (caseItem, value) => (
                                            <div key={value}>
                                              <span className="flex flex-col w-full">
                                                <p>
                                                  {caseItem.numClasse
                                                    ? `Classe: ${getClasseLabel(
                                                        caseItem.numClasse,
                                                        numNiveau
                                                      )}`
                                                    : ""}
                                                </p>
                                                <p>
                                                  {caseItem.matiere
                                                    ? `Matière: ${getMatiereLabel(
                                                        caseItem.matiere,
                                                        numNiveau
                                                      )}`
                                                    : ""}
                                                </p>
                                                <p>
                                                  {caseItem.professeur
                                                    ? `Prof: ${getProfLabel(
                                                        caseItem.professeur,
                                                        numNiveau
                                                      )}`
                                                    : ""}
                                                </p>
                                                <p>
                                                  {caseItem.salle
                                                    ? `Salle: ${getSalleLabel(
                                                        caseItem.salle,
                                                        numNiveau
                                                      )}`
                                                    : ""}
                                                </p>
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="overflow-auto  h-full">
                <table className="table-fixed border w-full text-sm border-black">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th className="border  border-t-white border-l-white"></th>
                      {horaires.map((horaire, index) => (
                        <th
                          key={index}
                          className="border p-2 text-center bg-gray-100"
                        >
                          <p>
                            {horaire.heure_debut}h - {horaire.heure_fin}h
                          </p>
                          {/* <img src="/Icons/modifier.png" alt="" className="absolute bottom-2 right-1 w-5 cursor-pointer" onClick={() => setIsEditHours(true)} /> */}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {jours.map((jour, i) => (
                      <tr key={i}>
                        <td className="border p-2 text-center font-semibold">
                          {jour}
                        </td>
                        {horaires.map((horaire, j) => (
                          <td
                            key={j}
                            className="border cursor-pointer h-20 relative"
                            onClick={() => handleClick(jour, horaire)}
                          >
                            <div className="absolute inset-0 flex items-center justify-center hover:bg-gray-200">
                              edt
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default EdtRead;
