import React from "react"
import { AnchorLink } from "gatsby-plugin-anchor-links";
import { Link, graphql } from "gatsby";
import { css } from '@emotion/react'

import { shortDateWithWeekday, billUrl, capitalize } from '../config/utils.js'

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

        // console.log({ day, floorDebates, finalVotes, hearings })

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
                <div>
                    {
                        committeesWithHearings.map(committee => {
                            const committeeHearingBills = hearings.filter(d => d.committee === committee).map(d => d.bill)
                            const bills = onCalendarBills.filter(d => committeeHearingBills.includes(d.identifier))
                            return <div key={`${day}-${committee}`}>
                                <h4>👥 {committee}</h4>
                                <BillTable bills={bills} displayLimit={10} suppressCount={true} />
                                {/* <ul>{committeeHearings.map(d => <Hearing key={d.id} data={d} />)}</ul> */}
                            </div>
                        })
                    }
                </div>
            </>}
            {/* Add newsletter promo after first day on calendar */}
            {(i === 1) && < NewsletterSignup />}
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

const FloorDebate = ({ data }) => {
    const {
        // id, date, 
        bill, title, explanation,
        // committee 
    } = data
    const url = billUrl(bill)
    return <li>
        <div>{bill}: <Link to={`/bills/${url}`}>{title}</Link></div>
        <div className="note">{explanation}</div>
    </li >
}

const FinalVote = ({ data }) => {
    const {
        // id, date, 
        bill, title, explanation,
        // committee 
    } = data
    const url = billUrl(bill)
    return <li>
        <div>{bill}: <Link to={`/bills/${url}`}>{title}</Link></div>
        <div className="note">{explanation}</div>
    </li >
}

const Hearing = ({ data }) => {
    const {
        // id, date, 
        bill, title, explanation,
        // committee 
    } = data
    const url = billUrl(bill)
    return <li>
        <div>{bill}: <Link to={`/bills/${url}`}>{title}</Link></div>
        <div className="note">{explanation}</div>
    </li >

}

export const Head = () => (
    <Seo
        title="Calendar"
        description="Upcoming bill hearings"
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
  }
            `