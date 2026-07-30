import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B3B60',
          light: '#1A5A8A',
          dark: '#072840',
        },
        secondary: {
          DEFAULT: '#F0F8FF',
          light: '#FFFFFF',
          dark: '#D4E8F7',
        },
        accent: {
          DEFAULT: '#3A8DFF',
          light: '#6BAAFF',
          dark: '#1A6FD4',
        },
        danger: {
          DEFAULT: '#D9534F',
          light: '#E47D7A',
          dark: '#C9302C',
        },
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
