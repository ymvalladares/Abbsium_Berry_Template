import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

//User
const UserDashboard = Loadable(lazy(() => import('views/userDashboard/Dashboard')));

//Content Creator
const Post = Loadable(lazy(() => import('views/content-creator/post')));
const SocialNetwork = Loadable(lazy(() => import('views/content-creator/socialNetwork')));
const ClippingsAgent = Loadable(lazy(() => import('views/content-creator/clippingAgent')));

//AI
const Ai = Loadable(lazy(() => import('views/ai/Ai')));

const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));

const MainRoutes = {
  path: '/platform',
  element: <MainLayout />,
  children: [
    { path: '', element: <UserDashboard /> },
    { path: 'dashboard', element: <UserDashboard /> },

    { path: 'color', element: <UtilsColor /> },
    { path: 'content/create-post', element: <Post /> },
    { path: 'content/clippings-agent', element: <ClippingsAgent /> },
    { path: 'content/social-networks', element: <SocialNetwork /> },

    { path: 'chat-ai', element: <Ai /> }
  ]
};

export default MainRoutes;
