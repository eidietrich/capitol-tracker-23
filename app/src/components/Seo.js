/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
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
  const metaUrl = `${site.siteMetadata.siteUrl}${pageRelativeUrl}`

  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{metaTitle}</title>
      <link rel="canonical" href={metaUrl} />
      <meta name="description" content={metaDescription} />
      <meta name="og:locale" content="en_US" />
      <meta name="og:site_name" content="Montana Free Press" />
      <meta name="og:title" content={metaTitle} />
      <meta name="og:image" content={metaImage} />
      <meta name="og:image:width" content="1200" />
      <meta name="og:image:height" content="630" />
      <meta name="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@mtfreepress" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:description" content={metaDescription} />
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-179R4DKQFZ"></script>
      <script>
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-179R4DKQFZ');
      `}
      </script>
      <script type="application/ld+json">
        {/* Parsely information */}
        {`
          {
            "@context": "http://schema.org",
            "@type": "NewsArticle",
            "name": "${title}",
            "url": "${metaUrl}",
            "thumbnailUrl": "${image}",
            "datePublished": "${new Date().toISOString()}",
            "articleSection": "News apps",
            "creator": "Eric Dietrich"
          }
        `}
      </script>
    </Helmet>
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