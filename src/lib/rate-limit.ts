interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale records periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      const validTimestamps = record.timestamps.filter((ts) => now - ts < 60000);
      if (validTimestamps.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, { timestamps: validTimestamps });
      }
    }
  }, 300000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Simple sliding window rate limiter.
 * @param identifier IP or session identifier
 * @param limit Maximum requests allowed in window
 * @param windowMs Window duration in milliseconds (default 60,000ms = 1 min)
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(identifier) || { timestamps: [] };

  // Filter timestamps within the current window
  const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= limit) {
    const oldest = validTimestamps[0];
    const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  validTimestamps.push(now);
  rateLimitMap.set(identifier, { timestamps: validTimestamps });

  return {
    success: true,
    limit,
    remaining: limit - validTimestamps.length,
    resetSeconds: Math.ceil(windowMs / 1000),
  };
}
