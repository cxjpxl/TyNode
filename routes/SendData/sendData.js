/**
 * Created by cxj on 17-11-15.
 */
const router = require('koa-router')();
const Message = require('../../models/Message').Message;



function update(model,query,update){
    return new Promise((resolve,reject)=>{
        model.update(query,update,{upsert: true},(err, data)=>{
            if(!err){
                resolve({no:200});
            }else{
                resolve(err);
            }
        });
    })
}


//参数message
router.post('/sendData', async (ctx, next) => {
    let body  = ctx.request.body;
    let message  = body.message;
    let type = body.type;
    if(!message||!type){
        ctx.body={
            no:201,
            msg:'消息不能为空',
        };
        return ;
    }


    try{
        type = parseInt(type);
    }catch (e){

    }


    if(type == 1){
        console.log(body);
        console.log(message);
        console.log(type);
        console.log("------------------")
    }

    if(message == "null") {
        ctx.body={
            no:202,
            msg:'数据不能为null',
        };
        return ;
    }


    //将消息保存在数据库里面
    for(let i = 0 ; i <  global.ctxs.length ; i ++){
        let socket = global.ctxs[i];
        if(!socket) continue;
        try{
            socket.websocket.send(message.toString());
        }catch (e){

        }
    }
    if(type == 1){
        let time = new Date().getTime();
        await update(Message,{time:time},{$set:{
            message:message.toString(),
            time:time,
        }});
    }

    ctx.body={
        no:200,
        msg:'发送成功',
    }
});



module.exports = router;
