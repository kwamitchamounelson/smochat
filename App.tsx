import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './views/Login';
import Profile from './views/Profile';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatList from './views/ChatList';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Smochat' }}
        />

        <Stack.Screen name="Profile"
          component={Profile}
          options={{ title: 'Profile' }}
        />

        <Stack.Screen name="ChatList"
          component={ChatList}
          options={{ title: 'ChatList' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
