import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
	return (
    <section>
      <h1>Welcome to the Subscription Manager App</h1>
        <p>
          Today a lot of people have subscriptions for various services like Netflix, Spotify, and more.
        </p>
        <p>
          Managing these subscriptions can be a hassle, but our app makes it easy to keep track of all your subscriptions in one place.
        </p>
    </section>
  );
}