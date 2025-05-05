import React, { useState } from 'react'
import { useSidebar } from '../Context/SidebarContext';
import Creatable from 'react-select/creatable';
import ColorPicker from 'react-pick-color';
import { useNavigate } from 'react-router-dom';
function ParametreProfile() {
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
          <button className=' hover:scale-105 text-gray-500' onClick={versSecurite}>Securité</button>
          <button className='font-bold hover:scale-105  text-bleu' onClick={versProfile}>Profile</button>
        </div>
        <div className="flex flex-row items-start gap-3">
          <div className="flex flex-col items-start gap-3 w-[50%]">
            <div className="flex flex-col gap-2">
              <label htmlFor="">Votre nom d'utilisateurs : </label>
              <input type="text" className='border p-1 rounded w-96' placeholder='ex:2' />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="">Votre email : </label>
              <input type="text" className='border p-1 rounded w-96' placeholder='ex:2' />
            </div>

            <div className="flex flex-row gap-2">
              <label htmlFor="">Votre role dans l'application : </label>
              <p className="font-bold text-gray-400">#Admin</p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="">frequence d'utilisation de logiciel : </label>
              <img src="/Images/histogramme.png" className='w-72' alt="" />
            </div>
            <div className="flex flex-row  gap-2">
              <label htmlFor="">Pour modifier votre mot de passe ,vas sur : </label>
              <span className="font-bold text-bleu cursor-pointer hover:underline transition-all duration-100">Utilisateurs</span>
            </div>

          </div>

          <div className="flex flex-col gap-32  justify-center items-center w-[50%] h-96 ">
            <div className='flex flex-col gap-3  justify-center items-center'>
              <span className="w-52 cursor-pointer h-52 rounded-full bg-gray-400 relative"></span>
              <img src="/Icons/televerser-un-fichier.png" alt="" className="absolute cursor-pointer" />
              <label htmlFor="" className="text-bleu">Avotra  </label>
            </div>
            <div className="flex justify-center">
              <button className="button">Enregistrer la modification</button>
            </div>
          </div>
        </div>
      </div >
    </>
  );

}

export default ParametreProfile