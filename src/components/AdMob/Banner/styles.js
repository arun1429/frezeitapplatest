import {StyleSheet} from 'react-native';
import COLORS from "../../../constants/colors";
export default StyleSheet.create({
  bannerAds: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // height: 100,
    marginVertical: 10,
    marginTop: 16,
  },
    skeletonRow: {
    backgroundColor: COLORS.inactiveGrey,
    borderRadius: 2,
  },
});
