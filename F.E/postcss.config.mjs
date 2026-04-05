export default {
  plugins: {
    "@tailwindcss/postcss": {
      config: "./tailwind.config.js",
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
      ],
      theme: {
        extend: {
          colors: {
            primary: "#C9A85D",
            primaryHover: "#F5D98A",
          },
        },
      },
    },
  },
};
