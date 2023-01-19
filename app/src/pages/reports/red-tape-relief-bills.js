import React from "react"
import { graphql } from 'gatsby'

import Layout from '../../components/Layout'
import BillTable from '../../components/BillTable'
import ContactUs from '../../components/ContactUs'

import { percentFormat } from '../../config/utils.js'

const RedTapeBills = ({ data, location }) => {
  const bills = data.redTapeReliefBills.edges.map(d => d.node)
    .sort((a, b) => +a.identifier.slice(2,) - +b.identifier.slice(2,))

  const pastFirstCommittee = bills.filter(bill => bill.progress.find(d => d.step === 'first committee').status === 'passed')
  const pastFirstChamber = bills.filter(bill => bill.progress.find(d => d.step === 'first chamber').status === 'passed')
  const pastSecondChamber = bills.filter(bill => bill.progress.find(d => d.step === 'second chamber').status === 'passed')
  const signed = bills.filter(bill => bill.progress.find(d => d.step === 'governor').status === 'passed')

  return <div>
    <Layout location={location}>
      <h1>Red Tape Relief Bills</h1>

      <ul>
        <li>Introduced: {bills.length}</li>
        <li>Past first committee: <strong>{pastFirstCommittee.length}</strong> ({percentFormat(pastFirstCommittee.length / bills.length)})</li>
        <li>Past first chamber: <strong>{pastFirstChamber.length}</strong> ({percentFormat(pastFirstChamber.length / bills.length)})</li>
        <li>Past second chamber: <strong>{pastSecondChamber.length}</strong> ({percentFormat(pastSecondChamber.length / bills.length)})</li>
        <li>Signed by governor: <strong>{signed.length}</strong> ({percentFormat(signed.length / bills.length)})</li>
      </ul>

      <BillTable bills={bills} displayLimit={1200} />
      <ContactUs />
    </Layout>
  </div>
}

export const query = graphql`
  query RedTapeBills {
    redTapeReliefBills: allBillsJson(filter: {tags: {in: "Red Tape Relief bills"}}) {
      edges {
        node {
          ...BillTableData
          type
        }
      }
    }
  }
`

export default RedTapeBills