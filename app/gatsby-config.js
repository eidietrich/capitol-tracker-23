/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Montana Free Press Capitol Tracker 2023`,
    description: `TK`,
    author: `Eric Dietrich / Montana Free Press`,
    seoTitle: '2023 Montana Capitol Tracker | Montana Free Press',
    siteUrl: `https://apps.montanafreepress.org/capitol-tracker-2023/`,
    keywords: ['Montana', '2023 Legislature', 'lawmakers', 'bills', 'legislators', 'house', 'senate', 'vote', 'Helena', 'Capitol'],
    image: `https://apps.montanafreepress.org/election-guide-2022/election-guide-2022-feature-v1.png`,
  },
  pathPrefix: `/capitol-tracker-2023`,
  plugins: [
    // Google Analytics added in Seo Component
    {
      resolve: `gatsby-plugin-anchor-links`,
      options: {
        offset: -140,
      }
    },
    "gatsby-plugin-emotion",
    `gatsby-transformer-json`,
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `./src/data-nodes`,
        // Include only data files here that need to be accessed via graphql queries
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `portraits`,
        path: `${__dirname}/src/images/portraits`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "images",
        "path": "./src/images/"
      },
      __key: "images"
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'MTFP Capitol Tracker 23',
        description: `The lawmakers, bills and votes of the 68th Montana Legislature`,
        short_name: 'MTLEG 23',
        start_url: `/`,
        background_color: `#eae3da`,
        theme_color: `#F85028`,
        icon: `static/mtfp-icon.png`,
        display: `standalone`,
      }
    }
  ]
}