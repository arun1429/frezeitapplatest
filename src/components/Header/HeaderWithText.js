import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
class HeaderWithTittle extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{ height: 50, width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroudColor }}>
                <TouchableOpacity
                    style={{ justifyContent: 'center', alignItems: 'center', height: 50, width: 60 ,backgroudColor : 'red'}}
                    onPress={() => this.props.navigation.goBack()} >
                   <Ionicons  name="arrow-back" style={{ fontSize : 25,color: '#fff'}} />
                </TouchableOpacity>
                <Text ellipsizeMode='tail' numberOfLines={1} style={{ color: "#fff", paddingLeft: 15, fontSize: 20, width: "65%" }}>{this.props.name}</Text>
                <TouchableOpacity
                    //  onPress={() => this.props.navigation.openDrawer()}
                    onPress={() => this.props.navigation.navigate("Search")}
                    style={{ position: 'absolute', right: 20 }}>
                    <Image style={{ height: 20, width: 20, }}
                        source={require('../../../assets/icons/sideMenu/search_icon.png')} />
                </TouchableOpacity>
            </View>
        )
    }
}

export default HeaderWithTittle;