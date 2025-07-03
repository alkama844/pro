/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'space': ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        'cyber': {
          'blue': '#00D9FF',
          'purple': '#B026FF',
          'green': '#39FF14',
          'pink': '#FF006E',
          'orange': '#FF8500',
        },
        'matrix': {
          'green': '#00FF41',
        },
        'neon': {
          'cyan': '#00FFFF',
          'magenta': '#FF00FF',
          'yellow': '#FFFF00',
        }
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse-slow': 'spin 15s linear infinite reverse',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'matrix': 'matrix 0.1s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        glow: {
          from: {
            textShadow: '0 0 5px #00d9ff, 0 0 10px #00d9ff, 0 0 15px #00d9ff',
          },
          to: {
            textShadow: '0 0 10px #00d9ff, 0 0 20px #00d9ff, 0 0 30px #00d9ff',
          },
        },
        matrix: {
          '0%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.cyan.400"), 0 0 10px theme("colors.cyan.400"), 0 0 15px theme("colors.cyan.400")',
        'neon-purple': '0 0 5px theme("colors.purple.400"), 0 0 10px theme("colors.purple.400"), 0 0 15px theme("colors.purple.400")',
        'neon-green': '0 0 5px theme("colors.green.400"), 0 0 10px theme("colors.green.400"), 0 0 15px theme("colors.green.400")',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
};