import React from "react"
import { graphql } from 'gatsby'
import ReactMarkdown from 'react-markdown'

import Layout from '../components/Layout'
import Seo from "../components/Seo"
import TruncatedContainer from '../components/TruncatedContainer'
import Roster from '../components/Roster'
import ChamberLeadership from '../components/ChamberLeadership'

import ContactUs from '../components/ContactUs'
import Newsletter from '../components/Newsletter'

import houseData from '../data/house.json'

// TODO - break this out to app text
const leadership = [
  { role: 'Speaker of the House', name: 'Rep. Matt Regier (R-Kalispell)', key: 'Matt-Regier' },
  { role: 'Majority Leader', name: 'Rep. Sue Vinton (R-Billings)', key: 'Sue-Vinton' },
  { role: 'Minority Leader', name: 'Rep. Kim Abbott (D-Helena)', key: 'Kim-Abbott' },
]

const House = ({ data, location }) => {
  const { text } = houseData
  const representatives = data.allLawmakersJson.edges.map(d => d.node)

  return <div>

    <Layout location={location}>
      <h1>The Montana House</h1>

      <ReactMarkdown>{text}</ReactMarkdown>

      <ChamberLeadership leadership={leadership} />

      {/* <ChamberCommittees committees={committees} /> */}
      <TruncatedContainer height={600} closedText="See full roster" openedText="See less">
        <Roster title="Membership" chamberLabel="House" lawmakers={representatives} />
      </TruncatedContainer>

      <Newsletter />

      <ContactUs />

    </Layout>
  </div>
}

export const Head = () => (
  <Seo
    title="Montana House"
    description="Representatives and committees of the Montana House"
    pageRelativeUrl='house/'
  />
)

export const query = graphql`
  query HousePageQuery {
    allLawmakersJson(filter: {chamber: {eq: "house"}}, sort: {districtNum: ASC}) {
      edges {
        node {
          ...RosterData
        }
      }
    }
  }
`

export default House