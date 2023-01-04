import React from "react";
import { graphql } from "gatsby"
import { css } from '@emotion/react'
import { AnchorLink } from "gatsby-plugin-anchor-links";
import ReactMarkdown from 'react-markdown'

import Layout from '../components/Layout'
import Seo from "../components/Seo"
import ContactUs from '../components/ContactUs'
import Newsletter from '../components/Newsletter'
import LinksList from '../components/LinksList'
import BillTable from '../components/BillTable'

import LawmakerPortrait from '../components/lawmaker/Portrait'
import LawmakerElectionHistory from '../components/lawmaker/ElectionHistory'
import LawmakerCommittees from '../components/lawmaker/Commitees'
import LawmakerVotingSummary from '../components/lawmaker/VotingSummary'
import LawmakerKeyVotes from '../components/lawmaker/KeyVotes'

import {
    listToText,
    cleanPhoneString,
    pluralize,
    ordinalize
} from '../config/utils'

import {
    partyColors,
} from '../config/config'

const topperBar = css`
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #806F47;
  background-color: #eae3da;
  padding: 0.5em;
`
const portraitColCss = css`
  margin-right: 1em;
`
const infoCol = css`
  /* margin-left: 1em; */
  flex: 1 0 100px;
  h1 {
    font-size: 1.5em;
    margin-top: 0;
    margin-bottom: 0.1em;
  }
`
const residenceLineCss = css``
const districtLineCss = css`
  font-size: 0.9em;
`
const localeLineCss = css`
  font-size: 0.9em;
  font-style: italic;
  color: #444;
`
const contactLineCss = css`
  font-size: 0.9em;
  margin-top: 0.4em;
`
const leadershipLineCss = css`
  font-weight: bold;
  font-size: 1.1em;
`
const anchorLinksBoxStyle = css`
  color: var(--tan4);
  padding: 0.5em 0;
`

const getPartyLabel = (key) => {
    return {
        'R': 'Republican',
        'D': 'Democrat'
    }[key]
}

const lawmakerCardCss = css`
    width: 300px;
    height: 450px;
    background: var(--tan1);
    position: relative;
    font-size: 15px;

    .name {
        display: flex;
        justify-content: center;
        align-items: center;

        font-size: 1.5em;
        text-align: center;
        background: var(--gray6);
        
        color: white;
        padding: 0.2em;
        height: 40px;
    }

    .top-section {
        display: flex;
        height: 200px;
        background: var(--gray5);
        
        color: white;

        .left {
            width: 106px;
            background-color:
        }
        .right {
            width: 194px;
        }
        
    }
    .locale {
        height: 40px;
        padding: 0.2em;
        display: flex;
        justify-content: center;
        align-items: center;
        font-style: italic;
    }
    .district {
        font-size: 1.2em;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
    }

    .party {
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        color: white;
        height: 30px;
    }
    .leadership-role {
        height: 60px;
        padding: 0.5em;
        display: flex;
        justify-content: center;
        align-items: center;
        font-style: italic;
        text-align: center;
    }

    .session {
        text-transform: uppercase;
        font-size: 0.9em;
        padding: 0.5em;
        font-style: italic;
        color: var(--gray4);
    }

    .item {
        padding: 0.5em;
        margin: 0.2em 0.5em;
        border: 1px solid var(--tan4);
    }

    .promo {
        font-style: italic;
        position: absolute;
        bottom: 5px;
        padding: 0.5em;
    }

`

const LawmakerPage = ({ pageContext, data }) => {
    const {
        lawmaker
    } = pageContext
    const {
        key,
        title,
        name,
        // lastName,
        party,
        district,
        locale,
        // districtLocale,
        committees,
        legislativeHistory,
        // keyBillVotes,
        leadershipTitle,
        // votingSummary,
        articles,
        sponsoredBills,
        // phone,
        // email,
        // lawmakerPageText,
    } = lawmaker
    const {
        portrait // image 
    } = data
    const color = partyColors(party)
    const mainCommittee = committees[0] // assume we've ranked this list elsewhere
    const otherCommittees = committees.slice(1, 0)
    return <div style={{
        padding: 0
    }}>
        <div id="embed" css={lawmakerCardCss}>
            <div>
                <AnchorLink to={`/lawmakers/${key}`}><div className="name">{title} {name}</div></AnchorLink>
            </div>
            <div className="top-section" style={{ borderBottom: `3px solid ${color}` }}>
                <div className="left">
                    <div className="party" style={{ background: color }}>{{ 'R': 'Republican', 'D': 'Democrat' }[party]}</div>
                    <div className="locale">{locale}</div>
                    <div className="district">{district}</div>
                    <div className="leadership-role">{leadershipTitle}</div>
                </div>
                <div className="right" style={{ borderTop: `6px solid ${color}` }}>
                    <LawmakerPortrait image={portrait} width={194} alt={`${title} ${name}, ${district}`} />
                </div>
            </div>
            <div className="bottom-section">
                <div className="session">2023 Legislature – {ordinalize(legislativeHistory.length)} session</div>
                <div className="item">👥 {mainCommittee.committee} {mainCommittee.role} and <strong>{otherCommittees.length}</strong> <AnchorLink to={`/lawmakers/${key}#committees`}>other committee assignment{pluralize(otherCommittees.length)}</AnchorLink></div>
                <div className="item">📋 <strong>{sponsoredBills.length}</strong> <AnchorLink to={`/lawmakers/${key}#bills-sponsored`}> bill{pluralize(sponsoredBills.length)} sponsored</AnchorLink></div>
                <div className="item">📰 <strong>{articles.length}</strong> <AnchorLink to={`/lawmakers/${key}#mtfp-coverage`}>reference{pluralize(articles.length)} in MTFP coverage</AnchorLink></div>
                <div className="promo">🗒 <AnchorLink to={`/`}>See more</AnchorLink> on MTFP's 2023 Capitol Tracker .</div>
            </div>
        </div>
    </div >
};

export default LawmakerPage;


export const query = graphql`
  query($imageSlug: String!) {
    portrait: file(sourceInstanceName: {eq: "portraits"}, relativePath: {eq: $imageSlug}) {
        relativePath
        name
        childImageSharp {
          gatsbyImageData
        }
    }
    }
`

