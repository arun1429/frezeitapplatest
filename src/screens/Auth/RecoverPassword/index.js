import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  View,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Text,
} from 'react-native';

import { Appbar, Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Orientation from 'react-native-orientation-locker';
import HttpRequest from '../../../utils/HTTPRequest';

// Components
import StatusBar from '../../../components/StatusBar/';
import BottomLine from '../../../components/BottomHorizontalLine/';
import Alerts from '../../../components/Alerts/';

// Styles
import styles from './styles';

export default class RecoverPassword extends Component {
  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);

    this.emailRef = this.updateRef.bind(this, 'email');

    this.state = {
      isLoading: false,
      email: '',
      errors: {},
      isNotify: false,
      title: '',
      subtitle: '',
      type: '',
      action: false,
    };
  }

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  onFocus() {
    let { errors } = this.state;
    delete errors.email;
    this.setState({ errors });
  }

  onSubmitEmail() {
    this.email?.blur();
    this.onSubmit();
  }

  onSubmit() {
    let errors = {};
    let reg =
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!this.state.email) {
      errors.email = 'Should not be empty';
    } else if (!reg.test(this.state.email)) {
      errors.email = 'Invalid Email Address Format.';
    }

    this.setState({ errors });

    if (Object.keys(errors).length === 0) {
      this.onForgotPressed();
    }
  }

  onForgotPressed = () => {
    this.setState({ isLoading: true });

    HttpRequest.forgotPassword({ email: this.state.email })
      .then((res) => {
        this.setState({ isLoading: false });
        const result = res.data;

        if (res.status === 200 && result.error === false) {
          this.notify('success', 'Good Job!', result.message, true);
        } else {
          this.notify(
            'danger',
            'Oops!',
            result.message ?? result.status,
            false
          );
        }
      })
      .catch(() => {
        this.setState({ isLoading: false });
        this.notify(
          'danger',
          'Oops!',
          'Something Went Wrong!',
          false
        );
      });
  };

  updateRef(name, ref) {
    this[name] = ref;
  }

  notify = (type, title, subtitle, action) => {
    this.setState({
      isNotify: true,
      title,
      subtitle,
      type,
      action,
    });
  };

  updateNotify = () => {
    this.setState({ isNotify: false });
  };

  render() {
    const {
      isLoading,
      errors,
      email,
      isNotify,
      title,
      subtitle,
      type,
      action,
    } = this.state;

    const errorColor = errors.email ? '#ff0000' : '#ffffff';

    return (
      <View style={styles.container}>
        <StatusBar />

        {/* HEADER */}
        <Appbar.Header style={styles.transparentHeader}>
          <Appbar.Action
            icon={() => (
              <Ionicons
                name="arrow-back"
                size={25}
                color="#fff"
              />
            )}
            onPress={() =>
              this.props.navigation.goBack()
            }
          />

          <View style={{ flex: 1 }} />

          <Appbar.Action
            icon={() => (
              <Image
                source={require('../../../../assets/icons/help.png')}
                style={styles.infoIcon}
              />
            )}
            onPress={() =>
              this.props.navigation.navigate('IntroHelp')
            }
          />

          <Appbar.Action
            icon={() => (
              <Image
                source={require('../../../../assets/icons/faq.png')}
                style={styles.infoIcon}
              />
            )}
            onPress={() =>
              this.props.navigation.navigate('IntroFaq')
            }
          />
        </Appbar.Header>

        {/* ALERT */}
        {isNotify && (
          <Alerts
            show={true}
            type={type}
            title={title}
            subtitle={subtitle}
            navigation={this.props.navigation}
            action={action}
            parentReference={this.updateNotify}
          />
        )}

        {/* CONTENT */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: 10,
          }}
        >
          <View style={styles.cardStyle}>
            <View style={styles.cardHeader}>
               <View style={styles.cardHeaderContent}>
              <Text style={styles.cardTitle}>
                FORGET PASSWORD
              </Text>
              </View>
            </View>

            <ImageBackground
              source={require('../../../../assets/img/auth/signIn.png')}
              style={styles.bg}
            >
              <View style={styles.cardBody}>
                <View style={{ margin: '3%' }}>
                  <View
                    style={[
                      styles.formItem,
                      { borderColor: errorColor },
                    ]}
                  >
                    <AntDesign
                      name="mail"
                      size={25}
                      color="#fff"
                    />

                    <TextInput
                      ref={this.emailRef}
                      placeholder="Your@email.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={this.onFocus}
                      onChangeText={(text) =>
                        this.setState({ email: text })
                      }
                      onSubmitEditing={this.onSubmitEmail}
                      value={email}
                      returnKeyType="done"
                      placeholderTextColor={errorColor}
                      style={[
                        styles.inputText,
                        { color: errorColor },
                      ]}
                    />
                  </View>

                  {errors.email && (
                    <Text style={styles.error}>
                      {errors.email}
                    </Text>
                  )}

                  <Button
                    mode="contained"
                    buttonColor="#d32f2f"
                    style={styles.loginBtn}
                    onPress={this.onSubmit}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.boldText}>
                        RECOVER
                      </Text>
                    )}
                  </Button>
                </View>
              </View>
            </ImageBackground>
          </View>
        </ScrollView>

        <BottomLine />
      </View>
    );
  }
}
