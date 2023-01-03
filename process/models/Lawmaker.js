import {
    LAWMAKER_REPLACEMENTS,
} from '../config/overrides.js'

import {
    // filterToFloorVotes,
    // lawmakerLastName,
    lawmakerKey,
    billKey,
    standardizeLawmakerName,
    getLawmakerSummary,
    getLawmakerLastName,
    getLawmakerLocale,
} from '../functions.js'

export default class Lawmaker {
    constructor({
        lawmaker,
        district,
        annotation,
        articles,
    }) {

        const {
            name,
            party,
            phone,
            email,
            committees,
            image_path,
            sessions,
            locale,
        } = lawmaker

        const {
            LawmakerPageText
        } = annotation

        const standardName = standardizeLawmakerName(name)
        this.name = standardName
        this.summary = getLawmakerSummary(standardName)

        this.data = {
            key: lawmakerKey(standardName),
            name: standardName,
            lastName: getLawmakerLastName(standardName),
            district: district.key,
            districtElexHistory: {
                last_election: district.last_election,
                pri_elex: district.pri_elex,
                gen_elex: district.gen_elex,
                replacementNote: this.lookForReplacementNote(district.key)
            },
            districtNum: +district.key.replace('HD ', '').replace('SD ', ''),
            locale: getLawmakerLocale(standardName),
            localeLong: district.locale_description,

            chamber: district.key[0] === 'S' ? 'senate' : 'house',
            title: district.key[0] === 'S' ? 'Sen.' : 'Rep.',
            fullTitle: district.key[0] === 'S' ? 'Senator' : 'Representative',
            party,
            phone,
            email,
            committees,
            leadershipRoles: [], // TODO (annotate Speaker of the House etc.)

            legislativeHistory: sessions.map(({ year, chamber }) => ({ year, chamber })),

            articles,

            // annotations
            lawmakerPageText: LawmakerPageText,

            imageSlug: image_path.replace('portraits/', ''),

            // Merge this stuff in later, see main.js
            // votingSummary: this.getVotingSummary(lawmaker, this.votes), 
            // voteTabulation: this.getVoteTabulation(lawmaker, filterToFloorVotes(this.votes)), // BIG DATA
            // keyBillVotes: [], // TODO,
            // sponsoredBills: this.sponsoredBills,
            // votes: this.votes.map(vote => vote.data)
        }
        // console.log(lawmaker.name, this.sponsoredBills.length)
    }


    lookForReplacementNote = (districtKey) => {
        const replacement = LAWMAKER_REPLACEMENTS.find(d => d.district === districtKey)
        return replacement && replacement.note || null
    }

    addSponsoredBills = ({ sponsoredBills }) => {
        this.sponsoredBills = sponsoredBills.map(bill => {
            const {
                key,
                identifier,
                title,
                chamber,
                status,
                progress,
                label,
                textUrl,
                fiscalNoteUrl,
                legalNoteUrl,
            } = bill.data

            return {
                key,
                identifier,
                title,
                chamber,
                status, // object
                progress, // 
                label,
                textUrl,
                fiscalNoteUrl,
                legalNoteUrl,
                numArticles: bill.data.articles.length,
                sponsor: this.summary, // object
            }
        })
    }

    addKeyBillVotes = ({ name, keyBills }) => {
        const keyBillVotes = keyBills
            .map(bill => bill.getLastVoteInvolvingLawmaker(name))
            .filter(vote => vote !== null)
            .map(vote => {
                return {
                    lawmakerVote: vote.votes.find(d => d.name === name).option,
                    voteData: vote.data,
                }
            })
        this.keyBillVotes = keyBillVotes

    }

    getVotes = (lawmaker, votes) => {
        const lawmakerVotes = votes.filter(vote => {
            const voters = vote.votes.map(d => d.name)
            return voters.includes(lawmaker.name)
        })
        return lawmakerVotes
    }

    exportMerged = () => {
        return {
            ...this.data,
            sponsoredBills: this.sponsoredBills || [],
            votingSummary: this.votingSummary,
            keyBillVotes: this.keyBillVotes || [],
        }
    }

}