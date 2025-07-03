import React from 'react';
import { ExternalLink, Github, Zap, Smartphone, Globe, Database } from 'lucide-react';

const Projects: React.FC = () => {
  const projects = [
    {
      title: 'Neural Network Dashboard',
      description: 'AI-powered analytics platform with real-time data visualization and machine learning insights.',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
      tech: ['React', 'Python', 'TensorFlow', 'WebGL'],
      icon: Zap,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Quantum Mobile App',
      description: 'Next-generation mobile application with quantum-inspired UI and advanced performance optimization.',
      image: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=600',
      tech: ['React Native', 'TypeScript', 'GraphQL', 'WebRTC'],
      icon: Smartphone,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Holographic Web Portal',
      description: 'Immersive web experience with 3D holographic elements and spatial computing integration.',
      image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600',
      tech: ['Three.js', 'WebXR', 'GLSL', 'WebAssembly'],
      icon: Globe,
      gradient: 'from-green-500 to-teal-500'
    },
    {
      title: 'Blockchain Data Engine',
      description: 'Decentralized data processing system with smart contracts and real-time blockchain analytics.',
      image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600',
      tech: ['Solidity', 'Web3.js', 'Node.js', 'MongoDB'],
      icon: Database,
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      
      {/* Circuit Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 10h20M10 0v20M5 5h10v10H5z" stroke="currentColor" strokeWidth="0.5" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" className="text-cyan-400"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              PROJECTS
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 mx-auto rounded-full"></div>
          <p className="text-gray-300 font-space text-lg mt-6 max-w-2xl mx-auto">
            Explore my latest innovations in the digital frontier
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800 hover:border-cyan-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                {/* Floating Icon */}
                <div className={`absolute top-4 right-4 p-3 rounded-full bg-gradient-to-r ${project.gradient} shadow-lg`}>
                  <project.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-orbitron font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-300 font-space mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 text-xs font-space font-medium bg-gray-800/50 text-cyan-400 rounded-full border border-cyan-500/20 hover:border-cyan-400/40 transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg font-space font-medium text-white hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105">
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg font-space font-medium text-gray-300 hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300">
                    <Github className="w-4 h-4" />
                    <span>Code</span>
                  </button>
                </div>
              </div>

              {/* Glow Effect */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r ${project.gradient} blur-xl`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;