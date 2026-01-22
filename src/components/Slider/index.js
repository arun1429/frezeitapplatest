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

// API
import HttpRequest from '../../utils/HTTPRequest';
import LocalData from '../../utils/LocalData';

// Redux
import { connect } from 'react-redux';
import { slider } from '../../Redux/Actions/Actions';
import { bindActionCreators } from 'redux';

// Styles
import styles from './styles';
import eventBus from '../../utils/eventBus';

const deviceWidth = Dimensions.get('window').width;

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      appState: AppState.currentState,
      activeSlide: 0,
      totalItem: 0,
      isMuted: false,
      paused: false,
      stopAllVideos: false,
      sliderData: [],
    };
  }

  componentDidMount() {
    this.getSlider();

    eventBus.on('videoPaused', this.handleExternalPause);

    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange
    );

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.setState({
        paused: false,
        isMuted: false,
        stopAllVideos: false,
      });
    });

    this.blurListener = this.props.navigation.addListener('blur', () => {
      this.setState({
        paused: true,
        isMuted: true,
        stopAllVideos: true,
      });
    });
  }

  componentWillUnmount() {
    eventBus.off('videoPaused', this.handleExternalPause);
    this.appStateSubscription?.remove();
    this.focusListener && this.focusListener();
    this.blurListener && this.blurListener();
  }

  /* -------------------- HANDLERS -------------------- */

  handleExternalPause = () => {
    this.setState({ stopAllVideos: true });
  };

  handleAppStateChange = (nextAppState) => {
    const { appState } = this.state;

    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      if (this.props.navigation.isFocused()) {
        this.setState({
          paused: false,
          isMuted: false,
          stopAllVideos: false,
        });
      }
    } else if (
      appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      this.setState({
        paused: true,
        isMuted: true,
        stopAllVideos: true,
      });
    }

    this.setState({ appState: nextAppState });
  };

  /* -------------------- API -------------------- */

  getSlider = () => {
    this.setState({ isLoading: true });

    HttpRequest.getSlider(this.props.token)
      .then(res => {
        const result = res.data;

        if (res.status === 200 && result?.error === false && result.data?.length) {
          this.props.slider(result.data);
          LocalData.setSlider(result.data);

          this.setState({
            sliderData: result.data,
            totalItem: result.data.length,
            isLoading: false,
          });
        } else {
          this.loadCachedSlider();
        }
      })
      .catch(this.loadCachedSlider);
  };

  loadCachedSlider = async () => {
    const cached = await LocalData.getSlider();
    const data = JSON.parse(cached || '[]');

    if (data.length) {
      this.props.slider(data);
      this.setState({
        sliderData: data,
        totalItem: data.length,
      });
    }

    this.setState({ isLoading: false });
  };

  /* -------------------- NAVIGATION -------------------- */

  callDetailsScreen = (item) => {
    this.setState({ stopAllVideos: true });

    const route =
      item.trailer_order && this.props.token
        ? 'Exclusive'
        : 'Details';

    this.props.navigation.navigate(route, {
      itemId: item.id,
      type: item.type,
    });
  };

  /* -------------------- SLIDER -------------------- */

  onSnapToItem = (index) => {
    this.setState({
      activeSlide: index,
      stopAllVideos: false,
    });
  };

  renderItem = ({ item, index }) => {
    const { activeSlide, paused, isMuted, stopAllVideos } = this.state;

    const shouldPause =
      stopAllVideos || paused || index !== activeSlide;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.imageContainer}
        onPress={() => this.callDetailsScreen(item)}
      >
        <Video
          source={{ uri: item.link }}
          style={styles.image}
          resizeMode="cover"
          poster={item.image}
          posterResizeMode="cover"
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

  /* -------------------- RENDER -------------------- */

  render() {
    const { isLoading, sliderData, activeSlide } = this.state;

    if (isLoading) {
      return (
        <View style={styles.sliderContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    }

    if (!sliderData?.length) return null;

    return (
      <View style={styles.sliderContainer}>
        <AppSlider
          slides={sliderData}
          renderItem={this.renderItem}
          onSlideChange={this.onSnapToItem}
          extraData={activeSlide}  
        />
      </View>
    );
  }
}

/* -------------------- REDUX -------------------- */

const mapStateToProps = state => ({
  token: state.token,
  sliderImages: state.slider,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ slider }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Slider);
