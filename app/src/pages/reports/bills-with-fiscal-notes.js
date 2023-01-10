import React from "react"
import { graphql } from 'gatsby'

import Layout from '../../components/Layout'
import BillTable from '../../components/BillTable'
import ContactUs from '../../components/ContactUs'

const FiscalNoteBills = ({ data, location }) => {
  const bills = data.billsWithFiscalNotes.edges.map(d => d.node)

  return <div>
    <Layout location={location}>
      <h1>2023 bills with fiscal notes</h1>
      <BillTable bills={bills} displayLimit={1200} />
      <ContactUs />
    </Layout>
  </div>
}

export const query = graphql`
  query FiscalNotes {
    billsWithFiscalNotes: allBillsJson(filter: {fiscalNoteUrl: {ne: null}}) {
      edges {
        node {
          ...BillTableData
          type
        }
      }
    }
  }
`

export default FiscalNoteBills