// General purpose table for displaying list of bills
// e.g. bills a given lawmaker has sponsored
// or key bills on index page
// or bills at given point in process

import React, { Component } from 'react';
import PropTypes from "prop-types"
import { Link, graphql } from 'gatsby'
import { css } from '@emotion/react'

// import { AnchorLink } from "gatsby-plugin-anchor-links";

import {
  billStatusSymbols,
  billProgressStepLabels,
  statusColors,
  partyColors
} from '../config/config'

import {
  billUrl,
  lawmakerUrl
} from '../config/utils'
import {
  tableStyle,
  noteStyle,
  bottomFadeCss,
  inlineButtonCss,
} from '../config/styles';

const DEFAULT_DISPLAY_LIMIT = 10
const DEFAULT_SORT = (a, b) => +a.identifier.substring(3,) - +b.identifier.substring(3,)
const defaultState = {
  isTruncated: true
}

class BillTable extends Component {
  constructor(props) {
    super(props)
    this.state = { ...(props.defaultState || defaultState) }

    this.toggleDisplayLimit = this.toggleDisplayLimit.bind(this)
  }

  toggleDisplayLimit() {
    this.setState({ isTruncated: !this.state.isTruncated })
  }

  render() {
    const { bills, suppressCount } = this.props
    const sortFunction = this.props.sortFunction || DEFAULT_SORT
    const { isTruncated } = this.state
    const displayLimit = this.props.displayLimit || DEFAULT_DISPLAY_LIMIT

    if (bills.length === 0) {
      return <div css={noteStyle}>None at present</div>
    }
    const sorted = bills.sort(sortFunction)
    const rendered = isTruncated ? sorted.slice(0, displayLimit) : sorted
    const rows = rendered.map((bill, i) => <Bill key={String(i)} {...bill} />)

    const isFadeApplied = isTruncated && (rendered.length < sorted.length)

    return <div>
      <table css={isFadeApplied ? [tableStyle, bottomFadeCss] : [tableStyle]}>
        {/* <thead>
          <tr>
            <th>Bill</th>
            <th>Status</th>
          </tr>
        </thead> */}
        <tbody>{rows}</tbody>
      </table>
      <div css={noteStyle}>
        {!suppressCount && <span>Showing {rendered.length} of {bills.length}</span>}
        {
          (bills.length > displayLimit) &&
          <span><span>. </span>
            <button css={inlineButtonCss} onClick={this.toggleDisplayLimit}>
              {isTruncated ? 'See all' : 'See fewer'}
            </button>
          </span>
        }

      </div>

    </div>

  }

}
const tableRowCss = css`
  /* background-color: #eae3da; */
  border-bottom: 2px solid #fff !important;
  td {
    /* padding: 0; */
  }
`

const tableBillCell = css`
  padding: 0;
`

const statusColCss = css`
  width: 10em;

  @media screen and (max-width: 468px) {
    width: 7em;
  }
`
const billLabelCss = css`
  font-style: italic;
  color: #666;
`
const billCss = css`
  display: block;
  font-size: 1.15em;
  font-weight: 600;
  font-style: italic;
  padding: 0.2em 0.2em;
  margin-left: -0.2em;
  /* background-color: #e0d4b8; */
  
  a {
    color: #473d29;
  }

  :hover {
    background-color: #cebc9f;
    color: #ce5a00 !important;
    text-decoration: none;
  }
`
const identifierCss = css`
  font-style: normal;
  color: #444;

`
// const stepCss = css`
// `
// const labelCss = css`
//   font-style: italic;
// `
const billInfoLineCss = css`
  color: #ae9864;
`
const billLinkCss = css`
  /* opacity: 0.7; */
  margin-top: 0.3em;
  margin-right: 0.5em;
  display: inline-block;
  color: #ae9864;
  border: 1px solid #ae9864;
  padding: 0.5em 0.5em;

  :hover {
    color:  #ce5a00;
    border: 1px solid  #ce5a00;
    text-decoration: none;
  }
`
const progressStepStyle = css`
  margin-bottom: 0.1em;
  font-size: 12px;
  /* border-top: 1px solid var(--tan4);

  :first-of-type {
    border-top: none;
  } */
  
  .icon {
    /* background-color: var(--gray1); */
    display: inline-block;
    width: 1.2em;
    height: 1.2em;
    text-align: center;
    margin: 0.1em;
    margin-right: 0.5em;
  }
  .label {
    color: var(--gray4);
    display: inline-block;
    text-transform: uppercase;
    @media (max-width: 400px) {
      font-size: 12px;
    }
  }
`
const pluralStory = val => (val !== 1) ? 'stories' : 'story'


const Bill = ({ title, identifier, chamber, status, explanation, textUrl,
  fiscalNoteUrl, legalNoteUrl, vetoMemoUrl, amendmentsUrl,
  numArticles, sponsor, progress
}) => {
  if (identifier === 'SB 485') console.log({ identifier, vetoMemoUrl })
  const statusColor = statusColors(status.status)
  const stepLabels = billProgressStepLabels(chamber)

  const progression = progress
    .filter(d => ['first committee', 'first chamber', 'second chamber', 'reconciliation', 'governor'].includes(d.step))
    .filter(d => {
      if (d.step !== 'reconciliation') return true
      if (d.step === 'reconciliation' && d.status !== 'skipped') return true
      return false
    })
    .map(d => {
      const symbol = billStatusSymbols[d.status]
      return <div key={d.step} css={progressStepStyle}>
        <span className="icon" style={{
          color: symbol.color,
          // border: `2px solid ${symbol.color}`
        }}>{symbol.icon}</span>
        <span className="label" >{stepLabels[d.step]}</span>
      </div >
    })

  return (<tr css={tableRowCss} key={identifier}>
    <td css={tableBillCell}>

      <Link css={billCss} to={`/bills/${billUrl(identifier)}`}>
        <span>📋</span> <span css={identifierCss}>{identifier}:</span> {title}
      </Link>
      <div css={billLabelCss}>{explanation}</div>
      <div css={billInfoLineCss}>
        {sponsor && <Link css={billLinkCss} to={`/lawmakers/${lawmakerUrl(sponsor.name)}`}>
          {sponsor.name} <span css={css`color: ${partyColors(sponsor.party)}; opacity: 0.8;`}>({sponsor.party})</span>
        </Link>}
        {textUrl && <a css={billLinkCss} href={textUrl} target="_blank" rel="noopener noreferrer">📃 Bill text</a>}
        {fiscalNoteUrl && <a css={billLinkCss} href={fiscalNoteUrl} target="_blank" rel="noopener noreferrer">💵 Fiscal note</a>}
        {legalNoteUrl && <a css={billLinkCss} href={legalNoteUrl} target="_blank" rel="noopener noreferrer">🏛 Legal note</a>}
        {amendmentsUrl && <a css={billLinkCss} href={amendmentsUrl} target="_blank" rel="noopener noreferrer">🖍 Proposed amendments</a>}
        {vetoMemoUrl && <a css={billLinkCss} href={vetoMemoUrl} target="_blank" rel="noopener noreferrer">🚫 Veto memo</a>}
        {(numArticles > 0) && <Link css={billLinkCss} to={`/bills/${billUrl(identifier)}`}>📰 <strong>{numArticles}</strong> MTFP {pluralStory(numArticles)}</Link>}
      </div>

    </td>
    <td css={[statusColCss, css`border-left: 3px solid ${statusColor}`]}>
      <div>
        {progression}
      </div>

    </td>

  </tr >)
}

Bill.propTypes = {
  title: PropTypes.string.isRequired,
  identifier: PropTypes.string.isRequired,
  status: PropTypes.object.isRequired,
}

export default BillTable

export const BillTableDataFragment = graphql`
  fragment BillTableData on BillsJson {
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
    tags
    textUrl
    fiscalNoteUrl
    legalNoteUrl
    amendmentsUrl
    vetoMemoUrl
    numArticles
    sponsor {
      name
      district
      party
    }
  }
`