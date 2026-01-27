import React, {useEffect, useState, useCallback} from 'react';
import {View, Alert, Platform, Linking, StyleSheet} from 'react-native';

import GetLocation from 'react-native-get-location';
import Geocoder from 'react-native-geocoding';
import HttpRequest from '../utils/HTTPRequest';
import LocalData from '../utils/LocalData';

import {useDispatch, useSelector} from 'react-redux';
import {userInfo, loginToken} from '../Redux/Actions/Actions';
import {useNavigation} from '@react-navigation/native';
import messaging, {firebase} from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import Orientation from 'react-native-orientation-locker';
import RNBootSplash from 'react-native-bootsplash';
import LottieView from 'lottie-react-native';

import StatusBar from '../components/StatusBar/';
import Alerts from '../components/Alerts/';
import styles from './styles';
import eventBus from '../utils/eventBus';

const Splash = () => {
   const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector(state => state.token);

  const [isNotify, setIsNotify] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [type, setType] = useState('');
  const [action, setAction] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log('IN SPLASH');

    Geocoder.init('AIzaSyBtVxQKIzdnxWOgUg4BOLTCWdYSWDAFIfk');
    getFcmToken()
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        _userInstallCheck(location);
        Geocoder.from(location.latitude, location.longitude)
          .then(json => {
            const addressComponent =
              json.results[0].address_components[1].short_name +
              ', ' +
              json.results[0].address_components[5].short_name;

            _userInstallCheck(location, addressComponent);
          })
          .catch(error => console.warn(JSON.stringify(error)));
      })
      .catch(error => {
        console.log('error msg', JSON.stringify(error));
      });

    Orientation.lockToPortrait();
    RNBootSplash.hide();
    begin();

    return () => {};
  }, []);

  const _userInstallCheck = (location, address) => {
    DeviceInfo.getDeviceName().then(deviceName => {
      let deviceId = DeviceInfo.getUniqueId();
      const formData = {
        device_name: deviceName,
        device_id: deviceId,
      };

      HttpRequest.usersInstall(formData)
        .then(res => {
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            console.log('Check Data  ', result);
          } else {
            console.log('Signin API Error : ', result);
          }
        })
        .catch(err => {
          console.log(' USer Check  API Catch Exception: ', err);
         // notify('danger', 'Oops!', 'Something Went Wrong!', false);
        });
    });
  };

  const begin = () => {
    setTimeout(() => {
      LocalData.getLoginToken().then(val => {
        if (val === null || val == '') {
          LocalData.getAlreadyLaunched().then(value => {
            if (value === null) {
              LocalData.setAlreadyLaunched('true').then(() => {
                checkNetworkConnectivity('Replace');
              });
            } else {
              checkNetworkConnectivity('Replace');
            }
          });
        } else {
          LocalData.getUserInfo().then(info => {
            dispatch(userInfo(JSON.parse(info)));
            dispatch(loginToken(val));
            checkNetworkConnectivity('Replace');
          });
        }
      });
    }, 1500);
  };

  const checkNetworkConnectivity = route => {
    if (Platform.OS === 'android') {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          appMaintenanceCheck(route);
        } else {
          Alert.alert(
            'Internet Connection!',
            'Make sure you are connected to the internet',
            [{text: 'Ok', onPress: () => Linking.openSettings()}],
          );
        }
      });
    } else {
      handleFirstConnectivityChange(route);
    }
  };

  const handleFirstConnectivityChange = route => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        appMaintenanceCheck(route);
      } else {
        Alert.alert(
          'Internet Connection!',
          'Make sure you are connected to the internet',
          [{text: 'Ok', onPress: () => Linking.openSettings()}],
        );
      }
    });
    unsubscribe();
  };
  const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  console.log('Permission enabled:', enabled);
  return enabled;
};
const getFcmToken = async () => {
  const hasPermission = await requestUserPermission();

  if (!hasPermission) return;

  const token = await messaging().getToken();
  console.log('🔥 FCM Token:', token);

  return token;
};
  const appMaintenanceCheck = route => {
    HttpRequest.checkMaintenance()
      .then(res => {
        const result = res.data;
        if (res.status == 200 && result.error == 'false') {
          if (result.status == '1') {
            navigation.navigate('Maintenance');
          } else {
            appVersionCheck(route);
          }
        }
      })
      .catch(err => console.log(err));
  };

  const appVersionCheck = route => {
    let version = DeviceInfo.getVersion();
    HttpRequest.appVersionCheck({
      version: version,
      platform: Platform.OS === 'android' ? 0 : 1,
    })
      .then(res => {
        const result = res.data;
        if (res.status == 200 && result.error == 'false') {
          if (result.status == '1') {
            notify(
              'warning',
              'Alert!',
              'New update available. Please update the app.',
              'UPDATE',
            );
          } else {
             navigation.reset({
                    index: 0,
                    routes: [{name: 'App'}],
                  });
          }
        }
      })
      .catch(err => console.log(err));
  };

  const notify = (type, title, subtitle, action) => {
    setIsNotify(true);
    setTitle(title);
    setSubtitle(subtitle);
    setType(type);
    setAction(action);
  };

  const updateNotify = () => {
    setIsNotify(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar />

      {isNotify && (
        <Alerts
          show={true}
          type={type}
          title={title}
          subtitle={subtitle}
          navigation={navigation}
          action={action}
          parentReference={updateNotify}
        />
      )}

      <LottieView
        source={require('../../assets/animations/splash.json')}
        autoPlay
        loop
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
};

export default Splash;
