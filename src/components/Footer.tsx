import React from 'react';
import { Zap, Mail, Phone, MapPin, Facebook, Instagram, Twitter, BrainCircuit as Circuit } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-100 text-white py-16 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px]"></div>
      </div>

      {/* Glowing Lines */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-neon-gradient"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="bg-neon-gradient p-3 rounded-xl group-hover:animate-glow transition-all duration-300">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-neon-gradient p-3 rounded-xl opacity-20 blur-sm"></div>
              </div>
              <span className="text-xl font-cyber font-bold bg-neon-gradient bg-clip-text text-transparent">RetroPost</span>
            </div>
            <p className="text-gray-400 leading-relaxed font-tech">
              Kreirajte i pošaljite futurističke digitalne razglednice koje će oduševiti vaše voljene kroz cyber prostor.
            </p>
            <div className="flex space-x-4">
              <button className="bg-dark-200/50 hover:bg-neon-blue/20 p-3 rounded-lg transition-all duration-300 border border-neon-blue/20 hover:border-neon-blue/40 group">
                <Facebook className="h-5 w-5 text-gray-400 group-hover:text-neon-blue transition-colors" />
              </button>
              <button className="bg-dark-200/50 hover:bg-neon-pink/20 p-3 rounded-lg transition-all duration-300 border border-neon-pink/20 hover:border-neon-pink/40 group">
                <Instagram className="h-5 w-5 text-gray-400 group-hover:text-neon-pink transition-colors" />
              </button>
              <button className="bg-dark-200/50 hover:bg-neon-blue/20 p-3 rounded-lg transition-all duration-300 border border-neon-blue/20 hover:border-neon-blue/40 group">
                <Twitter className="h-5 w-5 text-gray-400 group-hover:text-neon-blue transition-colors" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-cyber font-semibold mb-4 text-neon-blue">Brze veze</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-neon-blue transition-colors font-tech hover:translate-x-1 transform duration-200 inline-block">Galerija</a></li>
              <li><a href="#" className="text-gray-400 hover:text-neon-blue transition-colors font-tech hover:translate-x-1 transform duration-200 inline-block">Kako funkcionira</a></li>
              <li><a href="#" className="text-gray-400 hover:text-neon-blue transition-colors font-tech hover:translate-x-1 transform duration-200 inline-block">Predlošci</a></li>
              <li><a href="#" className="text-gray-400 hover:text-neon-blue transition-colors font-tech hover:translate-x-1 transform duration-200 inline-block">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-cyber font-semibold mb-4 text-neon-pink">Podrška</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-neon-pink transition-colors font-tech hover:translate-x-1 transform duration-200 inline-block">Kontakt</a></li>
              <li><a href="#" className="text-gray-400 hover:text-neon-pink transition-colors font-tech hover:translate-x-1 transform duration-200 inline-block">Česta pitanja</a></li>
              <li><a href="#" className="text-gray-400 hover:text-neon-pink transition-colors font-tech hover:translate-x-1 transform duration-200 inline-block">Pomoć</a></li>
              <li><a href="#" className="text-gray-400 hover:text-neon-pink transition-colors font-tech hover:translate-x-1 transform duration-200 inline-block">Uvjeti korištenja</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-cyber font-semibold mb-4 text-neon-green flex items-center">
              <Circuit className="h-5 w-5 mr-2" />
              Kontakt
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 group">
                <Mail className="h-4 w-4 text-neon-blue group-hover:animate-pulse-neon" />
                <span className="text-gray-400 font-tech">jimgitara@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <Phone className="h-4 w-4 text-neon-blue group-hover:animate-pulse-neon" />
                <span className="text-gray-400 font-tech">+385 1 234 5678</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <MapPin className="h-4 w-4 text-neon-blue group-hover:animate-pulse-neon" />
                <span className="text-gray-400 font-tech">Zagreb, Hrvatska</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neon-blue/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm font-tech">
            © 2024 RetroPost. Sva prava pridržana u cyber prostoru.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-neon-blue text-sm transition-colors font-tech">Privatnost</a>
            <a href="#" className="text-gray-400 hover:text-neon-blue text-sm transition-colors font-tech">Uvjeti</a>
            <a href="#" className="text-gray-400 hover:text-neon-blue text-sm transition-colors font-tech">Kolačići</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;