import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

// Create a singleton Supabase client for the frontend
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// API base URL for server endpoints
export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d0140d55`;

// Helper to call the API with proper auth headers
export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  // Anon key for Supabase gateway auth
  headers.set("Authorization", `Bearer ${publicAnonKey}`);

  return fetch(`${API_BASE_URL}${path}`, { ...options, headers });
}

// Upload image via Edge Function (uses service role key, no RLS issues)
export async function uploadImage(file: File): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated - please log in first");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/upload-image`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${publicAnonKey}`,
      "x-user-token": session.access_token,
    },
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Upload failed");
  }

  const data = await res.json();
  return data.url;
}

// Proxy upload: fetch external image URL via Edge Function and store it
export async function proxyUploadImage(imageUrl: string): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE_URL}/proxy-upload-image`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${publicAnonKey}`,
      "x-user-token": session.access_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: imageUrl }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Proxy upload failed");
  }

  const data = await res.json();
  return data.url;
}

// Helper for authenticated API calls (includes user token)
export async function apiFetchAuth(path: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${publicAnonKey}`);
  headers.set("x-user-token", session.access_token);

  return fetch(`${API_BASE_URL}${path}`, { ...options, headers });
}
