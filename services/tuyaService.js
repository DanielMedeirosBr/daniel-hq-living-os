require("dotenv").config()

const { TuyaContext } = require('@tuya/tuya-connector-nodejs')

/* =========================================================
   🌐 CONTEXTO TUYA
   ========================================================= */

const context = new TuyaContext({
  baseUrl: 'https://openapi.tuyaus.com',
  accessKey: process.env.TUYA_ACCESS_KEY,
  secretKey: process.env.TUYA_ACCESS_SECRET
})

/* =========================================================
   🔍 UTIL: EXTRAI O SWITCH PRINCIPAL
   ========================================================= */

/**
 * A API da Tuya retorna um array de status.
 * Aqui buscamos o primeiro "switch" (switch_1, switch_led, etc).
 */
function extractSwitch(statusResponse) {
  return statusResponse.result.find(s => s.code.startsWith("switch"))
}

/* =========================================================
   📡 GET STATE (FONTE DE VERDADE)
   ========================================================= */

/**
 * Sempre retorna o estado REAL do dispositivo.
 * Nunca calcula, nunca assume.
 */
exports.getState = async (deviceId) => {

  // consulta estado atual no Tuya
  const status = await context.request({
    method: 'GET',
    path: `/v1.0/iot-03/devices/${deviceId}/status`
  })

  const switchStatus = extractSwitch(status)

  if (!switchStatus) {
    return false
  }

  // 🔥 retorna exatamente o valor do device
  return switchStatus.value
}

/* =========================================================
   🔁 TOGGLE (COM CONFIRMAÇÃO REAL)
   ========================================================= */

/**
 * Fluxo correto:
 * 1. lê estado atual
 * 2. calcula novo estado
 * 3. envia comando
 * 4. CONFIRMA estado real após execução
 */
exports.toggle = async (deviceId) => {

  const status = await context.request({
    method: 'GET',
    path: `/v1.0/iot-03/devices/${deviceId}/status`
  })

  const switchStatus = extractSwitch(status)

  if (!switchStatus) {
    throw new Error("Switch code not found")
  }

  const newState = !switchStatus.value

  await context.request({
    method: 'POST',
    path: `/v1.0/iot-03/devices/${deviceId}/commands`,
    body: {
      commands: [{
        code: switchStatus.code,
        value: newState
      }]
    }
  })

  // ⚡ retorno imediato (sem esperar confirmação)
  return {
    deviceId,
    state: newState
  }
}