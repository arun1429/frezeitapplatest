// src/redux/reducers/userReducer.js
import * as types from '../Actions/ActionType';

const initialState = {
  info: {},
  token: '',
  movies: [],
  series: [],
  notification: 1,
  slider: [],
  recentlywatched: [],
  latestmovies: [],
  latestseries: [],
  documentary: [],
  comingsoon: [],
  trendingnow: [],
  latestevents: [],
  bannerAds: [],
  videoAds: [],
  vlogs: [],
  wishlist: [],
  wifi: 1,
  gameall: [],     
  Exclusive: [],
  bundleId: '',
  displayedAds: [],
  currentIndex: 0,
  displayedVideoAds: [],
  currentVideoAdIndex: 0,
  lastAdLoggedTime: null,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
   case types.LOGIN_TOKEN:
      return {
        ...state,
        token: action.token,
      };

    case types.USER_INFO:
      return {
        ...state,
        info: action.info,
      };

    case types.SLIDER:
      return {
        ...state,
        slider: action.slider,
      };

    case types.RECENTLY_WATCHED:
      return {
        ...state,
        recentlywatched: action.recentlywatched,
      };

    case types.MOVIES_LATEST:
      return {
        ...state,
        latestmovies: action.latestmovies,
      };

    case types.SERIES_LATEST:
      return {
        ...state,
        latestseries: action.latestseries,
      };

    case types.DOCUMENTARIES:
      return {
        ...state,
        documentary: action.documentary,
      };

    case types.COMING_SOON:
      return {
        ...state,
        comingsoon: action.comingsoon,
      };

    case types.TRENDING_NOW:
      return {
        ...state,
        trendingnow: action.trendingnow,
      };

    case types.EVENT_LATEST:
      return {
        ...state,
        latestevents: action.latestevents,
      };

    case types.BANNER_ADS:
      return {
        ...state,
        bannerAds: action.bannerAds ?? action.banner_ads,
      };

    case types.VIDEO_ADS:
      return {
        ...state,
        videoAds: action.videoAds ?? action.video_ads,
      };

    case types.VLOGS:
      return {
        ...state,
        vlogs: action.vlogs,
      };
    case types.GAME_ALL:
      return {
        ...state,
        gameall: action.gameall,
      };
    case types.MOVIES_INFO:
      return {
        ...state,
        movies: action.movies,
      };

    case types.SERIES_INFO:
      return {
        ...state,
        series: action.series,
      };

    case types.NOTIFICATION:
      return {
        ...state,
        notification: action.notification,
      };

    case types.WISHLIST:
      return {
        ...state,
        wishlist: action.wishlist,
      };

    case types.WIFI_INFO:
      return {
        ...state,
        wifi: action.wifi,
      };

    case types.EXCLUSIVE_ALL:
      return {
        ...state,
        Exclusive: action.Exclusive,
      };

    case types.BUNDLEID:
      return {
        ...state,
        bundleId: action.bundleId,
      };

    case types.DISPLAYED_ADS:
      return {
        ...state,
        displayedAds: action.displayedAds,
      };

    case types.CURRENT_INDEX:
      return {
        ...state,
        currentIndex: action.currentIndex,
      };

    case types.VIDEO_ADS_DISPLAYED:
      return {
        ...state,
        displayedVideoAds: action.displayedVideoAds,
      };

    case types.CURRENT_VIDEO_INDEX:
      return {
        ...state,
        currentVideoAdIndex: action.currentVideoAdIndex,
      };

    case types.LAST_AD_LOGGED_TIME:
      return {
        ...state,
        lastAdLoggedTime: action.lastAdLoggedTime,
      };

    default:
      return state;
  }
}
