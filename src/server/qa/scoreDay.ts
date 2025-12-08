// src/server/qa/scoreDay.ts
import { TransitSample } from "@/types/timing";
import { W } from "./scoring";

export function dayScoreJob(sample: TransitSample, ctx: { tenthHouse: number; tenthLord: Graha; mercRetro: boolean; jupTo10: boolean; satTo10: boolean; venAngle10: boolean; starOf10Lord: boolean; taraBad: boolean; }) {
  let s = 0;

  if (ctx.jupTo10) s += W.JUP_TO_10TH;
  if (ctx.venAngle10) s += W.VENUS_ANGLE_10TH;
  if (!ctx.mercRetro) s += W.MERC_DIRECT;
  if (ctx.satTo10) s += W.SATURN_PRESSURE_10TH;
  if (ctx.starOf10Lord) s += W.STAR_OF_10LORD;
  if (ctx.taraBad) s += W.TARA_BALA_BAD;

  return s;
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
