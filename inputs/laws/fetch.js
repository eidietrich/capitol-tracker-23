// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
import fetch from 'node-fetch'

import { writeJson } from '../../utils/functions.js'

// const SESSION_ID = '20211'
const SESSION_ID = '20231'
const repoUrl = (session, file) => `https://raw.githubusercontent.com/eidietrich/laws-interface/main/output/${session}/${file}`
const outPath = file => `./inputs/laws/${file}`

const fetchJson = async url => {
    const response = await fetch(url)
    const data = await response.json()
    return data
}

const main = async () => {
    console.log('### Fetching bill info from', repoUrl(SESSION_ID, ''))
    const bills = await fetchJson(repoUrl(SESSION_ID, 'all-bills.json'))
    const actions = await fetchJson(repoUrl(SESSION_ID, 'all-bill-actions.json'))
    const votes = await fetchJson(repoUrl(SESSION_ID, 'all-votes.json'))

    writeJson(outPath('bills.json'), bills)
    writeJson(outPath('actions.json'), actions)
    writeJson(outPath('votes.json'), votes)
}

main()