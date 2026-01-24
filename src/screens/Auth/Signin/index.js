import React, { Component } from 'react';
import { StyleSheet, Dimensions } from "react-native";
import {
  View,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Platform,
  Text,
} from 'react-native';
import COLORS from "../../../constants/colors";

// Retrieve initial screen's width
let screenWidth = Dimensions.get('window').width;

// Retrieve initial screen's height
let screenHeight = Dimensions.get('window').height;
import { Appbar, Button } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Orientation from 'react-native-orientation-locker';
import eventBus from '../../../utils/eventBus';

// API
import HttpRequest from '../../../utils/HTTPRequest';
import LocalData from '../../../utils/LocalData';

// Redux
import { connect } from 'react-redux';
import { userInfo, loginToken } from '../../../Redux/Actions/Actions';
import { bindActionCreators } from 'redux';

// Components
import StatusBar from '../../../components/StatusBar/';
import Alerts from '../../../components/Alerts/';

// Social
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Styles

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      secureTextEntry: true,
      isLoading: false,
      email: '',
      password: '',
      errors: {},
      isNotify: false,
      title: '',
      subtitle: '',
      type: '',
      action: '',
    };

    this.emailRef = this.updateRef.bind(this, 'email');
    this.passwordRef = this.updateRef.bind(this, 'password');
  }

  componentDidMount() {
    eventBus.emit('videoPaused', { isClosed: 'false' });
    Orientation.lockToPortrait();

    GoogleSignin.configure({
      scopes: ['profile'],
      webClientId:
        Platform.OS === 'ios'
          ? '483954169009-5qnhg4f6vgvs9flff4il2sgtv8g54oa2.apps.googleusercontent.com'
          : '483954169009-drvulhadgt228s05snjho8a326pc9bep.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      appleAuth.onCredentialRevoked(async () => {
        console.log('Apple credentials revoked');
      });
    }
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

  onSubmitEmail = () => {
    this.password?.focus();
  };

  onSubmitPassword = () => {
    this.password?.blur();
    this.onSubmit();
  };

  onAccessoryPress = () => {
    this.setState(prev => ({ secureTextEntry: !prev.secureTextEntry }));
  };

  onSubmit = () => {
    const { email, password } = this.state;
    let errors = {};
    const reg =
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!email) errors.email = 'Should not be empty';
    else if (!reg.test(email)) errors.email = 'Invalid Email Address Format.';

    if (!password) errors.password = 'Should not be empty';
    else if (password.length < 8)
      errors.password = 'The password must be at least 8 characters.';

    this.setState({ errors });

    if (Object.keys(errors).length === 0) {
      this.onLoginPressed();
    }
  };

  onLoginPressed = () => {
    const { email, password } = this.state;
    this.setState({ isLoading: true });

    HttpRequest.login({ email, password })
      .then(res => {
        this.setState({ isLoading: false });
        const result = res.data;

        if (res.status === 200 && result.error === false) {
          LocalData.setLoginToken(result.token);
          this.props.loginToken(result.token);

          LocalData.setUserInfo(result.detail);
          this.props.userInfo(result.detail);

          this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          this.notify('danger', 'Oops!', result.message ?? result.status, false);
        }
      })
      .catch(() => {
        this.setState({ isLoading: false });
        this.notify('danger', 'Oops!', 'Something Went Wrong!', false);
      });
  };

  renderPasswordAccessory() {
    const icon = this.state.secureTextEntry ? 'visibility' : 'visibility-off';

    return (
      <MaterialIcons
        size={24}
        name={icon}
        color="#ff0000"
        onPress={this.onAccessoryPress}
      />
    );
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

    getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id,name,email',
      },
    };
    const profileRequest = new GraphRequest('/me', {token, parameters: PROFILE_REQUEST_PARAMS}, (error, user) => {
      if (error) {
        console.log('login info has error: ' + error);
      } else {
        console.log('user  : ' + JSON.stringify(user));
        const emailmodified = user.email === undefined ? user.id + '@gmail.com' : user.email;
        console.log('login with modifoed email : ' + emailmodified);
        this.setState({isLoading: true});
        const dataSend = {
          email: emailmodified,
          phone: '1234567890',
          password: user.id,
          login_type: 'Facebook',
          name: user.name,
        };
        console.log('dataSend : ' + JSON.stringify(dataSend));
        HttpRequest.loginSocial(dataSend)
          .then(res => {
            this.setState({isLoading: false});
            const result = res.data;
            if (res.status == 200 && result.error == false) {
              console.log(result);
              LocalData.setLoginToken(result.token);
              this.props.loginToken(result.token);

              //Get Info of the Logged in user
              LocalData.setUserInfo(result.detail);
              this.props.userInfo(result.detail);

              this.props.navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              });
            } else {
              this.setState({isLoading: false});
              console.log('Signin API Error : ', result);
              this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, false);
            }
          })
          .catch(err => {
            this.setState({isLoading: false});
            console.log('Signin API Catch Exception: ', err);
            this.notify('danger', 'Oops!', 'Something Went Worng!', false);
          });
        console.log('result:', user);
      }
    });
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  FbLoginButton = () => {
    try{
      LoginManager.setLoginBehavior('web_only');
    if (AccessToken.getCurrentAccessToken() != null) {
      LoginManager.logOut();
      LoginManager.logInWithPermissions(['public_profile']).then(
        login => {
          if (login.isCancelled) {
            console.log('Login cancelled');
          } else {
            AccessToken.getCurrentAccessToken().then(data => {
              const accessToken = data.accessToken.toString();
              this.getInfoFromToken(accessToken);
            });
          }
        },
        error => {
          console.log('Login fail with error: ' + error);
        },
      );
    }
    }catch(e){
      console.log('Facebook login error : ' + JSON.stringify(e));
    }
    // Attempt a login using the Facebook login dialog asking for default permissions.
    
  };

  googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const googleUser = await GoogleSignin.signIn();
      console.log('googleUser : ' + JSON.stringify(googleUser));

      this.setState({isLoading: true});
      const dataSend = {
        email: googleUser.data.user.email,
        phone: '1234567890',
        login_type: 'Google',
        password: googleUser.data.user.id,
        name: googleUser.data.user.name,
      };
      console.log('dataSend : ' + JSON.stringify(dataSend));
      HttpRequest.loginSocial(dataSend)
        .then(res => {
          this.setState({isLoading: false});
          const result = res.data;
          if (res.status == 200 && result.error == false) {
            console.log(result);
            LocalData.setLoginToken(result.token);
            this.props.loginToken(result.token);

            //Get Info of the Logged in user
            LocalData.setUserInfo(result.detail);
            this.props.userInfo(result.detail);

            this.props.navigation.reset({
              index: 0,
              routes: [{name: 'Home'}],
            });
          } else {
            this.setState({isLoading: false});
            console.log('Signin API Error : ', result);
            this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, false);
          }
        })
        .catch(err => {
          this.setState({isLoading: false});
          console.log('Signin API Catch Exception: ', err);
          this.notify('danger', 'Oops!', 'Something Went Worng!', false);
        });
    } catch (e) {
      if (e.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled google login');
      } else if (e.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in in progress');
      } else if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play service not available');
      } else {
        console.log('Unknown google sign in error' + JSON.stringify(e));
      }
    }
  };

  onAppleButtonPress = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    console.log('cred : ' + JSON.stringify(credentialState));
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      console.log('appleAuthRequestResponse : ' + JSON.stringify(appleAuthRequestResponse));

      try {
        this.setState({isLoading: true});
        var dataSendAll = '';
        if (appleAuthRequestResponse.realUserStatus == 2) {
          var name = appleAuthRequestResponse.fullName.givenName + ' ' + appleAuthRequestResponse.fullName.familyName;
          const dataSend = {
            email: appleAuthRequestResponse.email,
            phone: '1234567890',
            password: appleAuthRequestResponse.user,
            login_type: 'Apple',
            name: name,
          };
          dataSendAll = dataSend;
        } else {
          const dataSend = {
            email: '',
            phone: '1234567890',
            password: appleAuthRequestResponse.user,
            login_type: 'Apple',
            name: '',
          };
          dataSendAll = dataSend;
        }

        console.log('dataSendAll : ' + JSON.stringify(dataSendAll));
        HttpRequest.loginSocial(dataSendAll)
          .then(res => {
            this.setState({isLoading: false});
            const result = res.data;
            if (res.status == 200 && result.error == false) {
              console.log(result);
              LocalData.setLoginToken(result.token);
              this.props.loginToken(result.token);

              //Get Info of the Logged in user
              LocalData.setUserInfo(result.detail);
              this.props.userInfo(result.detail);

              this.props.navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              });
            } else {
              this.setState({isLoading: false});
              console.log('Signin API Error : ', result);
              this.notify('danger', 'Oops!', result.message != undefined ? result.message : result.status, false);
            }
          })
          .catch(err => {
            this.setState({isLoading: false});
            console.log('Signin API Catch Exception: ', err);
            this.notify('danger', 'Oops!', 'Something Went Worng!', false);
          });
      } catch (e) {
        console.log('Unknown apple sign in error' + JSON.stringify(e));
      }
    }
  };
  /* ---------------- RENDER ---------------- */

  render() {
    const {
      isLoading,
      secureTextEntry,
      email,
      password,
      errors,
      isNotify,
      title,
      subtitle,
      type,
      action,
    } = this.state;

    const errorEmail = errors.email ? '#ff0000' : '#fff';
    const errorPassword = errors.password ? '#ff0000' : '#fff';

    return (
      <View style={styles.container}>
        <StatusBar  />

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
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 10 }}>
          <View style={styles.cardStyle}>
            <View style={styles.cardHeader}>
               <View style={styles.cardHeaderContent}>
              <Text style={styles.cardTitle}>LOGIN</Text>
              </View>
            </View>

            <ImageBackground
              source={require('../../../../assets/img/auth/signIn.png')}
              style={styles.bg}
            >
              <View style={styles.cardBody}>
                <View style={{ width: '90%', margin: '5%' }}>
                  {/* EMAIL */}
                  <View style={[styles.formItem, { borderColor: errorEmail }]}>
                    <AntDesign name="mail" size={25} color="#fff" />
                    <TextInput
                      ref={this.emailRef}
                      placeholder="Your@email.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={this.onFocus}
                      onChangeText={text => this.onChangeText(text, 'email')}
                      onSubmitEditing={this.onSubmitEmail}
                      value={email}
                      placeholderTextColor={errorEmail}
                      style={[styles.inputText, { color: errorEmail }]}
                    />
                  </View>
                  {errors.email && <Text style={styles.error}>{errors.email}</Text>}

                  {/* PASSWORD */}
                  <View style={[styles.formItem, { borderColor: errorPassword }]}>
                    <AntDesign name="lock" size={25} color="#fff" />
                    <TextInput
                      ref={this.passwordRef}
                      placeholder="Password"
                      secureTextEntry={secureTextEntry}
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={this.onFocus}
                      onChangeText={text => this.onChangeText(text, 'password')}
                      onSubmitEditing={this.onSubmitPassword}
                      value={password}
                      placeholderTextColor={errorPassword}
                      style={[styles.inputText, { color: errorPassword }]}
                    />
                    {this.renderPasswordAccessory()}
                  </View>
                  {errors.password && <Text style={styles.error}>{errors.password}</Text>}

                  {/* LOGIN BUTTON */}
                  <Button
                    mode="contained"
                    buttonColor="#d32f2f"
                    style={styles.loginBtn}
                    onPress={this.onSubmit}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.boldText}>LOGIN</Text>
                    )}
                  </Button>

                  <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => this.props.navigation.navigate('RecoverPassword')}
                  >
                    <Text style={styles.cardFooterText}>Forget password?</Text>
                  </TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                    <TouchableOpacity onPress={() => this.googleLogin()}>
                      <Image source={require('../../../components/images/Google-plus.png')} style={{height: 35, width: 35, alignSelf: 'center'}} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => this.FbLoginButton()}>
                      <Image source={require('../../../components/images/facebook-logo.png')} style={{height: 40, width: 40, marginLeft: 15}} />
                    </TouchableOpacity> */}
                    {Platform.OS === 'ios' ? (
                      <TouchableOpacity onPress={() => this.onAppleButtonPress()}>
                        <Image source={require('../../../components/images/apple_icon.png')} style={{height: 40, width: 40, marginLeft: 15}} />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <View style={styles.cardFooter}>
                  <Text style={styles.cardFooterText}>
                    Don't have an account?
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
                    <Text style={styles.labelBold}>  Sign up!</Text>
                    </TouchableOpacity>
                  </Text>
                </View>
                </View>
              </View>
            </ImageBackground>
          </View>
        </ScrollView>
      </View>
    );
  }
}

/* ---------------- REDUX ---------------- */

const mapStateToProps = state => ({
  token: state.token,
});

const mapDispatchToProps = dispatch => ({
  userInfo: bindActionCreators(userInfo, dispatch),
  loginToken: bindActionCreators(loginToken, dispatch),
});


const styles = StyleSheet.create({
    container: {
        height:'100%',
        backgroundColor: COLORS.backgroudColor,
    }, 
    transparentHeader: {
  backgroundColor: 'transparent',
  elevation: 0,          // Android
  shadowOpacity: 0,      // iOS
},
    logo:{
        width: screenWidth - screenWidth/3,
        height:screenHeight/7,
        resizeMode:'contain',
        alignSelf:'center',
        margin: 20
    },
    headerLogo:{
        height: Platform.OS == 'ios' ? '60%' : '50%',
        resizeMode: "contain",
    },
    infoIcon: {
        height: '60%',
        resizeMode: "contain"
    },
    content: {
        alignItems: 'center',
        justifyContent:'center',
    },
    cardStyle: {
        height: '87%',
        borderRadius:20,
        backgroundColor: COLORS.cardGrey,
        borderColor: COLORS.cardGrey,
    },
    cardHeader: {
        height: '10%',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        backgroundColor: COLORS.primary
    },
    cardHeaderContent: {
        flex:1,
        justifyContent: 'center',
        alignItems:'center' 
    },
    cardTitle: {
        color: COLORS.white,
        fontWeight:'bold',
        fontSize: 25
    },
    buttonTitle: {
        color: COLORS.white,
        fontWeight:'bold',
        marginLeft : 20,
        fontSize: 18
    },
    buttonTitle2: {
        color: COLORS.black,
        fontWeight:'bold',
        marginLeft : 20,
        fontSize: 18
    },
    cardBody: {
        height: '100%',
        alignItems: 'center',
        backgroundColor: "transparent" 
    },
    bg:{
        flex:1,
        width: '100%',
        height: '100%',
        resizeMode:'contain',
    },
    formItem: {
        flex:1,
        flexDirection:'row',
        height : 60,
        justifyContent:'flex-start',
        alignItems:'center',
        borderBottomWidth: 1,
    },
    label: {
        flex:1,
        color: COLORS.white,
    },
    labelBold: {
        color: COLORS.primary,
        fontWeight:'bold',
        alignSelf :'center',
        paddingTop :10,
      
    },
    loginBtn: {
            backgroundColor: COLORS.primary,
            width:screenWidth/2,
            alignSelf:'center',
            padding: '2%',
            justifyContent:'center',
            margin: screenHeight/30
        },
    boldText: {
        color: COLORS.white,
        fontWeight:'bold',
        textAlign:'center'
    },
    cardFooter: {
        justifyContent:'center',
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        backgroundColor: "transparent"
    },
    cardFooterText:{
        color: COLORS.white,
        fontWeight:'600',
        margin :10,
    
    },
    inputText: {
        flex:1,
        height:'100%',
        fontSize: 16,
        padding: 5,
        marginLeft: '2%'
    },
    error: {
        fontSize: 12,
        padding: 5,
        color: COLORS.primary,
    },
    forgotPassword:{
        marginTop: 10,
        padding: 10,
        alignSelf:'center'
    }


});
export default connect(mapStateToProps, mapDispatchToProps)(Signin);


