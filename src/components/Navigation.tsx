import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Crown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about-me' },
    { name: 'Projects', id: 'projects' },
    { name: 'Contact', id: 'contact' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="relative z-40 bg-black/90 backdrop-blur-md border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group" 
            onClick={() => scrollToSection('home')}
          >
            <div className="relative">
              <Crown className="w-8 h-8 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300 animate-pulse" />
              <div className="absolute inset-0 animate-spin-slow">
                <Crown className="w-8 h-8 text-yellow-400 opacity-20" />
              </div>
            </div>
            <span className="text-xl font-orbitron font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              NAFIJPRO👑
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative px-3 py-2 text-sm font-space font-medium text-gray-300 hover:text-yellow-400 transition-colors duration-300 group"
              >
                {item.name}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </button>
            ))}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-yellow-400" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-yellow-400" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-yellow-400" />
              ) : (
                <Menu className="w-6 h-6 text-yellow-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden bg-black/95 backdrop-blur-md border-t border-yellow-500/20`}>
        <div className="px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="block w-full text-left px-4 py-3 text-sm font-space font-medium text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-all duration-300"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;