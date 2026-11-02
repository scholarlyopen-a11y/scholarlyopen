// Centralized Supabase Configuration & Sanitization
// Ensures resilient fallback to active project 'lfnwqbzcwticwdjowsmv' even if stale environment variables exist

export const ACTIVE_SUPABASE_PROJECT_ID = "lfnwqbzcwticwdjowsmv"
export const ACTIVE_SUPABASE_URL = "https://lfnwqbzcwticwdjowsmv.supabase.co"
export const ACTIVE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbndxYnpjd3RpY3dkam93c212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MzM5MDIsImV4cCI6MjEwOTAwOTkwMn0.tD9CHdYhRATOpOmPz2nHkMoZq86--ZuyuTyERxSL0ww"
export const ACTIVE_SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbndxYnpjd3RpY3dkam93c212Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzQzMzkwMiwiZXhwIjoyMTA5MDA5OTAyfQ.PWV1-blUTTsEzQjNKRAUa5AUlFttEoPcGWokk7GCAIM"

/**
 * Returns the active Supabase URL.
 * Automatically discards deprecated / paused project URLs (such as wrccglyypgxtuikrupkh)
 * that may still be configured in deployment environment variables.
 */
export function getActiveSupabaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  if (!envUrl || envUrl.includes("wrccglyypgxtuikrupkh") || !envUrl.includes(ACTIVE_SUPABASE_PROJECT_ID)) {
    return ACTIVE_SUPABASE_URL
  }
  return envUrl.replace(/\/+$/, "")
}

/**
 * Returns the active Supabase Service Role Key for server-side database and storage operations.
 */
export function getActiveSupabaseServiceKey(): string {
  const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!envKey || envKey.includes("wrccglyypgxtuikrupkh") || !envKey.includes(ACTIVE_SUPABASE_PROJECT_ID)) {
    return ACTIVE_SUPABASE_SERVICE_KEY
  }
  return envKey
}

/**
 * Returns the active Supabase Anon Key.
 */
export function getActiveSupabaseAnonKey(): string {
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!envKey || envKey.includes("wrccglyypgxtuikrupkh") || !envKey.includes(ACTIVE_SUPABASE_PROJECT_ID)) {
    return ACTIVE_SUPABASE_ANON_KEY
  }
  return envKey
}

