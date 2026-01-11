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
      sliderData: [],
    };
  }

  componentDidMount() {
    this.getSlider();

    eventBus.on('videoPaused', this.handleDidFocus);

    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange
    );

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.setState({ paused: false, isMuted: false });
    });

    this.blurListener = this.props.navigation.addListener('blur', () => {
      this.setState({ paused: true, isMuted: true });
    });
  }

  componentWillUnmount() {
    eventBus.off('videoPaused', this.handleDidFocus);
    this.appStateSubscription?.remove();
    this.focusListener();
    this.blurListener();
  }

  handleDidFocus = (data) => {
    if (data?.isClosed === 'false') {
      this.setState({ activeSlide: 10001 });
    }
  };

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (this.props.navigation.isFocused()) {
        this.setState({ paused: false, isMuted: false });
      }
    } else if (
      this.state.appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      this.setState({ paused: true, isMuted: true });
    }

    this.setState({ appState: nextAppState });
  };

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
      .catch(() => {
        this.loadCachedSlider();
      });
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

  callDetailsScreen = (item) => {
    this.setState({ activeSlide: 10001 });

    const route = item.trailer_order && this.props.token ? 'Exclusive' : 'Details';

    this.props.navigation.navigate(route, {
      itemId: item.id,
      type: item.type,
    });
  };

  renderItem = ({ item, index }) => {
    const { activeSlide, paused, isMuted } = this.state;

    const shouldPause =
      index !== activeSlide || paused || activeSlide === 10001;

    return (
      <TouchableOpacity
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

        {activeSlide !== 10001 && (
          <Text style={styles.count}>
            {activeSlide + 1}/{this.state.totalItem}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  onSnapToItem = (index) => {
    this.setState({ activeSlide: index });
  };

  render() {
    const { isLoading, sliderData } = this.state;

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
          renderItem={this.renderItem}
          slides={sliderData}
          onSlideChange={this.onSnapToItem}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.token,
  sliderImages: state.slider,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ slider }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Slider);
