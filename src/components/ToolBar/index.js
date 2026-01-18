import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

// Components
import StatusBar from '../StatusBar/';
import styles from './styles';

const ToolBar = ({ navigation }) => {
  return (
    <>
      <StatusBar />

      <Appbar.Header style={localStyles.header}>
        {/* LEFT */}
        <View style={localStyles.left}>
          <Image
            source={require('../../../assets/img/logo/toolbar_logo.png')}
            style={styles.logo}
          />
        </View>

        {/* BODY (empty like before) */}
        <View style={localStyles.body} />

        {/* RIGHT */}
        <View style={localStyles.right}>
          <Appbar.Action
            icon={() => (
              <Image
                source={require('../../../assets/icons/help.png')}
                style={styles.infoIcon}
              />
            )}
            onPress={() => navigation.navigate('Help')}
          />

          <Appbar.Action
            icon={() => (
              <Image
                source={require('../../../assets/icons/privacy.png')}
                style={styles.infoIcon}
              />
            )}
            onPress={() => navigation.navigate('IntroPrivacy')}
          />
        </View>
      </Appbar.Header>
    </>
  );
};

export default ToolBar;
const localStyles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  left: {
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});