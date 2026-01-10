import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Text,
} from 'react-native';

import { Button } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import * as Animatable from 'react-native-animatable';
import Orientation from 'react-native-orientation-locker';
import NetInfo from '@react-native-community/netinfo';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

// Local Storage
import LocalData from '../../utils/LocalData';
// API
import HttpRequest from '../../utils/HTTPRequest';

// Redux
import { connect } from 'react-redux';
import { userInfo, loginToken, notification, wifiInfo } from '../../Redux/Actions/Actions';
import { bindActionCreators } from 'redux';

// Components
import StatusBar from '../../components/StatusBar/';
import Alerts from '../../components/Alerts/';
import Banner from '../../components/AdMob/Banner';
import withSequentialRendering from '../../components/withSequentialRendering';

// Styles
import styles from './styles';

const SequentialBanner = withSequentialRendering(Banner);

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wifiOnly: 0,
      videoQuality: 2,
      isLoading: false,
      isNotify: false,
      title: '',
      subtitle: '',
      type: '',
      action: false,
      notification: 0,
      isConnected: false,
    };

    this.inputRefs = {
      picker: null,
    };
  }

  componentDidMount() {
    Orientation.lockToPortrait();
    this.checkNetworkConnectivity();
  }

  /* ---------------- NETWORK ---------------- */

  checkNetworkConnectivity = () => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        Alert.alert(
          'Network Error',
          "Failed to connect to Freizeit. Please check your device's network connection.",
          [
            { text: 'Cancel', onPress: () => this.setState({ isConnected: false }) },
            { text: 'Retry', onPress: this.checkNetworkConnectivity },
          ],
        );
      } else {
        this.setState({ isConnected: true });
        this.getSettings();
      }
    });
  };

  /* ---------------- SETTINGS ---------------- */

  getSettings = () => {
    if (!this.props.token) return;

    HttpRequest.getSettings(this.props.token)
      .then(res => {
        if (res.status === 200 && res.data.error === false) {
          const result = res.data;
          this.props.wifiInfo(result.wifi);
          this.setState({
            wifiOnly: result.wifi,
            videoQuality: result.video_quality,
            notification: result.notification,
          });
        }
      })
      .catch(err => console.log(err));
  };

  onUpdate = (wifiOnly, videoQuality, notification) => {
    if (!this.props.token) return;

    HttpRequest.updateSettings(this.props.token, {
      wifi: wifiOnly,
      video_quality: videoQuality,
      notification,
    })
      .then(res => {
        if (res.status === 200 && res.data.error === false) {
          this.props.wifiInfo(wifiOnly);
        }
      })
      .catch(err => console.log(err));
  };

  toggleWifiOnly = () => {
    const { wifiOnly, videoQuality, notification } = this.state;
    const status = wifiOnly ? 0 : 1;
    this.setState({ wifiOnly: status });
    this.onUpdate(status, videoQuality, notification);
  };

  onPickerValueChange = value => {
    const { wifiOnly, notification, videoQuality } = this.state;
    if (videoQuality !== value) {
      this.setState({ videoQuality: value });
      this.onUpdate(wifiOnly, value, notification);
    }
  };

  openPicker = () => {
    this.inputRefs.picker?.togglePicker();
  };

  /* ---------------- DOWNLOADS ---------------- */

  deleteAllDownloads = () => {
    if (!this.props.token) return;

    HttpRequest.deleteAllDownloads(this.props.token)
      .then(res => {
        if (res.status === 200 && res.data.error === false) {
          LocalData.setDownloads('');
          this.notify('success', 'Good Job!', 'All downloads deleted successfully.', false);
        }
      })
      .catch(() =>
        this.notify('danger', 'Oops!', 'Something Went Wrong!', false),
      );
  };

  /* ---------------- ALERT ---------------- */

  notify = (type, title, subtitle, action) => {
    this.setState({
      isNotify: true,
      title,
      subtitle,
      type,
      action,
    });
  };

  updateNotify = () => {
    this.setState({ isNotify: false });
  };

  /* ---------------- RENDER ---------------- */

  render() {
    const {
      isConnected,
      isNotify,
      title,
      subtitle,
      type,
      action,
      wifiOnly,
      notification,
      videoQuality,
    } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar translucent barStyle="light-content" />

        {isNotify && (
          <Alerts
            show
            type={type}
            title={title}
            subtitle={subtitle}
            navigation={this.props.navigation}
            action={action}
            parentReference={this.updateNotify}
          />
        )}

        <SafeAreaView style={styles.rightContainer}>
          <View style={styles.marginContainer}>
            <Animatable.View animation="slideInRight" style={styles.resultContainer}>
              {!isConnected && (
                <View style={styles.noResultContainer}>
                  <Text style={styles.errorText}>
                    There is a problem connecting to Freizeit.
                  </Text>
                  <Button mode="contained" onPress={this.checkNetworkConnectivity}>
                    Retry
                  </Button>
                </View>
              )}

              {isConnected && (
                <>
                  {/* HEADER */}
                  <View style={styles.rowHeader}>
                    <Text style={styles.thumbnailHeader}>App Settings</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                      <AntDesign name="close" size={18} color="red" />
                    </TouchableOpacity>
                  </View>

                  {/* ACCOUNT */}
                  <Text style={styles.seperatorText}>Accounts</Text>
                  <TouchableOpacity
                    style={styles.items}
                    onPress={() => this.props.navigation.navigate('Profile')}
                  >
                    <AntDesign name="user" size={18} color="#fff" />
                    <View style={styles.itemBody}>
                      <Text style={styles.label}>Email</Text>
                      <Text style={styles.subLabel}>{this.props.info?.name}</Text>
                    </View>
                    <MaterialIcons name="navigate-next" size={28} color="#fff" />
                  </TouchableOpacity>

                  <SequentialBanner />

                  {/* DOWNLOAD */}
                  <Text style={styles.seperatorText}>Download</Text>

                  <View style={styles.items}>
                    <AntDesign name="wifi" size={18} color="#fff" />
                    <Text style={styles.label}>Wifi / Cellular</Text>
                    <Switch
                      trackColor={{ true: 'red', false: 'grey' }}
                      thumbColor="#fff"
                      value={wifiOnly === 1}
                      onValueChange={this.toggleWifiOnly}
                    />
                  </View>

                  <View style={styles.items}>
                    <TouchableOpacity
                      style={styles.row}
                      onPress={this.openPicker}
                    >
                      <FontAwesome name="video-camera" size={18} color="#fff" />
                      <Text style={styles.label}>Video Quality</Text>
                      <MaterialIcons name="navigate-next" size={28} color="#fff" />
                    </TouchableOpacity>

                    <RNPickerSelect
                      ref={el => (this.inputRefs.picker = el)}
                      useNativeAndroidPickerStyle={false}
                      placeholder={{}}
                      value={videoQuality}
                      onValueChange={this.onPickerValueChange}
                      items={[
                        { label: 'Low', value: 0 },
                        { label: 'Medium', value: 1 },
                        { label: 'High', value: 2 },
                      ]}
                      style={{
                        inputIOS: { color: '#fff', fontSize: 12 },
                        inputAndroid: { color: '#fff', fontSize: 12 },
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.items}
                    onPress={this.deleteAllDownloads}
                  >
                    <EvilIcons name="trash" size={18} color="#fff" />
                    <Text style={styles.label}>Delete All Download</Text>
                  </TouchableOpacity>

                  <View style={styles.items}>
                    <MaterialIcons name="notifications" size={18} color="#fff" />
                    <Text style={styles.label}>Allow Notifications</Text>
                    <Switch
                      trackColor={{ true: 'red', false: 'grey' }}
                      thumbColor="#fff"
                      value={notification === 1}
                      onValueChange={() => {}}
                    />
                  </View>

                  <SequentialBanner />

                  {/* ABOUT */}
                  <Text style={styles.seperatorText}>About</Text>

                  <TouchableOpacity
                    style={styles.items}
                    onPress={() => this.props.navigation.navigate('Help')}
                  >
                    <Feather name="help-circle" size={18} color="#fff" />
                    <Text style={styles.label}>Help Center</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.items}
                    onPress={() => this.props.navigation.navigate('Privacy')}
                  >
                    <AntDesign name="infocirlceo" size={18} color="#fff" />
                    <Text style={styles.label}>Privacy Policy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.items}
                    onPress={() =>
                      this.props.navigation.navigate('TermsConditions')
                    }
                  >
                    <SimpleLineIcons name="doc" size={18} color="#fff" />
                    <Text style={styles.label}>Terms & Conditions</Text>
                  </TouchableOpacity>

                  <SequentialBanner />
                </>
              )}
            </Animatable.View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

/* ---------------- REDUX ---------------- */

const mapStateToProps = state => ({
  info: state.info,
  token: state.token,
  notification: state.notification,
});

const mapDispatchToProps = dispatch => ({
  userInfo: bindActionCreators(userInfo, dispatch),
  loginToken: bindActionCreators(loginToken, dispatch),
  notification: bindActionCreators(notification, dispatch),
  wifiInfo: bindActionCreators(wifiInfo, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
