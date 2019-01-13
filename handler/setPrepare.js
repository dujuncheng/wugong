const BaseClass = require('./baseClass.js');
// 用子进程来执行shell脚本
const exec = require('child_process').execSync;


class setPrepare extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        try {
            // 检查params
            let paramsOk = this.checkParams(['branch', 'project_name']);
            if (!paramsOk) {
                return next();
            }
            if (
                typeof this.param.branch !== 'string' ||
                typeof this.param.project_name !== 'string'
            ) {
                throw new Error('参数格式不正确')
                return;
            }


            // wugong_project_1
            let branch = this.param.branch;
            let project = this.param.project_name;
            exec(`cd ../../home/${project} && git checkout ${branch} && git pull origin ${branch} && rm -r node_modules && cnpm install -S && npm run build && sudo rm -r ../../prepare/wugong_project_1/* && cp -r ./dist/* ../../prepare/wugong_project_1/`)

            ctx.body = {
                success: true,
                message: '',
                data:  {
                    cookie: 'YUFA=1'
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
}


module.exports = setPrepare;
