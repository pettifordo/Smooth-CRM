import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(__dirname, './index.html'),
    path.join(__dirname, './src/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {
      colors: {
        'sf-blue':       '#0176D3',
        'sf-blue-dark':  '#014486',
        'sf-blue-light': '#1589EE',
        'sf-bg':         '#F3F2F2',
        'sf-border':     '#DDDBDA',
        'sf-text':       '#181818',
        'sf-text-2':     '#3E3E3C',
        'sf-text-3':     '#747474',
        'sap-shell':     '#354A5E',
        'sap-shell-2':   '#233142',
        'sap-blue':      '#0854A0',
        'sap-blue-2':    '#0A6ED1',
        'sap-bg':        '#F2F2F2',
        'sap-border':    '#EDEDED',
        'sap-text':      '#32363A',
        'sap-text-2':    '#6A6D70',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sf-card':  '0 2px 4px 0 rgba(0,0,0,0.10)',
        'sap-card': '0 1px 4px 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
