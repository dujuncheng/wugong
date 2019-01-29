const qcloudSDK = require('qcloud-cdn-node-sdk');

let id = 'AKID1sVu776QhiTzFFPTihQxEF1Ypqb6fI1T';
let key = 'MSIsCH5ezOXQ3RZWHo56rMbi8LJ3btvl';

qcloudSDK.config({
    secretId: id,
    secretKey: key
})

/**
 * 生成符合腾讯云要求的参数
 * @param urlArr
 */
const makeURLPramas = (urlArr) => {
    let data = {}

    for (let i = 0; i < urlArr.length; i++) {
        if (urlArr[i] && typeof urlArr[i] === 'string') {
            data[`urls.${i}`] = urlArr[i]
        }
    }
    return data;
}

/**
 * 生成符合腾讯云要求的参数
 * @param urlArr
 */
const makeDIRPramas = (urlArr) => {
    let data = {}

    for (let i = 0; i < urlArr.length; i++) {
        if (urlArr[i] && typeof urlArr[i] === 'string') {
            data[`dirs.${i}`] = urlArr[i]
        }
    }
    return data;
}

/**
 * 刷新 cdn 中的url ，传入的是一个数组
 * @param urlArr
 * @constructor
 */
const RefreshCdnUrl = (urlArr) => {
    if (!urlArr || !Array.isArray(urlArr)) {
        return
    }
    return new Promise((resolve, reject) => {
        let data = makeURLPramas(urlArr);
        qcloudSDK.request('RefreshCdnUrl', data, (res) => {
            res = JSON.parse(res)
            if (res) {
                resolve(res)
            } else {
                reject(res)
            }
        })
    })
}

/**
 * 刷新 cdn 中的dir ，传入的是一个数组
 * @param urlArr
 * @constructor
 */
const RefreshCdnDir = (urlArr) => {
    if (!urlArr || !Array.isArray(urlArr)) {
        return
    }
    return new Promise((resolve, reject) => {
        let data = makeDIRPramas(urlArr);
        qcloudSDK.request('RefreshCdnDir', data, (res) => {
            res = JSON.parse(res)
            if (res) {
                resolve(res)
            } else {
                reject(res)
            }
        })
    })
}


/**
 * 关闭CDN
 * @param urlArr
 * @constructor
 */
const closeCDN = (params) => {
    return new Promise((resolve, reject) => {
        qcloudSDK.request('OfflineHost', params, (res) => {
            res = JSON.parse(res)
            if (res) {
                resolve(res)
            } else {
                reject(res)
            }
        })
    })
}


/**
 * 打开CDN
 * @param urlArr
 * @constructor
 */
const openCDN = (params) => {
    return new Promise((resolve, reject) => {
        qcloudSDK.request('OnlineHost', params, (res) => {
            res = JSON.parse(res)
            if (res) {
                resolve(res)
            } else {
                reject(res)
            }
        })
    })
}



module.exports = {
    RefreshCdnUrl,
    RefreshCdnDir,
    closeCDN,
    openCDN
}


