import fs from "fs"
import path from "path"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lfnwqbzcwticwdjowsmv.supabase.co"
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbndxYnpjd3RpY3dkam93c212Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzQzMzkwMiwiZXhwIjoyMTA5MDA5OTAyfQ.PWV1-blUTTsEzQjNKRAUa5AUlFttEoPcGWokk7GCAIM"

const BUCKET = "editorial360_data"

// Global memory cache to prevent rapid repeated network requests and save bandwidth
interface CacheEntry {
  data: any
  timestamp: number
}
const memoryCache: Record<string, CacheEntry> = {}
const CACHE_TTL_MS = 20000 // 20 seconds in-memory cache

// Circuit breaker for restricted Supabase instance (e.g. 402 Egress Exceeded or 429)
let lastRestrictedTime = 0
const RESTRICTION_COOLDOWN_MS = 60000 // 1 minute cooldown

export function isCloudRestricted(): boolean {
  return Date.now() - lastRestrictedTime < RESTRICTION_COOLDOWN_MS
}

export function markCloudRestricted() {
  lastRestrictedTime = Date.now()
}

/**
 * Reads JSON dataset from in-memory cache, Cloud Storage, or local disk fallback
 */
export async function readEditorialData<T>(fileName: string, fallbackDefault: T): Promise<T> {
  const now = Date.now()
  const cached = memoryCache[fileName]

  // 1. Serve from in-memory cache if fresh
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as T
  }

  const localFilePath = path.join(process.cwd(), "lib", "data", fileName)

  // 2. If Supabase is restricted, skip network call entirely and load from local disk
  if (isCloudRestricted()) {
    const localData = readLocalFile<T>(localFilePath, fallbackDefault)
    memoryCache[fileName] = { data: localData, timestamp: now }
    return localData
  }

  // 3. Try reading from Supabase Cloud Storage (WITHOUT cache-busting timestamp to avoid egress spikes)
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`, {
      cache: "default",
      headers: {
        "Accept": "application/json"
      }
    })

    if (res.ok) {
      const data = await res.json()
      if (data !== undefined && data !== null) {
        memoryCache[fileName] = { data, timestamp: now }
        // Keep local fallback file synchronized
        saveLocalFile(localFilePath, data)
        return data as T
      }
    } else {
      if (res.status === 402 || res.status === 429) {
        markCloudRestricted()
      }
    }
  } catch (err) {
    // If Supabase project is paused (DNS lookup fails) or network down, mark restricted to avoid stalling
    markCloudRestricted()
    console.warn(`Supabase storage read error for ${fileName}, falling back to local:`, err)
  }

  // 4. Fallback to local file
  const localData = readLocalFile<T>(localFilePath, fallbackDefault)
  memoryCache[fileName] = { data: localData, timestamp: now }
  return localData
}

/**
 * Saves JSON dataset to memory cache, local disk, and attempts Cloud Storage sync
 */
export async function writeEditorialData<T>(fileName: string, data: T): Promise<boolean> {
  const now = Date.now()
  memoryCache[fileName] = { data, timestamp: now }

  const localFilePath = path.join(process.cwd(), "lib", "data", fileName)
  const localOk = saveLocalFile(localFilePath, data)

  // Sync to Supabase Cloud Storage if not restricted
  if (!isCloudRestricted()) {
    try {
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fileName}`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
          "x-upsert": "true"
        },
        body: JSON.stringify(data)
      })

      if (!res.ok && (res.status === 402 || res.status === 429)) {
        markCloudRestricted()
      }
    } catch (err) {
      markCloudRestricted()
      console.warn(`Supabase storage write error for ${fileName}:`, err)
    }
  }

  return localOk
}

function readLocalFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8")
      return JSON.parse(raw) as T
    }
  } catch (e) {
    console.warn(`Could not read local file ${filePath}:`, e)
  }
  return fallback
}

function saveLocalFile(filePath: string, data: any): boolean {
  try {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")
    return true
  } catch (e) {
    console.warn(`Could not save local file ${filePath}:`, e)
    return false
  }
}
