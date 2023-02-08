
import { commiteeKey, dateParse } from '../functions.js'


const PARTY_ORDER = ['R', 'D'] // majority, minority
const ROLE_ORDER = ['Chair', 'Vice Chair', 'Member']

export default class Committee {
    constructor({ schema, billActions, lawmakers, updateTime }) {
        const {
            name,
            daysOfWeek,
            time,
            type
        } = schema
        const beginningOfToday = new Date(updateTime).setUTCHours(7, 0, 0, 0) // 7 accounts for Montana vs GMT time

        // Bills that have actions with the committee attached
        const bills = Array.from(new Set(billActions.map(d => d.bill)))

        // Sorting bills by category
        const billsReferred = Array.from(new Set(
            billActions.filter(d => d.committeeReferral).map(d => d.bill)
        ))

        const billsRereferredToOtherCommittee = [] // TODO
        // TODO - add a step here that separates out bills that have been rereferred to another committee before getting action here
        // Needs to account for rerefers that came after a hearing has been held
        // LOGIC: If there's a subsequent rerefer action that comes before a bill action action
        // Also TODO - figure out how re-referred bills fit into counts


        const hearings = billActions.filter(d => d.hearing)
        const hearingsPast = hearings.filter(d => dateParse(d.date) < beginningOfToday)
        const billsHeard = Array.from(new Set(hearingsPast.map(d => d.bill)))

        const hearingsScheduled = hearings.filter(d => dateParse(d.date) >= beginningOfToday)
        const billsScheduled = Array.from(new Set(hearingsScheduled.map(d => d.bill)))
        const daysOnSchedule = Array.from(new Set(hearingsScheduled.map(d => d.date)))
            .sort((a, b) => new Date(a) - new Date(b))
        const billsScheduledByDay = daysOnSchedule.map(day => ({
            day,
            bills: hearingsScheduled.filter(d => d.date === day).map(d => d.bill)
        }))

        const billsUnscheduled = billsReferred.filter(d =>
            !billsHeard.includes(d)
            && !billsScheduled.includes(d)
            && !billsRereferredToOtherCommittee.includes(d)
        )

        // This wrinkle is an attempt to sort out bills that ended up reconsidered
        const lastActionsByBill = bills.map(bill => {
            const actions = billActions.filter(d => d.isMajor)
                .filter(d => d.failed || d.advanced)
                .filter(d => d.bill === bill)
            if (actions.length === 0) return []
            return actions.slice(-1)[0]
        })

        const billsFailed = lastActionsByBill.filter(d => d.failed).map(d => d.bill)
        const billsAdvanced = lastActionsByBill.filter(d => d.advanced && !d.blasted).map(d => d.bill)
        const billsBlasted = Array.from(new Set(
            billActions.filter(d => d.blasted).map(d => d.bill)
        ))
        const billsAwaitingVote = billsHeard.filter(d =>
            !billsFailed.includes(d)
            && !billsAdvanced.includes(d)
            && !billsBlasted.includes(d)
            && !billsRereferredToOtherCommittee.includes(d)
        )

        const members = lawmakers.map(d => {
            const lawmaker = d.data
            return {
                name: lawmaker.name,
                party: lawmaker.party,
                locale: lawmaker.locale,
                role: lawmaker.committees.find(c => c.committee === name).role,
            }
        }).sort((a, b) => (PARTY_ORDER.indexOf(a.party) - PARTY_ORDER.indexOf(b.party))
            || (ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role))
        )

        this.data = {
            name,
            key: commiteeKey(name),
            chamber: this.chamberFromName(name),
            time,
            type,
            bills,
            billCount: bills.length,
            billsUnscheduled,
            billsScheduled,
            billsScheduledByDay,
            billsAwaitingVote,
            billsFailed,
            billsAdvanced,
            billsBlasted,

            members,
        }
        // console.log(name, this.data.overview)
    }

    chamberFromName(name) {
        if (name.includes('Joint')) return 'joint'
        if (name.includes('House')) return 'house'
        if (name.includes('Senate')) return 'senate'
    }

    export = () => this.data

}