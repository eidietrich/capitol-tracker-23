/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
// import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function SEO({
  title,
  description,
  pageRelativeUrl,
  image,
}) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            image
            siteUrl
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const metaImage = image || site.siteMetadata.image
  const metaTitle = title ? `${title} | ${site.siteMetadata.title}` : site.siteMetadata.title
  const metaUrl = `${site.siteMetadata.siteUrl}/${pageRelativeUrl}`

  return (
    <>
      <meta charSet="utf-8" />
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="image" content={metaImage} />
      <link rel="canonical" href={metaUrl} />
      {/* OpenGraph / FB */}
      <meta property="og:url" content={metaUrl} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Montana Free Press" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="website" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@mtfreepress" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:description" content={metaDescription} />
      {/* Google Analytics */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-179R4DKQFZ"></script>
      <script>
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-179R4DKQFZ');
      `}
      </script>
      {/* Parsely information */}
      <script type="application/ld+json">
        {`
          {
            "@context": "http://schema.org",
            "@type": "NewsArticle",
            "name": "${metaTitle}",
            "url": "${metaUrl}",
            "thumbnailUrl": "${metaImage}",
            "datePublished": "${new Date().toISOString()}",
            "articleSection": "News apps",
            "creator": "Eric Dietrich"
          }
        `}
      </script>
    </>
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default SEO