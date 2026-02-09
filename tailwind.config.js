/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Safelist all color classes used dynamically in CustomNode
  safelist: [
    // Backgrounds
    'bg-slate-100', 'bg-slate-50', 'bg-blue-50', 'bg-emerald-50', 'bg-green-50',
    'bg-amber-50', 'bg-rose-50', 'bg-red-50', 'bg-purple-50', 'bg-cyan-50',
    'bg-orange-50', 'bg-indigo-50', 'bg-pink-50',
    // Borders
    'border-slate-300', 'border-slate-200', 'border-blue-200', 'border-emerald-200',
    'border-green-200', 'border-amber-200', 'border-rose-200', 'border-red-200',
    'border-purple-200', 'border-cyan-200', 'border-orange-200', 'border-indigo-200',
    'border-pink-200',
    // Text
    'text-slate-700', 'text-blue-700', 'text-emerald-700', 'text-green-700',
    'text-amber-700', 'text-rose-700', 'text-red-700', 'text-purple-700',
    'text-cyan-700', 'text-orange-700', 'text-indigo-700', 'text-pink-700',
    // Rings
    'ring-slate-400', 'ring-blue-400', 'ring-emerald-400', 'ring-green-400',
    'ring-amber-400', 'ring-rose-400', 'ring-red-400', 'ring-purple-400',
    'ring-cyan-400', 'ring-orange-400', 'ring-indigo-400', 'ring-pink-400',
    // Additional color variants for PropertiesPanel presets
    'bg-slate-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-rose-500', 'bg-purple-500', 'bg-cyan-500',
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
