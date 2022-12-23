import { getJson, writeJson } from './utils.js'

import Article from './models/MTFPArticle.js'
import Lawmaker from './models/Lawmaker.js'
import Bill from './models/Bill.js'
// import Vote from './models/Vote.js'

/*
Approach here — each of these input buckets has a fetch script that needs to be run independently to update their contents
*/

// LAWS scraper inputs
const billsRaw = getJson('./inputs/laws/bills.json')
const actionsRaw = getJson('./inputs/laws/actions.json')
const votesRaw = getJson('./inputs/laws/votes.json')

// Pre-baked lawmaker inputs
const districtsRaw = getJson('./inputs/lawmakers/districts-2021.json')
const lawmakersRaw = getJson('./inputs/lawmakers/lawmakers-2021.json')

// Legislative article list from Montana Free Press CMS
const articlesRaw = getJson('./inputs/coverage/articles.json')

// Bill annotations from standalone Strapi CMS
const billAnnotations = getJson('./inputs/cms/bill-annotations.json')
const lawmakerAnnotations = getJson('./inputs/cms/lawmaker-annotations.json')
const processAnnotations = getJson('./inputs/cms/process-annotations.json')
const guideText = getJson('./inputs/cms/guide-text.json')


const articles = articlesRaw.map(article => new Article({ article }).export())

/// do lawmakers first, then bills
const lawmakers = lawmakersRaw.map(lawmaker => new Lawmaker({
    lawmaker,
    district: districtsRaw.find(d => d.key === lawmaker.district),
    annotation: lawmakerAnnotations.find(d => d.Name === lawmaker.name) || {}, // Unwired currently
    articles: articles.filter(d => d.lawmakerTags.includes(lawmaker.name)),
    // leave sponsoredBills until after bills objects are created
    // same with keyVotes
}))

const bills = billsRaw.map(bill => new Bill({
    bill,
    actions: actionsRaw.filter(d => d.bill === bill.key),
    votes: votesRaw.filter(d => d.bill === bill.key),
    annotation: billAnnotations.find(d => d.Identifier === bill.key) || {},
    articles: articles.filter(d => d.billTags.includes(bill.key)),
}))

// TODO Here - export votes from bills to create a list of Votes
// Product lawmaker record calculations from that, then merge with lawmakers
// Add comparative numbers to lawmaker record calculations

// Calculations that need both lawmakers and bills populated
lawmakers.forEach(lawmaker => {
    lawmaker.addSponsoredBills({
        sponsoredBills: bills.filter(bill => bill.sponsor === lawmaker.name)
    })
    // TODO - Add last vote on key bills
    lawmaker.votingSummary = {
        // placeholder data
        numVotesRecorded: 0,
        fractionVotesNotPresent: 0,
        fractionVotesWithDemMajority: 0,
        fractionVotesWithGopMajority: 0,
        fractionVotesWithMajority: 0,
        numVotesCast: 0,
        numVotesNotPresent: 0,
        votesWithDemMajority: 0,
        votesWithGopMajority: 0,
        votesWithMajority: 0,
    }
})

// const summaryRoster = lawmakers.map(d => {
//     return {
//         title: d.data.title,
//         name: d.data.name,
//         party: d.data.party,
//         locale: d.data.locale_short,
//         district: d.data.district
//     }
// })
// writeJson('./lawmaker-roster-2021.json', summaryRoster)


// Outputs 
const billsOutput = bills.slice(100, 120).map(b => b.exportMerged())
writeJson('./app/src/data-nodes/bills.json', billsOutput)

const lawmakerOutput = lawmakers.map(l => l.exportMerged())
writeJson('./app/src/data-nodes/lawmakers.json', lawmakerOutput)

// // Possibly experiment with doing this data merge in gatsby-node
// // For performance optimization
// const actionsOutput = bills.slice(0, 10).map(b => b.exportActionData())
// const votesOutput = bills.slice(0, 10).map(b => b.exportVoteData())
// writeJson('./app/src/data-nodes/votes.json', votesOutput)
// writeJson('./app/src/data-nodes/actions.json', actionsOutput)


