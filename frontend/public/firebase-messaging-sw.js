importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js')

if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: 'AIzaSyDkwiuX1WF4NWY3WwD9mkysAZJi4WXcnTE',
    authDomain: 'yakhaijaai.firebaseapp.com',
    projectId: 'yakhaijaai',
    storageBucket: 'yakhaijaai.appspot.com',
    messagingSenderId: 500583197338,
    appId: '1:500583197338:web:b59ae55463e021e0c80d23',
  }

  firebase.initializeApp(firebaseConfig)
} else {
  firebase.app()
}

const messaging = firebase.messaging()
messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload)

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
