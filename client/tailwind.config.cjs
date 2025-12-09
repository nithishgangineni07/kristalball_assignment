/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                military: {
                    50: '#F0F4F0',
                    100: '#D9E2D9',
                    200: '#B3C6B3',
                    300: '#8DA98D',
                    400: '#668C66',
                    500: '#407040', // Base Olive
                    600: '#335933',
                    700: '#264326',
                    800: '#1A2D1A',
                    900: '#0D160D', // Almost Black
                    accent: '#FFD700', // Gold for highlights (ranking/medals)
                },
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    850: '#1A202C',
                    900: '#0f172a',
                    950: '#020617'
                }
            },
            borderRadius: {
                'sm': '2px',
                'DEFAULT': '4px',
                'md': '6px',
                'lg': '8px',
            },
            boxShadow: {
                glass: "0 8px 30px rgba(0,0,0,0.04)",
                "glass-hover": "0 8px 30px rgba(0,0,0,0.08)",
            },
        },
    },
    plugins: [],
}
