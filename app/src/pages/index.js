import React from "react"
import { graphql } from 'gatsby'
// import { AnchorLink } from "gatsby-plugin-anchor-links";

import Layout from '../components/Layout'
import Seo from '../components/Seo'
// import TruncatedContainer from '../components/TruncatedContainer'
import BillTable from '../components/BillTable'
import InfoPopup from '../components/InfoPopup'
import Newsletter from '../components/Newsletter'
import ContactUs from '../components/ContactUs'

import BillStatusOverview from '../components/overview/BillStatuses'
import BillLookup from '../components/input/BillLookup'
import LawmakerLookup from '../components/input/LawmakerLookup'
import DistrictLookup from '../components/input/DistrictLookup'

// import { dateFormatLong } from '../config/utils'

import processAnnotations from '../data/process-annotations.json'
import keyBillCategories from '../data/bill-categories.json'
// Add overview data import here

const Index = ({ data, location }) => {
  const { howBillsMove } = processAnnotations
  const keyBills = data.keyBills.edges.map(d => d.node)
  const billIndex = data.billIndex.edges.map(d => d.node)
  const lawmakerIndex = data.lawmakerIndex.edges.map(d => d.node)

  // const keyBillCategories = Array.from(new Set(keyBills.map(d => d.majorBillCategory)))
  return <div>
    <Seo
      title="Overview"
      pageRelativeUrl=''
    />
    <Layout>
      <div id="overview">[TK determine what we want to emphasize above the fold. Links to bill hearings? Status counts for different types of bills?.]</div>

      {/* <p>The 2021 Montana Legislature was in session from Jan. 4 to April 29.</p>
      <BillStatusOverview summary={summary} mostRecentActionDate={mostRecentActionDate} /> */}


      {/* <TruncatedContainer height={1000} closedText="See all key bills"> */}
      <h2 id="key-bill-status">Where the key bills are at</h2>
      <InfoPopup label="How bills move through the Legislature" content={howBillsMove} />
      <div className="note">Major legislation identified by MTFP reporters. Where ambiguous, official bill titles are annotated with plain language summaries.</div>
      {
        keyBillCategories.map(c => {
          const billsInCat = keyBills.filter(d => d.majorBillCategory === c.category)
          return <div key={c.category}>
            <h4>{c.category}</h4>
            <div className="note">{c.categoryDescription}</div>
            <BillTable bills={billsInCat} displayLimit={15} suppressCount={true} />
          </div>
        })
      }
      {/* </TruncatedContainer> */}

      <Newsletter />

      <h2 id="find-bill">Find a bill</h2>
      <BillLookup bills={billIndex} />

      <h2 id="find-lawmaker">Find a lawmaker</h2>
      <LawmakerLookup lawmakers={lawmakerIndex} />

      <h2 id="find-district">Find your district</h2>
      <DistrictLookup lawmakers={lawmakerIndex} />

      <ContactUs />
    </Layout>
  </div>
}

export const query = graphql`
  query IndexPageQuery {
    keyBills: allBillsJson (filter: {isMajorBill: {eq: true}}){
      edges {
        node {
          # ...BillTableData
          title
          identifier
          chamber
          status {
            key
            step
            label
            status
          }
          progress {
            step
            status
            statusLabel
            statusDate
          }
          explanation
          majorBillCategory
          textUrl
          fiscalNoteUrl
          legalNoteUrl
          vetoMemoUrl
          sponsor {
            name
            district
            party
          }
        }
      }
    }
    lawmakerIndex: allLawmakersJson {
      edges {
        node {
          key
          title
          name
          phone
          email
          district
          party
          locale
        }
      }
    }
    billIndex: allBillsJson {
      edges {
        node {
          key
          title
          identifier
        }
      }
    }
  }
`

export default Index