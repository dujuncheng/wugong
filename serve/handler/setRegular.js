const BaseClass = require('./baseClass.js');
// 用子进程来执行shell脚本
const exec = require('child_process').execSync;


class setRegular extends BaseClass{
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
            // exec(`sudo rm -r ./wugong_project_1`, {cwd: '/var/www/regular/'})
            console.log(1)
            exec(`rsync -r ./wugong_project_1 /var/www/regular/`, {cwd: '/var/www/prepare/'})
            console.log(2)
            exec(`git checkout master`, {cwd: '/var/www/home/wugong_project_1/'})
            console.log(3)
            exec(`git merge ${branch}`, {cwd: '/var/www/home/wugong_project_1/'})
            console.log(4)
            exec(`git push origin master`, {cwd: '/var/www/home/wugong_project_1/'})
            console.log(5)


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


module.exports = setRegular;
