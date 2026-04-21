import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MessageCircle, PlusSquare, Search as SearchIcon } from 'lucide-react-native';
import { RouteNames } from './routeNames';
import { RootStackParamList, MainTabParamList } from './types';
import LandingScreen from '../features/auth/screens/LandingScreen';
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
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: { height: 64, paddingVertical: 8 },
        tabBarIcon: ({ color, size }) => {
          if (route.name === RouteNames.HOME) return <Home color={color} size={size} />;
          if (route.name === RouteNames.POST_ITEM) return <PlusSquare color={color} size={size} />;
          if (route.name === RouteNames.SEARCH) return <SearchIcon color={color} size={size} />;
          if (route.name === RouteNames.MESSAGES) return <MessageCircle color={color} size={size} />;
          return null;
        },
      })}
    >
      <Tab.Screen name={RouteNames.HOME} component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name={RouteNames.POST_ITEM} component={PostItemScreen} options={{ title: 'Post' }} />
      <Tab.Screen name={RouteNames.SEARCH} component={SearchScreen} options={{ title: 'Search' }} />
      <Tab.Screen name={RouteNames.MESSAGES} component={MessagesScreen} options={{ title: 'Messages' }} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName={RouteNames.LANDING}>
      <Stack.Screen
        name={RouteNames.LANDING}
        component={LandingScreen}
        options={{ headerShown: false }}
      />
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
      <Stack.Screen name={RouteNames.ITEM_DETAIL} component={ItemDetailScreen} options={{ title: 'Item Detail' }} />
    </Stack.Navigator>
  );
}
