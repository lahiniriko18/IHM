import axios from 'axios'
import React, { useState } from 'react'

function Login() {
  const [email, setEmail] = useState("")
  const [pswd, setPasswd] = useState("")

  const postData = async () => {
    try {
      const api = await axios.post("", { Usermail: email, Userpassword: pswd })
      if (api.status != 200) {
        throw new Error("Erreur lors de l'envoi  de données", api.status)
      }
      console.log("Ca marche bien")
    } catch (e) {
      console.log("Error :", e.message)
    }
  }
  return (
    <div className=' w-screen h-screen bg-login flex justify-center items-center'>
      <div className="container bg-white w-96 h-80 rounded-md p-5 flex flex-col gap-2">
        <p className='text-center font-bold'>Connexion</p>
        <label htmlFor="">Email</label>
        <input type="text" className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500" placeholder="Entrez votre email ici" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="">Password</label>
        <input type="password" className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500" placeholder="Entrez votre mot de passe  ici" value={pswd} onChange={(e) => setPasswd(e.target.value)} />
        <button className="button font-bold mt-8" onClick={() => {
          if (email.trim() != "" && pswd.trim() != "") {
            postData()
            setEmail("")
            setPasswd("")
          }
        }
        }>Se connecter</button>
      </div>
    </div >
  )
}

export default Login