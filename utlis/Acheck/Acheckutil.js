var S = require("simplebig");
const {getHttps,get} = require('./utils');
const {LCS_seridp,LCS_dp}=require('./lcs');
var parseString = require('xml2js').parseString;
let START=1,END=100;
let CALLBACK;//回调方法
/***
 * startTime: int|分钟数，发生球数变化时起始回调的时间
 * endTime:int|分钟数,发生球数变化时终止回调的时间
 * callback:function,发生事件的回调方法，(league,state,score1,score2,tm1,tm2,gametime)
 *									联赛名字，{1:主队进球,0:客队进球},主队比分,客队比分,主队名字,客队名字,比赛进行的时间
 ***/
function Init(startTime,endTime,callback){
    if(startTime!=null){START=startTime;}
    if(endTime!=null){END=endTime;}
    if(callback){CALLBACK=callback;}
    check();
}
async function check(){
    let allobj =await getAlldata();
    await getAdata();
    // console.log('aDATA',ADATA)
    // console.log('all',allobj)
    setInterval(async ()=>{
        let obj =  await getAlldata();
        if(obj&&obj.A){
            allobj=obj;
        }
    },60*1000*5)//5分钟一次更新所有球队数据
    //定时调用更新数据
    setInterval(async ()=>{//获取有变化的球队数据
        await parse(allobj);
    },5000)//5s一次获取发生变化对应球队

    setInterval(async ()=>{//
        await getAdata();//获取更新正在比赛的数据
    },50*1000)//1min一次获取发生变化对应球
}

async function parse(allobj){
    let {err,data} = await getchangedata();
    // console.log('data',data)
    // return;
    if(data&&data.c&&data.c.h&&allobj.A){
        for(let i of data.c.h){
            let item = i.split('^');
            // console.log('item', allobj.A[0])
            for(let j of allobj.A){
                if(j&&j[0]==item[0]){
                    //判断比分是否有变化
                    let {scorechange,score1change,score2change} = getTeamChange(j,item);
                    //判断输入要求的时间是否满足
                    let minute = getTime(item[9]);
                    j[2]=j[2].replace(/<\/?.+?>/g,"");
                    j[3]=j[3].replace(/<\/?.+?>/g,"");
                    j[5]=j[5].replace(/<\/?.+?>/g,"");
                    j[6]=j[6].replace(/<\/?.+?>/g,"");
                    j[8]=j[8].replace(/<\/?.+?>/g,"");
                    j[9]=j[9].replace(/<\/?.+?>/g,"");
                    //比分发生变化
                    if(!scorechange){
                        continue;
                    }
                    // console.log('jjjjj',j)
                    // if(j[13]=='0'||j[13]=='2')console.log('j...',ADATA)
                    //比赛比分发生变化 j[13]  0,1表示上半场，2,3表示下半场；0表示上半场刚刚开始，2表示下半场刚刚开始
                    //console.log(`联赛：${j[2]}-产生进球 `);//比分发生变化-------:
                    let time =  `${(j[13] == "1"||j[13]=='0')?parseInt(minute):parseInt(minute)+45}`;//比赛进行时间
                  //  console.log(`${j[5]}-${j[8]}::${j[14]}-${j[15]} 比赛进行时间：${time}`);
                    //主队或客队比分发生变化
                  //  console.log(`${score1change?'主队':"客队"}进球：${score1change?j[5]:j[8]}，比分为${score1change?j[14]:j[15]}`)
                    //上半场	   //下半场
                    if(/[0123]/.test(j[13])){
                        // console.log('进来。。。')
                        //0,2为上下半场比赛刚刚开始的时间,这个可以不再考虑范围内
                        if (time<START||time>END) {
                        //    console.log(`时间条件不满足:${START}~${END}\n`)
                            break;
                        }
                        //callback之前先匹配一下球队,用A系统的比赛球队来返回
                        let obj = checkParams(j,time,score1change?1:0);
                        // console.log('结果----',obj)
                        let master=j[5],guest=j[8],mname=j[2],isMasterIn=(score1change?1:0)
                        mscore=j[14],gscore=j[15];
                        if(obj){
                            mname=obj.Match_Name;
                            master=obj.Match_Master;
                            guest=obj.Match_Guest;
                            if(!obj.direct){//发生球队显示反向
                                isMasterIn=(score1change?0:1);
                            }
                            if(!obj.direct){
                                let t = gscore;
                                gscore=mscore;
                                mscore=t;
                            }

                        }
                       // console.log('--------',mname,isMasterIn,mscore,gscore,master,guest,time)
                        if(obj&&!obj.direct){
                         //   console.log(`-----网站球队方向与A系统的球队方向相反-----`)
                        }
                        obj&&CALLBACK&&CALLBACK(mname,isMasterIn,mscore,gscore,master,guest,time);
                    }
                 //   console.log(`\n`)
                    break;
                }
            }
        }
    }else{
        // if(!(data.c&&data.c.h))console.log('暂无更新的比赛');
        // if(!(allobj && allobj.A))console.log('暂无比赛')
    }
}

//获取开赛时间
function getTime(str){
    let arr = str.split(',');
    let date = new Date(arr[0],arr[1],arr[2],arr[3],arr[4],arr[5]);
    let nowt = Date.now()-date.getTime();
    // console.log('nowt',nowt/1000/60);
    return nowt/1000/60;
}

//A 就是获取所有的比赛
//D 获取到变化的比赛
// 获取比赛内容变化
function getTeamChange(aa,D){
    let score1change = false,score2change = false,scorechange;
    //1、存在网站数据得分加错的时候，或者突然加到某个球队，然后突然扣除
    //2、网站认为进球了，事实上并没有
    if (aa[14] != D[2]) {
        // console.log('主old',aa[14])
        // console.log('主new',D[2])
        // 再判断，这个分数是加是减
        if(D[2]>aa[14])score1change = true;
        else{console.log(`这是一个错误事件，主队并没有进球\n`)}
        aa[14] = D[2];//先更新分数
    }
    if (aa[15] != D[3]) {
        // console.log('客--old',aa[15])
        // console.log('客--new',D[3])
        // 再判断，这个分数是加是减
        if(D[3]>aa[15])score2change = true;
        else{console.log(`这是一个错误事件，客队并没有进球\n`)}
        aa[15] = D[3];//先更新分数
    }
    scorechange=score1change||score2change;
    return {score1change,scorechange,score2change}
}

/**
 *	获取A网正在进行的比赛
 **/
async function getAdata(){
    let adata = [];
    for(let item in AUrlList){
        let page=1;
        while(true){
            let config = getAconfig(item,page);
            let data = await get(config);
            try{
                let tt=data.data;
                if(typeof tt != 'object'){
                    tt = JSON.parse(data.data);
                }
                //数据格式转换，以及数据赋值
                switch(tt.db.constructor){
                    case Array:
                        adata=adata.concat(tt.db);
                        break;
                    case Object:
                        let td = [];
                        for(let i in tt.db){
                            td.push(tt.db[i]);
                        }
                        adata=adata.concat(td);
                        break;
                }
                if(tt.page&&tt.page>page){page++;}
                else{break;}
            }catch(err){
                page++;
                if(page>10){
                    break;
                }
            }
        }
        //有效赋值
        if(adata&&adata.length>0){
            ADATA=adata;
            break;
        }else{
            adata=[];
        }
    }
}

let ADATA = null;//缓存A网的球队数据
//测试样例
// let {tt,ADATA} = require('./data1');
function runtest(){
    let score1change=true,j=tt,time=38;
    let obj = checkParams(j,time,score1change?1:0)
    // console.log('aa',obj)
    let master=j[5],guest=j[8],mname=j[2],isMasterIn=(score1change?1:0),
        mscore=j[14],gscore=j[15];
    if(obj){
        mname=obj.Match_Name;
        master=obj.Match_Master;
        guest=obj.Match_Guest;
        if(!obj.direct){//发生球队显示反向
            isMasterIn=(score1change?0:1);
        }
        if(!obj.direct){
            let t = gscore;
            gscore=mscore;
            mscore=t;
        }

    }
    // console.log('结果----',obj)
    // console.log('--------',mname,isMasterIn,mscore,gscore,master,guest,time)
    if(obj&&!obj.direct){
     //   console.log(`网站球队方向与A系统的球队方向相反`)
    }
}
// runtest()
/**
 * 	time String 比赛进行的分钟数
 *	j Object 获取网络球数更新时
 *	state int 1:主队进球,0:客队进球
 ***/
function checkParams(j,time,state){
    let obj={radio:[0,0,0]},targetArr=[];
    // console.log('ADATAADATA',ADATA)

    if(ADATA){
        for(let item in ADATA){
            //第一种存在完全相同的情况
            let it=ADATA[item];
            // console.log('ADATA.db[item]',item,it);

            // if(j[5]==it.Match_Master||j[6]==it.Match_Master||j[8]==it.Match_Guest||j[9]==it.Match_Guest){
            // 	setparams(it);
            // 	break;
            // }else{
            //名字匹配，1、联赛名字匹配可能不同；2、球队名字可能也不是相同；3、匹配时间
            //时间
            try{
                let date = parseInt(it.Match_Date);
                // console.log('time',time,date,it.Match_Master)
                //第一：比赛时间要对应
                if(date-time>2||date-time<-2){//允许2分钟误差内，再去比较
                    continue;
                }
                // console.log('比赛获取时间----:',date,'预测时间：',time,it.Match_Master)
                let scorem=j[14],scoreg=j[15];
                try{
                    if(state){scorem=parseInt(scorem)-1;}
                    else{scoreg=parseInt(scoreg)-1;}
                }catch(e){}
                // console.log('主队',j[5],j[6],scorem)
                // console.log('客队',j[8],j[9],scoreg)
                // console.log('对应主客队名字',it.Match_Master,it.Match_Guest)
                //第二：比分不相等时，
                //1、假设主队客队方向相同时
                if(it.Match_NowScore==`${scorem}:${scoreg}`){
                    DEBUG&& console.log('假设主队客队方向相同时')
                    let aa = getRadio(j,it,true);
                    if(aa.obj){targetArr.push(aa);}
                }else if(it.Match_NowScore==`${scoreg}:${scorem}`){
                    //2、主队、客队与A系统的位置相反
                    DEBUG&& console.log('主队、客队与A系统的位置相反')
                    let aa = getRadio(j,it,false);
                    if(aa.obj){targetArr.push(aa);}
                }else{
                    // console.log(`系统网站比分：${it.Match_NowScore},获取更新网站比分：${scorem}-${scoreg}`)
                }
            }catch(err){
                //进入半场
                console.log('err',err)
            }
            // }
        }
    }
    // console.log('targetArr:最后输出结果',targetArr)
    //最后筛选出匹配率最高的
    if(targetArr&&targetArr.length>0){
        let radio =0,position=0;
        for(let item of targetArr){
            obj=getTeamRadio(obj,item);
        }
    }
 //   console.log('结果：',obj)
    return obj.obj;
}
//获取两个匹配中较大的一个
//匹配到100%不一定代表球队就是一样，可能某些球队的名字刚好包含了这个内容
function getTeamRadio(obj1,obj2){
    let radio1=obj1.radio,radio2=obj2.radio,obj;
    //
    if(radio1[0]+radio1[1]>radio2[0]+radio2[1]){
        obj=obj1;
    }else{
        obj=obj2;
    }
    return obj;

}
let DEBUG=false;
//获取2支队伍的匹配率
function getRadio(j,it,direct){
    //接着匹配球队
    //简体、繁体都要 m主队，g客队
    let radioparams=[],obj,radio,radio1,radio2;
    /**************先正向假设球队方向一致**************/
    if(direct){
        //主队与主队
        radio1 = getR(S.t2s(j[5]),it.Match_Master);//简体匹配
        DEBUG&&console.log('主队-主队匹配率',radio1,S.t2s(j[5]),it.Match_Master);
        radio2 = getR(S.t2s(j[6]),it.Match_Master);//繁体转简体匹配
        DEBUG&&console.log('主队-主队繁体匹配率',radio2,S.t2s(j[6]),it.Match_Master)
        radioparams[0]=radio1>radio2?radio1:radio2;
        //客队与客队
        radio1 = getR(S.t2s(j[8]),it.Match_Guest);//简体匹配
        DEBUG&&console.log('客队-客队匹配率',radio1,S.t2s(j[8]),it.Match_Guest)
        radio2 = getR(S.t2s(j[9]),it.Match_Guest);//繁体转简体匹配
        DEBUG&&console.log('客队-客队繁体匹配率',radio2,S.t2s(j[9]),it.Match_Guest)
        radioparams[1]=radio1>radio2?radio1:radio2;
    }else{
        /**************反向假设球队方向相反**************/
        //主队与客队
        radio1 = getR(S.t2s(j[5]),it.Match_Guest);//简体匹配
        DEBUG&&radio1&&console.log('主队-客队匹配率',radio1,S.t2s(j[5]),it.Match_Guest)
        radio2 = getR(S.t2s(j[6]),it.Match_Guest);//繁体转简体匹配
        DEBUG&&radio2 &&console.log('主队-客队繁体匹配率',radio2,S.t2s(j[6]),it.Match_Guest);
        radioparams[0]=radio1>radio2?radio1:radio2;
        //客队与主队
        radio1 = getR(S.t2s(j[8]),it.Match_Master);//简体匹配
        DEBUG&&radio1&&console.log('客队-主队匹配率',radio1,S.t2s(j[8]),it.Match_Master);
        radio2 = getR(S.t2s(j[9]),it.Match_Master);//繁体转简体匹配
        DEBUG&&radio2&&console.log('客队-主队繁体匹配率',radio2,S.t2s(j[9]),it.Match_Master);
        radioparams[1]=radio1>radio2?radio1:radio2;
    }
    //联赛匹配率
    radio1= getR(S.t2s(j[2]),it.Match_Name);//繁体转简体匹配
    DEBUG&&console.log('联赛匹配率：',radio1,S.t2s(j[2]),it.Match_Name)
    radio2= getR(S.t2s(j[3]),it.Match_Name);//繁体转简体匹配
    DEBUG&&console.log('联赛繁体匹配率：',radio2,S.t2s(j[3]),it.Match_Name)
    radioparams[2]=radio1>radio2?radio1:radio2;
    // radioparams = radioparams.sort();
    //相似度大于60的要记一下
    //1、主客队识别率的和要超过1.1
    //2、联赛匹配率要超过0.45
    //2、主客队匹配率要超过0.6
    //
    if((radioparams[0]+radioparams[1]>1.1)&&(radioparams[0]>0.6||radioparams[1]>0.6)&&radioparams[2]>0.45){//
        //这个匹配可以视为有
        obj=setparams(it,direct);
        console.log('可以认为是有效的匹配：',radioparams,obj);
    }
    return {radio:radioparams,obj};
}
function getR(str1,str2){
    let radio = LCS_seridp(str1,str2)
    if(str2.indexOf('角球')!=-1){
        radio=0;
    }
    return radio;
}

/**
 设置参数
 **/
function setparams(it,direct){
    let obj={};
    obj.Match_Name=it.Match_Name;
    obj.Match_Master=it.Match_Master;
    obj.Match_Guest=it.Match_Guest;
    obj.direct=direct;
    return obj;
}

//获取改变的数据
async function getchangedata(){
    let change = getconfig('change');
    let ch = await get(change);
    return new Promise((resolve,reject)=>{
        if(ch.status==200){
            parseString(ch.data,  (err, result)=>{
                if(err)resolve({err});
                // console.dir(result);
                resolve({data:result});
            });
        }
    })
}

/**
 获取全部，包括更新球队数据，网站是每30分钟/次
 本地变更为10分钟获取一次
 **/
async function getAlldata(){
    let change = getconfig('bfdata');
    let ch = await get(change);
    if(ch.status==200){
        try{
            //获取所有的数据
            eval(ch.data)

        }catch(err){
        }
    }
    try{
        return {A}
    }catch(err){
        return {}
    }
}

/**
 *		获取请求配置文件
 **/
function getconfig(key){
    let URL = "http://live.titan007.com";

    let headers = {
        Host:URL.replace(/^http[s]?:\/\//,''),
        Connection:'keep-alive',
        'Upgrade-Insecure-Requests':1,
        'Cache-Control':"max-age=0",
        Referer:URL,
        'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36"
    }
    let config = {
        change:{
            method:'GET',
            url:URL,
            path:`/vbsxml/change.xml?r=007${Date.now()}`,
            headers:headers
        },
        time:{
            method:'GET',
            url:URL,
            path:`/vbsxml/time.txt?r=007${Date.now()}`,
            headers:headers
        },
        chglobal:{
            method:'GET',
            url:URL,
            path:`/vbsxml/ch_goalBf3.xml?r=007${Date.now()}`,
            headers:headers
        },
        bfdata:{
            method:'GET',
            url:URL,
            path:`/vbsxml/bfdata.js?r=007${Date.now()}`,
            headers:headers
        }
    }
    return config[key];
}

//获取获取网站的配置
let AUrlList=['http://www.424680.com','http://www.9920333.com','http://www.083m.com','http://www.pj66692.com','http://www.ml598.com','http://www.2764n.com'];
function getAconfig(index,page){
    index=(index==null?0:(index>=AUrlList.length?AUrlList.length-1:index));
    let headers = {
        Host:AUrlList[index].replace(/^http[s]?:\/\//,''),
        Connection:'keep-alive',
        'Upgrade-Insecure-Requests':1,
        'Cache-Control':"max-age=0",
        Referer:AUrlList[index],
        'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36"
    }
    let Adata={
        method:'POST',
        url:AUrlList[index],
        path:`/index.php/sports/Match/FootballPlaying/?t=${Math.random()}`,
        headers:headers,
        params:{
            p: page,
            oddpk: 'H',
            leg: ''
        }
    }
    return Adata;
}




check();
module.exports=Init;