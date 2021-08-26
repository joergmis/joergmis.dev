const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    theme: {
        extend: {
            colors: {
                'scewo-blue': '#1DA1F2',
                'scewo-blue-stop': '#70D2FF',
            },
            fontFamily: {
                sans: ['RedHatDisplay', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        require('@tailwindcss/forms'),
    ],
}
