import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QuizProvider } from './context/context.js';
import MainMenuScreen from './screens/MainMenuScreen';
import DailyQuizScreen from './screens/DailyQuizScreen.jsx';
import NewGameScreen from './screens/NewGameScreen';
import QuizScreen from './screens/QuizScreen';
import QuizGeniusScreen from './screens/QuizGeniusScreen.jsx'
import QuizExpertScreen from './screens/QuizExpertScreen.jsx';
import AlbumScreen from './screens/AlbumScreen.jsx';
import StoreScreen from './screens/StoreScreen.jsx';
import ResultsScreen from './screens/ResultsScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';

const Stack = createStackNavigator();

const App = () => {
  return (
    <QuizProvider>
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
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="DailyQuizScreen" 
          component={DailyQuizScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="QuizScreen" 
          component={QuizScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="QuizGeniusScreen" 
          component={QuizGeniusScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="QuizExpertScreen" 
          component={QuizExpertScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AlbumScreen" 
          component={AlbumScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="StoreScreen" 
          component={StoreScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ResultsScreen" 
          component={ResultsScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SettingsScreen" 
          component={SettingsScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
    </QuizProvider>
  );
};

export default App;