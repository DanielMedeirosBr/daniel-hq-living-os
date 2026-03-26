const EventEmitter = require("events")
const fs = require("fs")
const path = require("path")
const log = require("./logEngine")

const counterFile = path.join(__dirname, "../runtime/process.counter")

let processCounter = 0

try {
  processCounter = parseInt(fs.readFileSync(counterFile, "utf8")) || 0
} catch {
  processCounter = 0
}

function normalize(context) {

  const { processId, payload, result } = context

  return {
    processId,
    room: payload?.room || result?.room || null,
    device: payload?.id || result?.device || null,
    action: payload?.action || null,
    source: payload?.source || null,
    state: payload?.state ?? result?.state ?? null
  }
}

class EventBus extends EventEmitter {

  emitEvent(event, payload = {}) {

    processCounter++
    fs.writeFileSync(counterFile, String(processCounter), "utf8")

    const context = {
      processId: processCounter,
      event,
      payload,
      startedAt: Date.now()
    }

    const base = normalize(context)

    log.logEvent("EVENT_RECEIVED", {
      processId: base.processId,
      room: base.room,
      device: base.device,
      action: base.action,
      source: base.source
    })

    this.emit(event, context)
  }

  onEvent(event, handler) {

    this.on(event, async (context) => {

      const start = context.startedAt

      try {

        await handler(context)

        const duration = Date.now() - start
        const base = normalize(context)

        log.logEvent("EVENT_PROCESSING", {
          processId: base.processId,
          room: base.room,
          device: base.device,
          action: base.action,
          state: base.state
        })

        log.logEvent("EVENT_SUCCESS", {
          processId: base.processId,
          room: base.room,
          device: base.device,
          action: base.action,
          state: base.state,
          duration_ms: duration
        })

      } catch (err) {

        const duration = Date.now() - start
        const base = normalize(context)

        log.logError("EVENT_ERROR", {
          processId: base.processId,
          room: base.room,
          device: base.device,
          action: base.action,
          error: err.message,
          duration_ms: duration
        })
      }

    })

  }

}

module.exports = new EventBus()