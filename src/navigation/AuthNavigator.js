import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Signin from '../screens/Auth/Signin';
import Signup from '../screens/Auth/Signup';
import RecoverPassword from '../screens/Auth/RecoverPassword';    
const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Signin" component={Signin} />
       <Stack.Screen name="forgotPassword" component={RecoverPassword}  />
       
    </Stack.Navigator>
  );
};

export default AuthNavigator;
