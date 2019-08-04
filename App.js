/**
* Sample React Native App
* https://github.com/facebook/react-native
*
* @format
* @flow
* @lint-ignore-every XPLATJSCOPYRIGHT1
**/
'uses-strict';

import React, { Component } from 'react';
import { Platform,
          Picker,
          ToastAndroid,
          ImageBackground,
          Switch,
          DatePickerAndroid,
          TimePickerAndroid,
          ScrollView,
          AsyncStorage,
          StyleSheet,
          Text,
          View,
          TextInput,
          DrawerLayoutAndroid,
          InteractionManager,
          TouchableOpacity,
          Image,
          BackHandler,
          PermissionsAndroid,
          Slider,
          Dimensions,
          Animated,
          PanResponder} from 'react-native';
import { Icon, Drawer, Toast, Header, Left, Title, Right, Body, Button, Thumbnail, Separator, ListItem } from 'native-base';
import firebase from 'react-native-firebase';
import Hero from 'react-native-hero';
import LinearGradient from 'react-native-linear-gradient';
import Textarea from 'react-native-textarea';
import DropdownAlert from 'react-native-dropdownalert';
import RNLocation from 'react-native-location';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import SvgUri from 'react-native-svg-uri';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { FlatList, createAppContainer, createStackNavigator } from 'react-navigation';
import { List, Divider } from 'react-native-paper';
import PhoneInput from 'react-native-phone-input'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from "react-native-modal";
import validator from 'validator';
import Spinner from 'react-native-loading-spinner-overlay';
import Home from './screens/Home';
import renderIf from './renderIf'

type Props = {};

GoogleSignin.configure({
  webClientId: '1071139796147-3dtll2q8nmdse7p9re5d4svt1mhhstt3.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
});

export default class App extends Component<Props> {
  constructor() {
      super();
      this.state = {
        _view:"load",

        name: "",
        surname: "",
        phone: "",
        email: "",

        password:"",
        password2:"",

        spinner: false,
        spinnerText: "",

        valid: "",
        type: "",
        value: "",

        seePassword: false,
        seePassword2: false,

        isModalVisible: false,
        signInMethod:true,
      };

      this.signup = this.signup.bind(this);

      _drawer = (
          <View style={{flex:1}}>
	         <LinearGradient colors={['#0fc874', '#0fc874']} style={{flex:1}}>
            <View style={{flex: 1, padding: 10}}>
              <Image style={{borderRadius: 20, width: 50, height: 50}} source={require("./assets/web_hi_res_512.png")}/>
            </View>
	         </LinearGradient>

	         <View style={{flex:3, padding: 10}}>
             <View style={styles.drawerlist}>
			          <TouchableOpacity>
				            <Text style={{fontSize: 21}}>Driver Mode</Text>
			          </TouchableOpacity>
		         </View>
             <View style={styles.drawerlist}>
			          <TouchableOpacity>
				            <Text style={{fontSize: 21}}>The Team</Text>
			          </TouchableOpacity>
		         </View>
             <View style={styles.drawerlist}>
			          <TouchableOpacity>
				            <Text style={{fontSize: 21}}>About</Text>
			          </TouchableOpacity>
		         </View>
	          </View>
          </View>
      );
  }

  async componentDidMount() {
  }

  //execute when app starts
  async componentWillMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.getData();
      }else{
        this.setState({_view:"signin"});
      }
        /*var user = firebase.auth().currentUser;
        var name, email, photoUrl, uid, emailVerified;

        if (user != null) {
          email = user.email;
          name = user.displayName;
          photoUrl = user.photoURL;
          emailVerified = user.emailVerified;

          uid = user.uid;
          if(emailVerified){

          }else{
            //this.sendEmailVerification();
          }
          this.setState({isVerified: emailVerified});
        }

        this.disableSpinner();
        this.setState({_view:"home"});
        this.setState({email: "", password: ""})
      } else {

      }*/
    }.bind(this));
    /*for(var property in obj) {
      alert(property + "=" + obj[property]);
    }*/
  }

  async componentDidUpdate(){
  }

  updateDetails(name, surname){
    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: name+" "+surname,
    }).then(function() {
      this.checkAuth()
    }).catch(function(error) {
      this.checkAuth();
    });
  }

  getDetails(){
    var user = firebase.auth().currentUser;
    firebase.database().ref().child('customer/'+user.uid).on("value", function(snapshot) {
      if (snapshot.exists()) {
        var name = snapshot.val().name;
        var surname = snapshot.val().surname;
        var token = snapshot.val().token;
        var phone = snapshot.val().phone;
        var email = snapshot.val().email;
        var profile = snapshot.val().profile;
        name = name +" "+ surname;
        //alert(profile)
        if(name===""){
          this.disableSpinner();
          this.setState({_view: "addDetails"})
        }
        else if(phone===""){
          this.disableSpinner();
          this.setState({_view: "phone"})
        }else{
          var data = [{name: name, token: token, phone: phone, email: email, profile: profile}];
          this.storeData(data);
        }
      }else{
        this.disableSpinner();
        this.setState({_view: "addDetails"})
      }
    }.bind(this));
  }

  /*
    #0fc874, secondary: #32db64, danger: #f53d3d, light: #f4f4f4, dark: #222
  */

  updatePhone(phone){
    this.activateSpinner();
    var user = firebase.auth().currentUser;
    firebase.database().ref('customer/'+user.uid).update({phone: phone});
    this.getDetails();
  }

  addDetails(email, password, name, surname){
    this.activateSpinner();
    var user = firebase.auth().currentUser;
    firebase.database().ref('customer/'+user.uid).set({
      name: name,
      surname: surname,
      email: email,
      phone: "",
      profile: "",
      token: result,
    }).then(function() {
      //this.setState({_view: "home"})
      this.disableSpinner();
      this.getDetails();
      //ToastAndroid.show('sign up Successful !', ToastAndroid.SHORT);
    }.bind(this)).catch(function(error) {
      alert(error);
      this.disableSpinner();
    }.bind(this));
  }

  storeData = async (data) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      this.getData();
    } catch (error) {
      //alert(error);
      this.getData();
    }
  };

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('userData');
      if (value !== null) {
        this.disableSpinner();
        this.setState({_view: "home"})
      }else{
        this.getDetails();
      }
    } catch (error) {
      alert(error)
    }
  };

  signout(){
    this.activateSpinner();
    firebase.auth().signOut().then(function() {
      this.disableSpinner();
    }.bind(this)).catch(function(error) {
      this.disableSpinner();
    }.bind(this));
  }

  showError(type, title ,error){
    this.dropdown.alertWithType(type, title, error);
  }

  //pck date
  async pickDate(){
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date(2020, 4, 25)
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        //alert(date);
      }
    } catch ({code, message}) {
    }
  }

  //pick time
  async pickTime(){
    try {
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: 14,
        minute: 0,
        is24Hour: false, // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        // Selected hour (0-23), minute (0-59)
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
  }

  sendEmailVerification(){
    var user = firebase.auth().currentUser;

    user.sendEmailVerification().then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
        ToastAndroid.show('email verification not sent!', ToastAndroid.SHORT);
    });
  }

  signout(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      this.checkAuth();
    }).catch(function(error) {
      // An error happened.
      ToastAndroid.show('sign out error !', ToastAndroid.SHORT);
      this.checkAuth();
    });
  }

  //sign user in
  signin(email, password, phone){
    this.activateSpinner();
    /*this.updatephone();
    .then()
    firebase.auth().signInWithPhoneNumber(phone)
    .catch(error => ToastAndroid.show(error, ToastAndroid.SHORT););*/
    if(this.state.signInMethod){
      if(email===""){
        this.disableSpinner();
        ToastAndroid.show('sign in error !', ToastAndroid.SHORT);
      }

      else if(password===""){
        this.disableSpinner();
        ToastAndroid.show('sign in error !', ToastAndroid.SHORT);
      }

      else{
        //Toast.show({text: "works",buttonText: 'Okay'});
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          this.disableSpinner();
          //Toast.show({text: error,buttonText: 'Okay'});
          ToastAndroid.show('sign in error !', ToastAndroid.SHORT);
        }.bind(this));
      }
    }else{
      //var phoneNumber = getPhoneNumberFromUserInput();
      //var appVerifier = window.recaptchaVerifier;
      firebase.auth().signInWithPhoneNumber(phone.toString())
        .then(function (confirmationResult) {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          //window.confirmationResult = confirmationResult;
          this.disableSpinner();
        }.bind(this)).catch(function (error) {
          // Error; SMS not sent
          this.disableSpinner();
          alert(error)
          //ToastAndroid.show(error, ToastAndroid.SHORT);
        }.bind(this));
    }
    //this.setState({spinner:false});
  }

  async activateSpinner(){
    this.setState({spinner:true});
  }

  async disableSpinner(){
    this.setState({spinner:false});
  }

  //sign in with google
  async googleSignin(){
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo });
    } catch (error) {
      //alert(error.code)
      //ToastAndroid.show(error, ToastAndroid.SHORT);
      alert(JSON.stringify(error))
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  /*
  updatephone(){
    this.setState({
      valid: this.phone.isValidNumber(),
      type: this.phone.getNumberType(),
      value: this.phone.getValue()
    });
  }
  */

  signup(email, password, name, surname){
    this.activateSpinner();
    firebase.auth().createUserWithEmailAndPassword(email, password, name, surname).then(function() {
      //this.setNewUser(email, name, surname);
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      length = 10
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      var user = firebase.auth().currentUser;
      firebase.database().ref('customer/'+user.uid).set({
        name: name,
        surname: surname,
        email: email,
        phone: "",
        profile: "",
        token: result,
      }).then(function() {
        //this.setState({_view: "home"})
        this.disableSpinner();
        ToastAndroid.show('sign up Successful !', ToastAndroid.SHORT);
      }.bind(this)).catch(function(error) {
        alert(error);
        this.disableSpinner();
      }.bind(this));
    }.bind(this)).catch(function(error) {
      alert(error);
      this.disableSpinner();
    }.bind(this));
  };

  verify(code){
    this.setState({isModalVisible:false});
      //alert(code);
      //firebase.auth().confirm(code)
      //.then()
      //.catch();
  }

  sendEmailVerification(){
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
    });
  }

  setNewUser(email, name, surname){

  }

  recover(email){
    this.activateSpinner();
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        alert("password recovery email sent");
        this.disableSpinner();
        this.setState({_view:"signin"})
    }.bind(this)).catch(function(error) {
      alert("password recovery email failed");
      this.disableSpinner();
    }.bind(this));
  }

  add(){
    this.activateSpinner();
    this.disableSpinner();
  }

  closeDrawer(){
      this.refs['DRAWER'].closeDrawer();
  }

  openDrawer(){
    this.refs['DRAWER'].openDrawer();
  }

  sendPost(time, date, more, uid, type){
      this.setState({_view: "loading"});

      if(time===""){
        ToastAndroid.show('Time error!', ToastAndroid.SHORT);
        this.setState({_view: "book"});
      }

      else if(time===""){
        ToastAndroid.show('Time error!', ToastAndroid.SHORT);
        this.setState({_view: "book"});
      }

      else if(date===""){
        ToastAndroid.show('Date error!', ToastAndroid.SHORT);
        this.setState({_view: "book"});
      }

      else  if(date===""){
        ToastAndroid.show('Date error!', ToastAndroid.SHORT);
        this.setState({_view: "book"});
      }

      else{
        firebase.database().ref('requests/').push({
          time: date,
          date: date,
          uid: uid,
          more: more,
          type: type,
        }).then(function() {
          ToastAndroid.show('Request Sent!', ToastAndroid.SHORT);
          this.setState({_view:"booked"})
        }).catch(function(error) {
          ToastAndroid.show('Request failed!', ToastAndroid.SHORT);
          this.setState({_view: "book"});
        });
      }
  }

  //update profile
  updateProfile(link){
    var user = firebase.auth().currentUser;
    user.updateProfile({
      photoURL: link,
    }).then(function() {
      this.disableSpinner();
    }).catch(function(error) {
      this.disableSpinner();
    });
  }

  updateEmail(){
    var user = firebase.auth().currentUser;
    user.updateEmail("user@example.com").then(function() {
      // Update successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  //open check out only if user has items in basket
  openCheckOut(){
    var array=this.state.Basket;
    if(array===0){
      this.showError( 'error', "Error","no items in basket");
    }else{
      this.setState({_view:"checkout"})
    }
  }

  resetPassword(){
    var user = firebase.auth().currentUser;
    user.updatePassword(newPassword).then(function() {
      // Update successful.
      this.disableSpinner();
    }).catch(function(error) {
      // An error happened.
      this.disableSpinner();
    });
  }

  render() {
    if(this.state._view=="signin"){
        return (
          <View style={{flex: 1}}>
            <Spinner
              visible={this.state.spinner}
              textContent={'signing in...'}
              color={"white"}/>

            <LinearGradient colors={['black', 'black']} style={{flex:1}}>
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{alignItems: "center", justifyContent: "center"}}>
                  <Image style={{borderRadius: 20, width: 150, height: 150}} source={require("./assets/web_hi_res_512.png")}/>
                </View>
              </View>

              <View style={{backgroundColor: 'white', padding: 10}}>
                <View>
                  <View style={{marginBottom: 10, borderRadius: 10, backgroundColor:'#f4f4f4'}}>
                    <View style={{padding: 5}}>
                        {renderIf(this.state.signInMethod)(
                          <View style={{}}>
                            <View style={{flexDirection: "row"}}>
                              <TextInput
                              style={{flex:1}}
                              secureTextEntry={false}
                              placeholder="email"
                              onChangeText={email => this.setState({email: email})}/>

                              <TouchableOpacity
                                style={{backgroundColor: "transparent", marginLeft: 5, marginRight: 5, flexDirection: "row"}}
                                onPress={()=> this.setState({signInMethod: false})}>
                                  <Ionicons name="md-swap" color={"#0fc874"} size={30}/>
                              </TouchableOpacity>
                            </View>
                            <View>
                              <TextInput
                                secureTextEntry={true}
                                placeholder="password"
                                onChangeText={password => this.setState({password:password})}/>
                            </View>
                          </View>
                        )}

                        {renderIf(!this.state.signInMethod)(
                          <View style={{flexDirection:"row"}}>
                            <TextInput
                              style={{flex: 1}}
                              secureTextEntry={false}
                              placeholder="Cellphone"
                              dataDetectorType="phoneNumber"
                              keyboardType="phone-pad"
                              maxLength={10}
                              onChangeText={phone => this.setState({phone: phone})}/>

                              <TouchableOpacity
                                style={{backgroundColor: "transparent", marginLeft: 5, marginRight: 5, flexDirection: "row"}}
                                onPress={()=> this.setState({signInMethod: true})}>
                                  <Ionicons name="md-swap" color={"#0fc874"} size={30}/>
                              </TouchableOpacity>
                          </View>
                        )}
                    </View>
                  </View>

                  <View>
                    <Button full style={{backgroundColor: "#0fc874", borderRadius: 10}} onPress={()=> this.signin(this.state.email, this.state.password, this.state.phone)}>
                      <Text style={{color: "white"}}>Sign in</Text>
                    </Button>
                  </View>

                  <View style={{marginTop: 10, flexDirection:"row"}}>
                        <TouchableOpacity
                          style={{flex:1, backgroundColor: "transparent", marginLeft: 5, marginRight: 5, flexDirection: "row"}}
                          onPress={()=> this.setState({_view:"signup"})}>
                            <View>
                              <Text>New User?</Text>
                            </View>
                            <View>
                              <Text style={{color: "#0fc874"}}> Sign Up</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{flex:1, backgroundColor: "transparent", marginLeft: 5, marginRight: 5, flexDirection: "row"}}
                          onPress={()=> this.setState({_view:"password"})}>
                          <View style={{flexDirection: "row", alignsItems: 'flex-end'}}>
                            <View>
                              <Text>Forgot</Text>
                            </View>
                            <View>
                              <Text style={{color: "#0fc874"}}> Password?</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                  </View>

                  <View style={{marginTop:30}}>
                    <View style={{alignItems: "center", justifyContent: "center"}}>
                      <Text>OR CONTINUE WITH</Text>
                    </View>

                    <View style={{marginTop: 10, flexDirection:"row"}}>

                        <Button style={{padding:5, flex:1, margin:5, borderRadius:10 }}>
                          <Ionicons name="logo-facebook" color="white" size={20}/>
                          <Text>Facebook</Text>
                        </Button>

                        <Button
                          style={{padding:5, backgroundColor: "white", flex: 1, margin:5, borderRadius:10}}
                          onPress={()=> this.googleSignin()}>

                          <Ionicons name="logo-google" color="red" size={20}/>
                          <Text>GOOGLE</Text>
                        </Button>

                    </View>
                  </View>

                  <View style={{paddingTop: 10, alignItems: 'center', justifyContent: 'center'}}>

                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>);
    }

    else if(this.state._view=="signin2"){
        return (
          <View style={{flex: 1}}>
            <Spinner
              visible={this.state.spinner}
              textContent={'signing in...'}
              color={"white"}/>

            <LinearGradient colors={['black', 'black']} style={{flex:1}}>
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{alignItems: "center", justifyContent: "center"}}>
                  <Image style={{borderRadius: 20, width: 150, height: 150}} source={require("./assets/web_hi_res_512.png")}/>
                </View>
              </View>

              <View style={{backgroundColor: 'white', padding: 10}}>
                <View>
                  <View style={{marginBottom: 10, borderRadius: 10, backgroundColor:'#f4f4f4'}}>
                    <View style={{padding: 5}}>
                    <TextInput
                      secureTextEntry={false}
                      placeholder="email"
                      onChangeText={email => this.setState({email: email})}/>

                    <TextInput
                      secureTextEntry={true}
                      placeholder="password"
                      onChangeText={password => this.setState({password:password})}/>
                    </View>
                  </View>


                  <View>
                    <Button full style={{backgroundColor: "#0fc874", borderRadius: 10}} onPress={()=> this.signin(this.state.email, this.state.password)}>
                      <Text style={{color: "white"}}>Sign in</Text>
                    </Button>
                  </View>

                  <View style={{marginTop: 10, flexDirection:"row"}}>
                        <TouchableOpacity
                          style={{flex:1, backgroundColor: "transparent", marginLeft: 5, marginRight: 5, flexDirection: "row"}}
                          onPress={()=> this.setState({_view:"signup"})}>
                            <View>
                              <Text>New User?</Text>
                            </View>
                            <View>
                              <Text style={{color: "#0fc874"}}> Sign Up</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{flex:1, backgroundColor: "transparent", marginLeft: 5, marginRight: 5, flexDirection: "row"}}
                          onPress={()=> this.setState({_view:"password"})}>
                          <View>
                            <Text>Forgot</Text>
                          </View>
                          <View>
                            <Text style={{color: "#0fc874"}}> Password?</Text>
                          </View>
                        </TouchableOpacity>
                  </View>

                  <View style={{marginTop:30}}>
                    <View style={{alignItems: "center", justifyContent: "center"}}>
                      <Text>OR CONTINUE WITH</Text>
                    </View>

                    <View style={{marginTop: 10, flexDirection:"row"}}>

                        <Button style={{padding:5, flex:1, margin:5, borderRadius:10 }}>
                          <Ionicons name="logo-facebook" color="white" size={20}/>
                          <Text>Facebook</Text>
                        </Button>

                        <Button
                          style={{padding:5, backgroundColor: "white", flex: 1, margin:5, borderRadius:10}}
                          onPress={()=> this.googleSignin()}
                          >

                          <Ionicons name="logo-google" color="red" size={20}/>
                          <Text>GOOGLE</Text>
                        </Button>

                    </View>
                  </View>

                  <View style={{paddingTop: 10, alignItems: 'center', justifyContent: 'center'}}>

                  </View>
                </View>
              </View>

            </LinearGradient>
          </View>);
    }

    else if(this.state._view=="signup"){
      return (
        <View>
        <Spinner
          visible={this.state.spinner}
          textContent={'signing up...'}
          color={"white"}/>

        <Header style={{backgroundColor: "#0fc874"}}>
          <Left>
            <Button transparent onPress={() => this.setState({_view:"signin"})}>
              <Icon name='ios-arrow-back'
                style={{color: "white"}}
                size={25}
              />
            </Button>
          </Left>
          <Body>
            <Title>Sign Up</Title>
          </Body>
          <Right>
          </Right>
        </Header>
          <View style={{backgroundColor:'white', padding: 10}}>
          <View style={{marginBottom: 10, borderRadius: 10, backgroundColor:'#f4f4f4'}}>

            <TextInput
              secureTextEntry={false}
              placeholder="Email"
              onChangeText={email => this.setState({email})}/>

            <TextInput
              secureTextEntry={false}
              placeholder="Name"
              onChangeText={name => this.setState({name})}/>

            <TextInput
              secureTextEntry={false}
              placeholder="Surname"
              onChangeText={surname => this.setState({surname})}/>

            <TextInput
              secureTextEntry={true}
              placeholder="Enter password"
              onChangeText={password => this.setState({password})}/>
          </View>

          <Button full style={{backgroundColor: "#0fc874", borderRadius: 10}} onPress={()=> this.signup(this.state.email, this.state.password, this.state.name, this.state.surname)}>
            <Text style={{color: "white"}}>Sign Up</Text>
          </Button>

          <Modal isVisible={this.state.isModalVisible}>
            <View style={{ backgroundColor: "white", padding: 10}}>
              <View style={{marginBottom: 10, borderRadius: 10, backgroundColor:'#f4f4f4'}}>
                <TextInput
                  style={{}}
                  secureTextEntry={true}
                  placeholder="Verification Code"
                  onChangeText={Code => this.setState({Code})}
                />
              </View>

              <Button full style={{backgroundColor: "#0fc874", borderRadius: 10}} onPress={()=> this.verify(this.state.code)}>
                <Text style={{color: "white"}}>Verify</Text>
              </Button>

            </View>
          </Modal>

          </View>
        </View>);
    }

    else if(this.state._view=="addDetails"){
      return (
        <View>
        <Spinner
          visible={this.state.spinner}
          textContent={'signing up...'}
          color={"white"}/>

        <Header style={{backgroundColor: "#0fc874"}}>
          <Left>
            <Button transparent onPress={() => this.setState({_view:"signin"})}>
              <Icon name='ios-arrow-back'
                style={{color: "white"}}
                size={25}
              />
            </Button>
          </Left>
          <Body>
            <Title>Sign Up</Title>
          </Body>
          <Right>
          </Right>
        </Header>
          <View style={{backgroundColor:'white', padding: 10}}>
          <View style={{marginBottom: 10, borderRadius: 10, backgroundColor:'#f4f4f4'}}>

            <TextInput
              secureTextEntry={false}
              placeholder="Email"
              onChangeText={email => this.setState({email})}/>

            <TextInput
              secureTextEntry={false}
              placeholder="Name"
              onChangeText={name => this.setState({name})}/>

            <TextInput
              secureTextEntry={false}
              placeholder="Surname"
              onChangeText={surname => this.setState({surname})}/>
          </View>

          <Button full style={{backgroundColor: "#0fc874", borderRadius: 10}} onPress={()=> this.addDetails(this.state.email, this.state.password, this.state.name, this.state.surname)}>
            <Text style={{color: "white"}}>Add Details</Text>
          </Button>

          </View>
        </View>);
    }

    else if(this.state._view=="password"){
      return (
        <View style={{flex: 1}}>
        <Spinner
          visible={this.state.spinner}
          textContent={'checking email...'}
          color={"white"}/>
          <Header style={{backgroundColor: "#0fc874"}}>
            <Left>
              <Button transparent onPress={() => this.setState({_view:"signin"})}>
                <Icon name='ios-arrow-back'
                  style={{color: "white"}}
                  size={25}/>
              </Button>
            </Left>
            <Body>
              <Title>Password Recovery</Title>
            </Body>
            <Right>
            </Right>
          </Header>
          <View style={{flex: 1, backgroundColor:'white', padding: 10}}>
            <View style={{marginBottom: 10, borderRadius: 10, backgroundColor:'#f4f4f4'}}>
              <TextInput
                secureTextEntry={false}
                placeholder="Email"
                onChangeText={email => this.setState({email:email})}/>
            </View>

            <Button full style={{backgroundColor: "#0fc874", borderRadius: 10}} onPress={()=> this.recover(this.state.email)}>
              <Text style={{color: "white"}}>Recover</Text>
            </Button>
          </View>
        </View>);
    }

    else if(this.state._view=="phone"){
      return (
            <View style={{flex:1}}>
              <Header style={{backgroundColor: "#0fc874"}}>
                <Left>
                </Left>
                <Body>
                  <Title>Add phone number</Title>
                </Body>
                <Right>
                </Right>
              </Header>
              <View style={{flex: 1, backgroundColor:'white'}}>
                <LinearGradient colors={['#0fc874', '#a8e063']} style={{flex:1}}>
                  <View style={{flex:2, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{color: "white"}}>Please Add your phone number</Text>
                  </View>

                  <View style={{flex:1, backgroundColor: "white", padding: 10}}>
                    <View style={{backgroundColor:'#f4f4f4', marginBottom: 10, borderRadius: 10, padding: 5}}>
                      <TextInput
                        secureTextEntry={false}
                        placeholder="Cellphone Number (+27)"
                        onChangeText={phone => this.setState({phone:phone})}
                        dataDetectorType="phoneNumber"
                        keyboardType="phone-pad"
                        maxLength={12}/>
                    </View>

                    <Button full style={{backgroundColor: "#0fc874", borderRadius: 10, marginBottom: 10}} onPress={()=> this.updatePhone(this.state.phone)}>
                      <Text style={{color: "white"}}>Add phone</Text>
                    </Button>
                  </View>
                </LinearGradient>
              </View>
          </View>);
    }

    else if(this.state._view=="checkout"){
      return (
        <View style={{flex:1}}>
          <Header style={{backgroundColor: "green"}}>
              <Left>
              <Button transparent onPress={() => this.setState({_view:"home"})}>
                <Icon name='arrow-back' />
              </Button>
              </Left>
              <Body>
                <Title>checkout</Title>
              </Body>
              <Right>
              </Right>
          </Header>
          <View style={{flex:9}}>
            <TouchableOpacity onPress={() => this.setState({_view:"help"})}>
              <FlatList
                style={{flex: 1}}
                data={this.state.Basket}
                renderItem={this.basketItem}
              />
            </TouchableOpacity>
          </View>

          <View style={{flex:1, flexDirection: "row"}}>
              <Text>Total: R{(this.state.Total).toFixed(2)}</Text>
          </View>
        </View>
        );
    }

    else if(this.state._view=="home"){
      return(
        <DrawerLayoutAndroid
          drawerWidth={300}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          ref={'DRAWER'}
          renderNavigationView={() => _drawer}
          style={{flex: 1}}>
          <Home />
        </DrawerLayoutAndroid>
      );
    }

    else if(this.state._view=="load"){
      return(
        <LinearGradient colors={['black', 'black']} style={{backgroundColor: "green", flex: 1, justifyContent: "center", alignItems:"center"}}>
          <View style={{alignItems: "center", justifyContent: "center"}}>
            <Image style={{borderRadius: 20, width: 150, height: 150}} source={require("./assets/web_hi_res_512.png")}/>
          </View>
          <View style={{alignItems: "center", justifyContent: "center"}}>
            <Text style={{color: "white"}}>Lift Club</Text>
          </View>
        </LinearGradient>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeSection:{
    flex:1,
  },
  homeCard:{
    flex:1,
    backgroundColor: "gray",
    width: 200,
    height: 200,
    margin: 5,
    borderRadius: 25,
  },
  cardList:{
    flexDirection: "row"
  },
  cardInfo:{
    flex:1, flexDirection:"row", backgroundColor:"white", padding: 5, paddingLeft: 10
  },
  textareaContainer: {
    height: 180,
    padding: 5,
    backgroundColor: '#F5FCFF',
  },
  textarea: {
    textAlignVertical: 'top',  // hack android
    height: 170,
    fontSize: 14,
    color: '#333',
  },
  homeCardList:{
    borderRadius: 10,
    marginTop: 10,
  },
  homeCardList_:{
    flex: 1,
    bottom: 0,
    color: "white",
  },
  homeCardImage:{
    marginTop: 150,
  },
  homeCardfont:{
    flex: 1,
    marginTop: 150,
    bottom: 0,
    color: "white",
  },
});
