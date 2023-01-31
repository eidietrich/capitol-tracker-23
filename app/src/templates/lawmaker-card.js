import React from "react";
import { graphql } from "gatsby"
import { css } from '@emotion/react'

import "../config/base.css"
import { embedInputContainerStyle } from '../config/styles'
import LawmakerPortrait from '../components/lawmaker/Portrait'

import {
    pluralize,
    ordinalize
} from '../config/utils'

import {
    partyColors,
} from '../config/config'

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
// Using <a> tags instead of anchor tags bc these are intended as embeds
const BASE_URL = 'https://apps.montanafreepress.org/capitol-tracker-2023'

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
    const otherCommittees = committees.slice(1,)

    const embedCode = `<div class="tracker-sidebar alignleft">
<style>
    @media (max-width: 680px) {
        .tracker-sidebar.alignleft {
            max-width: 100% !important;  
            width: 100%;
        }
    }
</style>
<iframe
    width="300px"
    height="450px"
    scrolling="no"
    title="Card embed ${title} ${name}"
    style="margin: 0 auto; border: 1px solid #666;
    box-shadow: 1px 1px 2px #444;"
    src=https://apps.montanafreepress.org/capitol-tracker-2023/lawmaker-cards/${key}/#embed"
    ></iframe>
</div>
`
    return <div style={{
        padding: 0
    }}>
        <div id="embed" css={lawmakerCardCss}>
            <div>
                <a href={`${BASE_URL}/lawmakers/${key}`} target="_blank" rel="noopener noreferrer"><div className="name">{title} {name}</div></a>
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
                <div className="item">
                    {committees.length > 0 ?
                        <>👥 {mainCommittee.role} {mainCommittee.committee} and <strong>{otherCommittees.length}</strong> <a href={`${BASE_URL}/lawmakers/${key}#committees`} target="_blank" rel="noopener noreferrer">other committee assignment{pluralize(otherCommittees.length)}</a></>
                        : <>👥 <strong>0</strong> committee assignments</>
                    }
                </div>
                <div className="item">📋 <strong>{sponsoredBills.length}</strong> <a href={`${BASE_URL}/lawmakers/${key}#bills-sponsored`} target="_blank" rel="noopener noreferrer"> bill{pluralize(sponsoredBills.length)} introduced</a></div>
                {/* <div className="item">📰 <strong>{articles.length}</strong> <a href={`${BASE_URL}/lawmakers/${key}#mtfp-coverage`} target="_blank" rel="noopener noreferrer">reference{pluralize(articles.length)} in MTFP coverage</a></div> */}
                <div className="promo"><a href={`${BASE_URL}/`} target="_blank" rel="noopener noreferrer">See more</a> on MTFP's 2023 Capitol Tracker.</div>
            </div>
        </div>

        <div css={embedInputContainerStyle}>
            <div>Embed code (Copy into HTML block in MTFP CMS)</div>
            <textarea rows="20" cols="80" value={embedCode} readOnly></textarea>
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

