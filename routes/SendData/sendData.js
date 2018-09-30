/**
 * Created by cxj on 17-11-15.
 */
const router = require('koa-router')();
const Message = require('../../models/Message').Message;
const Order = require('../../models/Order').Order;
const Game = require('../../models/Game').Game;
var JSON5 = require('json5');
let v = require('../../utlis/config').v;
let v1 = require('../../utlis/config').v1;

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



    if(type== -1){
        let data ={
            cmd:-1,
            version:v,
        };
        if(global.ws&& global.ws.server&& global.ws.server.clients){
            console.log("准备发送 版本更换信息！");
            try {
                global.ws.server.clients.forEach(ws=>{
                    try {
                        if(ws){
                            ws.send(JSON5.stringify(data));
                        }
                    }catch (e1){
                        console.log(e1.toString());
                    }
                });
            }catch (e){
                console.log(e.toString());
            }
        }else{
            console.log("webSocket 对象连接找不到!");
        }

        ctx.body={
            no:200,
            msg:'',
        };
        return ;
    }


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

    if(type !=1 && type !=2 && type !=3 && type !=4 && type !=5 ){
        console.log("type类型错误!");
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

        //    global.biSaiArray = dataArray;
        }
    }

   /* if(type == 3){
        let dataArray = JSON5.parse(message);
        if(dataArray.length > 0 ){
            //删除数据
            await Game.remove({}).exec();
            //存数据
            for(let i = 0 ; i < dataArray.length; i++){
                let dataItem = dataArray[i];
                let leagueName = dataItem["leagueName"];
                let nameH = dataItem["nameH"];
                let nameG = dataItem["nameG"];
                let mid = dataItem["mid"]+"";
                let time = dataItem["gameTime"]?dataItem["gameTime"]:"";
                let g = new Game({nameH,nameG,leagueName,mid,time});
                await g.save();
            }

            //    global.biSaiArray = dataArray;
        }
    }
    */
    if(/*type == 4||*/type == 2){
     //   console.log("data",type,message);
     //   console.log("有事件发送过来!");
        await update(Message,{time:new Date().getTime()},{$set:{
            time:new Date().getTime(),
            message:message,
        }});
        let data = JSON5.parse(message);
        let mid = data["MID"]+"";
       let game = await Game.findOne({mid: mid}).exec();

       /* if(!global.biSaiArray || global.biSaiArray.length == 0){
            ctx.body={
                no:200,
                msg:'成功',
            };
            return ;
        }*/

      /*  let biSaiCatchs = JSON.parse(JSON.stringify(global.biSaiArray));//复制一份数据   双缓存
        let game = null;
        for(let i = 0 ; i < biSaiCatchs.length; i++){
            let dataItem = biSaiCatchs[i];
            let teamName = dataItem["teamName"];
            let myMid = dataItem["idset"][0]+"";
             if(myMid == mid){
                game ={};
                game.nameH = teamName[0];
                game.nameG = teamName[1];
                game.leagueName = dataItem["leagueName"];
                game.mid = myMid;
                game.time = dataItem["gameTime"];
                break;
            }
        }
        biSaiCatchs = null; //释放数据*/
        console.log("game",game);
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
                curTime:new Date().getTime(),
            };
            console.log("准备发送前:",curData);
            if(global.ws&& global.ws.server&& global.ws.server.clients){
                console.log("准备发送！");
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
            }else{
                console.log("webSocket 对象连接找不到!");
            }
        }
        else{
            console.log("找不到比赛队伍！！！");
        }
    }

    if(type == 5){
        let data = JSON5.parse(message);


        console.log(data);
        if(!data.version || data.version  != v || data.version  != v1){
            console.log("版本不存在",data.version,v,v1);
            ctx.body={
                no:200,
                msg:'发送成功',
            };
            return ;
        }

        if(!data.userName) {
            console.log("用户名不存在");
            ctx.body={
                no:200,
                msg:'发送成功',
            };
            return ;
        }
        //保存数据
        await update(Order,{time:new Date().getTime()},{$set:{
            time:new Date().getTime(),
            message:message,
        }});
        let daTuiData = {
          //  "VIP4":1,
          //  "VIP5":1,
            "admin4001":1,
             "admin4002":1,
            "admin4003":1,
            "admin4004":1,
            "admin4005":1,
           "admin4006":1,
        };
        if(daTuiData[data.userName] == 1){
            if(global.ws&& global.ws.server&& global.ws.server.clients){
                console.log("准备发送大腿数据！ "+data.userName);
                try {
                    global.ws.server.clients.forEach(ws=>{
                        try {
                            if(ws){
                                ws.send(message);
                            }
                        }catch (e1){
                            console.log(e1.toString());
                        }
                    });
                }catch (e){
                    console.log(e.toString());
                }
            }else{
                console.log("webSocket 对象连接找不到!");
            }
        }
    }
    ctx.body={
        no:200,
        msg:'发送成功',
    }
});



module.exports = router;
