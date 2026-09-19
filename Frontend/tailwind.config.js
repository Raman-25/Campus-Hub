/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e40af', // deep blue — CampusHub brand
          dark: '#152a72',
          light: '#3b5fd9',
        },
        accent: {
          DEFAULT: '#0ea5e9', // cyan accent
          soft: '#e0f2fe',
        },
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#d97706',
        surface: '#ffffff',
        canvas: '#f5f7fb',
        ink: {
          DEFAULT: '#1f2937',
          muted: '#6b7280',
          faint: '#9ca3af',
        },
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 45px -20px rgba(30, 64, 175, 0.35)',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(-60px, -60px)' },
        },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '60%': { opacity: '1', transform: 'scale(1.03)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        drift: 'drift 40s linear infinite',
        riseIn: 'riseIn 0.45s ease-out',
        popIn: 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
