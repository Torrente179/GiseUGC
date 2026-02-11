
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuario intentó acceder a una ruta inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/35 p-6">
      <div className="text-center cafe-panel p-10 max-w-lg w-full">
        <h1 className="text-5xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-6">¡Ups! Página no encontrada</p>
        <a href="/" className="btn-primary-nordic px-6 py-2.5 hover-grow">
          Volver al Inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
