import { timeFormat } from 'd3-time-format'
const dateFormat = timeFormat('%x')

export default class CalendarPage {
    constructor({ actions, bills, updateTime, calendarAnnotations }) {
        const beginningOfToday = new Date(updateTime).setUTCHours(0, 0, 0, 0)
        const majorActions = actions.filter(d => d.isHighlight || d.hearing)
        const todayOrLaterActions = majorActions.filter(d => d.date >= beginningOfToday)
        const datesOnCalendar = Array.from(new Set(todayOrLaterActions.sort((a, b) => a.date - b.date).map(d => dateFormat(d.date))))
        const actionsByDate = datesOnCalendar.map(date => {
            return {
                date,
                actions: todayOrLaterActions.filter(d => dateFormat(d.date) === date).map(a => {
                    const actionBill = bills.find(d => d.data.identifier === a.bill)
                    if (!actionBill) throw `Error, bad action match, ${a.bill}`
                    return {
                        ...a,
                        title: actionBill.data.title,
                        explanation: actionBill.data.explanation,
                    }
                })
            }
        })

        this.data = {
            actionsByDate,
        }
    }
    export = () => ({ ...this.data })

}