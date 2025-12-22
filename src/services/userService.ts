import { UserUpdate } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/**
 * Updates the current user's profile.
 * @param payload - The user data to update.
 * @param token - The user's JWT access token.
 * @returns The updated user profile data.
 */
const updateProfile = async (payload: UserUpdate, token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Provide more specific error messages based on backend response
    if (errorData.detail.includes("Email already registered")) {
        throw new Error("Email này đã được sử dụng.");
    }
    if (errorData.detail.includes("Username already taken")) {
        throw new Error("Tên người dùng này đã được sử dụng.");
    }
    throw new Error(errorData.detail || "Cập nhật hồ sơ thất bại.");
  }

  return response.json();
};

export const userService = {
  updateProfile,
};
