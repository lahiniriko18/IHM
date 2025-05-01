import React from 'react'
import { useSidebar } from '../Context/SidebarContext';

function Parcours() {
  const { isReduire } = useSidebar();
  return (
    <div className={`${isReduire ? "fixed h-screen  right-0 top-12 left-16 ps-5  pt-3 z-40 flex flex-wrap flex-col gap-5 justify-start items-start overflow-auto duration-700 transition-all" : "fixed h-screen  right-0 top-12 left-52 ps-5  pt-3 z-40 flex flex-wrap flex-col gap-5 justify-start items-start overflow-auto duration-700 transition-all bg-red-500"}`}>
      baba
    </div>
  )
}

export default Parcours