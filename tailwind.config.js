/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          canvas: "#0D1117",
          card: "#161D26",
          border: "#26333D",
          mint: "#00FF9D",
          teal: "#06B6D4",
          bright: "#F0FDF4",
          muted: "#869D95",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-mint': '0 0 25px -5px rgba(0, 255, 157, 0.3)',
        'glow-teal': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
      }
    },
  },
  plugins: [],
}
