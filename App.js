
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import LoginAndSignUpScreen from './screens/LoginAndSignUpScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import { CurrentUserDataContext } from './CurrentUserDataContext';
import { ChatContextProvider } from './SelectedChatContext';
import { SelectedChatRoomContext } from './SelectedChatRoomContext';
import { SendPhotoContext } from './SendPhotoContext';
import Right from './screens/Right';


const Stack = createNativeStackNavigator()

export default function App() {

  const [currentUserData, setCurrentUserData] = useState()
  const [selectedChatRoom,  setSelectedChatRoom] = useState()
  const [sendPhoto,setSendPhoto] = useState(false)

  return (
    
    
    <NavigationContainer>
      <CurrentUserDataContext.Provider value={{currentUserData, setCurrentUserData}}>
      <SelectedChatRoomContext.Provider value={{ selectedChatRoom, setSelectedChatRoom }}>
      <SendPhotoContext.Provider value={{sendPhoto,setSendPhoto}}>
        <ChatContextProvider>
    
      <Stack.Navigator initialRouteName='LoginAndSignUpScreen' screenOptions={{
        // headerBackVisible:false
      }}>

        <Stack.Screen name="LoginAndSignUpScreen" component={LoginAndSignUpScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Right" component={Right} />
      </Stack.Navigator>
      </ChatContextProvider>
      </SendPhotoContext.Provider>
      </SelectedChatRoomContext.Provider>
      </CurrentUserDataContext.Provider>
    </NavigationContainer>
    

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
