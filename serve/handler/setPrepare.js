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
            console.log(1)
            exec(`git checkout ${branch}`, {cwd: '/var/www/home/wugong_project_1'})
            console.log(2)
            exec(`git pull origin ${branch}`, {cwd: '/var/www/home/wugong_project_1'})
            console.log(3)
            try {
                exec('rm -r node_modules', {cwd: '/var/www/home/wugong_project_1'})
            } catch (e) {
                console.log(e)
            }
            console.log(4)
            exec('cnpm install -S', {cwd: '/var/www/home/wugong_project_1'})
            console.log(5)
            exec('npm run build', {cwd: '/var/www/home/wugong_project_1'})
            console.log(7)
            exec('sudo rm -r /var/www/prepare/wugong_project_1/*', {cwd: '/var/www/home/wugong_project_1'})
            console.log(8)
            exec('cp -r ./dist/* ../../prepare/wugong_project_1/', {cwd: '/var/www/home/wugong_project_1'})
            console.log(9)

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
