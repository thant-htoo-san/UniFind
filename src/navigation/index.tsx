import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RouteNames } from './routeNames';
import { RootStackParamList, MainTabParamList } from './types';
import LoginScreen from '../features/auth/screens/LoginScreen';
import HomeScreen from '../features/feed/screens/HomeScreen';
import PostItemScreen from '../features/post_item/screens/PostItemScreen';
import SearchScreen from '../features/search/screens/SearchScreen';
import MessagesScreen from '../features/messages/screens/MessagesScreen';
import ItemDetailScreen from '../features/item_detail/screens/ItemDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name={RouteNames.HOME} component={HomeScreen} />
      <Tab.Screen name={RouteNames.POST_ITEM} component={PostItemScreen} />
      <Tab.Screen name={RouteNames.SEARCH} component={SearchScreen} />
      <Tab.Screen name={RouteNames.MESSAGES} component={MessagesScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName={RouteNames.LOGIN}>
      <Stack.Screen
        name={RouteNames.LOGIN}
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={RouteNames.MAIN_TABS}
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={RouteNames.ITEM_DETAIL} component={ItemDetailScreen} />
    </Stack.Navigator>
  );
}
