import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

// Create a singleton Supabase client for the frontend
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// API base URL for server endpoints
export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d0140d55`;
