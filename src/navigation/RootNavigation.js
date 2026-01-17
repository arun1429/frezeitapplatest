import React, {useEffect, useRef, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import eventBus from '../utils/eventBus';
import SplashScreen from '../screens/Splash/Splash';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const Stack = createNativeStackNavigator();
const RootNavigation = () => {
   const [initialRouteName, setInitialRouteName] = useState('Splash');
  const [useNavigation, setUseNavigation] = useState('Auth');
  const [currentRouteName, setCurrentRouteName] = useState('');

  const routeNameRef = useRef();

 const handleDidFocus = (data) => {
   console.log({data});
      setInitialRouteName(data.initialRouteName);
      setUseNavigation(data.useNavigation);
  };
  useEffect(() => {
    setInitialRouteName('Screen');
     eventBus.on('whatToDO', handleDidFocus);
    return () => {
       eventBus.off('whatToDO', handleDidFocus);
    };
  }, []);
  const [isLoading, setIsLoading] = useState(true); useEffect(() => { 
    const t = setTimeout(() => setIsLoading(false), 1200); return () => clearTimeout(t); }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoading ?
          (<Stack.Screen name="Splash" component={SplashScreen} />
          ) : useNavigation && useNavigation == 'Auth' ?
            (<Stack.Screen name="App" component={AppNavigator} />

            ) : (
              <Stack.Screen name="Auth" component={AppNavigator} />)} 
    </Stack.Navigator> </NavigationContainer>);
};
export default RootNavigation;