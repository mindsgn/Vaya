import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ToastAndroid, TimePickerAndroid, FlatList, ScrollView, TouchableOpacity, AsyncStorage} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import {  Drawer, Toast, Header, Left, Title, Right, Body, Button, Thumbnail, Separator,} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { AnimatedRegion, Marker }  from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';
import { Calendar, CalendarList } from 'react-native-calendars';
import Modal from "react-native-modal";
import renderIf from './../../renderIf'
import MapViewDirections from 'react-native-maps-directions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';

const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {latitude: 37.771707, longitude: -122.4053769};
const GOOGLE_MAPS_APIKEY = 'AIzaSyBMGCTBXbhp4jEjhRuOR8Sd61K27pk5f3I';

export default class screen2 extends React.Component {
  constructor() {
      super();
      this.state = {
          from:"",
          to:"",
          date: "",

          spinner:false,
          showInput: true,
          dateList: false,
          modal: false,
          viewDetails: false,
          viewAddDate: false,

          spinnerStatus: "",
          today:"",
          max:"",
          min:"",
          time: '',
          selectedHours: 0,
          option: "",
          selectedMinutes: 0,
          origin: "",
          destination: "",
          originCoordinate: [],
          destinationCoordinate: [],

          latitude1: null,
          longitude1: null,
          latitude2: null,
          longitude2: null,

          resultDistance:"",
          resultduration:"",

          requestDate:null,
          requestTime:null,

          userName:null,
          userToken:null,
          userPhone:null,

          requestDateTimeData:[],

          initialRegion:{latitude: -28.284535, longitude: 24.402177, latitudeDelta: 1, longitudeDelta: 1},
          transactionData:[]
      }
  }

  //execute when app starts
  async componentWillMount() {
    //this.sendRequest();
    this.setupdate();
    this.getData();
  }

  async componentDidMount() {
  }

  async componentDidUpdate(){
  }

  dateCard = ({item}) => {
    return(
      <View style={{flexDirection: "row", backgroundColor: "white", padding: 10, borderRadius: 10}}>
        <View>
          <Ionicons name="ios-checkmark-circle" color={"#0fc874"} size={30} style={{paddingTop: 5, paddingLeft: 5}}/>
        </View>
        <View style={{padding:10}}>
          <Text>{item.date}</Text>
          <Text>{item.time}</Text>
        </View>
      </View>);
  }

  setupdate(){
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
    this.setState({today:today, min: min, max:max, spinner: false})
  }

  sendRequest(){
    this.activateSpinner();
    this.setState({ showInput: true, dateList: false, modal: false, viewDetails: false, viewAddDate: false});

    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    var length = 10;

    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    var user = firebase.auth().currentUser;

    var data = [
      {
        id: result,
        user:[{
          name: this.state.userName,
          token: this.state.userToken,
        }],
        status: "pending",
        driver: null,
        origin: this.state.origin,
        destination: this.state.destination,
        coordinates:
          [{
            origin:
              [{
                latitude: this.state.latitude1,
                longitude: this.state.longitude1,
              }],
            destination:
              [{
                latitude: this.state.latitude2,
                longitude: this.state.longitude2,
              }]
          }],
        dates: this.state.requestDateTimeData
      }]

    firebase.database().ref('rides/').push({
      data
    })
    .then(function() {
      ToastAndroid.show('Request succefully posted', ToastAndroid.SHORT);
      this.setState({ origin: "", destination: "", latitude1: null, longitude1: null, latitude2: null, longitude2: null, requestDate:null, requestTime:null, requestDateTimeData:[] })
      this.disableSpinner();
    }.bind(this))
    .catch(function(error) {
      ToastAndroid.show('Request failed please try again', ToastAndroid.SHORT);
      this.disableSpinner();
    }.bind(this));
  }

  addDate(day){
    this.setState({modal:false, requestDate: day.dateString});
    this.pickTime();
  }

  async pickTime(){
    //alert(date.length);
    //this.setState({modal: false});

    try {
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: 0,
        minute: 0,
        is24Hour: false, // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        var time = hour +':'+minute;
        var data=this.state.requestDateTimeData;
        data.push({time: time, date:this.state.requestDate});
        this.setState({requestDateTimeData: data});

        //alert(JSON.stringify(this.state.requestDateTimeData));
      }else{
      }
    } catch ({code, message}) {
      alert('Cannot open time picker: '+message);
    }
  }

  async activateSpinner(){
    this.setState({spinner:true});
  }

  async disableSpinner(){
    this.setState({spinner:false});
  }

  getData = async () => {
    try {
      var value = await AsyncStorage.getItem('userData');
      if (value !== null) {
        value = JSON.parse(value);
        this.setState({userName: value[0].name, userToken: value[0].token, userPhone: value[0].phone});
      }else{
        alert("none")
      }
    } catch (error) {
      alert(error)
    }
  };

  convertAddress(){
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.origin}&key=${GOOGLE_MAPS_APIKEY}`;
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        if(responseJson.status==="OK"){
            var formatted_address=responseJson.results
            //JSON.parse(formatted_address);
            formatted_address = formatted_address[0].geometry
            var location=formatted_address.location
            this.setState({initialRegion: {latitude: location.lat, longitude: location.lng, latitudeDelta: 0.0922, longitudeDelta: 0.0421}, latitude1: location.lat, longitude1: location.lng})

        }else{
          alert(this.state.origin+": not found")
        }
      }).catch(e => {alert(e)});
  }

  getDestinationAddress(){
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.destination}&key=${GOOGLE_MAPS_APIKEY}`;
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        if(responseJson.status==="OK"){
            var formatted_address=responseJson.results
            //JSON.parse(formatted_address);
            formatted_address = formatted_address[0].geometry
            var location=formatted_address.location
            this.setState({initialRegion: {latitude: location.lat, longitude: location.lng, latitudeDelta: 0.0922, longitudeDelta: 0.0421},  latitude2: location.lat, longitude2: location.lng})

            /*const mode = 'driving'; // 'walking';
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.origin}&destination=${this.state.destination}&key=${GOOGLE_MAPS_APIKEY}&mode=${mode}`;

            fetch(url)
              .then(response => response.json())
              .then(responseJson => {
                //if (responseJson.routes.length) {
                    this.setState({
                        coords: this.decode(responseJson.routes[0].overview_polyline.points) // definition below
                    });
                    //alert(JSON.stringify(responseJson))
                //}
              }).catch(e => {alert(e)});*/
        }else{
          alert(this.state.origin+": not found")
          this.disableSpinner();
        }
      }).catch(e => {
          this.disableSpinner();
      });

  }

  getCoordinate1(){
    if(this.state.origin!==""){
      this.convertAddress()
    }
  }

  getCoordinate2(){
    if(this.state.destination!==""){
      this.activateSpinner();
      this.getDestinationAddress()
    }
  }

  refreshLayout(){
    if(this.state.latitude1===null && this.state.longitude1===null){

    }

    else if(this.state.latitude2===null && this.state.longitude2===null){
      this.map.fitToCoordinates([{ latitude: this.state.latitude1, longitude: this.state.longitude1 }])
    }

    else{
        this.map.fitToCoordinates([{ latitude: this.state.latitude1, longitude: this.state.longitude1 }, { latitude: this.state.latitude2, longitude: this.state.longitude2 }])
        this.disableSpinner();
    }
  }

  requestDateTimeCard = ({item}) => {
    return(
      <View style={{flex: 1, flexDirection: "row", backgroundColor: "white", borderRadius: 10, padding:10, marginBottom: 5}}>
        <View>
          <Ionicons name="md-calendar" color="#0fc874" size={50}/>
        </View>
        <View style={{paddingTop: 5, paddingLeft: 10}}>
          <Text>{item.date}</Text>
          <Text>{item.time}</Text>
        </View>
      </View>);
  }

  mapDetails(result){

    if(this.state.latitude1===null && this.state.longitude1===null){
    }

    else if(this.state.latitude2===null && this.state.longitude2===null){

    }

    else{
      //alert(JSON.stringify(result))
      var h = Math.floor(result.duration / 60);
      var m = result.duration % 60;
      h = h < 10 ? '0' + h : h;
      m = m < 10 ? '0' + m : m;

      var distance = Math.floor(result.distance)

      this.setState({showInput: false, viewDetails: true, resultDistance: result.distance, resultDuration: h + ' hours and ' + Math.floor(m) + ' minutes'});
      this.refreshLayout()
    }
  }

  render() {
    return(
      <View style={{flex:1}}>
      <Spinner
        visible={this.state.spinner}
        textContent={this.state.spinnerStatus}
        color={"white"}/>

        <View style={{flex:1}}>
          <MapView style={{flex: 1}}
            ref={map => { this.map = map }}
            showsTraffic={true}
            showsIndoors={true}
            showsUserLocation={true}
            onLayout={()=> this.refreshLayout()}
            initialRegion={this.state.initialRegion}>

            {!!this.state.latitude1 && !!this.state.longitude1 && <MapView.Marker.Animated
              coordinate={{"latitude":this.state.latitude1,"longitude":this.state.longitude1}}
              title={"Pickup Location"}
            />}

            {!!this.state.latitude2 && !!this.state.longitude2 && <MapView.Marker
              coordinate={{"latitude":this.state.latitude2,"longitude":this.state.longitude2}}
              title={"Drop Location"}
            />}

            <MapViewDirections
              mode={"DRIVING"}
              origin={{latitude: this.state.latitude1, longitude: this.state.longitude1}}
              destination={{latitude: this.state.latitude2, longitude: this.state.longitude2}}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={10}
              strokeColor="#0fc874"
              onStart={(params) => {}}
              onReady={result => { this.mapDetails(result)}}
              onError={(errorMessage) => {}}
              />

          </MapView>

          <View style={{flex: 1, position: 'absolute', width: '100%', padding:10}}>
            {renderIf(this.state.showInput)(
              <View style={{flex: 1, backgroundColor: "white", borderRadius: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    style={{flex: 1, marginLeft: 10, paddingTop: 10}}
                    secureTextEntry={false}
                    placeholder="Pick up Location"
                    onChangeText={origin => this.setState({origin})}
                    onEndEditing={() => this.getCoordinate1()}/>

                </View>
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    style={{flex: 1, marginLeft: 10, paddingTop: 10}}
                    secureTextEntry={false}
                    placeholder="Destination"
                    onChangeText={destination => this.setState({destination})}
                    onEndEditing={() => this.getCoordinate2()}/>
                </View>
              </View>)}
          </View>

          <View style={{flex: 1, position: 'absolute', width: '100%', bottom: 0, padding: 10}}>
            {renderIf(this.state.viewDetails)(
              <View style={{flex: 1, backgroundColor: "white", marginBottom: 20, borderRadius: 10, padding: 10}}>

                <View>
                  <Text>Pick up: {this.state.origin}</Text>
                  <Text>Destination: {this.state.destination}</Text>
                  <Text>Distance: {this.state.resultDistance} KM</Text>
                  <Text>Estimated Time: {this.state.resultDuration}</Text>
                </View>

              <Button full style={{backgroundColor: "#0fc874", borderRadius: 10, marginBottom: 10, marginTop: 10}} onPress={()=> this.setState({viewDetails:false, viewAddDate: true})}>
                <Text style={{color: "white"}}>Next</Text>
              </Button>

              <Button full style={{backgroundColor: "#f53d3d", borderRadius: 10}} onPress={()=> this.setState({viewDetails:false, showInput: true, origin: "", destination: "", latitude1: null , longitude1: null, latitude2: null , longitude2: null})}>
                <Text style={{color: "white"}}>back</Text>
              </Button>
             </View>)}
          </View>

          <View style={{flex: 1, position: 'absolute', height: '100%', width: '100%', bottom: 0, padding: 10}}>
            {renderIf(this.state.viewAddDate)(
              <View style={{flex: 1, backgroundColor: "white", marginBottom: 20, borderRadius: 10, padding: 10}}>
                <View style={{flexDirection:'row'}}>
                  <Text style={{flex:1, fontSize: 20}}>Date & Time</Text>

                  <TouchableOpacity onPress={()=> this.setState({modal:true})}>
                    <Ionicons name="md-add-circle" color="#0fc874" size={30}/>
                  </TouchableOpacity>
                </View>

                <ScrollView style={{flex: 1}}>
                  <FlatList
                    style={{flex:1}}
                    data={this.state.requestDateTimeData}
                    renderItem={this.requestDateTimeCard}/>
                </ScrollView>

                <Button full style={{backgroundColor: "#0fc874", borderRadius: 10, marginBottom: 10}} onPress={()=> this.sendRequest()}>
                  <Text style={{color: "white"}}>Send Request</Text>
                </Button>

                <Button full style={{backgroundColor: "#f53d3d", borderRadius: 10}} onPress={()=> this.setState({viewAddDate:false, showInput: true, origin: "", destination: "", latitude1: null , longitude1: null, latitude2: null , longitude2: null})}>
                  <Text style={{color: "white"}}>Cancel</Text>
                </Button>
              </View>
            )}
          </View>

        <Modal isVisible={this.state.modal}>
          <Calendar
            current={this.state.today}
            minDate={this.state.today}
            maxDate={this.state.max}
            onDayPress={(day) => this.addDate(day)}
            onDayLongPress={(day) => {console.log('selected day '+ day)}}
            monthFormat={'yyyy MMMM'}
            onMonthChange={(month) => {console.log('month changed', month)}}
            hideArrows={false}
            hideExtraDays={true}
            disableMonthChange={false}
            firstDay={1}
            hideDayNames={false}
            showWeekNumbers={false}
            onPressArrowLeft={substractMonth => substractMonth()}
            onPressArrowRight={addMonth => addMonth()}
            style={{borderRadius: 10}}
            markedDates={this.state.mark}/>
        </Modal>
        </View>
    </View>);
  }
}
