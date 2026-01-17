// src/redux/actions/actions.js
import * as types from './ActionType';

export const loginToken = token => ({
  type: types.LOGIN_TOKEN,
  token,
});

export const userInfo = info => ({
  type: types.USER_INFO,
  info,
});

export const slider = data => ({
  type: types.SLIDER,
  slider: data,
});

export const recentlyWatched = data => ({
  type: types.RECENTLY_WATCHED,
  recentlywatched: data,
});

export const latestMovies = data => ({
  type: types.MOVIES_LATEST,
  latestmovies: data,
});

export const latestSeries = data => ({
  type: types.SERIES_LATEST,
  latestseries: data,
});

export const documentaries = data => ({
  type: types.DOCUMENTARIES,
  documentary: data,
});

export const comingSoon = data => ({
  type: types.COMING_SOON,
  comingsoon: data,
});

export const trendingNow = data => ({
  type: types.TRENDING_NOW,
  trendingnow: data,
});

export const latestEvents = data => ({
  type: types.EVENT_LATEST,
  latestevents: data,
});

export const bannerAds = data => ({
  type: types.BANNER_ADS,
  bannerAds: data,
});

export const videoAds = data => ({
  type: types.VIDEO_ADS,
  videoAds: data,
});

export const vlogs = data => ({
  type: types.VLOGS,
  vlogs: data,
});

export const allMovies = data => ({
  type: types.MOVIES_INFO,
  movies: data,
});

export const allSeries = data => ({
  type: types.SERIES_INFO,
  series: data,
});

export const notification = data => ({
  type: types.NOTIFICATION,
  notification: data,
});

export const allWishlist = data => ({
  type: types.WISHLIST,
  wishlist: data,
});

export const wifiInfo = data => ({
  type: types.WIFI_INFO,
  wifi: data,
});

export const setBundleId = data => ({
  type: types.BUNDLEID,
  bundleId: data,
});
export const gameAll = data => ({
  type: types.GAME_ALL,
  gameall: data,
});
export const exclusiveAll = data => ({
  type: types.EXCLUSIVE_ALL,
  exclusiveall: data,
}); 
export const displayedAds = data => ({
  type: types.DISPLAYED_ADS,
  displayedAds: data,
});   
export const currentIndex = data => ({
  type: types.CURRENT_INDEX,
  currentIndex: data,
}); 
export const videoAdsDisplayed = data => ({
  type: types.VIDEO_ADS_DISPLAYED,
  videoAdsDisplayed: data,
}); 
export const currentVideoIndex = data => ({
  type: types.CURRENT_VIDEO_INDEX,
  currentVideoIndex: data,
}); 
export const lastAdLoggedTime = data => ({
  type: types.LAST_AD_LOGGED_TIME,
  lastAdLoggedTime: data,
}); 

export const storeBundleId = data => ({
  type: types.BUNDLEID,
  bundleId: data,
});
export const latestGame = data => ({
  type: types.GAME_ALL,
 latestGame: data
});

export const Exclusive = (data) => {
    return {
        type: types.EXCLUSIVE_ALL,
        Exclusive: data
    }
}
export const setDisplayedAds = (data) => {
    return {
        type: types.DISPLAYED_ADS,
        displayedAds: data
    }
}

export const setCurrentIndex = (data) => {
    return {
        type: types.CURRENT_INDEX,
        currentIndex: data
    }
}

export const setVideoDisplayedAds = (data) => {
    return {
        type: types.VIDEO_ADS_DISPLAYED,
        displayedVideoAds: data
    }
}

export const setVideoCurrentIndex = (data) => {
    return {
        type: types.CURRENT_VIDEO_INDEX,
        currentVideoAdIndex: data
    }
}

export const setLastAdLoggedTime = (data) => {
    return {
        type: types.LAST_AD_LOGGED_TIME,
        lastAdLoggedTime: data
    }
}

