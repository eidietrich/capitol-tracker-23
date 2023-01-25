
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
        // const commiteeBills = this.getBillsThroughCommittee(name, bills)
        const bills = Array.from(new Set(billActions.map(d => d.bill)))

        const referred = Array.from(new Set(
            billActions.filter(d => d.committeeReferral).map(d => d.bill)
        ))

        const beginningOfToday = new Date(updateTime).setUTCHours(7, 0, 0, 0) // 7 accounts for Montana vs GMT time
        const hearings = billActions.filter(d => d.hearing)
        const pastHearings = hearings.filter(d => dateParse(d.date) < beginningOfToday)
        const heard = Array.from(new Set(pastHearings.map(d => d.bill)))
        const scheduledHearings = hearings.filter(d => dateParse(d.date) >= beginningOfToday)

        const scheduled = Array.from(new Set(scheduledHearings.map(d => d.bill)))
        const daysOnSchedule = Array.from(new Set(scheduledHearings.map(d => d.date)))
            .sort((a, b) => new Date(a) - new Date(b))

        const scheduledByDay = daysOnSchedule.map(day => ({
            day,
            bills: scheduledHearings.filter(d => d.date === day).map(d => d.bill)
        }))

        const referredAndUnscheduled = referred.filter(d => !heard.includes(d) && !scheduled.includes(d))

        // This wrinkle is an attempt to sort out bills that ended up reconsidered
        const lastActionsByBill = bills.map(bill => {
            const actions = billActions.filter(d => d.isMajor)
                .filter(d => d.failed || d.advanced)
                .filter(d => d.bill === bill)
            if (actions.length === 0) return []
            return actions.slice(-1)[0]
        })

        const failed = lastActionsByBill.filter(d => d.failed).map(d => d.bill)
        const advanced = lastActionsByBill.filter(d => d.advanced && !d.blasted).map(d => d.bill)
        const blasted = Array.from(new Set(
            billActions.filter(d => d.blasted).map(d => d.bill)
        ))
        const awaitingVote = heard.filter(d => !failed.includes(d) && !advanced.includes(d) && !blasted.includes(d))

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
            time,
            type,
            bills,
            billCount: bills.length,
            billsUnscheduled: referredAndUnscheduled,
            billsScheduledByDay: scheduledByDay,
            billsAwaitingVote: awaitingVote,
            billsFailed: failed,
            billsAdvanced: advanced,
            billsBlasted: blasted,

            members,
        }
        // console.log(name, this.data.overview)
    }

    // chamberFromName(name) {
    //     if (name.includes('Joint')) return 'joint'
    //     if (name.includes('House')) return 'house'
    //     if (name.includes('Senate')) return 'senate'
    // }

    export = () => this.data

}