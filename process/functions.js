
import {
    LAWMAKER_NAME_CLEANING
} from './config/config.js'

import { getJson } from './utils.js'

const roster = getJson('./process/config/lawmaker-roster-2021.json')

export const billKey = (identifier) => identifier.substring(0, 2).toLowerCase() + '-' + identifier.substring(3,)
export const lawmakerKey = (name) => name.replace(/\s/g, '-')

export const standardLawmakerNames = Array.from(new Set(Object.values(LAWMAKER_NAME_CLEANING)))
export const standardizeLawmakerName = name => {
    if (standardLawmakerNames.includes(name)) return name
    const clean = LAWMAKER_NAME_CLEANING[name]
    if (!clean) console.error(`NAME_CLEANING in config.js missing ${name}`)
    return clean
}

export const getLawmakerSummary = standardName => {
    // Pulls basic lawmaker info from pre-packaged roster file
    // Avoids circular data merge issues
    const match = roster.find(d => d.name === standardName)
    if (!match) console.error(`Roster missing name ${standardName}`)
    // This is used for bill sponsor summaries, vote analyses, etc.
    return {
        name: standardName,
        party: match.party,
        locale: match.locale,
        district: match.district,
    }
}