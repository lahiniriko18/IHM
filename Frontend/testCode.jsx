<table className="table-fixed border w-full text-sm border-black">
  <thead className='sticky top-0 z-10'>
    <tr>
      <th className="border border-t-white border-l-white"></th>
      {jours.map((jour) => (
        <th key={jour} className="border p-2 text-center bg-gray-100">{jour}</th>
      ))}
    </tr>
  </thead>
  <tbody>
    {horaires.map((horaire, i) => (
      <tr key={i}>
        <td className="border p-2 font-semibold relative">
          <span className="flex justify-center">{horaire.heure_debut}h - {horaire.heure_fin}h</span>
          <img src="/Icons/modifier.png" alt="" className="absolute bottom-2 right-1 w-5 cursor-pointer" onClick={() => setIsEditHours(true)} />
        </td>
        {jours.map((jour) => (
          <td key={jour} className="border cursor-pointer h-20 relative" onClick={() => handleClick(jour, horaire)}>
            <div className="absolute inset-0 flex items-center justify-center hover:bg-gray-200">
              <img src="/Icons/plus.png" alt="" className="w-6 h-6" />
            </div>
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>