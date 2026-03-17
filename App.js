import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './screens/MainScreen';
import GalleryScreen from './screens/GalleryScreen';
import CameraScreen from './screens/CameraScreen';
import BigPhoto from './screens/BigPhoto';
import MapScreen from './screens/MapScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainScreen">
        <Stack.Screen name="MainScreen" component={MainScreen} options={{
          title: 'Camera App', headerStyle: {
            backgroundColor: '#080A0D',
          },
          headerTintColor: '#41A66C'
        }} />
        <Stack.Screen name="GalleryScreen" component={GalleryScreen} options={{
          title: 'Gallery', headerStyle: {
            backgroundColor: '#080A0D',
          },
          headerTintColor: '#41A66C',
        }} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BigPhoto" component={BigPhoto} options={{
          title: 'Photo', headerStyle: {
            backgroundColor: '#080A0D',
          },
          headerTintColor: '#41A66C',
        }} />
        <Stack.Screen name="MapScreen" component={MapScreen} options={{
          title: 'Map', headerStyle: {
            backgroundColor: '#080A0D',
          },
          headerTintColor: '#41A66C',
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
