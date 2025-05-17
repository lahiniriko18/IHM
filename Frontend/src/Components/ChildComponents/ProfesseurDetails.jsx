import React, { use, useEffect, useState } from 'react'
import { useSidebar } from '../Context/SidebarContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
function ProfesseurDetails() {
  const { isReduire } = useSidebar();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [listeProfesseur, setlisteProfesseur] = useState([]);
  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/professeur/detail/${id}`);
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
    } finally {
      setIsLoading(false);
      ;
    }
  };


  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className={`${isReduire ? "left-20" : "left-56"} fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}>
        <p className="font-bold text-bleu">Detail d'un professeur</p>
        <div className="flex flex-row justify-between py-4 w-full">

          <div className="flex flex-col justify-start gap-2">
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Nom du professeur : </p>
              <span className='text-gray-600'>{listeProfesseur.nomProfesseur}</span>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Nom du professeur : </p>
              <span className='text-gray-600'>{listeProfesseur.prenomProfesseur}</span>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Leur grade : </p>
              <span className='text-gray-600'>{listeProfesseur.grade}</span>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Contact : </p>
              <span className='text-gray-600'>{listeProfesseur.contact}</span>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Adresse : </p>
              <span className='text-gray-600'>{listeProfesseur.adresse}</span>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Sexe : </p>
              <span className='text-gray-600'>{listeProfesseur.sexe}</span>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Email: </p>
              <span className='text-gray-600'>{listeProfesseur.email}</span>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Nom courant : </p>
              <span className='text-gray-600 '>{listeProfesseur.nomCourant}</span>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Matières enseigné : </p>
              <span className='text-gray-600 '>
                {Array.isArray(listeProfesseur.matieres) &&
                  listeProfesseur.matieres.map((item, idx) => (
                    <strong key={idx}>{item.nomMatiere}, </strong>
                  ))
                }
              </span>
            </div>
            {/* <div className="flex flex-col gap-2">
              <p className="font-semibold text-bleu">Representation de heure chaque semaine : </p>
              <img src="/Images/cercle.png" alt="" className='w-64' />
            </div> */}
          </div>
          <div className="flex justify-center items-center  w-96 h-96">
            <div className="w-64 h-64 bg-gray-200 rounded-full flex justify-center items-center text-white font-bold">
              <img src={listeProfesseur.photos ? listeProfesseur.photos : null} alt="preview" className="w-64 h-64 rounded-full object-cover" />
            </div>
          </div>

        </div>
      </div >
    </>
  );


}

export default ProfesseurDetails