import React, {Component} from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, Image} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import {  Drawer, Toast, Header, Left, Title, Right, Body, Button, Thumbnail, Separator, ListItem} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import renderIf from './../../renderIf'

export default class screen2 extends React.Component {
  constructor() {
      super();
      this.state = {
        balance: 0,
        view: "",
        transactionData: [{from: "", to:"", }],
      };
  }

  GetBalance(){
     var i = Math.floor(Math.random(0,100000)*100, .3);
     //this.setState({balance:i});
     //this.setState({converted_balance:(Math.floor(i*(200.54), 2))});
   }

  DepositMethods(){
  }

  WithdrawMethods(){
  }

  transactionCard = ({item}) => {
      if(this.state.transactionData.length=1){
        return(
          <View style={{flex: 1, backgroundColor: "white", padding:10}}>
            <Text>No Transaction history</Text>
            <Text>Please Deposit money into your account</Text>
          </View>);
      }

      else{
        return(
          <View style={{flex: 1, backgroundColor: "white", margin: 10, borderRadius: 10, padding:10}}>
            <Text>{item.from}</Text>
            <Text>{item.to}</Text>
          </View>);
      }
  }

  render() {
    if(this.state.view===""){
      return(
        <View style={{flex:1}}>
        <Header style={{backgroundColor: "#0fc874"}}>
          <Left>
            <Title>Wallet</Title>
          </Left>
          <Body>
          </Body>
          <Right>
          </Right>
        </Header>
        <View style={{flex:1}}>
          <View style={{backgroundColor: "#0fc874", alignItems: "center", justifyContent: "center", padding: 10}}>
            <View>
              <View style={{alignItems: "center", justifyContent: "center"}}>
                <Text>Total Balance</Text>
                <Text style={{color: "white", fontSize:30 }}>R0.00</Text>
              </View>
              <View style={{flexDirection: "row"}}>
                <Button full style={{backgroundColor: "#0fc874", borderRadius: 10, margin: 10, padding: 10}} onPress={()=> this.DepositMethods()}>
                  <Text style={{color: "white"}}>ADD MONEY</Text>
                </Button>
                <Button full style={{backgroundColor: "white", borderRadius: 10, margin: 10, padding: 10}} onPress={()=> this.WithdrawMethods()}>
                  <Text style={{color: "#0fc874"}}>WITHDRAW</Text>
                </Button>
              </View>
            </View>
          </View>
          <View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
            <Text>No Transactions</Text>
          </View>
        </View>
      </View>);
    }else{
      return(
        <View style={{flex:1}}>
        <Header style={{backgroundColor: "#0fc874"}}>
          <Left>
            <Title>Wallet</Title>
          </Left>
          <Body>
          </Body>
          <Right>
          </Right>
        </Header>
        <View style={{flex:1}}>
          <View style={{backgroundColor: "#0fc874", alignItems: "center", justifyContent: "center", padding: 10}}>
            <View>
              <View style={{alignItems: "center", justifyContent: "center"}}>
                <Text>Total Balance</Text>
                <Text style={{color: "white", fontSize:30 }}>R0.00</Text>
              </View>
              <View style={{flexDirection: "row"}}>
                <Button full style={{backgroundColor: "#0fc874", borderRadius: 10, margin: 10, padding: 10}} onPress={()=> this.signin(this.state.email, this.state.password)}>
                  <Text style={{color: "white"}}>ADD MONEY</Text>
                </Button>
                <Button full style={{backgroundColor: "white", borderRadius: 10, margin: 10, padding: 10}} onPress={()=> this.signin(this.state.email, this.state.password)}>
                  <Text style={{color: "#0fc874"}}>WITHDRAW</Text>
                </Button>
              </View>
            </View>
          </View>
          <ScrollView style={{flex: 1}}>
            <FlatList
              data={this.state.transactionData}
              renderItem={this.transactionCard}/>
          </ScrollView>
        </View>
      </View>);
    }

  }
}
