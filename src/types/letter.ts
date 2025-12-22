import { User } from "./auth";

// Based on backend schemas

export interface LetterPage {
    id: string;
    letter_id: string;
    page_number: number;
    image_key: string;
    created_at: string;
    image_url: string; // Add presigned URL field
}

export interface LetterRecipient {
    id: string;
    letter_id: string;
    recipient_user_id?: string | null;
    recipient_email?: string | null;
    recipient_display_name: string;
    status: string;
    read_at?: string | null;
    created_at: string;
    recipient_user?: User | null;
}

export interface Letter {
    id: string;
    sender_id: string;
    sender_display_name?: string | null;
    paper_template_id?: string | null;
    custom_paper_key?: string | null;
    custom_envelope_key?: string | null;
    status: 'draft' | 'scheduled' | 'sent' | 'delivered' | 'read';
    occasion?: string | null;
    password_hint?: string | null;
    envelope_flap_color?: string | null;
    view_token?: string | null;
    sent_at?: string | null;
    read_at?: string | null;
    created_at: string;
    updated_at: string;
    pages: LetterPage[];
    recipients: LetterRecipient[];
    // Add presigned URL fields
    custom_paper_url?: string | null;
    custom_envelope_url?: string | null;
    // Add other relations if needed
}

export interface LetterUpdate {
    paper_template_id?: string | null;
    sender_display_name?: string | null;
    occasion?: string | null;
    open_password?: string | null;
    password_hint?: string | null;
    envelope_flap_color?: string | null;
}

export interface LetterRecipientCreate {
    recipient_user_id?: string | null;
    recipient_email?: string | null;
    recipient_username?: string | null; // Added this line
    recipient_display_name: string;
}
