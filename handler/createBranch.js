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

            exec(`cd ../../home/${project}`)
            console.log(1)
            exec('git checkout master')
            console.log(2)
            exec('git pull origin master')
            console.log(3)
            exec(`git checkout -b ${project}_${branch}`)
            console.log(4)
            exec(`git push origin ${project}_${branch}`)
            console.log(5)

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
