// import { timeFormat } from 'd3-time-format'
// const dateFormat = timeFormat('%x')


export default class CalendarPage {
    constructor({ actions, bills, updateTime, calendarAnnotations }) {
        const beginningOfToday = new Date(updateTime).setUTCHours(0, 0, 0, 0)
        
        
        const todayOrLaterActions = actions.filter(d => d.date >= beginningOfToday)
            .map(a => {
                // This adds data to allow more fulsome bill listings
                const actionBill = bills.find(d => d.data.identifier === a.bill)
                if (!actionBill) throw `Error, bad action match, ${a.bill}`
                return {
                    ...a,
                    title: actionBill.data.title,
                    explanation: actionBill.data.explanation,
                }
            })
        const scheduledHearings = todayOrLaterActions.filter(d => d.hearing)
        const scheduledFloorDebates = todayOrLaterActions.filter(d => d.scheduledForFloorDebate)
        const scheduledFinalVotes = todayOrLaterActions.filter(d => d.scheduledForFinalVote)

        // const actionTypes = Array.from(new Set(majorActions.map(d => d.description)))

        // const datesOnCalendar = Array.from(new Set(todayOrLaterActions.sort((a, b) => a.date - b.date).map(d => dateFormat(d.date))))
        // const actionsByDate = datesOnCalendar.map(date => {
        //     return {
        //         date,
        //         actions: todayOrLaterActions.filter(d => dateFormat(d.date) === date).map(a => {
        //             const actionBill = bills.find(d => d.data.identifier === a.bill)
        //             if (!actionBill) throw `Error, bad action match, ${a.bill}`
        //             return {
        //                 ...a,
        //                 title: actionBill.data.title,
        //                 explanation: actionBill.data.explanation,
        //             }
        //         })
        //     }
        // })

        this.data = {
            scheduledHearings,
            scheduledFloorDebates,
            scheduledFinalVotes
        }
    }
    export = () => ({ ...this.data })

}