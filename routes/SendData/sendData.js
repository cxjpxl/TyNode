/**
 * Created by cxj on 17-11-15.
 */
const router = require('koa-router')();

//参数message
router.post('/sendData', async (ctx, next) => {
    let body  = ctx.request.body;
    let message  = body.message;
    if(!message){
        ctx.body={
            no:201,
            msg:'消息不能为空',
        };
        return ;
    }

    for(let i = 0 ; i <  global.ctxs.length ; i ++){
        let socket = global.ctxs[i];
        if(!socket) continue;
        socket.websocket.send(message.toString());
    }

    ctx.body={
        no:200,
        msg:'发送成功',
    }
});



module.exports = router;
