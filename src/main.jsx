import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AdminLogin from './pages/AdminLogin.jsx';
import AdminGuard from './routes/AdminGuard.jsx';
import AllGigs from './pages/AllGigs.jsx';
import Layout from './component/Layout/Layout.jsx';
import AllProjects from './pages/AllProjects.jsx';
import Transaction from './pages/Transaction.jsx';
import Withdraw from './pages/Withdraw/Withdraw.jsx';
import AllUsers from './pages/Users/AllUsers.jsx';
import GigDetails from './pages/gig_details/GigDetails.jsx';
import ProjectDetails from './pages/project_details/ProjectDetails.jsx';
import Dispute from './pages/dispute/Dispute.jsx';

const router = createBrowserRouter([
  { path: "/admin/login", element: <AdminLogin /> },
  {
    element: <AdminGuard />,
    children: [
      { path: "/", element: <App /> },
      {
        path: "/admin/users", element: (
          <Layout>
            <AllUsers />
          </Layout>
        )
      },
      {
        path: "/admin/gigs", element: (
          <Layout>
            <AllGigs />
          </Layout>
        )
      },
      {
        path: "/admin/gigs/:gigId",
        element: <GigDetails />,
      },
      {
        path: "/admin/projects", element: (
          <Layout>
            <AllProjects />
          </Layout>
        )
      },
      {
        path: "/projects/:projectId",
        element: <ProjectDetails />,
      },
      {
        path: "/admin/transaction", element: (
          <Layout>
            <Transaction />
          </Layout>
        )
      },
      {
        path: "/admin/withdraw", element: (
          <Layout>
            <Withdraw />
          </Layout>
        )
      },
      {
        path: "/admin/dispute", element: (
          <Layout>
            <Dispute />
          </Layout>
        )
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
