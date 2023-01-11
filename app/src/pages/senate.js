import React from "react"
import { graphql } from 'gatsby'
import ReactMarkdown from 'react-markdown'

import Layout from '../components/Layout'
import Seo from "../components/Seo"
import TruncatedContainer from '../components/TruncatedContainer'
import Roster from '../components/Roster'
import ChamberLeadership from '../components/ChamberLeadership'
import ContactUs from '../components/ContactUs'
import NewsletterSignup from '../components/NewsletterSignup'

import senateData from '../data/senate.json'

// TODO - break this out to app text
const leadership = [
  { role: 'Senate President', name: 'Sen. Jason Ellsworth (R-Hamilton)', key: 'Jason-Ellsworth' },
  { role: 'Senate Majority Leader', name: 'Sen. Steve Fitzpatrick (R-Great Falls)', key: 'Steve-Fitzpatrick' },
  { role: 'Senate Minority Leader', name: 'Sen. Pat Flowers (D-Belgrade)', key: 'Pat-Flowers' },
]

const Senate = ({ data, location }) => {
  const { text } = senateData
  const senators = data.allLawmakersJson.edges.map(d => d.node)
  return <div>

    <Layout location={location}>
      <h1>The Montana Senate</h1>
      <ReactMarkdown>{text}</ReactMarkdown>
      {/* <Text paragraphs={text.description} /> */}

      <ChamberLeadership leadership={leadership} />

      <TruncatedContainer height={600} closedText="See full roster" openedText="See less">
        <Roster title="Membership" chamberLabel="Senate" lawmakers={senators} />
      </TruncatedContainer>

      <NewsletterSignup />

      <ContactUs />

    </Layout>
  </div>
}

export const Head = () => (
  <Seo
    title="Montana Senate"
    description="Senators and committees of the Montana Senate"
    pageRelativeUrl='senate/'
  />
)

export const query = graphql`
  query SenatePageQuery {
    allLawmakersJson(
      filter: {chamber: {eq: "senate"}}
      sort: {districtNum: ASC}
      ) {
        edges {
          node {
            ...RosterData
          }
        }
    }
  }
`

export default Senate