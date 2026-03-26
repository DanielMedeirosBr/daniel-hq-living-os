const fs = require("fs")
const path = require("path")

class LogEngine {

    constructor() {
        this.eventsLog = path.join(__dirname, '../runtime/events.log')
        this.errorsLog = path.join(__dirname, '../runtime/errors.log')
    }

    logEvent(message, data = {}) {
        const entry = {
            time: new Date().toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" }),
            message,
            data
        }

        fs.appendFileSync(this.eventsLog, JSON.stringify(entry) + '\n')

    }

    logError(message, error) {
        const entry = {
            time: new Date().toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" }),
            message,
            error: error?.stack || error
        }

        fs.appendFileSync(this.errorsLog, JSON.stringify(entry) + '\n')
    }
}

module.exports = new LogEngine()