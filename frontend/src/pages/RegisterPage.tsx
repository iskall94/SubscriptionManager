import { useState, type SubmitEvent } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { loginUser, registerUser } from "../api/authApi";
import { useAuth } from "../context/useAuth";
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

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { login } = useAuth();
	const navigate = useNavigate();
	
	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setIsLoading(true);

		try {
			await registerUser({ email, password });
			
			const loginData = await loginUser({ email, password });
			login(loginData.accessToken);
			navigate("/dashboard");

		} catch (err) {
			if (axios.isAxiosError(err)) {
				const errorDetail =
					err.response?.data?.detail ||
					err.response?.data?.error?.Password?.[0] ||
					"An error occurred while registering your account";
				setError(errorDetail);
			} else {
				setError("An unexpected error occurred");
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
            Register Account
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
								autoComplete="new-password"
								fullWidth
								required
								disabled={isLoading}
							/>
							<TextField
								label="Confirm Password"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								autoComplete="new-password"
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
								{isLoading ? "Registering..." : "Register"}
							</Button>
						</Stack>
					</form>

					<Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
						Already have an account?{" "}
						<Link component={RouterLink} to="/login">
							Log in here
						</Link>
					</Typography>
        </CardContent>
      </Card>
		</Container>
	);
}