// Types related to Events, based on backend schemas

export interface Event {
    id: string; // UUID
    user_id: string | null; // UUID or null for global events
    letter_id: string | null; // UUID
    title: string;
    event_date: string; // ISO 8601 date string
    created_at: string; // ISO 8601 date string
}

export interface EventCreate {
    title: string;
    event_date: string; // YYYY-MM-DD or full ISO string
    letter_id?: string | null;
}
