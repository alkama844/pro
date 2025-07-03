import React from 'react';
import { Code, Database, Smartphone, Zap, Star, Award } from 'lucide-react';

const About: React.FC = () => {
  const skills = [
    { icon: Code, name: 'Frontend Dev', level: 95 },
    { icon: Database, name: 'Backend Dev', level: 88 },
    { icon: Smartphone, name: 'Mobile Dev', level: 82 },
    { icon: Zap, name: 'Performance', level: 92 },
  ];

  return (
    <section id="about-me" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              ABOUT ME
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-cyan-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Profile Section */}
          <div className="relative">
            <div className="relative group">
              {/* Profile Image Container */}
              <div className="relative w-80 h-80 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin-reverse-slow"></div>
                <div className="absolute inset-4 bg-black rounded-full flex items-center justify-center">
                  <img 
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt="NAFIJ RAHAMAN" 
                    className="w-64 h-64 rounded-full object-cover border-4 border-cyan-400/30"
                  />
                </div>
                
                {/* Floating Icons */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-cyan-500 to-purple-600 p-3 rounded-full animate-float">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-500 to-cyan-500 p-3 rounded-full animate-float-delayed">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-orbitron font-bold text-white mb-4">
                NAFIJ RAHAMAN
              </h3>
              <p className="text-xl text-cyan-400 font-space mb-6">
                Futuristic Developer & Digital Innovator
              </p>
              <p className="text-gray-300 font-space text-lg leading-relaxed mb-8">
                I'm a passionate developer who believes in creating the future today. With expertise in 
                cutting-edge technologies and a vision for tomorrow, I craft digital experiences that 
                push the boundaries of what's possible. Every line of code is a step toward a more 
                connected, intelligent, and beautiful digital world.
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-6">
              <h4 className="text-2xl font-orbitron font-bold text-white mb-6">
                Core Skills
              </h4>
              {skills.map((skill, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <skill.icon className="w-6 h-6 text-cyan-400 group-hover:text-green-400 transition-colors duration-300" />
                      <span className="text-white font-space font-medium">{skill.name}</span>
                    </div>
                    <span className="text-cyan-400 font-space font-bold">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-green-400 rounded-full transition-all duration-1000 ease-out transform origin-left"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center group">
                <div className="text-3xl font-orbitron font-bold text-cyan-400 group-hover:text-green-400 transition-colors duration-300">50+</div>
                <div className="text-gray-400 font-space text-sm">Projects</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-orbitron font-bold text-cyan-400 group-hover:text-green-400 transition-colors duration-300">3+</div>
                <div className="text-gray-400 font-space text-sm">Years Exp</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-orbitron font-bold text-cyan-400 group-hover:text-green-400 transition-colors duration-300">24/7</div>
                <div className="text-gray-400 font-space text-sm">Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;