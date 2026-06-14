/**
 * Gatsby configuration file
 */

module.exports = {
  siteMetadata: {
    title: `Contos Clássicos`,
    description: `Um conto ou crônica clássica de domínio público por dia. Leia autores renomados como Machado de Assis, Lima Barreto, João do Rio e Arthur Azevedo.`,
    author: `@antigravity`,
    siteUrl: `https://contos-classicos-pwa.netlify.app/`,
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `contos`,
        path: `${__dirname}/content/contos`,
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Contos Clássicos Brasileiros`,
        short_name: `Contos PWA`,
        description: `Um conto clássico da literatura brasileira por dia, direto no seu dispositivo.`,
        start_url: `/`,
        background_color: `#121824`,
        theme_color: `#8b5cf6`,
        display: `standalone`,
        icon: `src/images/gatsby-icon.png`, // Relative to root
      },
    },
    // gatsby-plugin-offline must be listed AFTER gatsby-plugin-manifest
    `gatsby-plugin-offline`,
  ],
}
