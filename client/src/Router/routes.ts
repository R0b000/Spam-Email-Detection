import { lazy, ComponentType, LazyExoticComponent } from 'react';

const Main = lazy(() => import('../pages/Main'));
const Emails = lazy(() => import('../components/Emails'));
const ViewEmail = lazy(() => import('../components/ViewEmail'));

export interface RouteConfig {
  path: string;
  element: LazyExoticComponent<ComponentType<any>>;
}

const routes: Record<string, RouteConfig> = {
  main: {
    path: '/',
    element: Main,
  },
  emails: {
    path: '/emails',
    element: Emails,
  },
  view: {
    path: '/view',
    element: ViewEmail,
  },
  invalid: {
    path: '/*',
    element: Emails,
  },
};

export { routes };