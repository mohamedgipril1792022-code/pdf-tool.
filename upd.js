(function(){
'use strict';
var CODE=1, URLV='version.json';
var bar=null,busy=false,last=0;
function css(el,o){for(var k in o)el.style[k]=o[k]}
function show(remote){
  if(bar)return;
  bar=document.createElement('div');
  css(bar,{position:'fixed',left:'0',right:'0',bottom:'0',zIndex:'2147483000',background:'#0f766e',color:'#fff',
   font:'15px/1.5 system-ui,"Segoe UI",Tahoma',padding:'10px 14px',display:'flex',gap:'10px',
   alignItems:'center',justifyContent:'space-between',boxShadow:'0 -2px 12px rgba(0,0,0,.25)',direction:'rtl'});
  var t=document.createElement('span');
  t.textContent='نسخة جديدة متاحة ('+remote+') — اضغط تحديث';
  var b=document.createElement('button');
  b.textContent='تحديث';
  css(b,{background:'#fff',color:'#0f766e',border:'0',borderRadius:'8px',padding:'8px 16px',fontWeight:'700',fontSize:'15px',cursor:'pointer'});
  b.onclick=go;
  bar.appendChild(t);bar.appendChild(b);
  document.body.appendChild(bar);
}
async function go(){
  if(busy)return;busy=true;
  try{if(window.caches&&caches.keys){var ks=await caches.keys();await Promise.all(ks.map(function(k){return caches.delete(k)}))}}catch(e){}
  try{var rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(function(r){return r.update()}))}catch(e){}
  location.reload();
}
async function check(){
  if(!navigator.onLine)return;
  var now=Date.now(); if(now-last<60000)return; last=now;
  try{
    var r=await fetch(URLV+'?t='+now,{cache:'no-store'});
    if(!r.ok)return;
    var j=await r.json();
    var c=parseInt(j&&j.code,10);
    if(c>CODE) show(c);
  }catch(e){}
}
addEventListener('load',function(){setTimeout(check,2500)});
addEventListener('focus',check);
setInterval(check,1800000);
document.addEventListener('visibilitychange',function(){if(!document.hidden)check()});
})();
