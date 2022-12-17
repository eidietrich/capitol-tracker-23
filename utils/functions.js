// const fs = require('fs')
const fs = require('fs-extra')
const { parse } = require('csv-parse/sync')

// NOT DONE
module.exports.getCsv = (path) => {
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
module.exports.getJson = (path) => JSON.parse(fs.readFileSync(path))

module.exports.writeText = (path, string) => {
    fs.writeFile(path, string, err => {
        if (err) throw err
        console.log('Text written to', path)
    })
}

module.exports.writeJson = (path, data) => {
    fs.writeFile(path, JSON.stringify(data, null, 2), err => {
        if (err) throw err
        console.log('JSON written to', path)
    }
    );
}

module.exports.copyFile = (src, dest) => {
    fs.copyFile(src, dest, err => {
        if (err) throw err
        console.log('Copied to', dest)
    })
}

module.exports.copyFolderContents = (src, dest) => {
    fs.copy(src, dest, err => {
        if (err) throw err
        console.log('Copied dir to', dest)
    })
}

module.exports.makeUrlKey = name => name.toLowerCase()
    .replace(/\s/g, '-').replace('.', '').replace("'", '')