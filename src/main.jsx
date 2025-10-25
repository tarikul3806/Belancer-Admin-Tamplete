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

const router = createBrowserRouter([
  { path: "/admin/login", element: <AdminLogin /> },
  {
    element: <AdminGuard />,
    children: [
      { path: "/", element: <App /> },
      {
        path: "/admin/gigs", element: (
          <Layout>
            <AllGigs />
          </Layout>
        )
      },
      {
        path: "/admin/projects", element: (
          <Layout>
            <AllProjects />
          </Layout>
        )
      },
      {
        path: "/admin/transaction", element: (
          <Layout>
            <Transaction />
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
