import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import type { UserRole } from "../../features/users/types";

interface RequireRoleProps {
  roles: UserRole[];
  redirectTo?: string;
}

export function RequireRole({ roles, redirectTo = "/" }: RequireRoleProps) {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user || !roles.includes(user.role as UserRole)) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
