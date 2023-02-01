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

import senateData from '../data/senate.json'

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
  { role: 'Senate President', name: 'Sen. Jason Ellsworth (R-Hamilton)', key: 'Jason-Ellsworth' },
  { role: 'Senate Majority Leader', name: 'Sen. Steve Fitzpatrick (R-Great Falls)', key: 'Steve-Fitzpatrick' },
  { role: 'Senate Minority Leader', name: 'Sen. Pat Flowers (D-Belgrade)', key: 'Pat-Flowers' },
]

const Senate = ({ data, location }) => {
  const { text } = senateData
  const senators = data.allLawmakersJson.edges.map(d => d.node)
  const committees = data.allCommitteesJson.edges.map(d => d.node)
  return <div>

    <Layout location={location}>
      <h1>The Montana Senate</h1>
      <Link to="/senate#members">Senators ({senators.length}) </Link> • <Link to="/senate#committees">Committees ({committees.length})</Link>
      <ReactMarkdown>{text}</ReactMarkdown>
      {/* <Text paragraphs={text.description} /> */}

      <h3>Leadership</h3>
      <ChamberLeadership leadership={leadership} />

      <h3 id="members">Membership</h3>
      <TruncatedContainer height={600} closedText="See full roster" openedText="See less">
        <Roster chamberLabel="Senate" lawmakers={senators} />
      </TruncatedContainer>

      <NewsletterSignup />

      <h3 id="committees">Senate Committees</h3>
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
    title="Senate"
    description="Senators and committees of the Montana Senate"
    pageRelativeUrl='senate/'
  />
)

export const query = graphql`
  query SenatePageQuery {
    allLawmakersJson(
      filter: {
        chamber: {eq: "senate"},
        isActive: {eq: true},
      }
      sort: {districtNum: ASC}
      ) {
        edges {
          node {
            ...RosterData
          }
        }
    }
    allCommitteesJson(filter: {
        chamber: {eq: "senate"}
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

export default Senate