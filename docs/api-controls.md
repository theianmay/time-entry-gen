# API Rate Limiting & Cost Controls

## Overview

TimeCraft implements client-side rate limiting and cost controls to prevent API abuse and manage OpenAI costs.

---

## Rate Limits (Default)

| Time Window | Limit | Purpose |
|-------------|-------|---------|
| **Per Minute** | 10 requests | Prevent rapid-fire abuse |
| **Per Hour** | 60 requests | ~1 request per minute sustained |
| **Per Day** | 200 requests | Reasonable daily usage (~$0.06/day) |

---

## How It Works

### 1. Request Validation
Before each API call, the system checks:
- Requests in the last minute
- Requests in the last hour  
- Requests in the last 24 hours

If any limit is exceeded, the request is **automatically routed to fallback mode** instead of being rejected.

### 2. Request Logging
After each successful API call:
- Timestamp is recorded
- Estimated tokens used (~650 per request)
- Data stored in browser localStorage

### 3. Automatic Cleanup
- Requests older than 24 hours are automatically removed
- Storage is updated after each request

---

## Cost Estimation

### Token Usage
- **Average per request**: ~650 tokens
  - System prompt: ~500 tokens
  - User input: ~50 tokens
  - Output: ~100 tokens

### Pricing (GPT-4o-mini)
- **Input**: $0.15 per 1M tokens
- **Output**: $0.60 per 1M tokens
- **Average**: ~$0.30 per 1M tokens

### Daily Cost Examples

| Requests/Day | Tokens | Estimated Cost |
|--------------|--------|----------------|
| 50 | 32,500 | $0.01 |
| 100 | 65,000 | $0.02 |
| 200 (limit) | 130,000 | $0.04 |
| 500 | 325,000 | $0.10 |

**Maximum daily cost with default limits: ~$0.06**

---

## Usage Statistics

The system tracks:
- Requests in last minute
- Requests in last hour
- Requests in last 24 hours
- Total tokens used today
- Estimated cost today

### Accessing Stats (Developer Console)
```javascript
import { getUsageStatistics } from '@/lib/transformation-engine';

const stats = getUsageStatistics();
console.log(stats);
// {
//   requestsLastMinute: 2,
//   requestsLastHour: 15,
//   requestsLastDay: 45,
//   totalTokensToday: 29250,
//   estimatedCostToday: 0.008775
// }
```

---

## Customizing Rate Limits

### For Development/Testing
```typescript
// lib/rate-limiter.ts
const DEFAULT_RATE_LIMITS = {
  maxRequestsPerMinute: 20,  // Increase for testing
  maxRequestsPerHour: 120,
  maxRequestsPerDay: 500,
};
```

### For Production (Multi-User)
Consider moving to server-side with:
- Per-user rate limits
- API key rotation
- Database-backed tracking
- Admin dashboard

---

## Fallback Behavior

When rate limits are exceeded:
1. ✅ Request is **not rejected**
2. ✅ Automatically uses **fallback transformer**
3. ✅ User sees **fallback mode indicator**
4. ✅ Console shows reason and reset time
5. ✅ No error thrown to user

**Example console message:**
```
Rate limit exceeded: 10 requests per minute. Try again in 45 seconds.
```

---

## Best Practices

### For Personal Use (Current Setup)
- ✅ Default limits are conservative
- ✅ Costs stay under $2/month for typical usage
- ✅ Fallback ensures app always works
- ✅ No user-facing errors

### For Production (Future)
- Move rate limiting to server-side
- Implement per-user quotas
- Add usage dashboard
- Consider caching common requests
- Monitor costs with alerts

---

## Resetting Rate Limits

### Manual Reset (Developer Console)
```javascript
import { resetRateLimits } from '@/lib/transformation-engine';

resetRateLimits();
console.log('Rate limits reset');
```

### Automatic Reset
- Minute limits reset after 60 seconds
- Hour limits reset after 60 minutes
- Day limits reset after 24 hours

---

## Storage

Rate limit data is stored in **browser localStorage**:
- Key: `timecraft_rate_limit`
- Format: JSON array of request logs
- Persists across page refreshes
- Cleared when browser data is cleared

---

## Security Considerations

### Current (MVP)
- ✅ Client-side rate limiting prevents accidental abuse
- ⚠️ Can be bypassed by clearing localStorage
- ⚠️ API key exposed in browser (acceptable for personal use)

### Future Improvements
- Move API calls to server-side (Vercel Edge Functions)
- Keep API key server-side only
- Implement server-side rate limiting
- Add authentication for multi-user

---

## Monitoring

### Check Current Usage
Open browser console and run:
```javascript
localStorage.getItem('timecraft_rate_limit')
```

### View Parsed Data
```javascript
JSON.parse(localStorage.getItem('timecraft_rate_limit'))
```

---

## Troubleshooting

### "Rate limit exceeded" but I haven't used it much
- Check if localStorage has old data
- Reset rate limits manually
- Clear browser data

### Costs higher than expected
- Check usage statistics
- Review request logs in localStorage
- Consider lowering daily limit

### Always using fallback mode
- Check if rate limits are too restrictive
- Verify API key is valid
- Check browser console for errors

---

**Last Updated:** Phase 4 Complete  
**Status:** Implemented and tested
