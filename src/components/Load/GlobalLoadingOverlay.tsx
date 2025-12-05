import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const GlobalLoadingOverlay = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 600);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-neutral-700">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
        <p className="text-sm font-medium">Cargando contenido...</p>
      </div>
    </div>
  );
};

export default GlobalLoadingOverlay;
