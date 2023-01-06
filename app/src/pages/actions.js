import React from "react"
// import { AnchorLink } from "gatsby-plugin-anchor-links";
import { Link } from "gatsby";

import { shortDateWithWeekday, billUrl } from '../config/utils.js'

import Layout from '../components/Layout'
import Seo from '../components/Seo'
// import Text from '../components/Text'
import ContactUs from '../components/ContactUs'
import Newsletter from '../components/Newsletter'

import recap from '../data/recap.json'

const EXCLUDE_TYPES = ['Introduced', 'First Reading', 'Referred to Committee', "Rereferred to Committee"]
// TODO - push more of this into data processing step

const Actions = () => {
    const { actionsByDate } = recap

    const actions = actionsByDate.map(d => {
        const committeesWithActions = Array.from(new Set(d.actions
            .filter(a => !EXCLUDE_TYPES.includes(a.description))
            .map(a => a.committee)))
        if (committeesWithActions.length === 0) return null
        return <div key={d.date}>
            <h3>{shortDateWithWeekday(new Date(d.date))}</h3>
            <div>
                {
                    committeesWithActions.map(committee => {
                        const actions = d.actions
                            .filter(d => d.committee === committee)
                            .filter(d => !EXCLUDE_TYPES.includes(d.description))
                            .sort((a, b) => a.description.localeCompare(b.description))
                        return <div key={committee}>
                            <h4>{committee ? committee : 'House and Senate floor'}</h4>
                            <ul>{actions.map(action => <Action key={action.id} data={action} />)}</ul>
                        </div>
                    })
                }
            </div>
        </div>
    })

    return <div>
        <Layout>
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