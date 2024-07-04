module.exports = {
  content: [`./views/**/*.ejs`], // Change to include .ejs files
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["fantasy"],
  },
};
