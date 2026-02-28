import React from 'react';
import { StyleSheet, FlatList, View, Dimensions, PanResponder } from 'react-native';

const { width } = Dimensions.get('window');

export default class AppSlider extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      scrollEnabled: true,
    };

    this.startX = 0;
    this.isSwiping = false;

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,

      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const dx = Math.abs(gestureState.dx);
        const dy = Math.abs(gestureState.dy);

        // detect horizontal swipe
        if (dx > 8 && dx > dy) {
          this.isSwiping = true;
          this.setState({ scrollEnabled: true });
          return false; // allow FlatList to handle swipe
        }

        // treat as tap
        this.setState({ scrollEnabled: false });
        return false;
      },

      onPanResponderRelease: () => {
        setTimeout(() => {
          this.setState({ scrollEnabled: true });
          this.isSwiping = false;
        }, 50);
      },
    });
  }

  /* detect visible slide */
  viewabilityConfig = { itemVisiblePercentThreshold: 80 };

  onViewableItemsChanged = ({ viewableItems }) => {
    if (!viewableItems?.length) return;
    const index = viewableItems[0].index;

    if (index !== this.state.activeIndex) {
      this.setState({ activeIndex: index });
      this.props.onSlideChange?.(index);
    }
  };

  renderItem = ({ item, index }) => (
    <View
      {...this.panResponder.panHandlers}
      style={{ width, flex: 1 }}
    >
      {this.props.renderItem({ item, index })}
    </View>
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.props.slides}
          horizontal
          pagingEnabled
          scrollEnabled={this.state.scrollEnabled}
          showsHorizontalScrollIndicator={false}

          keyExtractor={(_, i) => i.toString()}
          renderItem={this.renderItem}

          windowSize={1}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          removeClippedSubviews

          viewabilityConfig={this.viewabilityConfig}
          onViewableItemsChanged={this.onViewableItemsChanged}
        />
      </View>
    );
  }
}