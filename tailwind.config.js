/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.html", // Kalau plain HTML
    "./views/**/*.ejs",  // Kalau pakai EJS
    "./views/**/*.pug",  // Kalau pakai Pug
    "./views/**/*.hbs",  // Kalau pakai Handlebars
    "./public/**/*.js"   // Kalau ada script JS yang pakai class Tailwind
  ],
  theme: { extend: {} },
  plugins: [],
};

