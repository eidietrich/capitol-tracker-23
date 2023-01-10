import React from "react"
import { graphql } from 'gatsby'

import Layout from '../../components/Layout'
import BillTable from '../../components/BillTable'
import ContactUs from '../../components/ContactUs'

const LegalNoteBills = ({ data, location }) => {
  const bills = data.billsWithLegalNotes.edges.map(d => d.node)

  return <div>
    <Layout location={location}>
      <h1>2023 bills with legal notes</h1>
      <BillTable bills={bills} displayLimit={1200} />
      <ContactUs />
    </Layout>
  </div>
}

export const query = graphql`
  query FiscalNotes {
    billsWithLegalNotes: allBillsJson(filter: {legalNoteUrl: {ne: null}}) {
      edges {
        node {
          ...BillTableData
          type
        }
      }
    }
  }
`

export default LegalNoteBills