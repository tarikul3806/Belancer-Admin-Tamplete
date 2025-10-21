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

const router = createBrowserRouter([
  { path: "/admin/login", element: <AdminLogin /> },
  {
    element: <AdminGuard />,
    children: [
      { path: "/", element: <App /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
