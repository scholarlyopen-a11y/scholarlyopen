/**
 * Anti-Spam and Bot Defense Protection Utilities
 * Protects forms from automated scrapers, spambots, and backscatter email loops.
 */

// In-memory sliding-window IP rate limiter
interface RateLimitEntry {
  count: number
  firstRequestTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()
const CLEANUP_INTERVAL_MS = 15 * 60 * 1000 // 15 minutes
let lastCleanup = Date.now()

function cleanupRateLimitMap() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.firstRequestTime > 30 * 60 * 1000) {
      rateLimitMap.delete(ip)
    }
  }
}

/**
 * Checks if an IP is rate limited
 * @param ip - Client IP address
 * @param limit - Maximum requests allowed in the window (default: 6)
 * @param windowMs - Time window in milliseconds (default: 10 minutes)
 */
export function checkRateLimit(ip: string, limit = 6, windowMs = 10 * 60 * 1000): { isLimited: boolean; remaining: number } {
  cleanupRateLimitMap()
  if (!ip || ip === "unknown" || ip === "127.0.0.1" || ip === "::1") {
    return { isLimited: false, remaining: limit }
  }

  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, firstRequestTime: now })
    return { isLimited: false, remaining: limit - 1 }
  }

  if (now - entry.firstRequestTime > windowMs) {
    rateLimitMap.set(ip, { count: 1, firstRequestTime: now })
    return { isLimited: false, remaining: limit - 1 }
  }

  entry.count += 1
  if (entry.count > limit) {
    return { isLimited: true, remaining: 0 }
  }

  return { isLimited: false, remaining: limit - entry.count }
}

/**
 * Extracts client IP from standard Next.js / Vercel / Cloudflare headers
 */
export function getClientIp(request: Request): string {
  const headers = request.headers
  const xForwardedFor = headers.get("x-forwarded-for")
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",").map((s) => s.trim())
    if (ips[0]) return ips[0]
  }
  const realIp = headers.get("x-real-ip") || headers.get("cf-connecting-ip")
  if (realIp) return realIp.trim()
  return "unknown"
}

// Known SMS-to-email gateways and high-risk spam/disposable domains
const BLOCKED_DOMAINS = [
  "vtext.com", // Verizon SMS gateway (causes Mailer-Daemon 550 bounces)
  "txt.att.net",
  "tmomail.net",
  "messaging.sprintpcs.com",
  "email.uscc.net",
  "mypixmessages.com",
  "mms.att.net",
  "vzwpix.com",
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "10minutemail.com",
  "trashmail.com",
  "yopmail.com",
  "sharklasers.com",
  "dispostable.com"
]

/**
 * Detects whether an email is a disposable domain, SMS gateway, or structurally invalid
 */
export function isSuspiciousEmail(email: string): boolean {
  if (!email || typeof email !== "string") return true
  const cleanEmail = email.toLowerCase().trim()

  // Must match basic RFC email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(cleanEmail)) return true

  const parts = cleanEmail.split("@")
  if (parts.length !== 2) return true
  const domain = parts[1]

  if (BLOCKED_DOMAINS.some((blocked) => domain === blocked || domain.endsWith("." + blocked))) {
    return true
  }

  return false
}

/**
 * Checks if a string looks like typical machine-generated bot gibberish
 * (e.g. "KotqjnWXNBDKxQhQ", "pkzlVnqmdeuTiXwFzWkRfHy", "wnztwdfuaSJAGYmunJh")
 */
export function isGibberish(text: string): boolean {
  if (!text || typeof text !== "string") return false
  const trimmed = text.trim()
  if (trimmed.length < 8) return false

  // If a single long token has >= 10 characters with zero spaces
  if (!trimmed.includes(" ") && trimmed.length >= 12) {
    // Check for high consonant density (e.g. "KotqjnWXNBDKxQhQ", "wnztwdfuaSJAGYmunJh")
    const consonants = trimmed.match(/[^aeiouAEIOU0-9\s]/g)?.length || 0
    const ratio = consonants / trimmed.length
    if (ratio > 0.82) return true

    // Check for weird high frequency uppercase/lowercase interspersing
    const upperCount = (trimmed.match(/[A-Z]/g) || []).length
    const lowerCount = (trimmed.match(/[a-z]/g) || []).length
    if (upperCount >= 4 && lowerCount >= 4 && upperCount / trimmed.length > 0.3) {
      // Rapid transitions between lower and upper case (camelCase/random case jitter)
      let caseTransitions = 0
      for (let i = 1; i < trimmed.length; i++) {
        const isPrevUpper = trimmed[i - 1] === trimmed[i - 1].toUpperCase() && /[A-Z]/.test(trimmed[i - 1])
        const isCurrUpper = trimmed[i] === trimmed[i].toUpperCase() && /[A-Z]/.test(trimmed[i])
        if (isPrevUpper !== isCurrUpper) caseTransitions++
      }
      if (caseTransitions >= 5) return true
    }
  }

  return false
}

export interface AntiSpamResult {
  isSpam: boolean
  reason?: string
  action: "proceed" | "silent_drop" | "reject"
}

/**
 * Validates a human verification client token
 */
export function isValidVerificationToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") return false
  try {
    const jsonStr = Buffer.from(token, "base64").toString("utf-8")
    const data = JSON.parse(jsonStr)
    if (!data || data.v !== "human_confirmed" || typeof data.t !== "number") {
      return false
    }
    const elapsed = Date.now() - data.t
    // Must be within last 2 hours
    if (elapsed < 0 || elapsed > 2 * 60 * 60 * 1000) {
      return false
    }
    return true
  } catch {
    return false
  }
}

/**
 * Comprehensive anti-spam validation for form submissions
 */
export function validateSubmissionAntiSpam({
  honeypot,
  formTimestamp,
  email,
  name,
  messageOrTitle,
  ip,
  verificationToken,
  requireVerification = false,
}: {
  honeypot?: string | null
  formTimestamp?: string | number | null
  email?: string | null
  name?: string | null
  messageOrTitle?: string | null
  ip?: string
  verificationToken?: string | null
  requireVerification?: boolean
}): AntiSpamResult {
  // 1. Honeypot check: If the hidden field has any content, a bot filled it
  if (honeypot && String(honeypot).trim().length > 0) {
    console.warn(`[AntiSpam] Honeypot triggered by IP ${ip}`)
    return { isSpam: true, reason: "Honeypot field filled", action: "silent_drop" }
  }

  // 2. Human verification token check
  if (requireVerification && !isValidVerificationToken(verificationToken)) {
    console.warn(`[AntiSpam] Missing or invalid human verification token from IP ${ip}`)
    return { isSpam: true, reason: "Human verification required", action: "reject" }
  }

  // 3. Form timestamp check (Time-to-Submit)
  if (formTimestamp) {
    const ts = typeof formTimestamp === "string" ? parseInt(formTimestamp, 10) : formTimestamp
    if (!isNaN(ts) && ts > 0) {
      const now = Date.now()
      const elapsedMs = now - ts

      // If submitted in under 1.8 seconds, it is virtually guaranteed to be an automated bot script
      if (elapsedMs < 1800) {
        console.warn(`[AntiSpam] Form submitted impossibly fast (${elapsedMs}ms) by IP ${ip}`)
        return { isSpam: true, reason: "Submission too fast", action: "silent_drop" }
      }

      // If form timestamp is older than 24 hours (stale or replay)
      if (elapsedMs > 24 * 60 * 60 * 1000) {
        console.warn(`[AntiSpam] Form timestamp expired (${elapsedMs}ms) by IP ${ip}`)
        return { isSpam: true, reason: "Form session expired", action: "silent_drop" }
      }
    }
  }

  // 4. Email check
  if (email && isSuspiciousEmail(email)) {
    console.warn(`[AntiSpam] Suspicious email domain: ${email} from IP ${ip}`)
    return { isSpam: true, reason: "Blocked/disposable email domain", action: "silent_drop" }
  }

  // 5. Gibberish heuristics
  if (name && isGibberish(name)) {
    console.warn(`[AntiSpam] Bot gibberish detected in name: ${name} from IP ${ip}`)
    return { isSpam: true, reason: "Gibberish pattern in name", action: "silent_drop" }
  }

  if (messageOrTitle && isGibberish(messageOrTitle)) {
    console.warn(`[AntiSpam] Bot gibberish detected in content: ${messageOrTitle.slice(0, 30)} from IP ${ip}`)
    return { isSpam: true, reason: "Gibberish pattern in message/title", action: "silent_drop" }
  }

  // 6. Rate limiting
  if (ip) {
    const { isLimited } = checkRateLimit(ip, 8, 10 * 60 * 1000)
    if (isLimited) {
      console.warn(`[AntiSpam] Rate limit exceeded for IP: ${ip}`)
      return { isSpam: true, reason: "Rate limit exceeded", action: "reject" }
    }
  }

  return { isSpam: false, action: "proceed" }
}
