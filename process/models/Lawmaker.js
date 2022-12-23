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
        } = lawmaker

        const {
            LawmakerPageText
        } = annotation

        const standardName = standardizeLawmakerName(name)
        this.name = standardName
        this.summary = getLawmakerSummary(standardName)

        this.data = {
            key: lawmakerKey(name),
            name: standardName,
            district: district.key,
            districtElexHistory: {
                last_election: district.last_election,
                pri_elex: district.pri_elex,
                gen_elex: district.gen_elex,
                replacementNote: this.lookForReplacementNote(district.key)
            },
            districtNum: +district.key.replace('HD ', '').replace('SD ', ''),
            locale: district.locale,
            localeLong: district.locale_description,

            chamber: district.key[0] === 'S' ? 'senate' : 'house',
            title: district.key[0] === 'S' ? 'Sen.' : 'Rep.',
            fullTitle: district.key[0] === 'S' ? 'Senator' : 'Representative',
            party,
            phone,
            email,
            committees, // Actually 2021 committees - label needs updating
            leadershipRoles: [], // TODO (annotate Speaker of the House etc.)

            legislativeHistory: sessions.map(({ year, chamber }) => ({ year, chamber })),

            articles,

            // annotations
            lawmakerPageText: LawmakerPageText,

            imageSlug: image_path.replace('images/', ''),

            // Merge this stuff in later
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
    // getLocales = (lawmaker, districts) => {
    //     const district = districts.find(d => d.key === lawmaker.district)
    //     return {
    //         short: district.locale,
    //         long: district.locale_description
    //     }
    // }

    addSponsoredBills = ({ sponsoredBills }) => {
        this.sponsoredBills = sponsoredBills.map(bill => {
            const {
                key,
                identifier,
                title,
                status,
                label,
                textUrl,
                fiscalNoteUrl,
                legalNoteUrl,
            } = bill.data

            return {
                key,
                identifier,
                title,
                status, // object
                label,
                textUrl,
                fiscalNoteUrl,
                legalNoteUrl,
                numArticles: bill.data.articles.length,
                sponsor: this.summary, // object
            }
        })
    }

    getVotes = (lawmaker, votes) => {
        const lawmakerVotes = votes.filter(vote => {
            const voters = vote.votes.map(d => d.name)
            return voters.includes(lawmaker.name)
        })
        return lawmakerVotes
    }
    getVoteTabulation = (lawmaker, lawmakerVotes) => {
        // TODO: Fine-tune this to floor votes (currently done w/ inputs), one per bill
        // Display will need an 'is this a key vote' filter
        return lawmakerVotes.map(vote => {
            return {
                billKey: billKey(vote.data.bill),
                lawmakerVote: vote.votes.find(d => d.name === lawmaker.name).option,
                bill: vote.data.bill,
                action: vote.data.action,
                date: vote.data.date,
                keyVote: true,
                count: vote.data.count,
                motionPassed: vote.data.motionPassed,
                gopCount: vote.data.gopCount,
                gopSupported: vote.data.gopSupported,
                demCount: vote.data.demCount,
                demSupported: vote.data.demSupported,
            }
        })
    }
    getVoteAlignments = (lawmaker, floorVotes) => {
        // % of times voting w/ peer lawmakers on floor
        const lawmakerVotes = floorVotes.map(vote => vote.data.votes.find(d => d.name === lawmaker.name))
        const peers = Array.from(new Set(floorVotes.map(vote => vote.data.votes.map(d => d.name)).flat()))
        const alignments = peers.map(peerName => {
            const alignmentArray = floorVotes.map(vote => {
                const lawmakerVote = vote.data.votes.find(d => d.name === lawmaker.name)
                const peerVote = vote.data.votes.find(d => d.name === peerName)
                return (lawmakerVote.option === peerVote.option) ? 1 : 0
            })
            const alignmentScore = alignmentArray.reduce((i, acc) => i + acc, 0) / floorVotes.length

            const peerFirstVote = floorVotes[0].data.votes.find(d => d.name === peerName)
            const peerDistrict = peerFirstVote.district
            const peerParty = peerFirstVote.party

            return {
                name: peerName,
                district: peerDistrict,
                party: peerParty,
                alignment: alignmentScore,
            }
        })
        return alignments

    }

    // old
    getVotingSummary = (lawmaker, lawmakerVotes) => {

        // const floorVotes = filterToFloorVotes(lawmakerVotes)
        const floorVotes = lawmakerVotes
        const voteTabulation = this.getVoteTabulation(lawmaker, floorVotes)
        // const voteAlignments = this.getVoteAlignments(lawmaker, floorVotes) // costly function

        const numVotesRecorded = floorVotes.length
        const numVotesNotPresent = voteTabulation.filter(d => !['yes', 'no'].includes(d.lawmakerVote)).length
        const numVotesCast = numVotesRecorded - numVotesNotPresent
        const votesWithMajority = voteTabulation.filter(d =>
            ((d.lawmakerVote === 'yes') && d.motionPassed)
            || ((d.lawmakerVote === 'no') && !d.motionPassed)
        ).length
        const votesWithGopMajority = voteTabulation.filter(d =>
            ((d.lawmakerVote === 'yes') && d.gopSupported)
            || ((d.lawmakerVote === 'no') && !d.gopSupported)
        ).length
        const votesWithDemMajority = voteTabulation.filter(d =>
            ((d.lawmakerVote === 'yes') && d.demSupported)
            || ((d.lawmakerVote === 'no') && !d.demSupported)
        ).length

        const votingSummary = {
            numVotesRecorded,
            numVotesCast,
            numVotesNotPresent,
            fractionVotesNotPresent: (numVotesNotPresent / numVotesRecorded) || 0,
            votesWithMajority,
            fractionVotesWithMajority: (votesWithMajority / numVotesCast) || 0,
            votesWithGopMajority,
            fractionVotesWithGopMajority: (votesWithGopMajority / numVotesCast) || 0,
            votesWithDemMajority,
            fractionVotesWithDemMajority: (votesWithDemMajority / numVotesCast) || 0,
            // voteAlignments,
        }
        return votingSummary

    }

    getArticles = (lawmaker, articles) => {
        const articlesAboutLawmaker = articles.filter(article => article.data.lawmakerTags.includes(lawmaker.name)).map(d => d.export())
        // if (articlesAboutLawmaker.length > 0) console.log(lawmaker.name, articlesAboutLawmaker.length)
        return articlesAboutLawmaker
    }

    getAnnotation = (lawmaker, annotations) => {
        const match = annotations.lawmakers.find(d => d.key === lawmaker.name)
        // if (match) console.log('Lawmaker annotation found for', lawmaker.name)
        const annotation = (match && match.annotation) || []
        return annotation
    }


    exportMerged = () => {
        return {
            ...this.data,
            sponsoredBills: this.sponsoredBills,
            votingSummary: this.votingSummary,
        }
    }

}