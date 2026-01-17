import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Settings from '../screens/Settings/index';
import NewsDetail from '../screens/NewsDetail/index';

const Stack = createNativeStackNavigator();
import DrawerNavigator from './DrawerNavigator';
const defaultStackSettings = {
  headerShown: false,
  gestureEnabled: false,
};
const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
       <Stack.Screen name="Home" component={DrawerNavigator} options={defaultStackSettings} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="NewsDetail" component={NewsDetail} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
