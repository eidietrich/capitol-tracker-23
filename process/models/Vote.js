
import { standardizeLawmakerName, getLawmakerSummary } from '../functions.js'


export default class Vote {
    constructor({ vote }) {
        const {
            url,
            bill, // identifier
            action_id,
            session,
            type,
            seq_number,
            date,
            description,
            totals,
            votes,
            error,
        } = vote

        this.bill = bill
        this.votes = this.cleanVotes(votes || [])

        // TODO -- work out how to classify vote threshold
        // May need to flow the required threshold in from bill data
        const thresholdRequired = this.classifyMotionThreshold({
            voteType: type,
            bill,
            motion: description,
        })
        const gopCount = this.getPartyCount(this.votes, 'R')
        const demCount = this.getPartyCount(this.votes, 'D')

        this.data = {
            action: action_id,
            bill,
            date,
            type,
            seqNumber: seq_number,
            bill,
            voteUrl: url,
            session,
            motion: description,

            thresholdRequired,

            count: totals, // reformatting
            gopCount,
            demCount,

            motionPassed: this.didMotionPass(totals, thresholdRequired),
            gopSupported: this.didMotionPass(gopCount, thresholdRequired),
            demSupported: this.didMotionPass(demCount, thresholdRequired),

            votes: this.votes,
        }
    }

    cleanVotes = (rawVotes) => {
        return rawVotes.map(ballot => {
            const standardName = standardizeLawmakerName(ballot.name)
            return {
                option: ballot.vote,
                ...getLawmakerSummary(standardName),
            }
        })
    }

    getPartyCount = (votes, partyKey) => {
        const partyVotes = votes.filter(d => d.party === partyKey)
        return {
            Y: partyVotes.filter(d => d.option === 'Y').length,
            N: partyVotes.filter(d => d.option === 'N').length,
            A: partyVotes.filter(d => d.option === 'A').length,
            E: partyVotes.filter(d => d.option === 'E').length,
            O: partyVotes.filter(d => !['Y', 'N', 'A', 'E'].includes(d.option)).length
        }
    }

    classifyMotionThreshold = opts => {
        const { voteType, bill, motion } = opts
        // TODO - write this logic
        return 'simple'
    }

    didMotionPass = (count, threshold) => {
        // TODO --> Account for non-simple-majority votes
        if (threshold === 'simple') {
            return (count.Y > count.N)
        } else {
            throw 'Unsupported vote threshold'
        }
    }

    export = () => ({ ...this.data })

}