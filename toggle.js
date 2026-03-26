const axios = require("axios");
const crypto = require("crypto");

const ACCESS_ID = "xhvgeme8gy7gx3fhwnvt";
const ACCESS_KEY = "1078d55d5e594f489a5bcc8f1b7c043e";

const BASE_URL = "https://openapi.tuyaus.com";
const DEVICE_ID = "eb54913d4bb2547893ey4z";

let cachedToken = null;
let tokenExpireTime = 0;


// HASH
function sha256(str) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

// SIGN
function sign(str, key) {
  return crypto
    .createHmac("sha256", key)
    .update(str)
    .digest("hex")
    .toUpperCase();
}


// TOKEN COM CACHE
async function getToken() {

  const now = Date.now();

  if (cachedToken && now < tokenExpireTime) {
    return cachedToken;
  }

  const t = now.toString();

  const path = "/v1.0/token?grant_type=1";

  const bodyHash = sha256("");

  const signStr =
    ACCESS_ID +
    t +
    "GET\n" +
    bodyHash +
    "\n\n" +
    path;

  const signature = sign(signStr, ACCESS_KEY);

  const res = await axios.get(
    BASE_URL + path,
    {
      headers: {
        client_id: ACCESS_ID,
        sign: signature,
        t: t,
        sign_method: "HMAC-SHA256"
      }
    }
  );

  cachedToken = res.data.result.access_token;

  tokenExpireTime = now + (res.data.result.expire_time * 1000) - 60000;

  console.log("NOVO TOKEN GERADO");

  return cachedToken;
}


// STATUS
async function getStatus(token) {

  const t = Date.now().toString();

  const path = `/v1.0/devices/${DEVICE_ID}/status`;

  const bodyHash = sha256("");

  const signStr =
    ACCESS_ID +
    token +
    t +
    "GET\n" +
    bodyHash +
    "\n\n" +
    path;

  const signature = sign(signStr, ACCESS_KEY);

  const res = await axios.get(
    BASE_URL + path,
    {
      headers: {
        client_id: ACCESS_ID,
        access_token: token,
        sign: signature,
        t: t,
        sign_method: "HMAC-SHA256"
      }
    }
  );

  return res.data.result;
}


// TOGGLE
async function sendToggle(token, state) {

  const newState = !state;

  const t = Date.now().toString();

  const path = `/v1.0/devices/${DEVICE_ID}/commands`;

  const bodyObj = {
    commands: [
      {
        code: "switch_led",
        value: newState
      }
    ]
  };

  const body = JSON.stringify(bodyObj);

  const bodyHash = sha256(body);

  const signStr =
    ACCESS_ID +
    token +
    t +
    "POST\n" +
    bodyHash +
    "\n\n" +
    path;

  const signature = sign(signStr, ACCESS_KEY);

  await axios.post(
    BASE_URL + path,
    bodyObj,
    {
      headers: {
        client_id: ACCESS_ID,
        access_token: token,
        sign: signature,
        t: t,
        sign_method: "HMAC-SHA256",
        "Content-Type": "application/json"
      }
    }
  );

  return newState;
}


// FUNÇÃO PRINCIPAL
async function toggle() {

  const token = await getToken();

  const status = await getStatus(token);

  const current = status.find(d => d.code === "switch_led").value;

  const newState = await sendToggle(token, current);

  console.log("TOGGLED:", newState);

  return newState;
}


module.exports = toggle;