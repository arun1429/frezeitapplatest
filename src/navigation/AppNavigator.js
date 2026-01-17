import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Settings from '../screens/Settings/index';
import NewsDetail from '../screens/NewsDetail/index';
import MovieLanguages from '../screens/LanguagesMovieList';

import Details from '../screens/Details/';
import Search from '../screens/Search';
import Signup from '../screens/Auth/Signup/';
import Signin from '../screens/Auth/Signin/';
import Profile from '../screens/MyProfile/';
const Stack = createNativeStackNavigator();
import DrawerNavigator from './DrawerNavigator';
const defaultStackSettings = {
  headerShown: false,
  gestureEnabled: false,
};
const AppNavigator  = (props) => {
  const commonProps = {
    appSource: 'AppNavigator',
    environment: 'production',
    ...props, // anything coming from root
  };

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
       <Stack.Screen name="Home" component={DrawerNavigator} options={defaultStackSettings} />
        <Stack.Screen name="Signup" component={Signup} options={defaultStackSettings} />
      <Stack.Screen name="Signin" component={Signin} options={defaultStackSettings} />
      <Stack.Screen name="Profile" component={Profile} options={defaultStackSettings} />
       <Stack.Screen name="Search" component={Search} options={defaultStackSettings} />
       <Stack.Screen name="Details" component={Details} options={defaultStackSettings} />
      <Stack.Screen name="Settings" component={Settings} options={defaultStackSettings} />
      <Stack.Screen name="NewsDetail" component={NewsDetail} options={defaultStackSettings} />
      <Stack.Screen name="MoviesByLanguages" component={MovieLanguages} options={defaultStackSettings}/>
    </Stack.Navigator>
  );
};

export default AppNavigator;
