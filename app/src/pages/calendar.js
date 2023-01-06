import React from "react"
import { AnchorLink } from "gatsby-plugin-anchor-links";
import { Link } from "gatsby";

import { shortDateWithWeekday, billUrl, capitalize } from '../config/utils.js'

import Layout from '../components/Layout'
import Seo from '../components/Seo'
import ContactUs from '../components/ContactUs'
import Newsletter from '../components/Newsletter'

import calendar from '../data/calendar.json'

const getDay = d => shortDateWithWeekday(new Date(d))
const urlizeDay = day => day.replaceAll(',', '').replaceAll(' ', '-')

const Calendar = () => {
    const { scheduledHearings, scheduledFloorDebates, scheduledFinalVotes } = calendar

    const days = Array.from(new Set(scheduledHearings.concat(scheduledFloorDebates).concat(scheduledFinalVotes).map(d => d.date)))
        .sort((a, b) => a - b)
        .map(d => getDay(d))

    const schedule = days.map(day => {

        const floorDebates = scheduledFloorDebates.filter(d => getDay(d.date) === day)
        const chambersWithDebates = Array.from(new Set(floorDebates.map(a => a.posession)))

        const finalVotes = scheduledFinalVotes.filter(d => getDay(d.date) === day)
        const chambersWithFinalVotes = Array.from(new Set(finalVotes.map(a => a.posession)))

        const hearings = scheduledHearings.filter(d => getDay(d.date) === day)
        const committeesWithHearings = Array.from(new Set(hearings.map(a => a.committee)))

        return <div key={day} id={urlizeDay(day)}>
            <h3 >{day}</h3>
            {(floorDebates.length > 0) && <>
                <h4>Floor debates</h4>
                <div className="note">Debates are followed by Second Reading votes.</div>
                <div>
                    {
                        chambersWithDebates.map(chamber => {
                            const chamberVotes = floorDebates.filter(d => d.posession === chamber)
                            return <div key={`${day}-${chamber}`}>
                                <h5>{capitalize(chamber)} floor session</h5>
                                <ul>{chamberVotes.map(d => <FloorDebate key={d.id} data={d} />)}</ul>
                            </div>
                        })
                    }
                </div>
            </>}
            {(floorDebates.length > 0) && <>
                <h4>Final floor votes</h4>
                <div className="note">Third reading votes on bills that have passed their Second Reading.</div>
                <div>
                    {
                        chambersWithFinalVotes.map(chamber => {
                            const chamberVotes = finalVotes.filter(d => d.posession === chamber)
                            return <div key={`${day}-${chamber}`}>
                                <h5>{capitalize(chamber)} floor session</h5>
                                <ul>{chamberVotes.map(d => <FinalVote key={d.id} data={d} />)}</ul>
                            </div>
                        })
                    }
                </div>
            </>}
            {(hearings.length > 0) && <>
                <h4>Commitee hearings</h4>
                <div className="note">Bill hearings are an opportunity for the sponsor to explain a bill. They also allow for lobbyists and other members of the public to testify in support or opposition.</div>
                <div>
                    {
                        committeesWithHearings.map(committee => {
                            const committeeHearings = hearings.filter(d => d.committee === committee)
                            return <div key={`${day}-${committee}`}>
                                <h5>{committee}</h5>
                                <ul>{committeeHearings.map(d => <Hearing key={d.id} data={d} />)}</ul>
                            </div>
                        })
                    }
                </div>
            </>}
        </div>
    })

    return <div>

        <Layout>
            <h1>What's coming up at the Legislature</h1>

            <div>
                {days.map((day, i) => <>{i !== 0 ? ' • ' : ''}<AnchorLink key={day} to={`calendar/#${urlizeDay(day)}`}>{day}</AnchorLink></>)}
            </div>

            {schedule}

            < h2 id="upcoming-bill-hearings" > Scheduled bill hearings</h2>
            <p>Hearings are an opportunity for the sponsor to explain a bill and for lobbyists and other members of the public to testify in support or opposition. Hearings are typically announced at least a few days in advance. Committees votes on forwarding bills for full floor debates typically happen at later committee meetings and often aren't announced in advance.</p>
            <p>For more information on hearing times and locations, see <a href="http://laws.leg.mt.gov/legprd/LAW0240W$CMTE.ActionQuery?P_SESS=20231&P_COM_NM=&P_ACTN_DTM=01%2F02%2F2023&U_ACTN_DTM=05%2F01%2F2023&Z_ACTION2=Find#h_list" target="_blank" rel="noopener noreferrer">here for House committee hearings</a> and <a href="http://laws.leg.mt.gov/legprd/LAW0240W$CMTE.ActionQuery?P_SESS=20231&P_COM_NM=&P_ACTN_DTM=01%2F02%2F2023&U_ACTN_DTM=05%2F01%2F2023&Z_ACTION2=Find#s_list" target="_blank" rel="noopener noreferrer">here for Senate committee hearings</a>.</p>


            <h2 id="upcoming-floor-actions">Scheduled House and Senate floor actions</h2>
            <div>See also: <a href="http://laws.leg.mt.gov/legprd/laws_agendas.agendarpt?chamber=H&P_SESS=20231" target="_blank" rel="noopener noreferrer">Official House agendas</a>. <a href="http://laws.leg.mt.gov/legprd/laws_agendas.agendarpt?chamber=S&P_SESS=20231" target="_blank" rel="noopener noreferrer">Official Senate agendas</a>.</div>

            < Newsletter />

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