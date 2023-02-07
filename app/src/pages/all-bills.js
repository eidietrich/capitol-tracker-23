import React from "react"
import { Link, graphql } from 'gatsby'
import { css } from '@emotion/react'
import { AnchorLink } from "gatsby-plugin-anchor-links";

import Layout from '../components/Layout'
import Seo from '../components/Seo'
import BillTable from '../components/BillTable'
import ContactUs from '../components/ContactUs'
import NewsletterSignup from "../components/NewsletterSignup";

import { capitalize, numberFormat } from "../config/utils";

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

const allBillsPageStyle = css`
  h2 .top-link {
    font-size: 0.7em;
    font-weight: normal;
    font-style: italic;
  }
`

const AllBills = ({ data, location }) => {
  const allBills = data.allBillsJson.edges.map(d => d.node)
  // const types = Array.from(new Set(allBills.map(d => d.type)))

  const byType = types.map(type => ({
    type,
    bills: allBills.filter(d => d.type === type)
  }))

  return <div css={allBillsPageStyle}>
    <Layout location={location}>
      <h1>All 2023 bills</h1>
      <div className="note"><strong>{numberFormat(allBills.length)}</strong> total bills, resolutions and other measures introduced</div>
      <div>
        {types.map((type, i) => <span key={type}>{i !== 0 ? ' • ' : ''}<Link to={`/all-bills/#${type.replace(' ', '-')}`}>
          {capitalize(type)}s ({byType.find(d => d.type === type).bills.length})
        </Link></span>)}
      </div>

      {/* <div>{types.map(type => <span key={type}> • <AnchorLink to={`/all-bills/#${type.replace(' ', '-')}`}>{capitalize(type)}s ({byType.find(d => d.type === type).bills.length})</AnchorLink></span>)}</div> */}

      {
        byType.map((group, i) => <div id={group.type.replace(' ', '-')} key={group.type}>
          <h2>{capitalize(group.type)}s ({group.bills.length}) {(i !== 0) && <Link className="top-link" to="/all-bills/">&raquo; top of page</Link>}</h2>
          <BillTable bills={group.bills} displayLimit={1200} />
          {(i === 0) && <NewsletterSignup />}
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
    pageRelativeUrl="all-bills/"
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