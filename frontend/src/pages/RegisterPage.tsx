import { useState, type SubmitEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { loginUser, registerUser } from "../api/authApi";
import { useAuth } from "../context/useAuth";

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
		<section>
			<h2>Register Account</h2>

			{error && <p role="alert">{error}</p>}

			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="email">Email:</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
						required
						disabled={isLoading}
					/>
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete="new-password"
						required
						disabled={isLoading}
					/>
				</div>
				<div>
					<label htmlFor="confirmPassword">Confirm Password:</label>
					<input
						id="confirmPassword"
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						autoComplete="new-password"
						required
						disabled={isLoading}
					/>
				</div>
				<button type="submit" disabled={isLoading}>
					{isLoading ? "Registering..." : "Register"}
				</button>
			</form>
			<p>
				Already have an account? <Link to="/login">Log in here</Link>
			</p>
		</section>
	);
}