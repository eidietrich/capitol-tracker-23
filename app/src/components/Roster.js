import React from 'react'
import { css } from '@emotion/react'
import { graphql } from 'gatsby'

import LawmakerTable from '../components/LawmakerTable'

const sideBySideTableCss = css`
  display: flex;
  flex-wrap: wrap;
  margin: -0.5em;
`
const tableContainerCss = css`
  flex: 1 0 300px;
  min-width: 380px;
  margin: 0.5em;
`

const Roster = (props) => {
  const { lawmakers,
    // chamberLabel 
  } = props
  // const numVotesRecorded = lawmakers.map(d => d.votingSummary.numVotesRecorded)[1]
  return <div>
    <div css={sideBySideTableCss}>
      <div css={tableContainerCss}>
        <h4>Republicans</h4>
        <LawmakerTable lawmakers={lawmakers.filter(d => d.party === 'R')} />
      </div>

      <div css={tableContainerCss}>
        <h4>Democrats</h4>
        <LawmakerTable lawmakers={lawmakers.filter(d => d.party === 'D')} />
      </div>
    </div>
    {/* <div className="note">Voting metrics based on {numberFormat(numVotesRecorded)} votes recorded on the {chamberLabel} floor through {dateFormat(new Date(summary.mostRecentActionDate))}.</div> */}

  </div>
}

export default Roster

export const rosterLawmakerDataFragment = graphql`
  fragment RosterData on LawmakersJson {
    key
    title
    name
    district
    party
    locale 
    votingSummary {
      numVotesCast
      numVotesNotPresent
      numVotesPresent
      votesOnWinningSide
      fractionVotesOnWinningSide
      votesWithGopCaucus
      fractionVotesWithGopCaucus
      votesWithDemCaucus
      fractionVotesWithDemCaucus
      averageAbsences
      averageVotesOnWinningSideGop
      averageVotesOnWinningSideDem
      averageVotesWithGopCaucusGop
      averageVotesWithGopCaucusDem
      averageVotesWithDemCaucusGop
      averageVotesWithDemCaucusDem
    }
  }
`