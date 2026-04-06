/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                metal: {
                    950: '#09090b',
                    900: '#111114',
                    850: '#16161a',
                    800: '#1c1c21',
                    700: '#27272a',
                    600: '#ffffffff',
                    500: '#ffffffff',
                    400: '#ffffffff',
                    300: '#a1a1aa',
                    200: '#d4d4d8',
                    100: '#e4e4e7',
                    50: '#fafafa',
                },
                income: '#22c55e',
                expense: '#ef4444',
                warning: '#f59e0b',
                info: '#3b82f6',
            },
            fontFamily: {
                mono: ['"Space Mono"', 'monospace'],
                sans: ['"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
            },
        },
    },
    plugins: [],
};