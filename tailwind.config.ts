import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#08080F',
        surface: '#0F0F1A',
        card:    '#141420',
        amber: {
          DEFAULT: '#C8A84B',
          light:   '#D4BA6A',
          dim:     'rgba(200,168,75,0.14)',
          glow:    'rgba(200,168,75,0.06)',
        },
        cream: {
          DEFAULT: '#F2EFE8',
          muted:   'rgba(242,239,232,0.6)',
          dim:     'rgba(242,239,232,0.35)',
          ghost:   'rgba(242,239,232,0.06)',
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          strong:  'rgba(255,255,255,0.14)',
          amber:   'rgba(200,168,75,0.25)',
        },
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'sans-serif'],
        serif:   ['Instrument Serif', 'Georgia', 'serif'],
        sans:    ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['10px', { letterSpacing: '0.18em', lineHeight: '1.6' }],
        xs:    ['12px', { lineHeight: '1.6' }],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      animation: {
        marq:    'marq 30s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        sdrop:   'sdrop 2.4s ease-in-out infinite',
        breathe: 'breathe 5s ease-in-out infinite',
      },
      keyframes: {
        marq: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        sdrop: {
          '0%':   { top: '-100%', opacity: '0.9' },
          '100%': { top: '100%',  opacity: '0' },
        },
        breathe: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.6', transform: 'scale(1.03)' },
        },
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}

export default config
