import tailwindcss from "tailwindcss";

export default {
  plugins: [tailwindcss],
  theme: {
    extend: {
      colors: {
        'purple-navy': '#000853',
        'purple-deep': '#6A19CD',
        'purple-primary': '#761BE4',
        'purple-light': '#CBB6E5',
        'purple-extra-light': '#f3e6ff',
        'red-deep': '#ef4444',
        'red-light': '#FEECEC',
        'gray-light': '#FAF9FA'
      }
    }
  }
}
