const createBranch                = require('../handler/createBranch.js');
const setPrepare                = require('../handler/setPrepare.js');
const setRegular                = require('../handler/setRegular.js');

const route = async (ctx, next) => {
    let method = ctx.request.query.method || ctx.request.body.method;
    if (method === 'create_branch') {
        return await (new createBranch()).handler(ctx, next);
    } else if (method === 'set_prepare') {
        return await (new setPrepare()).handler(ctx, next);
    } else if (method === 'set_regular') {
        return await (new setRegular()).handler(ctx, next);
    }
}


// export {route};

module.exports = route;
