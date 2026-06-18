/**
 * Gatsby configuration file
 */

module.exports = {
  siteMetadata: {
    title: `10pages - contos clássicos`,
    description: `Um conto ou crônica clássica de até 10 páginas por dia. Leia autores renomados como Machado de Assis, Lima Barreto e João do Rio.`,
    author: `@antigravity`,
    siteUrl: `https://10pages-pwa.netlify.app/`,
    adminEmail: `edgarscnobrega@gmail.com`,
    adminPhone: `5511999999999`,
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
        name: `10pages - contos clássicos`,
        short_name: `10pages`,
        description: `Leia um conto ou crônica clássica de até 10 páginas por dia. Melhore seu hábito de leitura.`,
        start_url: `/`,
        background_color: `#121824`,
        theme_color: `#8b5cf6`,
        display: `standalone`,
        icon: `src/images/logo.png`, // Relative to root
      },
    },
    // gatsby-plugin-offline must be listed AFTER gatsby-plugin-manifest
    `gatsby-plugin-offline`,
  ],
}
