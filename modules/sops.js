const _ = require('lodash');
const shelljs = require('shelljs')

const decrypt = (vault, key, email) => {
    const result = shelljs.exec(`sops --decrypt ${vault}.json`)
    if (result.code > 0) throw new Error("sops exec failed")
    const plainvault = JSON.parse(result.stdout)

    if (email != null && _.get(plainvault, `data.acl.${email}`, null) !== email) {
        throw new Error("email check failed");
    }

    if (key != null) {
        return _.get(plainvault, `data.secret.${key}`, {});
    } else {
        return plainvault
    }
}
module.exports = {
   decrypt 
}