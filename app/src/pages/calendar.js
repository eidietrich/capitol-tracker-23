import React from "react"
import { AnchorLink } from "gatsby-plugin-anchor-links";
import { Link, graphql } from "gatsby";
import { css } from '@emotion/react'

import { shortDateWithWeekday, committeeUrl, capitalize } from '../config/utils.js'

import Layout from '../components/Layout'
import Seo from '../components/Seo'
import ContactUs from '../components/ContactUs'
import NewsletterSignup from '../components/NewsletterSignup'
import BillTable from "../components/BillTable.js";

import calendar from '../data/calendar.json'

const scheduleDayStyle = css`
    h2 {
        color: white;
        background-color: var(--gray5);
        padding: 0.5em 0.5em;
        position: sticky;
        top: 130px;
        z-index: 10;
    }
`

const getDay = d => shortDateWithWeekday(new Date(d))
const urlizeDay = day => day.replaceAll(',', '').replaceAll(' ', '-')

const Calendar = ({ data, location }) => {
    const { scheduledHearings, scheduledFloorDebates, scheduledFinalVotes, datesOnCalendar, billsOnCalendar } = calendar
    const onCalendarBills = data.onCalendarBills.edges.map(d => d.node)

    // TODO - use this data to sort committee listings into AM policy, PM policy, budget, other
    // Figure out what to do about fiscal subcommittees etc.
    const committees = data.committees.edges.map(d => d.node)

    const days = datesOnCalendar.map(d => getDay(d))
    const schedule = days.map((day, i) => {

        // NOTE: As of 1/10/23 LAWs has a bug that's keeping "Scheduled for Second Reading" actions from 
        // being caught by MTFP's scraper consistently
        // const floorDebates = scheduledFloorDebates.filter(d => getDay(d.date) === day)
        // const chambersWithDebates = Array.from(new Set(floorDebates.map(a => a.posession)))

        // const finalVotes = scheduledFinalVotes.filter(d => getDay(d.date) === day)
        // const chambersWithFinalVotes = Array.from(new Set(finalVotes.map(a => a.posession)))

        const hearings = scheduledHearings.filter(d => getDay(d.date) === day)
        const committeesWithHearings = Array.from(new Set(hearings.map(a => a.committee)))
            .map(name => {
                const match = committees.find(d => d.name === name) || {}
                if (!match.key) console.log('No committee match', name)
                return {
                    name,
                    key: match.key || null,
                    cat: (match.time && match.type) ? `${match.time}-${match.type}` : null
                }
            })
        const amPolicyCommittees = committeesWithHearings.filter(d => d.cat === 'morning-policy')
        const pmPolicyCommittees = committeesWithHearings.filter(d => d.cat === 'afternoon-policy')
        const appropsCommittees = committeesWithHearings.filter(d => ['morning-fiscal-sub', 'varies-fiscal'].includes(d.cat))
        const otherCommittees = committeesWithHearings.filter(d => !['morning-policy', 'afternoon-policy', 'morning-fiscal-sub', 'varies-fiscal'].includes(d.cat))

        return <div key={day} id={urlizeDay(day)} css={scheduleDayStyle}>
            <hr />
            <h2 >📅 {day}</h2>
            {/* {(floorDebates.length > 0) && <>
                <h3>Floor debates</h3>
                <div className="note">Debates are followed by Second Reading votes.</div>
                <div>
                    {
                        chambersWithDebates.map(chamber => {
                            const debateBills = floorDebates.filter(d => d.posession === chamber).map(d => d.bill)
                            const bills = onCalendarBills.filter(d => debateBills.includes(d.identifier))
                            return <div key={`second-${day}-${chamber}`}>
                                <h4>{capitalize(chamber)} floor session</h4>
                                <BillTable bills={bills} displayLimit={10} suppressCount={true} />
                            </div>
                        })
                    }
                </div>
            </>}
            {(finalVotes.length > 0) && <>
                <h3>Final floor votes</h3>
                <div className="note">Third reading votes on bills that have passed their Second Reading.</div>
                <div>
                    {
                        chambersWithFinalVotes.map(chamber => {
                            const finalVoteBills = finalVotes.filter(d => d.posession === chamber).map(d => d.bill)
                            const bills = onCalendarBills.filter(d => finalVoteBills.includes(d.identifier))
                            return <div key={`third-${day}-${chamber}`}>
                                <h4>{capitalize(chamber)} floor session</h4>
                                <BillTable bills={bills} displayLimit={10} suppressCount={true} />
                            </div>
                        })
                    }
                </div>
            </>} */}
            {(hearings.length > 0) && <>
                <h3>Commitee hearings</h3>
                <div className="note">Bill hearings are an opportunity for the sponsor to explain a bill. They also allow for lobbyists and other members of the public to testify in support or opposition.</div>
                {
                    amPolicyCommittees.length > 0 && <>
                        <h4>MORNING POLICY COMMITTEES</h4>
                        <div>
                            {
                                amPolicyCommittees.map(committee => <Committee key={`${day}-${committee.name}`} committee={committee} hearings={hearings} onCalendarBills={onCalendarBills} />)
                            }
                        </div>
                    </>
                }
                {
                    pmPolicyCommittees.length > 0 && <>
                        <h4>AFTERNOON POLICY COMMITTEES</h4>
                        <div>
                            {
                                pmPolicyCommittees.map(committee => <Committee key={`${day}-${committee.name}`} committee={committee} hearings={hearings} onCalendarBills={onCalendarBills} />)
                            }
                        </div>
                    </>
                }
                {
                    appropsCommittees.length > 0 && <>
                        <h4>BUDGET COMMITTEES</h4>
                        <div>
                            {
                                appropsCommittees.map(committee => <Committee key={`${day}-${committee.name}`} committee={committee} hearings={hearings} onCalendarBills={onCalendarBills} />)
                            }
                        </div>
                    </>
                }
                {
                    otherCommittees.length > 0 && <>
                        <h4>OTHER COMMITTEES</h4>
                        <div>
                            {
                                otherCommittees.map(committee => <Committee key={`${day}-${committee.name}`} committee={committee} hearings={hearings} onCalendarBills={onCalendarBills} />)
                            }
                        </div>
                    </>
                }
            </>}
            {/* Add newsletter promo after first day on calendar */}
            {(i === 0) && < NewsletterSignup />}
        </div>
    })

    return <div>

        <Layout location={location}>

            <h1>What's coming up at the Legislature</h1>

            <div>
                {days.map((day, i) => <span key={day}>{i !== 0 ? ' • ' : ''}<AnchorLink to={`calendar/#${urlizeDay(day)}`}>{day}</AnchorLink></span>)}
            </div>

            <p>This listing currently includes only committee bill hearings. Official calendars listing floor debates are available <a href="http://laws.leg.mt.gov/legprd/laws_agendas.agendarpt?chamber=H&P_SESS=20231" target="_blank" rel="noopener noreferrer">here for the House</a> and <a href="http://laws.leg.mt.gov/legprd/laws_agendas.agendarpt?chamber=S&P_SESS=20231" target="_blank" rel="noopener noreferrer">here for the Senate</a>.</p>

            {schedule}
            <ContactUs />

        </Layout>
    </div>
}

const Committee = props => {
    const { committee, onCalendarBills, hearings } = props
    const committeeHearingBills = hearings.filter(d => d.committee === committee.name).map(d => d.bill)
    const bills = onCalendarBills.filter(d => committeeHearingBills.includes(d.identifier))
    return <div>
        <h4>👥 <Link to={`/committees/${committee.key}`}>{committee.name}</Link></h4>
        {/* <div className="note">{time}{type}</div> */}
        <BillTable bills={bills} displayLimit={10} suppressCount={true} />
        {/* <ul>{committeeHearings.map(d => <Hearing key={d.id} data={d} />)}</ul> */}
    </div>
}

export const Head = () => (
    <Seo
        title="Calendar"
        description="What's coming up at the 2023 Legislature"
        pageRelativeUrl="calendar/"
    />
)

export default Calendar

export const query = graphql`
    query CalendarPageQuery {
        onCalendarBills: allBillsJson(filter: {isOnCalendar: {eq: true}}) {
            edges {
                node {
                    ...BillTableData
                }
            }
        }   
        committees: allCommitteesJson {
            edges {
                node {
                    name
                    key
                    time
                    type
                }
            }
        }
    } 
`