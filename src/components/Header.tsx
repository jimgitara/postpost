import React from 'react';
import { Zap, Mail, User, Menu, X, BrainCircuit as Circuit } from 'lucide-react';

interface HeaderProps {
  onStartCreating: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStartCreating }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-dark-100/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-neon-blue/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.location.reload()}>
            <div className="relative">
              <div className="bg-neon-gradient p-3 rounded-xl group-hover:animate-glow transition-all duration-300">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-neon-gradient p-3 rounded-xl opacity-20 blur-sm group-hover:opacity-40 transition-opacity"></div>
            </div>
            <span className="text-2xl font-cyber font-bold bg-neon-gradient bg-clip-text text-transparent">
              RetroPost
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('gallery')}
              className="text-gray-300 hover:text-neon-blue transition-all duration-300 font-tech font-medium relative group"
            >
              Galerija
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-blue transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-300 hover:text-neon-blue transition-all duration-300 font-tech font-medium relative group"
            >
              Kako funkcionira
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-blue transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-neon-blue transition-all duration-300 font-tech font-medium relative group"
            >
              O nama
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-blue transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-neon-blue transition-all duration-300 font-tech font-medium relative group"
            >
              Kontakt
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-blue transition-all duration-300 group-hover:w-full"></span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-300 hover:text-neon-pink transition-all duration-300 font-tech">
              <Mail className="h-4 w-4" />
              <span>Moje razglednice</span>
            </button>
            <button 
              onClick={onStartCreating}
              className="relative flex items-center space-x-2 bg-neon-gradient text-white px-6 py-3 rounded-xl font-tech font-semibold hover:shadow-lg hover:shadow-neon-blue/25 transition-all duration-300 transform hover:scale-105 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <Circuit className="h-4 w-4 relative z-10" />
              <span className="relative z-10">Počni kreirati</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-neon-blue transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neon-blue/20 animate-slide-up bg-dark-200/50 backdrop-blur-sm rounded-b-xl">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('gallery')}
                className="text-left text-gray-300 hover:text-neon-blue transition-colors font-tech font-medium"
              >
                Galerija
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-left text-gray-300 hover:text-neon-blue transition-colors font-tech font-medium"
              >
                Kako funkcionira
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left text-gray-300 hover:text-neon-blue transition-colors font-tech font-medium"
              >
                O nama
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left text-gray-300 hover:text-neon-blue transition-colors font-tech font-medium"
              >
                Kontakt
              </button>
              <div className="flex flex-col space-y-2 pt-2">
                <button className="flex items-center space-x-2 text-gray-300 hover:text-neon-pink transition-colors font-tech">
                  <Mail className="h-4 w-4" />
                  <span>Moje razglednice</span>
                </button>
                <button 
                  onClick={onStartCreating}
                  className="flex items-center justify-center space-x-2 bg-neon-gradient text-white px-4 py-3 rounded-xl font-tech font-semibold hover:shadow-lg hover:shadow-neon-blue/25 transition-all duration-300"
                >
                  <Circuit className="h-4 w-4" />
                  <span>Počni kreirati</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;