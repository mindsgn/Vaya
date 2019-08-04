import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Drawer, Toast, Header, Left, Title, Right, Body, Button, Thumbnail, Separator, ListItem} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';
import { Rating, AirbnbRating } from 'react-native-ratings';
import MapView from 'react-native-maps';



export default class screen2 extends React.Component {
  constructor() {
      super();
      this.state = {
        spinner:true,
        name:"",
        imagelink:"",
        overallRating: 0,
      };
  }

  render() {
    return(
    <View style={{flex:1}}>
    <MapView
    style={{flex:1}}/>
    </View>);
  }
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 10,
  },
  listText: {
    color: "black",
    marginLeft: 10,
  },
  signout:{
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
  },
  signouText:{
    color: "#0fc874",
  }
});
