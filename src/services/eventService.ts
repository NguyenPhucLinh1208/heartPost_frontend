import { EventCreate } from "@/types/event";
import { authService } from "./authService"; // To reuse the base URL and token logic

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/**
 * Fetches events for a given year.
 * @param token The user's JWT access token.
 * @param year The year to fetch events for.
 * @returns A list of event objects.
 */
const getEvents = async (token: string, year: number) => {
  const response = await fetch(`${API_BASE_URL}/events/?year=${year}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch events");
  }

  return response.json();
};

/**
 * Creates a new event for the user.
 * @param token The user's JWT access token.
 * @param eventData The data for the new event.
 * @returns The newly created event object.
 */
const createEvent = async (token: string, eventData: EventCreate) => {
  const response = await fetch(`${API_BASE_URL}/events/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to create event");
  }

  return response.json();
};

/**
 * Deletes a user's event.
 * @param token The user's JWT access token.
 * @param eventId The ID of the event to delete.
 */
const deleteEvent = async (token: string, eventId: string) => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to delete event");
  }

  // DELETE requests often return a 204 No Content, so no JSON to parse
  return true;
};


export const eventService = {
  getEvents,
  createEvent,
  deleteEvent,
};
