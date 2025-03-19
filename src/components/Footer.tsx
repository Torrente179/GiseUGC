
import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-playfair font-semibold mb-6">Portafolio<span className="text-3xl">.</span></h3>
            <p className="text-white/70 mb-6">
              Creando contenido UGC auténtico que impulsa el engagement y convierte a los espectadores en clientes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-6">Servicios</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Videos UGC</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Fotografía de Productos</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Contenido para E-commerce</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Videos de Reseñas</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li><a href="#home" className="text-white/70 hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#services" className="text-white/70 hover:text-white transition-colors">Servicios</a></li>
              <li><a href="#portfolio" className="text-white/70 hover:text-white transition-colors">Portafolio</a></li>
              <li><a href="#testimonials" className="text-white/70 hover:text-white transition-colors">Testimonios</a></li>
              <li><a href="#contact" className="text-white/70 hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-6">Contacto</h3>
            <ul className="space-y-3">
              <li className="text-white/70">Email: contacto@ejemplo.com</li>
              <li className="text-white/70">Fiverr: fiverr.com/nombredeusuario</li>
              <li>
                <a 
                  href="https://www.fiverr.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2.5 rounded-full bg-white text-primary font-medium hover-grow"
                >
                  Contrátame en Fiverr
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-white/60">
            © {year} Portafolio UGC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
