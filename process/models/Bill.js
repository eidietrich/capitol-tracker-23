import Action from './Action.js'
import Vote from './Vote.js'

import { VOTE_THRESHOLDS, BILL_STATUSES, MANUAL_SIGNINGS, MANUAL_VETOS } from '../config/config.js'


import {
    billKey,
    standardizeLawmakerName,
    getLawmakerSummary,
    // hasProgressFlag,
    // actionsWithFlag,
    // firstActionWithFlag,
    // lastActionWithFlag
} from '../functions.js'

export default class Bill {
    constructor({
        bill,
        votes,
        actions,
        annotations,
        isMajorBill,
        articles,
        legalNote,
        vetoMemo,
    }) {
        const {
            key,
            session,
            billPageUrl,
            billTextUrl,
            billPdfUrl,
            lc,
            title,
            sponsor,
            sponsorParty,
            sponsorDistrict,
            statusDate,
            lastAction,
            billStatus,
            fiscalNotesListUrl,
            amendmentsListUrl,
            draftRequestor,
            billRequestor,
            primarySponsor,
            subjects,
            deadlineCategory,
            transmittalDeadline,
            amendedReturnDeadline,
        } = bill

        this.identifer = key
        this.type = this.getType(bill)
        this.sponsor = standardizeLawmakerName(sponsor) // TODO clean name here
        this.actions = this.buildActionList(bill, actions, votes)

        this.data = {
            key: billKey(key), // url-friendly
            identifier: key,
            chamber: this.getChamber(key),
            title,
            session,
            type: this.type, // bill, resolution etc.

            status: this.getStatus(key, billStatus),
            // TODO: add progression classification here

            sponsor: getLawmakerSummary(this.sponsor), // object
            requestor: billRequestor,

            deadlineCategory,
            transmittalDeadline: transmittalDeadline,
            secondHouseReturnIfAmendedDeadline: amendedReturnDeadline,
            // fiscalNoteExpected: this.getFiscalNoteExpected(bill),
            voteMajorityRequired: this.getVoteMajorityRequired(subjects),

            subjects: subjects.map(d => d.subject), // TODO: Add cleaning

            lawsUrl: billPageUrl,
            textUrl: billPdfUrl,
            fiscalNoteUrl: fiscalNotesListUrl,
            amendmendmentsUrl: amendmentsListUrl,
            legalNoteUrl: legalNote && legalNote.url || null,
            vetoMemoUrl: vetoMemo && vetoMemo.url || null,

            annotation: annotations,
            label: (key === 'HB 2') ? 'Primary state budget bill' : null, // TODO with reworking annotation flow
            isMajorBill,
            majorBillCategory: (key === 'HB 2') ? 'Major budget bills' : null, // TODO with working in annotation flow

            articles,

            // leave actions out here + merge in export
        }
    }

    buildActionList = (bill, actions, votes) => {
        // Build list of actions associated with the bill
        // matching with votes for actions that have them
        // actions should come from scraper in order
        return actions.map(action => {
            const rawVote = votes.find(v => v.action_id === action.id)
            const vote = rawVote && new Vote({
                vote: rawVote
                // TODO - add in bill threshold requirement for vote here
            }) || null
            return new Action({
                action,
                vote,
            })
        })
        // NB: sorting by date here screws with order b/c of same-day actions
    }

    getType = (bill) => {
        // TODO - split this logic out to config file
        // List of tests that also defines bill flow for each type of bill
        const subjectCategories = bill.subjects.map(d => d.subject)
        if (subjectCategories.includes('Constitutional Amendment Proposals')) {
            return 'constitutional amendment'
        } else if (subjectCategories.includes('Referendum')) {
            return 'referendum'
        } else if (subjectCategories.includes('Revenue Estimating Resolution')) {
            return 'revenue resolution'
        } else if (subjectCategories.includes('Legislature, Interim Studies')) {
            return 'study resolution'
        } else if (bill.key.slice(0, 2) == 'HR') {
            return 'house resolution'
        } else if (bill.key.slice(0, 2) == 'SR') {
            return 'senate resolution'
        } else if ((bill.key.slice(0, 2) == 'HJ') || (bill.key.slice(0, 2) == 'SJ')) {
            return 'joint resolution'
        } else if (bill.key === 'HB 2') {
            return 'budget bill'
        } else {
            return 'bill'
        }
    }

    getChamber = (identifer) => {
        return {
            'H': 'house',
            'S': 'senate',
        }[identifer[0]]
    }

    getStatus = (identifier, status) => {
        // Status as pulled from LAWS status line

        // Workaround for stale LAWS data
        if (MANUAL_SIGNINGS.includes(identifier)) {
            return BILL_STATUSES.find(d => d.key === 'Became Law')
        }
        if (MANUAL_VETOS.includes(identifier)) {
            return BILL_STATUSES.find(d => d.key === 'Probably Dead')
        }

        const match = BILL_STATUSES.find(d => d.key === status)
        if (!match) {
            throw `Missing bill status match for ${status}`
        }
        return match
    }
    getProgress = (bill, actions) => {
        // Status as calculated from actions
        const hasProgressFlag = (actions, flag) => actions.map(d => d[flag]).includes(true)
        const progress = {
            passagesNeeded: 'TK - depending on type',
            toFirstChamber: false,
            firstChamberStatus: null,
            outOfInitialCommittee: false,
            toSecondChamber: false,
            secondChamberStatus: null,
            toGovernor: false,
            governorStatus: 'null',
            finalOutcome: null,
        }
        // Possible improvement here progress as array of thresholds to clear, in order

        const missedDeadline = hasProgressFlag(actions, 'missedDeadline')
        const ultimatelyFailed = hasProgressFlag(actions, 'ultimatelyFailed')
        const ultimatelyPassed = hasProgressFlag(actions, 'ultimatelyPassed')

        if (ultimatelyFailed) progress.finalOutcome = 'failed'
        if (ultimatelyPassed) progress.finalOutcome = 'passed'

        // Resolutions
        if (this.type === 'resolution') {
            if (hasProgressFlag(actions, 'introduction')) progress.toFirstChamber = true
        }
        if (['bill', 'joint resolution', 'referendum proposal'].includes(this.type)) {
            const firstChamberActions = (bill.identifier[0] === 'H') ?
                actions.filter(d => d.chamber === 'House') :
                actions.filter(d => d.chamber === 'Senate')
            const secondChamberActions = (bill.identifier[0] === 'H') ?
                actions.filter(d => d.chamber === 'Senate') :
                actions.filter(d => d.chamber === 'House')

            // Introduction
            if (hasProgressFlag(actions, 'introduction')) progress.toFirstChamber = true

            // Initial committee
            // TODO enhance first chamber

            // First chamber 
            const introduced = hasProgressFlag(actions, 'introduction')
            const passedFirstChamberCommittee = hasProgressFlag(firstChamberActions, 'firstCommitteePassage')
            const passedFirstChamber = hasProgressFlag(firstChamberActions, 'firstChamberPassage')
            const tabledInFirstChamber = hasProgressFlag(firstChamberActions, 'committeeTabled')
            const untabledInFirstChamber = hasProgressFlag(firstChamberActions, 'committeeUntabled')
            const failedFirstChamber = hasProgressFlag(firstChamberActions, 'firstChamberFailed')

            if (introduced) progress.firstChamberStatus = 'pending'
            if (passedFirstChamberCommittee) progress.outOfInitialCommittee = true
            if (tabledInFirstChamber && !untabledInFirstChamber) progress.firstChamberStatus = 'tabled'
            if (failedFirstChamber) progress.firstChamberStatus = 'failed'
            if (!passedFirstChamber && missedDeadline) progress.firstChamberStatus = 'missed deadline'
            if (!passedFirstChamber && ultimatelyFailed) progress.firstChamberStatus = 'failed'
            if (passedFirstChamber) progress.firstChamberStatus = 'passed'

            // Second chamber
            if (hasProgressFlag(actions, 'sentToSecondChamber')) progress.toSecondChamber = true
            if (hasProgressFlag(secondChamberActions, 'secondChamberPassage')) progress.secondChamberStatus = 'passed'

        }
        if (this.type === 'bill') {
            // Logic for bills that doesn't apply to joint resolutions, referendum proposals
            // Governor
            const toGovernor = hasProgressFlag(actions, 'sentToGovernor')
            const signedByGovernor = hasProgressFlag(actions, 'signedByGovernor')
            const vetoedByGovernor = hasProgressFlag(actions, 'vetoedByGovernor')
            if (toGovernor) progress.toGovernor = true
            if (signedByGovernor) progress.governorStatus = 'signed'
            else if (vetoedByGovernor) progress.governorStatus = 'vetoed'
            else if (toGovernor && ultimatelyPassed && (!signedByGovernor && !vetoedByGovernor)) progress.governorStatus = 'became law unsigned'
            else progress.governorStatus = 'pending'

            // manual overrides
            if (MANUAL_SIGNINGS.includes(bill.identifier)) progress.governorStatus = 'signed'
            if (MANUAL_VETOS.includes(bill.identifier)) progress.governorStatus = 'vetoed'

        }

        if (!['bill', 'resolution', 'joint resolution', 'referendum proposal'].includes(this.type)) {
            console.log('Unhandled bill type', this.type)
        }

        return progress

    }

    getVoteMajorityRequired = (subjects) => {
        const thisBillThresholds = subjects.map(d => d.voteReq)
        if (thisBillThresholds.length === 0) {
            throw `${this.identifier} has no subjects, causes error in getVoteMajorityRequired`
        }
        if (!(thisBillThresholds.every(d => VOTE_THRESHOLDS.includes(d)))) {
            throw `${this.identifier} has vote threshold missing from VOTE_THRESHOLDS`
        }
        // get highest-ranked threshold
        const controllingThreshold = thisBillThresholds
            .sort((a, b) => VOTE_THRESHOLDS.indexOf(a) - VOTE_THRESHOLDS.indexOf(b))[0]

        return controllingThreshold
    }

    exportBillDataOnly = () => this.data
    exportActionData = () => this.actions.map(a => a.exportActionDataOnly())
    exportVoteData = () => this.actions.filter(a => a.vote !== null).map(a => a.exportVote())

    exportMerged = () => {
        // exports bill data merged with actions and votes
        return {
            ...this.data,
            actions: this.actions.map(a => a.export()),
        }
    }
}