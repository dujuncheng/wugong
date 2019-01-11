const BaseClass = require('./baseClass.js');
// 用子进程来执行shell脚本
const exec = require('child_process').execSync;


class createBranch extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        try {
            // 检查params
            let paramsOk = this.checkParams(['project_name']);
            if (!paramsOk) {
                return next();
            }
            if (
                typeof this.param.project_name !== 'string'
            ) {
                throw new Error('参数格式不正确')
                return;
            }


            // wugong_project_1
            let project = this.param.project_name;
            let branch = new Date().getTime() + (Math.random() * 10000).toFixed(0);

            exec(`cd ../wugong_home/${project} && git checkout master && git pull origin master&& git checkout -b ${project}_${branch} && git push origin ${project}_${branch}`)

            ctx.body = {
                success: true,
                message: '',
                data:  {
                    branch: `${project}_${branch}`,
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


module.exports = createBranch;
