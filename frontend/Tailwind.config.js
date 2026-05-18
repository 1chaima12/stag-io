/** @type {import('tailwindcss').Config} */
const Config= {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Stag.io palette
        soft:  "#D1E9F6",  // soft blue
        cream: "#F6EACB",  // warm cream
        blush: "#F1D3CE",  // blush pink
        rose:  "#EECAD5",  // dusty rose
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      // إضافة حركات (Animations) لجعل الواجهة سلسة
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    // لإضافة كلاسات مخصصة مثل input-field و shimmer-btn
    function({ addComponents }) {
      addComponents({
        '.input-field': {
          '@apply w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-soft focus:border-blue-400': {},
        },
        '.shimmer-btn': {
          '@apply bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all active:scale-95': {},
        },
        '.card': {
          '@apply bg-white border border-slate-200 rounded-2xl shadow-sm': {},
        },
        '.badge': {
          '@apply px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5': {},
        },
      })
    }
  ],
};
export default Config;