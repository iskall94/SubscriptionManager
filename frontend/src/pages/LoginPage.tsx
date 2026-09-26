import {useState, type SubmitEvent} from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, Link as RouterLink} from "react-router-dom";
import { loginUser } from "../api/authApi";
import axios from "axios";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Link,
} from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
  	try 
		{
      const data = await loginUser({email, password});
      login(data.accessToken);
      navigate("/dashboard");
    } catch (err) {
			if (axios.isAxiosError(err) && err.response?.status === 401) {
				setError("Invalid email or password");
			} else {
				setError("An error occurred while logging in");
			} 
		} finally {
        setIsLoading(false);
  	}
  };

	return (
		<Container maxWidth="xs" sx={{ py: 6 }}>
			<Card variant="outlined">
				<CardContent sx={{ p: 3 }}>
					<Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
            Log In
          </Typography>

					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
					)}

					<form onSubmit={handleSubmit}>
						<Stack spacing={2}>
							<TextField
								label="Email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								autoComplete="email"
								fullWidth
								required
								disabled={isLoading}
							/>
							<TextField
								label="Password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="current-password"
								fullWidth
								required
								disabled={isLoading}
							/>
							<Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
						</Stack>
					</form>
					<Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Don't have an account?{" "}
            <Link component={RouterLink} to="/register">
              Register here
            </Link>
          </Typography>
				</CardContent>
			</Card>
		</Container>
	);
}