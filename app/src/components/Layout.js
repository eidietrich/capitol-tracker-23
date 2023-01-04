import React from "react"
import PropTypes from "prop-types"
import { css } from '@emotion/react'
import { Link } from 'gatsby'

import Nav from './Nav'
import Footer from './Footer'
import MTFPLogo from './MTFPLogo'

// import summary from '../data/summary.json'
import headerData from '../data/header.json'
import { formatTimeLong } from '../config/utils'

import "../config/base.css"

const bodyStyles = css`
    position: relative;
`
const headerStyle = css`  
  background-color: var(--tan7);
  margin-bottom: 10px;
  padding: 1em;
`
const contentStyle = css`
    padding: 10px;
    padding-top: 0;
    max-width: 800px;
    margin: auto;
`
const titleStyle = css`
  color: var(--tan4);
  font-size: 3em;
  margin-bottom: 5px;
  margin-top: 0;
  text-transform: uppercase;
  text-align: center;

  a {
    color: var(--tan4);
  }
  a:hover {
    color: var(--link);
    text-decoration: none;
  }

  @media screen and (max-width: 468px) {
    font-size: 2em;
  }
`
const subtitleStyle = css`
  color: var(--tan5);
  font-size: 1.15em;
  text-align: center;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 5px;
`
const mtfpBlurbCss = css`
  text-align: center;
  color: var(--gray1);
  font-style: italic;
`
const updateCss = css`
  color: var(--tan4);
  font-size: 0.9em;
  margin-top: 1em;
  text-align: center;
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

const headerDonateLink = "https://checkout.fundjournalism.org/memberform?org_id=montanafreepress&campaign=7014o000000JNaKAAW"
const title = '2023 Capitol Tracker [BETA]'
const subtitle = 'The lawmakers, bills and votes of the 68th Montana Legislature'

const Layout = ({ children }) => {
  const { updateTime } = headerData
  return (
    <div css={bodyStyles}>
      <div css={contentStyle}>
        <div css={headerStyle}>
          <h1 css={titleStyle}><Link to="/">{title}</Link></h1>
          <h2 css={subtitleStyle}>{subtitle}</h2>
          <div css={mtfpBlurbCss}>
            A digital guide by <MTFPLogo />| <a href={headerDonateLink}>Support this work</a>
          </div>
          <div css={updateCss}>
            Last update: {formatTimeLong(new Date(updateTime))}
          </div>
        </div>

        <div css={navCss}>
          <Nav />
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
