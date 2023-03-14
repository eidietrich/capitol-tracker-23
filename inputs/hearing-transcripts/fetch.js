// Fetches data from Missoula CDP to map hearing URLs to transcripts there

import fetch from 'node-fetch'

import { writeJson } from '../../utils/functions.js'

const API_URL = 'https://get-event-source-ids-lxouni6bkq-uc.a.run.app/'

const retrieve = async url => {
    const r = await fetch(url)
    return await r.json()
}

const main = async () => {
    console.log('### Fetching CDP hearing transcripts map from', API_URL)
    const recordings = await retrieve(API_URL)
    writeJson('./inputs/hearing-transcripts/recordings.json', recordings)
}

main()

