import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const homePath = isAuthenticated ? "/dashboard" : "/";

  return (
    <nav>
      <div>
        <Link to={homePath}>Subscription Manager App</Link>
      </div>
      <ul>
        {isAuthenticated ? (
            <>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
            </>
            ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
        )}
      </ul>
    </nav>
  );
}