import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createMaterialTopTabNavigator, createAppContainer} from 'react-navigation'
import { Icon, Drawer, Toast, Header, Left, Title, Right, Body, Button, Thumbnail, Separator, ListItem} from 'native-base';
import Ride from './screens/screen1'
import Histo from './screens/screen2'


class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Home Screen</Text>
      </View>
    );
  }
}

const AppNavigator = createMaterialTopTabNavigator(
  {
    Upcoming:Ride,
    History: Histo
  },{
    swipeEnabled:true,
    tabBarOptions: {
      labelStyle: {
        fontSize: 12,
      },
      style: {
        backgroundColor: '#0fc874',
      },
    }
  });

export default createAppContainer(AppNavigator);
