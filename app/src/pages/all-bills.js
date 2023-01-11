import React from "react"
import { graphql } from 'gatsby'
import { AnchorLink } from "gatsby-plugin-anchor-links";

import Layout from '../components/Layout'
import Seo from '../components/Seo'
import BillTable from '../components/BillTable'
import ContactUs from '../components/ContactUs'

const types = [
  'budget bill',
  'house bill',
  'senate bill',
  'constitutonal amendment',
  'revenue resolution',
  'study resolution',
  'house resolution',
  'senate resolution',
  'joint resolution',
]

const AllBills = ({ data, location }) => {
  const allBills = data.allBillsJson.edges.map(d => d.node)
  // const types = Array.from(new Set(allBills.map(d => d.type)))

  const byType = types.map(type => ({
    type,
    bills: allBills.filter(d => d.type === type)
  }))

  return <div>
    <Layout location={location}>
      <h1>All 2023 bills</h1>
      <div>{types.map(type => <span key={type}> • <AnchorLink to={`/all-bills/#${type.replace(' ', '-')}`}>{type} ({byType.find(d => d.type === type).bills.length})</AnchorLink></span>)}</div>
      {/* <BillTable bills={allBills} displayLimit={1200} /> */}
      {
        types.map(type => <div id={type.replace(' ', '-')} key={type}>
          <h2>Type: {type}</h2>
          <BillTable bills={byType.find(d => d.type === type).bills} displayLimit={1200} />
        </div>)
      }

      <ContactUs />
    </Layout>
  </div>
}

// ref: https://www.gatsbyjs.com/docs/how-to/adding-common-features/adding-seo-component/
export const Head = () => (
  <Seo
    title="All 2023 bills"
    pageRelativeUrl=''
  />
)

export const query = graphql`
  query AllBillsPageQuery {
    allBillsJson {
      edges {
        node {
          ...BillTableData
          type
        }
      }
    }
  }
`

export default AllBills