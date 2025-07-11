// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       fontFamily: {
//         headings: ["Poppins"], // For headings (weight: 600/700)
//         content: ["Poppins"], // For content (weight: 400)
//         buttons: ["Poppins"], // For buttons (weight: 600)
//         tableHeadings: ["Poppins"], // For table headings (weight: 600/700)
//         tableData: ["Poppins"], // For table data (weight: 400)
//       },
//     },
//   },
//   plugins: [require("tailwind-scrollbar-hide")],
// };


export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        headings: ["Inter", "sans-serif"], // For headings (weight: 600/700)
        content: ["Inter", "sans-serif"], // For content (weight: 400)
        buttons: ["Inter", "sans-serif"], // For buttons (weight: 600)
        tableHeadings: ["Inter", "sans-serif"], // For table headings (weight: 600/700)
        tableData: ["Inter", "sans-serif"], // For table data (weight: 400)
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};