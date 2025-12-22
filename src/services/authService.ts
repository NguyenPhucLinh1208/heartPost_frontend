import { LoginCredentials, UserCreate } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/**
 * Handles the user login request.
 * @param credentials - The user's login credentials (email and password).
 * @returns The server response, typically containing the access token.
 */
const login = async (credentials: LoginCredentials) => {
  // FastAPI's OAuth2PasswordRequestForm expects form data, not JSON.
  const formData = new URLSearchParams();
  formData.append("username", credentials.email); // The form field is 'username', but we use email.
  formData.append("password", credentials.password);

  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login failed");
  }

  return response.json();
};

/**
 * Handles the user registration request.
 * @param userData - The new user's information.
 * @returns The newly created user's data.
 */
const register = async (userData: UserCreate) => {
  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Registration failed");
  }

  return response.json();
};

/**
 * Fetches the current user's profile using a valid access token.
 * @param token - The JWT access token.
 * @returns The current user's profile data.
 */
const getMe = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch user profile");
  }

  return response.json();
};


export const authService = {
  login,
  register,
  getMe,
};
