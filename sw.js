const V='v1',SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin){            // الصفحة نفسها: الشبكة الأول (عشان التحديثات) وبعدين النسخة المخزّنة
    e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
  }else if(/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|tessdata|unpkg\.com/.test(u.host+u.pathname)){   // المكتبات: مخزّنة بعد أول تحميل (تشتغل بدون نت)
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok||x.type==='opaque'){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x})));
  }
});
