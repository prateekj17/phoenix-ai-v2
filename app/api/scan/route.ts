import {NextRequest,NextResponse} from 'next/server';
import {UNIVERSE} from '../../../lib/universe';import {getAnalysis} from '../../../lib/market';import {signal} from '../../../lib/signals';
export const runtime='nodejs';export const maxDuration=10;
export async function GET(req:NextRequest){const page=Number(req.nextUrl.searchParams.get('page')||'0');if(!Number.isInteger(page)||page<0||page>2)return NextResponse.json({error:'Invalid page'},{status:400});
 const symbols=UNIVERSE.slice(page*10,(page+1)*10);
 const results=await Promise.allSettled(symbols.map(s=>getAnalysis(s)));
 const success=results.flatMap((r,i)=>r.status==='fulfilled'?[{symbol:symbols[i],analysis:r.value}]:[]);
 const errors=results.flatMap((r,i)=>r.status==='rejected'?[{symbol:symbols[i],error:r.reason instanceof Error?r.reason.message:'Fetch failed'}]:[]);
 return NextResponse.json({page,totalPages:3,universeSize:UNIVERSE.length,coverage:'Curated 30-stock NSE sample, 10 symbols per page; not full-market',scanned:success.length,attempted:symbols.length,errors,asOf:new Date().toISOString(),swing:success.map(x=>signal(x.analysis,'swing')).sort((a,b)=>b.score-a.score),positional:success.map(x=>signal(x.analysis,'positional')).sort((a,b)=>b.score-a.score),provider:'Unofficial Yahoo Finance; no guaranteed real-time data'}, {headers:{'Cache-Control':'public, s-maxage=900, stale-while-revalidate=900'}});
}
