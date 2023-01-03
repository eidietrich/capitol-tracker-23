// const fs = require('fs')
import fs from 'fs-extra'
import { parse } from 'csv-parse/sync'
// const fs = require('fs-extra')
// const { parse } = require('csv-parse/sync')

// NOT DONE
export const getCsv = (path) => {
    const raw = fs.readFileSync(path)
    const rows = parse(raw, { columns: false, trim: true })
    const head = rows[0]
    const body = rows.slice(1,)

    const data = body.map(row => {
        const d = {}
        head.forEach((key, i) => {
            d[key] = row[i]
        })
        return d
    })
    return data
}
export const getJson = (path) => JSON.parse(fs.readFileSync(path))

export const writeText = (path, string) => {
    fs.writeFile(path, string, err => {
        if (err) throw err
        console.log('    Text written to', path)
    })
}

export const writeJson = (path, data) => {
    fs.writeFile(path, JSON.stringify(data, null, 2), err => {
        if (err) throw err
        console.log('    JSON written to', path)
    }
    );
}

export const copyFile = (src, dest) => {
    fs.copyFile(src, dest, err => {
        if (err) throw err
        console.log('    Copied to', dest)
    })
}

export const copyFolderContents = (src, dest) => {
    fs.copy(src, dest, err => {
        if (err) throw err
        console.log('    Copied dir to', dest)
    })
}

export const makeUrlKey = name => name.toLowerCase()
    .replace(/\s/g, '-').replace('.', '').replace("'", '')