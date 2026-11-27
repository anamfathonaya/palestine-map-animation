import fs from 'fs';
import {topology} from 'topojson-server';
import {presimplify, simplify, quantile} from 'topojson-simplify';
import {quantize} from 'topojson-client';
const r=f=>JSON.parse(fs.readFileSync('build/'+f+'.json'));
function mk(objs, q, minW){
  let t=topology(objs, 1e7);
  t=presimplify(t); t=simplify(t, minW); t=quantize(t, q);
  return t;
}
// region: weight in steradians-ish (planar degrees^2)
const reg=mk({countries:r('reg_countries'),pal48:r('pal48'),psx:r('psx'),golan:r('golan'),lakes:r('reg_lakes'),rivers:r('reg_rivers'),hatay:r('hatay'),sinai:r('sinai'),oslo:r('oslo'),un:r('un1947'),sp:r('sp1916'),g26:r('gaza2026')}, 2e5, +process.argv[2]||1e-6);
const world=mk({countries:r('w_countries'),lakes:r('w_lakes')}, 1e5, +process.argv[3]||5e-4);
fs.writeFileSync('build/reg.topo.json',JSON.stringify(reg));
fs.writeFileSync('build/world.topo.json',JSON.stringify(world));
console.log('reg',(JSON.stringify(reg).length/1024|0)+'KB','world',(JSON.stringify(world).length/1024|0)+'KB');
