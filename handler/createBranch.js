const BaseClass = require('./baseClass.js');


class createBranch extends BaseClass{
    constructor() {
        super();
    }
    async run(ctx, next) {
        try {
            // 检查params
            let paramsOk = this.checkParams(['catalog_id', 'parent_id', 'name']);
            if (!paramsOk) {
                return next();
            }
            if (
                typeof this.param.catalog_id !== 'number' ||
                typeof this.param.parent_id !== 'number' ||
                typeof this.param.name !== 'string'
            ) {
                throw new Error('参数格式不正确')
                return;
            }
            this.selfId = Number(this.param.catalog_id);
            this.parentId = Number(this.param.parent_id);
            this.name = String(this.param.name);

            if (this.name.length === 0) {
                this.responseFail('名字长度不能为0', errCode.NOT_VALID_PARAM);
                return next();
            }

            // todo uid
            let catalogArr = await this.CatalogModel.getArrByCatalogId(this.param.catalog_id, 1);
            if (catalogArr.length > 0) {
                this.responseFail('数据库中已经有该数据的记录了', errCode.ADD_BUT_ALREADY_HAVE);
                return next();
            }

            let res = await this.CatalogModel.addNewCatalog(
                this.selfId,
                1,
                this.parentId,
                this.name,
            );
            if (res) {
                ctx.body = {
                    success: true,
                    message: 'addNewCatalog成功啦'
                }
                return next();
            } else {

                ctx.body = {
                    success: false,
                    message: 'addNewCatalog失败啦'
                }
                return next();
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
