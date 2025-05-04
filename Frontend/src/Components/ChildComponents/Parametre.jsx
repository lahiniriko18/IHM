import React, { useState } from 'react'
import { useSidebar } from '../Context/SidebarContext';
import Creatable from 'react-select/creatable';
import ColorPicker from 'react-pick-color';
import { useNavigate } from 'react-router-dom';
function Parametre() {
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
          <button className='font-bold hover:scale-105 text-bleu' onClick={versGeneral}>Géneral</button>
          <button className=' hover:scale-105 text-gray-500' onClick={versInfo}>Informations</button>
          <button className=' hover:scale-105 text-gray-500' onClick={versSecurite}>Securité</button>
          <button className=' hover:scale-105 text-gray-500' onClick={versProfile}>Profile</button>
        </div>
        <div className="flex flex-row items-start gap-3">
          <div className="flex flex-col items-start gap-3 w-[50%]">
            <p>Vous pouvez personaliser votre preference selon votre choix</p>
            <div className="flex flex-row items-center gap-2">
              <label htmlFor="">Théme : </label>
              <Creatable
                isClearable
                placeholder="Choisissez un thème"

                options={[
                  { value: 'default', label: 'Par defaut' },
                  { value: 'personaliser', label: 'Personaliser' },
                ]}
                className="text-sm"
              />
            </div>
            <div className="flex flex-row gap-3 items-center">
              <p>Couleurs : </p>
              <img src="/Icons/info.png" alt="" className='w-6 hover:scale-105 transition-all duration-100 cursor-pointer' />
            </div>

            <div className="flex flex-col w-full gap-5">
              <div className='w-[50%] px-8'>
                <div className='custom-color-picker'>
                  <ColorPicker color={color} onChange={color => setColor(color.hex)} />
                </div>
              </div>

              <div className='w-[50%] flex justify-center items-start flex-col gap-2'>
                <p>Entrez une valeur en hexadecimal</p>
                <input type="text" className='border leading-6 rounded p-2 w-96' placeholder='ex:#ff10D5' />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 ">
            <p>Preference du format de l'EDT :</p>
            <div className="flex flex-col p-2">
              <img src="/Images/model-1.png" alt="" />
              <div>
                <label htmlFor="" className='cursor-pointer text-bleu'>
                  Modele n°1 :</label>
                <input type="radio" name="model" id="" className='ms-3 cursor-pointer p-10' />
              </div>

            </div>

            <div className="flex flex-col p-2">
              <img src="/Images/model-2.png" alt="" className='h-52' />
              <div>
                <label htmlFor="" className='cursor-pointer text-bleu'>
                  Modele n°2 :</label>
                <input type="radio" name="model" id="" className='ms-3 cursor-pointer p-10' />
              </div>
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

export default Parametre