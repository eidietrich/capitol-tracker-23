
import {
    LAWMAKER_NAME_CLEANING
} from './config/people.js'

import { getJson } from './utils.js'

const roster = getJson('./process/config/lawmaker-roster-2023.json')

export const billKey = (identifier) => identifier.substring(0, 2).toLowerCase() + '-' + identifier.substring(3,)
export const lawmakerKey = (name) => name.replace(/\s/g, '-')

export const capitalize = string => string[0].toUpperCase() + string.slice(1).toLowerCase()

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