import React from "react";
import ReactMarkdown from 'react-markdown'
// import PropTypes from 'prop-types'


import Layout from '../components/Layout'
import Seo from "../components/Seo"
import ContactUs from '../components/ContactUs'
import LinksList from '../components/LinksList'
import NewsletterSignup from '../components/NewsletterSignup'

import BillStatus from '../components/bill/Status'
import BillInfo from '../components/bill/Info'
import BillActions from '../components/bill/Actions'

const BillPage = ({ pageContext, location }) => {
  const {
    bill,
  } = pageContext
  const {
    // key, 
    identifier, title, status, progress, chamber,
    lawsUrl, vetoMemoUrl, articles, actions,
    explanation, type,
    billPageText,
    // isMajorBill
  } = bill
  return <div>

    <Layout location={location}>
      <h1>{identifier}: {title}</h1>
      <div>{explanation}</div>

      <BillStatus
        identifier={identifier}
        chamber={chamber}
        type={type}
        status={status}
        progress={progress}
      />

      <hr />

      <BillInfo bill={bill} />

      {/* <div>TODO: Implement interpretation of bill type (type: {type})</div> */}

      {/* {isMajorBill && <div>*Identified by MTFP as one of the session's key bills.</div>} */}

      <ReactMarkdown>{billPageText}</ReactMarkdown>

      {
        (articles.length > 0) && <div>
          <h3 id="mtfp-articles">Montana Free Press coverage</h3>
          <div>MTFP stories involving the bill</div>
          <LinksList articles={articles} />
        </div>
      }

      <NewsletterSignup />

      <BillActions actions={actions} lawsUrl={lawsUrl} vetoMemoUrl={vetoMemoUrl} />

      <ContactUs />
    </Layout>
  </div>;
};

export const Head = ({ pageContext }) => {
  const { key, identifier, title } = pageContext.bill
  return <Seo
    title={`${identifier}: ${title}`}
    description={`Bill details, sponsor, text, procedural status and more for ${identifier}: ${title}.`}
    pageRelativeUrl={`bills/${key}/`}
  />
}

export default BillPage;