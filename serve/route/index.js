const createBranch              = require('../handler/createBranch.js');
const setPrepare                = require('../handler/setPrepare.js');
const setRegular                = require('../handler/setRegular.js');
const refreshCdnUrl             = require('../handler/refreshCdnUrl.js');

const routeMap = {
    'create_branch': createBranch,
    'set_prepare': setPrepare,
    'set_regular': setRegular,
    'refresh_cdn': refreshCdnUrl,
}

const route = async (ctx, next) => {
    let method = ctx.request.query.method || ctx.request.body.method;

    if (routeMap[method] && typeof routeMap[method] === 'function') {
        return await (new routeMap[method]()).handler(ctx, next);
    }
}


// export {route};

module.exports = route;
