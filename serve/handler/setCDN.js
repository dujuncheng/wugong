const BaseClass = require('./baseClass.js');
// 用子进程来执行shell脚本
const exec = require('child_process').execSync;
const CDN = require('../utils/cleanCDN.js')
const fs = require('fs')


class setCDN extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        try {
            // 检查params
            let paramsOk = this.checkParams(['type']);
            if (!paramsOk) {
                return next();
            }
            if (typeof this.param.type !== "number") {
                throw new Error('参数格式不正确')
                return;
            }

            // 如果type 是1 的话， 是打开CDN
            if (this.param.type === 1) {
                try {
                    let params = {
                        host: 'www.bi15s.cn'
                    }
                    let result = await CDN.openCDN(params);
                    if (result) {
                        ctx.body = {
                            success: true,
                            message: 'cdn开启成功',
                            data:  result
                        }
                    } else {
                        throw new Error('cdn开启失败')
                    }

                } catch (e) {
                    throw new Error(e.message || 'cdn开启失败')
                }
            }

            // 如果type 是2的话，是关闭CDN
            if (this.param.type === 2) {
                try {
                    let params = {
                        host: 'www.bi15s.cn'
                    }
                    let result = await CDN.closeCDN(params);
                    if (result) {
                        ctx.body = {
                            success: true,
                            message: 'cdn关闭成功',
                            data:  result
                        }
                    } else {
                        throw new Error('cdn关闭失败')
                    }

                } catch (e) {
                    throw new Error(e.message || 'cdn关闭失败')
                }
                return
            }

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


module.exports = setCDN;
