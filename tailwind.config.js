module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    height: ["responsive", "hover", "focus"],
    width: ["responsive", "hover", "focus"],
    // extend: {},
  },
  plugins: [],
};
