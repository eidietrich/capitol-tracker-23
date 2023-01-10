import { dateParse } from '../functions.js'

export default class RecapPage {
    constructor({ actions, bills, updateTime, recapAnnotations }) {
        const beginningOfToday = new Date(updateTime).setUTCHours(7, 0, 0, 0)
        const majorActions = actions.filter(d => d.isMajor) // && !d.introduction
        const pastActions = majorActions.filter(d => dateParse(d.date) <= beginningOfToday)
        const datesThatHaveHappened = Array.from(new Set(pastActions.sort((a, b) => b.date - a.date).map(d => d.date)))
        console.log(datesThatHaveHappened)
        const actionsByDate = datesThatHaveHappened.map(date => {
            return {
                date,
                actions: pastActions.filter(d => dateFormat(d.date) === date).map(a => {
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