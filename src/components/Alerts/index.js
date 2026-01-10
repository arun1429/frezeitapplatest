import React, { Component } from 'react';
import { View, StyleSheet, Linking, Platform } from 'react-native';
import { Portal, Dialog, Button, Text } from 'react-native-paper';

export default class Alerts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  componentDidMount() {
    if (this.props.show) {
      this.setState({ show: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) {
      this.setState({ show: this.props.show });
    }
  }

  handleClose = () => {
    this.props.parentReference?.();
    this.setState({ show: false });

    const { navigation, action } = this.props;

    if (navigation && action !== undefined) {
      if (action === true) {
        navigation.goBack();
      } else if (action === 'UPDATE') {
        Linking.openURL(
          Platform.OS === 'android'
            ? 'https://play.google.com/store/apps/details?id=com.freizeitMedia'
            : 'https://apps.apple.com/in/app/freizeit-media/id1529561669'
        );
      } else if (action !== false) {
        navigation.navigate(action);
      }
    } else {
      Platform.OS === 'android'
        ? Linking.openSettings()
        : Linking.openURL('app-settings://');
    }
  };

  render() {
    const { title, subtitle } = this.props;

    return (
      <Portal>
        <Dialog
          visible={this.state.show}
          dismissable={false}
          style={styles.dialog}
        >
          <Dialog.Title>{title}</Dialog.Title>

          <Dialog.Content>
            <Text>{subtitle}</Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={this.handleClose}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }
}
