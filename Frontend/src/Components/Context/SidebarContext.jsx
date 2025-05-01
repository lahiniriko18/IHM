import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isReduire, setIsReduire] = useState(false); // false = sidebar élargie

  return (
    <SidebarContext.Provider value={{ isReduire, setIsReduire }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
