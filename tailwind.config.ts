import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'mandiri-blue': '#003f7d',
        'mandiri-blue-dark': '#002d5c',
        'mandiri-blue-mid': '#005299',
        'mandiri-blue-light': '#e8f0f9',
        'mandiri-yellow': '#f5a623',
        'mandiri-yellow-dark': '#e8961e',
        'mandiri-yellow-light': '#fef3dc',
        'mandiri-green': '#00a651',
        'mandiri-green-light': '#e6f7ee',
        'mandiri-red': '#dc2626',
        'mandiri-red-light': '#fef2f2',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
