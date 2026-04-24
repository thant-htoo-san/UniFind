import { NavigatorScreenParams } from '@react-navigation/native';
import { RouteNames } from './routeNames';

export type RootStackParamList = {
  [RouteNames.LANDING]: undefined;
  [RouteNames.LOGIN]: undefined;
  [RouteNames.MAIN_TABS]: NavigatorScreenParams<MainTabParamList> | undefined;
  [RouteNames.ITEM_DETAIL]: { itemId: string };
};

export type MainTabParamList = {
  [RouteNames.HOME]: undefined;
  [RouteNames.POST_ITEM]: undefined;
  [RouteNames.SEARCH]: undefined;
  [RouteNames.MESSAGES]: NavigatorScreenParams<MessagesStackParamList> | undefined;
};

export type MessagesStackParamList = {
  [RouteNames.MESSAGES]: undefined;
  [RouteNames.CHAT_DETAIL]: { conversationId: string; otherUserName: string };
};
