import { Container, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";
import { useAuth } from "../context/useAuth";

export default function NotFoundPage() {
	const { isAuthenticated } = useAuth();

	const homePath = isAuthenticated ? "/dashboard" : "/";
	
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", py: 8 }}>
      <Box sx={{ mb: 2 }}>
        <ErrorIcon sx={{ fontSize: 54, color: "text.secondary" }}/>
      </Box>
      <Typography variant="h3" component="h2" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h3" gutterBottom color="text.secondary">
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        component={RouterLink}
        to={homePath}
        size="large"
      >
        Back to Homepage
      </Button>
    </Container>
  );
}