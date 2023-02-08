import React from "react"
import PropTypes from "prop-types"
import { css } from '@emotion/react'
import { Slice } from 'gatsby'


// import Header from './Header'
import Nav from './Nav'
import Footer from './Footer'

import "../config/base.css"

const bodyStyles = css`
    position: relative;
`

const contentStyle = css`
    padding: 10px;
    padding-top: 0;
    max-width: 800px;
    margin: auto;
`

const navCss = css`
  position: sticky;
  top: 0px;
  background-color: white;
  margin: -10px;
  padding: 10px;
  margin-bottom: 0;
  padding-bottom: 0;
  z-index: 1000;
`

const Layout = ({ children, location }) => {
  return (
    <div css={bodyStyles}>
      <div css={contentStyle}>
        {/* <Header /> */}
        <Slice alias="header" />

        <div css={navCss}>
          <Nav location={location} />
        </div>

        <main>{children}</main>
      </div>
      <Footer />

    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
