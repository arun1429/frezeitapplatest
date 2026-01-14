import React, { Component } from 'react';
import { Animated, ImageBackground } from 'react-native';

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

export default class ImageLoader extends Component {
constructor(props){
    super(props);
    this.state = {
        opacity: new Animated.Value(0),
      }
}

  onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const {style, ...restProps} = this.props ?? {};

    return (
      <AnimatedImageBackground
        onLoad={this.onLoad}
        {...restProps}
        style={[
          {
            opacity: this.state.opacity,
            transform: [
              {
                scale: this.state.opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1],
                })
              },
            ],
          },
          style,
        ]}
      />
    );
  }
}
