import React from "react"
import { css } from "@emotion/react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

const Portrait = (props) => {
  const data = useStaticQuery(graphql`
        query {
          defaultImage: file(sourceInstanceName: {eq: "portraits"}, relativePath: {eq: "00-placeholder.png"}) {
              relativePath
              name
              childImageSharp {
                gatsbyImageData
              }
          }
        }
      `)
  const { image, alt, barColor, suppresswarning, width } = props
  const maxWidth = width || 150
  const barStyle = barColor ?
    css`border-top: 8px solid ${barColor};`
    : null

  let renderImage = image

  if (!image) {
    if (!suppresswarning) console.warn('Missing portrait:', alt)
    renderImage = data.defaultImage
  }
  return (
    <div css={[barStyle]} style={{ maxWidth: `${maxWidth}px` }}>
      <GatsbyImage
        image={renderImage.childImageSharp.gatsbyImageData}
        alt={alt}
        objectFit="cover"
        objectPosition="50% 50%"
      />
    </div>
  );
}

export default Portrait
