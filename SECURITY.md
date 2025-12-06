# SECURITY DOCUMENTATION

## Security Architecture

This site implements defense-in-depth security with multiple layers:

### Layer 1: HTTP Security Headers

Configured in `_headers` file:

```
✓ Content Security Policy (CSP) - Prevents XSS attacks
✓ X-Frame-Options: DENY - Prevents clickjacking
✓ X-Content-Type-Options: nosniff - Prevents MIME sniffing
✓ Strict-Transport-Security (HSTS) - Forces HTTPS
✓ Referrer-Policy - Limits referrer information leakage
✓ Permissions-Policy - Restricts browser features
```

**Test:** https://securityheaders.com/

Expected Grade: **A+**

### Layer 2: Input Validation

**Client-side (js/main.min.js):**
- Name: Min 2 characters, XSS filtering
- Phone: Regex validation (10-15 digits)
- Email: RFC compliant regex
- Message: 500 char limit, HTML tag stripping

**Server-side (functions/api/contact.js):**
- All inputs sanitized with `replace(/[<>]/g, '')`
- Max length enforcement (500 chars)
- Type validation before processing
- Rejects malformed data with 400 status

### Layer 3: Bot Protection

**Cloudflare Turnstile:**
- Challenge before form submission
- Verifies on server before processing
- No tracking, privacy-friendly
- 1M free verifications/month

**Implementation:**
1. Client renders widget
2. User solves challenge
3. Token sent to server
4. Server verifies with Cloudflare API
5. Rejects if invalid

### Layer 4: Rate Limiting

**Per-IP limits:**
- 5 submissions per hour per IP
- Counter stored in Cloudflare KV
- Auto-expires after 1 hour
- Returns 429 (Too Many Requests) when exceeded

**Bypass protection:**
- IP from Cloudflare header (can't be spoofed)
- KV atomic operations prevent race conditions

### Layer 5: Data Handling

**Email transmission:**
- Sent via Resend API (TLS encrypted)
- No PII stored permanently
- 24-hour KV retention for debugging
- HTML email template prevents injection

**No database:**
- Zero SQL injection risk
- No stored credentials
- Stateless architecture

## Attack Surface Analysis

**Exposed endpoints:**
- `/` - Static HTML (read-only)
- `/api/contact` - POST only, rate limited
- Static assets (CSS, JS, images) - immutable

**Attack vectors mitigated:**

| Attack Type | Mitigation |
|-------------|------------|
| XSS (Cross-Site Scripting) | CSP headers + input sanitization |
| CSRF (Cross-Site Request Forgery) | Turnstile verification + SameSite cookies |
| SQL Injection | No database |
| Clickjacking | X-Frame-Options: DENY |
| MIME Confusion | X-Content-Type-Options: nosniff |
| DoS (Denial of Service) | Cloudflare CDN + rate limiting |
| Brute Force | Rate limiting + CAPTCHA |
| Email Injection | Input sanitization + safe HTML templating |

## Secrets Management

**Never commit:**
- ❌ TURNSTILE_SECRET
- ❌ RESEND_API_KEY
- ❌ Any API keys

**Environment variables:**
- Stored in Cloudflare Pages dashboard
- Encrypted at rest
- Access via IAM roles only
- Rotatable without code changes

## Compliance

**GDPR Considerations:**
- No cookies used (CAPTCHA doesn't set cookies)
- Minimal data collection (name, phone, email)
- 24h retention in KV
- No third-party tracking
- User IP logged for security only

**Data flow:**
1. User submits form
2. Data validated
3. Email sent immediately
4. 24h backup in KV (encrypted)
5. Auto-deleted after 24h

## Incident Response

**If compromised:**

1. **Rotate secrets immediately:**
   ```bash
   # Cloudflare Pages → Environment Variables
   # Generate new Turnstile keys
   # Generate new Resend API key
   ```

2. **Review logs:**
   - Cloudflare Pages logs
   - KV contact logs (24h window)
   - Resend email logs

3. **Block malicious IPs:**
   - Cloudflare WAF rules
   - Add to rate limit block list

## Security Checklist

- [x] HTTPS enforced (HSTS)
- [x] Security headers configured
- [x] Input validation (client + server)
- [x] CAPTCHA verification
- [x] Rate limiting implemented
- [x] No sensitive data in git
- [x] Dependencies minimal (zero npm packages in production)
- [x] CSP prevents inline scripts (except trusted schema)
- [x] Email injection protected
- [x] XSS protection enabled

## Monitoring

**Cloudflare Analytics tracks:**
- Traffic patterns
- Geographic distribution
- Attack attempts (visible in Firewall Events)

**Alerts to set up:**
- Unusual spike in form submissions
- High rate limit hits
- Failed Turnstile verifications

## Updates

**Dependencies:**
- Cloudflare Turnstile: Auto-updated by Cloudflare
- Resend API: Versioned, stable
- No npm dependencies in production

**Schedule:**
- Review security headers: Quarterly
- Test form security: Monthly
- Check for new CSP directives: Semi-annually

---

**Security Contact:** Report issues via GitHub Issues (private)
