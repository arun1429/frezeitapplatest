import {Dimensions} from 'react-native';

export function animatedStyles(index, animatedValue, carouselProps) {
  let animatedOpacity = {};
  let animatedTransform = {};
  let sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
  let translateProp = carouselProps.vertical ? 'translateY' : 'translateX';

  if (carouselProps.inactiveSlideOpacity < 1) {
    animatedOpacity = {
      opacity: animatedValue.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [0, 0.6, 1],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          scale: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.7, 1],
          }),
        },
      ],
    };
  }

  return {
    ...animatedOpacity,
    ...animatedTransform,
  };
}

import {InterstitialAd, RewardedAd, TestIds} from 'react-native-google-mobile-ads';
import {Platform} from 'react-native';

export const interstialAdUnitId = Platform.OS === 'ios' ? 'ca-app-pub-1598339780627586/1705287468' : 'ca-app-pub-1598339780627586/6651294712';

export const interstitial = InterstitialAd.createForAdRequest(process.env.NODE_ENV === 'development' ? TestIds.INTERSTITIAL : interstialAdUnitId, {
  // requestNonPersonalizedAdsOnly: true,
  // keywords: ["fashion", "clothing"],
});

export const rewardedAdUnitId = Platform.OS === 'ios' ? 'ca-app-pub-1598339780627586/2635225759' : 'ca-app-pub-1598339780627586/1772171429';

export const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId, {
  requestNonPersonalizedAdsOnly: true,
  // keywords: ["fashion", "clothing"],
});

export const bannerAdUnitId = process.env.NODE_ENV === 'development' ? TestIds.BANNER : Platform.OS === 'ios' ? 'ca-app-pub-1598339780627586/1584770482' : 'ca-app-pub-1598339780627586/9694608062';
