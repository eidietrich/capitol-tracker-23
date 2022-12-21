// Fetches data from


import fetch from 'node-fetch'

import { writeJson } from '../../utils/functions.js'

// const API_BASE = 'http://127.0.0.1:1337/api' // Local
const API_BASE = 'http://54.202.231.117:1337/api' // production

const getBillAnnotations = async () => {
    const result = await fetch(`${API_BASE}/bills?populate=*`)
    const resultData = await result.json()
    if (resultData.meta.pagination.pageCount > 1) throw `Too many bill results; Figure out pagination`
    const results = resultData.data.map(d => d.attributes)
    return results
}

const getLawmakerAnnotations = async () => {
    const result = await fetch(`${API_BASE}/lawmakers?populate=*`)
    const resultData = await result.json()
    if (resultData.meta.pagination.pageCount > 1) throw `Too many lawmaker results; Figure out pagination`
    const results = resultData.data.map(d => d.attributes)
    return results
}

const getProcessAnnotations = async () => {
    const result = await fetch(`${API_BASE}/process-annotation`)
    const resultData = await result.json()
    const results = resultData.data.attributes
    return results
}

const getGuideText = async () => {
    const result = await fetch(`${API_BASE}/guide-text`)
    const resultData = await result.json()
    const results = resultData.data.attributes
    return results
}


const main = async () => {
    const bills = await getBillAnnotations()
    // linkage cleaning
    bills.forEach(bill => {
        bill.category = bill.bill_category.data.attributes.CategoryLabel
        bill.categoryDescription = bill.bill_category.data.attributes.CategoryDescription
    })
    writeJson('./inputs/cms/bill-annotations.json', bills)
    const lawmakers = await getLawmakerAnnotations()
    writeJson('./inputs/cms/lawmaker-annotations.json', lawmakers)
    const annotations = await getProcessAnnotations()
    writeJson('./inputs/cms/process-annotations.json', annotations)
    const guideText = await getGuideText()
    writeJson('./inputs/cms/guide-text.json', guideText)
}

main()

