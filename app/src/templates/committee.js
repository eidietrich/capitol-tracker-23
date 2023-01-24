import React from "react";
import { graphql, Link } from "gatsby"
import { css } from '@emotion/react'
import ReactMarkdown from 'react-markdown'

import Layout from '../components/Layout'
import Seo from "../components/Seo"
import ContactUs from '../components/ContactUs'
import NewsletterSignup from '../components/NewsletterSignup'

import BillTable from '../components/BillTable'


import {
    percentFormat,
    lawmakerUrl,
    shortDateWithWeekday,
    parseDate,
} from '../config/utils'

import {
    partyColors,
} from '../config/config'

const committeeSummaryStyle = css`
    border: 1px solid var(--tan5);
    background-color: var(--tan1);
    padding: 0.2em;
    display: flex;
    flex-wrap: wrap;

    .item {
        border: 1px solid var(--tan4);
        margin: 0.2em;
        padding: 0.2em 0.5em;
    }
`
const getDay = d => shortDateWithWeekday(new Date(d))

const CommitteePage = ({ pageContext, data, location }) => {
    const {
        committee,
        bills
    } = pageContext
    const {
        name,
        time,
        type,
        billCount,
        billsUnscheduled,
        billsScheduledByDay,
        billsAwaitingVote,
        billsFailed,
        billsAdvanced,
        billsBlasted,
        members,
    } = committee

    const unscheduledBills = bills.filter(d => billsUnscheduled.includes(d.identifier))

    const scheduledBillsByDay = billsScheduledByDay.map(day => {
        return {
            date: day.day,
            bills: bills.filter(d => day.bills.includes(d.identifier))
        }
    })

    const unheard = Array.from(new Set(
        unscheduledBills.concat(billsScheduledByDay.map(d => d.bills).flat())
    ))

    const awaitingVoteBills = bills.filter(d => billsAwaitingVote.includes(d.identifier))
    const failedBills = bills.filter(d => billsFailed.includes(d.identifier))
    const passedBills = bills.filter(d => billsAdvanced.includes(d.identifier))
    const blastedBills = bills.filter(d => billsBlasted.includes(d.identifier))

    // const denom = failedBills.length + passedBills.length + blastedBills.length
    const denom = bills.length

    const chair = members.find(d => d.role === 'Chair')

    return <div>

        <Layout location={location}>
            <h1>{name} Committee</h1>
            <div style={{ fontSize: '1.2em', marginBottom: '0.5em' }}>🪑 Chair: <strong>{chair.name}</strong> ({chair.party}-{chair.locale})</div>

            <div css={committeeSummaryStyle}>
                <div className="item"><strong>{bills.length} bills</strong> considered</div>
                <div className="item"><strong>{unheard.length}</strong> <Link to="#awaiting-hearing">awaiting hearing</Link></div>
                <div className="item"><strong>{awaitingVoteBills.length}</strong> <Link to="#awaiting-votes">awaiting votes</Link></div>
                <div className="item"><strong>{failedBills.length}</strong> ({percentFormat(failedBills.length / denom)}) <Link to="#failed"> voted down</Link></div>
                <div className="item"><strong>{passedBills.length}</strong> ({percentFormat(passedBills.length / denom)}) <Link to="#passed">voted forward</Link></div>
            </div>

            <h2>Members</h2>
            <ul>
                {
                    members.map(m => <li key={m.name}><strong>
                        <Link to={`/lawmakers/${lawmakerUrl(m.name)}`}>{m.name} <span style={{ color: partyColors(m.party) }}>({m.party}-{m.locale})</span></Link></strong>
                        {(m.role !== 'Member') && <span> – {m.role}</span>}
                    </li>)
                }
            </ul>


            <h2>Bills considered ({billCount})</h2>

            <h3 id="awaiting-hearing">🗓 Awaiting hearing</h3>

            {
                scheduledBillsByDay.map(day => {
                    return <div key={day.date}>
                        <h4>Hearing set {getDay(day.date)}</h4>
                        <BillTable bills={day.bills} suppressCount={true} />
                    </div>
                })
            }

            <h4>Unscheduled</h4>
            <BillTable bills={unscheduledBills} displayLimit={5} />

            <NewsletterSignup />

            <h3 id="awaiting-votes">⌛️ Heard, awaiting vote</h3>
            <BillTable bills={awaitingVoteBills} displayLimit={5} />

            <h3 id="failed">🚫 Voted down</h3>
            <BillTable bills={failedBills} displayLimit={5} />

            <h3 id="passed">✅ Voted forward</h3>
            <BillTable bills={passedBills} displayLimit={5} />

            {
                (blastedBills.length > 0) && <>
                    <h3 id="blasted">🧨 Blasted from committee</h3>
                    <div className="note">Blast motions on the House or Senate floor pull bills from committee for debate there.</div>
                    <BillTable bills={blastedBills} />
                </>
            }

            <ContactUs />

        </Layout>
    </div>;
};

export default CommitteePage


export const Head = ({ pageContext }) => {
    const { committee } = pageContext
    const { name, key } = committee
    return <Seo
        title={`${name}`}
        description={`Bills and members for the Montana Legislature's 2023 {name}.`}
        pageRelativeUrl={`committees/${key}/`}
    />
}
