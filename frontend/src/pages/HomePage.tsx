import { Navigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { 
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Alert,
  Link
} from "@mui/material";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
	return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Subscription Manager App
          </Typography>

          <Stack spacing={2} sx={{ my: 3 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Today, people have multiple subscriptions for various services, such as streaming platforms, software tools, and more. Keeping track of all these subscriptions can be overwhelming and time-consuming.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Managing these subscriptions can be a hassle, but our app makes it easy to keep track of all your subscriptions in one place.
            </Typography>
          </Stack>

          <Alert severity="info" sx={{ textAlign: 'left', mt: 3 }}>
            Please make sure to{' '}
            <Link component={RouterLink} to="/register" sx={{ fontWeight: 'bold' }}>
              register an account
            </Link>{' '}
            so all your subscriptions can be saved and managed securely.
          </Alert>
        </CardContent>
      </Card>
    </Container>
  );
}