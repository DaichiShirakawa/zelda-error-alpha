import * as React from 'react';
import * as Loadable from 'react-loadable';

function Loading(): any {
  return <div>Loading...</div>;
}

const HelloPage = Loadable({
  loader: () => import('./views/HelloPage'),
  loading: Loading,
} as any);

const AnotherPage = Loadable({
  loader: () => import('./views/AnotherPage'),
  loading: Loading,
} as any);

const AppRoutes = [
  {path: '/', exact: true, name: 'HelloPageName', component: HelloPage},
  {path: '/another', name: 'AnotherPageName', component: AnotherPage},
];

export default AppRoutes;
