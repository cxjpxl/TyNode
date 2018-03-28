const router = require('koa-router')();

const login = require('./login/login');
const sendData = require('./SendData/sendData');
const getData = require('./web/getUserInfo');
//中间件处理
router.use(async (ctx, next)=>{
    if(ctx.session&&ctx.session.user){
        ctx.session._garbage = Date();
    }
    await next();
});

//登录页面
router.use('/cxj',login.routes(), login.allowedMethods());
router.use('/cxj',sendData.routes(), sendData.allowedMethods());
router.use('/cxj',getData.routes(), getData.allowedMethods());

module.exports = router;
