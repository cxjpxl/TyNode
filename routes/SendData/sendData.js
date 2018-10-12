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


 //   console.log(type,message);


    try{
        type = parseInt(type);
    }catch (e){

    }

    //版本更新事件 cmd -1
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

    if(message == "null") {
        ctx.body={
            no:202,
            msg:'数据不能为null',
        };
        return ;
    }

    //h8联赛
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

   //H8事件 cmd1
    if(type == 2){
        await update(Message,{time:new Date().getTime()},{$set:{
            time:new Date().getTime(),
            message:message,
        }});
        //console.log(Message);
        let data = JSON5.parse(message);
        let mid = data["MID"]+"";
        let game = await Game.findOne({mid: mid}).exec();
        console.log("game",game);
        if(game&&game.mid){
            console.log("主队:"+game.nameH+"||客队："+ game.nameG);
            if(global.lianSaiData){
                if(game.nameH){
                    /*if(game.nameH.indexOf("(中)")>0){
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
                    }*/


                    if(game.nameH.indexOf("II")>0){
                        game.nameH = game.nameH.replace("II","").trim();
                    }

                    if(game.nameH.indexOf("-2")>0){
                        game.nameH = game.nameH.replace("-2","").trim();
                    }

                    if(game.nameH.indexOf("-3")>0){
                        game.nameH = game.nameH.replace("-3","").trim();
                    }

                    if(game.nameH.indexOf("U-")>0){
                        game.nameH = game.nameH.replace("U-","U").trim();
                    }

                    if(game.nameH.indexOf("女子")>0){
                        game.nameH = game.nameH.replace("女子","").trim();
                    }

                    if(game.nameH.indexOf("预备队")>0){
                        game.nameH = game.nameH.replace("预备队","").trim();
                    }
                    if(game.nameH.indexOf("后备队")>0){
                        game.nameH = game.nameH.replace("后备队","").trim();
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

                    game.nameH = game.nameH.replace("-","").trim();
                }

                //客队
                if(game.nameG){
                    /*if(game.nameG.indexOf("(中)")>0){
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
                    }*/

                    if(game.nameG.indexOf("II")>0){
                        game.nameG = game.nameG.replace("II","").trim();
                    }

                    if(game.nameG.indexOf("-2")>0){
                        game.nameG = game.nameG.replace("-2","").trim();
                    }

                    if(game.nameG.indexOf("-3")>0){
                        game.nameG = game.nameG.replace("-3","").trim();
                    }

                    if(game.nameG.indexOf("U-")>0){
                        game.nameG = game.nameG.replace("U-","U").trim();
                    }

                    if(game.nameG.indexOf("女子")>0){
                        game.nameG = game.nameG.replace("女子","").trim();
                    }

                    if(game.nameG.indexOf("预备队")>0){
                        game.nameG = game.nameG.replace("预备队","").trim();
                    }

                    if(game.nameG.indexOf("后备队")>0){
                        game.nameG = game.nameG.replace("后备队","").trim();
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

                    game.nameG = game.nameG.replace("-","").trim();
                }

            }

         /*   let curData = {
                cmd:1,//事件类型
                game:{
                    nameG,//客队
                    nameH,//主队
                    leagueName,//联赛
                    mid,//比赛的mid
                },
                data:{
                    MID, //比赛的mid
                    CID,//1025 2049 1031 2055
                    EID,//事件Id
                    Info,//1025-Corner Home   2049-Corner Away
                           1031-Possible penalty Home  2055-Possible penalty Away
                    T,  //比赛时间  毫秒级别
                },
                curTime:new Date().getTime(),//当前时间
             };*/

            let CIDStr = {
                "1025":"Corner Home",
                "2049":"Corner Away",
                "1031":"Penalty Home",
                "2055":"Penalty Away"
            };
            if(data.T == -1){
                data.Info = CIDStr[data.CID+""];
            }
            if(!data.Info){
                ctx.body={
                    no:200,
                    msg:'格式错误',
                };
                return ;
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

    //大腿事件 cmd666
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
         //    "admin4002":1,
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


    //新的事件源处理

    ctx.body={
        no:200,
        msg:'发送成功',
    }
});



module.exports = router;
