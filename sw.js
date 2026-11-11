const V='v2',LIBC='libs-v1',SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
// مكتبات خارجية بيحتاجها تقسيم الأحكام: بتتخزّن أول ما التطبيق يتثبّت وبتشتغل بعدها من غير نت
const LIBS=['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js','https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js','https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.1.1/tesseract.min.js','https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'];
self.addEventListener('install',e=>{e.waitUntil(Promise.all([caches.open(V).then(c=>c.addAll(SHELL)),caches.open(LIBC).then(c=>Promise.allSettled(LIBS.map(u=>c.match(u).then(m=>m||c.add(new Request(u,{mode:'cors'}))))))]).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==LIBC).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin){            // الصفحة نفسها: الشبكة الأول (عشان التحديثات) وبعدين النسخة المخزّنة
    e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
  }else if(/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|tessdata|unpkg\.com|fonts\.g(oogleapis|static)\.com/.test(u.host+u.pathname)){   // المكتبات: مخزّنة (كاش الأول)
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok||x.type==='opaque'){const c=x.clone();caches.open(LIBC).then(k=>k.put(r,c))}return x})));
  }
});
