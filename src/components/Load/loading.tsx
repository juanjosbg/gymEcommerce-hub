import React from "react";

const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4 text-neutral-700">
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-4 w-4 rounded-[4px] bg-primary"
              style={{
                animation: "squarePulse 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
        <p className="text-sm font-medium">Cargando contenido...</p>
        <style>
          {`
            @keyframes squarePulse {
              0%, 100% { transform: scale(0.6); opacity: 0.4; }
              50% { transform: scale(1); opacity: 1; }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Loading;
