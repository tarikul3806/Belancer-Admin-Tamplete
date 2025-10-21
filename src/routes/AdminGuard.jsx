import { Navigate, Outlet } from "react-router-dom";
import { isAdmin } from "../utils/auth";

export default function AdminGuard({ redirectTo = "/admin/login" }) {
    return isAdmin() ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
