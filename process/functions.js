import { timeFormat, timeParse } from 'd3-time-format'


import {
    LAWMAKER_NAME_CLEANING
} from './config/people.js'

import {
    COMMITEE_NAME_CLEANING,
    COMMITTEES,
    // EXCLUDE_COMMITTEES,
} from './config/committees.js'

import { getJson } from './utils.js'

const roster = getJson('./process/config/lawmaker-roster-2023.json')

export const billKey = (identifier) => identifier.substring(0, 2).toLowerCase() + '-' + identifier.substring(3,)
export const lawmakerKey = (name) => name.replace(/\s/g, '-')

export const capitalize = string => string[0].toUpperCase() + string.slice(1).toLowerCase()

export const dateFormat = timeFormat('%m/%d/%Y')
export const dateParse = timeParse('%m/%d/%Y')
export const standardizeDate = date => {
    if (!date) return null
    return dateFormat(new Date(date))
}

export const standardCommiteeNames = Array.from(new Set(Object.values(COMMITEE_NAME_CLEANING)))
export const standardizeCommiteeNames = name => {
    if (standardCommiteeNames.includes(name)) return name
    if ([null, '', ' '].includes(name)) return null
    const preClean = name.replace('(H) (H)', '(H)').replace('(S) (S)', '(S)')
    const clean = COMMITEE_NAME_CLEANING[preClean]
    if (!clean) console.error(`NAME_CLEANING in config.js missing "${preClean}"`)
    return clean
}

export const standardLawmakerNames = Array.from(new Set(Object.values(LAWMAKER_NAME_CLEANING)))
export const standardizeLawmakerName = name => {
    if (standardLawmakerNames.includes(name)) return name

    const clean = LAWMAKER_NAME_CLEANING[name]
    if (!clean) console.error(`NAME_CLEANING in config.js missing ${name}`)
    return clean
}

export const getLawmakerLastName = standardName => {
    const match = roster.find(d => d.name === standardName)
    if (!match) console.error(`Roster missing name ${standardName}`)
    return match.lastName
}
export const getLawmakerLocale = standardName => {
    const match = roster.find(d => d.name === standardName)
    return match.locale
}

export const getLawmakerSummary = standardName => {
    // Pulls basic lawmaker info from pre-packaged roster file
    // Avoids circular data merge issues
    const match = roster.find(d => d.name === standardName) || {}
    if (!match.name) console.error(`Roster missing name ${standardName}`)
    // This is used for bill sponsor summaries, vote analyses, etc.
    return {
        name: standardName,
        lastName: match.lastName,
        party: match.party,
        locale: match.locale,
        district: match.district,
    }
}

export const cleanCommitteeName = rawCommitteeName => {
    const match = COMMITTEES.find(d => d.key === rawCommitteeName)
    if (!match) console.error(`Committee list missing`, rawCommitteeName)
    return match.name
}