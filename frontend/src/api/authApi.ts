import axios from "axios";
import type { LoginRequest, LoginResponse } from "../types/auth";

const API_BASE_URL = '/api';

export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}/login`, 
        credentials
    );
    return response.data;
}