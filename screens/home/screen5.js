import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image,  AsyncStorage} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Drawer, Toast, Header, Left, Title, Right, Body, Button, Thumbnail, Separator, ListItem} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';
import { Rating, AirbnbRating } from 'react-native-ratings';
import renderIf from './../../renderIf'

export default class screen2 extends React.Component {
  constructor() {
      super();
      this.state = {
        spinner:false,
        name:"",
        imagelink:"",
        isVerified: false,
        overallRating: 0,
      };
  }

  async componentDidMount() {
  }

  //execute when app starts
  async componentWillMount() {
    this.getData();
  }

  async componentDidUpdate(){
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
        this.setState({userName: value[0].name, userProfile: value[0].profile, userPhone: value[0].phone, userToken: value[0].token});
      }else{
        alert("none")
      }
    } catch (error) {
      alert(error)
    }
  };

  getReviews(){
  }

  async clearall(){
    try {
      await AsyncStorage.clear();
    } catch (error) {
      alert(error)
    }
  }

  signout(){
    this.activateSpinner();
    this.clearall();
    firebase.auth().signOut().then(function() {
      this.disableSpinner();
    }.bind(this)).catch(function(error) {
      this.disableSpinner();
    }.bind(this));
  }

  render() {
    return(
    <View style={{flex:1}}>
      <Spinner
        visible={this.state.spinner}
        textContent={'loading...'}
        color={"white"}/>

      <Header style={{backgroundColor: "#0fc874"}}>
        <Left>
          <Title>More</Title>
        </Left>
        <Body>
        </Body>
        <Right>
        </Right>
      </Header>
      <View style={{flex:1}}>
        <View style={{flexDirection: "row", padding: 10, marginBottom: 10, backgroundColor: "white"}}>
          <View style={{flex: 1}}>
            <Image style={{borderRadius: 50, width: 100, height: 100}} source={require("./../../assets/web_hi_res_512.png")}/>
          </View>

          <View style={{flex: 1, marginLeft: 20, marginTop: 25}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: "black", fontWeight: "bold", fontSize: 15, marginRight: 5}}>{this.state.name}</Text>
              <Ionicons name="ios-checkmark-circle" color={this.state.isVerified ? "#0fc874" : "#f4f4f4"} size={15}/>
            </View>

            <TouchableOpacity style={styles.list}>
              <Text style={{color: "#0fc874", fontWeight: "bold"}}>View Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={{flex: 1, marginLeft: 20, marginTop: 25}}>
            <Rating
              type='star'
              ratingCount={1}
              imageSize={15}
              onFinishRating={this.ratingCompleted}
            />
            <Text style={{color: "#f4f4f4"}}>(0 Reviews)</Text>
          </View>
        </View>

        <View style={{flex: 1}}>
          <TouchableOpacity style={styles.list}>
            <Ionicons name="ios-star" color="#0fc874" size={20}/>
            <Text style={styles.listText}>My Review</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.list}>
            <Ionicons name="ios-notifications" color="#0fc874" size={20}/>
            <Text style={styles.listText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.list}>
            <Ionicons name="ios-list-box" color="#0fc874" size={20}/>
            <Text style={styles.listText}>Terms & Condition</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.list}>
            <Ionicons name="ios-share" color="#0fc874" size={20}/>
            <Text style={styles.listText}>Refer & Earn</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.list}>
            <Ionicons name="ios-thumbs-up" color="#0fc874" size={20}/>
            <Text style={styles.listText}>Rate Us</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.list}>
            <Ionicons name="ios-alert" color="#0fc874" size={20}/>
            <Text style={styles.listText}>Help</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signout}
            onPress={() => this.signout()}>
            <Text style={styles.signouText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
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
