(function(){
'use strict';
const D=window.TAROT;
const T=window.I18N.T;
const CARDS=D.cards, LIB=D.library, BYID={}; CARDS.forEach((c,i)=>{c.i=i;BYID[c.id]=c});
const IMGDIR='images/cards/';
const $=(s,r)=>(r||document).querySelector(s);
function h(tag,attrs,...kids){const e=tag==='svg'?document.createElementNS('http://www.w3.org/2000/svg','svg'):document.createElement(tag);
  if(attrs)for(const k in attrs){const v=attrs[k];if(v==null||v===false)continue;
    if(k==='class')e.className=v;else if(k.startsWith('on'))e.addEventListener(k.slice(2),v);else if(k==='html')e.innerHTML=v;else e.setAttribute(k,v===true?'':(k==='placeholder'||k==='title'||k==='aria-label'||k==='alt')?T(String(v)):v)}
  kids.flat(9).forEach(k=>{if(k==null||k===false)return;e.append(k.nodeType?k:document.createTextNode(typeof k==='string'?T(k):k))});return e}
const store={get(k,d){try{const v=localStorage.getItem('tarot.'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('tarot.'+k,JSON.stringify(v))}catch(e){}}};
let favs=new Set(store.get('fav',[]));
let saved=store.get('readings',[]);
const ROM=['0','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI'];
const RK={Ace:'A',Page:'Pg',Knight:'Kn',Queen:'Q',King:'K'};
const GLYPH={
 major:'<path d="M24 4l4 16 16 4-16 4-4 16-4-16-16-4 16-4z"/>',
 Wands:'<path d="M24 4v40M24 13c-6-2-9-6-9-10 5 0 9 4 9 10zM24 23c6-2 9-6 9-10-5 0-9 4-9 10zM24 33c-6-2-9-6-9-10 5 0 9 4 9 10z"/>',
 Cups:'<path d="M9 10h30c0 11-6 19-15 19S9 21 9 10zM24 29v11M14 42h20"/>',
 Swords:'<path d="M24 3l4 6v23h-8V9zM13 32h22M24 32v12"/>',
 Pentacles:'<circle cx="24" cy="24" r="19"/><path d="M24 11l7.1 21.7L12.6 19.3h22.8L16.9 32.7z"/>'};
const norm=s=>(s||'').toLowerCase();
const paraText=a=>(a||[]).map(p=>p.x).join(' ');
function face(c,o){o=o||{};
  const file=o.back?'CardBacks.png':c.img;
  if(!file)return faceDrawn(c,o);
  const e=h('div',{class:'cf pic'+(o.rev?' rev':'')+(o.back?' back':''),style:o.w?'--w:'+o.w+'px':null,'aria-hidden':'true'});
  const im=h('img',{src:IMGDIR+file,alt:'',loading:'lazy',draggable:'false'});
  im.addEventListener('error',()=>{const d=faceDrawn(c,o);e.replaceWith(d)});
  e.append(im);return e}
function faceDrawn(c,o){o=o||{};
  const num=c.arcana==='major'?ROM[c.num]:(RK[c.rank]||c.num);
  const e=h('div',{class:'cf '+(c.suit?'s-'+c.suit:'')+(o.rev?' rev':'')+(o.back?' back':''),style:o.w?'--w:'+o.w+'px':null,'aria-hidden':'true'},
    h('span',{class:'n'},num),h('svg',{viewBox:'0 0 48 48',html:GLYPH[c.suit||'major']}),h('span',{class:'t'},c.name));
  e.querySelector('svg').innerHTML=GLYPH[c.suit||'major'];return e}
function toast(m){const t=h('div',{class:'toast',role:'status'},m);document.body.append(t);setTimeout(()=>t.remove(),1800)}
function copy(txt,ok){const f=()=>{const ta=h('textarea',{style:'position:fixed;opacity:0'});ta.value=txt;document.body.append(ta);ta.select();try{document.execCommand('copy');toast(ok||'Copied')}catch(e){toast('Select and copy manually')}ta.remove()};
  if(navigator.clipboard)navigator.clipboard.writeText(txt).then(()=>toast(ok||'Copied'),f);else f()}
/* ---------- search index ---------- */
const TOPICS={Love:['love','romance','relationship','marriage','married','partner','affair','affection','spouse','sexual','lover'],
 Career:['career','job','profession','promotion','employ','boss','office','business','work','colleague','leader'],
 Money:['money','financ','wealth','income','profit','invest','prosper','debt','loan','asset','payment','salary','material'],
 Health:['health','illness','disease','physical','body','depress','anxiety','healing','surgery','pregnan','conception','miscarriage','fitness'],
 Family:['family','mother','father','child','home','parent','sibling','ancest'],
 Study:['exam','study','education','learn','academic','student','knowledge','teacher'],
 Travel:['travel','journey','foreign','relocat','abroad'],
 Spirit:['spiritual','intuition','divine','meditat','soul','karma','occult','mystic'],
 Legal:['legal','court','lawsuit','litigation','contract','verdict']};
const IDX=CARDS.map(c=>{const m=c.meta||{};
  const meta=[c.suit,c.arcana,c.rank,m.Archetype,m.Task,m.Element,m['Crystal Guidance'],m['Color Guidance'],m.Planets,m['Astrological Significance'],m['Favourable Color'],m['Chakra Associated'],(c.keywords||[]).join(' '),c.crystals,c.gems,c.rating,
    c.astro&&[c.astro.zodiac,c.astro.planet,c.astro.houseName].join(' ')].join(' ');
  return {name:norm(c.name+' '+window.I18N.name(c)+' '+c.num+(c.arcana==='major'?' '+ROM[c.num]:'')+' '+(c.rank?c.rank+' '+c.suit:'')),meta:norm(meta),up:norm(paraText(c.body)),rev:norm(paraText(c.reversed))}});
function tokens(q){return norm(window.I18N.toEn(q)).replace(/["“”]/g,'').split(/\s+/).filter(Boolean)}
function snippet(text,toks,len){const l=norm(text);let at=-1;for(const t of toks){const k=l.indexOf(t);if(k>=0&&(at<0||k<at))at=k}
  if(at<0)return null;const s=Math.max(0,at-len/3);let sn=text.slice(s,s+len);if(s>0)sn='…'+sn.replace(/^\S*\s/,'');if(s+len<text.length)sn=sn.replace(/\s\S*$/,'')+'…';return sn}
function hl(text,toks){if(!toks||!toks.length)return document.createTextNode(text);
  const re=new RegExp('('+toks.map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')','gi');const f=document.createDocumentFragment();
  text.split(re).forEach((p,i)=>{f.append(i%2?h('mark',null,p):document.createTextNode(p))});return f}
function search(q,scope,filter){const toks=tokens(q);const out=[];
  CARDS.forEach((c,i)=>{if(filter&&!filter(c))return;const ix=IDX[i];let score=0,ok=true,where=null;
    if(toks.length){for(const t of toks){let s=0;
      if(ix.name.includes(t))s=50;else if(scope!=='names'&&ix.meta.includes(t))s=20;
      else if(scope!=='names'){const inUp=scope!=='reversed'&&ix.up.includes(t),inRev=scope!=='upright'&&ix.rev.includes(t);
        if(inUp||inRev){s=5;where=where||(inUp?'up':'rev')}}
      if(!s){ok=false;break}score+=s}}
    if(ok)out.push({c,score,where})});
  if(toks.length)out.sort((a,b)=>b.score-a.score||a.c.i-b.c.i);return out}
/* ---------- rich text ---------- */
function prose(paras,toks,topic){const box=h('div',{class:'prose'});let ul=null,shown=0;
  const re=topic?new RegExp(TOPICS[topic].join('|'),'i'):null;
  (paras||[]).forEach(p=>{const hit=!re||re.test(p.x);if(re&&!hit)return;shown++;
    if(p.t==='b'){if(!ul){ul=h('ul');box.append(ul)}ul.append(h('li',null,hl(p.x,toks)));return}
    ul=null;if(p.t==='h')box.append(h('h4',null,hl(p.x,toks)));else box.append(h('p',null,hl(p.x,toks)))});
  if(re&&!shown)box.append(h('p',{class:'nomatch'},'No passage in this section mentions '+topic.toLowerCase()+'.'));return box}
/* ---------- card detail ---------- */
function toneEl(c){return c.tone?h('span',{class:'tone '+c.tone},c.rating):null}
function detail(c,o){o=o||{};let mode=o.rev?'reversed':'upright',topic=null;const root=h('article',{class:o.modal?'':'detail'});
  const toks=o.toks||[];
  function draw(){root.replaceChildren();
    const m=c.meta;const rows=[];
    const add=(k,v)=>{if(v)rows.push(h('dt',null,k),h('dd',null,v))};
    if(c.arcana==='major'){add('Archetype',m.Archetype);add('Task',m.Task);add('Element',m.Element);add('Crystal guidance',m['Crystal Guidance']);add('Colour guidance',m['Color Guidance'])}
    else{add('Element',m.Element);add('Planets',m.Planets);add('Astrology',m['Astrological Significance']);add('Favourable colour',m['Favourable Color']);add('Chakra',m['Chakra Associated'])}
    const isFav=favs.has(c.id);
    root.append(
      ...(o.crumb?[o.crumb]:[]),
      h('div',{class:'dh'},h('button',{class:'zoom',title:'Enlarge the card','aria-label':'Enlarge '+c.name,onclick:()=>openModal(h('div',{style:'text-align:center;padding:6px'},face(c,{w:Math.min(320,innerWidth-80),rev:mode==='reversed'}),h('h3',{style:'margin-top:10px'},c.name))) },face(c,{w:o.modal?100:140,rev:o.rev&&mode==='reversed'})),
        h('div',{class:'ti'},h('h1',null,c.name),window.I18N.lang==='as'?h('div',{class:'small muted en-name notranslate',lang:'en',translate:'no'},document.createTextNode(c.name)):null,
          h('div',{class:'muted'},c.arcana==='major'?'Major Arcana · Card '+c.num+(c.num?' ('+ROM[c.num]+')':''):c.suit+' · '+c.rank+' (value '+c.num+')'),
          toneEl(c),
          h('div',{class:'ctl'},
            h('button',{class:'btn sm','aria-pressed':isFav,onclick:()=>{favs.has(c.id)?favs.delete(c.id):favs.add(c.id);store.set('fav',[...favs]);draw()}},isFav?'★ Saved':'☆ Save card'),
            h('button',{class:'btn sm',onclick:()=>copy(c.name+'\n'+(c.keywords?c.keywords.join(', ')+'\n':'')+(c.reversed&&mode==='reversed'?paraText(c.reversed.slice(0,2)):paraText(c.body.slice(0,2))),'Summary copied')},'Copy summary')))),
      h('dl',{class:'meta'},rows),
      c.keywords?h('div',{class:'chips',style:'margin-top:14px'},c.keywords.map(k=>h('a',{class:'chip',href:'#cards',onclick:e=>{e.preventDefault();state.q=k;state.scope='all';location.hash='cards'}},k))):null,
      h('div',null,h('div',{class:'seg',role:'group','aria-label':'Orientation'},
        ['upright','reversed','both'].map(k=>h('button',{'aria-pressed':mode===k,onclick:()=>{mode=k;draw()}},k[0].toUpperCase()+k.slice(1)))),
        h('div',{class:'chips',style:'margin-top:8px'},h('span',{class:'small muted',style:'align-self:center'},'Show passages about'),
          Object.keys(TOPICS).map(t=>h('button',{class:'chip','aria-pressed':topic===t,onclick:()=>{topic=topic===t?null:t;draw()}},t)))));
    if(mode!=='reversed')root.append(h('section',{class:'sect'},h('h3',null,'Upright',h('small',null,'Tarot Secrets Unveiled, Vol I')),prose(c.body,toks,topic)));
    if(mode!=='upright')root.append(h('section',{class:'sect'},h('h3',null,'Reversed',h('small',null,'Vol II, Chapter 3')),h('div',{class:'revbox'},prose(c.reversed,toks,topic)),
      h('p',{class:'small muted'},'A reversed card often marks blocked or surplus energy. See ',h('a',{href:'#lib-v2-c2'},'Chapter 2, Tarot Reversal'),'.')));
    root.append(assoc(c));
    if(!o.modal)root.append(h('div',{class:'navrow'},
      c.i>0?h('a',{class:'btn sm',href:'#card-'+CARDS[c.i-1].id},'← '+CARDS[c.i-1].name):h('span'),
      c.i<CARDS.length-1?h('a',{class:'btn sm',href:'#card-'+CARDS[c.i+1].id},CARDS[c.i+1].name+' →'):h('span')));
    else root.append(h('p',null,h('a',{class:'btn sm',href:'#card-'+c.id,onclick:()=>closeModal()},'Open full card page')))}
  draw();return root}
function assoc(c){const s=h('section',{class:'sect'},h('h3',null,'Associations',h('small',null,'Vol I and Vol II')));const a=c.astro||{};const rows=[];
  const add=(k,v)=>{if(v)rows.push(h('dt',null,k),h('dd',null,v))};
  if(c.arcana==='major'){add('Crystals',c.crystals);add('Precious gems',c.gems);add('Zodiac sign',a.zodiac);add('Planet',a.planet);
    if(a.house)add('Kaal Purush house',a.house+'. '+a.houseName+': '+a.houseMeaning);if(a.yearNumber)add('Year number',a.yearNumber+' (governs the year when the projected year number is '+a.yearNumber+')');
    if(!a.zodiac&&!a.planet&&!a.house)add('Zodiac / planet','The book does not link this card to a sign or planet.')}
  else{add('Suit element',c.meta.Element);add('Planets',c.meta.Planets);add('Chakra',c.meta['Chakra Associated'])}
  xAssoc(c,add);
  s.append(h('dl',{class:'meta'},rows));
  if(a.zodiacText)s.append(h('h4',{style:'margin:16px 0 4px'},a.zodiac+' and '+c.name),prose(a.zodiacText));
  if(a.planetText)s.append(h('h4',{style:'margin:16px 0 4px'},a.planet+' and '+c.name),prose(a.planetText));
  s.append(h('p',{class:'small'},c.arcana==='major'?h('a',{href:'#lib-v1-c8'},'Major Arcana chapter (Fool\'s Journey, Ready Reckoner)'):h('a',{href:'#lib-v1-c9'},'Minor Arcana chapter (suits and elements)'),' · ',h('a',{href:'#lib-v1-c10'},'Numbers and court cards')));
  return s}
/* ---------- state + views ---------- */
const state={q:'',scope:'all',fil:'all',tone:'all',libq:''};
const app=$('#app');
const TABS=[['cards','Cards'],['spreads','Spreads'],['tools','Tools'],['remedies','Remedies'],['guide','Guide'],['library','Books'],['saved','Saved']];
function setTabs(cur){const t=$('#tabs');t.replaceChildren(...TABS.map(([k,l])=>h('a',{href:'#'+k,'aria-current':k===cur?'page':null},l+(k==='saved'&&(favs.size+saved.length)?' ('+(favs.size+saved.length)+')':''))))}
function dailyCard(){const d=new Date();const seed=d.getFullYear()*372+d.getMonth()*31+d.getDate();return CARDS[(seed*7919)%CARDS.length]}
function viewCards(id){
  const c=id?BYID[id]:null;
  const isGroup=!state.q;
  const box=h('div',{class:'browse'+(c?' has-detail':'')});
  const list=h('div',{class:'list'});
  const inp=h('input',{id:'q',type:'search',placeholder:'Search a card, keyword or situation: "Tower", "delay", "marriage", "amber"',value:state.q,autocomplete:'off','aria-label':'Search cards'});
  const results=h('div');
  const FILS=[['all','All 78'],['major','Major'],['Wands','Wands'],['Cups','Cups'],['Swords','Swords'],['Pentacles','Pentacles'],['fav','Saved']];
  const filt=()=>{const f=state.fil,t=state.tone;return x=>(f==='all'||(f==='major'?x.arcana==='major':f==='fav'?favs.has(x.id):x.suit===f))&&(t==='all'||x.tone===t)};
  const chipsEl=h('div',{class:'filters'});
  function drawFilters(){chipsEl.replaceChildren(...FILS.map(([k,l])=>h('button',{class:'chip','aria-pressed':state.fil===k,onclick:()=>{state.fil=k;drawFilters();drawRes()}},l)),
    h('select',{'aria-label':'Filter by book rating',onchange:e=>{state.tone=e.target.value;drawRes()}},[['all','Any rating'],['positive','Positive'],['mixed','Mixed or cautious'],['challenging','Challenging']].map(([v,l])=>h('option',{value:v,selected:state.tone===v},l))))}
  function drawRes(){const toks=tokens(state.q);const r=search(state.q,state.scope,filt());results.replaceChildren();
    results.append(h('p',{class:'small muted',style:'margin:10px 0 0'},toks.length?r.length+' card'+(r.length===1?'':'s')+' match':r.length+' cards',toks.length?[' · ',h('a',{href:'#library',onclick:()=>{state.libq=state.q}},'search the books for “'+state.q+'”')]:null));
    const g=h('div',{class:'grid'});let last=null;
    r.forEach(({c:x,where})=>{
      if(!toks.length){const grp=x.arcana==='major'?'MAJOR ARCANA':x.suit.toUpperCase();if(grp!==last){g.append(h('div',{class:'groupt'},grp));last=grp}}
      const txt=where==='rev'?paraText(x.reversed):paraText(x.body);const sn=where?snippet(txt,toks,130):null;
      g.append(h('a',{class:'tile',href:'#card-'+x.id,'aria-current':c&&c.id===x.id?'true':null},face(x,{w:52}),
        h('div',{class:'tx'},h('b',null,x.name,favs.has(x.id)?' ★':''),h('span',{class:'small muted'},x.arcana==='major'?'Major · '+ROM[x.num]:x.suit),
          x.tone?h('span',{class:'tone '+x.tone},x.rating):null,
          sn?h('span',{class:'snip'},where==='rev'?'Reversed: ':'',hl(sn,toks)):null)))});
    if(!r.length)g.append(h('p',{class:'muted'},'No card matches. Try a single word such as “delay” or “marriage”, or widen the search to all text.'));
    results.append(g)}
  inp.addEventListener('input',()=>{state.q=inp.value;drawRes()});
  const dc=dailyCard();
  list.append(...[h('h1',null,'Find a card'),h('p',{class:'lead'},'Every card from both books: upright meanings, reversed meanings, associations and remedies. Search by name, number, keyword, crystal or any phrase in the text.'),
    h('div',{class:'searchbar'},h('div',{class:'search'},h('svg',{viewBox:'0 0 24 24',html:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'}),inp),
      h('select',{'aria-label':'Search in',onchange:e=>{state.scope=e.target.value;drawRes()}},[['all','Search all text'],['upright','Upright only'],['reversed','Reversed only'],['names','Names only']].map(([v,l])=>h('option',{value:v,selected:state.scope===v},l)))),
    chipsEl,
    h('div',{class:'chips',style:'margin:6px 0 8px'},['love','marriage','money','job','delay','health','travel','court','legal','family','exam','betrayal'].map(k=>h('button',{class:'chip',onclick:()=>{state.q=k;inp.value=k;drawRes();inp.focus()}},k))),
    c?null:h('a',{class:'daily',href:'#card-'+dc.id},face(dc,{w:56}),h('div',null,h('div',{class:'small muted'},'Card of the day'),h('b',{style:'font-family:var(--f-display);font-size:20px;font-weight:400'},dc.name),h('div',{class:'small muted'},dc.keywords?dc.keywords.slice(0,4).join(' · '):dc.rating||''))),
    results].filter(Boolean));
  drawFilters();drawRes();box.append(list);
  if(c){box.append(detail(c,{toks:tokens(state.q),crumb:h('div',{class:'crumb'},h('a',{class:'btn sm',href:'#cards'},'← All cards'))}));document.title=c.name+' · Tarot Reader\'s Desk'}
  else document.title='Tarot Reader\'s Desk';
  app.replaceChildren(box)}
/* ---------- picker modal ---------- */
let modalEl=null;
function closeModal(){if(modalEl){modalEl.remove();modalEl=null}}
function openModal(content){closeModal();modalEl=h('div',{class:'modal',onclick:e=>{if(e.target===modalEl)closeModal()}},h('div',null,h('button',{class:'btn sm x',onclick:closeModal},'Close'),content));document.body.append(modalEl)}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){const q=$('#q');if(q){e.preventDefault();q.focus()}}});
function pickCard(cb){const inp=h('input',{type:'search',placeholder:'Type a card name…',style:'width:100%',id:'pickq','aria-label':'Search for a card'});const res=h('div',{class:'pickres'});
  function go(){res.replaceChildren(...search(inp.value,'names').slice(0,30).map(({c})=>h('button',{class:'tile',onclick:()=>{closeModal();cb(c)}},face(c,{w:36}),h('div',{class:'tx'},h('b',null,c.name),h('span',{class:'small muted'},c.arcana==='major'?'Major':c.suit)))))}
  inp.addEventListener('input',go);openModal(h('div',null,h('h3',null,'Choose a card'),inp,res));go();inp.focus()}
/* ---------- spreads ---------- */
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const SP=[
{id:'single',name:'Guidance of the Day',layout:'row',intro:'One card for the day, called the G.O.D. card in the book. Read it as the message and mood of the day, and keep it in mind as events unfold.',pos:[['Guidance of the day','The theme and energy of the day ahead.']]},
{id:'yesno',name:'Yes or No',layout:'row',yn:true,intro:'For a definite answer to a short, clear question phrased as a question. If the card is ambiguous, draw one supporting card. The book calls this the 1+1 method and uses it only when a single card is unclear.',pos:[['Answer card','Read in the context of the question asked.'],['Supporting card (1+1)','Draw only if the answer card is ambiguous. It can strengthen or reverse the verdict.']],optional:[1]},
{id:'mood',name:'Mood of Your Day',layout:'row',intro:'Three cards that orient your emotional state to get the best from the day.',pos:[['Your mood for the day',''],['Interferences or obstacles',''],['Positive results','']]},
{id:'ppf',name:'Past, Present, Future',layout:'row',intro:'Look first at the middle card, the present situation. Compare it with the past, then see which obstacles or favourable turns follow. Two or more Major Arcana mean a major life event; two or more cards of one suit bring that element into the reading.',pos:[['Past roots of the query','The only slice of time fully understood; the roots of the present.'],['Present situation','Read this card first.'],['Future outcome','Shaped by past patterns and present choices.']]},
{id:'celtic',name:'Celtic Cross',layout:'celtic',intro:'The classic ten-card overview. It looks at past and present, hidden currents, other people\'s views, advice and outcome. Card 2 crosses card 1.',pos:[
 ['1 · Current situation / heart of the matter','Current events and moods, favourable and unfavourable, and the querent\'s state of mind.'],
 ['2 · Obstacle or opposing influence','The challenge a solution must be found for. Even a positive-looking card here shows an imbalance.'],
 ['3 · Unknown / root influence','Past events that created the present, usually not evident now.'],
 ['4 · Known influence / top of the head','An emotion or event already known to be true, weighing on the querent\'s mind.'],
 ['5 · Past influences','Past events that shaped the present and will influence the future if left unchanged.'],
 ['6 · New circumstances / recent future','A person, opportunity, realisation or challenge about to enter.'],
 ['7 · Your self: hopes and fears','The querent\'s aspirations and internal fears. A pivotal card.'],
 ['8 · Surrounding environment','How others see the situation, and the resources available.'],
 ['9 · Guidance / Tarot advice','The route through the situation: an attitude, a person, or advice from the Higher Self.'],
 ['10 · Outcome','Resolution, or a lingering situation. Free will still shapes it.']]},
{id:'relationship',name:'Relationship',layout:'row',intro:'Eight cards for marriage, romance, business partners, friends, mentors or family. The eighth card is the Significator for the querent, taken at the start or the very end.',pos:[
 ['1 · Relationship situation','What is happening now, seen and unseen.'],['2 · Your facilitating contribution','The positive, constructive energy you bring.'],['3 · Their facilitating contribution','The positive energy the other party brings.'],
 ['4 · Your obstructing contribution','Attitudes or behaviour of yours that challenge the relationship.'],['5 · Their obstructing contribution','Attitudes or behaviour of theirs that challenge it.'],
 ['6 · Tarot message / advice','What to do to balance the association.'],['7 · Future shape of the relationship','A prophetic card for where it is heading.'],['8 · Significator (the querist)','Connects the querent\'s character with the insight from cards 1 to 7.']]},
{id:'arrow',name:'5-Card Pointed Arrow',layout:'row',intro:'A quick, responsive spread for resolving a problem.',pos:[['1 · Situation at present',''],['2 · Facilitating factors',''],['3 · Challenging factors',''],['4 · Action required',''],['5 · Result of the action','']]},
{id:'truelove',name:'True Love / New Love',layout:'row',intro:'For what lies ahead in love, what kind of partner is destined, and whether a relationship will bring satisfaction.',pos:[['1 · What you feel','About your partner and the relationship.'],['2 · What your partner feels','About you and the relationship.'],['3 · Combined energy','What the two of you share.'],['4 · Strengths','What can be developed to make it stronger.'],['5 · Major weakness','What to improve in the foundation.'],['6 · Outcome','Potential to sustain and grow in the long term.']]},
{id:'career',name:'Career Path',layout:'row',intro:'Use when you feel stagnation or frustration, face a choice about growth or change of field or location, or run a business and want guidance.',pos:[['1 · Is my current job suitable?',''],['2 · How can I improve my situation?',''],['3 · Latent talent that can bring growth',''],['4 · How much effort I put in now',''],['5 · Root cause / past analysis','Why current performance is what it is.'],['6 · Steps to improve performance',''],['7 · Outcome if I follow the advice','']]},
{id:'mandala',name:'Mandala',layout:'mandala',order:[3,9,5,1,7,2,8,4,6],intro:'For emotional and spiritual growth. Laid out as a 3 by 3 square in the order shown.',pos:[['1 · Self-perception','How the person sees themselves.'],['2 · Life goals',''],['3 · Primary dream',''],['4 · Accomplished so far',''],['5 · Element depended on','May be seen as a weakness.'],['6 · Element to adopt as strength',''],['7 · Guidance for emotional growth',''],['8 · Guidance for spiritual growth',''],['9 · Outcome','How far the desire for growth will be fulfilled.']]},
{id:'houses',name:'Astrological 12-House',layout:'ring',intro:'A horoscope in cards (Vol II, Chapter 7). Lay card 1 at the 9 o\'clock position and continue anticlockwise like a clock. Useful when the birth time or place is unknown. Draw a supporting card for any house the querent wants to explore further. Also used for the yearly forecast: one card per house for the year.',pos:D.houses.map((x,i)=>[(i+1)+' · '+x.name+' ('+x.zodiac+')',x.area+': '+x.meaning])},
{id:'monthly',name:'13-Card Monthly Forecast',layout:'ring',monthly:true,intro:'One card per month for a year, plus a 13th Significator drawn at the end for the overall trend. Draw supplementary cards for months the querent wants studied in depth.',pos:MONTHS.map(m=>[m,'Message for the month']).concat([['Year overall (Significator)','Overall trend of the year']])},
{id:'chakra',name:'7-Chakra',layout:'col',intro:'Seven cards, one per chakra, read from crown to root. Read each card as the state of that energy centre. Chapter 15 of Vol II covers chakras, crystals and the healing grid.',pos:[['Crown · Sahasrara',''],['Third eye · Ajna',''],['Throat · Vishuddha',''],['Heart · Anahata',''],['Solar plexus · Manipura',''],['Sacral · Svadhisthana',''],['Root · Muladhara','']]}
];
function firstSent(x){const t=T(x);const i=t.search(/(?:[।.])\s/);const f=(i>0?t.slice(0,i):t).replace(/[।.]+$/,'');return f+(window.I18N.lang==='as'?'।':'.')}
function rnd(n){const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%n}
function cardVal(c){return c.num}
function reduce1to9(n){while(n>9)n=String(n).split('').reduce((a,b)=>a+ +b,0);return n}
const QN={1:'The number of Action. Single minded. Independent. You must be innovative and motivated to succeed in your plan.',2:'The number of Negotiation. Cooperative and laid back; adapt to circumstances to fulfil your dreams.',3:'The number of Communication. Express yourself through a creative outlet; fun loving and adventurous relationships will help your journey.',4:'The number of realistic thinking. If you are practical and self reliant you can turn any situation to your advantage.',5:'The number of Creative Advantage. Be more outgoing, exploring and questioning of others\' motives.',6:'The number of the Protector. Be of service and bring out your nurturing side, but do not let others decide your future.',7:'The number of Mysticism. You will meet people involved in healing. Listen to your intuition for the answer to the current dilemma.',8:'The number of Ambition. A secret inner drive for success and power. Plan ahead, sort out finances and results will match your goal.',9:'The number of Vision. Extraordinary vision for the future but following things through is hard. Avoid promises you cannot fulfil.'};
function quint(cards){const tot=cards.reduce((a,c)=>a+cardVal(c),0);let q=tot;while(q>22)q-=22;
  const qc=q===22?CARDS[0]:CARDS[q];return {tot,n:reduce1to9(tot),card:qc,q22:q===22}}
function viewSpreads(id){const sp=id==='custom'?customSP:SP.find(s=>s.id===id);if(id==='custom'&&!customSP)return customForm();if(!sp){document.title='Spreads · Tarot Reader\'s Desk';
  app.replaceChildren(h('h1',null,'Spreads'),h('p',{class:'lead'},SP.length+' layouts from the two books, plus a builder for your own. Draw cards at random, or lay out your own physical deck and pick each card by name.'),
   h('div',{class:'spgrid'},SP.map(s=>h('a',{class:'spcard',href:'#spread-'+s.id},h('b',null,s.name),h('span',{class:'small muted'},s.id==='custom'?'Any number of cards':s.pos.length+(s.pos.length===1?' card':' cards')),h('span',{class:'small'},firstSent(s.intro))))),
   h('p',{class:'small muted'},'Full spread descriptions: ',h('a',{href:'#lib-v1-c7'},'Vol I, Chapter 7'),' and ',h('a',{href:'#lib-v2-c7'},'Vol II, Chapter 7'),'.'));return}
  document.title=sp.name+' · Tarot Reader\'s Desk';
  const slots=sp.pos.map(()=>null);let reversals=true,revealed=sp.pos.map(()=>false);
  const out=h('div'),ins=h('div');
  function used(){return new Set(slots.filter(Boolean).map(s=>s.c.id))}
  function drawAll(){const pool=(POOLOF(sp)).slice();for(let i=pool.length-1;i>0;i--){const j=rnd(i+1);[pool[i],pool[j]]=[pool[j],pool[i]]}
    sp.pos.forEach((p,i)=>{if(sp.optional&&sp.optional.includes(i)){slots[i]=null;return}slots[i]={c:pool[i],rev:reversals&&rnd(2)===1};revealed[i]=false});render()}
  function drawOne(i){const u=used();let c;const PL=POOLOF(sp);do{c=PL[rnd(PL.length)]}while(u.has(c.id));slots[i]={c,rev:reversals&&rnd(2)===1};revealed[i]=false;render()}
  function slotEl(i){const s=slots[i],p=sp.pos[i];
    const el=h('div',{class:'slot',style:sp.layout==='celtic'?'grid-area:'+(i<6?['p1','p2','p3','p4','p5','p6'][i]:'s'+(i+1)):null});
    const face_=s?face(s.c,{rev:s.rev&&revealed[i],back:!revealed[i]}):h('div',{class:'pk'},'empty');
    const btn=h('button',{class:'slot',style:'width:auto',title:p[1]||p[0],onclick:()=>{if(!s)return drawOne(i);if(!revealed[i]){revealed[i]=true;render()}else openModal(detail(s.c,{rev:s.rev,modal:true,toks:[]}))},'aria-label':p[0]+(s?(revealed[i]?': '+s.c.name+(s.rev?' reversed':''):': face down, tap to reveal'):': empty, tap to draw')},face_);
    const ring=sp.layout==='ring';const lab=ring?(sp.monthly?(i<12?MONTHS[i].slice(0,3):'Year'):(i+1)+' '+(window.I18N.lang==='as'?T(D.houses[i].zodiac):D.houses[i].zodiac.slice(0,3))):p[0];
    el.append(...[btn,h('span',{class:'pn',title:p[0]},lab),s&&revealed[i]&&!ring?h('span',{class:'cn'},s.c.name,s.rev?h('span',{class:'revtag'},' REVERSED'):null):null].filter(Boolean));
    if(sp.layout==='celtic'&&i===1){el.style.cssText='grid-area:p1;transform:rotate(90deg);z-index:2;margin:auto;pointer-events:none;opacity:.96';btn.style.pointerEvents='auto';el.querySelector('.pn').style.display='none';
      const wrap=h('div',{style:'display:contents'});}
    if(sp.layout==='celtic'&&i===1){const cn2=el.querySelector('.cn');if(cn2)cn2.style.display='none'}
    if(sp.layout==='celtic'&&i===0&&slots[1]&&revealed[1]){const cn0=el.querySelector('.cn');if(cn0)cn0.append(h('div',{class:'small muted'},'crossed by '+slots[1].c.name+(slots[1].rev?' (reversed)':'')))}
    const tools=h('div',{class:'ctl',style:'justify-content:center'},h('button',{class:'btn sm',onclick:()=>pickCard(c=>{slots[i]={c,rev:slots[i]?slots[i].rev:false};revealed[i]=true;render()})},'Pick'),
      s?h('button',{class:'btn sm',onclick:()=>{slots[i].rev=!slots[i].rev;revealed[i]=true;render()}},'Flip'):h('button',{class:'btn sm',onclick:()=>drawOne(i)},'Draw'));
    if(ring){el.append(h('button',{class:'btn sm',style:'padding:2px 8px;font-size:12px',onclick:()=>pickCard(c=>{slots[i]={c,rev:slots[i]?slots[i].rev:false};revealed[i]=true;render()})},'Pick'))}else if(!(sp.layout==='celtic'&&i===1))el.append(tools);return el}
  function render(){out.replaceChildren();const lay=h('div',{class:'layout '+({row:'row',celtic:'celtic',mandala:'mandala',ring:'ring',col:'col'}[sp.layout])});
    const order=sp.order?sp.order.map(n=>n-1):sp.pos.map((_,i)=>i);
    if(sp.layout==='ring'){const n=sp.monthly?12:12;order.forEach(i=>{const el=slotEl(i);let ang;
        if(i<12){const hour=sp.monthly?(i+1):(((9-i)%12)+12)%12||12;ang=(30*hour-90)*Math.PI/180;el.style.left=(50+40*Math.cos(ang))+'%';el.style.top=(50+40*Math.sin(ang))+'%'}
        else{el.style.left='50%';el.style.top='50%'}lay.append(el)})}
    else order.forEach(i=>lay.append(slotEl(i)));
    out.append(lay);
    const done=slots.filter(Boolean);ins.replaceChildren();
    if(done.length){const all=done.length,vis=slots.map((s,i)=>s&&revealed[i]?s:null).filter(Boolean);
      const majors=done.filter(s=>s.c.arcana==='major').length,rev=done.filter(s=>s.rev).length;const suits={};done.forEach(s=>{if(s.c.suit)suits[s.c.suit]=(suits[s.c.suit]||0)+1});
      const dom=Object.entries(suits).filter(([k,v])=>v>=2);const courts=done.filter(s=>s.c.rank&&['Page','Knight','Queen','King'].includes(s.c.rank)).length;
      const q=quint(done.map(s=>s.c));const ELEM={Wands:'fire',Cups:'water',Swords:'air',Pentacles:'earth'};
      ins.append(h('section',{class:'panel'},h('h3',null,'Reading notes'),
        h('div',{class:'insight'},
          h('div',null,h('b',null,'Major Arcana'),majors?majors+' of '+all+(majors>=2?'. Two or more Majors point to a major event or life experience.':'. A Major card carries extra weight.'):'None drawn. Everyday matters.'),
          h('div',null,h('b',null,'Suits'),dom.length?dom.map(([k,v])=>v+' × '+k+' brings the '+ELEM[k]+' element into the reading.').join(' '):'No suit repeats.',courts?' '+courts+' court card'+(courts>1?'s':'')+' (people or approaches).':''),
          h('div',null,h('b',null,'Reversed'),rev?rev+' reversed. Look for blocked or surplus energy in those positions.':'No reversed cards.'),
          h('div',null,h('b',null,'Quintessential number (Vol II, Ch 9)'),h('span',{class:'big'},q.n),h('div',{class:'small'},'Total '+q.tot+'. '+QN[q.n])),
          h('div',null,h('b',null,'Quintessential card'),h('a',{href:'#card-'+q.card.id,style:'font-family:var(--f-display);font-size:20px'},q.card.name),h('div',{class:'small'},q.q22?'Total reduces to 22, the Fool counted as card 22. ':'Total '+q.tot+(q.tot>22?' minus 22 as needed':'')+'. ',(q.card.keywords||[]).slice(0,4).join(', ')))),
        h('p',{class:'small muted'},'Card values: Major Arcana by number (Fool 0), Ace to Ten 1 to 10, Page 11, Knight 12, Queen 13, King 14, as the book recommends.')));
      if(sp.yn&&slots[0]){const s0=slots[0];const t=s0.c.tone;const lean=!t?'The book gives no rating for this Major card. Judge it with a supporting card.':(t==='positive'?(s0.rev?'Upright it would lean yes; reversed, treat as unclear and draw a supporting card.':'Leans yes.'):t==='challenging'?(s0.rev?'Unclear when reversed; draw a supporting card.':'Leans no.'):'Mixed. Draw a supporting card.');
        ins.append(h('section',{class:'panel'},h('h3',null,'Yes or No'),h('p',null,h('b',null,s0.c.name+(s0.rev?' (reversed)':'')),' · ',s0.c.rating||'Major Arcana'),h('p',null,lean),h('p',{class:'small muted'},'This quick lean is a reading aid derived from the book\'s card rating. The book\'s own examples treat Knight of Pentacles, Chariot and King of Wands as yes, and Strength and 7 of Cups as no.')))}
      if(sp.chakraData)ins.append(chakraTable(slots,sp));if(sp.planetData)ins.append(planetTable(slots));if(sp.healthData)ins.append(healthPanel(slots));
      const sv=h('textarea',{id:'note',placeholder:'Notes for this reading (question, client, interpretation)…'});
      ins.append(h('section',{class:'panel'},h('h3',null,'Summary'),h('div',{class:'tw'},h('table',{class:'tbl'},h('thead',null,h('tr',null,['Position','Card','Key points'].map(x=>h('th',null,x)))),
        h('tbody',null,slots.map((s,i)=>s?h('tr',null,h('td',null,sp.pos[i][0]),h('td',null,h('a',{href:'#card-'+s.c.id},s.c.name),s.rev?h('span',{class:'revtag'},' REVERSED'):null),h('td',{class:'small'},s.c.keywords?s.c.keywords.join(', '):(s.c.rating||''))):null)))),
        h('div',{style:'margin-top:12px'},sv),
        h('div',{class:'ctl',style:'margin-top:10px'},h('button',{class:'btn primary',onclick:()=>{saved.unshift({id:Date.now(),spread:sp.name,date:new Date().toISOString().slice(0,16).replace('T',' '),note:sv.value,cards:slots.map((s,i)=>s?{p:sp.pos[i][0],c:s.c.id,r:s.rev}:null).filter(Boolean)});store.set('readings',saved);toast('Reading saved');setTabs('spreads')}},'Save reading'),
          h('button',{class:'btn',onclick:()=>copy(sp.name+'\n'+slots.map((s,i)=>s?sp.pos[i][0]+': '+s.c.name+(s.rev?' (reversed)':''):null).filter(Boolean).join('\n')+'\nQuintessential number '+q.n+', card '+q.card.name+(sv.value?'\n\n'+sv.value:''),'Reading copied')},'Copy as text'))))}
  }
  const rv=h('input',{type:'checkbox',id:'rv',checked:true,onchange:e=>{reversals=e.target.checked}});
  app.replaceChildren(h('div',{class:'crumb'},h('a',{class:'btn sm',href:'#spreads'},'← All spreads')),h('h1',null,sp.name),h('p',{class:'lead'},sp.intro),
    h('div',{class:'ctl',style:'margin-top:14px'},h('button',{class:'btn primary',onclick:drawAll},slots.some(Boolean)?'Reshuffle and draw':'Shuffle and draw'),h('button',{class:'btn',onclick:()=>{slots.fill(null);revealed.fill(false);render()}},'Clear'),
      h('button',{class:'btn',onclick:()=>{revealed=revealed.map(()=>true);render()}},'Reveal all'),h('label',{class:'small'},rv,' Allow reversed cards')),
    h('p',{class:'small muted'},'Using a physical deck? Tap Pick on each position and choose the card you drew. Tap a face-down card to reveal it, tap again to read it.'),
    popPanel(),out,ins,
    h('details',{class:'panel'},h('summary',{style:'cursor:pointer;font-weight:600'},'What each position means'),h('div',{class:'tw'},h('table',{class:'tbl'},h('tbody',null,sp.pos.map(p=>h('tr',null,h('td',{style:'white-space:nowrap'},p[0]),h('td',{class:'small'},p[1]))))))));
  render()}
/* ---------- numbers ---------- */
const WD=[['Sunday',1,'Sun'],['Monday',2,'Moon'],['Tuesday',9,'Mars'],['Wednesday',5,'Mercury'],['Thursday',3,'Jupiter'],['Friday',6,'Venus'],['Saturday',8,'Saturn']];
function numPanels(){
  const yr=new Date().getFullYear();
  const dob=h('input',{type:'date',id:'dob','aria-label':'Date of birth'}),py=h('input',{type:'number',id:'py',value:yr,min:1900,max:2200,'aria-label':'Year to examine',style:'width:100px'});
  const yout=h('div');
  function calc(){yout.replaceChildren();if(!dob.value)return yout.append(h('p',{class:'muted'},'Enter a date of birth to see the year number and its governing card.'));
    const [,m,d]=dob.value.split('-').map(Number);const Y=+py.value;let dd=d,note='';const dt=new Date(Y,m-1,dd);if(dt.getMonth()!==m-1){dd=28;note='29 February does not fall in '+Y+', so 28 February is used.'}
    const wd=WD[new Date(Y,m-1,dd).getDay()];const sum=m+d+(Y%100)+wd[1];const n=reduce1to9(sum);const card=BYID[CARDS.find(c=>c.name===D.year[n]).id];
    yout.append(h('div',{class:'panel'},h('div',{class:'small muted'},'Projected year number for '+Y),h('div',{class:'big'},n),
      h('p',null,'Month '+m+' + date '+d+' + year '+String(Y%100).padStart(2,'0')+' + weekday value '+wd[1]+' ('+wd[0]+', ruled by '+wd[2]+') = '+sum+(sum>9?' → '+n:''),'. ',note),
      h('div',{class:'dh'},face(card,{w:90}),h('div',{class:'ti'},h('h3',null,'Governed by '+card.name),h('p',{class:'small'},'The year number takes on the energy of this Major Arcana card. Adopt its qualities through the year.'),h('a',{class:'btn sm',href:'#card-'+card.id},'Open '+card.name)))));yout.append(trendEl(n))}
  dob.addEventListener('input',calc);py.addEventListener('input',calc);
  const picks=[];const plist=h('div',{class:'chips'}),qout=h('div');
  function qdraw(){plist.replaceChildren(...picks.map((c,i)=>h('button',{class:'chip',title:'Remove',onclick:()=>{picks.splice(i,1);qdraw()}},c.name+' ('+c.num+') ✕')));qout.replaceChildren();
    if(!picks.length)return qout.append(h('p',{class:'muted'},'Add the cards of a reading to find its quintessential number and card.'));const q=quint(picks);
    qout.append(h('div',{class:'insight'},h('div',null,h('b',null,'Total'),h('span',{class:'big'},q.tot)),h('div',null,h('b',null,'Quintessential number'),h('span',{class:'big'},q.n),h('div',{class:'small'},QN[q.n])),h('div',null,h('b',null,'Quintessential card'),h('a',{href:'#card-'+q.card.id,style:'font-family:var(--f-display);font-size:22px'},q.card.name))))}
  qdraw();calc();
  return [
    h('section',{class:'panel'},h('h2',null,'Projected year number'),h('div',{class:'ctl',style:'margin:10px 0'},h('label',{for:'dob'},'Born '),dob,h('label',{for:'py'},' Year '),py),yout,
      h('p',{class:'small muted'},'Method: birth month + birth date + last two digits of the year + the number of the weekday on which the birthday falls in that year (Sun 1, Mon 2, Tue 9, Wed 5, Thu 3, Fri 6, Sat 8), reduced to one digit. Year 1 to 9 map to The Magician, High Priestess, Empress, Emperor, Hierophant, Lovers, Chariot, Strength, Hermit. ',h('a',{href:'#lib-v2-c8'},'Read the chapter'),'.')),
    h('section',{class:'panel'},h('h2',null,'Quintessential number and card'),h('div',{class:'ctl',style:'margin:10px 0'},h('button',{class:'btn',onclick:()=>pickCard(c=>{picks.push(c);qdraw()})},'Add card'),h('button',{class:'btn',onclick:()=>{picks.length=0;qdraw()}},'Clear')),plist,qout,
      h('p',{class:'small muted'},'Add the values of all cards (Majors by number, Fool 0, Ace to Ten 1 to 10, Page 11, Knight 12, Queen 13, King 14). Reduce the total to 1 to 9 for the number. For the card, subtract 22 until the total is 22 or less; the result is the Major Arcana card of that number. ',h('a',{href:'#lib-v2-c9'},'Read the chapter'),'.'))]}
/* ---------- library ---------- */
function viewLibrary(id){document.title='Books · Tarot Reader\'s Desk';
  const ch=LIB.find(x=>x.id===id);const toc=h('nav',{class:'toc','aria-label':'Chapters'});
  let lastVol='';LIB.forEach(x=>{if(x.vol!==lastVol){toc.append(h('h4',null,x.vol==='I'?'VOL I · TAROT SECRETS UNVEILED':'VOL II · TAROT REMEDIES & HEALING'));lastVol=x.vol}toc.append(h('a',{href:'#lib-'+x.id,'aria-current':ch&&ch.id===x.id?'page':null},x.title.replace(/^Chapter /,'Ch ')))});
  const main=h('div',{style:'min-width:0'});
  const inp=h('input',{type:'search',id:'libq',placeholder:'Search both books…',value:state.libq,'aria-label':'Search the books',style:'width:100%'});
  const body=h('div');
  function draw(){const toks=tokens(state.libq);body.replaceChildren();
    if(toks.length>0&&(toks.join(' ').length>=2)){const hits=[];
      LIB.forEach(x=>x.body.forEach(p=>{const l=norm(p.x);if(toks.every(t=>l.includes(t)))hits.push({x,p})}));
      CARDS.forEach(c=>{const l=norm(c.name);if(toks.every(t=>l.includes(t)))hits.unshift({card:c})});
      body.append(h('p',{class:'muted small'},hits.length+' passage'+(hits.length===1?'':'s')+(hits.length>150?' (showing 150)':'')),
        ...hits.slice(0,150).map(({x,p,card})=>card?h('a',{class:'hit',href:'#card-'+card.id},h('small',null,'Card'),h('span',null,card.name)):h('a',{class:'hit',href:'#lib-'+x.id},h('small',null,x.title),h('span',null,hl(snippet(p.x,toks,220)||p.x.slice(0,220),toks)))));return}
    if(!ch){body.append(h('div',{class:'prose'},h('p',null,'Choose a chapter on the left, or search across both books. Card meanings are on each card page; this section holds everything else: history, symbols, deck care, spreads, reversals, astrology, numerology, remedies with crystals, mantras, yantras, rudraksha, chakras, angels and the Fool\'s Journey.')));return}
    body.append(h('h2',{style:'margin-bottom:14px'},ch.title),prose(ch.body,[]));
    if(ch.id==='v2-c3'){body.append(prose(D.pre_reversed,[]),h('h3',{style:'margin:20px 0 10px'},'Reversed meanings, all 78 cards'),
      h('div',{class:'tw'},h('table',{class:'tbl'},h('thead',null,h('tr',null,h('th',null,'Card'),h('th',null,'Reversed meanings'))),h('tbody',null,CARDS.map(c=>h('tr',null,h('td',null,h('a',{href:'#card-'+c.id},c.name)),h('td',{class:'prose',style:'font-size:15px'},c.reversed.map(p=>h('p',{style:'margin:0 0 .4em'},p.x))))))))) }
    const i=LIB.indexOf(ch);body.append(h('div',{class:'navrow'},i>0?h('a',{class:'btn sm',href:'#lib-'+LIB[i-1].id},'← '+LIB[i-1].title.replace(/^Chapter /,'Ch ')):h('span'),i<LIB.length-1?h('a',{class:'btn sm',href:'#lib-'+LIB[i+1].id},LIB[i+1].title.replace(/^Chapter /,'Ch ')+' →'):h('span')))}
  inp.addEventListener('input',()=>{state.libq=inp.value;draw()});
  main.append(h('h1',null,'The books'),h('p',{class:'lead'},'The full text of both volumes outside the card entries. Search across everything or read chapter by chapter.'),h('div',{class:'searchbar'},h('div',{class:'search'},h('svg',{viewBox:'0 0 24 24',html:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'}),inp)),body);
  app.replaceChildren(h('div',{class:'lib'},toc,main));draw();if(ch&&!tokens(state.libq).length)window.scrollTo(0,0)}
/* ---------- saved ---------- */
function viewSaved(){document.title='Saved · Tarot Reader\'s Desk';
  const fl=[...favs].map(i=>BYID[i]).filter(Boolean);
  app.replaceChildren(h('h1',null,'Saved'),h('p',{class:'lead'},'Starred cards and saved readings stay in this browser only.'),
    h('section',{class:'panel'},h('h2',null,'Cards'),fl.length?h('div',{class:'grid'},fl.map(c=>h('a',{class:'tile',href:'#card-'+c.id},face(c,{w:48}),h('div',{class:'tx'},h('b',null,c.name))))):h('p',{class:'muted'},'No saved cards yet. Open a card and choose Save card.')),
    h('section',{class:'panel'},h('h2',null,'Readings'),saved.length?saved.map((r,i)=>h('div',{class:'panel',style:'background:var(--surface2)'},h('div',{class:'ctl',style:'justify-content:space-between'},h('b',null,r.spread+' · '+r.date),h('button',{class:'btn sm',onclick:()=>{saved.splice(i,1);store.set('readings',saved);viewSaved();setTabs('saved')}},'Delete')),
      h('div',{class:'chips',style:'margin:8px 0'},r.cards.map(x=>h('a',{class:'chip',href:'#card-'+x.c},x.p.split(' · ').pop()+': '+(BYID[x.c]||{}).name+(x.r?' (rev)':'')))),r.note?h('p',{style:'white-space:pre-wrap'},r.note):null)):h('p',{class:'muted'},'No saved readings yet. Draw a spread and choose Save reading.')),
    h('footer',null,'Content is drawn from Tarot Secrets Unveiled Vol I (Secrets Unveiled, 78 Rays to Power & Peace) and Vol II (Tarot Remedies & Healing) by Rrachita Gupta ‘Ravera’, edited by Dr. Arun Bansal, AIFAS. Card images are loaded from the images/cards folder.'))}
/* ---------- extras: tools, remedies, guide ---------- */
const REF={
 care:['v2-c11',33,153,'Crystals: forms, selection, cleansing, programming and case studies','Vol II, Chapter 11. What crystals are, the forms available, how to choose them, cleanse them and programme them, plus the book\'s case studies of using a spread to choose gems and crystals.'],
 mantras:['v2-c12',3,999,'Mantras as remedy','Vol II, Chapter 12. Using mantras with tarot knowledge; the chakra and planet table and the planet mantras are also in Remedies, Planets and gems.'],
 gomti:['v2-c13',3,999,'Gomti Chakra as remedy','Vol II, Chapter 13.'],
 meditation:['v2-c17',3,999,'Meditation as remedy','Vol II, Chapter 17.'],
 energy:['v2-c15',0,41,'The energy body: chakras, nadis and koshas','Vol II, Chapter 15, first part: what chakras are, their place in the etheric body, the nadis (Ida, Pingala, Sushumna) and the five koshas. Chakra by chakra detail is in Remedies, Chakras.'],
 rays:['v2-c15',89,999,'Seven rays, the chakra spread, Shivalingams and the healing grid','Vol II, Chapter 15, second part.'],
 karma:['v2-c5',-1,57,'Karma, destiny and free will','Vol II, Chapter 5: why tarot works, destiny versus free will, and the three kinds of karma (Prarabdha, Sanchitta, Kriyamana).'],
 triplicity:['v2-c5',90,98,'Triplicity of the zodiac and the suits','Vol II, Chapter 5. Fire signs go with Wands, Water with Cups, Air with Swords and Earth with Pentacles.'],
 zero:['v2-c8',7,15,'The role of zero and master numbers','Vol II, Chapter 8.']};
function refView(k){const r=REF[k];const ch=LIB.find(c=>c.id===r[0]);let a=r[1];if(a<0){a=ch.body.findIndex(p=>/Destiny vs Free Will|practised as a method of changing/i.test(p.x));if(a<0)a=34}
  return h('section',{class:'panel'},h('h2',null,r[3]),h('p',{class:'small muted'},r[4]),prose(ch.body.slice(a,Math.min(r[2],ch.body.length))),h('p',{class:'small'},h('a',{href:'#lib-'+r[0]},'Open the whole chapter')))}

const X=D.x||{};
const COURT=['Page','Knight','Queen','King'];
function POOLOF(sp){return sp.pool==='major'?CARDS.filter(c=>c.arcana==='major'):sp.pool==='court'?CARDS.filter(c=>COURT.includes(c.rank)):CARDS}
const byName=n=>CARDS.find(c=>c.name===n);
const SEPH_OF=n=>n>=1&&n<=10?X.sephiroth[n-1]:null;
function xAssoc(c,add){
  if(c.arcana==='major'){const v=X.virtues.find(r=>r[0]===c.name);if(v)add('Kabbalah virtues',v[1]+' and '+v[2]+' (Tree of Life, Vol II Ch 16)')}
  else{const s=SEPH_OF(c.num);if(s)add('Sephirah',s[0]+' ('+s[1]+'): '+s[3]+' · '+s[4]+' · body: '+s[5])}
  if(c.arcana==='major'&&c.astro&&c.astro.planet){const p=X.planets.find(p=>p.p===c.astro.planet);if(p&&p.mantra)add('Planet mantra',p.mantra)}}
const tbl=(heads,rows,cls)=>h('div',{class:'tw'},h('table',{class:'tbl '+(cls||'')},h('thead',null,h('tr',null,heads.map(x=>h('th',null,x)))),h('tbody',null,rows.map(r=>h('tr',null,r.map(x=>h('td',null,x)))))));
const subnav=(items,cur,pre)=>h('nav',{class:'chips subnav','aria-label':'Sections'},items.map(([k,l])=>h('a',{class:'chip',href:'#'+pre+'-'+k,'aria-current':k===cur?'page':null},l)));
const shuffled=()=>{const p=CARDS.slice();for(let i=p.length-1;i>0;i--){const j=rnd(i+1);[p[i],p[j]]=[p[j],p[i]]}return p};
const dsum=n=>String(n).split('').reduce((a,b)=>a+ +b,0);
const cardLine=(c,note)=>h('div',{class:'dh',style:'margin-top:10px'},face(c,{w:80}),h('div',{class:'ti'},h('h3',null,c.name),note?h('p',{class:'small'},note):null,h('a',{class:'btn sm',href:'#card-'+c.id},'Open '+c.name)));
function trendEl(n){const t=X.yearTrends[n];if(!t)return h('span');return h('section',{class:'panel'},h('h3',null,'What the year holds (Vol II, Chapter 8)'),h('p',{class:'small muted'},'Ruling planet '+t.planet+' · gem '+t.gem),prose(t.body))}
const SIGNS=['Capricorn','Aquarius','Pisces','Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius'];
const WSTART=[[1,20,'Aquarius'],[2,19,'Pisces'],[3,21,'Aries'],[4,21,'Taurus'],[5,21,'Gemini'],[6,21,'Cancer'],[7,22,'Leo'],[8,23,'Virgo'],[9,23,'Libra'],[10,23,'Scorpio'],[11,23,'Sagittarius'],[12,22,'Capricorn']];
const VSTART=[[1,14,'Capricorn'],[2,13,'Aquarius'],[3,14,'Pisces'],[4,14,'Aries'],[5,15,'Taurus'],[6,15,'Gemini'],[7,16,'Cancer'],[8,17,'Leo'],[9,17,'Virgo'],[10,17,'Libra'],[11,16,'Scorpio'],[12,16,'Sagittarius']];
function signOf(m,d,tab){let s=tab[tab.length-1][2];for(const [mm,dd,n] of tab){if(m>mm||(m===mm&&d>=dd))s=n}
  if(m===1&&d<tab[0][1])s=tab[tab.length-1][2];return s}
function viewTools(sub){sub=sub||'year';document.title='Tools · Tarot Reader\'s Desk';
  const L=[['year','Year number'],['quint','Quintessential'],['muhurta','Muhurta'],['day','How will the day be'],['soul','Soul purpose'],['journey','Fool\'s Journey'],['symbols','Symbols'],['karma','Karma'],['triplicity','Elements and suits'],['zero','Zero and master numbers']];
  const head=[h('h1',null,'Tools'),h('p',{class:'lead'},'Calculators and methods from Vol I and Vol II, each with the book\'s rule beside it.'),subnav(L,sub,'tools')];
  let body;
  if(sub==='year'||sub==='quint'){const [a,b]=numPanels();body=sub==='year'?a:b}
  else if(sub==='muhurta'){
    const today=new Date().toISOString().slice(0,10);const dis=[h('input',{type:'date',value:today,'aria-label':'Date option 1'})];const lst=h('div',{class:'ctl',style:'margin:10px 0'});const out=h('div');let pool=shuffled();
    function drawIn(){lst.replaceChildren(...[...dis,dis.length<5?h('button',{class:'btn sm',onclick:()=>{dis.push(h('input',{type:'date',value:today,'aria-label':'Date option '+(dis.length+1),oninput:go}));drawIn();go()}},'Add another date'):null,dis.length>1?h('button',{class:'btn sm',onclick:()=>{dis.pop();drawIn();go()}},'Remove last'):null,h('button',{class:'btn',onclick:()=>{pool=shuffled();go()}},'Shuffle again')].filter(Boolean))}
    function go(){out.replaceChildren();const rows=[];dis.forEach((di,k)=>{if(!di.value)return;const [Y,m,d]=di.value.split('-').map(Number);const tot=d+m+dsum(Y);const n=reduce1to9(tot);let kk=tot;while(kk>22)kk-=22;const maj=kk===22?CARDS[0]:CARDS[kk];rows.push({k,di,Y,m,d,tot,n,maj,kk,deck:pool[n-1]})});
      if(!rows.length)return;
      out.append(h('div',{class:'tw'},h('table',{class:'tbl'},h('thead',null,h('tr',null,['Option','Date','Total','Number','Deck method: card at that number','Major Arcana method'].map(x=>h('th',null,x)))),h('tbody',null,rows.map(r=>h('tr',null,h('td',null,r.k+1),h('td',null,r.d+' '+MONTHS[r.m-1]+' '+r.Y),h('td',{class:'small'},r.d+' + '+r.m+' + '+dsum(r.Y)+' = '+r.tot),h('td',null,h('b',null,r.n)),h('td',null,h('a',{href:'#card-'+r.deck.id},r.deck.name),h('div',{class:'small muted'},'Card '+r.n+' from the top')),h('td',null,h('a',{href:'#card-'+r.maj.id},r.maj.name),h('div',{class:'small muted'},'No. '+r.kk+(r.tot>22?' ('+r.tot+' less 22)':'')+(r.kk===22?', the Fool as 22':'')))))))),
        h('p',{class:'small'},'Read each card against the purpose of the event. The book picks the date whose card best suits the query: a card of fruitful beginnings or serious application for a job, for example, and avoids cards that point elsewhere (a Lovers card for a professional start).'),
        h('div',{class:'insight'},rows.map(r=>h('div',null,h('b',null,'Option '+(r.k+1)+' · number '+r.n),QN[r.n],h('div',{class:'ctl',style:'margin-top:8px'},h('a',{class:'btn sm',href:'#card-'+r.deck.id},'Open '+r.deck.name),h('a',{class:'btn sm',href:'#card-'+r.maj.id},'Open '+r.maj.name))))))}
    dis[0].addEventListener('input',go);drawIn();go();
    body=h('section',{class:'panel'},h('h2',null,'Muhurta: choosing the best date'),h('p',{class:'small muted'},'Vol II, Chapter 10. Enter the dates being considered (the client\'s options). Each date is added up (day + month + the digits of the year) and reduced to one number. Deck method: shuffle with the client and the event in mind, then take the card at that position from the top for each date (the same deck, undisturbed). Major Arcana method: use the date total as the card number; if it is above 22, subtract 22; 22 is the Fool.'),lst,out)}
  else if(sub==='day'){
    const dob=h('input',{type:'date',id:'dd1','aria-label':'Client date of birth'}),dt=h('input',{type:'date',id:'dd2',value:new Date().toISOString().slice(0,10),'aria-label':'Day to examine'});const out=h('div');
    function go(){out.replaceChildren();if(!dob.value||!dt.value)return out.append(h('p',{class:'muted'},'Enter the client\'s date of birth and the day to examine.'));
      const dr=s=>reduce1to9(dsum(s.replace(/-/g,'')));const a=dr(dob.value),b=dr(dt.value);const n=reduce1to9(a+b);const pool=shuffled();
      out.append(h('p',null,'Digital root of the day: ',h('b',null,b),'. Digital root of the date of birth: ',h('b',null,a),'. Combined ('+a+' + '+b+' = '+(a+b)+'): ',h('b',null,n),'.'),
        h('div',{class:'insight'},h('div',null,h('b',null,'Number '+n),QN[n]),h('div',null,h('b',null,'Card '+n+' of the shuffled deck'),cardLine(pool[n-1],'Read this card as the mood and events of the day for this person.'))))}
    dob.addEventListener('input',go);dt.addEventListener('input',go);go();
    body=h('section',{class:'panel'},h('h2',null,'How will this day be for a client?'),h('p',{class:'small muted'},'Vol II, Chapter 9. Add the digital root of the day\'s date to the digital root of the client\'s date of birth, reduce to one digit, shuffle the deck and take that numbered card, and read it with the meaning of the number.'),
      h('div',{class:'ctl',style:'margin:10px 0'},h('label',{for:'dd1'},'Born '),dob,h('label',{for:'dd2'},' Day '),dt,h('button',{class:'btn',onclick:go},'Shuffle again')),out)}
  else if(sub==='soul'){
    const dob=h('input',{type:'date',id:'sd','aria-label':'Date of birth'}),sys=h('select',{id:'ss','aria-label':'Sun-sign system'},h('option',{value:'w'},'Western (tropical) dates'),h('option',{value:'v'},'Vedic (sidereal) dates'));const out=h('div');
    function go(){out.replaceChildren();if(!dob.value)return out.append(h('p',{class:'muted'},'Enter a date of birth to find the soul purpose card.'));
      const [,m,d]=dob.value.split('-').map(Number);const sg=signOf(m,d,sys.value==='w'?WSTART:VSTART);const r=X.soul.find(r=>r[0]===sg);const c=byName(r[3]);
      out.append(h('div',{class:'panel'},h('div',{class:'small muted'},'Sun sign'),h('h3',null,sg+' ('+(sys.value==='w'?r[1]:r[2])+')'),cardLine(c,'Soul purpose card, number '+r[4]+'.'),h('p',null,h('b',null,'Soul lessons: '),r[5]+'.'),h('p',null,h('b',null,'Gem of the sign: '),r[6]+'.')))}
    dob.addEventListener('input',go);sys.addEventListener('change',go);go();
    body=h('div',null,h('section',{class:'panel'},h('h2',null,'Soul purpose card'),h('p',{class:'small muted'},X.soulNote),h('div',{class:'ctl',style:'margin:10px 0'},h('label',{for:'sd'},'Born '),dob,sys),out),
      h('section',{class:'panel'},h('h3',null,'All twelve signs'),tbl(['Sign','Western dates','Vedic dates','Soul card','Soul lessons','Gem'],X.soul.map(r=>[r[0],r[1],r[2],h('a',{href:'#card-'+byName(r[3]).id},r[3]+' ('+r[4]+')'),r[5],r[6]]))))}
  else if(sub==='symbols'){body=symbolsView()}
  else if(REF[sub]){body=refView(sub)}
  else if(sub==='journey'){
    body=h('div',null,h('p',{class:'small muted'},'Vol I, Chapter 8. The twenty-two Major Arcana read as the stages of the soul\'s journey, the Fool among them.'),
      X.journey.map((g,i)=>h('section',{class:'panel'},h('h3',null,(i+1)+'. '+g.h),h('p',null,g.t),h('div',{class:'chips'},g.c.map(n=>{const c=byName(n);return h('a',{class:'chip',href:'#card-'+c.id},n)})))))}
  app.replaceChildren(...head,body);window.scrollTo(0,0)}
/* ---- remedies ---- */
function magic(k){const b=[[6,1,8],[7,5,3],[2,9,4]];return h('table',{class:'ms','aria-label':'Magic square, each cell plus '+k},h('tbody',null,b.map(r=>h('tr',null,r.map(v=>h('td',null,v+k))))))}
function fixBody(b){b=(b||[]).map(x=>({t:x.t,x:x.x}));if(b.length>1&&b[0].t==='h'&&b[1].t==='p'){b[1].x=b[0].x+' '+b[1].x.trim();b.shift()}return b}
function viewRemedies(sub){sub=sub||'planets';document.title='Remedies · Tarot Reader\'s Desk';
  const L=[['planets','Planets and gems'],['crystals','Crystals'],['chakras','Chakras'],['rudraksha','Rudraksha'],['yantras','Yantras'],['angels','Angels'],['kabbalah','Kabbalah'],['care','Crystal care'],['mantras','Mantras'],['gomti','Gomti chakra'],['meditation','Meditation'],['energy','Energy body'],['rays','Rays and healing grid']];
  const head=[h('h1',null,'Remedies'),h('p',{class:'lead'},'Vol II reference: gems, crystals, chakras, rudraksha, yantras and mantras, angels and the Tree of Life. Remedies follow a reading; check a horoscope before wearing a gem.'),subnav(L,sub,'remedies')];
  let body;const cl=c=>byName(c)?h('a',{href:'#card-'+byName(c).id},c):c;
  if(sub==='planets'){
    body=h('div',null,
      h('section',{class:'panel'},h('h2',null,'Planets, matters and gems'),h('div',{class:'tw'},h('table',{class:'tbl'},h('thead',null,h('tr',null,['Planet','Matters signified','Gems','Beej mantra','Chakra','Card','Year no.'].map(x=>h('th',null,x)))),
        h('tbody',null,X.planets.map(p=>h('tr',null,h('td',null,h('b',null,p.p)),h('td',{class:'small'},p.matters),h('td',{class:'small'},p.gems),h('td',{class:'small'},p.mantra||'-'),h('td',{class:'small'},p.chakra||'-'),h('td',null,p.card?cl(p.card):'-'),h('td',null,p.year||'-'))))))),
      h('section',{class:'panel'},h('h3',null,'Gem wearing guidelines'),tbl(['Gem','Weight','Metal','Finger','Day','Time','Lasts'],X.gemGuide)),
      h('section',{class:'panel'},h('h3',null,'Gem by sun sign'),tbl(['Sign','Gem'],X.soul.map(r=>[r[0],r[6]]))),
      h('section',{class:'panel'},h('h3',null,'Navgraha mantra'),h('p',null,X.navgrahMantra)))}
  else if(sub==='crystals'){
    const q=h('input',{type:'search',placeholder:'Filter crystals by name or effect',style:'width:100%','aria-label':'Filter crystals'});const list=h('div');
    function go(){const t=tokens(q.value);list.replaceChildren(...X.crystals.filter(c=>!t.length||t.every(w=>norm(c.name+' '+c.body.map(p=>p.x).join(' ')).includes(w))).map(c=>h('details',{class:'panel',open:t.length?'':null},h('summary',{style:'cursor:pointer;font-weight:600'},c.n+'. '+c.name),prose(c.body,t))))}
    q.addEventListener('input',go);go();
    body=h('div',null,h('p',{class:'small muted'},'Vol II, Chapter 14 and 15. Twenty crystals with their uses, then a body-part table.'),q,list,
      h('section',{class:'panel'},h('h3',null,'Crystals for parts of the body'),tbl(['Body part','Crystal','Alternative'],X.bodyCrystals.map(r=>[r[0],r[1],r[2]||'-']))))}
  else if(sub==='chakras'){
    body=h('div',null,h('p',{class:'small muted'},'Vol II, Chapter 15. The seven chakras, their qualities and the crystals and gems that balance them. Use the 7-Chakra spread to read the state of each.'),h('a',{class:'btn sm',href:'#spread-chakra'},'Open the 7-Chakra spread'),
      X.chakras.map(c=>h('details',{class:'panel'},h('summary',{style:'cursor:pointer;font-weight:600'},c.n+'. '+c.name+' · '+c.sk.split(' (')[0]+' · '+c.color),
        h('dl',{class:'meta'},[['Sanskrit',c.sk],['Location',c.loc],['Element',c.el],['Shape',c.shape],['Sense',c.sense],['Bija sound',c.bija],['Glands',c.glands],['Organs',c.organs],['Systems',c.systems],['Colour',c.color],['Aspects',c.aspects],['Ruling planet',c.planet],['Developing age',c.age],['Deals with',c.deals],['Blocked by',c.blocked],['Ray quality',c.ray],['Crystals',c.crystals],['Healing gems',c.gems]].filter(r=>r[1]).flatMap(r=>[h('dt',null,r[0]),h('dd',null,r[1])])),h('p',null,c.note))),
      h('section',{class:'panel'},h('h3',null,'Ways to heal a chakra'),h('ul',null,X.chakraHeal.map(t=>h('li',null,t)))))}
  else if(sub==='rudraksha'){
    body=h('div',null,h('p',{class:'small muted'},'Vol II, Chapter 11. Fourteen mukhi (faces).'),X.rudraksha.map(r=>h('details',{class:'panel'},h('summary',{style:'cursor:pointer;font-weight:600'},r.n+'. '+r.title+(r.planet?' · '+r.planet:'')),
      r.secs.map(s=>h('div',{class:'sect'},h('h4',null,s.h),s.kv?h('dl',{class:'meta'},s.kv.flatMap(k=>[h('dt',null,k[0]),h('dd',null,k[1])])):prose(fixBody(s.body)))))))}
  else if(sub==='yantras'){
    const q=h('input',{type:'search',placeholder:'Filter yantras by purpose',style:'width:100%','aria-label':'Filter yantras'});const tb=h('div');
    function go(){const t=tokens(q.value);tb.replaceChildren(tbl(['Yantra','Purpose'],X.yantras.filter(r=>!t.length||t.every(w=>norm(r.join(' ')).includes(w)))))}
    q.addEventListener('input',go);go();
    body=h('div',null,h('section',{class:'panel'},h('h2',null,'Planetary magic square yantras'),h('p',{class:'small muted'},X.yantraSums),
      h('div',{class:'msgrid'},X.planets.filter(p=>p.yantra).map(p=>h('figure',{class:'msf'},magic(p.yantra[1]),h('figcaption',null,h('b',null,p.yantra[0]),h('br'),h('span',{class:'small muted'},p.p+' · '+p.mantra)))))),
      h('section',{class:'panel'},h('h3',null,'Yantras and what they are for'),q,tb),
      h('section',{class:'panel'},h('h3',null,'Navgraha mantra'),h('p',null,X.navgrahMantra)))}
  else if(REF[sub]){body=refView(sub)}
  else if(sub==='angels'){
    const ch=LIB.find(c=>c.id==='v2-c20').body;const q=h('input',{type:'search',placeholder:'Find an archangel by need: healing, love, travel, protection, grief',style:'width:100%','aria-label':'Find an archangel'});const tb=h('div');
    function go(){const t=tokens(q.value);tb.replaceChildren(tbl(['Archangel','Meaning','Speciality','Aura colour','Crystal'],X.archangels.filter(r=>!t.length||t.every(w=>norm(r.join(' ')).includes(w))).map(r=>r.map((x,k)=>k===0?h('b',null,x):hl(x,t)))))}
    q.addEventListener('input',go);go();
    const nq=h('input',{type:'search',placeholder:'Type the repeating number you keep seeing, such as 444',inputmode:'numeric',style:'width:100%','aria-label':'Angel number'});const nl=h('div');
    function ng(){const v=nq.value.trim();const rows=X.angelNumbers.filter(a=>!v||a.num.startsWith(v)||v.startsWith(a.num[0]+a.num[0])&&a.num[0]===v[0]);nl.replaceChildren(...(rows.length?rows:[]).map(a=>h('p',null,h('b',{style:'font-family:var(--f-display);font-size:20px'},a.num+'  '),a.text)));if(!rows.length)nl.append(h('p',{class:'muted'},'The book lists 111 to 999 only.'))}
    nq.addEventListener('input',ng);ng();
    body=h('div',null,h('section',{class:'panel'},h('h2',null,'Who are the angels?'),prose(ch.slice(4,22))),
      h('section',{class:'panel'},h('h3',null,'Invoking angels and reading their signs'),prose(ch.slice(22,30)),h('a',{class:'btn sm',href:'#remedies-chakras'},'Chakras and their crystals')),
      h('section',{class:'panel'},h('h2',null,'Angel numbers'),h('p',{class:'small muted'},X.angelIntro),nq,nl),
      h('section',{class:'panel'},h('h3',null,'Archangels: healing area, aura colour and crystal'),h('p',{class:'small muted'},'Call an archangel by name for the matter shown. Welcome them when you begin and thank them when you finish.'),q,tb),
      h('section',{class:'panel'},h('h3',null,'Angel and oracle cards'),prose(ch.slice(200))),
      h('p',{class:'small'},h('a',{href:'#lib-v2-c20'},'Open the whole chapter')))}
  else{
    body=h('div',null,h('p',{class:'small muted'},'Vol II, Chapter 16. The Tree of Life (Qaballah) and the soul purpose spread.'),h('a',{class:'btn sm',href:'#spread-kabbalah'},'Open the Soul Purpose spread'),
      h('section',{class:'panel'},h('h3',null,'The ten Sephiroth'),tbl(['Sephirah','Meaning','Attribute','Cards','Planet or sign','Body'],X.sephiroth.map(s=>[h('b',null,s[0]),s[1],s[2],s[3],s[4],s[5]]))),
      h('section',{class:'panel'},h('h3',null,'Virtues of the Major Arcana'),tbl(['Card','First virtue','Second virtue'],X.virtues.map(v=>[cl(v[0]),v[1],v[2]]))))}
  app.replaceChildren(...head,body);window.scrollTo(0,0)}
/* ---- guide ---- */
function viewGuide(sub){sub=sub||'before';document.title='Guide · Tarot Reader\'s Desk';
  const L=[['before','Before'],['during','During'],['after','After'],['direction','Directionality'],['wisdom','Self-reading and wisdom'],['burnout','Burnout care']];
  const head=[h('h1',null,'Reading guide'),h('p',{class:'lead'},'The book\'s procedure for a reading, in order: prepare, read, close. Tick items as you go (not saved).'),subnav(L,sub,'guide')];
  let body;
  const steps=a=>h('div',null,a.map((s,i)=>{const cb=h('input',{type:'checkbox',id:'g'+sub+i});return h('section',{class:'panel step'},h('label',{for:'g'+sub+i,class:'stl'},cb,h('b',null,s[0])),h('p',null,s[1]))}));
  if(sub==='burnout'){const B=X.burnout;const out=h('div');const boxes=B.symptoms.map((s,i)=>h('label',{class:'ck'},h('input',{type:'checkbox',onchange:upd}),s));
    function upd(){const n=boxes.filter(b=>b.firstChild.checked).length;out.replaceChildren(h('p',null,h('b',null,n+' of '+B.symptoms.length+' ticked. '),n>=3?'Several signs are present. Ground yourself, run the crystal relaxation grid below, and rest before the next reading.':n?'A few signs. Ground and cleanse before the next reading.':'None ticked.'))}
    upd();
    body=h('div',null,h('section',{class:'panel'},h('h2',null,'Energy burnout (Vol II)'),h('h4',null,'What brings it on'),h('ul',null,B.causes.map(t=>h('li',null,t))),h('h4',null,'Self-check'),h('div',{class:'ckgrid'},boxes),out),
      h('section',{class:'panel'},h('h3',null,'Grounding'),h('p',null,B.grounding),h('h4',null,'Protective crystals'),h('div',{class:'chips'},B.protect.map(t=>h('span',{class:'chip'},t))),h('h4',null,'Tips'),h('ul',null,B.tips.map(t=>h('li',null,t)))),
      h('section',{class:'panel'},h('h3',null,'Crystal relaxation grid'),h('p',{class:'small muted'},B.gridNote),tbl(['Crystal','Effect'],B.gridCrystals),h('h4',null,'Steps'),h('ol',null,B.gridSteps.map(t=>h('li',null,t)))))}
  else if(sub==='direction')body=dirView();
  else if(sub==='wisdom')body=wisdomView();
  else body=steps(X.guide[sub]);
  app.replaceChildren(...head,body,h('p',{class:'small muted'},'Source chapters: ',h('a',{href:'#library'},'Vol I Chapters 5 and 6, Vol II Chapter 12'),' in the Books tab.'));window.scrollTo(0,0)}

function dirView(){const A={c:null,f:'right'},B={c:null,f:'left'};const out=h('div');const FO=[['right','Faces right'],['left','Faces left'],['straight','Faces straight out']];
  const sel=(o)=>h('select',{'aria-label':'Direction the figure faces',onchange:e=>{o.f=e.target.value;go()}},FO.map(([v,l])=>h('option',{value:v,selected:o.f===v?'':null},l)));
  const nm=(o,lab)=>{const s=h('span',{class:'chip'},'Not chosen');const bt=h('button',{class:'btn sm',onclick:()=>pickCard(c=>{o.c=c;s.textContent=c.name;go()})},lab);return [bt,s]};
  function go(){out.replaceChildren();const a=A.f,b2=B.f;let t,r;
    if(a==='right'&&b2==='left'){t='Facing each other';r='Collaborative movement and usually a positive sign (the book\'s example: Page of Wands and The Fool facing each other mean a new adventure, with intense ideas and passion). It can also show confrontation or opposing energies, so study the meaning of the suit. Example: Death on the left with Strength on the right: a coming loss met with unusual acceptance, which creates stress as the two forces pull in opposite directions. Example: 10 of Wands then 5 of Cups: great effort and labour leading to personal loss and sorrow, an emotional strengthening rather than success.'}
    else if(a==='left'&&b2==='right'){t='Facing away from each other';r='Can relate to the time factor. A figure turning to the left is looking at, or drawing its energy from, the past. A figure turning to the right looks to the future and shows events or moods about to emerge. (The book\'s example: King of Wands on the left, Knight of Pentacles on the right.)'}
    else if(a==='straight'||b2==='straight'){t='A figure facing straight';r='The card\'s inherent energy or mood is rooted in the present. In a past, present, future line the straight-facing card shows the present (the book\'s example: Page of Cups past, Hierophant present, The Moon future). It can also act as a stationary card or an obstacle when the figures on its left and right are dynamic (the book\'s example: Knight of Swords, The Emperor, Knight of Cups).'}
    else{t='Both figures face the same way';r='The book does not give a rule for this case. Read each figure by past (left) or future (right) as above, and look at the surrounding cards and the question.'}
    out.append(h('div',{class:'panel'},h('h3',null,t),h('p',null,r),A.c&&B.c?h('p',{class:'small'},'Pair: ',h('a',{href:'#card-'+A.c.id},A.c.name),' then ',h('a',{href:'#card-'+B.c.id},B.c.name),'. Left card first, right card second.'):h('p',{class:'small muted'},'Choose the two cards to name the pair (optional).')))}
  go();
  return h('div',null,h('section',{class:'panel'},h('h2',null,'Directionality in the cards (Vol II, Chapter 4)'),
    h('p',null,'When you read the interplay of cards in a spread, look at how the human and animal figures are positioned in reference to each other. Check the surrounding cards and the quality of the question before making a reading final.'),
    h('ol',null,h('li',null,h('b',null,'Facing each other, collaborative. '),'A positive sign: a collaborative movement.'),h('li',null,h('b',null,'Facing each other, confrontation. '),'Opposing energies; the suit meaning matters.'),h('li',null,h('b',null,'Facing away. '),'Time factor: left is the past, right is the future.'),h('li',null,h('b',null,'Facing straight. '),'Rooted in the present, or a stationary obstacle between moving cards.')),
    h('p',{class:'small muted'},'Applies to the 16 court cards and to every card that features a figure. Decks vary, so check the illustration in your own deck. Study it at least at a supplementary level in relationship and decision readings, either figure by figure (past, present, future) or by how figures interact.')),
    h('section',{class:'panel'},h('h3',null,'Check a pair of cards'),h('p',{class:'small muted'},'Set which way each figure faces in your deck, with the left card first.'),
      h('div',{class:'ctl'},nm(A,'Left card'),sel(A)),h('div',{class:'ctl',style:'margin-top:8px'},nm(B,'Right card'),sel(B))),out,
    h('p',{class:'small'},h('a',{href:'#lib-v2-c4'},'Read the chapter with its illustrations described')))}

function symbolsView(){const ch=LIB.find(c=>c.id==='v1-c3').body;const q=h('input',{type:'search',placeholder:'Find a symbol or meaning: rose, bridge, obstacle, success',style:'width:100%','aria-label':'Search symbols'});const list=h('div');
  const a=ch.findIndex(p=>/Tarot was developed over centuries/i.test(p.x)),a2=ch.findIndex(p=>/Epochal and Paradigmatic/i.test(p.x));const z=ch.findIndex(p=>/The self awareness that we gain/i.test(p.x));
  function go(){const t=tokens(q.value);list.replaceChildren(...X.symbols.filter(s=>!t.length||t.every(w=>norm(s.name+' '+s.paras.join(' ')).includes(w))).map(s=>h('details',{class:'panel',open:t.length?'':null},h('summary',{style:'cursor:pointer;font-weight:600'},s.n+'. '+s.name),h('div',{class:'prose'},s.paras.map(p=>h('p',null,hl(p,t)))))));if(!list.childNodes.length)list.append(h('p',{class:'muted'},'No symbol matches that.'))}
  q.addEventListener('input',go);go();
  return h('div',null,h('p',{class:'small muted'},'Vol I, Chapter 3. Twenty symbols that appear in the cards, with what each indicates in a spread. A symbol\'s meaning is read together with the card and the question.'),q,list,
    h('section',{class:'panel'},h('h3',null,'Symbols in tarot cards'),prose(ch.slice(Math.max(a2,0),a>=0?ch.findIndex(p=>/^2\. Animal|Lion, tiger, bear/i.test(p.x))+1||50:50).filter(p=>p.t!=='h'||true))),
    h('section',{class:'panel'},h('h3',null,'Can the cards be categorised as positive or negative?'),prose(ch.slice(z>=0?z:107,121))),
    h('p',{class:'small'},h('a',{href:'#lib-v1-c3'},'Open the whole chapter (types of decks, symbol categories)')))}

function wisdomView(){const ch=LIB.find(c=>c.id==='v2-c21').body;const sk=new Set([9,10,11]);
  const vs=[h('section',{class:'panel'},h('h3',null,'The verses, as the book gives them'),prose(ch.slice(3,35).filter((p,k)=>!sk.has(k+3))))];
  const gl=ch.slice(62,74).map(p=>p.x.trim());const gcb=gl.map((t,i)=>h('label',{class:'ck'},h('input',{type:'checkbox'}),t));
  const P=(a,z)=>prose(ch.slice(a,z));
  return h('div',null,h('p',{class:'small muted'},'Vol II, Chapter 21: Transcendental Knowledge. Why a reader works on their own karma, readings for yourself, emotional intelligence, and the book\'s closing thoughts.'),
    h('section',{class:'panel'},h('h2',null,'Selfless action: verses from the Bhagavad Gita'),P(0,3)),...vs,
    h('section',{class:'panel'},h('h3',null,'Self-transformation and the reader'),P(35,51)),
    h('section',{class:'panel'},h('h3',null,'Reading for self'),P(52,61)),
    h('section',{class:'panel'},h('h3',null,'Guidelines: signs of emotional intelligence'),h('p',{class:'small muted'},'Tick the ones you already practise (not saved).'),h('div',{class:'ckgrid',style:'grid-template-columns:1fr'},gcb)),
    h('section',{class:'panel'},h('h3',null,'Tarot as a global philosophy'),P(74,89)),
    h('section',{class:'panel'},h('h3',null,'Structure of the deck'),P(89,111),h('p',{class:'small'},h('a',{href:'#cards'},'Browse the 78 cards'))),
    h('section',{class:'panel'},h('h3',null,'Tarot: window to the soul'),P(112,120)),
    h('section',{class:'panel'},h('h3',null,'The last word'),P(121,ch.length)),
    h('p',{class:'small'},h('a',{href:'#lib-v2-c21'},'Open the whole chapter')))}
/* ---- spread helpers ---- */
let customSP=null;
const TPL=[
['Horseshoe',['Past','Present','Hidden influences','Obstacles','Attitude of others and environment','Advice','Likely outcome']],
['Prosperity',['Current financial state','What blocks prosperity','Resource or skill to use','Opportunity coming','Action to take','Outcome']],
['Character Profiling',['Outward persona','Inner self','Strengths','Weaknesses','Hidden motives','Potential']],
['What-If',['The situation','What if I take option A','Challenge in option A','What if I take option B','Challenge in option B','Advice']],
['Choice (2 to 5 options)',['The situation','Option A: path','Option A: outcome','Option B: path','Option B: outcome']],
['Tarot Advice',['The situation','What to do','What to avoid','Help available','Outcome if the advice is followed']],
['Future Outcome',['Where I stand now','Influence moving me forward','What I must do','Likely outcome']],
['Mutual Compatibility',['Person A\'s energy','Person B\'s energy','Common ground','Friction','Advice','Outlook together']],
['Marital Life',['Husband\'s energy','Wife\'s energy','Strength of the bond','Challenge','Advice','Future of the marriage']],
['Matchmaking (court cards)',['The boy\'s nature','The girl\'s nature','Compatibility','Challenge','Facilitating factor','Outcome'],'court'],
['Business Arrow',['Business situation','Strengths','Challenges','Action required','Result']],
['Pentacle 5-star Professional',['Skills and talents','Opportunities','Obstacles','Action','Result']]];

let pool=null;
function customForm(){const court=h('input',{type:'checkbox'});document.title='Build Your Own Spread · Tarot Reader\'s Desk';
  const ta=h('textarea',{id:'cp',rows:7,placeholder:'One position per line, for example:\nWhere is the knot?\nWhat helps\nWhat hinders\nAdvice\nLikely result',style:'width:100%'});
  app.replaceChildren(h('div',{class:'crumb'},h('a',{class:'btn sm',href:'#spreads'},'← All spreads')),h('h1',null,'Build Your Own Spread'),
    h('p',{class:'lead'},'The book\'s method for a custom spread: find where the knot or dilemma lies, break the query into positional questions, draw one card per question, then read the interplay of the cards together.'),
    h('p',{class:'small muted'},'Type one positional question per line (up to 15). Add a colon to give a position a name and a note, such as "Advice: what to do".'),
    h('h4',null,'Start from a template'),h('p',{class:'small muted'},'Vol I names these spreads but does not give their card positions. These are suggested layouts to adapt, not the book\'s own.'),h('div',{class:'chips',style:'margin-bottom:10px'},TPL.map(t=>h('button',{class:'chip',onclick:()=>{ta.value=t[1].join('\n');pool=t[2]||null;court.checked=!!t[2];toast(t[0]+' loaded')}},t[0]))),ta,h('label',{class:'small',style:'display:block;margin-top:8px'},court,' Draw from the 16 court cards only (as for matchmaking)'),
    h('div',{class:'ctl',style:'margin-top:10px'},h('button',{class:'btn primary',onclick:()=>{const L=ta.value.split('\n').map(s=>s.trim()).filter(Boolean).slice(0,15);if(!L.length)return toast('Add at least one position');
      customSP={id:'custom',name:'My Spread',layout:'row',pool:court.checked?'court':null,intro:'Your own spread, one card per question.',pos:L.map((l,i)=>{const k=l.indexOf(':');return k>0?[(i+1)+' · '+l.slice(0,k).trim(),l.slice(k+1).trim()]:[(i+1)+' · '+l,'']})};viewSpreads('custom')}},'Create spread')))}
function popPanel(){const L=[];const box=h('div');
  function draw(){box.replaceChildren(h('div',{class:'ctl'},h('button',{class:'btn sm',onclick:()=>{if(L.length>=2)return toast('Keep at most two. Mix further cards back into the deck.');let c;do{c=CARDS[rnd(78)]}while(L.includes(c));L.push(c);draw()}},'A card popped out'),L.length?h('button',{class:'btn sm',onclick:()=>{L.length=0;draw()}},'Clear'):null),
    h('div',{class:'chips',style:'margin-top:8px'},L.map(c=>h('a',{class:'chip',href:'#card-'+c.id},c.name))))}
  draw();return h('details',{class:'panel'},h('summary',{style:'cursor:pointer;font-weight:600'},'Pop-out cards'),h('p',{class:'small muted'},'Cards that jump out while shuffling carry a message of their own. Note them, return them to the deck, and keep at most two (Vol I). Use a physical deck, or log a card here as a reminder.'),box)}
function chakraTable(slots,sp){const rows=slots.map((s,i)=>s?[X.chakras[6-i].name+' · '+X.chakras[6-i].bija,h('a',{href:'#card-'+s.c.id},s.c.name+(s.rev?' (reversed)':'')),X.chakras[6-i].color,X.chakras[6-i].blocked,X.chakras[6-i].crystals]:null).filter(Boolean);
  return h('section',{class:'panel'},h('h3',null,'Chakra reference for the cards drawn'),h('p',{class:'small muted'},'A reversed or heavy card at a chakra suggests that centre needs work. Crystals listed are those the book recommends for it.'),tbl(['Chakra','Card','Colour','Blocked by','Crystals'],rows),h('a',{href:'#remedies-chakras'},'Chakra reference and healing methods'))}

SP.push({id:'kabbalah',name:'Kabbalah Soul Purpose',layout:'row',pool:'major',intro:'Six cards, drawn from the Major Arcana only, on your soul purpose along the Tree of Life (Vol II, Chapter 16). Each Major card carries two virtues; see Remedies, Kabbalah.',pos:[['1 · Where am I on the Tree of Life?','Your present stage of spiritual progress.'],['2 · Primary challenge','The main obstacle on the path.'],['3 · Primary facilitator','The strongest help available.'],['4 · Soul lesson to adopt','The lesson to take on.'],['5 · Soul lesson to let go','What must be released.'],['6 · Future goal','Where the soul is heading.']]});
SP.push({id:'planets',name:'Planetary Spread',layout:'row',intro:'One card for each planet, to see how each planet\'s matters stand for the querent (Vol II, Chapter 7). The three outer planets are optional. Planet matters are in Remedies, Planets and gems.',optional:[9,10,11],pos:X.planets.map((p,i)=>[(i+1)+' · '+p.p,p.matters])});
SP.find(s=>s.id==='chakra').chakraData=true;
const PORD=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu','Neptune','Uranus','Pluto'].map(n=>X.planets.find(p=>p.p===n));
const planetsSp=SP.find(s=>s.id==='planets');planetsSp.pos=PORD.map((p,i)=>[(i+1)+' · '+p.p,p.matters]);
planetsSp.intro='A 12-card astrological spread on the strength of the planets in a horoscope: the nine Vedic planets plus Neptune, Uranus and Pluto (Vol II, Chapter 11). Shuffle with the client\'s question in mind. Card 1 is the Sun, then the Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu, Neptune, Uranus and Pluto. Read each card against the planet\'s signification to judge whether it is strong or weak, then give a gem, yantra or mantra for the weak ones. Or study only the planets tied to the question (Venus, Jupiter and the Moon for delayed marriage). The last three are optional; leave them out for a 9-card spread.';
planetsSp.planetData=true;
SP.push({id:'meditation',name:'Meditation of the Day',layout:'row',intro:'One personalised card (Vol I, Chapter 7) to meditate on as the primary or inspirational thought of the day. It points to the energy around you. Use its message to stay aware of your surroundings, be in the here and now, and mindful of synchronicity.',pos:[['Meditation card','The inspirational thought to hold through the day.']]});
SP.push({id:'health',name:'Health and Crystal',layout:'row',pool:'major',healthData:true,intro:'Which crystal to use (Vol II, Chapter 11). Shuffle the 22 Major Arcana only, energise them with the intent of guidance on the crystal you need, connect with your Ishta deva or archangel, then draw one Significator card. The card shows the crystal energy that helps your situation. Medical advice from a doctor is still needed; crystals do not work on their own, and hard work and focus are required from you.',pos:[['Significator · the crystal energy you need','The Major Arcana card whose associated crystals and gems apply.']]});
function planetTable(slots){const rows=slots.map((s,i)=>s?[PORD[i].p,h('a',{href:'#card-'+s.c.id},s.c.name+(s.rev?' (reversed)':'')),PORD[i].matters,PORD[i].gems,PORD[i].mantra||'-',PORD[i].yantra?PORD[i].yantra[0]:'-']:null).filter(Boolean);
  return h('section',{class:'panel'},h('h3',null,'Planet strength and remedies'),h('p',{class:'small muted'},'If a planet\'s card reads weak, the book suggests its gem, yantra and mantra as the remedy.'),tbl(['Planet','Card','Matters signified','Gems','Beej mantra','Yantra'],rows),h('a',{href:'#remedies-planets'},'Gem wearing guidelines'))}
function healthPanel(slots){const s=slots[0];if(!s)return h('span');const c=s.c;return h('section',{class:'panel'},h('h3',null,'Crystals for '+c.name),h('dl',{class:'meta'},h('dt',null,'Crystals'),h('dd',null,c.crystals||'The book lists none for this card.'),h('dt',null,'Precious gems'),h('dd',null,c.gems||'The book lists none for this card.')),h('p',{class:'small muted'},'From the table of Major Arcana cards with crystals and gems (Vol II, Chapter 11). For a specific body part use the body table.'),h('a',{class:'btn sm',href:'#remedies-crystals'},'Crystals and body-part table'))}

SP.push({id:'custom',name:'Build Your Own',layout:'row',intro:'Make a spread of your own: type one positional question per line and draw a card for each.',pos:[]});
/* ---------- router ---------- */
function route(){closeModal();const hsh=location.hash.slice(1);let tab='cards';
  if(hsh.startsWith('card-')){viewCards(hsh.slice(5));window.scrollTo(0,0)}
  else if(hsh.startsWith('spread-')){tab='spreads';viewSpreads(hsh.slice(7));window.scrollTo(0,0)}
  else if(hsh==='spreads'){tab='spreads';viewSpreads()}
  else if(hsh==='numbers'){location.replace('#tools-year');return}
  else if(hsh==='tools'||hsh.startsWith('tools-')){tab='tools';viewTools(hsh.slice(6))}
  else if(hsh==='remedies'||hsh.startsWith('remedies-')){tab='remedies';viewRemedies(hsh.slice(9))}
  else if(hsh==='guide'||hsh.startsWith('guide-')){tab='guide';viewGuide(hsh.slice(6))}
  else if(hsh.startsWith('lib-')){tab='library';viewLibrary(hsh.slice(4))}
  else if(hsh==='library'){tab='library';viewLibrary()}
  else if(hsh==='saved'){tab='saved';viewSaved()}
  else viewCards();
  setTabs(tab);document.title=T(document.title);chrome()}
function chrome(){const I=window.I18N;const b=$('#langbtn');if(b){b.textContent=I.lang==='as'?'EN':'অসমীয়া';b.setAttribute('aria-label',I.lang==='as'?'Switch to English':'অসমীয়ালৈ সলনি কৰক');b.title=b.getAttribute('aria-label');b.lang=I.lang==='as'?'en':'as'}
  const mb=$('#mtbtn');if(mb&&window.TarotMT){mb.hidden=I.lang!=='as';window.TarotMT.onstatus=st=>{mb.textContent=!window.TarotMT.on?'অনুবাদ: অফ':st==='busy'?'অনুবাদ চলি আছে…':st==='error'?'অনুবাদ: সংযোগ নাই':'অনুবাদ: অন'};mb.textContent=window.TarotMT.on?'অনুবাদ: অন':'অনুবাদ: অফ';mb.title='ইংৰাজী কিতাপৰ লিখনীৰ স্বয়ংক্ৰিয় অসমীয়া অনুবাদ';mb.setAttribute('aria-label',mb.title)}
  if(I.lang==='as'&&window.TarotMT)window.TarotMT.start();
  const br=$('#brandtxt');if(br)br.textContent=T("Tarot Reader's Desk");const tb2=$('#themebtn');if(tb2){tb2.setAttribute('aria-label',T('Switch light or dark theme'));tb2.title=T('Theme')}}
const lb=$('#langbtn');if(lb)lb.addEventListener('click',()=>{const toEn=window.I18N.lang==='as';window.I18N.setLang(toEn?'en':'as');
  if(toEn&&window.TarotMT&&window.TarotMT.stop()){location.reload();return}route()});
const mbt=$('#mtbtn');if(mbt)mbt.addEventListener('click',()=>window.TarotMT.toggle());
window.addEventListener('hashchange',route);
const tb=$('#themebtn');tb.addEventListener('click',()=>{const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;r.dataset.theme=dark?'light':'dark';store.set('theme',r.dataset.theme)});
const th=store.get('theme',null);if(th)document.documentElement.dataset.theme=th;
route();
})();
