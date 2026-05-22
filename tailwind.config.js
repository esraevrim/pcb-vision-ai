/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#060B14',
        'bg-surface': '#0D1526',
        'bg-card': '#111F3A',
        'border-dim': '#1E3A5F',
        'accent': '#00A8FF',
        'accent-dim': '#0066CC',
        'success': '#00E676',
        'danger': '#FF1744',
        'warning': '#FF9100',
        'text-primary': '#E8F4FF',
        'text-secondary': '#6B8CAE',
        'text-muted': '#3A5A7A',
      },
    },
  },
  plugins: [],
};
