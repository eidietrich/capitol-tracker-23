import React from 'react'
import { css } from '@emotion/react'
import { Link } from 'gatsby'

import { AnchorLink } from "gatsby-plugin-anchor-links";

import {
    partyColors
} from '../config/config'

const navStyle = css`
    border-bottom: 1px solid #444;
    margin-bottom: 0.5em;
    margin-left: -2px;
    margin-right: -2px;
    padding-left: 2px;
    padding-right: 2px;
    box-shadow: 0px 3px 3px -3px #000;
    
`
const navRowStyle = css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
`
const navRowPrimary = css`
    margin: 0 -0.25em; /* Aligns items to edges*/
`
const navRowSecondary = css`
    justify-content: space-between;
    margin-left: -0.5em;
    margin-right: -0.5em;
    font-size: 15px;
`

const navItemStyle = css`
    
    
    margin: 0 0.25em;
    margin-bottom: 0.5rem;

    text-align: center;
    text-decoration: none;
    
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 0.3em;
    padding-bottom: 0.3em;
`
const navPrimaryStyle = css`
    flex: 1 1 4em;
    padding: 0.2em;
    border: 1px solid #404040;
    background-color: #eee;
    box-shadow: 1px 1px 2px #ddd;
    display: flex;
    flex-direction: column;

    :hover {
        border: 1px solid #ce5a00;
        background-color: #f8f8f8;
        text-decoration: none;
    }
`
const navPrimaryTitle = css`
    font-weight: bold;
    text-transform: uppercase;
    margin: 0.2em 0;
`
const navPrimaryInfo = css`
    color: #666;
    font-size: 0.8em;
    font-weight: bold;
`
const navSecondaryStyle = css`
    display: block;
    max-width: 12em;
    margin: 0em 0.5em;
    margin-bottom: 0.25em;
`

const color = partyColors('R')
const Nav = (props) => <div css={navStyle}>

    <div css={[navRowStyle, navRowSecondary]}>
        <AnchorLink css={[navItemStyle, navSecondaryStyle]} to='/'>🧭 Overview</AnchorLink>
        <AnchorLink css={[navItemStyle, navSecondaryStyle]} to='/#key-bill-status'>📑 Key bills</AnchorLink>
        <AnchorLink css={[navItemStyle, navSecondaryStyle]} to='/#find-bill'>🔎 Find a bill</AnchorLink>
        <AnchorLink css={[navItemStyle, navSecondaryStyle]} to='/#find-lawmaker'>🔎 Find a lawmaker</AnchorLink>
        <AnchorLink css={[navItemStyle, navSecondaryStyle]} to='/#find-district'>🏡 Your district</AnchorLink>
        <AnchorLink css={[navItemStyle, navSecondaryStyle]} to='/calendar'>🗓 What's upcoming</AnchorLink>
        <AnchorLink css={[navItemStyle, navSecondaryStyle]} to='/participation#participation'>🙋 How to participate</AnchorLink>
    </div>

    <div css={[navRowStyle, navRowPrimary]}>
        <Link css={[navItemStyle, navPrimaryStyle]} to='/house'>
            <div css={navPrimaryTitle}>🏛 House</div>
            <div css={navPrimaryInfo}>GOP-held 68-32</div>
        </Link>
        <Link css={[navItemStyle, navPrimaryStyle]} to='/senate'>
            <div css={navPrimaryTitle}>🏛 Senate</div>
            <div css={navPrimaryInfo}>GOP-held 34-16</div>
        </Link>
        <Link css={[navItemStyle, navPrimaryStyle]} to='/governor'>
            <div css={navPrimaryTitle}>🖋 Governor</div>
            <div css={navPrimaryInfo}>Greg Gianforte (R)</div>
        </Link>
    </div>



</div>

export default Nav

