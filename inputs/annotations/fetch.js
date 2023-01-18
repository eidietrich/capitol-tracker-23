// Fetches data from


import fetch from 'node-fetch'

import { writeJson } from '../../utils/functions.js'

// const API_BASE = 'http://127.0.0.1:1337/api' // Local
const API_BASE = 'http://54.202.231.117:1337/api' // production

const retrieve = async url => {
    const r = await fetch(url)
    return await r.json()
}

const getBillAnnotations = async () => {
    let data = []
    const result = await retrieve(`${API_BASE}/bills?populate=*&pagination[pageSize]=20`)
    if (result.meta.pagination.pageCount === 1) {
        data = result.data.map(d => d.attributes)
    } else {
        const numPages = result.meta.pagination.pageCount
        for (let i = 1; i <= numPages; i++) {
            const page = await retrieve(`${API_BASE}/bills?populate=*&pagination[pageSize]=20&pagination[page]=${i}`)
            data = data.concat(page.data.map(d => d.attributes))
        }
    }
    return data
}

const getLawmakerAnnotations = async () => {
    const result = await fetch(`${API_BASE}/lawmakers?populate=*&pagination[pageSize]=200`)
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
    console.log('### Fetching annotations from', API_BASE)
    const bills = await getBillAnnotations()
    // TODO - figure out why bill tags don't appear to be fetching here
    // linkage cleaning
    bills.forEach(bill => {
        const catData = bill.bill_category.data
        bill.category = catData && catData.attributes.CategoryLabel || null
        bill.categoryDescription = catData && catData.attributes.CategoryDescription || null
        bill.categoryOrder = catData && catData.attributes.OrderOnPage || null
        bill.showCategory = catData && catData.attributes.ShowOnKeyBillsList || null

        const tagData = bill.bill_tags.data
        bill.tags = tagData.map(tag => ({ name: tag.attributes.Tag, description: tag.attributes.TagDescription }))

        // cleanup
        delete bill.bill_category
        delete bill.bill_tags
    })

    writeJson('./inputs/annotations/bill-annotations.json', bills)
    const lawmakers = await getLawmakerAnnotations()
    writeJson('./inputs/annotations/lawmaker-annotations.json', lawmakers)
    const annotations = await getProcessAnnotations()
    writeJson('./inputs/annotations/process-annotations.json', annotations)
    const guideText = await getGuideText()
    writeJson('./inputs/annotations/guide-text.json', guideText)
}

main()

