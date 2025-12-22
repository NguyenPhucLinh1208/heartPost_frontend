import { LetterUpdate, LetterRecipientCreate } from "@/types/letter";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const letterService = {
    /**
     * Creates a new draft letter.
     */
    createDraft: async (token: string) => {
        const response = await fetch(`${API_BASE_URL}/letters/`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to create draft");
        return response.json();
    },

    /**
     * Updates a draft letter with new details.
     */
    update: async (letterId: string, data: Partial<LetterUpdate>, token: string) => {
        const response = await fetch(`${API_BASE_URL}/letters/${letterId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Unauthorized");
            }
            const err = await response.json().catch(() => ({ detail: "An unknown error occurred during update." }));
            throw { status: response.status, ...err };
        }
        return response.json();
    },

    /**
     * Uploads a custom file (paper or envelope).
     */
    uploadAsset: async (letterId: string, assetType: 'custom-paper' | 'custom-envelope', file: File, token: string) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${API_BASE_URL}/letters/${letterId}/${assetType}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        if (!response.ok) throw new Error(`Failed to upload ${assetType}`);
        return response.json();
    },

    /**
     * Adds a new page to the letter by uploading and processing an image.
     */
    addPage: async (letterId: string, pageNumber: number, file: File, token: string) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("page_number", pageNumber.toString());
        const response = await fetch(`${API_BASE_URL}/letters/${letterId}/pages`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({ detail: "An unknown error occurred during page addition." }));
            throw { status: response.status, ...err };
        }
        return response.json();
    },

    /**
     * Finalizes and sends the letter.
     */
    send: async (letterId: string, recipients: LetterRecipientCreate[], details: Partial<LetterUpdate>, token: string) => {
        const response = await fetch(`${API_BASE_URL}/letters/${letterId}/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                recipients: recipients,
                details: details,
            }),
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({ detail: "An unknown error occurred during send." }));
            throw { status: response.status, ...err };
        }
        return response.json();
    },

    /**
     * Schedules a letter to be sent at a future date.
     */
    schedule: async (letterId: string, recipients: LetterRecipientCreate[], details: Partial<LetterUpdate>, scheduledAt: string, token: string) => {
        const response = await fetch(`${API_BASE_URL}/letters/${letterId}/schedule`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                recipients: recipients,
                details: details,
                scheduled_at: scheduledAt,
            }),
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({ detail: "An unknown error occurred during schedule." }));
            throw { status: response.status, ...err };
        }
        return response.json();
    },

    /**
     * Fetches a letter using its public view token. No auth required.
     */
    getPublicLetter: async (token: string) => {
        const response = await fetch(`${API_BASE_URL}/letters/view/${token}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Letter not found");
            }
            throw new Error("Failed to fetch letter");
        }
        return response.json();
    },

    /**
     * Verifies the password for a protected letter.
     */
    verifyPassword: async (token: string, password: string): Promise<boolean> => {
        const response = await fetch(`${API_BASE_URL}/letters/verify-password/${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });
        if (!response.ok) {
            // For a 403 Forbidden, we can assume it's an incorrect password.
            // For other errors, it's a server issue.
            if (response.status === 403) {
                return false;
            }
            throw new Error("Password verification failed");
        }
        const result = await response.json();
        return result.correct === true;
    },

    /**
     * Deletes a draft letter.
     */
    deleteLetter: async (letterId: string, token: string): Promise<boolean> => {
        const response = await fetch(`${API_BASE_URL}/letters/${letterId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.ok;
    }
};

export default letterService;
