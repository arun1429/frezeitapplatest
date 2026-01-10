import {createNavigationContainerRef, NavigationContainer} from '@react-navigation/native';
import {StyleSheet, StatusBar, View, Text} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import eventBus from '../utils/eventBus';

//Navigator
export const navigationRef = createNavigationContainerRef();
import AuthNavigation from './AuthNavigation';
import AppNavigation from './AppNavigation';
import colors from '../constants/colors';
export const navigate = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

const defaultStackSettings = {
  headerShown: false,
  gestureEnabled: false,
};

const RootNavigation = () => {
  const [initialRouteName, setInitialRouteName] = useState('Splash');
  const [useNavigation, setUseNavigation] = useState('Auth');
  const [currentRouteName, setCurrentRouteName] = useState('');

  const routeNameRef = useRef();

  useEffect(() => {
    setInitialRouteName('splashScreen');
     eventBus.on('whatToDD', this.handleDidFocus);
    return () => {
       eventBus.off('whatToDD', this.handleDidFocus);
    };
  }, []);
handleDidFocus = (data) => {
   // console.log({data});
      setInitialRouteName(data.initialRouteName);
      setUseNavigation(data.useNavigation);
  };
  return (
    <>
      <StatusBar translucent={true} backgroundColor={ colors.backgroudColor} barStyle="light-content" />
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, {backgroundColor: currentRouteName != 'Splash' && currentRouteName != 'Video'  ? colors.backgroudColor : currentRouteName == 'Video' ? colors.black : colors.splash}]}>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              routeNameRef.current = navigationRef.current.getCurrentRoute().name;
              setCurrentRouteName( routeNameRef.current);
            }}
            onStateChange={async () => {
              const previousRouteName = routeNameRef.current;
              const currentRouteName = navigationRef.current.getCurrentRoute().name;
              eventBus.emit('onDidFocus', {
                check: '',force: true 
              });
              routeNameRef.current = currentRouteName;
              setCurrentRouteName( routeNameRef.current);
            }}>
             
            {useNavigation && useNavigation == 'Auth' ? <AuthNavigation initialRouteName={initialRouteName} /> : <AppNavigation initialRouteName={initialRouteName} />}
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RootNavigation;
