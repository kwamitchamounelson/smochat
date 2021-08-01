import 'react-native-gesture-handler';
import React from 'react';
import Login from './views/Login';
import Profile from './views/Profile';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatList from './views/ChatList';
import Chat from './views/Chat';
import OnBoarding from './views/OnBoarding';
import CustomMaterialMenu from './components/CustomMaterialMenu';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="OnBoarding"
        screenOptions={({ route, navigation }) => ({
          headerStyle: {
            backgroundColor: '#2f99af',
          },
          headerTintColor: '#fff',
          headerRight: () => (
            <CustomMaterialMenu
              //Menu Text
              menutext="Menu"
              //Menu View Style
              menustyle={{ marginRight: 10 }}
              //Menu Text Style
              textStyle={{ color: 'white' }}
              navigation={navigation}
              route={route}
              isIcon={true}
            />
          ),
        })}
      >

        <Stack.Screen
          name="OnBoarding"
          component={OnBoarding}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false, headerLeft: () => null }}
        />

        <Stack.Screen name="Profile"
          component={Profile}
          options={{ title: 'Profile', headerLeft: () => null }}
        />

        <Stack.Screen name="ChatList"
          component={ChatList}
          options={{ title: 'Smochat', headerLeft: () => null }}
        />

        <Stack.Screen name="Chat"
          component={Chat}
          options={{ title: 'Chat' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
