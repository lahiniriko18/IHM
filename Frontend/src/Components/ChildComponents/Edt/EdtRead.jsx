import axios from "axios";
import { addDays, format, parseISO, startOfWeek } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Creatable from "react-select/creatable";
import { useSidebar } from "../../Context/SidebarContext";
function EdtRead() {
  const { isReduire } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const ObjectParam = location.state?.ObjectParam || {};
  // Navigation
  const versGeneral = () => navigate("/edt");
  const versCreationEdt = () => navigate("/edt/nouveau-edt");
  const versAffichage = () => navigate("/edt/affichage-edt");

  // États
  const [listeNiveau, setListeNiveau] = useState([]);
  const [listeEdtAvecNiveau, setListeEdtAvecNiveau] = useState([]);

  const [ObjectParametre, setObjectParametre] = useState(ObjectParam || {
    numNiveauParcours: [],
    dateDebut: "",
    dateFin: "",
  });

  // Données par niveau
  const [matieresParNiveau, setMatieresParNiveau] = useState({});
  const [profsParNiveau, setProfsParNiveau] = useState({});
  const [classesParNiveau, setClassesParNiveau] = useState({});
  const [sallesParNiveau, setSallesParNiveau] = useState({});

  // Format date
  function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }
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

  // Sélection date -> semaine (lundi -> samedi)
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

  // Fonction générique de récupération API
  const fetchData = async (endpoint, numNiveauParcours, setState) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/${endpoint}/niveau-parcours/${numNiveauParcours}`
      );
      if (response.status !== 200)
        throw new Error("Erreur code : " + response.status);
      setState((prev) => ({
        ...prev,
        [numNiveauParcours]: response.data,
      }));
    } catch (error) {
      console.error(error.message);
    }
  };

  // API: niveaux
  const getDataNiveau = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/niveau-parcours/"
      );
      if (response.status !== 200)
        throw new Error("Erreur code : " + response.status);
      setListeNiveau(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  // API: emploi du temps
  const getEdtAvecNiveau = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/edt/niveau-semaine/",
        {
          date: formatDateToDDMMYYYY(ObjectParametre.dateDebut),
          numNiveauParcours: ObjectParametre.numNiveauParcours,
        }
      );
      if (response.status !== 200)
        throw new Error("Erreur code : " + response.status);
      setListeEdtAvecNiveau(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Export PDF
  const handlePrint = () => {
    if (!listeEdtAvecNiveau.donnee) return;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    Object.keys(listeEdtAvecNiveau.donnee).forEach((key, index) => {
      const contenu = listeEdtAvecNiveau.donnee[key].contenu || [];
      const numNiveau = Number(
        listeEdtAvecNiveau.donnee[key].numNiveauParcours
      );
      const titre = listeEdtAvecNiveau.donnee[key].titre;
      const joursNiveau =
        titre && Array.isArray(titre) && titre.length > 0
          ? Object.keys(titre[0])
          : [];

      // en-tête du tableau
      const head = [["Horaire", ...joursNiveau]];

      // lignes du tableau
      const body = contenu.map((ligne) => [
        `${ligne.Horaire?.heureDebut} - ${ligne.Horaire?.heureFin}`,
        ...joursNiveau.map((jour) =>
          (ligne[jour] || [])
            .map((caseItem) => {
              return [
                caseItem.numClasse
                  ? getClasseLabel(caseItem.numClasse, numNiveau)
                  : "",
                caseItem.matiere
                  ? getMatiereLabel(caseItem.matiere, numNiveau)
                  : "",
                caseItem.professeur
                  ? getProfLabel(caseItem.professeur, numNiveau)
                  : "",
                caseItem.salle ? getSalleLabel(caseItem.salle, numNiveau) : "",
              ]
                .filter(Boolean)
                .join("\n");
            })
            .join("\n\n")
        ),
      ]);

      // Titre
      doc.setFontSize(14);
      doc.text(
        `Emploi du temps - ${key} (du ${formatDateToDDMMYYYY(
          ObjectParametre.dateDebut
        )} au ${formatDateToDDMMYYYY(ObjectParametre.dateFin)})`,
        40,
        40
      );

      // Tableau auto-formaté
      autoTable(doc, {
        head: head,
        body: body,
        startY: 60,
        styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
        headStyles: { fillColor: [41, 128, 185] },
        theme: "grid",
        columnStyles: {
          0: { cellWidth: 80 }, // Horaire
          // Les autres colonnes s'adaptent
        },
        margin: { left: 40, right: 40 },
        // didDrawPage: (data) => {
        //   // Optionnel: ajouter un titre ou un pied de page
        // },
      });

      if (index < Object.keys(listeEdtAvecNiveau.donnee).length - 1) {
        doc.addPage();
      }
    });

    doc.save("edt.pdf");
  };

  // Helpers affichage
  const getMatiereLabel = (numMatiere, numNiveau) => {
    const matieres = matieresParNiveau[numNiveau] || [];
    const found = matieres.find((m) => m.numMatiere === numMatiere);
    return found ? found.codeMatiere || found.nomMatiere || "" : "";
  };

  const getProfLabel = (numProfesseur, numNiveau) => {
    const profs = profsParNiveau[numNiveau] || [];
    const found = profs.find((p) => p.numProfesseur === numProfesseur);
    if (!found) return "";
    return found.nomCourant || found.prenomProfesseur || found.nomProfesseur;
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

  // Effets
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
      fetchData("matiere", numNiveau, setMatieresParNiveau);
      fetchData("professeur", numNiveau, setProfsParNiveau);
      fetchData("classe", numNiveau, setClassesParNiveau);
      fetchData("salle", numNiveau, setSallesParNiveau);
    });
  }, [ObjectParametre.numNiveauParcours]);

  useEffect(() => {
    getDataNiveau();
    console.log(ObjectParam)
  }, []);

  // Options pour select niveaux
  const optionsNiveau = listeNiveau.map((Classe) => ({
    value: Classe.numNiveauParcours,
    label:
      Classe.niveau +
      (Classe.numParcours.codeParcours
        ? Classe.numParcours.codeParcours
        : " - " + Classe.numParcours.nomParcours),
  }));

  return (
    <div
      className={`${
        isReduire ? "left-20" : "left-56"
      } fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}
    >
      <div className="flex flex-col gap-1 h-full ">
        {/* Navigation */}
        <div className="flex gap-3 fixed top-14 bg-white z-30 w-full py-6">
          <button
            className="hover:scale-105 text-gray-500"
            onClick={versGeneral}
          >
            Général
          </button>
          <button
            className="hover:scale-105 text-gray-500"
            onClick={versCreationEdt}
          >
            Création
          </button>
          <button
            className="font-bold hover:scale-105 text-blue-600"
            onClick={versAffichage}
          >
            Affichage
          </button>
        </div>

        {/* Filtres */}
        <div className="flex justify-between items-center sticky top-8 w-full z-30 bg-white">
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

          <div className="flex gap-2 items-center pe-8">
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
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                name="dateFin"
                id="dateFin"
              />
            </div>
          </div>

          <div>
            <button className="button" onClick={handlePrint}>
              Imprimer
            </button>
          </div>
        </div>

        {/* Affichage EDT */}
        <div className="h-[73%] w-full my-8 ">
          {listeEdtAvecNiveau.donnee
            ? Object.keys(listeEdtAvecNiveau.donnee).map((key, index) => {
                const contenu = listeEdtAvecNiveau.donnee[key].contenu || [];
                const numNiveau = Number(
                  listeEdtAvecNiveau.donnee[key].numNiveauParcours
                );
                const titre = listeEdtAvecNiveau.donnee[key].titre;
                const joursOrdre =
                  titre && Array.isArray(titre) && titre.length > 0
                    ? Object.keys(titre[0])
                    : [];
                return (
                  <div
                    key={key}
                    id={`edt-section-${index}`}
                    className="mb-8 overflow-auto min-h-[550px]"
                  >
                    <h2 className="text-center font-bold text-lg mb-2">
                      {key}
                    </h2>
                    <table className="w-full text-sm border-black border-collapse">
                      <thead>
                        <tr>
                          <th className="border-r max-w-10 border-b border-black border-t-0 border-l-0"></th>
                          {joursOrdre.map((jour, i) => (
                            <th key={i} className="border border-black">
                              {jour}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {contenu.map((ligne, i) => (
                          <tr key={i} className="border border-black">
                            <td className="border border-black max-w-[30px]">
                              <span className="flex justify-center  ">
                                {formatHeure(ligne.Horaire?.heureDebut)} -{" "}
                                {formatHeure(ligne.Horaire?.heureFin)}
                              </span>
                            </td>
                            {joursOrdre.map((jour, j) => (
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
                                            {caseItem.classe
                                              ? `${getClasseLabel(
                                                  caseItem.classe,
                                                  numNiveau
                                                )}`
                                              : ""}
                                          </p>
                                          <p>
                                            {caseItem.matiere
                                              ? `${getMatiereLabel(
                                                  caseItem.matiere,
                                                  numNiveau
                                                )}`
                                              : ""}
                                          </p>
                                          <p>
                                            {caseItem.professeur
                                              ? `${getProfLabel(
                                                  caseItem.professeur,
                                                  numNiveau
                                                )}`
                                              : ""}
                                          </p>
                                          <p>
                                            {caseItem.salle
                                              ? `${getSalleLabel(
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
              })
            : null}
        </div>
      </div>
    </div>
  );
}

export default EdtRead;
