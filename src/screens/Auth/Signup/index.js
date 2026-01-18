import React, { Component } from 'react';
import {
  View,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Text,
} from 'react-native';

import { Appbar, Button } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Orientation from 'react-native-orientation-locker';
import HttpRequest from '../../../utils/HTTPRequest';

// Redux
import { connect } from 'react-redux';
import { userInfo, loginToken } from '../../../Redux/Actions/Actions';
import { bindActionCreators } from 'redux';

// Components
import StatusBar from '../../../components/StatusBar/';
import BottomLine from '../../../components/BottomHorizontalLine/';
import Alerts from '../../../components/Alerts/';

// Styles
import styles from './styles';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      name: '',
      email: '',
      phone: '',
      password: '',
      repeatPass: '',
      errors: {},
      isNotify: false,
      title: '',
      subtitle: '',
      type: '',
      action: false,
      secureTextEntry1: true,
      secureTextEntry2: true,
    };

    this.nameRef = this.updateRef.bind(this, 'name');
    this.emailRef = this.updateRef.bind(this, 'email');
    this.phoneRef = this.updateRef.bind(this, 'phone');
    this.passwordRef = this.updateRef.bind(this, 'password');
    this.repeatPassRef = this.updateRef.bind(this, 'repeatPass');
  }

  componentDidMount() {
    //Orientation.lockToPortrait();
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  onFocus = () => {
    this.setState({ errors: {} });
  };

  onChangeText = (text, field) => {
    this.setState({ [field]: text });
  };

  onSubmit = () => {
     this.notify(
            'success',
            'Great!',
            'A verification link has been sent to your email address.',
            true
          );
    // const { name, email, phone, password, repeatPass } = this.state;
    // let errors = {};
    // const reg =
    //   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // if (!name) errors.name = 'Should not be empty';
    // if (!email) errors.email = 'Should not be empty';
    // else if (!reg.test(email))
    //   errors.email = 'Invalid Email Address Format.';

    // if (!phone) errors.phone = 'Should not be empty';
    // else if (phone.length < 10)
    //   errors.phone = 'The phone must be between 9 and 10 digits.';

    // if (!password) errors.password = 'Should not be empty';
    // else if (password.length < 8)
    //   errors.password = 'The password must be of atleast 8 characters.';

    // if (!repeatPass) errors.repeatPass = 'Should not be empty';
    // else if (repeatPass !== password)
    //   errors.repeatPass = 'Password did not match.';

    // this.setState({ errors });

    // if (Object.keys(errors).length === 0) {
    //   this.onSignupPressed();
    // }
  };

  onSignupPressed = () => {
    const { name, email, phone, password, repeatPass } = this.state;

    this.setState({ isLoading: true });

    const formData = {
      name,
      email,
      phone,
      password,
      password_confirmation: repeatPass,
    };

    HttpRequest.signUp(formData)
      .then(res => {
        this.setState({ isLoading: false });
        const result = res.data;

        if (res.status === 201 && result.error === false) {
          this.notify(
            'success',
            'Great!',
            'A verification link has been sent to your email address.',
            true
          );
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
        this.notify('danger', 'Oops!', 'Something Went Wrong!', false);
      });
  };

  togglePassword1 = () => {
    this.setState(prev => ({ secureTextEntry1: !prev.secureTextEntry1 }));
  };

  togglePassword2 = () => {
    this.setState(prev => ({ secureTextEntry2: !prev.secureTextEntry2 }));
  };

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
      name,
      email,
      phone,
      password,
      repeatPass,
      errors,
      secureTextEntry1,
      secureTextEntry2,
      isNotify,
      title,
      subtitle,
      type,
      action,
    } = this.state;

    const errorColor = field => (errors[field] ? '#ff0000' : '#fff');

    return (
      <View style={styles.container}>
        <StatusBar />

        {/* HEADER */}
        <Appbar.Header style={styles.transparentHeader}>
          <Appbar.Action
            icon={() => (
              <MaterialIcons name="arrow-back" size={25} color="#fff" />
            )}
            onPress={() => this.props.navigation.goBack()}
          />

          <View style={{ flex: 1 }} />

          <Appbar.Action
            icon={() => (
              <Image
                source={require('../../../../assets/icons/help.png')}
                style={styles.infoIcon}
              />
            )}
            onPress={() => this.props.navigation.navigate('IntroHelp')}
          />

          <Appbar.Action
            icon={() => (
              <Image
                source={require('../../../../assets/icons/faq.png')}
                style={styles.infoIcon}
              />
            )}
            onPress={() => this.props.navigation.navigate('IntroFaq')}
          />
        </Appbar.Header>

        {/* ALERT */}
        {isNotify && (
          <Alerts
            show
            type={type}
            title={title}
            subtitle={subtitle}
            navigation={this.props.navigation}
            action={action}
            parentReference={this.updateNotify}
          />
        )}

        {/* CONTENT */}
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 10 }}>
          <View style={styles.cardStyle}>
            <View style={styles.cardHeader}>
            <View style={styles.cardHeaderContent}>
              <Text style={styles.cardTitle}>Create Account</Text>
            </View>
            </View>

            <ImageBackground
              source={require('../../../../assets/img/auth/signIn.png')}
              style={styles.bg}
            >
              <View style={styles.cardBody}>
                <View style={styles.formContainer}>
                  {/* NAME */}
                  <View style={[styles.formItem, { borderColor: errorColor('name') }]}>
                    <MaterialIcons name="person" size={25} color="#fff" />
                    <TextInput
                      ref={this.nameRef}
                      placeholder="Provide your full name"
                      value={name}
                      onFocus={this.onFocus}
                      onChangeText={text => this.onChangeText(text, 'name')}
                      placeholderTextColor={errorColor('name')}
                      style={[styles.inputText, { color: errorColor('name') }]}
                    />
                  </View>
                  {errors.name && <Text style={styles.error}>{errors.name}</Text>}

                  {/* EMAIL */}
                  <View style={[styles.formItem, { borderColor: errorColor('email') }]}>
                    <AntDesign name="mail" size={25} color="#fff" />
                    <TextInput
                      ref={this.emailRef}
                      placeholder="Your@email.com"
                      value={email}
                      keyboardType="email-address"
                      onFocus={this.onFocus}
                      onChangeText={text => this.onChangeText(text, 'email')}
                      placeholderTextColor={errorColor('email')}
                      style={[styles.inputText, { color: errorColor('email') }]}
                    />
                  </View>
                  {errors.email && <Text style={styles.error}>{errors.email}</Text>}

                  {/* PHONE */}
                  <View style={[styles.formItem, { borderColor: errorColor('phone') }]}>
                    <FontAwesome name="phone" size={25} color="#fff" />
                    <TextInput
                      ref={this.phoneRef}
                      placeholder="Contact Number"
                      value={phone}
                      keyboardType="numeric"
                      maxLength={10}
                      onFocus={this.onFocus}
                      onChangeText={text => this.onChangeText(text, 'phone')}
                      placeholderTextColor={errorColor('phone')}
                      style={[styles.inputText, { color: errorColor('phone') }]}
                    />
                  </View>
                  {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

                  {/* PASSWORD */}
                  <View style={[styles.formItem, { borderColor: errorColor('password') }]}>
                    <AntDesign name="lock" size={25} color="#fff" />
                    <TextInput
                      ref={this.passwordRef}
                      placeholder="Create password (Min. 8 char.)"
                      value={password}
                      secureTextEntry={secureTextEntry1}
                      onFocus={this.onFocus}
                      onChangeText={text => this.onChangeText(text, 'password')}
                      placeholderTextColor={errorColor('password')}
                      style={[styles.inputText, { color: errorColor('password') }]}
                    />
                    <MaterialIcons
                      name={secureTextEntry1 ? 'visibility' : 'visibility-off'}
                      size={24}
                      color="#ff0000"
                      onPress={this.togglePassword1}
                    />
                  </View>
                  {errors.password && <Text style={styles.error}>{errors.password}</Text>}

                  {/* REPEAT PASSWORD */}
                  <View style={[styles.formItem, { borderColor: errorColor('repeatPass') }]}>
                    <AntDesign name="lock" size={25} color="#fff" />
                    <TextInput
                      ref={this.repeatPassRef}
                      placeholder="Re-type Password"
                      value={repeatPass}
                      secureTextEntry={secureTextEntry2}
                      onFocus={this.onFocus}
                      onChangeText={text => this.onChangeText(text, 'repeatPass')}
                      placeholderTextColor={errorColor('repeatPass')}
                      style={[styles.inputText, { color: errorColor('repeatPass') }]}
                    />
                    <MaterialIcons
                      name={secureTextEntry2 ? 'visibility' : 'visibility-off'}
                      size={24}
                      color="#ff0000"
                      onPress={this.togglePassword2}
                    />
                  </View>
                  {errors.repeatPass && <Text style={styles.error}>{errors.repeatPass}</Text>}

                  {/* SIGN UP */}
                  <Button
                    mode="contained"
                    buttonColor="#d32f2f"
                    style={styles.loginBtn}
                    onPress={this.onSubmit}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.boldText}>SIGN UP</Text>
                    )}
                  </Button>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>
                  Already have an account?{' '}
                  <Text
                    style={styles.labelBold}
                    onPress={() => this.props.navigation.navigate('Signin')}
                  >
                    Login!
                  </Text>
                </Text>
              </View>
            </ImageBackground>
          </View>
        </ScrollView>

        <BottomLine />
      </View>
    );
  }
}

/* ---------------- REDUX ---------------- */

const mapDispatchToProps = dispatch => ({
  userInfo: bindActionCreators(userInfo, dispatch),
  loginToken: bindActionCreators(loginToken, dispatch),
});

export default connect(null, mapDispatchToProps)(Signup);
