import React from 'react'
import { css } from '@emotion/react'
import { Link } from 'gatsby'

// import {
//     partyColors
// } from '../config/config'

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
    box-shadow: 1px 1px 2px #ccc;
    display: flex;
    flex-direction: column;

    :hover {
        border: 1px solid #ce5a00;
        /* background-color: #f8f8f8; */
        text-decoration: none;
        box-shadow: 1px 1px 2px #666;
    }
`
const navPrimaryTitle = css`
    font-weight: bold;
    text-transform: uppercase;
    font-size: 1.1em;
    margin: 0.2em 0;

    @media screen and (max-width: 400px) {
        font-size: 13px;
    }
`
const navPrimaryInfo = css`
    color: #666;
    font-size: 0.8em;
    /* font-weight: bold; */
`
const navSecondaryStyle = css`
    flex: 1 0 8em;
    display: block;
    border: 1px solid var(--gray2);
    padding: 0.2em 0.5em;
    
    margin: 0em 0.25em;
    margin-bottom: 0.25em;
`

const activeStyle = css`
    background: var(--gray1);
    border: 1px solid var(--gray2);
`

const PAGE_LINKS = [
    // {type: 'link', path: '/', label: '🐾 Overview'},
    { path: '/#key-bill-status', label: '📑 Key bills' },
    { path: '/all-bills/', label: '🗂 All bills' },
    { path: '/#find-bill', label: '🔎 Find a bill' },
    { path: '/#find-lawmaker', label: '🔎 Find a lawmaker' },
    { path: '/#find-district', label: '🏡 Your district' },
    { path: '/calendar/', label: '🗓 Calendar' },
    { path: '/recap/', label: '📝 What\'s happened' },
    { path: '/participation/', label: '🙋 How to participate' },
]

const Nav = ({ location }) => {
    // const currentPath = `${location.pathname}${location.hash}`
    // const isActiveStyle = (currentPath === l.path) ? activeStyle : null]
    const isActiveStyle = null

    const links = PAGE_LINKS.map(l => {
        return <Link key={l.path} css={[navItemStyle, navSecondaryStyle, isActiveStyle]} to={l.path}>{l.label}</Link>
    })

    return <div css={navStyle}>
        <div css={[navRowStyle, navRowSecondary]}>
            {links}
        </div>

        < div css={[navRowStyle, navRowPrimary]} >
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
        </div >



    </div >
}

export default Nav

