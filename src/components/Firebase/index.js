import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, {firebase} from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

export async function requestUserPermission(cb) {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}

export const getFcmToken = async (val = false) => {
  let fcmToken = await AsyncStorage.getItem('DeviceToken');
  console.log(Platform.OS == 'android' ? `Android FCM Token ${fcmToken}` : 'ios token');

  if (!fcmToken) {
    try {
      const dvcToken = await messaging().getToken();
      if (dvcToken) {
        console.log('fcmTokendf', dvcToken);
        await AsyncStorage.setItem('DeviceToken', dvcToken);
      }
      if (val) {
        return dvcToken;
      }
    } catch (e) {
      console.log('err');
    }
  }
  if (val) {
    return fcmToken;
  }
  // if (cb) cb();
};

export const notificationListener = async cb => {
  // const {NotificationHandler} = useUserContexts()
  messaging().onNotificationOpenedApp(remoteMassage => {
    console.log('HERR ');
    console.log('====================================');
    console.log('background', remoteMassage);
    console.log('====================================');

    remoteMassage.notification;

    // if(remoteMassage.data.t == '2'){

    //   this.props.navigation?.navigate('LoginScreen')
    // }
  });

  messaging().onMessage(async remoteMessage => {
    console.log('foreground', remoteMessage);
    // console.log("REMOTE NOTIFICATION ", remoteMassage.notification)
    (() => {
      try {
        let obj = {
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          // extra: 'data',
          payload: {
            customData: remoteMessage.data,
          },
          // sound: 'default',
          badge: true,
          priority: 'high',
          largeIcon: 'ic_notification',
          smallIcon: 'ic_notification',
          vibrate: true,
          vibration: 300,
          // popInitialNotification: true,
          // actions: '["Yes", "No"]',
          // invokeApp: false,
          // visibility: 'public',
          // importance: 'high',
          // allowWhileIdle: false,
          // ignoreInForeground: false,
          // repeatType: 'day',
          repeatTime: 0,
          // image: remoteMessage.data.image || 'https://example.com/path/to/image.jpg',
        };
        if (remoteMessage.notification.android?.imageUrl) {
          obj.image = remoteMessage.notification.android?.imageUrl;
        }
        console.log('====================================');
        console.log({obj});
        console.log('====================================');
      } catch (error) {
        console.log('====================================');
        console.log({error});
        console.log('====================================');
      }
    })();
    // PushNotification.localNotification({...obj});
    // cb(remoteMassage);
    // console.log('NotificationHandler onMessage', NotificationHandler)
    // Alert.alert("Notification  from firebase", remoteMassage.notification.body)
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage.notification);
        // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
    });

  // Configure PushNotification

  // cb();
};
