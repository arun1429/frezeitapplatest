import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';

import analytics from '@react-native-firebase/analytics';
import { connect } from 'react-redux';
import {
  setDisplayedAds,
  setCurrentIndex,
  setLastAdLoggedTime,
} from '../../../Redux/Actions/Actions';
import { bindActionCreators } from 'redux';

import styles from './styles';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Banner = props => {
  const {
    bannerAds = [],
    currentIndex,
    setCurrentIndex,
    lastAdLoggedTime,
    setLastAdLoggedTime,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const impressionLoggedRef = useRef(false);

  /* -------------------- INIT ADS -------------------- */
  useEffect(() => {
    if (bannerAds.length > 0) {
      setIsLoading(false);
      setIndex(currentIndex % bannerAds.length);
    }
  }, [bannerAds]);

  /* -------------------- ROTATE ADS -------------------- */
  useEffect(() => {
    if (bannerAds.length > 1) {
      setIndex(currentIndex % bannerAds.length);
      setCurrentIndex(currentIndex + 1);
    }
  }, []);

  /* -------------------- IMPRESSION LOGIC -------------------- */
  const logImpression = async () => {
    if (!bannerAds[index]) return;
    if (impressionLoggedRef.current) return;

    const now = Date.now();
    const cooldown = 5 * 60 * 1000; // 5 minutes

    if (
      lastAdLoggedTime?.banner_ad_impression &&
      now - lastAdLoggedTime.banner_ad_impression < cooldown
    ) {
      return;
    }

    impressionLoggedRef.current = true;

    try {
      await analytics().logEvent('banner_ad_impression', {
        ad_id: bannerAds[index]._id,
      });

      setLastAdLoggedTime({ banner_ad_impression: now });
    } catch (e) {
      console.log('Analytics error:', e);
    }
  };

  /* -------------------- CTA -------------------- */
  const handleAdPress = () => {
    const link = bannerAds[index]?.upload_cta_link;
    if (link) {
      Linking.openURL(link);
    }
  };

  /* -------------------- UI -------------------- */
  if (isLoading) {
    return (
      <View style={styles.bannerAds}>
        <View
          style={[
            styles.skeletonRow,
            {
              width: SCREEN_WIDTH - 20,
              height: 50,
              marginHorizontal: 10,
            },
          ]}
        />
      </View>
    );
  }

  if (!bannerAds.length) {
    return (
      <View style={styles.bannerAds}>
        <Image
          source={require('../../../../assets/img/banner_placeholder.jpg')}
          style={{ width: '100%', height: 50, resizeMode: 'cover' }}
        />
      </View>
    );
  }

  return (
    <View style={styles.bannerAds}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleAdPress}
        style={{ width: '100%', height: 50 }}
      >
        <Image
          source={{ uri: bannerAds[index].upload_file }}
          style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
          onLoad={logImpression}   // ✅ impression trigger
        />
      </TouchableOpacity>
    </View>
  );
};

/* -------------------- REDUX -------------------- */
const mapStateToProps = state => ({
  bannerAds: state.bannerAds,
  currentIndex: state.currentIndex,
  lastAdLoggedTime: state.lastAdLoggedTime,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setDisplayedAds,
      setCurrentIndex,
      setLastAdLoggedTime,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
