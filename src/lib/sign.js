
var Base64 = require('js-base64').Base64;
var createHmac = require('create-hmac')

/**
 * 签名 带时间戳
 * @param {*} appKey 
 * @param {*} secretKey 
 * @param {*} requestBody 
 * @param {*} requestURI 
 * @param {*} timestamp 
 */
export function signWithTimestamp(appKey, secretKey, requestBody, requestURI, timestamp){
    if(!appKey || !secretKey || !requestURI){
        return "";
    }
    requestBody = requestBody || "";
    appKey = appKey.trim();
    secretKey = secretKey.trim();

    let str = requestURI.toLowerCase() + requestBody + appKey + secretKey + timestamp;
    // console.log(`signWithTimestamp str is ${str}`);
    try {
        let encrypted = hmacSha1(str, secretKey);
        // console.log(`encrypted is ${encrypted}, tt is  ${JSON.stringify(encrypted)}`);
        let content = Base64.encode(`${timestamp}:${appKey}`);
        // console.log(`content is ${content}`);
        return "Auth " + content + ":" + encrypted;
    } catch (ex) {
        console.log("sign error", ex);
    }
}

function hmacSha1(text, secretKey) {
    let hmac = createHmac('sha1', Buffer.from(secretKey))
    hmac.update(text) // optional encoding parameter
    // synchronously get result with optional encoding parameter
    let hex = hmac.digest().toString('base64');
    return hex;
}

/**
 * 签名 使用当前时间戳
 * @param {*} appKey 
 * @param {*} encryptKey 
 * @param {*} requestBody 
 * @param {*} requestURI 
 */
export function sign(appKey, secretKey, requestBody, requestURI){
    return signWithTimestamp(appKey, secretKey, requestBody, requestURI, new Date().getTime());
}