import {useState, type SubmitEvent} from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import axios from "axios";

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
		<section>
			<h2>Log In</h2>

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
						autoComplete="current-password"
						required
						disabled={isLoading}
					/>
				</div>
				<button type="submit" disabled={isLoading}>
					{isLoading ? "Logging in..." : "Log In"}
				</button>
			</form>
			<p>
				Don't have an account? <Link to="/register">Register here</Link>
			</p>
		</section>
	);
}