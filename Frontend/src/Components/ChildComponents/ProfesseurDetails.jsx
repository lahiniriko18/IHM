import React, { useState } from 'react'
import { useSidebar } from '../Context/SidebarContext';

function ProfesseurDetails() {
  const { isReduire } = useSidebar();

  return (
    <>
      <div className={`${isReduire ? "left-20" : "left-56"} fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}>
        <p className="font-bold text-bleu">Detail d'un professeur</p>
        <div className="flex flex-row justify-between py-4 w-full">

          <div className="flex flex-col justify-start gap-2">
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Nom du professeur : </p>
              <span className='text-gray-600'>RAKOTOVAO paul</span>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Leur grade : </p>
              <span className='text-gray-600'>Docteur en informatique</span>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Contact : </p>
              <span className='text-gray-600'>0340721283</span>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Adresse : </p>
              <span className='text-gray-600'>Fianarantsoa</span>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Sexe : </p>
              <span className='text-gray-600'>Masculin</span>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Email: </p>
              <span className='text-gray-600'>rakotovaopaul@gmail.com</span>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Description : </p>
              <span className='text-gray-600 '>Ici on trouve le description de cette professeur</span>
            </div>
            <div className="flex flex-row gap-2">
              <p className="font-semibold">Heure totale sur l'année universitaire 2024-2025 : </p>
              <span className='text-gray-600 '>52 Heures</span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-bleu">Representation de heure chaque semaine : </p>
              <img src="/Images/cercle.png" alt="" className='w-64' />
            </div>
          </div>

          <div className="flex justify-center items-center  w-96 h-96">
            <div className="w-64 h-64 bg-gray-200 rounded-full flex justify-center items-center text-white font-bold">
              Photo
            </div>
          </div>

        </div>
      </div >
    </>
  );


}

export default ProfesseurDetails