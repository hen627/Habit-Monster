import * as React from 'react'
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';



import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';



import ThreeApp from './Pages/Navigation/Views/PetScreen'
import HomeScreen from './Pages/Navigation/Views/HabitScreen/HabitScreen';

const Tab = createMaterialBottomTabNavigator();

function App(){
  return(
  <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Feed"
        activeColor="#FF474C"
        labelStyle={{ fontSize: 12 }}
        style={{ backgroundColor: '#FFFFFF' }}
        barStyle={{
          height: '10%', 
          justifyContent: 'center',
          backgroundColor: '#111827',}}
      >
        <Tab.Screen
          name="Feed"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={25} />
            ),
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={ThreeApp}
          options={{
            tabBarLabel: 'Pets',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="bell" color={color} size={25} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  </GestureHandlerRootView>
  )
}

export default App;