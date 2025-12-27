import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: {
          light: '#f8fafc',
          dark: '#0f0f23',
          DEFAULT: '#0f0f23',
        },
        surface: {
          light: '#ffffff',
          dark: '#1e1e2e',
          DEFAULT: '#1e1e2e',
        },
        accent: {
          green: '#10b981',
          blue: '#3b82f6',
          orange: '#f59e0b',
          red: '#ef4444',
          purple: '#a855f7',
        },
      },
      boxShadow: {
        glow: '0 10px 60px rgba(59, 130, 246, 0.25)',
      },
      backgroundImage: {
        'grid-sparse': 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      animation: {
        pulseSlow: 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

