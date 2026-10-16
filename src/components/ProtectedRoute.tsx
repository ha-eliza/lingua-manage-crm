import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const currentUser = useAuthStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
