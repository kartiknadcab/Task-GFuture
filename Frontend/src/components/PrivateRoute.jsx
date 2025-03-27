import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ user, loading, children }) => {
  console.log(user, loading, children)
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;