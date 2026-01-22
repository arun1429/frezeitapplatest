import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {loginToken, userInfo} from '../../Redux/Actions/Actions';

const Splash = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    // ✅ Hide native splash immediately
    RNBootSplash.hide({fade: false});

    const bootstrap = async () => {
      // ⏳ Show animation for 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));

      const token = await AsyncStorage.getItem('loginToken');
      const info = await AsyncStorage.getItem('userInfo');

      if (token) {
        dispatch(loginToken(token));
        if (info) dispatch(userInfo(JSON.parse(info)));

        navigation.reset({
          index: 0,
          routes: [{name: 'App'}],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'Auth'}],
        });
      }
    };

    bootstrap();
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../../assets/animations/splash.json')}
        autoPlay
        loop
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // match BootSplash background
  },
});
