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
  const [listeEdtAvecNiveau, setListeEdtAvecNiveau] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listeNiveau, setListeNiveau] = useState([]);
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const [ObjectParametre, setObjectParametre] = useState({
    numNiveauParcours: [],
    dateDebut: "",
    dateFin: "",
  });
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
      const response = await axios.get("http://");
      if (response.status !== 200) {
        throw new Error("Erreur code : " + response.status);
      }
      setListeEdtAvecNiveau(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    console.log(ObjectParametre);
  }, [ObjectParametre]);
  const optionsNiveau = listeNiveau.map((Classe) => ({
    value: Classe.numNiveauParcours,
    label:
      Classe.niveau +
      (Classe.numParcours.codeParcours
        ? Classe.numParcours.codeParcours
        : " - " + Classe.numParcours.nomParcours),
  }));
  useEffect(() => {
    getDataNiveau();
  }, []);
  return (
    <div
      className={`${
        isReduire ? "left-20" : "left-56"
      } fixed right-0 top-14 p-5 h-screen overflow-auto max-w-screen-xl bg-white z-40 transition-all duration-700`}
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
              <div className="overflow-auto h-full">
                <div className="text-center font-bold mb-4">
                  Emploi du temps pour la semaine du {ObjectParametre.dateDebut}{" "}
                  au {ObjectParametre.dateFin}
                </div>
                <p className="text-center"> L1 IG</p>
                <table className="table-fixed  w-full text-sm border-black border-collapse">
                  <thead>
                    <tr>
                      <th className="border-r border-b border-black border-t-0 border-l-0"></th>
                      <th className="border border-black">A</th>
                      <th className="border border-black">B</th>
                      <th className="border border-black">C</th>
                      <th className="border border-black">D</th>
                      <th className="border border-black">E</th>
                      <th className="border border-black">F</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border border-black">
                      <td className="border border-black w-1/2"> a</td>
                      <td className="border border-black">b</td>
                      <td className="border border-black">c</td>
                      <td className="border border-black">d</td>
                      <td className="border border-black">e</td>
                      <td className="border border-black">f</td>
                      <td className="border border-black">g</td>
                    </tr>
                    <tr className="border border-black">
                      <td className="border border-black w-1/2"> a</td>
                      <td className="border border-black">b</td>
                      <td className="border border-black">c</td>
                      <td className="border border-black">d</td>
                      <td className="border border-black">e</td>
                      <td className="border border-black">f</td>
                      <td className="border border-black">g</td>
                    </tr>
                    <tr className="border border-black">
                      <td className="border border-black w-1/2"> a</td>
                      <td className="border border-black">b</td>
                      <td className="border border-black">c</td>
                      <td className="border border-black">d</td>
                      <td className="border border-black">e</td>
                      <td className="border border-black">f</td>
                      <td className="border border-black">g</td>
                    </tr>
                    <tr className="border border-black">
                      <td className="border border-black w-1/2"> a</td>
                      <td className="border border-black">b</td>
                      <td className="border border-black">c</td>
                      <td className="border border-black">d</td>
                      <td className="border border-black">e</td>
                      <td className="border border-black">f</td>
                      <td className="border border-black">g</td>
                    </tr>
                    <tr className="border border-black">
                      <td className="border border-black w-1/2"> a</td>
                      <td className="border border-black">b</td>
                      <td className="border border-black">c</td>
                      <td className="border border-black">d</td>
                      <td className="border border-black">e</td>
                      <td className="border border-black">f</td>
                      <td className="border border-black">g</td>
                    </tr>
                    <tr className="border border-black">
                      <td className="border border-black w-1/2"> a</td>
                      <td className="border border-black">b</td>
                      <td className="border border-black">c</td>
                      <td className="border border-black">d</td>
                      <td className="border border-black">e</td>
                      <td className="border border-black">f</td>
                      <td className="border border-black">g</td>
                    </tr>
                  </tbody>
                </table>
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
