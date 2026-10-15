/* OBS OVERLAY · settings live in config.js
   Add as a Browser Source in OBS (size 1920x1080). The background is transparent.
   Click the source (Interact) or press Space / → for the next step, ← to go back, R to reload results.
   Options added to the address:
     ?auto=8        move on by itself: winner shown for 8 seconds, "And the winner is…" for 2.5 seconds
     ?cat=best-rpg  show only one category (its winner)
     ?bg=1          solid dark background (for testing in a normal browser)
     ?demo          fake results for a preview
*/
const {el,makeClient,configured,safeUrl}=PA;
const Q=new URLSearchParams(location.search),DEMO=Q.has('demo'),AUTO=+Q.get('auto')||0,ONLY=Q.get('cat');
if(Q.has('bg'))document.body.classList.add('bg');
const root=document.getElementById('o');
function say(m){root.innerHTML='';const p=el('div','panel');p.append(el('div','brand','PHANTOM AWARDS 2026'),el('div','msg',m));root.append(p);}
function medal(n){return el('span','medal m'+n,String(n));}

let cats=[],counts={},seq=[],ri=0,rs=0,timer=null;

async function load(){
  if(DEMO){
    cats=[['Game of the Year',['Resident Evil Requiem','Crimson Desert','Mina the Hollower','Pragmata']],['Best Boss Fight',['Saros','Mina the Hollower','Nioh 3']],['Best Soulslike',['Nioh 3','Code Vein II','Beast of Reincarnation']]]
      .map(([n,a],i)=>({id:'c'+i,name:n,noms:a.map((x,j)=>({id:i+'-'+j,name:x,img:null}))}));
    counts={};cats.forEach(c=>{counts[c.id]={};c.noms.forEach(n=>counts[c.id][n.id]=Math.floor(Math.random()*400)+20);});
  }else{
    if(!configured){say('Paste your Supabase URL and key into config.js');return false;}
    let sb;try{sb=makeClient({auth:{persistSession:false}});}catch(e){say(e.message);return false;}
    const [c,n,t]=await Promise.all([sb.from('categories').select('*').order('sort'),sb.from('nominees').select('*').order('sort'),sb.rpc('get_totals')]);
    if(c.error||n.error){say('Could not load: '+(c.error||n.error).message);return false;}
    cats=c.data.map(x=>({id:x.id,name:x.name,noms:n.data.filter(m=>m.category_id===x.id).map(m=>({id:m.id,name:m.name,img:m.image_url}))}));
    counts={};(t.data||[]).forEach(r=>{(counts[r.category_id]=counts[r.category_id]||{})[r.choice]=r.votes;});
  }
  seq=cats.filter(c=>{const v=counts[c.id];return v&&Object.keys(v).length;}).reverse();   // Game of the Year last
  if(ONLY)seq=seq.filter(c=>c.id===ONLY);
  if(!seq.length){say('Results are not revealed yet.');return false;}
  return true;
}
function rank(c){
  const cc=counts[c.id]||{},tot=Object.values(cc).reduce((a,b)=>a+b,0);
  return c.noms.map(n=>({n,v:cc[n.id]||0,pct:tot?Math.round((cc[n.id]||0)*100/tot):0})).sort((a,b)=>b.v-a.v);
}
function draw(){
  root.innerHTML='';const p=el('div','panel');root.append(p);
  if(ri>=seq.length){p.append(el('div','brand','PHANTOM AWARDS 2026'),el('div','msg','Thank you for voting!'));return;}
  const c=seq[ri],r=rank(c),w=r[0];
  p.append(el('div','brand','PHANTOM AWARDS 2026'),el('h2',0,c.name));
  if(rs===0){p.append(el('div','q','And the winner is…'));return;}
  if(w.n.img&&safeUrl(w.n.img)!=='#'){const im=el('img','img');im.src=w.n.img;im.alt='';im.referrerPolicy='no-referrer';im.onerror=()=>im.remove();p.append(im);}
  p.append(el('div','tagw','WINNER'),el('div','w',w.n.name),el('div','st',w.pct+'% · '+w.v+' votes'));
  const ru=r.slice(1,3).filter(x=>x.v>0);
  if(ru.length){const d=el('div','ru');ru.forEach((x,k)=>{const s=el('span');s.append(medal(k+2),document.createTextNode(x.n.name+' · '+x.pct+'%'));d.append(s);});p.append(d);}
}
function schedule(){
  clearTimeout(timer);
  if(!AUTO||ONLY&&rs===1||ri>=seq.length)return;
  timer=setTimeout(next,rs===0?2500:AUTO*1000);
}
function next(){
  if(ri>=seq.length)return;
  if(ONLY){rs=1;draw();return;}
  if(rs===0)rs=1;else{rs=0;ri++;}
  draw();schedule();
}
function prev(){clearTimeout(timer);if(rs===1)rs=0;else if(ri>0){ri--;rs=1;}draw();}
document.addEventListener('keydown',e=>{
  if(e.key===' '||e.key==='ArrowRight'){e.preventDefault();next();}
  else if(e.key==='ArrowLeft')prev();
  else if(e.key==='r'||e.key==='R')start();
});
document.addEventListener('click',next);
async function start(){clearTimeout(timer);ri=0;rs=ONLY?1:0;if(await load()){draw();schedule();}}
(document.fonts?document.fonts.ready:Promise.resolve()).then(start);
