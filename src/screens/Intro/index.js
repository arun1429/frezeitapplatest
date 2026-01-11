import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import { Image } from 'expo-image';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import Orientation from 'react-native-orientation-locker';

// Components
import StatusBar from '../../components/StatusBar/';
import ToolBar from '../../components/ToolBar';
// import BottomLine from '../../components/BottomHorizontalLine/';

// Styles
import styles from './styles';
import COLORS from '../../constants/colors';

const { width } = Dimensions.get('window');

export default class Intro extends Component {
  componentDidMount() {
    //Orientation.lockToPortrait();
  }

  renderItem = ({ item }) => {
    if (item.key === 's1') {
      return (
        <ImageBackground source={item.image} style={[styles.imageBackground, { width }]}>
          <View style={styles.mainContent}>
            <Image
              style={styles.mapImage}
              source={require('../../../assets/img/intro/map.png')}
            />

            <Text style={styles.introText1}>{item.title}</Text>

            <Image
              style={styles.logoImage1}
              source={require('../../../assets/img/logo/logo.png')}
              contentFit="contain"
            />

            <Image
              style={styles.introTextImage}
              source={require('../../../assets/img/intro/sayHi.png')}
            />
          </View>
        </ImageBackground>
      );
    }

    if (item.key === 's2') {
      return (
        <View style={[styles.mainContent, { width }]}>
          <Image
            style={styles.imageAnimation}
            source={item.image}
            contentFit="contain"
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={[styles.text, styles.textMargin]}>{item.text}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.mainContent, { width }]}>
        <Image
          style={styles.imageMedium}
          source={item.image}
          contentFit="contain"
        />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={[styles.text, styles.textMargin]}>{item.text}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar />
        <ToolBar navigation={this.props.navigation} />

        <SwiperFlatList
          data={slides}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.key}
          showPagination
          paginationStyle={styles.pagination}
          paginationStyleItem={styles.inactiveDots}
          paginationActiveColor={COLORS.primary}
          paginationDefaultColor="#ccc"
        />

        <TouchableOpacity
          style={styles.signinButton}
          onPress={() => this.props.navigation.navigate('Signin')}
        >
          <Text style={styles.signinText}>SIGN IN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => this.props.navigation.navigate('Home')}
        >
          <Text style={styles.signinText}>SKIP</Text>
        </TouchableOpacity>

        {/* <BottomLine /> */}
      </View>
    );
  }
}

/* ---------------- SLIDES ---------------- */

const slides = [
  {
    key: 's1',
    title: "What`s NEXT",
    image: require('../../../assets/img/intro/splash_1.png'),
    backgroundColor: COLORS.white,
  },
  {
    key: 's2',
    title: 'Download and go',
    text: 'Save your data, watch offline on a plane, train, or submarine...',
    image: require('../../../assets/animations/splash_2.gif'),
    backgroundColor: COLORS.white,
  },
  {
    key: 's3',
    title: 'No pesky contracts',
    text: 'Cancel anytime.',
    image: require('../../../assets/animations/splash_3.gif'),
    backgroundColor: COLORS.white,
  },
];
