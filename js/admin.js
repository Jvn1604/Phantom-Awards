// Phantom Awards · admin dashboard. Settings live in config.js.
// Never show the admin inside another website's frame (clickjacking protection; GitHub Pages cannot send frame headers).
if(window.top!==window.self){document.documentElement.innerHTML='';throw new Error('admin.html cannot be framed');}
// Starter list: only used by the "Import default list" button (one time). After that you edit everything inside this admin page.
const DEFAULTS=[
["Game of the Year","Resident Evil Requiem|Crimson Desert|Mina the Hollower|Forza Horizon 6|Pragmata|007 First Light"],
["Best Game Direction","Mina the Hollower|Pragmata|007 First Light|Saros"],
["Best Narrative","007 First Light|Mixtape|Esoteric Ebb|Romeo Is a Dead Man"],
["Best Art Direction","Mina the Hollower|MOUSE: P.I. For Hire|Mixtape|Romeo Is a Dead Man"],
["Best Visual Design","Pragmata|Forza Horizon 6|Crimson Desert|Resident Evil Requiem"],
["Best Score and Music","Mixtape|Vampire Crawlers|Rhythm Heaven Groove|Mina the Hollower"],
["Best Audio Design","Resident Evil Requiem|Saros|Marathon|Pragmata"],
["Best Performance","007 First Light|Resident Evil Requiem|Saros|Romeo Is a Dead Man"],
["Innovation in Accessibility","Nominee A|Nominee B|Nominee C|Nominee D"],
["Games for Impact","Nominee A|Nominee B|Nominee C|Nominee D"],
["Best Ongoing","Fortnite|Helldivers 2|No Man's Sky|Diablo 4: Lord of Hatred"],
["Best Community Support","Helldivers 2|No Man's Sky|Fortnite|Valheim"],
["Best Independent Game","Mina the Hollower|Mewgenics|Cairn|Big Walk"],
["Best Debut Indie Game","Esoteric Ebb|Wax Heads|Love Eternal|Creature Kitchen"],
["Best Mobile Game","Nominee A|Nominee B|Nominee C|Nominee D"],
["Best VR / AR","Nominee A|Nominee B|Nominee C|Nominee D"],
["Best Action Game","Pragmata|Saros|Nioh 3|Romeo Is a Dead Man"],
["Best Action / Adventure","007 First Light|Mina the Hollower|Crimson Desert|Resident Evil Requiem"],
["Best RPG","Crimson Desert|The Blood of Dawnwalker|Fire Emblem: Fortune's Weave|Trails in the Sky 2nd Chapter"],
["Best Fighting","Marvel Tokon: Fighting Souls|2XKO|Nominee C|Nominee D"],
["Best Family","Star Fox|Big Hops|Splatoon Raiders|Rhythm Heaven Groove"],
["Best Remake / Remaster","Nominee A|Nominee B|Nominee C|Nominee D"],
["Best Sim / Strategy","Mewgenics|Pokémon Pokopia|Creature Kitchen|Fire Emblem: Fortune's Weave"],
["Best Sports / Racing","Forza Horizon 6|Nominee B|Nominee C|Nominee D"],
["Best Multiplayer","Marathon|2XKO|Marvel Tokon: Fighting Souls|Big Walk"],
["Best Adaptation","Nominee A|Nominee B|Nominee C|Nominee D"],
["Most Anticipated Game","Grand Theft Auto VI|Marvel's Wolverine|The Duskbloods|Lords of the Fallen II"],
["Content Creator of the Year","Creator A|Creator B|Creator C|Creator D"],
["Best Esports Game","Counter-Strike 2|League of Legends|Valorant|Dota 2"],
["Best Esports Athlete","Athlete A|Athlete B|Athlete C|Athlete D"],
["Best Esports Team","Team A|Team B|Team C|Team D"],
["Best Hidden Gem","TR-49|Wax Heads|Esoteric Ebb|Lost and Found Co."],
["Best Boss Fight","Nioh 3|Mina the Hollower|Saros|Resident Evil Requiem"],
["Hardest Game","Nioh 3|Beast of Reincarnation|Mortal Shell II|Code Vein II"],
["Best Co-op Game","Big Walk|Nominee B|Nominee C|Nominee D"],
["Best Roguelike","Mewgenics|Vampire Crawlers|Nominee C|Nominee D"],
["Best Soulslike","Nioh 3|Code Vein II|Beast of Reincarnation|Mortal Shell II"],
["Best Horror","Resident Evil Requiem|Love Eternal|Nominee C|Nominee D"],
["Best Open World","Crimson Desert|Forza Horizon 6|Nioh 3|The Blood of Dawnwalker"],
["Best Platformer","Big Hops|Love Eternal|Cairn|Nominee D"],
["Best Character","Mina (Mina the Hollower)|James Bond (007 First Light)|Leon S. Kennedy (Resident Evil Requiem)|Nominee D"],
["Best Villain","Villain A|Villain B|Villain C|Villain D"],
["Best Trailer","Trailer A|Trailer B|Trailer C|Trailer D"],
["Best PC Port","Nominee A|Nominee B|Nominee C|Nominee D"],
["Best Value for Money","TR-49|Mewgenics|Vampire Crawlers|Valheim"]
].map(c=>({id:c[0].toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),name:c[0],noms:c[1].split("|")}));
const app=document.getElementById('app'),$=id=>document.getElementById(id);
const {el,icon,withIcon,safeUrl}=PA;
let sb=null,CFGERR='';
try{sb=PA.makeClient({auth:{storageKey:'phantom-admin-auth'}});}catch(e){CFGERR=e.message;}
if(typeof Chart!=='undefined'){Chart.defaults.color='#cbbcf0';Chart.defaults.borderColor='rgba(168,85,247,.16)';Chart.defaults.font.family="Inter,system-ui,sans-serif";}
function fail(m){app.innerHTML='';const c=el('div','card auth');c.append(icon('alert','big red'),el('h1',0,'Admin cannot start'),el('p','note',m));app.append(c);}
window.addEventListener('error',e=>{if(!sb||!document.getElementById('tabs'))fail('Script error: '+e.message);else toast('Script error: '+e.message);});

const PAL=['#a855f7','#f5c542','#22d3ee','#f472b6','#34d399','#fb923c','#818cf8','#e9d5ff'];
let CATS=[],NM={},T={},ov=null,cfg=null,sel=null,unknown=0,charts={},timer=null,tab='overview',filter='';
const openSet=new Set();let VOT=[],COLLABS=[],revealAll=false;
const sum=o=>Object.values(o||{}).reduce((a,b)=>a+b,0);
const toast=m=>{const s=$('status');if(s)s.textContent=m;};

function standing(c){
  const rows=c.noms.map(n=>({n,v:(T[c.id]||{})[n.id]||0})).sort((a,b)=>b.v-a.v);
  const total=rows.reduce((a,r)=>a+r.v,0),top=rows[0]?rows[0].v:0,second=rows[1]?rows[1].v:0;
  const leaders=top>0?rows.filter(r=>r.v===top).map(r=>r.n):[];
  return {rows,total,top,lead:top-second,leadPct:total?(top-second)*100/total:0,leaders,tie:leaders.length>1};
}
function mk(id,conf){
  if(typeof Chart==='undefined'){toast('Charts library did not load (ad-blocker?). Numbers and tables still work.');return;}
  conf.options=Object.assign({responsive:true,maintainAspectRatio:false,resizeDelay:150},conf.options||{});
  const old=charts[id];
  if(old&&old.config.type===conf.type){old.data=conf.data;old.options=conf.options;old.update('none');return;}
  if(old)old.destroy();
  charts[id]=new Chart($(id),conf);
}
function fillTable(tb,rows,cls){
  tb.innerHTML='';
  rows.forEach(r=>{const tr=el('tr',cls?cls(r):'');r.cells.forEach(v=>{const td=el('td');if(v&&v.pill){td.append(el('span','pill '+v.pill,v.t));}else td.textContent=String(v);tr.append(td);});if(r.click)tr.onclick=r.click;tb.append(tr);});
}

// ---------- sign in: password, then a 6-digit code from an authenticator app (2-step verification) ----------
function authCard(title,sub){
  app.innerHTML='';const b=el('main','card auth');
  const im=el('img','alogo');im.src='assets/logo.png';im.alt='';
  b.append(im,el('h1',0,title));if(sub)b.append(el('p','note',sub));
  app.append(b);return b;
}
function field(label,type,ph,auto){const l=el('label','fld'),i=el('input');i.type=type;i.placeholder=ph||'';if(auto)i.autocomplete=auto;l.append(el('span',0,label),i);return {l,i};}
function statusLine(msg){const m=el('p','note');m.id='status';m.setAttribute('role','status');m.textContent=msg||'';return m;}
function loginView(msg){
  const b=authCard('Admin sign in','Phantom Awards 2026 dashboard');
  const e=field('Email','email','you@example.com','username'),p=field('Password','password','','current-password');
  const go=el('button','gold wide','Sign in'),m=statusLine(msg);
  go.onclick=async()=>{
    go.disabled=true;m.textContent='Signing in…';
    const {error}=await sb.auth.signInWithPassword({email:e.i.value.trim(),password:p.i.value});
    if(error){m.textContent=error.message;go.disabled=false;return;}
    start();
  };
  p.i.onkeydown=ev=>{if(ev.key==='Enter')go.click();};
  b.append(e.l,p.l,go,m);e.i.focus();
}
function codeField(onDone){
  const f=field('6-digit code','text','123456','one-time-code');f.i.inputMode='numeric';f.i.maxLength=6;f.i.classList.add('code');
  f.i.oninput=()=>{f.i.value=f.i.value.replace(/\D/g,'').slice(0,6);if(f.i.value.length===6)onDone();};
  return f;
}
function mfaVerifyView(factorId){
  const b=authCard('2-step verification','Open your authenticator app and enter the 6-digit code for Phantom Awards.');
  const m=statusLine(),go=el('button','gold wide','Verify'),out=el('button','ghost wide','Use a different account');
  const f=codeField(()=>go.click());
  go.onclick=async()=>{
    if(f.i.value.length!==6){m.textContent='Enter the 6-digit code.';return;}
    go.disabled=true;m.textContent='Checking…';
    const {error}=await sb.auth.mfa.challengeAndVerify({factorId,code:f.i.value});
    if(error){m.textContent=error.message;go.disabled=false;f.i.value='';f.i.focus();return;}
    start();
  };
  out.onclick=async()=>{await sb.auth.signOut();loginView();};
  b.append(f.l,go,out,m);f.i.focus();
}
async function mfaEnrollView(){
  const b=authCard('Set up 2-step verification','The admin dashboard needs a second step. Scan this QR code with an authenticator app (Google Authenticator, Microsoft Authenticator, 1Password, Authy…), then enter the code it shows.');
  const m=statusLine('Preparing…');b.append(m);
  const lf=await sb.auth.mfa.listFactors();       // remove half-finished set-ups first
  for(const x of ((lf.data&&lf.data.all)||[]))if(x.factor_type==='totp'&&x.status!=='verified')await sb.auth.mfa.unenroll({factorId:x.id});
  const {data,error}=await sb.auth.mfa.enroll({factorType:'totp',friendlyName:'Phantom Admin '+new Date().toISOString().slice(0,16)});
  if(error){m.textContent='Could not start set-up: '+error.message+'. Check that TOTP is enabled in Supabase > Authentication > Multi-Factor.';return;}
  m.textContent='';
  const qr=el('img','qr');qr.src=data.totp.qr_code;qr.alt='QR code for your authenticator app';
  const sec=el('details','secret');sec.append(el('summary',0,"Can't scan? Enter this key instead"),el('code',0,data.totp.secret));
  const go=el('button','gold wide','Turn on 2-step verification'),out=el('button','ghost wide','Cancel and sign out');
  const f=codeField(()=>go.click());
  go.onclick=async()=>{
    if(f.i.value.length!==6){m.textContent='Enter the 6-digit code from the app.';return;}
    go.disabled=true;m.textContent='Checking…';
    const r=await sb.auth.mfa.challengeAndVerify({factorId:data.id,code:f.i.value});
    if(r.error){m.textContent=r.error.message;go.disabled=false;f.i.value='';f.i.focus();return;}
    start();
  };
  out.onclick=async()=>{await sb.auth.signOut();loginView();};
  m.before(qr,sec,f.l,go,out);f.i.focus();
}
// Sign out automatically after a period without activity (ADMIN_IDLE_MINUTES in config.js).
const IDLE_MIN=Math.max(1,+(PA.C.ADMIN_IDLE_MINUTES)||30);let lastAct=Date.now(),idleT=null;
['pointerdown','keydown','wheel','touchstart','scroll'].forEach(ev=>addEventListener(ev,()=>{lastAct=Date.now();},{passive:true,capture:true}));
function armIdle(){
  clearInterval(idleT);lastAct=Date.now();
  idleT=setInterval(async()=>{
    const left=IDLE_MIN*60000-(Date.now()-lastAct);
    if(left<=0){clearInterval(idleT);clearInterval(timer);await sb.auth.signOut();loginView('Signed out after '+IDLE_MIN+' minutes without activity.');}
    else if(left<60000)toast('No activity: signing out in '+Math.ceil(left/1000)+' s. Move the mouse to stay signed in.');
  },5000);
}
async function start(){
  if(!sb)return fail(CFGERR);
  const {data:{session}}=await sb.auth.getSession();
  if(!session||session.user.is_anonymous)return loginView();
  const acc=await sb.rpc('is_admin_account');
  if(acc.error){await sb.auth.signOut();return loginView('Database not set up yet ('+acc.error.message+'). Run the latest supabase-setup.sql in the Supabase SQL Editor.');}
  if(!acc.data){await sb.auth.signOut();return loginView('This account is not an admin.');}
  const aal=await sb.auth.mfa.getAuthenticatorAssuranceLevel();
  if(aal.error)return loginView(aal.error.message);
  if(aal.data.currentLevel!=='aal2'){
    const lf=await sb.auth.mfa.listFactors();
    const v=((lf.data&&lf.data.totp)||[]).find(x=>x.status==='verified');
    return v?mfaVerifyView(v.id):mfaEnrollView();
  }
  const {data:ok,error:rpcErr}=await sb.rpc('is_admin');
  if(rpcErr||!ok){await sb.auth.signOut();return loginView(rpcErr?rpcErr.message:'This account is not an admin.');}
  shell();armIdle();await refresh({editor:true});
  clearInterval(timer);timer=setInterval(()=>{if($('auto').checked)refresh({editor:false});},30000);
}

// ---------- page skeleton ----------
function shell(){
  app.innerHTML=`
  <header class="bar"><div class="brandrow"><img src="assets/logo.png" alt="" class="hlogo"><div><h1>Phantom Awards <span>Admin</span></h1><div id="status" role="status"></div></div></div>
   <div class="row"><label class="row"><input type="checkbox" id="auto" checked> auto-refresh</label>
   <button id="rf">Refresh</button><button id="bk">Backup JSON</button><button id="csv">Download CSV</button><button id="out">Sign out</button></div></header>
  <div class="tabs" id="tabs"></div>

  <section class="tab" id="t-overview">
   <div id="seed"></div>
   <div class="kpis" id="kpis"></div>
   <div class="two">
    <div class="card"><div class="row" style="justify-content:space-between"><h2>Selected category</h2><select id="cat"></select></div><div class="cv"><canvas id="c1"></canvas></div></div>
    <div class="card"><h2>Share of votes</h2><div class="cv"><canvas id="c2"></canvas></div></div>
   </div>
   <div class="card"><h2>Votes over time</h2><div class="cv"><canvas id="c3"></canvas></div></div>
   <div class="two">
    <div class="card"><h2>Votes per hour (last 48h)</h2><div class="cv"><canvas id="c7"></canvas></div></div>
    <div class="card"><h2>How many categories each voter finished</h2><div class="cv"><canvas id="c8"></canvas></div></div>
   </div>
   <div class="card"><h2>Votes per category</h2><div class="cv" id="c4box"><canvas id="c4"></canvas></div></div>
   <div class="card"><div class="row" style="justify-content:space-between"><h2>All categories (click a row)</h2><input id="q" placeholder="Search category…"></div>
    <div class="scroll"><table><thead><tr><th>Category</th><th>Leader</th><th>Votes</th><th>Share</th><th>Lead</th><th>Total</th></tr></thead><tbody id="tb"></tbody></table></div></div>
  </section>

  <section class="tab" id="t-races">
   <div class="card row"><span>Call a race <b>CLOSE</b> when the leader is ahead by less than</span><input id="thr" type="number" value="5" min="0" max="100" style="width:80px"><span>% of votes in that category</span></div>
   <div class="two">
    <div class="card"><h2>Closest races (lead %)</h2><div class="cv"><canvas id="c5"></canvas></div></div>
    <div class="card"><h2>Games winning several categories</h2><div class="cv"><canvas id="c6"></canvas></div></div>
   </div>
   <div class="card"><h2>Race table (closest first)</h2><div class="scroll"><table><thead><tr><th>Category</th><th>Leader(s)</th><th>Runner-up</th><th>Lead</th><th>Lead %</th><th>Status</th></tr></thead><tbody id="rtb"></tbody></table></div></div>
   <div class="card"><h2>Wins per game</h2><div class="scroll"><table><thead><tr><th>Game</th><th>Outright wins</th><th>Tied wins</th><th>Categories</th></tr></thead><tbody id="wtb"></tbody></table></div></div>
  </section>

  <section class="tab" id="t-editor">
   <div class="card"><div class="row"><input id="newcat" placeholder="New category name" style="flex:1;min-width:200px"><button class="gold" id="addcat">+ Add category</button><button id="syncpics" title="Copy a picture to every nominee with the same game name that has none">Sync pictures (same game name)</button><input id="eq" placeholder="Search…"></div>
   <p class="note">Hidden = not shown to fans at all. Closed = visible but voting is off for that category. Upload a picture or paste an image link for each nominee. If the same game appears in several categories, a picture you set for one is applied to all of them automatically. Add a trailer or info link to show a ▶ Trailer button on the nominee card (YouTube links play inside the site). Use images you have the right to use (official press kits are usually fine).</p></div>
   <div id="editor"></div>
  </section>

  <section class="tab" id="t-voters">
   <div class="card"><div class="row" style="justify-content:space-between"><h2 id="vh">Voters</h2>
    <div class="row"><input id="vq" placeholder="Search name or email…"><button id="vreveal">Reveal all emails</button><button id="vrand" class="gold">Pick random voter</button><button id="vcsv">Download voters CSV</button></div></div>
    <p id="vpick" class="note"></p>
    <div class="scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Categories voted</th><th>Last vote</th><th></th></tr></thead><tbody id="vtb"></tbody></table></div></div>
  </section>

  <section class="tab" id="t-collabs">
   <div class="card"><h2>Collab YouTube channels</h2>
    <p class="note">These show on the public site under the Collabs button. Add as many as you want. For each channel paste its YouTube link and a picture link, or upload the channel's profile picture.</p>
    <div class="nom"><input class="nm" id="cn" placeholder="Channel name" type="text"><input class="u" id="cu" placeholder="https://www.youtube.com/@channel" type="text"><input class="u" id="ci" placeholder="Icon image link (optional)" type="text"><button class="sm gold" id="cadd">Add channel</button></div></div>
   <div class="card"><div id="collabList"></div></div>
  </section>

  <section class="tab" id="t-export">
   <div class="card"><h2>Winners graphics for your video</h2>
    <p class="note">Makes a 1920×1080 card for every category that has votes: category, winner picture, winner name, percentage and runner-ups. Cards are in reveal order (Game of the Year last). You can export before the public reveal. Pictures from other websites may not load; pictures you uploaded in the admin always do.</p>
    <div class="row"><button class="gold" id="xzip">Download all PNGs (ZIP)</button><button id="xppt">Download PowerPoint (.pptx)</button></div>
    <p id="xmsg" class="note"></p></div>
   <div class="card"><div class="scroll"><table><thead><tr><th>Category</th><th>Winner</th><th>Votes</th><th></th></tr></thead><tbody id="xtb"></tbody></table></div></div>
  </section>

  <section class="tab" id="t-mod">
   <div class="card"><h2>Delete votes (spam / testing)</h2>
    <div class="row"><select id="mscope"><option value="all">All votes</option><option value="category">One category</option><option value="nominee">One nominee</option><option value="invalid">Invalid votes only</option></select>
    <select id="mtarget"></select></div><br>
    <div class="row"><input id="mconf" placeholder='Type DELETE to confirm'><button class="red" id="mdel">Delete votes</button></div>
    <p class="note">This cannot be undone. Use "All votes" after your testing, before you share the link.</p><p id="mres"></p></div>
   <div class="card"><h2>Retention: delete all voter data</h2>
    <p class="note">Your Privacy Policy promises to delete voter accounts, votes and predictions 90 days after the results are announced (the reveal date). If pg_cron is on, the database does this automatically every night. This button does it right now. Anonymous totals are kept so results still show. Admin accounts are kept. This cannot be undone.</p>
    <div class="row"><input id="ppc" placeholder="Type PURGE to confirm"><button class="red" id="ppb">Delete all voter data now</button></div><p id="ppr"></p></div>
  </section>

  <section class="tab" id="t-set">
   <div class="card"><h2>Voting switches</h2><p id="phase"></p>
    <label class="chk" style="font-size:16px;color:var(--text)"><input type="checkbox" id="pz"> Pause voting for everyone (fans see "Voting is paused")</label>
    <br><label class="chk" style="font-size:16px;color:var(--text);margin-top:10px"><input type="checkbox" id="pe"> Predictions game on (🔮 buttons, leaderboard, Fortune Teller badge)</label></div>
   <div class="card"><h2>Discord milestone alerts</h2>
    <p class="note">Get a message in your Discord channel when the number of voters hits a milestone. In Discord: Server Settings → Integrations → Webhooks → New Webhook → pick a channel → Copy Webhook URL. The URL is stored privately and can never be read back by the website.</p>
    <div class="row"><input id="dcw" type="password" placeholder="https://discord.com/api/webhooks/..." style="flex:1;min-width:240px"></div><br>
    <div class="row">Milestones (voters): <input id="dcm" placeholder="10, 25, 50, 100, 250" style="flex:1;min-width:200px"><label class="chk"><input type="checkbox" id="dcen"> alerts on</label></div><br>
    <div class="row"><button id="dcsave" class="gold">Save</button><button id="dctest">Send test message</button><button id="dcreset">Re-announce from the start</button><button id="dcrm" class="red">Remove webhook</button></div>
    <p id="dcst" class="note"></p></div>
   <div class="card"><h2>Announcement banner</h2><p class="note">Shown at the top of the home page. Leave empty to hide it.</p>
    <div class="row"><input id="ann" placeholder="e.g. Voting closes Sunday 11:59 PM!" style="flex:1;min-width:220px"><button id="annsv" class="gold">Save</button><button id="anncl">Clear</button></div></div>
   <div class="card"><h2>Event dates</h2>
    <div class="row">Voting closes <input type="datetime-local" id="ends"></div><br>
    <div class="row">Results reveal <input type="datetime-local" id="rev"></div><br>
    <div class="row"><button id="sv" class="gold">Save dates</button><button id="now">Reveal results now</button><button id="cl">Close voting now</button></div>
    <p id="cfgmsg" class="note"></p></div>
  </section>`;
  [['rf','refresh'],['bk','download'],['csv','download'],['out','logout'],['syncpics','refresh'],['vrand','shuffle'],['vcsv','download'],['xzip','download'],['xppt','download']].forEach(([id,ic])=>{const b=$(id);if(b)b.prepend(icon(ic));});
  const tb=$('tabs');tb.setAttribute('role','tablist');
  [['overview','Overview','chart'],['races','Races & Wins','activity'],['voters','Voters','users'],['export','Winners export','image'],['collabs','Collabs','handshake'],['editor','Nominees & Categories','list'],['mod','Moderation','shield'],['set','Settings','sliders']].forEach(([k,l,ic])=>{
    const b=withIcon('button',k===tab?'on':'',ic,l);b.setAttribute('role','tab');b.dataset.k=k;b.onclick=()=>show(k);tb.append(b);});
  show(tab);
  $('rf').onclick=()=>refresh({editor:true});$('csv').onclick=csv;
  $('out').onclick=async()=>{clearInterval(timer);await sb.auth.signOut();loginView();};
  $('q').oninput=e=>{filter=e.target.value.toLowerCase();overviewTable();};
  $('thr').oninput=races;
  $('eq').oninput=e=>{const v=e.target.value.toLowerCase();document.querySelectorAll('#editor details').forEach(d=>{d.style.display=d.dataset.name.includes(v)?'':'none';});};
  $('addcat').onclick=addCat;$('syncpics').onclick=syncPics;
  $('vq').oninput=voters;$('xzip').onclick=()=>exportCards('zip');$('xppt').onclick=()=>exportCards('pptx');
  $('vreveal').onclick=()=>{revealAll=!revealAll;voters();};
  $('bk').onclick=backup;$('cadd').onclick=addCollab;
  $('dcsave').onclick=()=>alertsSave();$('dcreset').onclick=()=>alertsSave({p_reset:true});$('dcrm').onclick=()=>{if(confirm('Remove the saved webhook?'))alertsSave({p_webhook:''});};
  $('dctest').onclick=async()=>{const r=await sb.rpc('admin_test_discord');$('dcst').textContent=r.error?'Error: '+r.error.message:'Test message sent. Check your Discord channel.';};
  $('annsv').onclick=()=>saveCfg({announcement:$('ann').value.trim()});$('anncl').onclick=()=>{$('ann').value='';saveCfg({announcement:''});};
  $('vrand').onclick=()=>{const g=VOT.filter(v=>v.email);if(!g.length){$('vpick').textContent='No Google voters yet.';return;}
    const v=g[Math.floor(Math.random()*g.length)];$('vpick').textContent='Winner: '+(v.name||'')+' — '+v.email;};
  $('vcsv').onclick=()=>{const q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';
    const rows=[['name','email','categories_voted','last_vote']].concat(VOT.map(v=>[v.name,v.email,v.votes,v.last_vote]));
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+rows.map(r=>r.map(q).join(',')).join('\n')],{type:'text/csv'}));a.download='phantom-awards-voters.csv';a.click();};
  $('cat').onchange=e=>{sel=e.target.value;selCharts();overviewTable();};
  $('mscope').onchange=modTargets;$('mdel').onclick=delVotes;
  $('ppb').onclick=async()=>{if($('ppc').value.trim()!=='PURGE'){$('ppr').textContent='Type PURGE in the box first.';return;}
    const r=await sb.rpc('admin_purge_voter_data');$('ppr').textContent=r.error?'Error: '+r.error.message:'Done. '+r.data+' voter accounts deleted; totals kept.';if(!r.error){$('ppc').value='';refresh({editor:false});}};
  $('pz').onchange=e=>saveCfg({paused:e.target.checked});
  $('pe').onchange=e=>saveCfg({predictions_enabled:e.target.checked});
  $('sv').onclick=()=>saveCfg({voting_ends:iso($('ends').value),reveal_at:iso($('rev').value)});
  $('now').onclick=()=>saveCfg({reveal_at:new Date().toISOString()});
  $('cl').onclick=()=>saveCfg({voting_ends:new Date().toISOString()});
}
function show(k){
  tab=k;
  document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.k===k));
  document.querySelectorAll('section.tab').forEach(s=>s.classList.toggle('on',s.id==='t-'+k));
  Object.values(charts).forEach(c=>c.resize());
}

// ---------- data ----------
async function refresh(o){
  o=o||{};toast('Loading…');
  const [a,b,c,k,n,vt,cl]=await Promise.all([sb.rpc('admin_totals'),sb.rpc('admin_overview'),sb.from('config').select('*').eq('id',1).maybeSingle(),
    sb.from('categories').select('*').order('sort'),sb.from('nominees').select('*').order('sort'),sb.rpc('admin_voters'),sb.from('collabs').select('*').order('sort')]);
  const err=a.error||b.error||k.error||n.error||vt.error||cl.error;
  if(err){toast('Error: '+err.message+' (did you run the latest supabase-setup.sql?)');return;}
  CATS=k.data.map(x=>({...x,noms:n.data.filter(m=>m.category_id===x.id).map(m=>({id:m.id,name:m.name,img:m.image_url,link:m.link_url,desc:m.description,sort:m.sort,category_id:m.category_id}))}));
  NM={};CATS.forEach(c=>c.noms.forEach(m=>NM[m.id]=m));
  T={};unknown=0;
  (a.data||[]).forEach(r=>{if(NM[r.choice]&&NM[r.choice].category_id===r.category_id)(T[r.category_id]=T[r.category_id]||{})[r.choice]=r.votes;else unknown+=r.votes;});
  ov=b.data;cfg=c.data;VOT=vt.data||[];COLLABS=cl.data||[];
  if(!sel||!CATS.find(x=>x.id===sel))sel=CATS[0]?CATS[0].id:null;
  toast('Updated '+new Date().toLocaleTimeString());
  seedBox();kpis();selCharts();timeChart();hourlyChart();completionChart();partChart();overviewTable();races();voters();exportTable();modTargets();cfgView();alertsLoad();
  if(o.editor){editor();collabsEditor();}
}
async function db(p,msg){
  const r=await p;
  if(r&&r.error){toast('Error: '+r.error.message);return false;}
  toast(msg||'Saved');await refresh({editor:true});return true;
}

// ---------- overview ----------
function seedBox(){
  const b=$('seed');b.innerHTML='';
  if(CATS.length)return;
  const c=el('div','card');c.append(el('h2',0,'No categories in the database yet'),el('p','note','Click once to load the starter list (46 categories). You can edit all of it afterwards in the "Nominees & Categories" tab.'));
  const btn=el('button','gold','Import default list');btn.onclick=async()=>{
    btn.disabled=true;
    let r=await sb.from('categories').insert(DEFAULTS.map((x,i)=>({id:x.id,name:x.name,sort:i+1})));
    if(r.error){toast('Error: '+r.error.message);btn.disabled=false;return;}
    const rows=[];DEFAULTS.forEach(x=>x.noms.forEach((nm,j)=>rows.push({category_id:x.id,name:nm,sort:j+1})));
    r=await sb.from('nominees').insert(rows);
    if(r.error){toast('Error: '+r.error.message);return;}
    toast('Imported!');refresh({editor:true});};
  c.append(btn);b.append(c);
}
function kpis(){
  const thr=+($('thr')||{value:5}).value||5;
  const st=CATS.map(c=>({c,s:standing(c)})).filter(x=>x.s.total>0);
  const tot=st.reduce((n,x)=>n+x.s.total,0);
  const top=[...st].sort((x,y)=>y.s.total-x.s.total)[0];
  const items=[['Voters',ov.voters],['Total votes',tot],['Avg categories / voter',ov.voters?(tot/ov.voters).toFixed(1):'0'],
    ['Finished all categories',(ov.completion||[]).filter(x=>x.cats>=CATS.filter(c=>!c.hidden).length).reduce((n,x)=>n+x.voters,0)],['Ties right now',st.filter(x=>x.s.tie).length],['Close races',st.filter(x=>!x.s.tie&&x.s.leadPct<thr).length],
    ['Most voted',top?top.c.name:'-'],['Unrecognised votes',unknown]];
  const k=$('kpis');k.innerHTML='';
  items.forEach(([l,v])=>{const d=el('div','kpi');d.append(el('b',0,String(v)),el('span',0,l));k.append(d);});
  k.children[6].firstChild.style.fontSize='16px';
}
function selCharts(){
  const s=$('cat');s.innerHTML='';CATS.forEach(c=>{const o=el('option',0,c.name);o.value=c.id;s.append(o);});
  const c=CATS.find(x=>x.id===sel);if(!c)return;
  s.value=sel;
  const vals=c.noms.map(n=>(T[c.id]||{})[n.id]||0),labels=c.noms.map(n=>n.name);
  mk('c1',{type:'bar',data:{labels,datasets:[{label:'Votes',data:vals,backgroundColor:labels.map((_,i)=>PAL[i%PAL.length])}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{precision:0}}}}});
  mk('c2',{type:'doughnut',data:{labels,datasets:[{data:vals,backgroundColor:labels.map((_,i)=>PAL[i%PAL.length]),borderWidth:0}]},options:{plugins:{legend:{position:'bottom'}}}});
}
function timeChart(){
  const d=ov.daily||[];let run=0;
  mk('c3',{type:'bar',data:{labels:d.map(x=>x.day),datasets:[{type:'bar',label:'Votes that day',data:d.map(x=>x.n),backgroundColor:'#a855f7'},{type:'line',label:'Cumulative',data:d.map(x=>run+=x.n),borderColor:'#f5c542',tension:.3}]},options:{scales:{y:{beginAtZero:true,ticks:{precision:0}}}}});
}
function hourlyChart(){
  const d=ov.hourly||[];
  mk('c7',{type:'bar',data:{labels:d.map(x=>new Date(x.h).toLocaleString([],{day:'numeric',month:'short',hour:'2-digit'})),datasets:[{label:'Votes',data:d.map(x=>x.n),backgroundColor:'#22d3ee'}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{precision:0}}}}});
}
function completionChart(){
  const d=ov.completion||[];
  mk('c8',{type:'bar',data:{labels:d.map(x=>x.cats+' cat.'),datasets:[{label:'Voters',data:d.map(x=>x.voters),backgroundColor:'#f5c542'}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{precision:0}}}}});
}
function partChart(){
  const s=[...CATS].sort((x,y)=>sum(T[y.id])-sum(T[x.id]));
  $('c4box').style.height=Math.max(260,s.length*20)+'px';
  mk('c4',{type:'bar',data:{labels:s.map(c=>c.name),datasets:[{label:'Votes',data:s.map(c=>sum(T[c.id])),backgroundColor:'#a855f7'}]},
    options:{indexAxis:'y',plugins:{legend:{display:false}},onClick:(e,els)=>{if(els.length){sel=s[els[0].index].id;selCharts();overviewTable();window.scrollTo({top:0,behavior:'smooth'});}},scales:{x:{beginAtZero:true,ticks:{precision:0}}}}});
}
function overviewTable(){
  const rows=CATS.filter(c=>c.name.toLowerCase().includes(filter)).map(c=>{
    const s=standing(c);
    return {id:c.id,cells:[c.name+(c.hidden?' (hidden)':c.closed?' (closed)':''),s.leaders.length?s.leaders.map(n=>n.name).join(' / '):'—',s.top,s.total?Math.round(s.top*100/s.total)+'%':'-',s.total?'+'+s.lead:'-',s.total],
      click:()=>{sel=c.id;selCharts();overviewTable();}};});
  fillTable($('tb'),rows,r=>r.id===sel?'r sel':'r');
}

// ---------- races & wins ----------
function races(){
  if(!$('thr'))return;
  const thr=+$('thr').value||5;
  const list=CATS.map(c=>({c,s:standing(c)})).filter(x=>x.s.total>0).sort((a,b)=>a.s.leadPct-b.s.leadPct);
  fillTable($('rtb'),list.map(x=>({cells:[x.c.name,x.s.leaders.map(n=>n.name).join(' / '),x.s.tie?'(tied)':(x.s.rows[1]?x.s.rows[1].n.name:'—'),'+'+x.s.lead,x.s.leadPct.toFixed(1)+'%',
    x.s.tie?{pill:'tie',t:'TIE'}:x.s.leadPct<thr?{pill:'close',t:'CLOSE'}:{pill:'ok',t:'clear'}]})));
  const top=list.slice(0,15);
  mk('c5',{type:'bar',data:{labels:top.map(x=>x.c.name),datasets:[{label:'Lead % of category votes',data:top.map(x=>+x.s.leadPct.toFixed(1)),backgroundColor:top.map(x=>x.s.tie?'#f87171':x.s.leadPct<thr?'#fb923c':'#a855f7')}]},
    options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{beginAtZero:true}}}});
  const W={};
  list.forEach(x=>x.s.leaders.forEach(n=>{const k=n.name.trim().toLowerCase();const w=W[k]=W[k]||{name:n.name,wins:0,tied:0,cats:[]};
    if(x.s.tie)w.tied++;else w.wins++;w.cats.push(x.c.name+(x.s.tie?' (tie)':''));}));
  const ws=Object.values(W).sort((a,b)=>b.wins-a.wins||b.tied-a.tied);
  fillTable($('wtb'),ws.map(w=>({cells:[w.name+(w.wins>=2?' ★':''),w.wins,w.tied,w.cats.join(', ')]})));
  const t12=ws.slice(0,12);
  mk('c6',{type:'bar',data:{labels:t12.map(w=>w.name),datasets:[{label:'Outright wins',data:t12.map(w=>w.wins),backgroundColor:'#f5c542'},{label:'Tied wins',data:t12.map(w=>w.tied),backgroundColor:'#f87171'}]},
    options:{scales:{x:{stacked:true},y:{stacked:true,beginAtZero:true,ticks:{precision:0}}}}});
  kpis();
}

// ---------- editor ----------
async function swap(table,a,b){
  if(!a||!b)return;
  const A=a.sort,B=b.sort;
  await sb.from(table).update({sort:B}).eq('id',a.id);
  await db(sb.from(table).update({sort:A}).eq('id',b.id),'Moved');
}
async function addCat(){
  const name=$('newcat').value.trim();if(!name)return;
  const id=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  if(await db(sb.from('categories').insert({id,name,sort:Math.max(0,...CATS.map(c=>c.sort))+1}),'Category added'))$('newcat').value='';
}
async function uploadImg(file,id){
  const bmp=await createImageBitmap(file);const sc=Math.min(1,800/bmp.width);
  const cv=document.createElement('canvas');cv.width=Math.round(bmp.width*sc);cv.height=Math.round(bmp.height*sc);
  cv.getContext('2d').drawImage(bmp,0,0,cv.width,cv.height);
  const blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.85));
  const path=id+'-'+Date.now()+'.jpg';
  const {error}=await sb.storage.from('nominee-images').upload(path,blob,{contentType:'image/jpeg',upsert:true});
  if(error)throw error;
  return sb.storage.from('nominee-images').getPublicUrl(path).data.publicUrl;
}
const nkey=s=>String(s||'').trim().toLowerCase();
const FIELDS=[['img','image_url'],['link','link_url'],['desc','description']];
function sharedFor(name,field,exceptId){
  const k=nkey(name);
  for(const c of CATS)for(const m of c.noms)if(m.id!==exceptId&&nkey(m.name)===k&&m[field])return m[field];
  return null;
}
const imageFor=(n,e)=>sharedFor(n,'img',e),linkFor=(n,e)=>sharedFor(n,'link',e);
async function propagate(name,field,val,exceptId){      // same game name in other categories gets the same picture / link / description
  const col=FIELDS.find(f=>f[0]===field)[1],ids=[];
  CATS.forEach(c=>c.noms.forEach(m=>{if(m.id!==exceptId&&nkey(m.name)===nkey(name)&&m[field]!==val)ids.push(m.id);}));
  if(!ids.length)return 0;
  const r=await sb.from('nominees').update({[col]:val}).in('id',ids);
  if(r.error){toast('Error: '+r.error.message);return 0;}
  return ids.length;
}
async function saveNominee(n,v,msg){
  v.name=v.name.trim();let note='';const val={};
  FIELDS.forEach(([f,col])=>{let x=(v[f]||'').trim()||null;
    if(!x&&!n[f]){const ex=sharedFor(v.name,f,n.id);if(ex){x=ex;note+=' ('+(f==='img'?'picture':f==='link'?'link':'description')+' copied from the same game)';}}
    val[col]=x;});
  const r=await sb.from('nominees').update(Object.assign({name:v.name},val)).eq('id',n.id);
  if(r.error){toast('Error: '+r.error.message+' (run the latest supabase-setup.sql?)');return;}
  let cnt=0;
  for(const [f,col] of FIELDS){const x=val[col];if(x&&x!==n[f])cnt=Math.max(cnt,await propagate(v.name,f,x,n.id));}
  toast((msg||'Saved')+note+(cnt?' · same details applied to '+cnt+' other categor'+(cnt>1?'ies':'y'):''));
  await refresh({editor:true});
}
async function syncPics(){                         // fill missing pictures, links and descriptions for same-name nominees
  const G={};CATS.forEach(c=>c.noms.forEach(m=>{(G[nkey(m.name)]=G[nkey(m.name)]||[]).push(m);}));
  let n=0;
  for(const k in G){const g=G[k];
    for(const [f,col] of FIELDS){
      const src=g.find(m=>m[f]);if(!src)continue;
      const ids=g.filter(m=>!m[f]).map(m=>m.id);
      if(ids.length){const r=await sb.from('nominees').update({[col]:src[f]}).in('id',ids);if(!r.error)n+=ids.length;}}}
  toast(n?'Copied '+n+' missing details.':'Everything already matches.');
  await refresh({editor:true});
}
function chk(label,val){const l=el('label','chk');const i=el('input');i.type='checkbox';i.checked=!!val;l.append(i,label);return {l,i};}
function editor(){
  const root=$('editor');root.innerHTML='';
  CATS.forEach((c,ci)=>{
    const d=el('details','cat');d.dataset.name=c.name.toLowerCase();d.open=openSet.has(c.id);
    d.ontoggle=()=>{if(d.open)openSet.add(c.id);else openSet.delete(c.id);};
    d.append(el('summary',0,c.name+(c.hidden?'  · HIDDEN':'')+(c.closed?'  · CLOSED':'')+'  ('+c.noms.length+' nominees)'));
    const body=el('div','body');
    const r=el('div','erow');
    const nm=el('input');nm.type='text';nm.value=c.name;
    const hid=chk('Hidden',c.hidden),clo=chk('Closed',c.closed);
    const sv=el('button','sm gold','Save');sv.onclick=()=>db(sb.from('categories').update({name:nm.value.trim(),hidden:hid.i.checked,closed:clo.i.checked}).eq('id',c.id));
    const up=el('button','sm','↑');up.onclick=()=>swap('categories',c,CATS[ci-1]);
    const dn=el('button','sm','↓');dn.onclick=()=>swap('categories',c,CATS[ci+1]);
    const del=el('button','sm red','Delete category');del.onclick=async()=>{
      if(!confirm('Delete "'+c.name+'", its nominees and all its votes?'))return;
      await sb.rpc('admin_delete_votes',{scope:'category',target:c.id});
      db(sb.from('categories').delete().eq('id',c.id),'Category deleted');};
    r.append(nm,hid.l,clo.l,sv,up,dn,del);body.append(r);
    c.noms.forEach((n,ni)=>{
      const row=el('div','nom');
      const th=el('img','thumb');if(n.img)th.src=n.img;
      const name=el('input','nm');name.type='text';name.value=n.name;name.placeholder='Nominee name';
      const url=el('input','u');url.type='text';url.value=n.img||'';url.placeholder='Image link (or use Upload)';
      const lk=el('input','u');lk.type='text';lk.value=n.link||'';lk.placeholder='Trailer / info link (YouTube etc.)';
      const ds=el('input','u');ds.type='text';ds.value=n.desc||'';ds.placeholder='Short description (1–2 lines)';
      const file=el('input');file.type='file';file.accept='image/*';file.style.display='none';
      const upl=el('button','sm','Upload');upl.onclick=()=>file.click();
      file.onchange=async()=>{if(!file.files[0])return;toast('Uploading…');
        try{url.value=await uploadImg(file.files[0],n.id);th.src=url.value;
          saveNominee(n,{name:name.value,img:url.value,link:lk.value,desc:ds.value},'Picture saved');}
        catch(e){toast('Upload failed: '+(e.message||e));}};
      const s2=el('button','sm gold','Save');s2.onclick=()=>{if(!url.value.trim()&&n.img){sb.from('nominees').update({name:name.value.trim(),image_url:null,link_url:lk.value.trim()||null,description:ds.value.trim()||null}).eq('id',n.id).then(r=>{toast(r.error?'Error: '+r.error.message:'Picture removed from this nominee');refresh({editor:true});});}else saveNominee(n,{name:name.value,img:url.value,link:lk.value,desc:ds.value},'Saved');};
      const u2=el('button','sm','↑');u2.onclick=()=>swap('nominees',n,c.noms[ni-1]);
      const d2=el('button','sm','↓');d2.onclick=()=>swap('nominees',n,c.noms[ni+1]);
      const x=el('button','sm red','Delete');x.onclick=async()=>{
        if(!confirm('Delete nominee "'+n.name+'" and its votes?'))return;
        await sb.rpc('admin_delete_votes',{scope:'nominee',target:n.id});
        db(sb.from('nominees').delete().eq('id',n.id),'Nominee deleted');};
      row.append(th,name,url,lk,ds,file,upl,s2,u2,d2,x);body.append(row);
    });
    const add=el('div','nom');
    const an=el('input','nm');an.type='text';an.placeholder='+ New nominee name';
    const au=el('input','u');au.type='text';au.placeholder='Image link (optional; you can upload after adding)';
    const alk=el('input','u');alk.type='text';alk.placeholder='Trailer / info link (optional)';
    const ad=el('input','u');ad.type='text';ad.placeholder='Short description (optional)';
    const ab=el('button','sm gold','Add nominee');
    ab.onclick=async()=>{const v=an.value.trim();if(!v)return;openSet.add(c.id);
      const given=au.value.trim()||null,img=given||imageFor(v)||null,givenL=alk.value.trim()||null,lnk=givenL||linkFor(v)||null,givenD=ad.value.trim()||null,dsc=givenD||sharedFor(v,'desc')||null;
      const r=await sb.from('nominees').insert({category_id:c.id,name:v,image_url:img,link_url:lnk,description:dsc,sort:Math.max(0,...c.noms.map(m=>m.sort))+1});
      if(r.error){toast('Error: '+r.error.message);return;}
      const cnt=Math.max(given?await propagate(v,'img',given,null):0,givenL?await propagate(v,'link',givenL,null):0,givenD?await propagate(v,'desc',givenD,null):0);
      toast('Nominee added'+(!given&&img?' (picture copied from the same game)':'')+(cnt?' · picture applied to '+cnt+' other categor'+(cnt>1?'ies':'y'):''));
      await refresh({editor:true});};
    add.append(an,au,alk,ad,ab);body.append(add);
    d.append(body);root.append(d);
  });
}

// ---------- voters ----------
function maskEmail(e){const [l,d]=String(e||'').split('@');if(!d)return '••••••••';return (l.length>2?l.slice(0,2):l.slice(0,1))+'•'.repeat(Math.max(3,Math.min(8,l.length-1)))+'@'+d;}
function voters(){
  const q=($('vq').value||'').toLowerCase();
  $('vh').textContent='Voters ('+VOT.length+')';
  $('vreveal').replaceChildren(icon(revealAll?'eyeOff':'eye'),document.createTextNode(revealAll?' Hide all emails':' Reveal all emails'));
  const tb=$('vtb');tb.innerHTML='';
  VOT.filter(v=>((v.name||'')+' '+(v.email||'')).toLowerCase().includes(q)).forEach(v=>{
    const tr=el('tr');
    tr.append(el('td',0,v.name||'—'));
    const te=el('td');
    if(v.email){
      let shown=revealAll;const sp=el('span',0,shown?v.email:maskEmail(v.email)),eye=el('button','sm icon');eye.append(icon(shown?'eyeOff':'eye'));eye.setAttribute('aria-label','Show or hide email');
      eye.style.marginLeft='8px';eye.title='Show / hide email';
      eye.onclick=()=>{shown=!shown;sp.textContent=shown?v.email:maskEmail(v.email);eye.replaceChildren(icon(shown?'eyeOff':'eye'));};
      te.append(sp,eye);
    }else te.textContent=v.is_anonymous?'(anonymous, before Google login)':'—';
    tr.append(te,el('td',0,String(v.votes)),el('td',0,new Date(v.last_vote).toLocaleString()));
    const td=el('td');const b=el('button','sm red','Delete votes');
    b.onclick=async()=>{if(!confirm('Delete all votes by '+(v.email?maskEmail(v.email):'this voter')+'?'))return;
      const r=await sb.rpc('admin_delete_votes',{scope:'voter',target:v.voter_id});
      toast(r.error?r.error.message:'Deleted '+r.data+' votes');refresh({editor:false});};
    td.append(b);
    const er=el('button','sm red','Erase account');er.style.marginLeft='6px';er.title='Delete this person\'s account and all their data (PDPA request)';
    er.onclick=async()=>{if(!confirm('Permanently erase the account of '+(v.email?maskEmail(v.email):'this voter')+' and ALL their data?'))return;
      const r=await sb.rpc('admin_erase_voter',{target:v.voter_id});toast(r.error?r.error.message:'Account erased.');refresh({editor:false});};
    td.append(er);tr.append(td);tb.append(tr);});
}

// ---------- collabs ----------
function collabsEditor(){
  const root=$('collabList');root.innerHTML='';
  if(!COLLABS.length)root.append(el('p','note','No collab channels yet. Add the first one above.'));
  COLLABS.forEach((c,i)=>{
    const row=el('div','nom');
    const th=el('img','thumb');th.style.cssText='width:44px;height:44px;border-radius:50%';if(c.icon_url)th.src=c.icon_url;
    const name=el('input','nm');name.type='text';name.value=c.name;
    const url=el('input','u');url.type='text';url.value=c.url;
    const ic=el('input','u');ic.type='text';ic.value=c.icon_url||'';ic.placeholder='Icon image link';
    const file=el('input');file.type='file';file.accept='image/*';file.style.display='none';
    const upl=el('button','sm','Upload icon');upl.onclick=()=>file.click();
    file.onchange=async()=>{if(!file.files[0])return;toast('Uploading…');
      try{ic.value=await uploadImg(file.files[0],'collab-'+c.id);th.src=ic.value;
        db(sb.from('collabs').update({name:name.value.trim(),url:url.value.trim(),icon_url:ic.value}).eq('id',c.id),'Icon saved');}
      catch(e){toast('Upload failed: '+(e.message||e));}};
    const sv=el('button','sm gold','Save');sv.onclick=()=>db(sb.from('collabs').update({name:name.value.trim(),url:url.value.trim(),icon_url:ic.value.trim()||null}).eq('id',c.id));
    const up=el('button','sm','↑');up.onclick=()=>swap('collabs',c,COLLABS[i-1]);
    const dn=el('button','sm','↓');dn.onclick=()=>swap('collabs',c,COLLABS[i+1]);
    const del=el('button','sm red','Remove');del.onclick=()=>{if(confirm('Remove "'+c.name+'"?'))db(sb.from('collabs').delete().eq('id',c.id),'Removed');};
    row.append(th,name,url,ic,file,upl,sv,up,dn,del);root.append(row);
  });
}
async function addCollab(){
  const name=$('cn').value.trim(),url=$('cu').value.trim();
  if(!name||!url){toast('Enter a channel name and its YouTube link.');return;}
  if(await db(sb.from('collabs').insert({name,url,icon_url:$('ci').value.trim()||null,sort:Math.max(0,...COLLABS.map(c=>c.sort))+1}),'Channel added')){$('cn').value=$('cu').value=$('ci').value='';}
}

// ---------- winners export ----------
const JSZIP='https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',PPTX='https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';
function loadScript(u){return new Promise((res,rej)=>{if(document.querySelector('script[src="'+u+'"]'))return res();const s=document.createElement('script');s.src=u;s.onload=res;s.onerror=()=>rej(new Error('Could not load '+u));document.head.append(s);});}
const loadImg=u=>new Promise(r=>{if(!u)return r(null);const i=new Image();i.crossOrigin='anonymous';i.onload=()=>r(i);i.onerror=()=>r(null);i.src=u;});
function rrect(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath();}
function wrapLines(x,text,maxW){const out=[];let cur='';String(text).split(' ').forEach(w=>{const t=cur?cur+' '+w:w;if(x.measureText(t).width>maxW&&cur){out.push(cur);cur=w;}else cur=t;});if(cur)out.push(cur);return out;}
async function drawCard(c){
  if(document.fonts)try{await Promise.all(['700 60px Cinzel','600 32px Inter'].map(f=>document.fonts.load(f)));}catch(e){}
  const s=standing(c),w=s.leaders[0]||s.rows[0].n,cv=document.createElement('canvas');cv.width=1920;cv.height=1080;
  const x=cv.getContext('2d'),img=await loadImg(w.img);
  let g=x.createLinearGradient(0,0,1920,1080);g.addColorStop(0,'#1d0a3d');g.addColorStop(1,'#050507');x.fillStyle=g;x.fillRect(0,0,1920,1080);
  g=x.createRadialGradient(1400,380,40,1400,380,760);g.addColorStop(0,'rgba(168,85,247,.5)');g.addColorStop(1,'rgba(168,85,247,0)');x.fillStyle=g;x.fillRect(0,0,1920,1080);
  x.textBaseline='alphabetic';x.textAlign='left';
  x.fillStyle='#c4b5fd';x.font='700 34px Cinzel,Georgia,serif';x.fillText('PHANTOM AWARDS 2026',110,100);
  x.font='600 30px Inter,"Noto Sans Tamil",system-ui,sans-serif';x.textAlign='right';x.fillText('DePhantom தமிழ்',1810,100);x.textAlign='left';
  x.fillStyle='#d8b4fe';x.font='700 60px Cinzel,Georgia,serif';
  let y=230;wrapLines(x,c.name.toUpperCase(),800).forEach(l=>{x.fillText(l,110,y);y+=72;});
  x.fillStyle='#f5c542';x.font='700 34px Inter,system-ui,sans-serif';x.fillText(s.tie?'TIE':'WINNER',110,y+20);y+=110;
  x.fillStyle='#ffffff';x.font='700 92px Cinzel,Georgia,serif';
  const names=s.tie?s.leaders.map(n=>n.name).join(' / '):w.name;
  wrapLines(x,names,820).slice(0,3).forEach(l=>{x.fillText(l,110,y);y+=104;});
  x.fillStyle='#f5c542';x.font='700 48px Inter,system-ui,sans-serif';
  x.fillText(Math.round(s.top*100/s.total)+'%  ·  '+s.top+' votes',110,y+10);
  const ru=s.rows.filter(r=>!s.leaders.includes(r.n)&&r.v>0).slice(0,2);
  x.fillStyle='#cbbcf0';x.font='600 32px Inter,system-ui,sans-serif';
  ru.forEach((r,k)=>x.fillText((k?'3rd   ':'2nd   ')+r.n.name+'  '+Math.round(r.v*100/s.total)+'%',110,930+k*50));
  // picture
  const bx=1000,by=190,bw=810,bh=456;
  x.save();rrect(x,bx,by,bw,bh,28);x.clip();
  if(img){const k=Math.max(bw/img.width,bh/img.height),dw=img.width*k,dh=img.height*k;x.drawImage(img,bx+(bw-dw)/2,by+(bh-dh)/2,dw,dh);}
  else{g=x.createLinearGradient(bx,by,bx+bw,by+bh);g.addColorStop(0,'#3b1578');g.addColorStop(1,'#12092a');x.fillStyle=g;x.fillRect(bx,by,bw,bh);
    x.fillStyle='#d8b4fe';x.font='700 150px Cinzel,Georgia,serif';x.textAlign='center';x.fillText(String(w.name).split(' ').slice(0,2).map(t=>t[0]).join('').toUpperCase(),bx+bw/2,by+bh/2+50);x.textAlign='left';}
  x.restore();x.lineWidth=8;x.strokeStyle='#f5c542';rrect(x,bx,by,bw,bh,28);x.stroke();
  x.fillStyle='#8d82b5';x.font='500 26px Inter,"Noto Sans Tamil",system-ui,sans-serif';x.textAlign='center';x.fillText('Fan-made awards by the DePhantom தமிழ் community',960,1030);
  return cv;
}
function dl(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();}
const toBlob=cv=>new Promise(r=>cv.toBlob(r,'image/png'));
function exportList(){return CATS.filter(c=>!c.hidden&&standing(c).total>0);}
function exportTable(){
  const tb=$('xtb');if(!tb)return;tb.innerHTML='';
  exportList().forEach(c=>{const s=standing(c),tr=el('tr');
    [c.name,s.tie?s.leaders.map(n=>n.name).join(' / ')+' (tie)':s.leaders[0].name,s.top+' / '+s.total].forEach(v=>tr.append(el('td',0,String(v))));
    const td=el('td'),b=el('button','sm','Download PNG');
    b.onclick=async()=>{b.disabled=true;try{dl(await toBlob(await drawCard(c)),c.id+'.png');}catch(e){toast('Could not make the card: '+e.message);}b.disabled=false;};
    td.append(b);tr.append(td);tb.append(tr);});
  if(!tb.children.length){const tr=el('tr');tr.append(el('td',0,'No votes yet.'));tb.append(tr);}
}
async function exportCards(kind){
  const list=exportList().reverse();   // reveal order: Game of the Year last
  if(!list.length){$('xmsg').textContent='No votes yet.';return;}
  $('xmsg').textContent='Rendering '+list.length+' cards…';
  try{
    const out=[];for(const c of list)out.push({c,cv:await drawCard(c)});
    if(kind==='zip'){
      await loadScript(JSZIP);const z=new JSZip();
      for(let i=0;i<out.length;i++)z.file(String(i+1).padStart(2,'0')+'-'+out[i].c.id+'.png',await toBlob(out[i].cv));
      dl(await z.generateAsync({type:'blob'}),'phantom-awards-winners.zip');
    }else{
      await loadScript(PPTX);const px=new PptxGenJS();px.layout='LAYOUT_16x9';
      out.forEach(o=>px.addSlide().addImage({data:o.cv.toDataURL('image/png'),x:0,y:0,w:'100%',h:'100%'}));
      await px.writeFile({fileName:'phantom-awards-winners.pptx'});
    }
    $('xmsg').textContent='Done. '+list.length+' cards exported.';
  }catch(e){$('xmsg').textContent='Export failed: '+(e.message||e);}
}

// ---------- backup ----------
function backup(){
  const data={exportedAt:new Date().toISOString(),config:cfg,categories:CATS,collabs:COLLABS,totals:T,voterCount:VOT.length};
  const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
  l.download='phantom-awards-backup.json';l.click();
}

// ---------- moderation ----------
function modTargets(){
  const t=$('mtarget'),sc=$('mscope').value,keep=t.value;t.innerHTML='';
  t.style.display=(sc==='category'||sc==='nominee')?'':'none';
  if(sc==='category')CATS.forEach(c=>{const o=el('option',0,c.name);o.value=c.id;t.append(o);});
  if(sc==='nominee')CATS.forEach(c=>c.noms.forEach(n=>{const o=el('option',0,c.name+' — '+n.name);o.value=n.id;t.append(o);}));
  if(keep)t.value=keep;
}
async function delVotes(){
  if($('mconf').value.trim()!=='DELETE'){$('mres').textContent='Type DELETE in the box first.';return;}
  const sc=$('mscope').value;
  const {data,error}=await sb.rpc('admin_delete_votes',{scope:sc,target:$('mtarget').value||null});
  $('mres').textContent=error?'Error: '+error.message:'Deleted '+data+' votes.';
  if(!error){$('mconf').value='';refresh({editor:false});}
}

// ---------- settings ----------
async function alertsLoad(){
  if(!$('dcst'))return;
  const r=await sb.rpc('admin_get_alerts');
  if(r.error||!r.data){$('dcst').textContent='Run the latest supabase-setup.sql to enable Discord alerts'+(r.error?' ('+r.error.message+')':'.');return;}
  const d=r.data;
  $('dcen').checked=!!d.enabled;$('dcm').value=(d.milestones||[]).join(', ');
  $('dcst').textContent=(d.has_webhook?'Webhook saved ✓. ':'No webhook saved yet. ')+'Last milestone announced: '+(d.last_milestone||0);
  $('dcw').placeholder=d.has_webhook?'Saved (hidden). Paste a new URL to replace it':'https://discord.com/api/webhooks/...';
}
async function alertsSave(extra){
  const ms=($('dcm').value||'').split(/[ ,]+/).map(Number).filter(n=>n>0).sort((x,y)=>x-y);
  const w=$('dcw').value.trim();
  const r=await sb.rpc('admin_set_alerts',Object.assign({p_webhook:w||null,p_enabled:$('dcen').checked,p_milestones:ms.length?ms:null,p_reset:false},extra||{}));
  $('dcst').textContent=r.error?'Error: '+r.error.message:'Saved.';
  if(!r.error){$('dcw').value='';setTimeout(alertsLoad,300);}
}
const iso=v=>v?new Date(v).toISOString():undefined;
const loc=i=>{const d=new Date(i);return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,16);};
function cfgView(){
  if(!cfg)return;
  $('ends').value=loc(cfg.voting_ends);$('rev').value=loc(cfg.reveal_at);$('pz').checked=!!cfg.paused;$('pe').checked=cfg.predictions_enabled!==false;$('ann').value=cfg.announcement||'';
  const n=Date.now(),p=n<new Date(cfg.voting_ends)?(cfg.paused?'Voting is PAUSED':'Voting is OPEN'):n<new Date(cfg.reveal_at)?'Voting CLOSED, results hidden':'Results are LIVE';
  $('phase').textContent='';$('phase').append(el('span','pill',p));
}
async function saveCfg(u){
  Object.keys(u).forEach(k=>u[k]===undefined&&delete u[k]);
  const {error}=await sb.from('config').update(u).eq('id',1);
  $('cfgmsg').textContent=error?'Error: '+error.message:'Saved.';
  if(!error)refresh({editor:false});
}

// ---------- csv ----------
function csv(){
  const q=v=>'"'+String(v).replace(/"/g,'""')+'"';
  const rows=[['category','nominee','votes','share_percent']];
  CATS.forEach(c=>{const tot=sum(T[c.id]);c.noms.forEach(n=>{const v=(T[c.id]||{})[n.id]||0;rows.push([c.name,n.name,v,tot?(v*100/tot).toFixed(1):'0']);});});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob(['\ufeff'+rows.map(r=>r.map(q).join(',')).join('\n')],{type:'text/csv'}));
  a.download='phantom-awards-results.csv';a.click();
}
start();
