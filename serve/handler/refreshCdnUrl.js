const BaseClass = require('./baseClass.js');
// 用子进程来执行shell脚本
const exec = require('child_process').execSync;
// import RefreshCdnUrl from '../utils/cleanCDN.js';
const RefreshCdnUrl = require('../utils/cleanCDN.js')


class refreshCdnUrl extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        try {
            debugger
            // 检查params
            let paramsOk = this.checkParams(['urls']);
            if (!paramsOk) {
                return next();
            }
            if (!Array.isArray(this.param.urls) || this.param.urls.length === 0) {
                throw new Error('参数格式不正确')
                return;
            }

            let result = await RefreshCdnUrl(this.param.urls);
            console.log(result)
            ctx.body = {
                success: true,
                message: '正式发布成功',
                data:  {}
            }
            return next();
        } catch (e) {
            console.log(e)
            ctx.body = {
                success: false,
                message: e.message || '请求失败'
            }
            return next();
        }
    }
}


module.exports = refreshCdnUrl;
