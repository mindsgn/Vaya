import React, {Component} from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Drawer, Toast, Header, Left, Title, Right, Body, Button, Thumbnail, Separator, ListItem} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import renderIf from './../../../../renderIf'

export default class screen2 extends React.Component {
  constructor() {
      super();
      this.state = {
        requestData:[{sace: "", me: ""}],
        view: "",
      };
  }


  async componentDidMount() {
  }

    //execute when app starts
  async componentWillMount() {
  }

  async componentDidUpdate(){
  }

  async fetch(){
    var requestArray = [];

    var ref = firebase.database().ref('requests/');
    ref.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot){
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();

          requestsArray.push({from:"", to:"", status:"", date:""});
          this.setState({request:""});
        }.bind(this));
    }.bind(this));
  }

  requestCard = ({item}) => {
        return(
          <View style={{flex: 1, backgroundColor: "white", margin: 10, borderRadius: 10, padding:10}}>
            <Text>{item.from}</Text>
            <Text>{item.to}</Text>
          </View>);
  }

  render() {
    if(this.state.view===""){
      return(
        <View style={{flex: 1, backgroundColor: "white", padding:10, alignItems: "center", justifyContent: "center"}}>
          <Text>You have not booked yet</Text>
        </View>);
    }else{
      return(
      <View style={{flex: 1}}>
        <FlatList
          data={this.state.requestData}
          renderItem={this.requestCard}/>
      </View>);
    }
  }
}
