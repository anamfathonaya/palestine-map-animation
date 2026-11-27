import json
from shapely.geometry import shape, mapping, box
from shapely.ops import unary_union
R='input/'
def load(f): return json.load(open(R+f+'.geojson'))['features']
REG=box(-5,2,72,50)  # region bbox for 10m detail
def feat(geom,props): return {'type':'Feature','properties':props,'geometry':mapping(geom)}
NAME_FIX={'Palestine':('Palestina','فلسطين')}
# --- 10m region countries (Palestine POV: Golan in Syria)
c10=load('ne_10m_admin_0_countries_pse')
reg=[];geoms={};props={}
for ft in c10:
    p=ft['properties'];g=shape(ft['geometry'])
    if not g.is_valid: g=g.buffer(0)
    geoms[p['ADM0_A3']]=g
    props[p['ADM0_A3']]={'a3':p['ADM0_A3'],'id':p['NAME_ID'],'ar':p['NAME_AR'],'lx':p['LABEL_X'],'ly':p['LABEL_Y'],'lr':p['LABELRANK']}
# --- ganti Gaza & Tepi Barat dengan batas OCHA (COD-AB) + rapikan tetangga
adm=json.load(open('input/pse_admin1.geojson'))['features']
oc={f['properties']['adm1_name']:shape(f['geometry']).buffer(0) for f in adm}
gaza,wb=oc['Gaza Strip'],oc['West Bank']; ocha=unary_union([gaza,wb])
landAll=unary_union([geoms[k] for k in ('ISR','PSX','EGY','JOR','SYR','LBN')])
coast=landAll.boundary
left=geoms['PSX'].difference(ocha)
from shapely.geometry import Polygon as _P
wedge=left.intersection(_P([(34.10,31.15),(34.262,31.15),(34.262,31.222),(34.235,31.3),(34.215,31.345),(34.10,31.40)])).buffer(0)
geoms['EGY']=geoms['EGY'].union(wedge).buffer(0); left=left.difference(wedge)
print('wedge rafah -> EGY', round(wedge.area*1e6,1))
give={'ISR':[], 'EGY':[], 'JOR':[]}; dropped=0
for p in getattr(left,'geoms',[left]):
    if p.area<1e-9: continue
    if p.centroid.x<34.7 and (p.buffer(1e-4).intersection(geoms['EGY']).area>1e-7 or p.distance(geoms['EGY'])<0.003): give['EGY'].append(p); continue
    if p.buffer(1e-5).intersects(coast) and p.centroid.x<34.7: dropped+=p.area; continue  # serpihan pantai Gaza -> laut
    best=max(give, key=lambda k: p.buffer(1e-4).intersection(geoms[k]).area)
    give[best].append(p)
for k in give: geoms[k]=unary_union([geoms[k].difference(ocha)]+give[k]).buffer(0)
geoms['PSX']=ocha
print('serpihan pantai dibuang (deg2):',round(dropped,6),{k:len(v) for k,v in give.items()})
pal48=unary_union([geoms['ISR'],geoms['PSX']]).buffer(0.0002).buffer(-0.0002)
for k,g in geoms.items():
    if not g.intersects(REG): continue
    gc=g.intersection(REG)
    if not gc.is_empty: reg.append(feat(gc,props[k]))
print('pal48',pal48.geom_type,round(pal48.area,4),'gaza',[round(v,3) for v in gaza.bounds],'wb',[round(v,3) for v in wb.bounds])
# golan
golan=None
for ft in load('ne_10m_admin_0_disputed_areas'):
    if ft['properties']['NAME']=='Golan Heights': golan=shape(ft['geometry']).buffer(0)
# lakes / rivers in region
lakes=[feat(shape(f['geometry']).buffer(0).intersection(REG),{'n':f['properties'].get('name')}) for f in load('ne_10m_lakes') if shape(f['geometry']).intersects(REG) and (f['properties'].get('scalerank') or 9)<=6]
riv=[]
for f in load('ne_10m_rivers_lake_centerlines'):
    p=f['properties'];g=shape(f['geometry'])
    if g.intersects(REG) and (p.get('scalerank') or 9)<=6: riv.append(feat(g.intersection(REG),{'n':p.get('name')}))
print('lakes',len(lakes),'rivers',len(riv),[l['properties']['n'] for l in lakes if l['properties']['n']][:40])
fc=lambda fs:{'type':'FeatureCollection','features':fs}
json.dump(fc(reg),open('build/reg_countries.json','w'))
json.dump(fc([feat(pal48,{'k':'pal48'})]),open('build/pal48.json','w'))
json.dump(fc([feat(gaza,{'k':'gaza'}),feat(wb,{'k':'wb'})]),open('build/psx.json','w'))
json.dump(fc([feat(golan,{'k':'golan'})]),open('build/golan.json','w'))
json.dump(fc(lakes),open('build/reg_lakes.json','w'))
import shapefile
rr=shapefile.Reader('input/oslo/OsloAgreement'); og={}
for sr in rr.shapeRecords(): og[sr.record['OBJECTID']]=shape(sr.shape.__geo_interface__).buffer(0)
cls={'A':[31,8],'B':[2,3],'C':[5,13,7],'EJ':[6]}
os_=[]
for k,ids in cls.items():
    gg=unary_union([og[i] for i in ids]).intersection(wb).buffer(0)
    os_.append(feat(gg,{'k':k})); print('oslo',k,round(gg.area*1e4,1))
json.dump(fc(os_),open('build/oslo.json','w'))
json.dump(fc(riv),open('build/reg_rivers.json','w'))
# --- 50m world, swap ISR/PSX/SYR with PSE 10m geometries
c50=load('ne_50m_admin_0_countries'); w=[]
for ft in c50:
    p=ft['properties']; a3=p['ADM0_A3']
    g=geoms[a3] if a3 in ('ISR','PSX','SYR') else shape(ft['geometry'])
    w.append(feat(g,{'a3':a3,'id':p['NAME_ID'],'ar':p['NAME_AR'],'lx':p['LABEL_X'],'ly':p['LABEL_Y'],'lr':p['LABELRANK']}))
json.dump(fc(w),open('build/w_countries.json','w'))
wl=[feat(shape(f['geometry']),{}) for f in load('ne_50m_lakes') if (f['properties'].get('scalerank') or 9)<=2]
json.dump(fc(wl),open('build/w_lakes.json','w'))
# --- places
pl=[]
for ft in load('ne_10m_populated_places'):
    p=ft['properties']; x,y=ft['geometry']['coordinates']
    if p.get('ADM0CAP')==1 or (p.get('SCALERANK',9)<=2 and -5<x<72 and 2<y<50):
        if p['SOV0NAME'] in ('Israel','Palestine') or p['NAME'] in ('Jerusalem','Tel Aviv'): continue
        pl.append({'id':p['NAME_ID'],'ar':p['NAME_AR'],'x':round(x,4),'y':round(y,4),'r':p['SCALERANK'],'cap':p['ADM0CAP'],'pop':p['POP_MAX'],'a3':p['ADM0_A3']})
json.dump(pl,open('build/places.json','w'),ensure_ascii=False)
print('places',len(pl))
