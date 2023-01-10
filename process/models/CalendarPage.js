import { timeFormat } from 'd3-time-format'
const dateFormat = timeFormat('%x')
const f = timeFormat('%x %X')


export default class CalendarPage {
    constructor({ actions, bills, updateTime, calendarAnnotations }) {
        const beginningOfToday = new Date(updateTime).setUTCHours(7, 0, 0, 0) // 7 accounts for Montana vs GMT time
        const todayOrLaterActions = actions.filter(d => d.date >= beginningOfToday)
        // .map(a => {
        //     // This adds data to allow more fulsome bill listings
        //     const actionBill = bills.find(d => d.data.identifier === a.bill)
        //     if (!actionBill) throw `Error, bad action match, ${a.bill}`
        //     return {
        //         ...a,
        //         title: actionBill.data.title,
        //         explanation: actionBill.data.explanation,
        //     }
        // })
        const scheduledHearings = todayOrLaterActions.filter(d => d.hearing)
        const scheduledFloorDebates = todayOrLaterActions.filter(d => d.scheduledForFloorDebate)
        const scheduledFinalVotes = todayOrLaterActions.filter(d => d.scheduledForFinalVote)
        const datesOnCalendar = Array.from(new Set(scheduledHearings.concat(scheduledFloorDebates).concat(scheduledFinalVotes).map(d => dateFormat(d.date))))
            .sort((a, b) => a - b)

        const billsOnCalendar = Array.from(new Set([...scheduledHearings, ...scheduledFloorDebates, ...scheduledFinalVotes].map(d => d.bill)))

        this.data = {
            datesOnCalendar,
            billsOnCalendar,
            scheduledHearings,
            scheduledFloorDebates,
            scheduledFinalVotes,
        }
    }
    export = () => ({ ...this.data })

}