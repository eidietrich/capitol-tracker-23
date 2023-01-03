import { getJson, writeJson } from './utils.js'

import Article from './models/MTFPArticle.js'
import Lawmaker from './models/Lawmaker.js'
import Bill from './models/Bill.js'
import VotingAnalysis from './models/VotingAnalysis.js'
// import Vote from './models/Vote.js'

/*
Approach here — each of these input buckets has a fetch script that needs to be run independently to update their contents
*/

// LAWS scraper inputs
const billsRaw = getJson('./inputs/laws/bills.json')
const actionsRaw = getJson('./inputs/laws/actions.json')
const votesRaw = getJson('./inputs/laws/votes.json')

// Pre-baked lawmaker inputs
const districtsRaw = getJson('./inputs/lawmakers/districts-2023.json')
const lawmakersRaw = getJson('./inputs/lawmakers/leg-roster-2023.json')

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

const votes = bills.map(bill => bill.exportVoteData()).flat()
const houseFloorVotes = votes.filter(v => v.type === 'floor' && v.voteChamber === 'house')
const senateFloorVotes = votes.filter(v => v.type === 'floor' && v.voteChamber === 'senate')
const houseFloorVoteAnalysis = new VotingAnalysis({ votes: houseFloorVotes })
const senateFloorVoteAnalysis = new VotingAnalysis({ votes: senateFloorVotes })

// Calculations that need both lawmakers and bills populated
lawmakers.forEach(lawmaker => {
    lawmaker.addSponsoredBills({
        sponsoredBills: bills.filter(bill => bill.sponsor === lawmaker.name)
    })
    lawmaker.addKeyBillVotes({
        name: lawmaker.name,
        keyBills: bills.filter(bill => bill.data.isMajorBill)
    })
    // TODO - Add last vote on key bills
    if (lawmaker.data.chamber === 'house') {
        lawmaker.votingSummary = houseFloorVoteAnalysis.getLawmakerStats(lawmaker.name)
    } else if (lawmaker.data.chamber === 'senate') {
        lawmaker.votingSummary = senateFloorVoteAnalysis.getLawmakerStats(lawmaker.name)
    }
})

// const summaryRoster = lawmakers.map(d => {
//     return {
//         title: d.data.title,
//         name: d.data.name,
//         lastName: d.data.name,
//         party: d.data.party,
//         locale: d.data.locale_short || '',
//         district: d.data.district
//     }
// })
// writeJson('./process/config/lawmaker-roster-2023.json', summaryRoster)

const keyBillCategoryKeys = Array.from(new Set(billAnnotations.map(d => d.category)))
const keyBillCategoryList = keyBillCategoryKeys.map(category => {
    const match = billAnnotations.find(d => d.category === category)
    return {
        category,
        categoryDescription: match.categoryDescription
    }
})


// Outputs 
const billsOutput = bills.map(b => b.exportMerged())
writeJson('./app/src/data-nodes/bills.json', billsOutput.slice(0, 150))
// console.log(bills[1])

const lawmakerOutput = lawmakers.map(l => l.exportMerged())
writeJson('./app/src/data-nodes/lawmakers.json', lawmakerOutput)

writeJson('./app/src/data/bill-categories.json', keyBillCategoryList)

// // Possibly experiment with doing this data merge in gatsby-node
// // For performance optimization
// const actionsOutput = bills.slice(0, 10).map(b => b.exportActionData())
// const votesOutput = bills.slice(0, 10).map(b => b.exportVoteData())
// writeJson('./app/src/data-nodes/votes.json', votesOutput)
// writeJson('./app/src/data-nodes/actions.json', actionsOutput)


