const BaseClass = require('./baseClass.js');
// 用子进程来执行shell脚本
const exec = require('child_process').execSync;
const fs = require('fs')

const CDN = require('../utils/cleanCDN.js');


class setCache extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        try {
            debugger
            // 检查params
            let paramsOk = this.checkParams(['type', 'obj']);
            if (!paramsOk) {
                throw new Error('参数格式不正确')
                return next();
            }
            if (
                typeof this.param.type !== 'number'||
                !this.param.obj
            ) {
                throw new Error('参数格式不正确')
                return;
            }

            // type ===1 设置强缓存
            if (this.param.type === 1) {
                let cssCacheTime = this.param.obj.cssCacheTime;
                let htmlCacheTime = this.param.obj.htmlCacheTime;
                let jsCacheTime = this.param.obj.jsCacheTime;

                let ngxinContent = ` map $sent_http_content_type $expires {
                    default                off;
                    text/html              ${htmlCacheTime};
                    text/css               ${cssCacheTime};
                    application/javascript ${jsCacheTime};
                    ~image/                max;
                }`
                let nginxPath = '/etc/nginx/cache.conf'
                fs.writeFileSync(nginxPath, ngxinContent, 'utf8');

                let path = '/etc/nginx/'
                exec(`nginx -t`, {
                    cwd: path
                })

                exec(`nginx -s reload`, {
                    cwd: path
                })


                ctx.body = {
                    success: true,
                    message: '强缓存设置成功',
                    data:  {}
                }
            }
            // type ===2 设置cdn缓存
            if (this.param.type === 2) {
                let cssCacheTime = this.param.obj.cssCacheTime;
                let htmlCacheTime = this.param.obj.htmlCacheTime;
                let jsCacheTime = this.param.obj.jsCacheTime;
                let cache = this.makeUpdateCache({cssCacheTime, htmlCacheTime, jsCacheTime})
                let params = {
                    host: 'www.bi15s.cn',
                    cache: JSON.stringify(cache),
                }
                let result = await CDN.updateCDN(params);
                ctx.body = {
                    success: true,
                    message: '协商缓存设置成功',
                    data:  result
                }
            }

        } catch (e) {
            ctx.body = {
                success: false,
                message: e.message || '请求失败'
            }
            return next();
        }
    }
    makeUpdateCache({cssCacheTime, htmlCacheTime, jsCacheTime}) {
        let result = [];
        if (cssCacheTime) {
            if (cssCacheTime.indexOf('m') > -1) {
                cssCacheTime = Number(cssCacheTime.replace('m', ''))
                result.push([1, ".css", cssCacheTime * 60])
            } else if (cssCacheTime.indexOf('s') > -1) {
                cssCacheTime = Number(cssCacheTime.replace('s', ''))
                result.push([1, ".css", cssCacheTime])
            }
        }
        if (htmlCacheTime) {
            if (htmlCacheTime.indexOf('m') > -1) {
                htmlCacheTime = Number(htmlCacheTime.replace('m', ''))
                result.push([1, ".html", htmlCacheTime * 60])
            } else if (htmlCacheTime.indexOf('s') > -1) {
                htmlCacheTime = Number(htmlCacheTime.replace('s', ''))
                result.push([1, ".html", htmlCacheTime])
            }
        }
        if (jsCacheTime) {
            if (jsCacheTime.indexOf('m') > -1) {
                jsCacheTime = Number(jsCacheTime.replace('m', ''))
                result.push([1, ".js", jsCacheTime * 60])
            } else if (jsCacheTime.indexOf('s') > -1) {
                jsCacheTime = Number(jsCacheTime.replace('s', ''))
                result.push([1, ".js", jsCacheTime])
            }
        }
        return result;
    }
}


module.exports = setCache;
