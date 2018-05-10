/**
*   打印动态数据
**/
function print(dp){
    let x='';
    if(dp[0]&&dp[0]){
        for(let i in dp[0]){
            x+=`${i},`
        }
    }
    console.log('-',x.substring(0,x.length-1))
    for(let i in dp){
        console.log(i+'.',JSON.stringify(dp[i]));
    }
}
/*******************************************
 			最长公共子串 DP方案 
 *******************************************/
function LCS_dp( X, Y)
{
    let maxlen=0,maxindex = 0;
    let dp=[];//生成动态二级数组
    let xp =0,yp=0;//坐标位置
    for(let i = 0; i < X.length; ++i)
    {
    	if(!dp[i])dp[i]=[];//构建数组
        for(let j = 0; j < Y.length; ++j)
        {
            if(X[i] == Y[j])
            {
                if(i && j)
                {
                    dp[i][j] = dp[i-1][j-1] + 1;
                }
                if(i == 0 || j == 0)
                {
                    dp[i][j] = 1;
                }
                if(dp[i][j] >= maxlen)
                {
                    maxlen = dp[i][j];
                    maxindex = i + 1 - maxlen;
                    xp = i+ 1-maxlen;
                    yp = j+ 1-maxlen;
                }
            }else{
            	dp[i][j]=0;
            }
        }
    }
    // console.log('maxlen',maxlen,maxlen/X.length,maxlen/.length)
    // console.log('dp',maxlen,maxindex,same,xp,yp)
    // print(dp);
    let radio=0;
    if(X.length<Y.length){
    	radio=maxlen/X.length;
    }else{
    	radio=maxlen/Y.length;
    }
    // console.log()
    return radio;
}

/*******************************************
 			最长公共子序列 DP方案 
 *******************************************/
function LCS_seridp(X,Y)
{
    // console.log('------')
    
    let maxlen=0,maxindex = 0;
    let dp=[];//生成动态二级数组
    let xp =0,yp=0;//坐标位置
    for(let i = 0; i < X.length; ++i)
    {
    	if(!dp[i])dp[i]=[];//构建数组
        for(let j = 0; j < Y.length; ++j)
        {
        	// console.log('dp[i-1][j]',dp[i-1][j],dp[i][j-1])
            if(X[i] == Y[j])
            {
                if(i && j){
                    dp[i][j] = dp[i-1][j-1] + 1;
                }
                if(i == 0 || j == 0){
                    dp[i][j] = 1;
                }
                if(dp[i][j] >= maxlen){
                    maxlen = dp[i][j];
                    maxindex = i + 1 - maxlen;
                    xp = i+ 1-maxlen;
                    yp = j+ 1-maxlen;
                }
            }else if(i == 0 || j == 0){
            	if(i==0&&j>0){
            		dp[i][j]=dp[i][j-1];
            	}else if(i>0&&j==0){
            		dp[i][j]=dp[i-1][j];
            	}else{
                	dp[i][j] = 0;
            	}
            }else if(dp[i-1][j] >= dp[i][j-1]){  
                dp[i][j] = dp[i-1][j];  
            }else{  
                dp[i][j] = dp[i][j-1];  
            }  
        }
    }
    // print(dp);
    let radio=0;
    if(X.length<Y.length){
    	radio=maxlen/X.length;
    }else{
    	radio=maxlen/Y.length;
    }
    // console.log('aaaaaa',radio)
    return radio
}
exports.LCS_seridp=LCS_seridp;
exports.LCS_dp=LCS_dp;
