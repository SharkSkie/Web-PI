/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
      },
      colors: {
        primary: {
          50: '#f5f5f7',
          100: '#e8e8ed',
          200: '#d2d2d7',
          300: '#86868b',
          400: '#3399ff',
          500: '#0071e3',
          600: '#0071e3',
          700: '#0066cc',
          800: '#0044aa',
          900: '#002266',
        },
        calm: {
          bg: '#ffffff',
          card: '#f5f5f7',
          text: '#1d1d1f',
          muted: '#86868b'
        },
        indigo: {
          50: '#f5f5f7',
          100: '#e8e8ed',
          200: '#d2d2d7',
          300: '#86868b',
          400: '#3399ff',
          500: '#0071e3',
          600: '#0071e3',
          700: '#0066cc',
          800: '#0044aa',
          900: '#002266',
        },
        violet: {
          50: '#f5f5f7',
          100: '#e8e8ed',
          200: '#d2d2d7',
          300: '#86868b',
          400: '#515154',
          500: '#1d1d1f',
          600: '#1d1d1f',
          700: '#161617',
          800: '#000000',
          900: '#000000',
        },
        purple: {
          50: '#f5f5f7',
          100: '#e8e8ed',
          200: '#d2d2d7',
          300: '#86868b',
          400: '#515154',
          500: '#1d1d1f',
          600: '#1d1d1f',
          700: '#161617',
          800: '#000000',
          900: '#000000',
        },
        slate: {
          50: '#f5f5f7',
          100: '#e8e8ed',
          200: '#d2d2d7',
          300: '#86868b',
          400: '#86868b',
          500: '#6e6e73',
          600: '#515154',
          700: '#333336',
          800: '#1d1d1f',
          900: '#161617',
        }
      },
      backgroundImage: {
        'gradient-calm': 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)',
        'gradient-primary': 'linear-gradient(180deg, #0071e3, #0066cc)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
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
    },
  },
  plugins: [],
}
