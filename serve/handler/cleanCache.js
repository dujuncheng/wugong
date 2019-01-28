const BaseClass = require('./baseClass.js');
// 用子进程来执行shell脚本
const exec = require('child_process').execSync;
const CDN = require('../utils/cleanCDN.js')
const fs = require('fs')


class cleanCache extends BaseClass{
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

            // 如果type 是2的话，一定要传入urls
            if (this.param.type === 2) {
                let urls = this.getRequestParam('urls')
                if ((!Array.isArray(urls)) || urls.length === 0) {
                    throw new Error('参数格式不正确')
                    return;
                }
            }

            // 如果type 是3的话，一定要传入dirs
            if (this.param.type === 3) {
                let dirs = this.getRequestParam('dirs')
                if ((!Array.isArray(dirs)) || dirs.length === 0) {
                    throw new Error('参数格式不正确')
                    return;
                }
            }

            // 如果是type === 2, 【清除cdn PATH缓存】
            if (this.param.type === 2) {
                try {
                    let urls = this.getRequestParam('urls')
                    let result = await CDN.RefreshCdnUrl(urls);
                    if (result) {
                        ctx.body = {
                            success: true,
                            message: 'cdn的路径缓存清除成功',
                            data:  {}
                        }
                    } else {
                        throw new Error('cdn的清除失败')
                    }

                } catch (e) {
                    throw new Error(e.message || 'cdn的清除失败')
                }
                return
            }

            // 如果是type === 3, 【清除cdn DIR缓存】
            if (this.param.type === 3) {
                try {
                    let dirs = this.getRequestParam('dirs')
                    let result = await CDN.RefreshCdnDir(dirs);
                    if (result) {
                        ctx.body = {
                            success: true,
                            message: 'cdn的目录缓存清除成功',
                            data:  {}
                        }
                    } else {
                        throw new Error('cdn的清除失败')
                    }

                } catch (e) {
                    throw new Error(e.message || 'cdn的清除失败')
                }
                return
            }

            // 如果是type === 1 【清除强缓存】
            if (this.param.type === 1) {
                let filePath = '/var/www/regular/wugong_project_2/src/App.vue'
                let data = fs.readFileSync(filePath, 'utf8');
                if (!data) {
                    throw new Error(data.message || '强缓存清除失败')
                    return
                }
                var result = data.replace('_insert_', `_insert_${Math.random()}`);
                fs.writeFileSync(filePath, result, 'utf8');

                let path = '/var/www/regular/wugong_project_2/'
                exec(`npm run build`, {
                    cwd: path
                })
                ctx.body = {
                    success: true,
                    message: '清除缓存成功',
                    data:  {}
                }
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


module.exports = cleanCache;
