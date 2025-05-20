
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NavigationPrompt = ({ when, message, onConfirm }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unblock = navigate.block((tx) => {
      if (when && window.confirm(message)) {
        if (onConfirm) onConfirm();
        unblock(); // important : débloque la navigation
        tx.retry(); // continue la navigation
      }
    });

    return () => unblock();
  }, [when, message, onConfirm, navigate]);

  return null;
};

export default NavigationPrompt;
