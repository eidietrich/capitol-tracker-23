import React from "react"
// import { AnchorLink } from "gatsby-plugin-anchor-links";
import { css } from '@emotion/react'
import { Link } from "gatsby";

import { shortDateWithWeekday, billUrl } from '../config/utils.js'

import Layout from '../components/Layout'
import Seo from '../components/Seo'
// import Text from '../components/Text'
import ContactUs from '../components/ContactUs'
import Newsletter from '../components/Newsletter'

import recap from '../data/recap.json'

const actionsDayStyle = css`
    h2 {
        color: white;
        background-color: var(--gray5);
        padding: 0.5em 0.5em;
        position: sticky;
        top: 130px;
        z-index: 10;
    }
`

const EXCLUDE_TYPES = [
    // 'Introduced',
    'First Reading',
    'Referred to Committee',
    "Rereferred to Committee",
    'Transmitted to Senate',
    'Transmitted to House',
    'Transmitted to Governor',
]
// TODO - push more of this into data processing step

const Actions = ({ location }) => {
    const { actionsByDate } = recap

    const actions = actionsByDate.map(d => {
        const committeesWithActions = Array.from(new Set(d.actions
            .filter(a => !EXCLUDE_TYPES.includes(a.description))
            .map(a => a.committee)))
        if (committeesWithActions.length === 0) return null

        return <div css={actionsDayStyle} key={d.date}>
            <h2>{shortDateWithWeekday(new Date(d.date))}</h2>
            <div>
                <div>
                    <h3>House Floor</h3>
                    <div>TK</div>
                    {/* <ul>{actions.map(action => <Action key={action.id} data={action} />)}</ul> */}
                </div>
                <div>
                    <h3>Senate Floor</h3>
                    <div>TK</div>
                    {/* <ul>{actions.map(action => <Action key={action.id} data={action} />)}</ul> */}
                </div>
                {
                    committeesWithActions.map(committee => {
                        const actions = d.actions
                            .filter(d => d.committee === committee)
                            .filter(d => !EXCLUDE_TYPES.includes(d.description))
                            .sort((a, b) => a.description.localeCompare(b.description))
                        return <div key={committee}>
                            <h3>{committee ? committee : 'House and Senate floor'}</h3>
                            <ul>{actions.map(action => <Action key={action.id} data={action} />)}</ul>
                        </div>
                    })
                }
            </div>
        </div>
    })

    return <div>
        <Layout location={location}>
            <h1>Legislative activity by day</h1>
            {actions}

            < Newsletter />

            <ContactUs />

        </Layout>
    </div>
}
export default Actions

export const Head = () => (
    <Seo
        title="Actions"
        description="What Montana lawmakers have done day by date"
    />
)

const Action = (props) => {
    const {
        // id, date, 
        description, bill, title, explanation,
        // committee 
    } = props.data
    const url = billUrl(bill)
    return <li>
        <div>{description} ({bill}: <Link to={`/bills/${url}`}>{title}</Link>)</div>
        <div className="note">{explanation}</div>
    </li >

}