import {analyze,Candle} from './analysis';
export async function getAnalysis(raw:string){
 const symbol=raw.toUpperCase().replace(/\.NS$/,'');
 if(!/^[A-Z0-9&._-]{1,24}$/.test(symbol))throw Error('Invalid ticker');
 const u=`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol+'.NS')}?range=2y&interval=1d`;
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),6500);
 try{const r=await fetch(u,{headers:{'User-Agent':'Mozilla/5.0','Accept':'application/json'},next:{revalidate:900},signal:controller.signal});
 if(!r.ok)throw Error('Provider HTTP '+r.status);
 const j=await r.json();const d=j.chart?.result?.[0];if(!d)throw Error('No price series');
 const q=d.indicators?.quote?.[0];if(!q)throw Error('No candle data');
 const candles:Candle[]=(d.timestamp||[]).map((t:number,i:number)=>({date:new Date(t*1000).toISOString().slice(0,10),open:q.open[i],high:q.high[i],low:q.low[i],close:q.close[i],volume:q.volume[i]})).filter((x:Candle)=>[x.open,x.high,x.low,x.close,x.volume].every(v=>typeof v==='number'&&Number.isFinite(v))&&x.close>0);
 return {symbol,company:d.meta?.longName||d.meta?.shortName||symbol,source:'Unofficial Yahoo Finance daily candles (may be delayed, blocked or adjusted)',fetchedAt:new Date().toISOString(),...analyze(candles)};
 }finally{clearTimeout(timer)}
}
