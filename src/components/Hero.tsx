import React, { useState, useEffect } from 'react';
import { ChevronDown, Terminal, Code, Zap } from 'lucide-react';

const Hero: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const texts = [
    'Welcome to the Future',
    'Experience Tomorrow Today',
    'Futuristic Innovation',
    'Digital Evolution'
  ];

  useEffect(() => {
    const currentText = texts[currentIndex];
    let charIndex = 0;
    
    const typeWriter = () => {
      if (charIndex < currentText.length) {
        setDisplayText(currentText.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(typeWriter, 100);
      } else {
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % texts.length);
          setDisplayText('');
        }, 2000);
      }
    };

    typeWriter();
  }, [currentIndex]);

  const scrollToAbout = () => {
    const element = document.getElementById('about-me');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Terminal className="w-12 h-12 text-cyan-400/30" />
      </div>
      <div className="absolute top-40 right-20 animate-float-delayed">
        <Code className="w-16 h-16 text-purple-500/30" />
      </div>
      <div className="absolute bottom-40 left-20 animate-float">
        <Zap className="w-10 h-10 text-green-400/30" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-orbitron font-black mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              FUTURESTICK
            </span>
          </h1>
          
          <div className="h-20 flex items-center justify-center">
            <h2 className="text-2xl md:text-4xl font-space font-bold text-white">
              <span className="text-cyan-400">{displayText}</span>
              <span className="animate-pulse text-cyan-400">|</span>
            </h2>
          </div>
        </div>

        <p className="text-lg md:text-xl text-gray-300 font-space mb-12 max-w-3xl mx-auto leading-relaxed">
          Step into tomorrow with cutting-edge design and futuristic technology. 
          Experience the next generation of digital innovation.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <button 
            onClick={scrollToAbout}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-space font-bold text-white text-lg hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
          >
            <span className="relative z-10">Explore Future</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          </button>
          
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group px-8 py-4 border-2 border-cyan-400 rounded-full font-space font-bold text-cyan-400 text-lg hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/25"
          >
            Get Connected
          </button>
        </div>

        {/* Scroll Indicator */}
        <div 
          onClick={scrollToAbout}
          className="animate-bounce cursor-pointer mx-auto w-12 h-12 border-2 border-cyan-400 rounded-full flex items-center justify-center hover:bg-cyan-400/10 transition-all duration-300"
        >
          <ChevronDown className="w-6 h-6 text-cyan-400" />
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-to-t from-cyan-500/20 to-transparent blur-3xl"></div>
    </section>
  );
};

export default Hero;