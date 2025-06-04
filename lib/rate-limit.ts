export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export function rateLimit(options: RateLimitOptions) {
  const requests = new Map<string, RateLimitEntry>();

  return {
    async check(request?: Request) {
      const now = Date.now();
      
      // Get client IP from request headers
      let clientIP = 'global';
      if (request) {
        clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                   request.headers.get('x-real-ip') ||
                   request.headers.get('cf-connecting-ip') ||
                   'unknown';
      }
      
      // Clean up expired entries
      for (const [key, entry] of requests) {
        if (now > entry.resetTime) {
          requests.delete(key);
        }
      }

      // Get or create entry for this IP
      const entry = requests.get(clientIP) || { count: 0, resetTime: now + options.windowMs };
      
      // Check if rate limit exceeded
      if (entry.count >= options.max && now < entry.resetTime) {
        const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000);
        throw new Error(`Rate limit exceeded. Try again in ${resetInSeconds} seconds.`);
      }
      
      // Reset counter if window expired
      if (now >= entry.resetTime) {
        entry.count = 0;
        entry.resetTime = now + options.windowMs;
      }
      
      // Increment counter
      entry.count++;
      requests.set(clientIP, entry);
    }
  };
}