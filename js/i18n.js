/* i18n: Assamese (default) + English.
   Translates every UI string at the moment the page is built (see h() in app.js).
   Dictionaries live in js/as.js: P = whole phrases, TERMS = names/words, PAT = patterns with numbers.
   Anything not in the dictionaries (e.g. long book passages) is shown in English. */
(function(){
'use strict';
var KEY='tarot.lang',lang='as';
try{var v=JSON.parse(localStorage.getItem(KEY));if(v==='en'||v==='as')lang=v}catch(e){}
var A=window.TAROT_AS||{P:{},TERMS:{},PAT:[]};
var P=A.P,TERMS=A.TERMS,PAT=A.PAT;
[P,TERMS].forEach(function(d){Object.keys(d).forEach(function(k){var t=k.trim();if(t!==k&&!(t in d))d[t]=String(d[k]).trim()})});
var cache=Object.create(null);
var REV=null;
var termKeys=Object.keys(TERMS).sort(function(a,b){return b.length-a.length});
var esc=function(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')};
var termRe=termKeys.length?new RegExp('(^|[^A-Za-z])('+termKeys.map(esc).join('|')+')(?![A-Za-z])','g'):null;

function subTerms(c){
  if(!termRe)return c;
  return c.replace(termRe,function(m,pre,w){return pre+TERMS[w]});
}
function exact(c){
  if(Object.prototype.hasOwnProperty.call(P,c))return P[c];
  if(Object.prototype.hasOwnProperty.call(TERMS,c))return TERMS[c];
  var i,m;
  if(c.indexOf(' · ')>0&&!/^Option|^Ruling planet/.test(c))return c.split(' · ').map(exact).join(' · ');
  for(i=0;i<PAT.length;i++){m=c.match(PAT[i][0]);if(m){var r=PAT[i][1](m,exact);if(r!=null)return r}}
  m=c.match(/^([←→]\s*)(.+)$/);if(m)return m[1]+exact(m[2]);
  m=c.match(/^(.+?)(\s*→)$/);if(m)return exact(m[1])+m[2];
  if(c.indexOf(' · ')>0)return c.split(' · ').map(exact).join(' · ');
  if(c.length<=160&&c.indexOf(', ')>0){
    var parts=c.split(', ');
    if(parts.every(function(p){return Object.prototype.hasOwnProperty.call(P,p)||Object.prototype.hasOwnProperty.call(TERMS,p)}))
      return parts.map(exact).join(', ');
  }
  if(c.length<=70)return subTerms(c);
  return c;
}
function T(s){
  if(lang!=='as'||typeof s!=='string'||!s)return s;
  var hit=cache[s];if(hit!==undefined)return hit;
  var m=s.match(/^(\s*)([\s\S]*?)(\s*)$/);
  var out=m[2]?m[1]+exact(m[2])+m[3]:s;
  cache[s]=out;return out;
}
/* Assamese query -> English words, so people can search in Assamese */
function toEn(q){
  if(lang!=='as'&&!/[\u0980-\u09FF]/.test(q))return q;
  if(!REV){REV=Object.create(null);
    [P,TERMS].forEach(function(d){for(var k in d){var v=d[k];if(typeof v==='string'&&v.length<40&&/[\u0980-\u09FF]/.test(v)&&!(v in REV))REV[v]=k}})}
  var whole=REV[q.trim()];if(whole)return whole;
  return q.split(/\s+/).map(function(w){return REV[w]||w}).join(' ');
}
function setLang(l){lang=l==='en'?'en':'as';try{localStorage.setItem(KEY,JSON.stringify(lang))}catch(e){}
  document.documentElement.lang=lang==='as'?'as':'en'}
document.documentElement.lang=lang==='as'?'as':'en';
window.I18N={T:T,toEn:toEn,setLang:setLang,get lang(){return lang},
  name:function(c){return Object.prototype.hasOwnProperty.call(TERMS,c.name)?TERMS[c.name]:c.name}};
})();
