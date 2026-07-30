/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}', './index.html'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Clash Display', 'Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#2C6BA8',
          mid: '#4A8DC9',
          light: '#6FB0E3',
          soft: '#E6F1FA',
        },
        accent: {
          DEFAULT: '#7AB648',
          light: '#A8D96F',
          soft: '#EDF7E2',
        },
        warm: {
          DEFAULT: '#F2A93B',
          light: '#FFCB77',
        },
        live: '#4FC3C7',
        vivid: '#E8776B',
        success: '#5EC6A0',
        dark: '#14324D',
      },
      maxWidth: { site: '1320px' },
      screens: {
        xs: '480px',
      },
      animation: {
        shimmer: 'shimmer 1.6s linear infinite',
        marquee: 'marquee 28s linear infinite',
        float: 'float 9s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        float: {
          from: { transform: 'translateY(0) translateX(0)' },
          to: { transform: 'translateY(-22px) translateX(16px)' },
        },
      },
    },
  },
  plugins: [],
};
