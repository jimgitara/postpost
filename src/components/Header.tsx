import React, { useState } from 'react';
import { Zap, Mail, User, Menu, X, Heart } from 'lucide-react';
import CartIcon from './CartIcon';
import ShoppingCart from './ShoppingCart';

interface HeaderProps {
  onStartCreating: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStartCreating }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-slate-900/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-blue-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.location.reload()}>
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl group-hover:scale-110 transition-all duration-300">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl opacity-20 blur-sm group-hover:opacity-40 transition-opacity"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                RetroPost
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('gallery')}
                className="text-gray-300 hover:text-blue-400 transition-all duration-300 font-medium relative group"
              >
                Galerija
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-300 hover:text-blue-400 transition-all duration-300 font-medium relative group"
              >
                Kako funkcionira
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-300 hover:text-blue-400 transition-all duration-300 font-medium relative group"
              >
                O nama
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-300 hover:text-blue-400 transition-all duration-300 font-medium relative group"
              >
                Kontakt
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-300 hover:text-pink-400 transition-all duration-300">
                <Mail className="h-4 w-4" />
                <span>Moje razglednice</span>
              </button>
              <CartIcon onClick={() => setIsCartOpen(true)} />
              <button 
                onClick={onStartCreating}
                className="relative flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Heart className="h-4 w-4 relative z-10" />
                <span className="relative z-10">Počni kreirati</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-blue-400 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-blue-400/20 animate-slide-up bg-slate-800/50 backdrop-blur-sm rounded-b-xl">
              <nav className="flex flex-col space-y-4">
                <button 
                  onClick={() => scrollToSection('gallery')}
                  className="text-left text-gray-300 hover:text-blue-400 transition-colors font-medium"
                >
                  Galerija
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-left text-gray-300 hover:text-blue-400 transition-colors font-medium"
                >
                  Kako funkcionira
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-left text-gray-300 hover:text-blue-400 transition-colors font-medium"
                >
                  O nama
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-left text-gray-300 hover:text-blue-400 transition-colors font-medium"
                >
                  Kontakt
                </button>
                <div className="flex flex-col space-y-2 pt-2">
                  <button className="flex items-center space-x-2 text-gray-300 hover:text-pink-400 transition-colors">
                    <Mail className="h-4 w-4" />
                    <span>Moje razglednice</span>
                  </button>
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    <CartIcon onClick={() => setIsCartOpen(true)} />
                  </button>
                  <button 
                    onClick={onStartCreating}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Počni kreirati</span>
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Shopping Cart Sidebar */}
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;