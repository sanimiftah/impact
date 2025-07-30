/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        impact: '#CCE3DE',       // Soft green for growth
        reflection: '#EAF4F4',   // Light blue for clarity
        collaboration: '#A4C3B2',// Earthy tone for unity
        empowerment: '#6B9080',  // Deep green for strength
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Merriweather', 'serif'],
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  safelist: [
    'bg-impact', 'bg-reflection', 'bg-collaboration', 'bg-empowerment',
    'text-impact', 'text-reflection', 'text-collaboration', 'text-empowerment',
    'hover:bg-impact', 'hover:bg-reflection',
    'grid-cols-1', 'grid-cols-2', 'grid-cols-3'
  ],
  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
