/** Couleurs basées sur des variables CSS, avec support des modificateurs d'opacité (ex. bg-accent/10). */
const withAlpha = (name) => ({ opacityValue }) => {
  if (opacityValue === undefined) return `var(--${name})`;
  const n = parseFloat(opacityValue);
  if (Number.isNaN(n)) return `var(--${name})`;
  return `color-mix(in srgb, var(--${name}) ${Math.round(n * 1000) / 10}%, transparent)`;
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: withAlpha('background'),
        foreground: withAlpha('foreground'),
        primary: {
          DEFAULT: withAlpha('primary'),
          foreground: withAlpha('primary-foreground'),
        },
        secondary: {
          DEFAULT: withAlpha('secondary'),
          foreground: withAlpha('secondary-foreground'),
        },
        accent: {
          DEFAULT: withAlpha('accent'),
          foreground: withAlpha('accent-foreground'),
        },
        muted: {
          DEFAULT: withAlpha('muted'),
          foreground: withAlpha('muted-foreground'),
        },
        card: {
          DEFAULT: withAlpha('card'),
          foreground: withAlpha('card-foreground'),
        },
        border: withAlpha('border'),
        input: withAlpha('input'),
        ring: withAlpha('ring'),
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 0.25rem)',
        lg: 'calc(var(--radius) + 0.25rem)',
        xl: 'calc(var(--radius) + 0.5rem)',
        '2xl': 'calc(var(--radius) + 1rem)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};