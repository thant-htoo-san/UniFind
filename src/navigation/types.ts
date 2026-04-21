import { RouteNames } from './routeNames';

export type RootStackParamList = {
  [RouteNames.LANDING]: undefined;
  [RouteNames.LOGIN]: undefined;
  [RouteNames.MAIN_TABS]: undefined;
  [RouteNames.ITEM_DETAIL]: { itemId: string };
};

export type MainTabParamList = {
  [RouteNames.HOME]: undefined;
  [RouteNames.POST_ITEM]: undefined;
  [RouteNames.SEARCH]: undefined;
  [RouteNames.MESSAGES]: undefined;
};
