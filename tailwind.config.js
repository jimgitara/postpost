/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        cyber: ['Orbitron', 'monospace'],
        tech: ['Rajdhani', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
      colors: {
        primary: {
          50: '#0a0a0f',
          100: '#1a1a2e',
          200: '#16213e',
          300: '#0f3460',
          400: '#e94560',
          500: '#00d4ff',
          600: '#0099cc',
          700: '#006699',
          800: '#004466',
          900: '#002233',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        neon: {
          blue: '#00d4ff',
          pink: '#ff0080',
          green: '#00ff88',
          purple: '#8b5cf6',
          orange: '#ff6b35',
        },
        dark: {
          100: '#0a0a0f',
          200: '#1a1a2e',
          300: '#16213e',
          400: '#0f3460',
          500: '#1e293b',
          600: '#334155',
          700: '#475569',
          800: '#64748b',
          900: '#94a3b8',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulseNeon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'cyber-grid': 'cyberGrid 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 15px #00d4ff' },
          '100%': { boxShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff' },
        },
        pulseNeon: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        cyberGrid: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50px)' },
        },
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 25%, #16213e 50%, #0f3460 100%)',
        'neon-gradient': 'linear-gradient(135deg, #00d4ff 0%, #ff0080 50%, #8b5cf6 100%)',
        'grid-pattern': 'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};