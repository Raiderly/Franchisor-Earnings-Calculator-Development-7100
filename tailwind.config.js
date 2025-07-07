/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      colors: {
        'afi-navy': '#1a2c43',
        'afi-red': '#c0392b',
        'afi-light-gray': '#f8f9fa',
      }
    },
    fontFamily: {
      'sans': ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
    },
  },
  plugins: [],
  safelist: [
    'text-afi-navy',
    'text-afi-red',
    'bg-afi-navy',
    'bg-afi-red',
    'bg-afi-light-gray',
    'border-afi-navy',
    'border-afi-red',
  ],
}