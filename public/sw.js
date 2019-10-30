//캐쉬 버전 관리
var STATIC_CACHE_VERSION = 'static-v07';
var DYNAMIC_CACHE_VERSION = 'dynamic-v07';

//나중에는 이런부분은 라이브러리를 사용하여 이 과정을 생략한다. 웹박스
var CACHE_STATIC_FILES = [
  '/index.html',
  //'/help/index.html', //만약 이 화면을 캐싱에 집어 넣지 않았다면..
  '/offline.html',
  '/src/js/app.js',
  '/src/js/feed.js',
  '/src/js/material.min.js',
  '/src/css/app.css',
  '/src/css/feed.css',
  '/src/css/help.css',
  '/src/images/main-image-lg.jpg',
  '/src/images/main-image-sm.jpg',
  '/src/images/main-image.jpg',
  '/src/images/sf-boat.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];
//install -> pre-caching
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE_VERSION)
      .then(function(caches){
        console.log('[Service Worker] pre-caching 완료 ...');
        caches.addAll(CACHE_STATIC_FILES);
      })
  );
  console.log('[Service Worker] Service Worker 설치 ...', event);
}); 

//activate -> 캐쉬 버전관리
self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);

  // 캐쉬 버전이 바뀌는 경우 이전 버전의 캐쉬를 삭제 처리한다.
  event.waitUntil(
    caches.keys()
          .then(function(keylist){
            return Promise.all(keylist.map(function (key){
              if(key !== STATIC_CACHE_VERSION && key !== DYNAMIC_CACHE_VERSION){
                console.log('[Service Worker] 이전 버전의 캐쉬를 삭제 ...');
                return caches.delete(key)
              }
            }));
          })
  );
  return self.clients.claim();
});

//fetch -> 다이나믹 캐시에 저장 & 네트워크 처리
self.addEventListener('fetch', function(event) {
  console.log('[Service Worker] Fetching something ....', event);
  
  // 캐싱전략 : 
  
  // [1] cache only 전략
  // event.respondWith(
  //   caches.match(event.request)
  // );

  // [2] network only 전략
  // event.respondWith(
  //   fetch(event.request)
  // );

  // [3] Network first 전략 (Network with cache fallback)
  // event.respondWith(
  //   fetch(event.request).then(function(res){
  //     caches.open(CACHE_DYNAMIC_NAME)
  //           .then(function (cache) {
  //           cache.put(event.request.url, res.clone());
  //           return res;
  //           });  
  //   })
  //   .catch(function (err) {
  //     return caches.match(event.request);
  //   })
  // );

  // [4] Cache then Network 전략 : 네트워크와 캐시를 동시에 접근하는 전략 -> feed.js 참조




  // [5] cache with network 전략
  // 캐쉬에 응답이 있는 경우 caching first <-> 네트워크 응답이 우선인 경우 캐쉬가 아닌 network first
  event.respondWith(
    caches.match(event.request)
      .then(function(response){
        if(response){
          return response;// 서버까지 안가고 오프라인에서 처리함
        }
        else{
          return fetch(event.request)
            // 다이나믹 캐시에 저장
            .then(function(res){
              caches.open(DYNAMIC_CACHE_VERSION)
                    .then(function(cache){
                      cache.put(event.request.url, res.clone());
                      return res;
                    })
            })
            // 에러처리
            .catch(function(err){
              console.log(err);
              //오프 라인에 해당 화면에 담기지 않은 경우.
              return caches.open(STATIC_CACHE_VERSION)
                    .then(function(cache){
                      //없는 페이지를 디폴틀로 올려준다
                      return cache.match('/offline.html');
                    })
            });
        }
      })
  );
});