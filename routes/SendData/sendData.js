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
       //console.log(dataArray);
        if(dataArray.length > 0 ){
            //删除数据
            await Game.remove({}).exec();
            //存数据
            for(let i = 0 ; i < dataArray.length; i++){
                let dataItem = dataArray[i];
                let leagueName = dataItem["leagueName"];
                let teamName = dataItem["teamName"];
                let nameH = teamName[0];
                let nameG = teamName[1];
                let idset = dataItem["idset"];
                let mid = idset[0]+"";
                //if(mid == "0") continue;
                let time = dataItem["gameTime"];
                let g = new Game({nameH,nameG,leagueName,mid,time});
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

                console.log("主队:"+game.nameH+"||客队："+ game.nameG);
                if(global.lianSaiData){
                   if(game.nameH){
                       let nameHs = game.nameH.split("U");
                       let isNum   = false;
                       let numH = "";
                       if(nameHs.length > 1){
                           numH = nameHs[nameHs.length -1];
                           try{
                               numH = parseInt(numH);
                               isNum = true;
                           }catch (e){

                            }
                       }
                       let nameH = game.nameH;
                       if(isNum){
                            nameH = nameH.replace("U"+numH,"").trim();
                       }

                       if(global.lianSaiData[nameH+""]){
                           game.nameH = global.lianSaiData[nameH+""];
                           if(isNum){
                               game.nameH = game.nameH +"U"+numH;
                           }
                           console.log("主队:"+game.nameH);
                       }
                   }

                    //客队
                    if(game.nameG){
                        let nameGs = game.nameG.split("U");
                        let isNum   = false;
                        let numG = "";
                        if(nameGs.length > 1){
                            numG = nameGs[nameGs.length -1];
                            try{
                                numG = parseInt(numG);
                                isNum = true;
                            }catch (e){

                            }
                        }
                        let nameG = game.nameG;
                        if(isNum){
                            nameG = nameG.replace("U"+numG,"").trim();
                        }

                        if(global.lianSaiData[nameG+""]){
                            game.nameG = global.lianSaiData[nameG+""];
                            if(isNum){
                                game.nameG = game.nameG +"U"+numG;
                            }
                            console.log("客队:"+game.nameG);
                        }
                    }

                }

                console.log("主队:"+game.nameH+"||客队："+ game.nameG);

                let curData = {
                    game,
                    data,
                    curTime:time,
                };

                 for(let i = 0 ; i <  global.ctxs.length ; i ++){
                 let socket = global.ctxs[i];
                 if(!socket) continue;
                 console.log("发送数据:"+i);
                 try{
                    socket.websocket.send(JSON.stringify(curData));
                 }catch (e){

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
