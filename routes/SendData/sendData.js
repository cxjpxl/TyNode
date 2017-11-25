/**
 * Created by cxj on 17-11-15.
 */
const router = require('koa-router')();
const Message = require('../../models/Message').Message;
const Game = require('../../models/Game').Game;
var JSON5 = require('json5');


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
        let dataArray = JSON5.parse(message);
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
                if(mid == "0") continue;
                let time = dataItem["gameTime"];
                let g = new Game({nameH,nameG,mid,time});
                await g.save();
            }
        }
    }


    if(type == 2){
        await update(Message,{time:new Date().getTime()},{$set:{
            time:new Date().getTime(),
            message:message,
        }});
        let data = JSON5.parse(message);
        let mid = data["MID"]+"";
        let cid = data["CID"];
        try{
            cid = parseInt(cid);
        }catch (e){
            ctx.body={
                no:203,
                msg:'cid类型错误',
            };
            return ;
        }
       //if(cid==9926||cid==9927||cid==2086||cid==1062||cid==2055||cid==1031){
            let game = await Game.findOne({mid: mid}).exec();
            let time = new Date().getTime();
            if(game&&game.mid){
                let curData = {
                    game,
                    data,
                    curTime:time,
                };
                 for(let i = 0 ; i <  global.ctxs.length ; i ++){

                 let socket = global.ctxs[i];
                     console.log("" + i);
                 if(!socket) continue;
                     console.log( i+"准备发送");
                 try{
                    socket.websocket.send(JSON.stringify(curData));
                 }catch (e){
                    console.log(e.toString());
                 }
                 }
            }
      // }
    }


    ctx.body={
        no:200,
        msg:'发送成功',
    }
});



module.exports = router;
