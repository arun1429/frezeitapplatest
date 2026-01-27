import { StyleSheet } from "react-native";
import COLORS from "../constants/colors";

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
});