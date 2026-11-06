/* Live Assamese translation for the book text that has no hand-written translation.
   While the site is in Assamese, every English passage on the page is sent to Google's translation
   service, replaced by the Assamese result, and saved in the browser so it loads instantly next time.
   Needs internet. The button "অনুবাদ: অন/অফ" in the top bar switches it on or off. */
(function(){
'use strict';
var PREF='tarot.mt',CK='tarot.mtc.',ENDPOINT='https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=as&dt=t';
var inflight=Object.create(null),running=false,done=new WeakSet(),mem=Object.create(null),queue=[],active=0,fails=0,pending=0,timer=null,onstatus=function(){};
function pref(){try{return JSON.parse(localStorage.getItem(PREF))!==false}catch(e){return true}}
function setPref(v){try{localStorage.setItem(PREF,JSON.stringify(v))}catch(e){}}
function hash(s){var h=5381,i=s.length;while(i)h=(h*33)^s.charCodeAt(--i);return (h>>>0).toString(36)+s.length}
function getCache(t){var k=hash(t);if(mem[k]!==undefined)return mem[k];try{var v=localStorage.getItem(CK+k);if(v!==null){mem[k]=v;return v}}catch(e){}return null}
function putCache(t,v){var k=hash(t);mem[k]=v;try{localStorage.setItem(CK+k,v)}catch(e){
  try{var n=0;for(var i=localStorage.length-1;i>=0&&n<200;i--){var key=localStorage.key(i);if(key&&key.indexOf(CK)===0){localStorage.removeItem(key);n++}}localStorage.setItem(CK+k,v)}catch(e2){}}}
function status(){onstatus(fails>=3?'error':pending>0?'busy':'ok')}
function needs(t){
  if(!/[A-Za-z]{3,}/.test(t))return false;
  var lat=(t.match(/[A-Za-z]/g)||[]).length,asm=(t.match(/[\u0980-\u09FF]/g)||[]).length;
  return lat>=3&&lat>=asm*0.4;
}
function skip(n){var p=n.parentElement;return !p||p.closest('script,style,textarea,input,select,option,.notranslate,[translate="no"],#mt_el,code')}
function chunks(t){
  if(t.length<=1800)return [t];var out=[],cur='';
  t.split(/(?<=[.!?])\s+/).forEach(function(s){if((cur+' '+s).length>1800&&cur){out.push(cur);cur=s}else cur=cur?cur+' '+s:s});
  if(cur)out.push(cur);return out}
function call(text){
  return fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:'q='+encodeURIComponent(text)})
    .then(function(r){if(!r.ok)throw new Error('http '+r.status);return r.json()})
    .then(function(d){return (d[0]||[]).map(function(x){return x[0]||''}).join('')});
}
function translate(core){return Promise.all(chunks(core).map(call)).then(function(a){return a.join(' ')})}
function apply(n,lead,out,trail){if(n.isConnected)n.nodeValue=lead+out+trail}
function pump(){
  while(active<4&&queue.length&&fails<3){
    var job=queue.shift();active++;
    (function(j){translate(j.core).then(function(out){fails=0;if(out){putCache(j.core,out);j.nodes.forEach(function(x){apply(x.n,x.lead,out,x.trail)})}})
      .catch(function(){fails++;j.nodes.forEach(function(x){done.delete(x.n)})})
      .then(function(){delete inflight[j.core];active--;pending-=j.nodes.length;status();pump()})})(job);
  }
}
function scan(root){
  if(!running)return;
  var wk=document.createTreeWalker(root||document.body,4),n,fresh=false;
  while(n=wk.nextNode()){
    if(done.has(n)||skip(n))continue;
    var m=n.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/),core=m[2];
    if(!core||!needs(core)){done.add(n);continue}
    done.add(n);
    var hit=getCache(core);
    if(hit!==null){apply(n,m[1],hit,m[3]);continue}
    var item={n:n,lead:m[1],trail:m[3]};pending++;fresh=true;
    if(inflight[core]){inflight[core].nodes.push(item);continue}
    var job={core:core,nodes:[item]};inflight[core]=job;queue.push(job);
  }
  if(fresh){status();pump()}
}
function start(){
  if(running||!pref())return;running=true;
  var obs=new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(function(){scan()},120)});
  obs.observe(document.body,{childList:true,subtree:true});
  scan();
}
function stop(){var was=running;running=false;queue.length=0;return was}
window.TarotMT={start:start,stop:stop,scan:scan,get on(){return pref()},get started(){return running},
  set onstatus(f){onstatus=f},
  toggle:function(){setPref(!pref());location.reload()}};
})();
