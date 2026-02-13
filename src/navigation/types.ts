import { RouteNames } from './routeNames';

export type RootStackParamList = {
  [RouteNames.LOGIN]: undefined;
  [RouteNames.MAIN_TABS]: undefined;
  [RouteNames.ITEM_DETAIL]: undefined;
};

export type MainTabParamList = {
  [RouteNames.HOME]: undefined;
  [RouteNames.POST_ITEM]: undefined;
  [RouteNames.SEARCH]: undefined;
  [RouteNames.MESSAGES]: undefined;
};
