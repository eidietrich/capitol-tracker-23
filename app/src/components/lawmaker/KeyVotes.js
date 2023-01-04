import React from 'react';
import { Link } from 'gatsby'
import { css } from '@emotion/react'

import {
    billUrl
} from '../../config/utils'

import {
    positionColors,
    partyColors
} from '../../config/config'

import {
    tableStyle,
} from '../../config/styles'

const keyVotesStyle = css`
  tr.vote-row {
    padding: 0.5em;
    background: var(--tan1);
  }
  td, th {
    text-align: center;
    border-left: 1px solid white;
  }
  .description-col {
    text-align: left;
  }
  .vote-breakdown {
    display: inline-block;
    font-weight: normal;
  }
`

const LawmakerKeyVotes = ({ lastName, party, keyBillVotes }) => {
    if (keyBillVotes.length === 0) {
        return <div css={keyVotesStyle}>
            <div className="note">No key votes identified at this point.</div>
        </div>
    }

    return <div css={keyVotesStyle}>
        <table css={tableStyle}>
            <thead><tr>
                <th className="name-col"><strong>{lastName} <span style={{ color: partyColors(party) }}>({party})</span></strong></th>
                <th className="outcome-col">Outcome</th>
                <th className="gop-outcome-col" style={{ color: partyColors('R') }}>Republicans</th>
                <th className="dem-outcome-col" style={{ color: partyColors('D') }}>Democrats</th>
                <th className="description-col">Motion</th>
            </tr></thead>
            {
                keyBillVotes.map(v => <KeyVote key={v.voteData.action} vote={v.lawmakerVote} context={v.voteData} />)
            }
        </table>
    </div>
}

const KeyVote = ({ vote, context }) => {
    const url = billUrl(context.bill)
    return <tr className="vote-row">
        <td className="name-col" style={{ background: positionColors(vote) }}>
            {{ 'Y': 'YES', 'N': 'NO', 'E': 'Excused', 'A': 'Absent' }[vote]}
        </td>
        <td className="outcome-col" style={{ background: positionColors(context.motionPassed ? 'Y' : 'N'), opacity: 0.7 }}>
            {context.motionPassed ? 'Y' : 'N'} <span class="vote-breakdown">({context.count.Y}-{context.count.N})</span>
        </td>
        <td className="gop-outcome-col" style={{ background: positionColors(context.gopSupported ? 'Y' : 'N'), opacity: 0.7 }}>
            {context.gopSupported ? 'Y' : 'N'} <span class="vote-breakdown">({context.gopCount.Y}-{context.gopCount.N})</span>
        </td>
        <td className="dem-outcome-col" style={{ background: positionColors(context.demSupported ? 'Y' : 'N'), opacity: 0.7 }}>
            {context.demSupported ? 'Y' : 'N'} <span class="vote-breakdown">({context.demCount.Y}-{context.demCount.N})</span>
        </td>
        <td className="description-col">
            <div><Link to={`/bills/${url}`}>{context.bill}</Link> – {context.motion}</div>
            {/* <div>Bill title here</div> */}
        </td>
    </tr >
}

export default LawmakerKeyVotes