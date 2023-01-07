/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const bills = require('./src/data-nodes/bills.json')
const lawmakers = require('./src/data-nodes/lawmakers.json')

exports.createSchemaCustomization = ({ actions }) => {
    /* Explicitly defines schemas for bils and lawmakers to optimize build times */
    // see https://www.gatsbyjs.com/docs/reference/graphql-data-layer/schema-customization/#creating-type-definitions
    const { createTypes } = actions
    const typeDefs = `
        type BillsJson implements Node @dontInfer {
            key: String
            identifier: String
            chamber: String
            title: String
            explanation: String
            session: String
            type: String
            isMajorBill: Boolean
            majorBillCategory: String
            billPageText: String
            status: BillStatus
            progress: [BillProgressStep]
            sponsor: BillSponsor
            hasBeenSentToGovernor: Boolean
            isOnCalendar: Boolean
            requestor: String
            deadlineCategory: String
            transmittalDeadline: Date
            secondHouseReturnIfAmendedDeadline: Date
            voteMajorityRequired: String
            subjects: [String]
            lawsUrl: String
            textUrl: String
            legalNoteUrl: String
            vetoMemoUrl: String
            fiscalNoteUrl: String
            amendmendmentsUrl: String
            articles: [Article]
            actions: [BillAction]
        }
        type BillStatus {
            key: String
            label: String
            step: String
            status: String
            statusAtSessionEnd: String
        }
        type BillProgressStep {
            step: String
            status: String
            statusLabel: String
            statusDate: Date
        }
        type BillSponsor {
            name: String
            party: String
            locale: String
            district: String
        }
        type Article {
            title: String
            subtitle: String
            date: Date
            link: String
            author: String
            category: String
            imageUrl: String
            billTags: [String]
            lawmakerTags: [String]
            governorTags: [String]
        }
        type BillAction {
            id: String!
            bill: String
            date: Date
            description: String
            posession: String
            committee: String
            actionUrl: String
            recordings: [String]
            key: String
            vote: BillVote
        }
        type BillVote {
            action: String
            bill: String
            date: Date
            type: String
            seqNumber: String
            voteChamber: String
            voteUrl: String
            session: String
            motion: String
            thresholdRequired: String
            count: VoteCount
            gopCount: VoteCount
            demCount: VoteCount
            motionPassed: Boolean
            gopSupported: Boolean
            demSupported: Boolean
            votes: [VoteBallot]
        }
        type VoteCount {
            Y: Int
            N: Int
            A: Int
            E: Int
            O: Int
        }
        type VoteBallot {
            option: String
            name: String
            party: String
            locale: String
            district: String
        }

        type LawmakersJson implements Node @dontInfer { 
            key: String!
            name: String
            district: String
            districtElexHistory: ElexHistory
            districtNum: Int
            locale: String
            districtLocale: String
            chamber: String
            title: String
            fullTitle: String
            lastName: String
            party: String
            phone: String
            email: String
            committees: CommitteeAssignment
            leadershipTitle: String
            legislativeHistory: [PastSessionService]
            articles: [Article]
            imageSlug: String
            sponsoredBills: [LawmakerSponsoredBill]
            votingSummary: LawmakerVotingSummary
            keyBillVotes: [LawmakerKeyVote]
        }
        type ElexHistory {
            last_election: String
            pri_elex: Elex
            genElex: Elex
            replacementNote: String
        }
        type Elex {
            leg: [ElexCount]
            gov: [ElexCount]
        }
        type ElexCount {
            name: String
            party: String
            votes: Int
        }
        type CommitteeAssignment {
            committee: String
            role: String
        }
        type PastSessionService {
            year: String
            chamber: String
        }
        type LawmakerSponsoredBill {
            key: String
            identifier: String
            title: String
            chamber: String
            status: BillStatus
            progress: [BillProgressStep]
            textUrl: String
            fiscalNoteUrl: String
            numArticles: Int
            sponsor: BillSponsor
        }
        type LawmakerVotingSummary {
            name: String
            party: String
            numVotesCast: Int
            numVotesNotPresent: Int
            numVotesPresent: Int
            votesOnWinningSide: Int
            fractionVotesOnWinningSide: Float
            votesWithGopCaucus: Int
            fractionVotesWithGopCaucus: Float
            votesWithDemCaucus: Int
            fractionVotesWithDemCaucus: Float
            averageAbsences: Float
            averageVotesOnWinningSideGop: Float
            averageVotesOnWinningSideDem: Float
            averageVotesWithGopCaucusGop: Float
            averageVotesWithGopCaucusDem: Float
            averageVotesWithDemCaucusGop: Float
            averageVotesWithDemCaucusDem: Float
        }
        type LawmakerKeyVote {
            lawmakerVote: String
            voteData: BillVote
        }
    `
    createTypes(typeDefs)
}




exports.createPages = async ({ graphql, actions: { createPage } }) => {

    lawmakers.forEach(async lawmaker => {
        const key = lawmaker.key
        const imageSlug = lawmaker.imageSlug

        createPage({
            path: `/lawmakers/${key}`,
            component: require.resolve('./src/templates/lawmaker.js'),
            context: {
                lawmaker,
                imageSlug, // For portrait image, needs to be top-level so graphql page query can access it
            },
        })

        createPage({
            path: `/lawmaker-cards/${key}`,
            component: require.resolve('./src/templates/lawmaker-card.js'),
            context: {
                lawmaker,
                imageSlug, // For portrait image, needs to be top-level so graphql page query can access it
            },
        })
    })

    bills.forEach(bill => {
        const key = bill.key
        // const sponsor = lawmakers.find(lawmaker => lawmaker.name === bill.sponsor.name)
        // const { title, name, district, party, locale } = bill.sponsor
        createPage({
            path: `/bills/${key}`,
            component: require.resolve('./src/templates/bill.js'),
            context: {
                bill,
                // Abbreviated info on sponsor for sake of data bundle size
                // TODO: It would probably be more elegant to do this data merge in data processing step
                // sponsor: { key, title, name, district, party, locale }
            },
        })

        createPage({
            path: `/bill-cards/${key}`,
            component: require.resolve('./src/templates/bill-card.js'),
            context: {
                bill,
            },
        })
    })

    // TODO - create layout slice
    // See https://www.gatsbyjs.com/blog/gatsby-slice-api/


}