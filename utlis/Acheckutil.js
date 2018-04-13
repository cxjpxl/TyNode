
const {getHttps,get} = require('./utils');
var parseString = require('xml2js').parseString;
let START=86,END=100;
let CALLBACK;//回调方法
/***
* startTime: int|分钟数，发生球数变化时起始回调的时间
* endTime:int|分钟数,发生球数变化时终止回调的时间
* callback:function,发生事件的回调方法，(league,state,score1,score2,tm1,tm2,gametime)
*									联赛名字，{1:主队进球,0:客队进球},主队比分,客队比分,主队名字,客队名字,比赛进行的时间，目前
***/
function Init(startTime,endTime,callback){
	if(startTime!=null){START=startTime;}
	if(endTime!=null){END=endTime;}
	if(callback){CALLBACK=callback;}
	check();
}

async function check(){
	let allobj =await getAlldata();
	// console.log('all',allobj)
	setInterval(async ()=>{
		let obj =  await getAlldata();
		if(obj&&obj.A){
			allobj=obj;
		}
	},60*1000*10)//10分钟一次更新所有球队数据
	//定时调用更新数据
	setInterval(async ()=>{//获取有变化的球队数据
		await parse(allobj);
	},1000)//5s一次获取发生变化对应球队
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
					let state = getTeamChange(j,item);
					//判断输入要求的时间是否满足
					let minute = getTime(item[9]);
					j[5]=j[5].replace(/<\/?.+?>/g,"");
					j[8]=j[8].replace(/<\/?.+?>/g,"");
					//比分发生变化
					if(state.scorechange){
						//比赛比分发生变化
						console.log(`联赛：${j[2]}-产生进球 `);//比分发生变化-------: 
						console.log(`${j[5]}-${j[8]}::${j[14]}-${j[15]} 比赛进行时间：${j[13] == "1"?parseInt(minute):parseInt(minute)+45}`);
						if(state.score1change){
							//主队比分发生变化
							console.log(`主队进球：${j[5]}，比分为${j[14]}`)
							//上半场	   //下半场	
							if(j[13] == "1"||j[13] == "3"){
								if ((j[13] == "1"&&(minute<START||minute>END))|| (j[13] == "3"&&((minute+45)<START||(minute+45)>END))) {  
									console.log(`时间条件不满足:${START}~${END}\n`)
									break;
								}

								if(CALLBACK){
									CALLBACK(j[2],1,j[14],j[15],j[5],j[8])
								}
							}else{
								console.log('比赛时间异常\n')
							}
						}else if(state.score2change){
							//客队比分发生变化
							console.log(`客队进球：${j[8]}，比分为${j[15]}`)
							//上半场	   //下半场	
							if(j[13] == "1"||j[13] == "3"){
								if ((j[13] == "1"&&(minute<START||minute>END))|| (j[13] == "3"&&((minute+45)<START||(minute+45)>END))) {  
									console.log(`时间条件不满足:${START}~${END}\n`)
									break;
								}
								if(CALLBACK){
									CALLBACK(j[2],0,j[14],j[15],j[5],j[8])
								}
							}else{
								console.log('比赛时间异常\n')
							}
						}
						console.log(`\n`)
					}
					
					break;
				}
			}
		}
	}else{
		//if(!(data.c&&data.c.h))console.log('暂无更新的比赛');
	//	if(!(allobj && allobj.A))console.log('暂无比赛')
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
    	console.log('主old',aa[14])
    	console.log('主new',D[2])
        // 再判断，这个分数是加是减
        if(D[2]>aa[14])score1change = true;
        else{console.log(`这是一个错误事件，主队并没有进球\n`)}
        aa[14] = D[2];//先更新分数
    }
    if (aa[15] != D[3]) {
    	console.log('客--old',aa[15])
    	console.log('客--new',D[3])
        // 再判断，这个分数是加是减
        if(D[3]>aa[15])score2change = true;
        else{console.log(`这是一个错误事件，客队并没有进球\n`)}
        aa[15] = D[3];//先更新分数
    }
    scorechange=score1change||score2change;
    return {score1change,scorechange,score2change}
}

//获取改变
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
		},
	}
	return config[key];
}

// check()
module.exports=Init;

/**
D=[ '1486788',//球队id
  '3',
  '2',主队得分
  '1',客队得分
  '1',主队半场得分
  '1',客队半场得分
  '0',
  '0',
  '07:00',正式开始比赛时间
  '2018,3,1,08,04,29',//上下半场比赛开始时间
  '<a href=http://www.310tv.com/zhibo/saishizhibo11_1486788.html  target=_blank><font color=blue>310TV</font></a>',
  '1',
  '0',
  '1',
  '4-1',
  '',
  '9',主队角球数
  '1',客队角球数
  '1' ]
**/

// A[matchindex][11] != D[8] 开赛

//A= [ '1528164',
//   '#333398',
//   '澳威U20',
//   '澳威U20',
//   'AB U20 L',
//   '咸美顿奥林匹克U20',   							主队名字
//   '咸美頓奧林匹克U20',	 							主队名字 不同语言版本不同显示
//   'Hamilton Olympic U20',
//   '查尔斯顿市布鲁斯U20',  							客队名字
//   '查爾斯頓市布魯斯U20',
//   'Charlestown City Blues U20',
//   '17:00',
//   '2018,3,3,17,00,00',
//   '0',											//1上半场,3下半场
//   '0',											//主队比分15
//   '0',											//客队比分16
//   '',											//主队半场比分17
//   '',											//客队半场比分18
//   '0',
//   '0',
//   '0',
//   '0',
//   '',
//   '',
//   '0',
//   '0',
//   '',
//   '',
//   'True',
//   '2.25',//
//   '',
//   '',
//   '',
//   '',
//   '',
//   '',
//   '4-3',
//   '32290',
//   '32367',
//   '',
//   '49',
//   '0',
//   '',
//   '2018',
//   '1',
//   '1748',
//   '4.25',
//   '0',
//   '0',//主队角球数48
//   '0',//客队角球数49
//   '0',
//   '0',
//   '' ]
