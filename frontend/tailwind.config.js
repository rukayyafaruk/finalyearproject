/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        outfit: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        /* Warm Forest Green — confidence, growth, trust */
        forest: {
          50:  '#f2f7f4',
          100: '#e0ede5',
          200: '#c0dbcc',
          300: '#94c2a9',
          400: '#61a47f',
          500: '#3d855e',
          600: '#2c6a49',
          700: '#22533a',
          800: '#1b412e',
          900: '#163526',
          950: '#0c2118',
        },
        /* Warm Gold — warmth, premium, energy */
        gold: {
          50:  '#fdfbf0',
          100: '#faf4d3',
          200: '#f5e8a1',
          300: '#eed665',
          400: '#e5c035',
          500: '#d4a017',
          600: '#b97d10',
          700: '#925e0f',
          800: '#784b14',
          900: '#643e17',
          950: '#3a210a',
        },
        /* Warm Parchment — background feel */
        parchment: '#faf8f3',
        /* Muted slate with warm undertone */
        warm: {
          50:  '#faf9f7',
          100: '#f2f0eb',
          200: '#e4e0d8',
          300: '#cfc9be',
          400: '#b5ad9f',
          500: '#9b9285',
          600: '#807870',
          700: '#68615b',
          800: '#54504b',
          900: '#46433f',
          950: '#26231f',
        },
      },
      backgroundImage: {
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233d855e' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'card': '0 2px 16px 0 rgba(34, 83, 58, 0.08), 0 1px 4px 0 rgba(34, 83, 58, 0.04)',
        'card-hover': '0 8px 32px 0 rgba(34, 83, 58, 0.14), 0 2px 8px 0 rgba(34, 83, 58, 0.08)',
        'gold': '0 4px 20px 0 rgba(212, 160, 23, 0.30)',
        'forest': '0 4px 20px 0 rgba(61, 133, 94, 0.25)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'count-up': 'countUp 1s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [forms],
};
