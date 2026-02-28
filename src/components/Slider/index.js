import React, { Component } from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  AppState,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import AppSlider from '../../components/AppSlider';

import HttpRequest from '../../utils/HTTPRequest';
import LocalData from '../../utils/LocalData';

import { connect } from 'react-redux';
import { slider } from '../../Redux/Actions/Actions';
import { bindActionCreators } from 'redux';

import styles from './styles';
import eventBus from '../../utils/eventBus';

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      activeSlide: 0,
      totalItem: 0,
      isMuted: false,
      stopAllVideos: false,
      sliderData: [],
    };
  }

  componentDidMount() {
    this.getSlider();

    this.unsubscribeFocus = this.props.navigation.addListener('focus', () => {
      this.setState({ stopAllVideos: false });
    });

    this.unsubscribeBlur = this.props.navigation.addListener('blur', () => {
      this.setState({ stopAllVideos: true });
    });

    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange
    );
  }

  componentWillUnmount() {
    this.unsubscribeFocus?.();
    this.unsubscribeBlur?.();
    this.appStateSubscription?.remove();
  }

  handleAppStateChange = (state) => {
    this.setState({ stopAllVideos: state !== 'active' });
  };

  /* ---------------- API ---------------- */

  getSlider = () => {
    this.setState({ isLoading: true });

    HttpRequest.getSlider(this.props.token)
      .then(res => {
        const result = res.data;
        if (res.status === 200 && result?.data?.length) {
          this.props.slider(result.data);
          this.setState({
            sliderData: result.data,
            totalItem: result.data.length,
            isLoading: false,
          });
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  /* ---------------- NAVIGATION ---------------- */

  callDetailsScreen = (item) => {
    this.setState({ stopAllVideos: true });

    this.props.navigation.navigate('Details', {
      itemId: item.id,
      type: item.type,
    });
  };

  /* ---------------- SLIDER ---------------- */

  onSnapToItem = (index) => {
    this.setState({ activeSlide: index });
  };

  renderItem = ({ item, index }) => {
    const { activeSlide, stopAllVideos, isMuted } = this.state;
    const shouldPause = stopAllVideos || index !== activeSlide;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.imageContainer}
        onPress={() => this.callDetailsScreen(item)}
      >
        <Video
          key={`${index}-${activeSlide}-${stopAllVideos}`}
          source={shouldPause ? null : { uri: item.link }}
          style={styles.image}
          resizeMode="cover"
          muted={isMuted}
          paused={shouldPause}
          repeat
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
        />

        <Text style={styles.count}>
          {activeSlide + 1}/{this.state.totalItem}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { isLoading, sliderData } = this.state;

    if (isLoading)
      return (
        <View style={styles.sliderContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );

    if (!sliderData.length) return null;

    return (
      <View style={styles.sliderContainer}>
        <AppSlider
          slides={sliderData}
          renderItem={this.renderItem}
          onSlideChange={this.onSnapToItem}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.token,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ slider }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Slider);