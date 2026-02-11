
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-cream via-secondary/60 to-brand-sand/45 p-6">
      <div className="text-center cafe-panel p-10 max-w-lg w-full">
        <h1 className="text-5xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-6">¡Ups! Página no encontrada</p>
        <a href="/" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-brand-teal px-6 py-2.5 text-primary-foreground hover-grow">
          Volver al Inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
