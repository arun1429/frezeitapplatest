import React, { Component } from 'react';
import {
  View,
  Image,
  Alert,
  ScrollView,
  Share,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';

import { Appbar, Button, List, Divider } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';

import eventBus from '../../utils/eventBus';

// API
import HttpRequest from '../../utils/HTTPRequest';
import LocalData from '../../utils/LocalData';

// Redux
import { connect } from 'react-redux';
import { userInfo, loginToken } from '../../Redux/Actions/Actions';
import { bindActionCreators } from 'redux';

// Components
import StatusBar from '../../components/StatusBar/';
import HomeHeader from '../../components/Header/HomeHeader';

import colors from '../../constants/colors';
import styles from './styles';

import { SafeAreaView } from 'react-native-safe-area-context';

const drawerImage = require('../../../assets/default_user.png');
const drawerLogo = require('../../../assets/img/logo/signInLogo.png');

/* ---------------- MENU DATA ---------------- */

const MENU_AUTH = [
  { id: 2, name: 'WISHLIST', route: 'Wishlist', icon: 'favorite', type: 'MaterialIcons' },
  { id: 3, name: 'DOWNLOAD', route: 'Download', icon: 'download', type: 'Ionicons' },
  { id: 4, name: 'SETTINGS', route: 'Settings', icon: 'player-settings', type: 'Fontisto' },
  { id: 5, name: 'HELP', route: 'Help', image: require('../../../assets/icons/help.png') },
  { id: 6, name: 'PRIVACY', route: 'Privacy', image: require('../../../assets/icons/privacy.png') },
  { id: 7, name: 'CONNECT TV', route: 'ConnectDevices', icon: 'devices', type: 'MaterialIcons' },
];

const MENU_GUEST = MENU_AUTH.filter(i => i.id !== 7);

/* ---------------- COMPONENT ---------------- */

class More extends Component {
  componentDidMount() {
    eventBus.emit('videoPaused', { isClosed: 'false' });
  }

  logout = () => {
    Alert.alert('Log Out', 'Are you sure you want to logout?', [
      { text: 'Cancel' },
      { text: 'Logout', onPress: this.logoutAPI },
    ]);
  };

  logoutAPI = () => {
    const { token } = this.props;

    if (!token) return Alert.alert('Oops', 'Unable to logout');

    HttpRequest.logout(token)
      .then(res => {
        if (res.status === 200 && res.data.error === false) {
          LocalData.setLoginToken('');
          this.props.loginToken('');
          LocalData.setUserInfo(null).then(() => {
            this.props.navigation.navigate('Signin');
          });
        } else {
          Alert.alert('Oops', 'Unable to logout');
        }
      })
      .catch(() => Alert.alert('Oops', 'Unable to logout'));
  };

  referAFriend = () => {
    const link =
      Platform.OS === 'android'
        ? 'https://play.google.com/store/apps/details?id=com.freizeitMedia'
        : 'https://apps.apple.com/in/app/freizeit-media/id1529561669';

    Share.share({
      message: `Hi! Have you seen this Freizeit app yet? ${link}`,
    });
  };

  renderIcon = item => {
    if (item.image) {
      return <Image source={item.image} style={styles.ImageIcon} />;
    }

    switch (item.type) {
      case 'Ionicons':
        return <Ionicons name={item.icon} size={22} color="#fff" />;
      case 'Fontisto':
        return <Fontisto name={item.icon} size={22} color="#fff" />;
      case 'MaterialIcons':
      default:
        return <MaterialIcons name={item.icon} size={22} color="#fff" />;
    }
  };

  render() {
    const { token, info } = this.props;
    const menuData = token ? MENU_AUTH : MENU_GUEST;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroudColor }}>
        <HomeHeader {...this.props} />
        <StatusBar hidden={false} />

        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {/* PROFILE HEADER */}
          <View style={styles.drawerHeader}>
            <Image source={drawerImage} style={styles.customerPicture} />
            <Text style={styles.headerText}>{info?.name}</Text>
          </View>

          {/* PROFILE BUTTON */}
          {token ? (
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() =>
                this.props.navigation.navigate('Profile', { auth: true })
              }
            >
              <Ionicons name="person-add" size={22} color="#fff" />
              <Text style={styles.text}>PROFILE</Text>
            </TouchableOpacity>
          ) : null}

          {/* MENU */}
          {menuData.map(item => (
            <View key={item.id}>
              <List.Item
                title={item.name}
                titleStyle={styles.text}
                left={() => this.renderIcon(item)}
                onPress={() =>
                  this.props.navigation.navigate(item.route, { auth: true })
                }
                style={styles.items}
              />
              <Divider />
            </View>
          ))}

          {/* REFER FRIEND */}
          <View style={styles.referContainer}>
            <View style={styles.referHeader}>
              <FontAwesome name="wechat" size={24} color="#fff" />
              <Text style={styles.referTitle}>
                Tell Friends about Freizeit
              </Text>
            </View>

            <Text style={styles.text}>
              Share the app so your friends can join the conversation around
              all your favourite TV shows and movies.
            </Text>

            <Button
              mode="outlined"
              textColor="#ff0000"
              style={styles.referButton}
              onPress={this.referAFriend}
            >
              Refer a friend
            </Button>
          </View>

          {/* LOGO */}
          <Image
            source={drawerLogo}
            style={styles.contentPicture}
            resizeMode="contain"
          />

          {/* LOGOUT */}
          {token ? (
            <TouchableOpacity style={styles.logoutButton} onPress={this.logout}>
              <Ionicons name="log-out" size={22} color="#fff" />
              <Text style={styles.text}>LOGOUT</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

/* ---------------- REDUX ---------------- */

const mapStateToProps = state => ({
  info: state.info,
  token: state.token,
});

const mapDispatchToProps = dispatch => ({
  userInfo: bindActionCreators(userInfo, dispatch),
  loginToken: bindActionCreators(loginToken, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(More);
