// Types related to user authentication

/**
 * Credentials for the login form.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Data structure for creating a new user.
 * Based on the backend's UserCreate schema.
 */
export interface UserCreate {
  email: string;
  password: string;
  username?: string;
  full_name?: string;
  date_of_birth?: string; // YYYY-MM-DD
  hobbies?: string;
}

/**
 * The response from the /login endpoint.
 */
export interface Token {
  access_token: string;
  token_type: "bearer";
}

/**
 * Represents the public user profile data.
 * Based on the backend's UserResponse schema.
 */
export interface User {
  id: string; // UUID
  email: string;
  username?: string;
  full_name?: string;
  date_of_birth?: string;
  hobbies?: string;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}
