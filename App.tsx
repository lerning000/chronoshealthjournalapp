/**
 * ChronosApp
 * Main navigation container with bottom tabs
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import JournalScreen from './JournalScreen';
import PastEntriesScreen from './PastEntriesScreen';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              backgroundColor: '#0A0A0A',
              borderTopColor: '#333333',
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarActiveTintColor: '#FFFFFF',
            tabBarInactiveTintColor: '#888888',
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
              fontFamily: 'Alegreya-Regular',
              letterSpacing: 0.5,
            },
            headerStyle: {
              backgroundColor: '#0A0A0A',
              borderBottomColor: '#333333',
              borderBottomWidth: 1,
            },
            headerTitleStyle: {
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: '700',
              fontFamily: 'Alegreya-Regular',
              letterSpacing: 0.3,
            },
            headerTintColor: '#FFFFFF',
          }}
        >
          <Tab.Screen
            name="Journal"
            component={JournalScreen}
            options={{
              title: 'Journal',
              headerTitle: 'JOURNAL',
            }}
          />
          <Tab.Screen
            name="History"
            component={PastEntriesScreen}
            options={{
              title: 'History',
              headerTitle: 'HISTORY',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;