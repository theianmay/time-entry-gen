/**
 * Rate Limiter & Cost Controls
 * Prevents API abuse and controls OpenAI costs
 */

interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  maxRequestsPerDay: number;
}

interface RequestLog {
  timestamp: number;
  tokensUsed: number;
}

class RateLimiter {
  private requests: RequestLog[] = [];
  private config: RateLimitConfig;
  private readonly STORAGE_KEY = 'timecraft_rate_limit';

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.loadFromStorage();
  }

  /**
   * Check if a request is allowed based on rate limits
   */
  canMakeRequest(): { allowed: boolean; reason?: string; resetIn?: number } {
    this.cleanOldRequests();

    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const oneHourAgo = now - 60 * 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    // Count requests in each time window
    const requestsLastMinute = this.requests.filter(
      (r) => r.timestamp > oneMinuteAgo
    ).length;
    const requestsLastHour = this.requests.filter(
      (r) => r.timestamp > oneHourAgo
    ).length;
    const requestsLastDay = this.requests.filter(
      (r) => r.timestamp > oneDayAgo
    ).length;

    // Check minute limit
    if (requestsLastMinute >= this.config.maxRequestsPerMinute) {
      const oldestInMinute = Math.min(
        ...this.requests
          .filter((r) => r.timestamp > oneMinuteAgo)
          .map((r) => r.timestamp)
      );
      const resetIn = Math.ceil((oldestInMinute + 60 * 1000 - now) / 1000);
      return {
        allowed: false,
        reason: `Rate limit: ${this.config.maxRequestsPerMinute} requests per minute`,
        resetIn,
      };
    }

    // Check hour limit
    if (requestsLastHour >= this.config.maxRequestsPerHour) {
      const oldestInHour = Math.min(
        ...this.requests
          .filter((r) => r.timestamp > oneHourAgo)
          .map((r) => r.timestamp)
      );
      const resetIn = Math.ceil((oldestInHour + 60 * 60 * 1000 - now) / 1000);
      return {
        allowed: false,
        reason: `Rate limit: ${this.config.maxRequestsPerHour} requests per hour`,
        resetIn,
      };
    }

    // Check day limit
    if (requestsLastDay >= this.config.maxRequestsPerDay) {
      const oldestInDay = Math.min(
        ...this.requests
          .filter((r) => r.timestamp > oneDayAgo)
          .map((r) => r.timestamp)
      );
      const resetIn = Math.ceil((oldestInDay + 24 * 60 * 60 * 1000 - now) / 1000);
      return {
        allowed: false,
        reason: `Rate limit: ${this.config.maxRequestsPerDay} requests per day`,
        resetIn,
      };
    }

    return { allowed: true };
  }

  /**
   * Log a successful request
   */
  logRequest(tokensUsed: number = 650): void {
    this.requests.push({
      timestamp: Date.now(),
      tokensUsed,
    });
    this.saveToStorage();
  }

  /**
   * Get usage statistics
   */
  getUsageStats(): {
    requestsLastMinute: number;
    requestsLastHour: number;
    requestsLastDay: number;
    totalTokensToday: number;
    estimatedCostToday: number;
  } {
    this.cleanOldRequests();

    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const oneHourAgo = now - 60 * 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const requestsLastMinute = this.requests.filter(
      (r) => r.timestamp > oneMinuteAgo
    ).length;
    const requestsLastHour = this.requests.filter(
      (r) => r.timestamp > oneHourAgo
    ).length;
    const requestsLastDay = this.requests.filter(
      (r) => r.timestamp > oneDayAgo
    ).length;

    const totalTokensToday = this.requests
      .filter((r) => r.timestamp > oneDayAgo)
      .reduce((sum, r) => sum + r.tokensUsed, 0);

    // GPT-4o-mini pricing: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
    // Average: ~$0.30 per 1M tokens
    const estimatedCostToday = (totalTokensToday / 1_000_000) * 0.3;

    return {
      requestsLastMinute,
      requestsLastHour,
      requestsLastDay,
      totalTokensToday,
      estimatedCostToday,
    };
  }

  /**
   * Reset all rate limits (for testing or manual reset)
   */
  reset(): void {
    this.requests = [];
    this.saveToStorage();
  }

  /**
   * Remove requests older than 24 hours
   */
  private cleanOldRequests(): void {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.requests = this.requests.filter((r) => r.timestamp > oneDayAgo);
    this.saveToStorage();
  }

  /**
   * Save rate limit data to localStorage
   */
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.requests));
      } catch (err) {
        console.error('Failed to save rate limit data:', err);
      }
    }
  }

  /**
   * Load rate limit data from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          this.requests = JSON.parse(stored);
          this.cleanOldRequests();
        }
      } catch (err) {
        console.error('Failed to load rate limit data:', err);
        this.requests = [];
      }
    }
  }
}

// Default rate limits (conservative for personal use)
const DEFAULT_RATE_LIMITS: RateLimitConfig = {
  maxRequestsPerMinute: 10, // Prevent rapid-fire abuse
  maxRequestsPerHour: 60, // ~1 per minute sustained
  maxRequestsPerDay: 200, // Reasonable daily usage (~$0.06/day at 650 tokens/request)
};

// Singleton instance
let rateLimiterInstance: RateLimiter | null = null;

/**
 * Get the rate limiter instance
 */
export function getRateLimiter(config: RateLimitConfig = DEFAULT_RATE_LIMITS): RateLimiter {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new RateLimiter(config);
  }
  return rateLimiterInstance;
}

/**
 * Format time remaining for user display
 */
export function formatResetTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours !== 1 ? 's' : ''}`;
}
