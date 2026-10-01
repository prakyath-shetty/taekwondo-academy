import { Navigate } from 'react-router-dom';

/**
 * Legacy placeholder — redirects to the new Dashboard route.
 * Kept so any old links to /app fall through gracefully.
 */
const AppPlaceholder: React.FC = () => {
  return <Navigate to="/app" replace />;
};

export default AppPlaceholder;
