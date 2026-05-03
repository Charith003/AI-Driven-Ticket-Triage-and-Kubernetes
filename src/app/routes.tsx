import { createBrowserRouter } from 'react-router';
import { LoginPage } from './pages/login-page';
import { AdminLoginPage } from './pages/admin-login-page';
import { DashboardLayout } from './components/dashboard-layout';
import { AdminDashboardLayout } from './components/admin-dashboard-layout';
import { DashboardPage } from './pages/dashboard-page';
import { AdminDashboardPage } from './pages/admin-dashboard-page';
import { SubmitComplaintPage } from './pages/submit-complaint-page';
import { TrackStatusPage } from './pages/track-status-page';
import { HistoryPage } from './pages/history-page';
import { Redirect } from './components/redirect';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage,
  },
  {
    path: '/admin/login',
    Component: AdminLoginPage,
  },
  {
    path: '/app',
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'submit', Component: SubmitComplaintPage },
      { path: 'status', Component: TrackStatusPage },
      { path: 'history', Component: HistoryPage },
      { path: 'admin', Component: () => <Redirect to="/admin/dashboard" /> },
      { path: '*', Component: () => <Redirect to="/app" /> },
    ],
  },
  {
    path: '/admin',
    Component: AdminDashboardLayout,
    children: [
      { 
        index: true, 
        Component: () => <Redirect to="/admin/dashboard" />
      },
      { path: 'dashboard', Component: AdminDashboardPage },
    ],
  },
  {
    path: '*',
    Component: () => <Redirect to="/" />,
  },
]);
