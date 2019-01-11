const Koa                   = require('koa');
const bodyParser            = require('koa-body');
const Router                = require('koa-router');
const cors                  = require('koa2-cors');

// node原生不支持
const route = require('./route/index.js')

async function serverinit () {


    const app = new Koa();

    app.use(bodyParser());
    app.use(cors());
    var router = new Router();
    router.all('/wugong_serve', route);
    router.all('/wugong_home', route);

    app.use(router.routes()).use(router.allowedMethods());

    app.listen(83);
}


serverinit();

