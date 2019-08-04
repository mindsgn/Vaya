import React from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Ride from './home/screen1'
import Chat from './home/screen2'
import Find from './home/screen3'
import Wallet from './home/screen4'
import More from './home/screen5'
import Map from './home/screen6'
import Ionicons from 'react-native-vector-icons/Ionicons';

const App = createMaterialBottomTabNavigator(
    {
      Find: { screen: Find },
      Ride: { screen: Ride },
      Chats: { screen: Chat },
      Wallet: { screen: Wallet },
      More: { screen: More },
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let IconComponent = Ionicons;
          let iconName;

          if (routeName === 'Ride') {
            iconName = `ios-car${focused ? '' : ''}`;
          }

          else if (routeName === 'Chats') {
            iconName = `ios-chatboxes${focused ? '' : ''}`;
          }

          else if (routeName === 'Find') {
            iconName = `ios-search${focused ? '' : ''}`;
          }

          else if (routeName === 'Wallet') {
            iconName = `ios-wallet${focused ? '' : ''}`;
          }

          else if (routeName === 'More') {
            iconName = `ios-more${focused ? '' : ''}`;
          }

          return <IconComponent name={iconName} size={25} color={tintColor} />;
        },
      }),
      tabBarOptions: {
        activeTintColor: '#0fc874',
        inactiveTintColor: 'gray',
      },
      activeColor: '#0fc874',
      inactiveColor: 'gray',
      barStyle: { backgroundColor: 'white' },
    }
  );

export default createAppContainer(App);
