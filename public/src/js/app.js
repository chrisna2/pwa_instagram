if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}



function displayConfirmationNotification() {
  if ('serviceWorker' in navigator) {
    var options = {
      body: '알림 설정 잘 됬어요!.',
      icon: '/src/images/icons/app-icon-96x96.png',
      image: '/src/images/sf-boat.jpg',
      dir: 'ltr',
      lang: 'ko-KR', // BCP-47 lang code
      vibrate: [100, 50, 200],
      badge: '/src/images/icons/app-icon-96x96.png',
      tag: 'confirm-noti',
      renotify: true,
      actions: [
        { action: 'confirm', title: 'Okay', icon: '/src/images/icons/app-icon-96x96.png'},
        { action: 'cancel', title: 'Cancel', icon: '/src/images/icons/app-icon-96x96.png'},
      ]
    };
    navigator.serviceWorker.ready
      .then(function (swreg) {
        swreg.showNotification('Successfully subscribed! [from SW]', options);
      });
  }
}
function askNotificationPermission(){
  Notification.requestPermission(function (result){
    console.log('User choice', result);
    if(result !== 'granted'){
      console.log('사용자가 알림을 허용하지 않았습니다.')
    }
    else{
      //new Notification('사용자가 알림을 허용했습니다.')
      displayConfirmationNotification()
    }
  });
}

var notiEnableButtons = 
  document.querySelectorAll('button.enable-notifications');
for (var i = 0; i< notiEnableButtons.length; i++){
  notiEnableButtons[i].addEventListener('click', askNotificationPermission);
}

function configurePushSub() {
  // 구현!..

}

function askForNotificationPermission() {
  Notification.requestPermission(function (result) {
    console.log('User Choice', result);
    if (result !== 'granted') {
      console.log('No notification permission granted!..');
    } 
    else {
      configurePushSub();
    // displayConfirmationNotification();
    }
  });
}