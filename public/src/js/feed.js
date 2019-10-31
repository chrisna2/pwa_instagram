var sharedMomentsArea = document.querySelector('#shared-moments');

function createCard(contentArray) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url('+contentArray[0]+')';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = contentArray[2];
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = contentArray[1];
  cardSupportingText.style.textAlign = 'center';
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

// [4] Cache then Network 전략 : 네트워크와 캐시를 동시에 접근하는 전략  
// 일반적인 자바 스크립트를 사용함
var url = 'https://pwa-gram-a5593.firebaseio.com/posts.json';
var networkDataRecieved = false;

function clearCards(){
  while(sharedMomentsArea.hasChildNodes()){
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild)
  }
}

//네트워크 접속
fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataRecieved = true;
    console.log('From network...', data);

    var content = [];
    content.push(data['first-post']['image']);
    content.push(data['first-post']['location']);
    content.push(data['first-post']['title']);

    clearCards();
    createCard(content);
  })
  .catch(function(err){
    console.log('Network fail...', err)
  });

//캐쉬 정보
if ('caches' in window) {
  caches.match(url)
        .then(function(res){
          if(res){
            return res.json();
          }
        })
        .then(function (data){
          console.log('From cache...', data)
          if(!networkDataRecieved){

            var content = [];
            content.push(data['first-post']['image']);
            content.push(data['first-post']['location']);
            content.push(data['first-post']['title']);

            clearCards();
            createCard(content);
          }
        });
}

