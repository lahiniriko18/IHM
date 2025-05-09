
import React, { createContext, useState, useContext } from 'react';
const EtablissementContext = createContext();
export function EtablissementProvider({ children }) {
  const [numEtablissement, setNumEtablissement] = useState(null);

  return (
    <EtablissementContext.Provider value={{ numEtablissement, setNumEtablissement }}>
      {children}
    </EtablissementContext.Provider>
  );
}
export function useEtablissement() {
  return useContext(EtablissementContext);
}
