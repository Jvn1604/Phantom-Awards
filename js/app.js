// Phantom Awards · public voting site. Settings live in config.js.

// ===== 2) NOMINEES (edit here; keep the same list in admin.html) =====
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
let D=DEFAULTS.map(c=>({id:c.id,name:c.name,closed:false,noms:c.noms.map(n=>({id:n,name:n,img:null}))})); // replaced by the database list when online

const TXT={
 en:{by:'Presented by DePhantom தமிழ்',choose:'Choose a category to vote',voted:'voted',back:'← All categories',pick:'Pick one nominee, then press Vote.',locked:'Your vote is saved. Results are revealed on ',changeok:'You voted. You can change it until voting closes.',vote:'Vote',change:'Change vote',saved:'Vote saved!',closesIn:'Voting closes in',resultsIn:'Results revealed in',closed:'Voting is closed',revealed:'The results are in!',yourvote:'✓ YOUR VOTE',pickTag:"★ PHANTOM'S PICK",winner:'🏆 WINNER',live:'▶ Live reveal',and:'And the winner is…',click:'Click or press Space for next · Esc to exit',none:'No votes',thanks:'Thank you for voting!',wait:'The reveal opens after results go live.',votes:'votes',noSave:'Preview mode: votes are not saved.',search:'Search categories…',fans:'fans have voted',match:'You matched the community winner in',prev:'Previous',next:'Next category',cont:'Continue',skip:'Skip',finish:'Finish',paused:'Voting is paused',catclosed:'Voting is closed for this category',google:'Continue with Google',loginNote:'Sign in with Google to vote. One vote per category for each Google account. The organizer can see which accounts have voted.',signout:'Sign out',signedin:'Signed in as',tag:'Vote for the best games of 2026',cats:'categories',chipLive:'Live results reveal',chipFree:'Free to vote',collabs:'Collabs',collabSub:'YouTube channels supporting Phantom Awards',noCollabs:'No collab channels yet.',visit:'Visit channel',fAll:'All',fTodo:'To vote',fDone:'Voted',catn:'Category',keys:'Tip: press 1–9 to pick · Enter to vote · ← → to move',auto:'Auto-continue after voting',surprise:'Surprise me',trailer:'Trailer',openYT:'Open on YouTube',badges:'Your badges',badgesSub:'Earn badges as you vote',newBadge:'New badge',afterResults:'unlocks after results',predict:'Predict',predicted:'Predicted',predTip:'Tap 🔮 Predict on the game you think will WIN the community vote. Correct predictions earn 10 points.',lb:'Leaderboard',lbLocked:'The leaderboard unlocks when the results are revealed.',lbNote:'Names are shown as first name + initial.',pts:'pts',sound:'Sound',gMain:'Main Awards',gGenres:'Genres',gGameplay:'Gameplay',gFun:'Fun & Community',youHave:'Your predictions',needGoogle:'Please sign out, then sign in again with Google.',needConsent:'Please accept the Terms and Privacy Policy first.',rejected:'Your vote could not be saved. Please sign out, sign in with Google again and retry.',dlData:'Download my data',delData:'Delete my data & account',delConfirm:'This permanently deletes your account, votes and predictions. It cannot be undone. Continue?',hide:'Hide email',show:'Show email'},
 ta:{by:'வழங்குவது DePhantom தமிழ்',choose:'வாக்களிக்க ஒரு பிரிவைத் தேர்ந்தெடுக்கவும்',voted:'வாக்களித்தவை',back:'← அனைத்து பிரிவுகள்',pick:'ஒரு போட்டியாளரைத் தேர்ந்தெடுத்து வாக்களிக்கவும்.',locked:'உங்கள் வாக்கு பதிவாகிவிட்டது. முடிவுகள் வெளியாகும் நாள்: ',changeok:'நீங்கள் வாக்களித்துவிட்டீர்கள். வாக்களிப்பு முடியும் வரை மாற்றலாம்.',vote:'வாக்களி',change:'வாக்கை மாற்று',saved:'வாக்கு பதிவு செய்யப்பட்டது!',closesIn:'வாக்களிப்பு முடிய',resultsIn:'முடிவுகள் வெளியாக',closed:'வாக்களிப்பு முடிந்தது',revealed:'முடிவுகள் வந்துவிட்டன!',yourvote:'✓ உங்கள் வாக்கு',pickTag:'★ PHANTOM தேர்வு',winner:'🏆 வெற்றியாளர்',live:'▶ நேரலை முடிவுகள்',and:'வெற்றியாளர்…',click:'அடுத்ததுக்கு கிளிக் செய்யவும் · வெளியேற Esc',none:'வாக்குகள் இல்லை',thanks:'வாக்களித்ததற்கு நன்றி!',wait:'முடிவுகள் வெளியான பின் இது திறக்கும்.',votes:'வாக்குகள்',noSave:'முன்னோட்டம்: வாக்குகள் சேமிக்கப்படாது.',search:'பிரிவைத் தேடு…',fans:'ரசிகர்கள் வாக்களித்துள்ளனர்',match:'சமூக வெற்றியாளருடன் நீங்கள் ஒத்துப்போனது',prev:'முந்தையது',next:'அடுத்த பிரிவு',cont:'தொடரவும்',skip:'தவிர்',finish:'முடி',paused:'வாக்களிப்பு தற்காலிகமாக நிறுத்தப்பட்டுள்ளது',catclosed:'இந்த பிரிவுக்கான வாக்களிப்பு முடிந்தது',google:'Google மூலம் தொடரவும்',loginNote:'வாக்களிக்க Google மூலம் உள்நுழையவும். ஒரு Google கணக்கிற்கு ஒரு பிரிவில் ஒரு வாக்கு. எந்தக் கணக்குகள் வாக்களித்தன என்பதை ஏற்பாட்டாளர் பார்க்க முடியும்.',signout:'வெளியேறு',signedin:'உள்நுழைந்தவர்',tag:'2026-இன் சிறந்த விளையாட்டுகளுக்கு வாக்களியுங்கள்',cats:'பிரிவுகள்',chipLive:'நேரலை முடிவுகள்',chipFree:'இலவசம்',collabs:'கூட்டாளர்கள்',collabSub:'Phantom Awards-ஐ ஆதரிக்கும் YouTube சேனல்கள்',noCollabs:'இன்னும் சேனல்கள் இல்லை.',visit:'சேனலைப் பார்',fAll:'அனைத்தும்',fTodo:'வாக்களிக்க',fDone:'வாக்களித்தவை',catn:'பிரிவு',keys:'குறிப்பு: 1–9 அழுத்தித் தேர்வு · Enter வாக்கு · ← → நகர்வு',auto:'வாக்களித்ததும் தானாக அடுத்ததற்குச் செல்',surprise:'ஏதாவது ஒன்று',trailer:'டிரெய்லர்',openYT:'YouTube-இல் திற',badges:'உங்கள் பேட்ஜ்கள்',badgesSub:'வாக்களித்து பேட்ஜ்கள் பெறுங்கள்',newBadge:'புதிய பேட்ஜ்',afterResults:'முடிவுகளுக்குப் பிறகு திறக்கும்',predict:'கணி',predicted:'கணித்தது',predTip:'சமூக வாக்கில் வெல்லும் என நினைக்கும் விளையாட்டில் 🔮 கணி என்பதை அழுத்துங்கள். சரியான கணிப்புக்கு 10 புள்ளிகள்.',lb:'முன்னணிப் பட்டியல்',lbLocked:'முடிவுகள் வெளியான பின் முன்னணிப் பட்டியல் திறக்கும்.',lbNote:'பெயர்கள் முதல் பெயர் + முதல் எழுத்தாகக் காட்டப்படும்.',pts:'புள்ளிகள்',sound:'ஒலி',gMain:'முக்கிய விருதுகள்',gGenres:'வகைகள்',gGameplay:'விளையாட்டு அனுபவம்',gFun:'வேடிக்கை & சமூகம்',youHave:'உங்கள் கணிப்புகள்',needGoogle:'வெளியேறி, Google மூலம் மீண்டும் உள்நுழையவும்.',needConsent:'முதலில் விதிமுறைகளையும் தனியுரிமைக் கொள்கையையும் ஏற்றுக்கொள்ளவும்.',rejected:'உங்கள் வாக்கைச் சேமிக்க முடியவில்லை. வெளியேறி, Google மூலம் மீண்டும் உள்நுழைந்து முயற்சிக்கவும்.',dlData:'என் தரவைப் பதிவிறக்கு',delData:'என் தரவையும் கணக்கையும் நீக்கு',delConfirm:'இது உங்கள் கணக்கு, வாக்குகள், கணிப்புகளை நிரந்தரமாக நீக்கும். மீட்க முடியாது. தொடரவா?',hide:'மின்னஞ்சலை மறை',show:'மின்னஞ்சலைக் காட்டு'}
};
Object.assign(TXT.en,{back:'All categories',yourvote:'Your vote',pickTag:"Phantom's Pick",winner:'Winner',live:'Watch the live reveal',
 predTip:'Tap Predict on the game you think will WIN the community vote. Correct predictions earn 10 points.',
 about:'How it works',aboutSub:'Everything you need to know about Phantom Awards 2026',
 s1t:'Sign in',s1:'Use your Google account. One vote per category for each account.',
 s2t:'Vote',s2:'Pick your favourite in every category. You can change your vote until voting closes.',
 s3t:'Watch the reveal',s3:'Results stay sealed until the reveal, then the winners are announced live.',
 faq:'Frequently asked questions',
 q1:'How does voting work?',a1:'Sign in with Google, pick one nominee in each category and press Vote. You can change your vote any time until voting closes.',
 q2:'When are the results revealed?',a2:'Vote totals stay sealed, even from the website, until the reveal time: {date}. Then the live reveal opens.',
 q3:'What is the predictions game?',a3:'Tap Predict on the nominee you think will win the community vote. Every correct prediction is worth 10 points on the leaderboard.',
 q4:'Can I vote more than once?',a4:'One vote per category for each Google account. Votes that look fraudulent are removed.',
 q5:'What happens to my data?',a5:'Your name, email, picture and votes are deleted 90 days after the results. You can download or delete your data any time from the profile menu.',
 q6:'Who runs Phantom Awards?',a6:'It is a fan-made event by the DePhantom தமிழ் community. It is not affiliated with The Game Awards or any game publisher.',
 offline:'You are offline. Votes will not be saved until you reconnect.',loadErr:'Could not refresh the latest data. Check your connection.',
 errTitle:'Something went wrong',errBody:'We could not connect to the voting server. Check your connection and try again.',retry:'Try again',browse:'Browse categories',
 swipe:'Swipe left or right to change category',skipTo:'Skip to content',noMatch:'No categories match your search.',close:'Close',menu:'Account menu',
 progress:'{a} of {b} categories voted',select:'Select',you:'you',privacyL:'Privacy',termsL:'Terms',privacyPolicy:'Privacy Policy',on:'On',off:'Off',
 fanMade:'Fan-made awards by the DePhantom தமிழ் community. Not affiliated with The Game Awards.',loading:'Loading'});
Object.assign(TXT.ta,{back:'அனைத்து பிரிவுகள்',yourvote:'உங்கள் வாக்கு',pickTag:'Phantom தேர்வு',winner:'வெற்றியாளர்',live:'நேரலை முடிவுகளைப் பாருங்கள்',
 predTip:'சமூக வாக்கில் வெல்லும் என நினைக்கும் விளையாட்டில் "கணி" என்பதை அழுத்துங்கள். சரியான கணிப்புக்கு 10 புள்ளிகள்.',
 about:'எப்படி செயல்படுகிறது',aboutSub:'Phantom Awards 2026 பற்றி நீங்கள் தெரிந்துகொள்ள வேண்டியவை',
 s1t:'உள்நுழையுங்கள்',s1:'உங்கள் Google கணக்கைப் பயன்படுத்துங்கள். ஒரு கணக்கிற்கு ஒரு பிரிவில் ஒரு வாக்கு.',
 s2t:'வாக்களியுங்கள்',s2:'ஒவ்வொரு பிரிவிலும் உங்களுக்குப் பிடித்ததைத் தேர்ந்தெடுங்கள். வாக்களிப்பு முடியும் வரை மாற்றலாம்.',
 s3t:'முடிவுகளைப் பாருங்கள்',s3:'முடிவுகள் வெளியீடு வரை ரகசியமாக இருக்கும், பின்னர் வெற்றியாளர்கள் நேரலையில் அறிவிக்கப்படுவார்கள்.',
 faq:'அடிக்கடி கேட்கப்படும் கேள்விகள்',
 q1:'வாக்களிப்பது எப்படி?',a1:'Google மூலம் உள்நுழைந்து, ஒவ்வொரு பிரிவிலும் ஒரு போட்டியாளரைத் தேர்ந்தெடுத்து "வாக்களி" அழுத்துங்கள். வாக்களிப்பு முடியும் வரை உங்கள் வாக்கை மாற்றலாம்.',
 q2:'முடிவுகள் எப்போது வெளியாகும்?',a2:'வாக்கு எண்ணிக்கை வெளியீட்டு நேரம் வரை யாருக்கும் தெரியாது: {date}. அதன் பின் நேரலை முடிவுகள் திறக்கும்.',
 q3:'கணிப்பு விளையாட்டு என்றால் என்ன?',a3:'சமூக வாக்கில் வெல்லும் என நீங்கள் நினைக்கும் போட்டியாளரில் "கணி" அழுத்துங்கள். ஒவ்வொரு சரியான கணிப்புக்கும் முன்னணிப் பட்டியலில் 10 புள்ளிகள்.',
 q4:'ஒன்றுக்கு மேல் வாக்களிக்கலாமா?',a4:'ஒரு Google கணக்கிற்கு ஒரு பிரிவில் ஒரு வாக்கு மட்டுமே. மோசடியான வாக்குகள் நீக்கப்படும்.',
 q5:'என் தரவு என்ன ஆகும்?',a5:'உங்கள் பெயர், மின்னஞ்சல், படம் மற்றும் வாக்குகள் முடிவுகள் வெளியான 90 நாட்களுக்குப் பின் நீக்கப்படும். சுயவிவர மெனுவில் எப்போது வேண்டுமானாலும் பதிவிறக்கலாம் அல்லது நீக்கலாம்.',
 q6:'Phantom Awards-ஐ நடத்துவது யார்?',a6:'இது DePhantom தமிழ் சமூகத்தின் ரசிகர் விருது. The Game Awards அல்லது எந்த விளையாட்டு நிறுவனத்துடனும் தொடர்பு இல்லை.',
 offline:'இணைய இணைப்பு இல்லை. மீண்டும் இணையும் வரை வாக்குகள் சேமிக்கப்படாது.',loadErr:'புதிய தரவைப் பெற முடியவில்லை. இணைப்பைச் சரிபார்க்கவும்.',
 errTitle:'ஏதோ தவறு நடந்தது',errBody:'வாக்கு சேவையகத்துடன் இணைக்க முடியவில்லை. இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',retry:'மீண்டும் முயற்சி',browse:'பிரிவுகளைப் பார்',
 swipe:'பிரிவை மாற்ற இடது அல்லது வலது பக்கம் ஸ்வைப் செய்யவும்',skipTo:'உள்ளடக்கத்திற்குச் செல்',noMatch:'உங்கள் தேடலுக்குப் பொருந்தும் பிரிவுகள் இல்லை.',close:'மூடு',menu:'கணக்கு மெனு',
 progress:'{b} பிரிவுகளில் {a} வாக்களித்தவை',select:'தேர்ந்தெடு',you:'நீங்கள்',privacyL:'தனியுரிமை',termsL:'விதிமுறைகள்',privacyPolicy:'தனியுரிமைக் கொள்கை',on:'ஆன்',off:'ஆஃப்',
 fanMade:'DePhantom தமிழ் சமூகத்தின் ரசிகர் விருதுகள். The Game Awards உடன் தொடர்பு இல்லை.',loading:'ஏற்றுகிறது'});

const {C,el,makeClient,configured,safeUrl,maskEmail,icon,withIcon,catIcon}=PA;
const CHANNEL_URL=safeUrl(C.CHANNEL_URL||'https://www.youtube.com/@ImDePhantom');
const DISCORD_URL=String(C.DISCORD_URL||'');
const hasDiscord=!!DISCORD_URL&&!/^YOUR_/.test(DISCORD_URL)&&safeUrl(DISCORD_URL)!=='#';
const PICKS=C.PICKS||{};
const LOGO='assets/logo.png';

let lang='en';try{lang=localStorage.getItem('lang')||'en';}catch(e){}
const t=(k,v)=>{let s=(TXT[lang]||TXT.en)[k];if(s==null)s=TXT.en[k];if(s==null)s=k;if(v)for(const x in v)s=s.split('{'+x+'}').join(v[x]);return s;};
function setLang(l){lang=l;document.documentElement.lang=l==='ta'?'ta':'en';try{localStorage.setItem('lang',l);}catch(e){}}
document.documentElement.lang=lang==='ta'?'ta':'en';
document.documentElement.dataset.theme=(()=>{try{return localStorage.getItem('theme')||'dark';}catch(e){return 'dark';}})();
const app=document.getElementById('app');
const DEMO=new URLSearchParams(location.search).has('demo');
let needConsent=false,myPreds={},needLogin=false,user=null,voters=null,sb=null,online=false,myChoices={},counts={},pending=null,msgText='',timer=null,fatal='',loadFail=false;
let cfg={ends:new Date(Date.now()+7*864e5),reveal:new Date(Date.now()+14*864e5)};
// ?demo = preview the results reveal with fake numbers · ?demo=open = preview voting
const DEMO_OPEN=new URLSearchParams(location.search).get('demo')==='open';
if(DEMO&&DEMO_OPEN){voters=1234;D.forEach((c,i)=>{c.noms.forEach(n=>{n.desc=i%3?null:'Short description of the nominee, shown on the card.';});});}
else if(DEMO){voters=1234;cfg.ends=new Date(Date.now()-2e3);cfg.reveal=new Date(Date.now()-1e3);
  D.forEach(c=>{counts[c.id]={};c.noms.forEach(n=>counts[c.id][n.id]=Math.floor(Math.random()*400)+5);});}

const phase=()=>{const n=Date.now();return n<cfg.ends?(cfg.paused?'paused':'open'):n<cfg.reveal?'closed':'revealed';};
const fmt=d=>d.toLocaleString(lang==='ta'?'ta-IN':'en-GB',{dateStyle:'medium',timeStyle:'short'});
const reducedMotion=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
function link(txt,href,ic){const a=ic?withIcon('a',0,ic,txt):el('a',0,txt);a.href=href;if(/^https?:/.test(href)){a.target='_blank';a.rel='noopener noreferrer';}return a;}
function aria(e,label){e.setAttribute('aria-label',label);e.title=label;return e;}

function winnerOf(c){
  const cc=counts[c.id]||{};let best=null,tot=0;
  c.noms.forEach(n=>{const v=cc[n.id]||0;tot+=v;if(!best||v>best.v)best={n,v};});
  return best&&best.v>0?{id:best.n.id,name:best.n.name,img:best.n.img,v:best.v,pct:Math.round(best.v*100/tot)}:null;
}
function rankOf(c){
  const cc=counts[c.id]||{},tot=Object.values(cc).reduce((a,b)=>a+b,0);
  return c.noms.map(nm=>({nm,v:cc[nm.id]||0})).sort((a,b)=>b.v-a.v).map(r=>({nm:r.nm,v:r.v,pct:tot?Math.round(r.v*100/tot):0}));
}

// ---- data ----
let catsAt=0;
async function loadCats(){
  if(Date.now()-catsAt<60000)return true;
  const [c,n]=await Promise.all([sb.from('categories').select('*').order('sort'),sb.from('nominees').select('*').order('sort')]);
  if(c.error||n.error)return false;
  catsAt=Date.now();
  if(!c.data||!c.data.length)return true;
  D=c.data.map(x=>({id:x.id,name:x.name,closed:x.closed,noms:(n.data||[]).filter(m=>m.category_id===x.id).map(m=>({id:m.id,name:m.name,img:m.image_url,link:m.link_url,desc:m.description}))}));
  return true;
}
// Returns false when the server could not be reached. Old data is kept instead of being wiped.
async function loadData(){
  if(!online)return true;
  try{
    const [okC]=await Promise.all([loadCats(),loadCollabs()]);
    const [c,m,tt,vc,pr]=await Promise.all([
      sb.from('config').select('*').eq('id',1).maybeSingle(),
      sb.from('votes').select('category_id,choice'),
      sb.rpc('get_totals'),
      sb.rpc('public_voter_count'),
      sb.from('predictions').select('category_id,nominee_id')
    ]);
    if(!vc.error)voters=vc.data;
    if(!pr.error){myPreds={};(pr.data||[]).forEach(r=>{myPreds[r.category_id]=r.nominee_id;});}
    if(c.data){cfg.ends=new Date(c.data.voting_ends);cfg.reveal=new Date(c.data.reveal_at);cfg.paused=!!c.data.paused;cfg.announcement=c.data.announcement||'';cfg.consent=c.data.consent_version||'2026-10';cfg.predOn=c.data.predictions_enabled!==false;}
    if(!tt.error){counts={};(tt.data||[]).forEach(r=>{(counts[r.category_id]=counts[r.category_id]||{})[r.choice]=r.votes;});}
    if(!m.error){myChoices={};(m.data||[]).forEach(r=>{myChoices[r.category_id]=r.choice;});}
    loadFail=!okC||!!(c.error||m.error);
  }catch(e){loadFail=true;}
  return !loadFail;
}

// ---- shared UI pieces ----
// Accessible dialog: focus moves in, Tab stays inside, Esc closes, focus returns to the opener.
function modal(title,sub){
  const prev=document.activeElement,ov=el('div','modal'),box=el('div','mbox'),x=aria(el('button','mx'),t('close'));
  const hid='mh'+Math.random().toString(36).slice(2);
  box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-labelledby',hid);
  x.append(icon('x'));const h=el('h2',0,title);h.id=hid;box.append(x,h);if(sub)box.append(el('p','sub',sub));
  const key=e=>{
    if(e.key==='Escape'){e.preventDefault();close();return;}
    if(e.key!=='Tab')return;
    const f=[...box.querySelectorAll('a[href],button:not([disabled]),input,iframe,summary,[tabindex]:not([tabindex="-1"])')].filter(n=>n.offsetParent!==null);
    if(!f.length)return;const a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}
  };
  const close=()=>{ov.remove();document.removeEventListener('keydown',key);window.removeEventListener('hashchange',close);if(prev&&prev.focus&&document.body.contains(prev))prev.focus();};
  document.addEventListener('keydown',key);window.addEventListener('hashchange',close);
  x.onclick=close;ov.onclick=e=>{if(e.target===ov)close();};
  ov.append(box);document.body.append(ov);requestAnimationFrame(()=>x.focus());
  return {box,close};
}
function toast(m,fn,ic){
  document.querySelectorAll('.toast').forEach(x=>x.remove());
  const e=el('div','toast');e.setAttribute('role','status');if(ic)e.append(icon(ic));e.append(el('span',0,m));
  if(fn){e.style.cursor='pointer';e.onclick=()=>{e.remove();fn();};}
  document.body.append(e);setTimeout(()=>e.remove(),3900);
}
function ibtn(ic,label,fn,withLabel){const b=aria(el('button','ib'+(withLabel?'':' icon')),label);b.append(icon(ic));if(withLabel)b.append(el('span','lbl',label));b.onclick=fn;return b;}
const curTheme=()=>document.documentElement.dataset.theme||'dark';
function themeBtn(after){
  const light=curTheme()==='light';
  return ibtn(light?'moon':'sun',light?'Dark theme':'Light theme',()=>{const n=curTheme()==='light'?'dark':'light';document.documentElement.dataset.theme=n;try{localStorage.setItem('theme',n);}catch(e){}(after||route)();});
}
function langBtn(after){
  const b=aria(el('button','ib',lang==='en'?'தமிழ்':'EN'),lang==='en'?'தமிழ் / Tamil':'English');
  b.onclick=()=>{setLang(lang==='en'?'ta':'en');(after||route)();};return b;
}
const ini=n=>String(n).split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
function medal(pos){const m=el('span','medal m'+pos,String(pos));m.setAttribute('aria-label','#'+pos);return m;}

// ---- account menu ----
function userChip(){
  if(!user)return null;
  const md=user.user_metadata||{};
  const name=md.full_name||md.name||(user.email||'').split('@')[0]||'Player';
  const wrap=el('div','uchip'),btn=aria(el('button','ubtn'),t('menu'));
  btn.setAttribute('aria-haspopup','true');btn.setAttribute('aria-expanded','false');
  const av=md.avatar_url||md.picture,phAv=()=>el('span','uav ph',(name.trim()[0]||'?').toUpperCase());
  if(av){const im=el('img','uav');im.src=av;im.referrerPolicy='no-referrer';im.alt='';im.onerror=()=>im.replaceWith(phAv());btn.append(im);}else btn.append(phAv());
  btn.append(el('span','uname',name),icon('down'));
  const menu=el('div','umenu'),head=el('div','uhead');head.append(el('div','un',name));
  const row=el('div','mail'),em=el('span',0,maskEmail(user.email)),eye=aria(el('button','eye'),t('show'));eye.append(icon('eye'));
  let shown=false;
  eye.onclick=e=>{e.stopPropagation();shown=!shown;em.textContent=shown?(user.email||''):maskEmail(user.email);eye.replaceChildren(icon(shown?'eyeOff':'eye'));aria(eye,shown?t('hide'):t('show'));};
  row.append(em,eye);head.append(row);menu.append(head);
  const item=(ic,label,fn,extra,cls)=>{const b=el('button','mi'+(cls?' '+cls:''));b.append(icon(ic),el('span',0,label));if(extra!=null)b.append(el('small',0,extra));b.onclick=e=>{e.stopPropagation();fn(b);};return b;};
  const bl=badgeList();
  const sOn=()=>{try{return localStorage.getItem('sfx')!=='0';}catch(e){return true;}};
  const soundItem=()=>item(sOn()?'volume':'mute',t('sound'),b=>{try{localStorage.setItem('sfx',sOn()?'0':'1');}catch(er){}b.replaceWith(soundItem());sfx('tick');},sOn()?t('on'):t('off'));
  menu.append(
    item('award',t('badges'),()=>{setOpen(false);openBadges();},bl.filter(b=>b.earned).length+'/'+bl.length),
    soundItem(),
    item('download',t('dlData'),async()=>{const r=await sb.rpc('export_my_data');if(r.error){toast(r.error.message,null,'alert');return;}
      const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(r.data,null,2)],{type:'application/json'}));a.download='phantom-awards-my-data.json';a.click();}),
    el('div','msep'),
    item('logout',t('signout'),async()=>{await sb.auth.signOut();location.hash='#/';location.reload();}),
    item('trash',t('delData'),async()=>{if(!confirm(t('delConfirm')))return;const r=await sb.rpc('delete_my_account');
      if(r.error){toast(r.error.message,null,'alert');return;}try{localStorage.clear();}catch(er){}await sb.auth.signOut();location.hash='#/';location.reload();},null,'danger'));
  const setOpen=o=>{wrap.classList.toggle('open',o);btn.setAttribute('aria-expanded',String(o));};
  btn.onclick=e=>{e.stopPropagation();setOpen(!wrap.classList.contains('open'));};
  wrap.onkeydown=e=>{if(e.key==='Escape'&&wrap.classList.contains('open')){setOpen(false);btn.focus();}};
  menu.onclick=e=>e.stopPropagation();
  wrap.append(btn,menu);return wrap;
}

// ---- sound effects (tiny synth, no files) ----
let AC=null;
function sfx(kind){
  try{if(localStorage.getItem('sfx')==='0')return;}catch(e){}
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();
    const seq={tick:[[880,.05]],pop:[[520,.06],[780,.08]],vote:[[523,.09],[659,.09],[784,.09],[1047,.2]],badge:[[659,.1],[784,.1],[988,.1],[1319,.12],[1568,.28]]}[kind]||[];
    let t0=AC.currentTime;
    seq.forEach(([f,d])=>{const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.value=f;
      g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(.07,t0+.01);g.gain.exponentialRampToValueAtTime(.0001,t0+d);
      o.connect(g);g.connect(AC.destination);o.start(t0);o.stop(t0+d+.02);t0+=d*.85;});
  }catch(e){}
}

// ---- leaderboard ----
async function openLeaderboard(){
  const {box}=modal(t('lb'),t('lbNote'));
  const list=el('div');box.append(list);
  const mine=withIcon('p','sub','sparkles',t('youHave')+': '+Object.keys(myPreds).length);
  if(phase()!=='revealed'){list.append(withIcon('p','sub','lock',t('lbLocked')),mine);return;}
  let rows=[];
  if(DEMO)rows=[{pos:1,name:'Demo P.',points:150,correct:15,total:20,is_me:false},{pos:2,name:'Sample S.',points:130,correct:13,total:20,is_me:true},{pos:3,name:'Test T.',points:90,correct:9,total:18,is_me:false}];
  else if(online){list.append(el('p','sub',t('loading')+'…'));const r=await sb.rpc('get_leaderboard');list.innerHTML='';if(r.error){list.append(el('p','sub',r.error.message));return;}rows=r.data||[];}
  if(!rows.length){list.append(el('p','sub','—'),mine);return;}
  rows.forEach(row=>{
    const d=el('div','brow'+(row.is_me?' on':'')),inf=el('div','binf');
    inf.append(el('b',0,row.name+(row.is_me?' ('+t('you')+')':'')),el('small',0,row.correct+'/'+row.total+' ✓'));
    d.append(row.pos<=3?medal(row.pos):el('div','bic','#'+row.pos),inf,el('b',0,row.points+' '+t('pts')));list.append(d);
  });
  list.append(mine);
}
async function explainRejection(err){
  const m=(err&&err.message)||'';
  if(!/row-level security|violates|permission/i.test(m))return m;
  const r=await sb.rpc('participation_status');
  if(r.error||!r.data)return t('rejected');
  const s=r.data;
  if(!s.google)return t('needGoogle');
  if(!s.consent){needConsent=true;setTimeout(route,1500);return t('needConsent');}
  if(s.paused)return t('paused');
  if(s.ends&&Date.now()>new Date(s.ends).getTime())return t('closed');
  return t('rejected');
}

// ---- trailer ----
function ytId(u){
  try{const x=new URL(u);let id=null;
    if(x.hostname==='youtu.be')id=x.pathname.slice(1).split('/')[0];
    else if(/(^|\.)youtube\.com$/.test(x.hostname)){
      if(x.pathname==='/watch')id=x.searchParams.get('v');
      else{const m=x.pathname.match(/^\/(embed|shorts|live)\/([^/?]+)/);if(m)id=m[2];}}
    return id&&/^[\w-]{6,15}$/.test(id)?id:null;}catch(e){return null;}
}
function openTrailer(nm){
  const u=safeUrl(nm.link);if(u==='#')return;
  const id=ytId(u);if(!id){window.open(u,'_blank','noopener,noreferrer');return;}
  const {box}=modal(nm.name);
  const v=el('div','vid'),f=document.createElement('iframe');
  f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';
  f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;f.title=nm.name+' · '+t('trailer');f.referrerPolicy='strict-origin-when-cross-origin';
  v.append(f);box.append(v,link(t('openYT'),u,'external'));box.lastChild.classList.add('ytlink');
}

// ---- badges ----
const BT={
 en:{first:['First Vote','Cast your first vote'],roll:['On a Roll','Vote in 10 categories'],half:['Halfway There','Vote in half of the categories'],complete:['Completionist','Vote in every category'],crowd:['Crowd Reader','Match the community winner 10 times'],oracle:['Oracle','Match the community winner in half the categories'],seer:['Fortune Teller','Predict the winner in 10 categories']},
 ta:{first:['முதல் வாக்கு','உங்கள் முதல் வாக்கைப் பதிவு செய்யுங்கள்'],roll:['வேகமாகச் செல்கிறீர்கள்','10 பிரிவுகளில் வாக்களியுங்கள்'],half:['பாதி வழி','பாதிப் பிரிவுகளில் வாக்களியுங்கள்'],complete:['முழுமையாளர்','அனைத்துப் பிரிவுகளிலும் வாக்களியுங்கள்'],crowd:['மக்கள் மனம் அறிந்தவர்','சமூக வெற்றியாளருடன் 10 முறை ஒத்துப்போங்கள்'],oracle:['சோதிடர்','பாதிப் பிரிவுகளில் சமூக வெற்றியாளரைக் கணியுங்கள்'],seer:['எதிர்காலம் கணிப்பவர்','10 பிரிவுகளில் வெற்றியாளரைக் கணியுங்கள்']}
};
function badgeList(){
  const done=Object.keys(myChoices).length,total=D.length,rev=phase()==='revealed';
  const hit=rev?D.filter(c=>{const w=winnerOf(c);return w&&myChoices[c.id]===w.id;}).length:0;
  const defs=[['first','vote',1,done],['roll','flame',Math.min(10,total),done],['half','star',Math.ceil(total/2),done],['complete','trophy',total,done],['crowd','target',Math.min(10,total),hit,1],['oracle','sparkles',Math.ceil(total/2),hit,1],['seer','eye',Math.min(10,total),Object.keys(myPreds).length]];
  const L=BT[lang]||BT.en;
  return defs.filter(d=>d[0]!=='seer'||cfg.predOn!==false).map(([id,ic,need,have,reveal])=>({id,ic,need,have,reveal:!!reveal,earned:total>0&&have>=need&&(!reveal||rev),name:L[id][0],desc:L[id][1]}));
}
function checkBadges(){
  if(!D.length)return;
  const key='badges_'+(user?user.id:'preview');let seen=[];
  try{seen=JSON.parse(localStorage.getItem(key)||'[]');}catch(e){}
  const now=badgeList().filter(b=>b.earned),fresh=now.filter(b=>!seen.includes(b.id));
  let first=false;try{first=localStorage.getItem(key)===null;}catch(e){}
  if(first&&Object.keys(myChoices).length>1){try{localStorage.setItem(key,JSON.stringify(now.map(b=>b.id)));}catch(e){}return;}  // returning voter: don't spam old badges
  if(fresh.length){try{localStorage.setItem(key,JSON.stringify(now.map(b=>b.id)));}catch(e){}
    toast(t('newBadge')+': '+fresh.map(b=>b.name).join(', '),openBadges,'award');confetti();sfx('badge');}
}
function openBadges(){
  const {box}=modal(t('badges'),t('badgesSub'));
  badgeList().forEach(b=>{
    const r=el('div','brow '+(b.earned?'on':'off')),inf=el('div','binf'),bi=el('div','bic');bi.append(icon(b.ic));
    inf.append(el('b',0,b.name),el('small',0,b.desc+(b.reveal&&phase()!=='revealed'?' · '+t('afterResults'):'')));
    const pb=el('div','pbar'),pi=el('i');pi.style.width=Math.min(100,b.need?b.have*100/b.need:0)+'%';pb.append(pi);inf.append(pb);
    r.append(bi,inf,el('b',0,b.earned?'✓':Math.min(b.have,b.need)+'/'+b.need));box.append(r);
  });
}

// ---- collabs ----
let collabs=[],collabAt=0;
async function loadCollabs(){
  if(Date.now()-collabAt<300000)return;
  const r=await sb.from('collabs').select('*').order('sort');
  if(!r.error&&r.data){collabs=r.data;collabAt=Date.now();}
}
function openCollabs(){
  const {box}=modal(t('collabs'),t('collabSub'));
  const g=el('div','cgrid');
  if(!collabs.length)g.append(el('p','sub',t('noCollabs')));
  collabs.forEach((c,i)=>{
    const a=link('',safeUrl(c.url));a.className='collab';a.style.animationDelay=(i*60)+'ms';
    const ic=el('div','cic'),first=((c.name||'?').trim()[0]||'?').toUpperCase();
    if(c.icon_url&&safeUrl(c.icon_url)!=='#'){const im=el('img');im.src=c.icon_url;im.alt='';im.referrerPolicy='no-referrer';im.onerror=()=>{im.remove();ic.textContent=first;};ic.append(im);}
    else ic.textContent=first;
    a.append(ic,el('b',0,c.name),withIcon('small',0,'youtube',t('visit')));g.append(a);
  });
  box.append(g);
}

// ---- about / FAQ ----
function aboutContent(){
  const f=document.createDocumentFragment(),steps=el('div','steps');
  [['s1t','s1'],['s2t','s2'],['s3t','s3']].forEach(([h,p],i)=>{const s=el('div','step'),d=el('div');d.append(el('b',0,t(h)),el('p',0,t(p)));s.append(el('span','n',String(i+1)),d);steps.append(s);});
  const faq=el('div','faq');
  for(let i=1;i<=6;i++){
    const d=el('details'),s=el('summary');s.append(el('span',0,t('q'+i)),icon('down'));
    const p=el('p',0,t('a'+i,{date:fmt(cfg.reveal)}));
    if(i===5)p.append(' ',link(t('privacyPolicy'),'privacy.html'));
    d.append(s,p);faq.append(d);
  }
  const fh=el('h2',0,t('faq'));fh.style.cssText='font-size:18px;margin:26px 0 12px';
  f.append(steps,fh,faq);return f;
}
function openAbout(){const {box}=modal(t('about'),t('aboutSub'));box.append(aboutContent());}
function aboutSection(){const s=el('section','about');s.setAttribute('aria-labelledby','about-h');const h=el('h2',0,t('about'));h.id='about-h';s.append(h,el('p','sub',t('aboutSub')),aboutContent());return s;}

// ---- page frame ----
function header(){
  const top=el('header','top');
  const b=aria(el('a','brand'),'Phantom Awards');b.href='#/';
  const im=el('img');im.src=LOGO;im.alt='';im.width=42;im.height=42;
  const tx=el('span');tx.append(el('b',0,'Phantom Awards'),el('small',0,t('by')));
  b.append(im,tx);
  const tr=el('div','tr');
  tr.append(ibtn('handshake',t('collabs'),openCollabs,innerWidth>640),ibtn('help',t('about'),openAbout),themeBtn(),langBtn());
  const u=userChip();if(u)tr.append(u);
  top.append(b,tr);return top;
}
function footer(){
  const f=el('footer','foot'),l=el('div','flinks');
  l.append(link('YouTube',CHANNEL_URL,'youtube'));
  if(hasDiscord)l.append(link('Discord',safeUrl(DISCORD_URL),'chat'));
  l.append(link(t('privacyL'),'privacy.html','shield'),link(t('termsL'),'terms.html','book'));
  f.append(l,el('div',0,t('fanMade')));
  return f;
}
function banners(m){
  if(!navigator.onLine)m.append(withIcon('div','offline','wifiOff',t('offline')));
  else if(loadFail&&online)m.append(withIcon('div','offline','alert',t('loadErr')));
  if(cfg.announcement){const a=withIcon('div','ann','megaphone',cfg.announcement);a.setAttribute('role','note');m.append(a);}
}
function countdown(){
  const box=el('div','stat cdw'),segs=el('div','segs'),lab=el('span','lbl');segs.setAttribute('aria-hidden','true');box.append(segs,lab);
  const mkSeg=l=>{const sg=el('div','seg'),v=el('b',0,'00');sg.append(v,el('small',0,l));segs.append(sg);return v;};
  const d=mkSeg('D'),h=mkSeg('H'),m=mkSeg('M'),sc=mkSeg('S');
  const setv=(e,v)=>{if(e.textContent!==v){e.textContent=v;e.classList.remove('flip');void e.offsetWidth;e.classList.add('flip');}};
  const tick=()=>{
    const p=phase();
    if(p==='revealed'||p==='paused'){lab.textContent=p==='revealed'?t('revealed'):t('paused');segs.replaceChildren(icon(p==='revealed'?'trophy':'pause','bigic'));return;}
    const target=p==='open'?cfg.ends:cfg.reveal;
    lab.textContent=p==='open'?t('closesIn'):t('closed')+' · '+t('resultsIn');
    let s=Math.max(0,Math.floor((target-Date.now())/1000));
    const dd=Math.floor(s/86400);s%=86400;const hh=Math.floor(s/3600);s%=3600;const mm=Math.floor(s/60);
    setv(d,String(dd).padStart(2,'0'));setv(h,String(hh).padStart(2,'0'));setv(m,String(mm).padStart(2,'0'));setv(sc,String(s%60).padStart(2,'0'));
    box.setAttribute('aria-label',lab.textContent+': '+dd+'d '+hh+'h '+mm+'m');
  };
  tick();clearInterval(timer);timer=setInterval(()=>{if(!document.body.contains(box)){clearInterval(timer);return;}tick();},1000);
  return box;
}
function tilt(a){
  if(reducedMotion()||matchMedia('(hover:none)').matches)return;
  a.addEventListener('pointermove',e=>{const r=a.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    a.style.transform='perspective(600px) rotateX('+(-y*10)+'deg) rotateY('+(x*10)+'deg) translateY(-3px)';
    a.style.setProperty('--mx',(x+.5)*100+'%');a.style.setProperty('--my',(y+.5)*100+'%');});
  a.addEventListener('pointerleave',()=>{a.style.transform='';});
}
function countUp(n,to){if(reducedMotion()){n.textContent=to;return;}const st=performance.now();requestAnimationFrame(function f(now){const k=Math.min(1,((now||st)-st)/900);n.textContent=Math.round(to*(1-Math.pow(1-k,3))).toLocaleString();if(k<1)requestAnimationFrame(f);});}
function ring(done,total){
  const w=el('div','stat'),R=33,C=2*Math.PI*R,NS='http://www.w3.org/2000/svg';
  w.setAttribute('role','img');w.setAttribute('aria-label',t('progress',{a:done,b:total}));
  const rw=el('div','rw'),s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 78 78');s.setAttribute('class','ring');
  const mk=cls=>{const c=document.createElementNS(NS,'circle');c.setAttribute('cx','39');c.setAttribute('cy','39');c.setAttribute('r',R);c.setAttribute('class',cls);s.append(c);return c;};
  mk('rb');const f=mk('rf');f.setAttribute('stroke-dasharray',C);f.setAttribute('stroke-dashoffset',C);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{f.style.strokeDashoffset=C*(1-(total?done/total:0));}));
  const rl=el('div','rl');if(total&&done>=total)rl.append(icon('check'));else rl.textContent=done+'/'+total;
  rw.append(s,rl);w.append(rw,el('span','lbl',t('voted')));return w;
}

// ---- home ----
let homeFilter='all';
function home(){
  app.innerHTML='';app.append(header());
  const main=el('main');main.id='main';main.tabIndex=-1;banners(main);
  const hero=el('div','hh');hero.append(el('div','eyebrow',t('by')),el('h1','title shim','Phantom Awards'),el('div','yr','2026'),el('p','sub',t('tag')));main.append(hero);
  const done=Object.keys(myChoices).length,p=phase();
  const row=el('div','stats');row.append(ring(done,D.length),countdown());
  if(voters!=null){const f=el('div','stat'),n=el('b','big','0');f.append(icon('flame','fi'),n,el('span','lbl',t('fans')));row.append(f);countUp(n,voters);}
  main.append(row);
  if(p==='revealed'){const a=withIcon('a','live','play',t('live'));a.href='#/reveal';main.append(a);
    if(done){const hit=D.filter(c=>{const w=winnerOf(c);return w&&myChoices[c.id]===w.id;}).length;
      main.append(el('p','sub',t('match')+' '+hit+' / '+done));}}
  const tools=el('div','tools'),sw=el('label','search'),q=el('input');
  q.type='search';q.placeholder=t('search');q.setAttribute('aria-label',t('search'));q.autocomplete='off';sw.append(icon('search'),q);
  const chips=el('div','seg-ctl');chips.setAttribute('role','group');chips.setAttribute('aria-label','Filter');
  [['all',t('fAll')],['todo',t('fTodo')],['done',t('fDone')]].forEach(([k,l])=>{
    const b=el('button',0,l);b.setAttribute('aria-pressed',String(homeFilter===k));
    b.onclick=()=>{homeFilter=k;[...chips.children].forEach(x=>x.setAttribute('aria-pressed',String(x===b)));apply();};chips.append(b);});
  const chipb=(ic,label,cls,fn)=>{const b=aria(el('button','chipb'+(cls?' '+cls:'')),label);b.append(icon(ic),el('span','lbl',label));b.onclick=fn;return b;};
  tools.append(sw,chips,chipb('shuffle',t('surprise'),'gold',()=>{const pool=D.filter(c=>!c.closed&&(p!=='open'||!myChoices[c.id]));const c=(pool.length?pool:D)[Math.floor(Math.random()*(pool.length||D.length))];if(c)location.hash='#/'+c.id;}));
  if(cfg.predOn!==false)tools.append(chipb('trophy',t('lb'),0,openLeaderboard));
  main.append(tools);
  const g=el('div','grid'),empty=el('p','empty',t('noMatch'));empty.hidden=true;
  D.forEach((c,i)=>{
    const voted=!!myChoices[c.id],a=el('a','tile'+(voted?' isdone':''));a.href='#/'+c.id;a.style.animationDelay=Math.min(i*25,600)+'ms';
    a.style.setProperty('--d',((i*370)%2400)+'ms');
    a.dataset.n=c.name.toLowerCase();a.dataset.d=voted?'1':'0';
    const b=el('span','tbadge');b.append(icon(catIcon(c.name)));
    a.append(b,el('span','tn',c.name));
    if(voted){const d=el('span','done');d.append(icon('check'),el('span','sr',t('voted')));a.append(d);}
    tilt(a);g.append(a);});
  function apply(){const v=q.value.trim().toLowerCase();let n=0;
    [...g.children].forEach(a=>{const okq=a.dataset.n.includes(v),okf=homeFilter==='all'||(homeFilter==='done'?a.dataset.d==='1':a.dataset.d==='0');a.hidden=!(okq&&okf);if(!a.hidden)n++;});
    empty.hidden=n>0;}
  q.oninput=apply;apply();main.append(g,empty);
  if(msgText){const m=el('div');m.id='msg';m.setAttribute('role','status');m.textContent=msgText;main.append(m);}
  main.append(aboutSection());
  app.append(main,footer());
}

// ---- category page ----
let justVoted=null,catKey=null,lastRoute=null;
function cat(c){
  app.innerHTML='';app.append(header());
  const main=el('main');main.id='main';main.tabIndex=-1;banners(main);
  const idx=D.indexOf(c),prv=D[(idx-1+D.length)%D.length];
  const p=phase(),voted=myChoices[c.id],cc=counts[c.id]||{};
  const open=p==='open'&&!c.closed;
  const tot=Object.values(cc).reduce((a,b)=>a+b,0);
  const w=p==='revealed'?winnerOf(c):null;
  let nxt=D[(idx+1)%D.length],home_=false;
  if(p==='open'){ // jump to the next category you haven't voted in yet
    nxt=null;for(let k=1;k<D.length;k++){const x=D[(idx+k)%D.length];if(!myChoices[x.id]&&!x.closed){nxt=x;break;}}
    if(!nxt)home_=true;
  }
  const goNext=home_?'#/':'#/'+nxt.id;
  const done=Object.keys(myChoices).length,hov=matchMedia('(hover:hover)').matches;
  // top row: back link + position + progress
  const top=el('div','crow'),bk=withIcon('a','back','back',t('back'));bk.href='#/';
  const pos=el('div','cpos'),pb=el('div','pbar'),pi=el('i');pb.append(pi);pb.setAttribute('role','progressbar');pb.setAttribute('aria-valuemin','0');pb.setAttribute('aria-valuemax',String(D.length));pb.setAttribute('aria-valuenow',String(done));pb.setAttribute('aria-label',t('progress',{a:done,b:D.length}));
  requestAnimationFrame(()=>requestAnimationFrame(()=>{pi.style.width=(D.length?done*100/D.length:0)+'%';}));
  pos.append(el('span',0,t('catn')+' '+(idx+1)+' / '+D.length),pb,el('span',0,done+'/'+D.length+' '+t('voted')));
  top.append(bk,pos);main.append(top);
  const hd=el('div','chd'),ci=el('div','cicon');ci.append(icon(catIcon(c.name)));hd.append(ci,el('h1',0,c.name));main.append(hd);
  const stIc=p==='revealed'?'trophy':p==='paused'?'pause':p==='closed'||c.closed?'lock':voted?'check':'vote';
  main.append(withIcon('p','status',stIc,p==='revealed'?t('revealed'):p==='paused'?t('paused'):p==='closed'?t('closed'):c.closed?t('catclosed'):voted?t('changeok'):t('pick')));
  if(open&&hov)main.append(el('p','tip',t('keys')));
  if(open&&cfg.predOn!==false)main.append(el('p','tip',t('predTip')));
  const list=el('div','list'),cards={},sels={},preds={},btn=el('button','vote'),btnTxt=el('span');btn.append(icon('vote'),btnTxt);
  const label=()=>{const sl=c.noms.find(n=>n.id===pending);btnTxt.textContent=(voted?t('change'):t('vote'))+(sl&&sl.id!==voted?' · '+sl.name:'');btn.disabled=!pending||pending===voted;};
  const paintSel=()=>{Object.keys(cards).forEach(id=>{cards[id].classList.toggle('sel',id===pending);if(sels[id])sels[id].setAttribute('aria-pressed',String(id===pending));});label();};
  const paintPred=()=>Object.keys(preds).forEach(id=>{const on=myPreds[c.id]===id;preds[id].setAttribute('aria-pressed',String(on));preds[id].lastChild.textContent=on?t('predicted'):t('predict');});
  const togglePred=async nm=>{
    const had=myPreds[c.id]===nm.id;
    if(had)delete myPreds[c.id];else myPreds[c.id]=nm.id;
    sfx('pop');paintPred();
    if(online){
      const r=had?await sb.from('predictions').delete().eq('category_id',c.id):await sb.from('predictions').upsert({category_id:c.id,nominee_id:nm.id,updated_at:new Date().toISOString()},{onConflict:'voter_id,category_id'});
      if(r.error){toast(await explainRejection(r.error),null,'alert');await loadData();paintPred();}
    }
  };
  const choose=(nm,e)=>{pending=nm.id;sfx('tick');paintSel();if(e&&e.clientX)burst(e.clientX,e.clientY);};
  const noms=p==='revealed'?[...c.noms].sort((a,b)=>(cc[b.id]||0)-(cc[a.id]||0)):c.noms;
  noms.forEach((nm,i)=>{
    const x=el('div','g'+(open?' can':'')+(w&&w.id===nm.id?' win':'')+(justVoted===c.id&&voted===nm.id?' pop':''));
    x.style.animationDelay=(i*70)+'ms';
    if(open){const s=aria(el('button','gsel'),t('select')+': '+nm.name);s.setAttribute('aria-pressed','false');s.onclick=e=>choose(nm,e);x.append(s);sels[nm.id]=s;}
    const ck=el('span','chk');ck.setAttribute('aria-hidden','true');ck.append(icon('check'));x.append(ck);
    const gi=el('div','gimg');
    if(nm.img&&safeUrl(nm.img)!=='#'){
      const im=el('img');im.alt='';im.loading='lazy';im.decoding='async';im.referrerPolicy='no-referrer';
      im.onload=()=>{im.classList.add('ld');gi.classList.add('ld');};
      im.onerror=()=>{im.remove();gi.classList.add('ld','ph');gi.prepend(ini(nm.name));};
      im.src=nm.img;gi.append(im);
    }else{gi.classList.add('ld','ph');gi.append(ini(nm.name));}
    if(open&&hov&&i<9){const k=el('span','kb',String(i+1));k.setAttribute('aria-hidden','true');gi.append(k);}
    if(p==='revealed'&&tot&&i<3)gi.append(medal(i+1));
    const ga=el('div','gact');
    if(open&&cfg.predOn!==false){const pr=el('button','pill prd');pr.append(icon('sparkles'),el('span',0,t('predict')));pr.setAttribute('aria-label',t('predict')+': '+nm.name);
      pr.onclick=e=>{e.stopPropagation();if(myPreds[c.id]!==nm.id)burst(e.clientX,e.clientY);togglePred(nm);};preds[nm.id]=pr;ga.append(pr);}
    if(nm.link){const tb=el('button','pill trl');tb.append(icon('play'),el('span',0,t('trailer')));tb.setAttribute('aria-label',t('trailer')+': '+nm.name);
      tb.onclick=e=>{e.stopPropagation();openTrailer(nm);};ga.append(tb);}
    if(ga.children.length)gi.append(ga);
    const body=el('div','gbody');body.append(el('b','gn',nm.name));
    if(nm.desc)body.append(el('p','gdesc',nm.desc));
    const full=el('div','gfull'),tags=el('div','tags');
    if(p==='revealed'){
      const v=cc[nm.id]||0,pc=tot?Math.round(v*100/tot):0;
      const bar=el('div','bar'),bi=el('i');bi.style.transitionDelay=(i*120)+'ms';bar.append(bi);
      full.append(bar,el('div','pct',pc+'% · '+v+' '+t('votes')));
      requestAnimationFrame(()=>requestAnimationFrame(()=>{bi.style.width=pc+'%';}));
      if(w&&w.id===nm.id)tags.append(withIcon('span','tag','trophy',t('winner')));
      if(PICKS[c.name]===nm.name)tags.append(withIcon('span','tag alt','star',t('pickTag')));
      if(myPreds[c.id]===nm.id)tags.append(w&&w.id===nm.id?withIcon('span','tag alt','sparkles','+10 '+t('pts')):withIcon('span','tag bad','x',t('predicted')));
    }
    if(voted===nm.id)tags.append(withIcon('span','tag','check',t('yourvote')));
    if(tags.children.length)full.append(tags);
    x.append(gi,body);if(full.children.length)x.append(full);
    if(open)tilt(x);cards[nm.id]=x;list.append(x);
  });
  paintSel();paintPred();
  // vote bar + auto-continue
  let auto=false;try{auto=localStorage.getItem('auto')==='1';}catch(e){}
  const al=el('label','autoc'),ai=el('input');ai.type='checkbox';ai.checked=auto;
  ai.onchange=()=>{auto=ai.checked;try{localStorage.setItem('auto',auto?'1':'0');}catch(e){}};
  al.append(ai,document.createTextNode(t('auto')));
  const act=el('div','act');if(open)act.append(btn,al);
  const msg=el('div');msg.id='msg';msg.setAttribute('role','status');msg.setAttribute('aria-live','polite');
  msg.textContent=msgText||(p==='closed'&&voted?t('locked')+fmt(cfg.reveal):'');
  btn.onclick=async()=>{
    if(!pending)return;
    if(online){
      btn.disabled=true;
      const {error}=await sb.from('votes').upsert({category_id:c.id,choice:pending,updated_at:new Date().toISOString()},{onConflict:'voter_id,category_id'});
      if(error){btn.disabled=false;msgText=navigator.onLine?await explainRejection(error):t('offline');msg.textContent=msgText;return;}
      msgText=t('saved');await loadData();confetti();sfx('vote');
    }else{myChoices[c.id]=pending;msgText=t('noSave');sfx('vote');}
    justVoted=c.id;route();
    if(auto)setTimeout(()=>{if(location.hash==='#/'+c.id)location.hash=goNext;},1300);
  };
  const nav=el('nav','nav');nav.setAttribute('aria-label','Categories');
  const pa=el('a','navb');pa.append(icon('left'),el('span',0,t('prev')));pa.href='#/'+prv.id;
  const na=el('a','navb'+(voted?' gold':''));na.append(el('span',0,home_?t('finish'):(voted?t('cont'):p==='open'?t('skip'):t('next'))),icon(home_?'check':'right'));
  na.href=goNext;nav.append(pa,na);
  main.append(list,act,msg,nav,el('p','swipe-hint',t('swipe')));
  app.append(main,footer());
  justVoted=null;checkBadges();
  // keyboard shortcuts (ignored while a dialog is open or when typing)
  catKey=e=>{
    if(document.querySelector('.modal')||e.altKey||e.ctrlKey||e.metaKey)return;
    if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName||''))return;
    if(e.key==='ArrowRight')location.hash=goNext;
    else if(e.key==='ArrowLeft')location.hash='#/'+prv.id;
    else if(open&&/^[1-9]$/.test(e.key)){const n=c.noms[+e.key-1];if(n)choose(n);}
    else if(open&&e.key==='Enter'&&pending&&pending!==voted&&!/BUTTON|A/.test(e.target.tagName||'')){btn.click();}
  };
  document.addEventListener('keydown',catKey);
  // swipe between categories on touch screens
  let sx=null,sy=0,st=0;
  app.ontouchstart=e=>{if(e.touches.length!==1||e.target.closest('.act,.umenu,input')){sx=null;return;}sx=e.touches[0].clientX;sy=e.touches[0].clientY;st=Date.now();};
  app.ontouchend=e=>{if(sx==null)return;const tc=e.changedTouches[0],dx=tc.clientX-sx,dy=tc.clientY-sy;sx=null;
    if(Math.abs(dx)>70&&Math.abs(dy)<Math.abs(dx)*.6&&Date.now()-st<700)location.hash=dx<0?goNext:'#/'+prv.id;};
}

// ---- live reveal ----
let ri=0,rs=0,revealOff=null;
function reveal(){
  if(revealOff)revealOff();   // never stack two key listeners (route() can run twice on load)
  const seq=[...D].reverse(); // Game of the Year comes last
  if(phase()!=='revealed'){location.hash='#/';return;}
  const stage=el('div','stage');stage.setAttribute('role','region');stage.setAttribute('aria-live','polite');stage.setAttribute('aria-label',t('live'));
  const draw=()=>{
    stage.innerHTML='';
    const x=withIcon('a','x','x','Esc');x.href='#/';x.setAttribute('aria-label',t('close'));x.onclick=e=>e.stopPropagation();stage.append(x);
    if(ri>=seq.length){
      stage.append(el('div','eyebrow','Phantom Awards 2026'),el('h2',0,t('thanks')),link('YouTube · DePhantom தமிழ்',CHANNEL_URL,'youtube'));return;
    }
    const c=seq[ri];
    stage.append(el('div','eyebrow','Phantom Awards 2026'),el('h2',0,c.name));
    if(rs===0){stage.append(el('div','q',t('and')));}
    else{
      const w=winnerOf(c);
      if(w&&w.img&&safeUrl(w.img)!=='#'){const im=el('img','wimg');im.src=w.img;im.alt='';im.referrerPolicy='no-referrer';im.onerror=()=>im.remove();stage.append(im);}
      stage.append(el('div','w',w?w.name:t('none')));
      if(w)stage.append(el('div','st',w.pct+'% · '+w.v+' '+t('votes')));
      if(w){const ru=rankOf(c).filter(r=>r.nm.id!==w.id&&r.v>0).slice(0,2);
        if(ru.length){const e=el('div','ru');ru.forEach((r,k)=>{const s=el('span');s.append(medal(k+2),document.createTextNode(r.nm.name+' · '+r.pct+'%'));e.append(s);});stage.append(e);}}
      if(PICKS[c.name]&&w&&PICKS[c.name]===w.name)stage.append(withIcon('div','st','star',t('pickTag')));
    }
    stage.append(el('div','hint',(ri+1)+' / '+seq.length+' · '+t('click')));
  };
  const next=()=>{if(ri>=seq.length)return;if(rs===0)rs=1;else{rs=0;ri++;}draw();if(rs===1&&ri<seq.length){confetti();sfx('badge');}};
  stage.onclick=next;
  const key=e=>{if(e.key==='Escape'){location.hash='#/';}else if(e.key===' '||e.key==='ArrowRight'){e.preventDefault();next();}};
  document.addEventListener('keydown',key);
  const off=()=>{document.removeEventListener('keydown',key);window.removeEventListener('hashchange',off);revealOff=null;};revealOff=off;
  window.addEventListener('hashchange',off);
  ri=0;rs=0;app.innerHTML='';app.append(stage);draw();
}

function confetti(){
  if(reducedMotion())return;
  const cv=document.createElement('canvas'),dpr=Math.min(2,window.devicePixelRatio||1);
  cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:20';
  cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;document.body.append(cv);const x=cv.getContext('2d');if(!x){cv.remove();return;}
  x.scale(dpr,dpr);
  const cols=['#a855f7','#f5c542','#e9d5ff','#ffffff','#22d3ee'];
  const P=Array.from({length:150},(_,i)=>{const side=i%2?1:-1;return {x:innerWidth/2+side*innerWidth*.15,y:innerHeight*.62,vx:(Math.random()-.5)*12+side*3,vy:-Math.random()*14-5,w:Math.random()*7+4,h:Math.random()*4+3,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:cols[i%cols.length]};});
  let f=0;(function a(){x.clearRect(0,0,innerWidth,innerHeight);x.globalAlpha=Math.min(1,(110-f)/30);
    P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.34;p.vx*=.99;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.w/2,-p.h/2,p.w,p.h);x.restore();});
    if(++f<110)requestAnimationFrame(a);else cv.remove();})();
}
const GSVG='<svg viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';
function orbs(h){h.append(el('i','orb o1'),el('i','orb o2'),el('i','orb o3'));}

// ---- loading skeleton and error screen ----
function skeleton(){
  app.innerHTML='';const w=el('div');w.setAttribute('aria-busy','true');w.setAttribute('aria-label',t('loading'));
  const sk=(cls,css)=>{const e=el('div','sk '+(cls||''));if(css)e.style.cssText=css;return e;};
  const top=el('div','sk-top'),br=el('div','sk-brand');br.append(sk('sk-c'),sk('sk-l','width:150px'));top.append(br,sk(0,'width:130px;height:38px;border-radius:999px'));
  const hero=el('div','sk-hero');hero.append(sk('sk-l','width:180px;height:11px'),sk(0,'width:min(80%,460px);height:56px'),sk(0,'width:110px;height:22px'),sk('sk-l','width:min(70%,300px)'));
  const st=el('div','stats');for(let i=0;i<3;i++)st.append(sk(0,'height:132px;border-radius:16px'));
  const g=el('div','grid');for(let i=0;i<12;i++)g.append(sk('sk-tile'));
  w.append(top,hero,st,g);app.append(w);
}
function errorPage(){
  app.innerHTML='';const b=el('div','errbox');b.setAttribute('role','alert');
  b.append(icon(navigator.onLine?'alert':'wifiOff'),el('h2',0,t('errTitle')),el('p',0,t('errBody')));
  if(fatal){const d=el('p',0,fatal);d.style.cssText='font-size:12px;opacity:.8';b.append(d);}
  const r=el('div','row'),re=el('button','vote');re.append(icon('refresh'),el('span',0,t('retry')));re.onclick=()=>location.reload();
  const br=el('button','navb');br.append(el('span',0,t('browse')));br.onclick=()=>{fatal='';online=false;msgText=t('noSave');route();};
  r.append(re,br);b.append(r);app.append(b);
}

// ---- consent + login ----
function consentBox(){
  const l=el('label','cons');
  l.innerHTML='<input type="checkbox" id="agree"><span>I agree to the <a href="terms.html" target="_blank" rel="noopener">Terms</a> and <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a>.<br><i>Saya bersetuju dengan <a href="terms.html#ms" target="_blank" rel="noopener">Terma</a> dan <a href="privacy.html#ms" target="_blank" rel="noopener">Dasar Privasi</a>.</i></span>';
  return l;
}
function privacyNotice(){
  const d=el('details','pn');
  d.innerHTML='<summary>Privacy notice · Notis Privasi</summary><div>'
   +'<b>English.</b> We collect your <b>name, email address and profile picture</b> from your Google account, and your <b>votes and predictions</b>, to verify one vote per person and run the awards, predictions and leaderboard. Giving this data is <b>voluntary</b>, but you cannot vote without it. We keep it until <b>90 days after the results are announced</b>, then delete it (anonymous totals are kept). You can ask to see, correct or delete your data at any time from the profile menu or by emailing <a href="mailto:jeeven1604@gmail.com">jeeven1604@gmail.com</a> (Jeeventhiran, DePhantom தமிழ், data controller). Full policy: <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a>.'
   +'<hr><b>Bahasa Malaysia.</b> Kami mengumpul <b>nama, alamat e-mel dan gambar profil</b> daripada akaun Google anda, serta <b>undi dan ramalan</b> anda, untuk mengesahkan satu undi bagi setiap orang dan mengendalikan anugerah, ramalan dan papan pendahulu. Pemberian data ini adalah <b>secara sukarela</b>, tetapi anda tidak boleh mengundi tanpanya. Kami menyimpannya sehingga <b>90 hari selepas keputusan diumumkan</b>, kemudian memadamkannya (jumlah tanpa nama dikekalkan). Anda boleh meminta untuk melihat, membetulkan atau memadam data anda pada bila-bila masa melalui menu profil atau dengan e-mel kepada <a href="mailto:jeeven1604@gmail.com">jeeven1604@gmail.com</a> (Jeeventhiran, DePhantom தமிழ், pengawal data). Dasar penuh: <a href="privacy.html#ms" target="_blank" rel="noopener">Dasar Privasi</a>.'
   +'</div>';
  return d;
}
function brandBlock(card){
  const im=el('img','hlogo');im.src=LOGO;im.alt='DePhantom';im.width=100;im.height=100;
  card.append(im,el('div','eyebrow',t('by')),el('h1','title shim','Phantom Awards'),el('div','yr','2026'));
}
function consentPage(){
  app.innerHTML='';const h=el('div','hero');orbs(h);
  const card=el('main','lcard');card.id='main';
  const cons=consentBox(),agree=cons.querySelector('input');
  const go=el('button','gbtn'),m=el('p','sub');m.setAttribute('role','status');go.append(el('span',0,'Continue · Teruskan'));go.disabled=true;
  agree.onchange=()=>{go.disabled=!agree.checked;};
  go.onclick=async()=>{go.disabled=true;const r=await sb.rpc('record_consent');
    if(r.error){m.textContent=r.error.message;go.disabled=false;return;}
    try{localStorage.removeItem('consent_pending');}catch(e){}needConsent=false;route();};
  const so=el('button','lnk','Sign out · Log keluar');so.onclick=async()=>{await sb.auth.signOut();location.reload();};
  const im=el('img','hlogo');im.src=LOGO;im.alt='';
  card.append(im,el('h1','title','One last step'),el('p','tagline','Satu langkah lagi · Please agree to continue / Sila bersetuju untuk meneruskan'),cons,go,m,privacyNotice(),so);
  h.append(card);app.append(h);
}
async function checkConsent(){
  const need=cfg.consent||'2026-10';
  const r=await sb.from('consents').select('version').maybeSingle();
  if(r.data&&r.data.version===need){needConsent=false;return;}
  let pend=false;try{pend=localStorage.getItem('consent_pending')==='1';}catch(e){}
  if(pend){const x=await sb.rpc('record_consent');if(!x.error){try{localStorage.removeItem('consent_pending');}catch(e){}needConsent=false;return;}}
  needConsent=true;
}
function loginPage(){
  app.innerHTML='';const h=el('div','hero');orbs(h);
  const card=el('main','lcard');card.id='main';brandBlock(card);
  const chips=el('div','chips');
  [['list',D.length+' '+t('cats')],['radio',t('chipLive')],['heart',t('chipFree')]].forEach(([ic,x])=>chips.append(withIcon('span','chip',ic,x)));
  const b=el('button','gbtn');const gi=el('span');gi.innerHTML=GSVG;b.append(gi,el('span',0,t('google')));
  const m=el('p','sub'),cons=consentBox(),agree=cons.querySelector('input'),hint=el('p','hint','Tick the box to continue · Sila tanda kotak untuk teruskan');
  m.setAttribute('role','status');
  b.disabled=true;agree.onchange=()=>{b.disabled=!agree.checked;hint.style.visibility=agree.checked?'hidden':'visible';};
  b.onclick=async()=>{if(!agree.checked)return;b.disabled=true;try{localStorage.setItem('consent_pending','1');}catch(e){}
    const {error}=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});
    if(error){m.textContent=error.message;b.disabled=false;}};
  card.append(el('p','tagline',t('tag')),chips,cons,hint,b,m,privacyNotice(),el('p','fine',t('loginNote')));
  const f=el('footer','hfoot');f.append(link('YouTube',CHANNEL_URL));
  if(hasDiscord)f.append(link('Discord',safeUrl(DISCORD_URL)));
  f.append(link(t('privacyL'),'privacy.html'),link(t('termsL'),'terms.html'));
  const hw=el('div','hlw');hw.append(themeBtn(loginPage),langBtn(loginPage));h.append(hw,card,f);app.append(h);
}

// ---- router ----
function fitBar(){ // keep page content clear of the docked vote bar on phones
  const a=document.querySelector('.act');
  const hgt=a&&a.children.length&&getComputedStyle(a).position==='fixed'?a.offsetHeight:0;
  document.documentElement.style.setProperty('--bar-h',hgt+'px');
}
function route(){
  if(catKey){document.removeEventListener('keydown',catKey);catKey=null;}
  app.ontouchstart=app.ontouchend=null;
  if(fatal)return errorPage();
  if(needLogin)return loginPage();
  if(needConsent)return consentPage();
  const id=(location.hash.match(/^#\/([a-z0-9-]+)/)||[])[1];
  if(id==='reveal')return reveal();
  const c=D.find(x=>x.id===id);
  if(c)cat(c);else home();
  fitBar();
  const rk=location.hash,fresh=rk!==lastRoute;lastRoute=rk;
  if(fresh){app.classList.remove('rt');void app.offsetWidth;app.classList.add('rt');}
}
window.addEventListener('hashchange',async()=>{pending=null;msgText='';await loadData();route();window.scrollTo(0,0);});
window.addEventListener('resize',()=>{clearTimeout(window.__fb);window.__fb=setTimeout(fitBar,150);});
window.addEventListener('offline',()=>{if(!needLogin&&!needConsent&&!fatal&&location.hash!=='#/reveal')route();});
window.addEventListener('online',async()=>{if(needLogin||needConsent||fatal||location.hash==='#/reveal')return;await loadData();route();});

// ---- extra animation helpers ----
function burst(x,y){
  if(reducedMotion())return;
  const cols=['#f5c542','#a855f7','#22d3ee','#f472b6','#ffffff'];
  for(let i=0;i<10;i++){
    const p=document.createElement('i');p.className='spark';p.style.left=x+'px';p.style.top=y+'px';p.style.background=cols[i%cols.length];
    document.body.append(p);
    if(!p.animate){p.remove();continue;}
    const a=Math.random()*Math.PI*2,d=30+Math.random()*50;
    p.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:'translate(calc(-50% + '+Math.cos(a)*d+'px),calc(-50% + '+Math.sin(a)*d+'px)) scale(0)',opacity:0}],{duration:600+Math.random()*300,easing:'cubic-bezier(.2,.8,.2,1)'}).onfinish=()=>p.remove();
  }
}
function initFx(){
  if(reducedMotion())return;
  const am=document.createElement('div');am.id='ambient';am.setAttribute('aria-hidden','true');am.append(el('i','orb a1'),el('i','orb a2'));document.body.prepend(am);
  document.addEventListener('pointerdown',e=>{
    const b=e.target.closest&&e.target.closest('.vote,.chipb,.ib,.gbtn,a.live,.navb,.mi');
    if(!b||b.disabled)return;
    const r=b.getBoundingClientRect(),sz=Math.max(r.width,r.height)*2,rp=document.createElement('span');
    rp.className='ripple';rp.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+(e.clientX-r.left-sz/2)+'px;top:'+(e.clientY-r.top-sz/2)+'px';
    if(getComputedStyle(b).position==='static')b.style.position='relative';
    b.style.overflow='hidden';b.append(rp);setTimeout(()=>rp.remove(),650);
  });
  if(matchMedia('(hover:hover)').matches){
    let raf=0,mx=0,my=0;const root=document.documentElement;
    addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;if(!raf)raf=requestAnimationFrame(()=>{raf=0;root.style.setProperty('--cx',mx+'px');root.style.setProperty('--cy',my+'px');});});
  }
}
function startBg(){
  document.addEventListener('click',()=>document.querySelectorAll('.uchip.open').forEach(x=>{x.classList.remove('open');const b=x.querySelector('.ubtn');if(b)b.setAttribute('aria-expanded','false');}));
  initFx();
  if(reducedMotion())return;
  const cv=document.createElement('canvas');cv.id='bg';cv.setAttribute('aria-hidden','true');document.body.prepend(cv);
  const x=cv.getContext&&cv.getContext('2d');if(!x)return;
  const small=innerWidth<640,dpr=small?1:Math.min(2,window.devicePixelRatio||1);
  let W=0,H=0,star=null,nextStar=performance.now()+3000;const P=[];
  const size=()=>{W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';x.setTransform(dpr,0,0,dpr,0,0);};size();addEventListener('resize',size);
  const N=Math.min(60,Math.floor(innerWidth/(small?26:22))),LINK=small?9000:14000;
  for(let i=0;i<N;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.8+.6});
  (function f(){
    if(!document.hidden){
      x.clearRect(0,0,W,H);
      const nw=performance.now(),lt=document.documentElement.dataset.theme==='light';
      if(!star&&nw>nextStar){star={x:Math.random()*W*.8,y:Math.random()*H*.4,vx:9+Math.random()*5,vy:4+Math.random()*3,life:1};nextStar=nw+5000+Math.random()*6000;}
      if(star){const tx=star.x-star.vx*9,ty=star.y-star.vy*9,gr=x.createLinearGradient(star.x,star.y,tx,ty);
        gr.addColorStop(0,(lt?'rgba(124,58,237,':'rgba(255,255,255,')+star.life+')');gr.addColorStop(1,'rgba(168,85,247,0)');
        x.strokeStyle=gr;x.lineWidth=2;x.beginPath();x.moveTo(star.x,star.y);x.lineTo(tx,ty);x.stroke();
        star.x+=star.vx;star.y+=star.vy;star.life-=.018;if(star.life<=0||star.x>W||star.y>H)star=null;}
      x.lineWidth=1;x.fillStyle=lt?'rgba(124,58,237,.5)':'rgba(196,160,255,.7)';
      P.forEach((a,i)=>{a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;
        x.beginPath();x.arc(a.x,a.y,a.r,0,7);x.fill();
        for(let j=i+1;j<P.length;j++){const b=P[j],dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy;
          if(d<LINK){x.strokeStyle='rgba(168,85,247,'+(.22*(1-d/LINK))+')';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();}}});
    }
    requestAnimationFrame(f);
  })();
}

// skip link for keyboard users
(()=>{const s=el('a','skip',t('skipTo'));s.href='#main';s.onclick=e=>{e.preventDefault();const m=document.getElementById('main');if(m){m.focus();m.scrollIntoView();}};document.body.prepend(s);})();
startBg();
(async()=>{
  if(DEMO||!configured)route();else skeleton();
  if(DEMO){msgText=DEMO_OPEN?'DEMO: votes are not saved.':'DEMO: fake results for previewing the reveal.';route();return;}
  if(!configured){msgText=t('noSave')+' (add your Supabase URL and key in config.js)';route();return;}
  try{
    sb=makeClient({auth:{flowType:'pkce',detectSessionInUrl:true,persistSession:true}});
    const {data:{session},error}=await sb.auth.getSession();
    if(error)throw error;
    if(!session||session.user.is_anonymous){needLogin=true;route();return;}
    user=session.user;online=true;
    if(!await loadData()){fatal=navigator.onLine?'The server did not respond.':t('offline');route();return;}
    await checkConsent();route();
  }catch(e){fatal=e.message||String(e);route();}
})();
