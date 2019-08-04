import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Icon, Drawer, Toast, Header, Left, Title, Right, Body, Button, Thumbnail, Separator, ListItem} from 'native-base';
import Ride from './ride/Ride'

export default class screen1 extends React.Component {
  render() {
    return(
      <Ride/>
      );
    }}
