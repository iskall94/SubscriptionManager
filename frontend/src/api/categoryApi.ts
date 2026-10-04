import axios from "axios";
import type { Category } from "../types/category";
import { getAuthHeader } from "./authApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function getCategories(): Promise<Category[]> {
  const response = await axios.get<Category[]>(
		`${API_BASE_URL}/categories`,
		getAuthHeader()
	);
  return response.data;
}