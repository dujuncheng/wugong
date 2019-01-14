const _         = require('underscore');


class BaseClass {
    constructor() {
        this.ctx = '';
        this.param = {};
    }
    async handler(ctx, next) {
        this.ctx = ctx;
        await this.run(ctx, next);
        ctx.set('Access-Control-Allow-Origin','*');
        ctx.set('Access-Control-Allow-Methods','get,post');
        ctx.set('Access-Control-Allow-Headers','content-type')
    }
    getRequestParam(paramName) {
        let method = this.ctx.request.method.toLowerCase();
        let result = '';

        if (method === 'get') {
            result = this.ctx.request.query[paramName];
        } else if (method === 'post') {
            result = this.ctx.request.body[paramName];
        }

        return result;
    }
    /**
     * 校验传过来的参数是否都有
     * @param arr
     * @returns {boolean}
     */
    checkParams (arr) {
        let result = true;

        for (let i = 0; i < arr.length; i++) {
            let param = arr[i];
            let value = this.getRequestParam(param);
            if (_.isUndefined(value)) {
                result = false;
            } else {
                this.param[param] = value;
            }
        }

        if (result === false) {
            this.responseFail('参数缺失', 0);
        }
        return result;
    }
    /**
     * 设置失败的时候返回值
     * @param message
     * @param errCode
     */
    responseFail (message, errCode) {
        this.ctx.body = {
            success: false,
            err_code: errCode || 0,
            message: message || '操作失败'
        }
    }
}

module.exports = BaseClass;
