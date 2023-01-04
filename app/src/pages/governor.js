import React from "react"
import { graphql } from 'gatsby'
import ReactMarkdown from 'react-markdown'

import Layout from '../components/Layout'
import Seo from '../components/Seo'
import LinksList from '../components/LinksList'
import ContactUs from '../components/ContactUs'
import BillTable from '../components/BillTable'
import Newsletter from '../components/Newsletter'

import governorData from '../data/governor.json'
import { numberFormat, dateFormat } from "../config/utils"

const plural = value => (value !== 1) ? 's' : ''
// filter functions
// const toGovernor = d => d.data.progress.toGovernor
// const awaitingGovernorAction = d => d.progress.governorStatus === 'pending'
// const signedByGovernor = d => d.progress.governorStatus === 'signed'
// const vetoedByGovernor = d => d.progress.governorStatus === 'vetoed'
// const enactedWithNoGovernorSignature = d => d.progress.governorStatus === 'became law unsigned'

const Governor = ({ data }) => {
  const { text, articles } = governorData
  const bills = data.governorBills.edges.map(d => d.node)

  return <div>

    <Layout>
      <h1>Gov. Greg Gianforte</h1>
      <ReactMarkdown>{text}</ReactMarkdown>

      <h2>Bills advanced to the governor</h2>
      <BillTable bills={bills} />

      {/* <h2 id="governor-bills">The governor's desk</h2>
      <p><strong>{numberFormat(billsSentToGov.length)} bill{plural(billsSentToGov.length)}</strong> from the 2023 Legislature have been sent to Gov. Gianforte for his signature.</p>
      <h4>Currently before the governor</h4>
      <BillTable bills={awaitingActionBills} />

      <h4>Vetoed</h4>
      <div className="note">The Montana Constitution requires that the governor provide explanation for vetos. Vetos can be overridden by two-thirds majorities in the House and Senate.</div>
      <BillTable bills={vetoedBills} />

      <h4>Signed into law</h4>
      <BillTable bills={signedBills} />

      <h4>Became law without signature</h4>
      <div className="note">Bills that have become law without the governor's signature after the governor chooses not to issue a signature or a veto by the 10-day deadline specified in the Montana Constitution.</div>
      <BillTable bills={letBecomeLawBills} /> */}

      <Newsletter />

      <h3>Montana Free Press coverage</h3>
      <div>MTFP legislative coverage involving the Governor's Office.</div>
      <LinksList articles={articles} />

      <ContactUs />

    </Layout>
  </div>
}

export const Head = () => (
  <Seo
    title="Gov. Greg Gianforte"
    description="Vetos, signatures and bills on the Montana governor's desk."
    pageRelativeUrl='governor/'
  />
)

export const query = graphql`
  query GovernorPageQuery {
    governorBills: allBillsJson(filter: {hasBeenSentToGovernor: {eq: true}}) {
      edges {
        node {
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
  }
`

export default Governor