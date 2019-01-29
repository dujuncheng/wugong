const createBranch              = require('../handler/createBranch.js');
const setPrepare                = require('../handler/setPrepare.js');
const setRegular                = require('../handler/setRegular.js');
const cleanCache                = require('../handler/cleanCache.js');
const setCache                = require('../handler/setCache.js');
const setCDN                = require('../handler/setCDN.js');

const routeMap = {
    'create_branch': createBranch,
    'set_prepare': setPrepare,
    'set_regular': setRegular,
    'clean_cache': cleanCache,
    'set_cache': setCache,
    'set_cdn': setCDN,
}

const route = async (ctx, next) => {
    let method = ctx.request.query.method || ctx.request.body.method;

    if (routeMap[method] && typeof routeMap[method] === 'function') {
        return await (new routeMap[method]()).handler(ctx, next);
    }
}


// export {route};

module.exports = route;
