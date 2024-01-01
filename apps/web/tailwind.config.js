/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        colors: ({ colors }) => ({
            blue: colors.blue,
            purple: '#7e5bef',
            pink: '#ff49db',
            orange: '#ff7849',
            green: '#13ce66',
            yellow: '#ffc82c',
            'gray-dark': '#273444',
            gray: '#8492a6',
            'gray-light': '#d3dce6'
        }),
        maxWidth: {
            'vw-100': '100vw'
        },
        maxHeight: {
            'vh-100': '100vh'
        },
        extend: {}
    },
    plugins: []
}
