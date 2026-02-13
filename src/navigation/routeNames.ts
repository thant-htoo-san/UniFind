export const RouteNames = {
  LOGIN: 'Login',
  MAIN_TABS: 'MainTabs',
  HOME: 'Home',
  POST_ITEM: 'PostItem',
  SEARCH: 'Search',
  MESSAGES: 'Messages',
  ITEM_DETAIL: 'ItemDetail',
} as const;

export type RouteName = (typeof RouteNames)[keyof typeof RouteNames];
