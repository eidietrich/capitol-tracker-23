import React from "react"
import { graphql, Link } from 'gatsby'
import { css } from '@emotion/react'
import ReactMarkdown from 'react-markdown'

import Layout from '../components/Layout'
import Seo from "../components/Seo"
import TruncatedContainer from '../components/TruncatedContainer'
import Roster from '../components/Roster'
import ChamberLeadership from '../components/ChamberLeadership'
import CommitteeSummary from "../components/committee/Summary";
import ContactUs from '../components/ContactUs'
import NewsletterSignup from '../components/NewsletterSignup'

import houseData from '../data/house.json'

const committeeItemStyle = css`
  border: 1px solid var(--tan5);
  border-left: 4px solid var(--tan5);
  background: var(--tan1);
  padding: 0.2em;
  margin-bottom: 0.5em;

  h4 {
    padding: 0.2em;
    margin: 0.2em 0;

    a {
      text-transform: uppercase;
    }
    
  }
`

// TODO - break this out to app text
const leadership = [
  { role: 'Speaker of the House', name: 'Rep. Matt Regier (R-Kalispell)', key: 'Matt-Regier' },
  { role: 'Majority Leader', name: 'Rep. Sue Vinton (R-Billings)', key: 'Sue-Vinton' },
  { role: 'Minority Leader', name: 'Rep. Kim Abbott (D-Helena)', key: 'Kim-Abbott' },
]

const House = ({ data, location }) => {
  const { text } = houseData
  const representatives = data.allLawmakersJson.edges.map(d => d.node)
  const committees = data.allCommitteesJson.edges.map(d => d.node)
  return <div>

    <Layout location={location}>
      <h1>The Montana House</h1>
      <Link to="/house#members">Representatives ({representatives.length}) </Link> • <Link to="/house#committees">Committees ({committees.length})</Link>

      <ReactMarkdown>{text}</ReactMarkdown>

      <h3>Leadership</h3>
      <ChamberLeadership leadership={leadership} />

      {/* <ChamberCommittees committees={committees} /> */}
      <h3 id="members">Representatives</h3>
      <TruncatedContainer height={600} closedText="See full roster" openedText="See less">
        <Roster chamberLabel="House" lawmakers={representatives} />
      </TruncatedContainer>

      <NewsletterSignup />

      <h3 id="committees">House Committees</h3>
      {
        committees.map(committee => {
          const { name, key, members } = committee
          return <div key={name} css={committeeItemStyle}>
            <h4>👥 <Link to={`/committees/${key}/`}>{name}</Link> • {members.length} members</h4>
            <CommitteeSummary {...committee} billCount={committee.bills.length} />
          </div>
        })
      }



      <ContactUs />

    </Layout>
  </div>
}

export const Head = () => (
  <Seo
    title="House"
    description="Representatives and committees of the Montana House"
    pageRelativeUrl='house/'
  />
)

export const query = graphql`
  query HousePageQuery {
    allLawmakersJson(filter: {
        chamber: {eq: "house"},
        isActive: {eq: true},
      }, sort: {districtNum: ASC}) {
      edges {
        node {
          ...RosterData
        }
      }
    }
    allCommitteesJson(filter: {
        chamber: {eq: "house"}
      }) {
      edges {
        node {
          name,
          key,
          chamber,
          bills,
          billsUnscheduled,
          billsScheduled,
          billsAwaitingVote,
          billsAdvanced,
          billsFailed,
          # billsBlasted,
          members {
            name
          }
        }
      }
    }
  }
  
`

export default House