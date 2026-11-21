type Base={symbol:string;company:string;last:number;asOf:string;score:number;change:number;indicators:Record<string,number|null>;volume:number;source:string;fetchedAt:string};
export type Horizon='swing'|'positional';
const r=(n:number)=>Math.round(n*100)/100;
export function signal(a:Base,h:Horizon){const i=a.indicators,price=a.last,atr=i.atr14,rv=i.relativeVolume,rsi=i.rsi14,s20=i.sma20,s50=i.sma50,s200=i.sma200;
 let score=a.score;
 if(h==='swing'){score+=rv!==null&&rv>=1.4?8:0;score+=rsi!==null&&rsi>75?-12:0;score+=price>(i.resistance??Infinity)?6:0;}
 else {score+=s200!==null&&price>s200?10:-12;score+=s50!==null&&s200!==null&&s50>s200?8:-8;score+=rv!==null&&rv>=1.5?2:0;}
 score=Math.max(0,Math.min(100,Math.round(score)));
 const valid=!!atr&&atr>0&&!!s50&&(h==='swing'||!!s200);
 const entryLow=r(price),entryHigh=r(price+(atr??0)*(h==='swing'?.25:.4));
 const stop=valid?r(Math.max(.01,price-(atr??0)*(h==='swing'?1.8:3))):null;
 const risk=stop!==null?price-stop:null;
 const target1=r(price+(risk??0)*2),target2=r(price+(risk??0)*3);
 const rr=stop!==null&&risk>0?2:null;
 const candleAge=Math.floor((Date.now()-Date.parse(a.asOf+'T00:00:00Z'))/86400000);
 const stale=candleAge>5||candleAge<0;
 const direction=score>=70?'BUY SETUP':score>=55?'WATCH':score>=38?'NEUTRAL':'AVOID';
 const status=!valid?'INSUFFICIENT DATA':stale?'STALE DATA':direction;
 const reasons=[`Technical composite ${a.score}/100`,`RSI ${rsi?.toFixed(1)??'N/A'}`,`Relative volume ${rv?.toFixed(2)??'N/A'}x`,h==='swing'?`20-day resistance ₹${i.resistance??'N/A'}`:`SMA 200 ₹${s200??'N/A'}`];
 return {symbol:a.symbol,company:a.company,last:price,change:a.change,asOf:a.asOf,score,status,horizon:h,entryLow:valid&&!stale?entryLow:null,entryHigh:valid&&!stale?entryHigh:null,stop:valid&&!stale?stop:null,target1:valid&&!stale?target1:null,target2:valid&&!stale?target2:null,rewardRisk:valid&&!stale?rr:null,relativeVolume:rv,rsi,source:a.source,reasons,warning:'Technical-only research signal; not a personalized recommendation. Entry uses last daily close, not an executable quote.'};
}
