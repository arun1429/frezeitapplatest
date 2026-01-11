/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './src/navigation';
// import { Settings } from 'react-native-fbsdk-next';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
// Settings.initializeSDK();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
AppRegistry.registerComponent(appName, () => App);
