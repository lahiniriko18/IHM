// src/Components/Utils/RouteChangeTracker.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Tu peux déclencher d'autres effets ici si besoin
  }, [location.pathname]);

  return null; // Pas de rendu à l’écran
};

export default RouteChangeTracker;
