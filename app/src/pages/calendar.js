import React from "react"
import { AnchorLink } from "gatsby-plugin-anchor-links";
import { Link, graphql } from "gatsby";

import { shortDateWithWeekday, formatTime, billUrl } from '../config/utils.js'

import Layout from '../components/Layout'
import Seo from '../components/Seo'
// import Text from '../components/Text'
import ContactUs from '../components/ContactUs'
import Newsletter from '../components/Newsletter'
import UpcomingHearings from '../components/overview/UpcomingHearings'
import UpcomingFloorActions from '../components/overview/UpcomingFloorActions'

import calendar from '../data/calendar.json'

const Calendar = () => {
    const { actionsByDate } = calendar

    const upcomingHearings = actionsByDate.map(d => {
        const committeesWithHearings = Array.from(new Set(d.actions.map(a => a.committee))).filter(d => d)
        return <div key={d.date}>
            <h3 >{shortDateWithWeekday(new Date(d.date))}</h3>
            <div>
                {
                    committeesWithHearings.map(committee => {
                        const hearings = d.actions.filter(d => d.hearing && d.committee === committee)
                        return <div key={committee}>
                            <h4>{committee.replace('(H)', 'House').replace('(S)', 'Senate')}</h4>
                            <ul>{hearings.map(hearing => <Hearing key={hearing.id} data={hearing} />)}</ul>
                        </div>
                    })
                }
            </div>
        </div>
    })

    return <div>

        <Layout>
            <h1>What's coming up at the Legislature</h1>

            <h2 id="upcoming-bill-hearings">Scheduled bill hearings</h2>
            <p>Hearings are an opportunity for the sponsor to explain a bill and for lobbyists and other members of the public to testify in support or opposition. Hearings are typically announced at least a few days in advance. Committees votes on forwarding bills for full floor debates typically happen at later committee meetings and often aren't announced in advance.</p>
            <p>For more information on hearing times and locations, see <a href="http://laws.leg.mt.gov/legprd/LAW0240W$CMTE.ActionQuery?P_SESS=20231&P_COM_NM=&P_ACTN_DTM=01%2F02%2F2023&U_ACTN_DTM=05%2F01%2F2023&Z_ACTION2=Find#h_list">here for House committee hearings</a> and <a href="http://laws.leg.mt.gov/legprd/LAW0240W$CMTE.ActionQuery?P_SESS=20231&P_COM_NM=&P_ACTN_DTM=01%2F02%2F2023&U_ACTN_DTM=05%2F01%2F2023&Z_ACTION2=Find#s_list">here for Senate committee hearings</a>.</p>
            {upcomingHearings}

            <h2 id="upcoming-floor-actions">Scheduled House and Senate floor actions</h2>
            <div>See also: <a href="http://laws.leg.mt.gov/legprd/laws_agendas.agendarpt?chamber=H&P_SESS=20211">Official House agendas</a>. <a href="http://laws.leg.mt.gov/legprd/laws_agendas.agendarpt?chamber=S&P_SESS=20211">Official Senate agendas</a>.</div>

            < Newsletter />

            <ContactUs />

        </Layout>
    </div>
}

const Hearing = (props) => {
    const { id, date, bill, title, explanation, committee } = props.data
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