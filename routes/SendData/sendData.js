/**
 * Created by cxj on 17-11-15.
 */
const router = require('koa-router')();
const Message = require('../../models/Message').Message;
const Game = require('../../models/Game').Game;


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

    if(message == "null") {
        ctx.body={
            no:202,
            msg:'数据不能为null',
        };
        return ;
    }

    if(type !=1 && type !=2){
        ctx.body={
            no:203,
            msg:'type类型错误',
        };
        return ;
    }


    if(type == 1){
        let dataArray = JSON.parse(message);
        if(dataArray.length > 0 ){
            //删除数据
            await Game.remove({}).exec();
            //存数据
            for(let i = 0 ; i < dataArray.length; i++){
                let dataItem = dataArray[i];
                let teamName = dataItem["teamName"];
                let nameH = teamName[0];
                let nameG = teamName[1];
                let idset = dataItem["idset"];
                let mid = idset[0];
                let time = dataItem["gameTime"];
                let g = new Game({nameH,nameG,mid,time});
                await g.save();
            }
        }
    }


    if(type == 2){
             let time = new Date().getTime();
             await update(Message,{time:time},{$set:{
                message:message.toString(),
                 time:time,
             }});
    }




    //将消息保存在数据库里面
    /*
    for(let i = 0 ; i <  global.ctxs.length ; i ++){
        let socket = global.ctxs[i];
        if(!socket) continue;
        try{
            socket.websocket.send(message.toString());
        }catch (e){

        }
    }*/

    // if(type == 1){
    //     let time = new Date().getTime();
    //     await update(Message,{time:time},{$set:{
    //         message:message.toString(),
    //         time:time,
    //     }});
    // }

    ctx.body={
        no:200,
        msg:'发送成功',
    }
});



module.exports = router;
