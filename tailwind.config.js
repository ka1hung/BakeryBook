/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFFAF0',
          100: '#FDF5E6',
          200: '#FAEBD7',
          300: '#FFE4B5',
          400: '#DEB887',
          500: '#D2691E',
          600: '#CD853F',
          700: '#8B4513',  // Main primary
          800: '#A0522D',
          900: '#5D4037',
        },
        bakery: {
          cream: '#FFFAF0',
          lace: '#FDF5E6',
          wheat: '#F5DEB3',
          tan: '#D2B48C',
          peru: '#CD853F',
          chocolate: '#D2691E',
          sienna: '#A0522D',
          saddle: '#8B4513',
          coffee: '#5D4037',
          espresso: '#3E2723',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'bakery': '0 2px 12px rgba(139, 69, 19, 0.08)',
        'bakery-lg': '0 4px 20px rgba(139, 69, 19, 0.12)',
      },
      borderRadius: {
        'DEFAULT': '8px',
      },
    },
  },
  plugins: [],
  // Prevent conflicts with Ant Design
  corePlugins: {
    preflight: false,
  },
}
