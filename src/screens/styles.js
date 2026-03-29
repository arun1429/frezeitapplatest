import COLORS from "../constants/colors";
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export default styles = StyleSheet.create({
     container: {
    flex: 1,
    backgroundColor: '#000', // match BootSplash background
    },
    content: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo:{
        width:'100%',
        height:'100%',
    },
    fullScreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
});