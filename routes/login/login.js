/**
 * Created by cxj on 17-8-1.
 */
const router = require('koa-router')();
const User = require('../../models/User').User;


router.get('/time', async (ctx, next) => {
    ctx.body = {
        no:200,
        time:new Date().getTime(),
    };
});


function  addSaiName(key,value,data) {
    if (!data[key])
    {
        data[key]= value;
    }
}

router.get('/lianSai', async (ctx, next) => {
    let data = {};
     addSaiName("切禾", "基尔禾",data);
     addSaiName("洛达JC", "洛达",data);
     addSaiName("希尔克堡", "施克堡",data);
     addSaiName("阿蘭亞斯堡", "阿兰亚士邦",data);
     addSaiName("多瑙河鲁塞", "多恼",data);
     addSaiName("普夫迪夫火車頭", "普夫迪夫火车头",data);
     addSaiName("亚历山德里亚足球俱乐部", "阿拉卡森德里亚",data);
     addSaiName("圣塞瓦斯蒂安德洛斯雷耶斯", "圣瑟巴斯提安雷耶斯",data);
     addSaiName("伊布罗", "伊波罗",data);
     addSaiName("柯尼拉", "科诺拉",data);
     addSaiName("福门特拉", "福汶特拉",data);
     addSaiName("艾斯查", "艾西加",data);
     addSaiName("毕尔包", "毕尔巴鄂竞技",data);
     addSaiName("S.維尔瓦(女)", "斯波盯维尔瓦",data);
     addSaiName("格罗兹尼艾哈迈德 U21", "阿科马特 U21",data);
     addSaiName("阿韦亚内达竞赛俱乐部 (后)", "竞赛会",data);
     addSaiName("辛特侯逊", "桑德豪森",data);
     addSaiName("卡维哈拉", "科维拉",data);
     addSaiName("維多利亞柏林", "维多利亚柏林",data);
     addSaiName("纳普里达克克鲁舍瓦茨", "纳普里达克",data);
     addSaiName("阿里斯", "阿里斯塞萨洛尼基",data);
     addSaiName("潘塞拉高斯", "邦萨拉高斯",data);
     addSaiName("邦萨拉高斯", "喜百年",data);
     addSaiName("斯洛云布拉迪斯拉发", "斯洛云",data);
     addSaiName("侯布洛", "霍布罗",data);
     addSaiName("曼希恩", "曼海姆",data);
     addSaiName("济拉", "兹拉",data);
     addSaiName("尼菲治", "巴库尼菲治",data);
     addSaiName("Argentinos Juniors U20", "小阿根廷人",data);
     addSaiName("E.S.撒赫尔", "沙希尔",data);
     addSaiName("史法克斯", "斯法克斯",data);
     addSaiName("埃弗顿", "爱华顿",data);
     addSaiName("费伦迪纳", "费伦天拿",data);
     addSaiName("士柏 2013", "史帕尔",data);
     addSaiName("伊斯坦布尔", "伊斯坦堡希尔",data);
     addSaiName("阿莱森多里亚", "亚力山德利亚",data);
     addSaiName("蒙萨", "蒙扎",data);
     addSaiName("维迪比斯", "维泰贝斯卡",data);
     addSaiName("祖云斯达比亚", "祖华史塔比亚",data);
     addSaiName("清奈泰坦", "清奈因",data);
     addSaiName("艾里斯利馬斯素爾", "艾里斯",data);
     addSaiName("阿尔塔亚文布赖达", "塔亚文布莱达",data);
     addSaiName("伊蒂法克", "伊地法格",data);
     addSaiName("卢高", "卢戈",data);
     addSaiName("波根沙斯辛", "沙斯辛",data);
     addSaiName("维斯瓦克拉科夫", "克拉科夫",data);
     addSaiName("安东米度士", "亚图米图斯",data);
     addSaiName("利瓦迪亚高斯", "利云达高斯",data);
     addSaiName("伊安尼那", "基亚连拿",data);
     addSaiName("拉密亚", "拉米亚",data);
     addSaiName("艾路卡", "阿鲁卡",data);
     addSaiName("歷索斯", "雷克斯欧斯",data);
     addSaiName("歐力維倫斯", "奥利维伦斯",data);
     addSaiName("卡拉奥华", "CS卡拉奥华大学",data);
     addSaiName("马德里竞技", "马德里",data);
     addSaiName("洛桑競技", "洛桑体育",data);
     addSaiName("沃尔夫斯贝格", "禾夫斯堡",data);
     addSaiName("东孟加拉 U18", "翠鸟东孟加拉",data);
     addSaiName("United SC U18", "联竞技加尔各答",data);
     addSaiName("巴甘莫哈 U18", "莫亨巴根",data);
     addSaiName("托斯諾", "图斯諾",data);
     addSaiName("卡拉布基斯普", "卡拉布克士邦",data);
     addSaiName("布隆迪", "蒲隆地共和国",data);
     addSaiName("加巴拉PFC", "卡巴拉",data);
     addSaiName("南德阿美利加(后)", "苏阿美利加",data);
     addSaiName("罗比沙奇拉夏普尔", "海法罗比沙普拉",data);
     addSaiName("泊列勃理", "柏斯波利斯",data);
     addSaiName("桑納特纳夫特阿巴丹", "纳夫特",data);
     addSaiName("丹蒙迪谢赫", "贾马尔",data);
     addSaiName("尤文提度(后) ", "尤文都德彼德拉斯",data);
     addSaiName("保卫者队(后)", "德丰索体育队",data);
     addSaiName("沃伦塔里", "沃鲁塔瑞",data);
     addSaiName("菲伦斯", "费伦斯",data);
     addSaiName("托奧斯", "奧斯",data);
     addSaiName("史查福豪森", "沙夫豪森",data);
     addSaiName("马卡比特拉维夫", "特拉维夫马卡比",data);
     addSaiName("锡耶纳", "若布斯恩纳",data);
     addSaiName("赫罗纳", "基罗纳",data);
     addSaiName("桑塔马里纳", "坦迪尔",data);
     addSaiName("利伯泰德桑查尔斯", "利伯泰迪桑察勒斯",data);
     addSaiName("贝尔格拉诺体育", "斯伯迪沃贝尔格拉诺",data);
     addSaiName("貝爾格拉諾防衛隊若瑪羅", "贝尔格拉诺防卫队若玛罗",data);
     addSaiName("吉姆纳西亚", "甘拿斯亚康塞普森",data);
     addSaiName("卢多格德斯.拉兹格勒", "卢多格瑞特拉兹格勒",data);
     addSaiName("格罗兹尼艾哈迈德", "阿科马特",data);
     addSaiName("伊蒂哈德伊斯坎达利(中)", "伊蒂哈德亚历山大",data);
     addSaiName("阿富拉夏普爾", "阿福拉哈普尔",data);
     addSaiName("拉馬特甘夏普爾", "夏普尔拉马甘吉夫塔伊姆",data);
     addSaiName("克法尔萨巴哈普尔", "法萨巴夏普尔",data);
     addSaiName("RS拜尔坎", "贝尔卡勒",data);
     addSaiName("彼達迪華馬卡比", "彼达迪华马卡比",data);
     addSaiName("修咸顿 U23", "南安普敦",data);
     addSaiName("斯劳镇", "斯洛格镇",data);
     addSaiName("布萨斯堡", "柏萨士邦",data);
     addSaiName("亚丹纳斯堡", "艾丹拿斯堡",data);
     addSaiName("波卢斯堡", "布鲁斯堡",data);
     addSaiName("特拉布宗斯波尔", "特拉布宗",data);
     addSaiName("埃尔祖鲁姆士邦", "普野社希尔埃尔祖鲁姆士邦",data);
     addSaiName("甘美奧", "甘美奥RS",data);
     addSaiName("乔治罗尼亚比亚韦斯托克", "乔治罗尼亚",data);
     addSaiName("历基亚华沙", "历基亚",data);
     addSaiName("布雷达", "比达",data);
     addSaiName("阿雅克肖加泽莱克", "加泽莱克阿些斯奥",data);
     addSaiName("KAA真特", "真特",data);
     addSaiName("美因玆", "美因茨05",data);
     addSaiName("多蒙特", "多特蒙德",data);
     addSaiName("慕遜加柏", "门兴格拉德巴赫",data);
     addSaiName("尼切萨", "布鲁克贝特马利卡纳斯萨",data);
     addSaiName("斯拉斯克弗罗茨瓦夫", "斯拉斯克",data);
     addSaiName("阿卡格丁尼亚", "阿卡",data);
     addSaiName("伯恩利", "般尼",data);
     addSaiName("布莱克本流浪", "布力般流浪",data);
     addSaiName("卡莱尔", "卡素尔",data);
     addSaiName("埃克塞特", "艾斯特城",data);
     addSaiName("格兰森林", "格连森林",data);
     addSaiName("弗莱德", "菲尔德",data);
     addSaiName("坚士波罗", "真斯布洛治",data);
     addSaiName("乔利", "乔勒伊",data);
     addSaiName("波德诺内", "波代诺内",data);
     addSaiName("艾华尼斯", "恩华利斯",data);
     addSaiName("切尔西", "车路士",data);
     addSaiName("安格斯", "昂热",data);
     addSaiName("AL雷恩", "艾尔雷恩",data);
     addSaiName("USM 阿爾及爾", "USM阿尔格",data);
     addSaiName("大都會警察", "麦罗波利塔诺波利斯",data);
     addSaiName("格茨海德", "凯兹海得",data);
     addSaiName("托基聯", "托基联",data);
     addSaiName("福克斯顿", "佛克斯通",data);
     addSaiName("维森", "沃辛",data);
     addSaiName("Hanwell Town FC ", "汉威尔城",data);
     addSaiName("圣塔克莱拉", "辛达卡拉",data);
     addSaiName("埃尔维斯", "阿维斯",data);
     addSaiName("阿尔贾兹拉阿布扎比", "詹辛拉",data);
     addSaiName("列吉亚格但斯克", "列治亚",data);
     addSaiName("莱赫波茲南", "莱克",data);
     addSaiName("费内巴切", "费伦巴治",data);
     addSaiName("史特加", "斯图加特",data);
     addSaiName("艾比路內費", "艾宾奴列夫",data);
     addSaiName("克拉科维亚克拉科夫", "克拉科夫",data);
     addSaiName("桑德克亚", "桑德西亚",data);
     addSaiName("史浩克零四", "沙尔克04",data);
     addSaiName("阿巴甸", "阿伯丁",data);
     addSaiName("修咸顿", "南安普敦",data);
     addSaiName("李斯特城", "莱斯特城",data);
     addSaiName("史云斯", "斯旺西城",data);
     addSaiName("般尼茅夫", "伯恩茅斯",data);
     addSaiName("特尔斯", "托尔司",data);
    ctx.body = {
        no:200,
        data,
    };
});


//注册接口和修改接口
//参数　userName　　　valueTime
router.post('/register',async (ctx,next)=>{
    let body  = ctx.request.body;
    let userName  = body.userName;
    let valueTime = body.valueTime;
    if(!userName || !valueTime){
        ctx.body = {
            no:201,
            msg:'参数错误!',
        };
        return ;
    }


    if(typeof (valueTime) != "number"){
        ctx.body = {
            no:201,
            msg:'时间格式错误',
        };
        return ;
    }

    let msg = "注册成功";
    let user = await User.findOne({userName: userName}).exec();
    if(user){
        msg = "时间修改成功";
    }
    console.log(msg);
    await update(User,{userName : userName},{$set:{valueTime:valueTime}});
    ctx.body = {
        no:200,
        time:valueTime,
        msg:msg,
    };

});

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


//登录接口　 参数userName　comId
router.post('/login',async (ctx,next)=>{
    let body  = ctx.request.body;
    let userName  = body.userName;
    let comId = body.comId;
    if(!userName||!comId){
        ctx.body = {
            no:201,
            msg:'参数错误!',
        };
        return ;
    }

    let user = await User.findOne({userName: userName}).exec();
    if(!user) {
        ctx.body = {
            no:201,
            msg:'用户不存在!',
        };
        return ;
    }

    if(user.comId.length==0){
        //用户第一次注册后的登录
        await  update(User,{userName : userName},{$set:{
            comId:comId,
        }});
    }else  if(user.comId != comId){
        ctx.body = {
            no:201,
            msg:'只能在同一台电脑上面使用!',
        };
        return ;
    }


    let currentTime  = new Date().getTime();
    if(user.valueTime < currentTime){
        ctx.body = {
            no:201,
            msg:'已过期,请续费!',
        };
        return ;
    }

    ctx.body = {
        no:200,
        time:user.valueTime,
        msg:'登录成功!',
    };

});


//查询接口  参数userName
router.post('/queryUser',async (ctx,next)=>{
    let body  = ctx.request.body;
    let userName  = body.userName;
    if(!userName){
        ctx.body = {
            no:201,
            msg:'参数错误!',
        };
        return ;
    }

    let user = await User.findOne({userName: userName}).exec();
    if(!user) {
        ctx.body = {
            no:201,
            msg:'用户不存在!',
        };
        return ;
    }

    ctx.body = {
        no:200,
        msg:'成功!',
        user
    };

});


module.exports = router;
