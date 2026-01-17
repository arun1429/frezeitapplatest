import React, {useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {loginToken, userInfo} from '../../Redux/Actions/Actions';
import eventBus from '../../utils/eventBus';

const Splash = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const info = await AsyncStorage.getItem('userInfo');

        if (token) {
          dispatch(loginToken(token));

          if (info) {
            dispatch(userInfo(JSON.parse(info)));
          }

          // Switch to App navigation
          eventBus.emit('whatToDO', {
            initialRouteName: 'Home',
            useNavigation: 'App',
          });
        } else {
          // Switch to Auth navigation
          eventBus.emit('whatToDO', {
            initialRouteName: 'Signin',
            useNavigation: 'Auth',
          });
        }
      } catch (e) {
        console.log('Splash bootstrap error:', e);
      } finally {
        RNBootSplash.hide({fade: true});
      }
    };

    bootstrap();
  }, [dispatch]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

export default Splash;
