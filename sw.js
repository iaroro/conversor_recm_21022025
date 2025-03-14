const CACHE_NAME = "conveertidor-temperatura-v1";

self.addEventListener('install', event =>{
    event.waitUntil((async()=> {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll([
            './',
           // './index.html',
           './manifest.json',
            './js/converter.js',
            './css/style.css'

        ]);
    })());
});
self.addEventListener('fetch', event =>{
    event.respondWith((async() => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);
        
         if(cachedResponse){
            return cachedResponse;
         }else{
            try{
                const fetchResponse = await fetch(event.request);
                const fetchResponseClone = fetchResponse.clone();
                cache.put(event.request, fetchResponseClone);
                return fetchResponse;

            }catch(e){
                //PROBLEMAS DE RED
            }
         }

    })());
});
