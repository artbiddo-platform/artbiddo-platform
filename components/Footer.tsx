import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* ArtBiddo Info */}
          <div className="lg:col-span-2">
            <h3 className="text-xl sm:text-2xl font-light tracking-wider mb-4 sm:mb-6">ARTBIDDO</h3>
            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed max-w-md text-sm sm:text-base">
              ArtBiddo es la plataforma líder en subastas de arte contemporáneo en línea. 
              Conectamos a coleccionistas con obras únicas de artistas reconocidos y emergentes, 
              ofreciendo una experiencia de subasta profesional y accesible.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-medium mb-4 sm:mb-6 tracking-wide">Enlaces Rápidos</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/subastas" className="text-gray-300 hover:text-white transition-colors font-light text-sm sm:text-base">
                  Subastas
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-gray-300 hover:text-white transition-colors font-light text-sm sm:text-base">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/artistas" className="text-gray-300 hover:text-white transition-colors font-light text-sm sm:text-base">
                  Artistas
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="text-gray-300 hover:text-white transition-colors font-light text-sm sm:text-base">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-white transition-colors font-light text-sm sm:text-base">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-medium mb-4 sm:mb-6 tracking-wide">Contacto</h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-light text-sm sm:text-base">
                    Madrid, España<br />
                    Oficina Central<br />
                    Plaza Mayor, 1
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 font-light text-sm sm:text-base">+34 91 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 font-light text-sm sm:text-base">info@artbiddo.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-xs sm:text-sm font-light text-center md:text-left">
              © 2024 ArtBiddo. Todos los derechos reservados.
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <Link href="/privacidad" className="text-gray-400 hover:text-white transition-colors font-light">
                Política de Privacidad
              </Link>
              <Link href="/terminos" className="text-gray-400 hover:text-white transition-colors font-light">
                Términos de Servicio
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors font-light">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
