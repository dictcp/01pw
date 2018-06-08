const _ = require('lodash');
const shelljs = require('shelljs')
var fs = require('fs')

const prefix = "./vaults"

const decrypt = (vault, key, email) => {
    const result = shelljs.exec(`sops --decrypt ${prefix}/${vault}.json`)
    if (result.code > 0) throw new Error("sops exec failed")
    const plainvault = JSON.parse(result.stdout)

    if (email != null && _.get(plainvault, `data.acl.${email}`, null) !== email) {
        throw new Error("email check failed");
    }

    if (key != null) {
        return _.get(plainvault, `data.secret.${key}`, {})
    } else {
        return plainvault
    }
}

const list = () => {
    var files = fs.readdirSync(`${prefix}/`)
    return files.filter((x) => /\.json$/.test(x)).map((x) => x.replace(/\.json$/,''))
}

const get = (vault) => {
    return JSON.parse(fs.readFileSync(`${prefix}/${vault}.json`)).data
}

module.exports = {
   decrypt,
   list,
   get
}