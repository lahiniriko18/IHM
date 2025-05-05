import React, { useState } from 'react'
import { useSidebar } from '../Context/SidebarContext';
import Creatable from 'react-select/creatable';
import ColorPicker from 'react-pick-color';
import { useNavigate } from 'react-router-dom';
function ParametreSecurite() {
  const navigate = useNavigate()
  const { isReduire } = useSidebar();
  const [color, setColor] = useState('#fff');
  const versGeneral = () => {
    navigate('/parametre')
  }
  const versInfo = () => {
    navigate('/parametre/info-etablisement')
  }
  const versSecurite = () => {
    navigate('/parametre/securite')
  }
  const versProfile = () => {
    navigate('/parametre/profile')
  }
  return (
    <>
      <div className={`${isReduire ? "left-20" : "left-56"} fixed right-0 top-14 p-5 h-screen overflow-auto bg-white z-40 transition-all duration-700`}>
        <div className='flex flex-row gap-3 mb-5'>
          <button className=' hover:scale-105 text-gray-500' onClick={versGeneral}>Géneral</button>
          <button className=' hover:scale-105 text-gray-500 ' onClick={versInfo}>Informations</button>
          <button className='font-bold hover:scale-105  text-bleu' onClick={versSecurite}>Securité</button>
          <button className=' hover:scale-105 text-gray-500' onClick={versProfile}>Profile</button>
        </div>
        <div className="flex flex-row items-start gap-3">
          {/* div a gauche */}
          <div className="flex flex-col items-start gap-3 w-[50%]">
            <div className="flex flex-col gap-2">
              <label htmlFor="">Nombre maximum des utilisateurs: </label>
              <input type="text" className='border p-1 rounded w-96' placeholder='ex:2' />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="">Se souvenez vous lors du prochaine session</label>
              <div className="flex flex-row gap-5">
                <div className="flex flex-row items-center gap-2 cursor-pointer">
                  <input type="radio" className='border p-2' name='info-connex' placeholder='ex:2' />
                  <label className="">Oui</label>
                </div>
                <div className="flex flex-row items-center gap-2 cursor-pointer">
                  <input type="radio" className='border p-2' name='info-connex' placeholder='ex:2' />
                  <label className="">Non</label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="">Notifier chaque professeur leur emploi du temps du semaine via email :</label>
              <div className="flex flex-row gap-5">
                <div className="flex flex-row items-center gap-2">
                  <input type="radio" className=' cursor-pointer p-2' name='info-connex' placeholder='ex:2' />
                  <label className="">Oui</label>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <input type="radio" className=' cursor-pointer p-2' name='info-connex' placeholder='ex:2' />
                  <label className="">Non</label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className='text-red-400 font-bold'>Reinitialiser à l'origine le logiciel :</label>
              <div className="flex flex-row gap-5">
                <div className="flex flex-row items-center gap-2">
                  <input type="radio" className=' cursor-pointer p-2' name='info-connex' placeholder='ex:2' />
                  <label className="">Oui</label>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <input type="radio" className=' cursor-pointer p-2' name='info-connex' placeholder='ex:2' />
                  <label className="">Non</label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="">veuillez entrez le motif pour la restauration: </label>
              <textarea type="text" className='border p-1 rounded w-96' placeholder='ex:2' />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className='text-gray-400 font-bold'>Sauvegarder les données dans un fichier avant de restaurer  :</label>
              <div className="flex flex-row gap-5">
                <div className="flex flex-row items-center gap-2">
                  <input type="radio" className=' cursor-pointer p-2' name='info-connex' placeholder='ex:2' />
                  <label className="">Oui</label>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <input type="radio" className=' cursor-pointer p-2' name='info-connex' placeholder='ex:2' />
                  <label className="">Non</label>
                </div>
              </div>
            </div>

            <button className=" bg-gray-400 p-2 text-white font-bold rounded">Restaurer</button>
          </div>

          {/* div a droite */}
          <div className="bg-gray-400 w-[50%] s ">
           
          </div>
        </div>
      </div >
    </>
  );


}

export default ParametreSecurite