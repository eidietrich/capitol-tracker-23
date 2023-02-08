import React from "react";
import { graphql } from "gatsby"
import { css } from '@emotion/react'
import { AnchorLink } from "gatsby-plugin-anchor-links";
import ReactMarkdown from 'react-markdown'

import Layout from '../components/Layout'
import Seo from "../components/Seo"
import ContactUs from '../components/ContactUs'
import NewsletterSignup from '../components/NewsletterSignup'
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

const LawmakerPage = ({ pageContext, data, location }) => {
  const {
    lawmaker
  } = pageContext
  const {
    // key,
    title,
    name,
    lastName,
    party,
    district,
    locale,
    districtLocale,
    committees,
    legislativeHistory,
    keyBillVotes,
    leadershipTitle,
    votingSummary,
    articles,
    sponsoredBills,
    phone,
    email,
    lawmakerPageText,
  } = lawmaker
  const {
    portrait // image 
  } = data
  return <div>

    <Layout location={location}>
      <div css={topperBar}>
        <div css={portraitColCss} style={{ borderTop: `6px solid ${partyColors(party)}` }}>
          <LawmakerPortrait image={portrait} alt={`${title} ${name}, ${district}`} />
        </div>
        <div css={infoCol}>
          <h1>{title} {name}</h1>
          <div css={residenceLineCss}>{ordinalize(legislativeHistory.length)}-session {getPartyLabel(party)} from {locale}</div>
          <hr />
          {leadershipTitle && <>
            <div css={leadershipLineCss}>{leadershipTitle}</div>
            <hr />
          </>}
          <div css={districtLineCss}>Representing <strong>{district.replace('SD', 'Senate District').replace('HD', 'House District')}</strong></div>
          <div css={localeLineCss}>{districtLocale}</div>
          <div css={contactLineCss}>
            {phone && <a href={`tel:${cleanPhoneString(phone)}`}>{phone}</a>}
            {(phone && email) && <span> • </span>}
            {email && <a href={`mailto:${email}`}>{email}</a>}
          </div>
        </div>
      </div>

      <div css={anchorLinksBoxStyle}>
        <AnchorLink to="#committees">Committees</AnchorLink> •
        <AnchorLink to="#bills-sponsored">Bills</AnchorLink> •
        <AnchorLink to="#key-votes">Key votes</AnchorLink> •
        <AnchorLink to="#floor-statistics">Voting stats</AnchorLink> •
        <AnchorLink to="#election-history">2022 election margin</AnchorLink> •
        {(articles.length > 0) && <><AnchorLink to="#mtfp-coverage">MTFP Coverage</AnchorLink></>}
      </div>

      <ReactMarkdown>{lawmakerPageText}</ReactMarkdown>
      <History name={lastName} history={legislativeHistory} />

      <h3 id="committees">Committee assignments</h3>
      <LawmakerCommittees committees={committees} />

      <h3 id="bills-sponsored">Bills sponsored</h3>
      <BillTable bills={sponsoredBills} />

      <NewsletterSignup />

      <h3 id="key-votes">Key bill votes</h3>
      <div>Most recent floor votes on bills identified as notable by MTFP staff.</div>
      <LawmakerKeyVotes lastName={lastName} party={party} keyBillVotes={keyBillVotes} />

      <h3 id="floor-statistics">Floor vote statistics</h3>
      <LawmakerVotingSummary lawmaker={lawmaker} votingSummary={votingSummary} />

      <h3 id="election-history">{district} election results</h3>
      <LawmakerElectionHistory lawmaker={lawmaker} />

      <h3 id="mtfp-coverage">Montana Free Press coverage</h3>
      <div>MTFP legislative reporting involving {lastName}.</div>
      {(articles.length > 0) && <LinksList articles={articles} />}
      {(articles.length === 0) && <div className="note">Nothing currently tagged in our archive.</div>}
      {/* {
        (articles.length > 0) && <div>
          <h3 id="mtfp-coverage">Montana Free Press coverage</h3>
          <div>MTFP stories involving this lawmaker</div>
          <LinksList articles={articles} />
        </div>
      } */}

      <ContactUs />

    </Layout>
  </div>;
};

export default LawmakerPage;

const History = ({ name, history }) => {
  const pastSessions = history.filter(d => d.year !== '2023')
  const pastHouseSessions = pastSessions.filter(d => d.chamber === 'house')
  const pastSenateSessions = pastSessions.filter(d => d.chamber === 'senate')
  if ((pastSessions.length) === 0) {
    return <p>2023 is the first session {name} has served in the Legislature.</p>
  } else if (pastSenateSessions.length === 0) {
    return <p>{name} previously served in the Montana House in {listToText(pastHouseSessions.map(d => d.year))}.</p>
  } else if (pastHouseSessions.length === 0) {
    return <p>{name} previously served in the Montana Senate in {listToText(pastSenateSessions.map(d => d.year))}.</p>
  } else {
    return <p>{name} previously served in the Montana Senate in {listToText(pastSenateSessions.map(d => d.year))}, as well as the House in {listToText(pastHouseSessions.map(d => d.year))}.</p>
  }

}

export const Head = ({ pageContext }) => {
  const { title, name, party, locale, district, key } = pageContext.lawmaker
  return <Seo
    title={`${title} ${name}, ${party}-${locale}`}
    description={`Election history, sponsored bills, committee assignments and more for ${title} ${name}, ${district}.`}
    pageRelativeUrl={`lawmakers/${key}/`}
  />
}

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

