import * as React from 'react'
import MainContainer from './Pages/Navigation/mainContainer'

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; 


import ThreeApp from './Pages/Navigation/Views/PetScreen'
import HomeScreen from './Pages/Navigation/Views/HabitScreen';

const homeName = 'Home';
const threeName = '3d';

const tab = createBottomTabNavigator();

function App(){
  return(
    <NavigationContainer>
      <tab.Navigator
      initialRouteName={homeName}
      screenOptions={({route})=>({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName)
          {
            iconName = focused ? 'home' : 'home-outline'
          }
          else //this part needs to be changed
          {
            iconName = focused ? 'home' : 'home-outline'
          }

          return <Icon name={iconName} size={size} color={color}/>
        }
      })}
      
      >

        <tab.Screen name={homeName} component={HomeScreen}/>
        <tab.Screen name={threeName} component={ThreeApp}/>

      </tab.Navigator>
    </NavigationContainer>
  )
}

export default App;