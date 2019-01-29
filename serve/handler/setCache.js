const BaseClass = require('./baseClass.js');
// 用子进程来执行shell脚本
const exec = require('child_process').execSync;
const fs = require('fs')


class setCache extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        try {
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
            }


            ctx.body = {
                success: true,
                message: '正式发布成功',
                data:  {}
            }
        } catch (e) {
            ctx.body = {
                success: false,
                message: e.message || '请求失败'
            }
            return next();
        }
    }
}


module.exports = setCache;
