import React, {Component} from 'react';
import { StyleSheet, Text, View, FlatList, Image, AsyncStorage, TouchableOpacity, ScrollView } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Drawer, Toast, Header, Left, Title, Right, Body, Button, Thumbnail, Separator, ListItem} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';
import { Rating, AirbnbRating } from 'react-native-ratings';
import renderIf from './../../../../renderIf'
import MapView, { AnimatedRegion, Marker }  from 'react-native-maps';

export default class screen2 extends React.Component {
  constructor() {
      super();
      this.state = {
        rideData:[],
        view: "",
        userName:"",
        userToken: "",
        userPhone: "",
        today: "",
      };
  }

  async componentDidMount() {
  }

  //execute when app starts
  async componentWillMount() {
    //this.getData();
    this.getData();
  }

  async componentDidUpdate(){
  }

  getData = async () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    var max = yyyy;
    max = max +1;
    max = max +'-'+mm+'-'+dd;
    min = dd;
    min = min-1;
    min = yyyy+'-'+mm+'-'+ min;
    this.setState({today:today})

    try {
      var value = await AsyncStorage.getItem('userData');
      if (value !== null) {
        value = JSON.parse(value);
        this.setState({userName: value[0].name, userToken: value[0].token, userPhone: value[0].phone});
        this.fetchData(this.state.userToken);
      }else{
        alert("none")
      }
    } catch (error) {
      alert(error)
    }
  };

  async fetchData(){

    _token = this.state.userToken;
    today = this.state.today
    var rideArray = [];

    var rideData = firebase.database().ref('rides/');
    rideData.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        var _rideData=childData.data;
        var user=_rideData[0].user;
        token = user[0].token;

        dates=_rideData[0].dates;

        if(token===_token){

          var rideDates = [];
          dates.forEach(function(date) {
            if(date.date>=today){
              rideDates.push({date})
            }
          });
          rideArray.push({id: _rideData[0].id, key: childKey,  destination: _rideData[0].destination, origin:_rideData[0].origin, status: _rideData[0].status, dates: rideDates})
          this.setState({rideData:rideArray})
        }
      }.bind(this));

    }.bind(this));
  }

  async Remove(key){
    /*var removePost = firebase.database().ref('rides/'+key);
    removePost.remove().then(function() {
      this.fetchData();
      ToastAndroid.show('successful removed!', ToastAndroid.SHORT);
    }.bind(this))
    .catch(function(error) {
      this.fetchData();
      ToastAndroid.show('failed to remove!', ToastAndroid.SHORT);
    }.bind(this));*/
  }

  requestCard = ({item}) => {
        /*return(
          <View style={{flex: 1, backgroundColor: "white"}}>
            <View style={{flexDirection: "row", padding: 10, marginBottom: 10}}>
              <View style={{}}>
                <Image style={{borderRadius: 50, width: 50, height: 50}} source={require("./../../../../assets/web_hi_res_512.png")}/>
              </View>

              <View style={{flex: 1, marginLeft: 20, marginTop: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: "black", fontWeight: "bold", fontSize: 15, marginRight: 5}}>{item.driverName}</Text>
                  <Ionicons name="logo-google" color="#0fc874" size={15}/>
                </View>
                <Text style={{color: "#f4f4f4"}}>{item.carMake} | {item.carColor}</Text>
              </View>

              <View style={{flex: 1, marginLeft: 20, marginTop: 10}}>
                <Text style={{color: "#0fc874", fontWeight: "bold"}}>R {item.price}</Text>
                <Text style={{color: "#f4f4f4"}}>{item.price} seats</Text>
              </View>
            </View>

            <View style={{flex:1, flexDirection: "row"}}>
              <View style={{backgroundColor: "#0fc874", marginRight: 15, }}>
                <Text style={{marginTop: 40, color: "white", transform: [{ rotate: '270deg'}], textAlignVertical: 'center'}}>{item.status}</Text>
              </View>

              <View style={{flex:1}}>
                <View style={{flex:1, marginBottom: 10}}>
                  <Text>{item.from}</Text>
                  <Text>{item.to}</Text>
                </View>

                <View style={{flex:1, flexDirection: "row"}}>
                  <View style={{flex:1}}>
                    <Text>Date & time</Text>
                  </View>
                  <View style={{flex:1}}>
                    <Button full style={{backgroundColor: "#0fc874", borderRadius: 10, margin: 10, padding: 10}} onPress={()=> this.signin(this.state.email, this.state.password)}>
                      <Text style={{color: "white"}}>Message</Text>
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          </View>);
          */
          return(
            <View style={{flex: 1, backgroundColor: "white", marginBottom:10}}>
              <View style={{flex:1}}>
                <MapView
                  style={{flex: 1}}
                  liteMode={true}
                  loadingEnabled={true}
                  initialRegion={{ latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421, }}/>
              </View>
              <View style={{flexDirection: "row", padding: 10}}>
                <View style={{flex:1}}>
                  <Text>Pick up: {item.origin}</Text>
                  <Text>Destination: {item.destination}</Text>
                  <Text>status: {item.status}</Text>
                </View>
                <View style={{alignItems: "center", justifyContent: "center"}}>
                  <TouchableOpacity onPress={() => this.Remove(item.key)}>
                    <Ionicons name="md-remove-circle" color="#f53d3d" size={30}/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
  }

  render() {
      return(
      <ScrollView style={{flex: 1}}>
        <FlatList
          data={this.state.rideData}
          renderItem={this.requestCard}/>
      </ScrollView>);

  }
}
