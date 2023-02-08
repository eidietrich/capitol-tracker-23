import React from "react"
// import { AnchorLink } from "gatsby-plugin-anchor-links";
import { css } from '@emotion/react'
import { Link } from "gatsby";

import { shortDateWithWeekday, billUrl } from '../config/utils.js'

import Layout from '../components/Layout'
import Seo from '../components/Seo'
// import Text from '../components/Text'
import ContactUs from '../components/ContactUs'
import NewsletterSignup from '../components/NewsletterSignup'

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

// TODO - push more of this into data processing step

const cleanDescription = text => text.replace('Committee Executive Action--', 'Committee Action: ')

const Actions = ({ location }) => {
    const { actionsByDate } = recap

    const actions = actionsByDate.map((day, i) => {
        const committeesWithActions = Array.from(new Set(day.actions
            .map(a => a.committee)))
        if (committeesWithActions.length === 0) return null


        const displayCommittees = committeesWithActions.filter(d => d !== null)
            .sort((a, b) => a - b) // alphabetical
        const nonCommitteeActions = day.actions.filter(d => d.committee === null)
        const governorActions = nonCommitteeActions.filter(d => d.posession === 'governor')
        const houseActions = nonCommitteeActions.filter(d => d.posession === 'house')
        const senateActions = nonCommitteeActions.filter(d => d.posession === 'senate')
        const governorActionTypes = Array.from(new Set(governorActions.map(d => d.description))).sort()
        const houseActionTypes = Array.from(new Set(houseActions.map(d => d.description))).sort()
        const senateActionTypes = Array.from(new Set(senateActions.map(d => d.description))).sort()

        return <div css={actionsDayStyle} key={day.date}>
            <h2>📅 {shortDateWithWeekday(new Date(day.date))}</h2>
            <div>
                {(governorActionTypes.length > 0) && <div>
                    <h3>🖋️ GOVERNOR</h3>
                    {
                        governorActionTypes.map(description => {
                            const actionsOfType = governorActions.filter(d => d.description === description)
                            return <div key={`governor-${description}`}>
                                <h4>{description} ({actionsOfType.length})</h4>
                                <ul>{actionsOfType.map(action => <Action key={action.id} data={action} />)}</ul>
                            </div>
                        })
                    }
                </div>}
                <div>
                    <h3>🏛 HOUSE FLOOR</h3>
                    {houseActionTypes.length === 0 && <div className="note">Nothing recorded. The House usually convenes in early afternoon.</div>}
                    {
                        houseActionTypes.map(description => {
                            const actionsOfType = houseActions.filter(d => d.description === description)
                            return <div key={`house-${description}`}>
                                <h4>{cleanDescription(description)} ({actionsOfType.length})</h4>
                                <ul>{actionsOfType.map(action => <Action key={action.id} data={action} />)}</ul>
                            </div>
                        })
                    }
                </div>
                <div>
                    <h3>🏛 SENATE FLOOR</h3>
                    {senateActionTypes.length === 0 && <div className="note">Nothing recorded. The Senate usually convenes in early afternoon.</div>}
                    {
                        senateActionTypes.map(description => {
                            const actionsOfType = senateActions.filter(d => d.description === description)
                            return <div key={`house-${description}`}>
                                <h4>{cleanDescription(description)} ({actionsOfType.length})</h4>
                                <ul>{actionsOfType.map(action => <Action key={action.id} data={action} />)}</ul>
                            </div>
                        })
                    }
                </div>
                {
                    displayCommittees.map(committee => {
                        const commiteeActions = day.actions
                            .filter(d => d.committee === committee)
                        // .sort((a, b) => a.description.localeCompare(b.description))
                        const committeeActionTypes = Array.from(new Set(commiteeActions.map(d => d.description)))
                            .sort((a, b) => a - b)

                        return <div key={committee}>
                            <h3>👥 {committee}</h3>
                            {/* <ul>{commiteeActions.map(action => <Action key={action.id} data={action} />)}</ul> */}
                            {
                                committeeActionTypes.map(description => {
                                    const actionsOfType = commiteeActions.filter(d => d.description === description)
                                    return <div key={`${committee}-${description}`}>
                                        <h4>{cleanDescription(description)} ({actionsOfType.length})</h4>
                                        <ul>{actionsOfType.map(action => <Action key={action.id} data={action} />)}</ul>
                                    </div>
                                })
                            }
                        </div>
                    })
                }
            </div>
            {(i === 0) && < NewsletterSignup />}
        </div>
    })

    return <div>
        <Layout location={location}>
            <h1>What lawmakers have done so far</h1>
            <p>Procedural action on bills under consideration by the 2023 Legislature.</p>

            {actions}

            <ContactUs />

        </Layout>
    </div>
}
export default Actions

export const Head = () => (
    <Seo
        title="Recap"
        description="Procedural action on bills under consideration by the 2023 Legislature."
        pageRelativeUrl="recap/"
    />
)


const Action = ({ data }) => {
    const {
        // id, date, 
        // description, 
        bill, title, explanation,
        // committee 
    } = data
    const url = billUrl(bill)

    return <li>
        {/* <div>{cleanDescription(description)}</div> */}
        <div>📋 <Link to={`/bills/${url}`}><strong>{bill}</strong>: {title}</Link></div>
        <div className="note">{explanation}</div>
    </li >

}