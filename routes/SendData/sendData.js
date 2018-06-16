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

    console.log("data",type,message);

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
                       if(game.nameH.indexOf("(中)")>0){
                           game.nameH = game.nameH.replace("(中)","").trim();
                       }

                       if(game.nameH.indexOf("[中]")>0){
                           game.nameH = game.nameH.replace("[中]","").trim();
                       }

                       if(game.nameH.indexOf("(女)")>0){
                           game.nameH = game.nameH.replace("(女)","").trim();
                       }

                       if(game.nameH.indexOf("(后)")>0){
                           game.nameH = game.nameH.replace("(后)","").trim();
                       }

                       if(game.nameH.indexOf("II")>0){
                           game.nameH = game.nameH.replace("II","").trim();
                       }

                       if(game.nameH.indexOf("(W)")>0){
                           game.nameH = game.nameH.replace("(W)","").trim();
                       }

                       if(game.nameH.indexOf("(w)")>0){
                           game.nameH = game.nameH.replace("(w)","").trim();
                       }

                       if(game.nameH.indexOf("(R)")>0){
                           game.nameH = game.nameH.replace("(R)","").trim();
                       }


                       game.nameH = game.nameH.trim();

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
                       if(isNum){
                           game.nameH = game.nameH.replace("U"+numH,"").trim();
                       }
                       if(global.lianSaiData[game.nameH+""]){
                           game.nameH = global.lianSaiData[game.nameH+""];
                       }
                   }

                    //客队
                    if(game.nameG){
                        if(game.nameG.indexOf("(中)")>0){
                            game.nameG = game.nameG.replace("(中)","").trim();
                        }
                        if(game.nameG.indexOf("[中]")>0){
                            game.nameG = game.nameG.replace("[中]","").trim();
                        }

                        if(game.nameG.indexOf("(女)")>0){
                            game.nameG = game.nameG.replace("(女)","").trim();
                        }

                        if(game.nameG.indexOf("(后)")>0){
                            game.nameG = game.nameG.replace("(后)","").trim();
                        }

                        if(game.nameG.indexOf("II")>0){
                            game.nameG = game.nameG.replace("II","").trim();
                        }

                        if(game.nameG.indexOf("(W)")>0){
                            game.nameG = game.nameG.replace("(W)","").trim();
                        }

                        if(game.nameG.indexOf("(w)")>0){
                            game.nameG = game.nameG.replace("(w)","").trim();
                        }

                        if(game.nameG.indexOf("(R)")>0){
                            game.nameG = game.nameG.replace("(R)","").trim();
                        }

                        game.nameG = game.nameG.trim();

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
                        if(isNum){
                            game.nameG = game.nameG.replace("U"+numG,"").trim();
                        }

                        if(global.lianSaiData[game.nameG+""]){
                            game.nameG = global.lianSaiData[game.nameG+""];
                        }
                    }

                }
                let curData = {
                    cmd:1,
                    game,
                    data,
                    curTime:time,
                };

               if(global.ws&& global.ws.server&& global.ws.server.clients){
                   try {
                       global.ws.server.clients.forEach(ws=>{
                           try {
                               if(ws){
                                   ws.send(JSON.stringify(curData));
                               }
                           }catch (e1){
                               console.log(e1.toString());
                           }
                       });
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
