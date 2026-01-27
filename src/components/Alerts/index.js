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
        <Dialog visible={this.state.show} dismissable={false} style={styles.dialog}>
          
          {/* RED ICON */}
          <View style={styles.iconWrapper}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>✕</Text>
            </View>
          </View>

          {/* CONTENT */}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {/* BUTTON */}
          <Button
            mode="contained"
            onPress={this.handleClose}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Ok
          </Button>

        </Dialog>
      </Portal>
    );
  }
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 20,
    paddingTop: 40,
    alignItems: 'center',
  },

  iconWrapper: {
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor:"#fff",
    borderWidth :2,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  iconText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },

  content: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },

  button: {
    marginTop: 40,
    marginBottom: 10,
    width: '90%',
    padding:8,
    borderRadius: 12,
    backgroundColor: '#E53935',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
