const { heroui } = require('@heroui/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}', './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        bell: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-15deg)' },
          '75%': { transform: 'rotate(15deg)' },
        },
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.1 },
          '50%': { transform: 'scale(1.2)', opacity: 0.4 },
        },
      },
      animation: {
        'ring-bell': 'bell 0.6s ease-in-out',
        'pulse-glow': 'pulseGlow 1.5s ease-in-out infinite',
      },
    },
  },
  darkMode: false,
  plugins: [
    heroui({
      layout: {
        radius: {},
      },
      themes: {
        light: {},
      },
    }),
  ],
};
