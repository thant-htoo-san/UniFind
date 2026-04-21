export const RouteNames = {
  LANDING: 'Landing',
  LOGIN: 'Login',
  MAIN_TABS: 'MainTabs',
  HOME: 'Home',
  POST_ITEM: 'PostItem',
  SEARCH: 'Search',
  MESSAGES: 'Messages',
  ITEM_DETAIL: 'ItemDetail',
  CHAT_DETAIL: 'ChatDetail',
} as const;

export type RouteName = (typeof RouteNames)[keyof typeof RouteNames];
