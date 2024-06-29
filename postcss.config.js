const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
    plugins: [
        require('autoprefixer'),
        purgecss({
            content: ['./**/*.html'], // Chemin vers vos fichiers HTML
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
            // Vous pouvez ajouter d'autres extracteurs ici si nécessaire
        }),
    ],
};