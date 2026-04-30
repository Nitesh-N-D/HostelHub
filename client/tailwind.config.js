/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#6D28D9',
          600: '#5B21B6',
          900: '#1C1C1E'
        },
        accent: '#C08457',
        bg: '#F5F5F4',
        ink: '#111827',
        muted: '#6B7280',
        success: '#059669',
        warning: '#C08457',
        danger: '#DC2626',
        border: '#E5E7EB',
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          800: '#292524',
          900: '#1c1917'
        }
      },
      boxShadow: {
        soft: '0 14px 32px rgba(17, 24, 39, 0.08)',
        panel: '0 8px 24px rgba(17, 24, 39, 0.06)',
        glow: '0 10px 24px rgba(109, 40, 217, 0.12)'
      },
      borderRadius: {
        xl2: '1.25rem'
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(circle at top left, rgba(109,40,217,0.10), transparent 28%), radial-gradient(circle at top right, rgba(192,132,87,0.10), transparent 22%), linear-gradient(180deg, #fafaf9 0%, #f5f5f4 100%)',
        'brand-gradient': 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
        'cta-gradient': 'linear-gradient(135deg, rgba(109,40,217,0.08), rgba(192,132,87,0.12))'
      }
    }
  },
  plugins: []
};
