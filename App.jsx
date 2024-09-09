import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainMenuScreen from './screens/MainMenuScreen';
import NewGameScreen from './screens/NewGameScreen';
import QuizScreen from './screens/QuizScreen';
// import { QuizProvider } from './context/context.js';

const Stack = createStackNavigator();

const App = () => {
  return (
    // <QuizProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainMenuScreen">
        <Stack.Screen 
          name="MainMenuScreen" 
          component={MainMenuScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="NewGameScreen" 
          component={NewGameScreen} 
          // options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="QuizScreen" 
          component={QuizScreen} 
          // options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
    // </QuizProvider>
  );
};

export default App;