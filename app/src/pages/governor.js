import React from "react"
import { graphql } from 'gatsby'
import ReactMarkdown from 'react-markdown'

import Layout from '../components/Layout'
import Seo from '../components/Seo'
import LinksList from '../components/LinksList'
import ContactUs from '../components/ContactUs'
import BillTable from '../components/BillTable'
import NewsletterSignup from '../components/NewsletterSignup'

import governorData from '../data/governor.json'

import { numberFormat, dateFormat } from "../config/utils"
const plural = value => (value !== 1) ? 's' : ''

// filter functions
// const toGovernor = d => d.data.progress.toGovernor
// const awaitingGovernorAction = d => d.progress.governorStatus === 'pending'
// const signedByGovernor = d => d.progress.governorStatus === 'signed'
// const vetoedByGovernor = d => d.progress.governorStatus === 'vetoed'
// const enactedWithNoGovernorSignature = d => d.progress.governorStatus === 'became law unsigned'

const Governor = ({ data, location }) => {
  const { text, articles } = governorData
  const bills = data.governorBills.edges.map(d => d.node)

  const awaitingActionBills = bills.filter(b => b.progress.find(d => d.step === 'governor').statusLabel === 'Pending')
  const vetoedBills = bills.filter(b => b.progress.find(d => d.step === 'governor').statusLabel === 'Vetoed')
  const amendmentSuggestedBills = bills.filter(b => b.progress.find(d => d.step === 'governor').statusLabel === 'Amendment suggested')
  const vetoOverrideAttempts = bills.filter(b => b.progress.find(d => d.step === 'governor').statusLabel === 'Veto Override Pending')
  const successfulVetoOverrides = bills.filter(b => b.progress.find(d => d.step === 'governor').statusLabel === 'Veto Overriden')
  const signedBills = bills.filter(b => b.progress.find(d => d.step === 'governor').statusLabel === 'Signed')

  // console.log({
  //   bills,
  //   awaitingActionBills,
  //   vetoedBills,
  //   amendmentSuggestedBills,
  //   vetoOverrideAttempts,
  //   successfulVetoOverrides,
  //   signedBills
  // })

  return <div>

    <Layout location={location}>
      <h1>Gov. Greg Gianforte</h1>
      <ReactMarkdown>{text}</ReactMarkdown>

      <div><strong style={{ fontSize: '1.8em' }}>{numberFormat(bills.length)}</strong> 2023 bill{plural(bills.length)} have been sent to Gov. Gianforte for his signature.</div>

      {/* <p><strong>{numberFormat(billsSentToGov.length)} bill{plural(billsSentToGov.length)}</strong> from the 2023 Legislature have been sent to Gov. Gianforte for his signature.</p> */}
      <h4>Awaiting action ({numberFormat(awaitingActionBills.length)})</h4>
      <BillTable bills={awaitingActionBills} />

      <h4>Vetoed ({numberFormat(vetoedBills.length)})</h4>
      <div className="note">Vetos can be overridden by two-thirds majorities in the House and Senate.</div>
      <BillTable bills={vetoedBills} />

      {
        (vetoOverrideAttempts.length > 0) && <>
          <h4>Pending veto override efforts ({numberFormat(vetoOverrideAttempts.length)})</h4>
          <BillTable bills={vetoOverrideAttempts} />
        </>
      }

      {
        (amendmentSuggestedBills.length > 0) && <>
          <h4>Returned with suggested amendment  ({numberFormat(amendmentSuggestedBills.length)})</h4>
          <BillTable bills={amendmentSuggestedBills} />
        </>
      }

      {
        (successfulVetoOverrides.length > 0) && <>
          <h4>Vetoes overridden by Legislature ({numberFormat(successfulVetoOverrides.length)})</h4>
          <BillTable bills={successfulVetoOverrides} />
        </>
      }

      <h4>Signed into law ({numberFormat(signedBills.length)})</h4>
      <BillTable bills={signedBills} />

      {/* <h4>Became law without signature</h4>
      <div className="note">Bills that have become law without the governor's signature after the governor chooses not to issue a signature or a veto by the 10-day deadline specified in the Montana Constitution.</div>
      <BillTable bills={letBecomeLawBills} /> */}

      <NewsletterSignup />

      <h3>Montana Free Press coverage</h3>
      <div>2023 legislative stories involving the Governor's Office.</div>
      <LinksList articles={articles} />

      <ContactUs />

    </Layout>
  </div>
}

export const Head = () => (
  <Seo
    title="Governor"
    description="Vetos, signatures and 2023 bills on the desk of Montana Gov. Greg Gianforte."
    pageRelativeUrl='governor/'
  />
)

export const query = graphql`
  query GovernorPageQuery {
    governorBills: allBillsJson(filter: {hasBeenSentToGovernor: {eq: true}}) {
      edges {
        node {
          ...BillTableData
        }
      }
    }
  }
`

export default Governor