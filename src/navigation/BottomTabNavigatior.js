import React from 'react';
import TabBarIcon from './TabBarIcon';
import Wishlist from '../screens/Wishlist';
import NewsScreen from '../screens/News';
import EntertainmentScreen from '../screens/Entertainment';
import Downloads from '../screens/Downloads';
import More from '../screens/More';
import HomeScreen from '../screens/Home';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import colors from '../constants/colors';
import {Platform} from 'react-native';

const Tabs = createBottomTabNavigator();

const BottomTabNavigatior = () => {
  return (
    <Tabs.Navigator
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarActiveBackgroundColor: colors.backgroudColor,
        tabBarInactiveBackgroundColor: colors.backgroudColor,

        // 🔧 FIX 1: Adjust label spacing (do NOT push into system nav)
        tabBarLabelStyle: {
          fontSize: 10,
          paddingBottom: Platform.OS === 'android' ? 4 : 0,
        },

        // 🔧 FIX 2: Remove fixed height & let RN handle safe-area
        tabBarStyle: {
          backgroundColor: colors.backgroudColor,
          borderTopWidth: 1,
          borderTopColor: colors.backgroudColor,

          // ✅ Added padding to avoid Android navigation bar overlap
          paddingBottom: Platform.OS === 'android' ? 8 : 20,
          paddingTop: 6,
        },

        headerShown: false,

        // 🔧 FIX 3: Icon size was too small
        tabBarIconStyle: {width: 22, height: 22},
      })}
    >
      <Tabs.Screen
        name="Hometab"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              focused={focused}
              icon={require('../../assets/icons/sideMenu/home_icon.png')}
            />
          ),
        }}
        component={HomeScreen}
      />

      <Tabs.Screen
        name="Wishlist"
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              focused={focused}
              icon={require('../../assets/icons/sideMenu/myList_icon.png')}
            />
          ),
        }}
        component={Wishlist}
      />

      <Tabs.Screen
        name="News"
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              focused={focused}
              icon={require('../../assets/icons/sideMenu/news.png')}
            />
          ),
        }}
        component={NewsScreen}
      />

      <Tabs.Screen
        name="Entertainment"
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              focused={focused}
              icon={require('../../assets/icons/sideMenu/movies2.png')}
            />
          ),
        }}
        component={EntertainmentScreen}
      />

      <Tabs.Screen
        name="Download"
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              focused={focused}
              icon={require('../../assets/icons/sideMenu/download_icon.png')}
            />
          ),
        }}
        component={Downloads}
      />

      <Tabs.Screen
        name="More"
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              focused={focused}
              icon={require('../../assets/icons/sideMenu/toggle_icon.png')}
            />
          ),
        }}
        component={More}
      />
    </Tabs.Navigator>
  );
};

export default BottomTabNavigatior;
