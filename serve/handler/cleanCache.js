const BaseClass = require('./baseClass.js');
// 用子进程来执行shell脚本
const exec = require('child_process').execSync;
// import RefreshCdnUrl from '../utils/cleanCDN.js';
const RefreshCdnUrl = require('../utils/cleanCDN.js')
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
            if (this.param.type === 2 && (!Array.isArray(this.param.urls) || this.param.urls.length === 0)) {
                throw new Error('参数格式不正确')
                return;
            }
            // 如果是type === 2, 【清除cdn缓存】
            if (this.param.type === 2) {
                try {
                    let urls = this.getRequestParam('urls')
                    let result = await RefreshCdnUrl(urls);
                    if (result) {
                        ctx.body = {
                            success: true,
                            message: 'cdn的缓存清除成功',
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
                let path = '/var/www/regular/wugong_project_2/'
                console.log('111111111111111111111111111')
                exec(`npm run build`, {cwd: path})
                // let filePath = '/var/www/regular/wugong_project_2/src/App.vue'
                // fs.readFile(filePath, 'utf8', function(err, data) {
                //     if (err) {
                //         throw new Error(err.message || '强缓存清除失败')
                //         return
                //     }
                //
                //     var result = data.replace('_insert_', `_insert_${Math.random()}`);
                //     console.log(result)
                //     fs.writeFile(filePath, result, 'utf8', function(err) {
                //         if (err) {
                //             throw new Error(err.message || '强缓存清除失败')
                //             return
                //         };
                //         try {
                //             let path = '/var/www/regular/wugong_project_2/'
                //             exec(`/var/www/wugong/serve/shell/rebuild_file.sh ${path}`)
                //             ctx.body = {
                //                 success: true,
                //                 message: '强缓存清除成功',
                //                 data:  {}
                //             }
                //         } catch (e) {
                //             console.log(e)
                //             ctx.body = {
                //                 success: false,
                //                 message: e.message || '请求失败'
                //             }
                //         }
                //     });
                // });
                ctx.body = {
                    success: true,
                    message: '清除缓存成功',
                    data:  {}
                }
                return next();
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
