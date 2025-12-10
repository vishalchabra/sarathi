// src/server/qa/scoreDay.ts
import { TransitSample } from "@/types/timing";
import { W } from "./scoring";

export function dayScoreJob(
  sample: TransitSample,
  ctx: {
    tenthHouse: number;
    // use a simple string here instead of Graha to avoid missing type issues
    tenthLord: string;
    mercRetro: boolean;
    jupTo10: boolean;
    satTo10: boolean;
    venAngle10: boolean;
    starOf10Lord: boolean;
    taraBad: boolean;
  }
) {
  let s = 0;

  if (ctx.jupTo10) s += W.JUP_TO_10TH;
  // ...
}


export function smoothScores(scores: number[], win=7) {
  const out: number[] = [];
  for (let i=0;i<scores.length;i++){
    let sum=0,c=0;
    for (let k=Math.max(0,i-win+1); k<=i; k++){ sum+=scores[k]; c++; }
    out.push(sum/Math.max(1,c));
  }
  return out;
}
