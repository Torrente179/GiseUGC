import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getHomePath, getLocaleFromPath } from "@/lib/locale-path";

const NotFound = () => {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const copy = locale === "en"
    ? {
        title: "Oops! Page not found",
        action: "Back to Home",
      }
    : {
        title: "¡Ups! Página no encontrada",
        action: "Volver al Inicio",
      };

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
        <p className="text-xl text-muted-foreground mb-6">{copy.title}</p>
        <a href={getHomePath(locale)} className="btn-primary-nordic px-6 py-2.5 hover-grow">
          {copy.action}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
