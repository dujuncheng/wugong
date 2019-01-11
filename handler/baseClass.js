const _         = require('underscore');


class BaseClass {
    constructor() {
        this.ctx = '';
        this.param = {};
        this.NoteModel = NoteModel.instance();
        this.CatalogModel = CatalogModel.instance();
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
            this.responseFail('参数缺失', errCode.NOT_VALID_PARAM);
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

    /**
     * 获取到下次复习的记忆时长，单位s
     * @param reviewNum
     * @returns {number}
     */
    getNextReviewTime(reviewNum) {
        let nextReviewSecond = 0;
        if (reviewNum === 0) {
            nextReviewSecond = 30 * 60;
        } else if (reviewNum === 1) {
            nextReviewSecond = 12 * 60 * 60;
        } else if (reviewNum === 2) {
            nextReviewSecond = 24 * 60 * 60;
        } else if (reviewNum === 3) {
            nextReviewSecond = 2 * 24 * 60 * 60;
        } else if (reviewNum === 4) {
            nextReviewSecond = 4 * 24 * 60 * 60;
        } else if (reviewNum === 5) {
            nextReviewSecond = 7 * 24 * 60 * 60;
        } else if (reviewNum === 6) {
            nextReviewSecond = 15 * 24 * 60 * 60;
        } else if (reviewNum === 7) {
            nextReviewSecond = 30 * 24 * 60 * 60;
        } else if (reviewNum === 8) {
            nextReviewSecond = 50 * 24 * 60 * 60;
        } else if (reviewNum === 8) {
            nextReviewSecond = 80 * 24 * 60 * 60;
        } else if (reviewNum === 9) {
            nextReviewSecond = 140 * 24 * 60 * 60;
        } else if (reviewNum === 10) {
            nextReviewSecond = 200 * 24 * 60 * 60;
        } else if (reviewNum === 10) {
            nextReviewSecond = 300 * 24 * 60 * 60;
        } else if (reviewNum === 10) {
            nextReviewSecond = 400 * 24 * 60 * 60;
        } else {
            nextReviewSecond = 400 * 24 * 60 * 60;
        }

        let now = Math.floor(Date.now() / 1000);
        let reviewTime = now + nextReviewSecond;
        return reviewTime;
    }
}

// export {BaseClass};

module.exports = BaseClass;
