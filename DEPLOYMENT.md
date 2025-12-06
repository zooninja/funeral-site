# DEPLOYMENT CHECKLIST

## Pre-Deployment

- [ ] Update `index.html`:
  - [ ] Replace Turnstile site key (line 60)
  - [ ] Update phone numbers (lines 9, 124, 134)
  - [ ] Update email addresses (lines 136, schema)
  - [ ] Update company name and address (lines 140-142)
  - [ ] Update Schema.org data (lines 36-53)

- [ ] Add images to `/img/`:
  - [ ] `hero.webp` (1920x1080px, optimized)
  - [ ] Optimize using: `sharp -i input.jpg -o img/hero.webp --webp quality=85`

- [ ] Test locally:
  ```bash
  npm install -g wrangler
  wrangler pages dev .
  # Visit http://localhost:8788
  ```

## API Setup

- [ ] Cloudflare Turnstile:
  - [ ] Create site at https://dash.cloudflare.com/
  - [ ] Get Site Key → Update in `index.html`
  - [ ] Get Secret Key → Add to Pages env vars

- [ ] Resend Email:
  - [ ] Sign up at https://resend.com/
  - [ ] Create API key
  - [ ] Verify domain (optional, or use resend.dev)

## Cloudflare Pages Deployment

- [ ] Push to GitHub:
  ```bash
  git init
  git add .
  git commit -m "Initial deployment"
  gh repo create funeral-site --public --source=. --push
  ```

- [ ] Connect Cloudflare Pages:
  - [ ] Dashboard → Pages → Create project
  - [ ] Connect Git → Select repository
  - [ ] Framework: None
  - [ ] Build command: (empty)
  - [ ] Build output: /
  - [ ] Deploy

- [ ] Environment Variables (Pages → Settings → Environment variables):
  ```
  TURNSTILE_SECRET = cf_secret_xxxxxx
  RESEND_API_KEY = re_xxxxxxxxxx
  NOTIFICATION_EMAIL = your@email.bg
  ```

- [ ] KV Namespace:
  ```bash
  wrangler kv:namespace create "KV"
  # Copy namespace ID
  # Pages → Settings → Functions → KV Namespace Bindings
  # Variable: KV, Namespace: Select from dropdown
  ```

## Post-Deployment

- [ ] Test form submission
- [ ] Verify email delivery
- [ ] Check Cloudflare Analytics
- [ ] Run Lighthouse audit (target: 100/100/100/100)
- [ ] Test security headers: https://securityheaders.com/
- [ ] Test mobile responsiveness
- [ ] Verify Schema.org markup: https://validator.schema.org/

## Custom Domain (Optional)

- [ ] Pages → Custom domains
- [ ] Add domain
- [ ] Update DNS records (CNAME to pages.dev)
- [ ] Wait for SSL provisioning (~5 min)

## Monitoring Setup

- [ ] Enable Cloudflare Web Analytics (Pages → Analytics)
- [ ] Configure Resend webhook (optional)
- [ ] Set up uptime monitoring (e.g., UptimeRobot)

## Security Verification

- [ ] Test rate limiting (5 submissions in 1 hour)
- [ ] Verify CAPTCHA works
- [ ] Check CSP headers in browser DevTools
- [ ] Test form validation (client + server)

## Performance Optimization

- [ ] Compress images (WebP format)
- [ ] Minify CSS/JS (optional, already minimal)
- [ ] Enable Cloudflare Auto Minify
- [ ] Enable Brotli compression (automatic)

## Backup & Recovery

- [ ] GitHub repository is your backup
- [ ] KV logs retain contact forms for 24h
- [ ] Resend dashboard has email logs (30 days)

---

## Estimated Timeline

- Setup: 30 minutes
- Testing: 15 minutes
- Deployment: 10 minutes
- **Total: ~1 hour**

## Cost Reminder

- Cloudflare Pages: FREE
- Cloudflare Workers: FREE (100k req/day)
- KV Storage: FREE (1GB)
- Resend: FREE (100 emails/day)
- Turnstile: FREE (1M verifications/month)
- **Domain only: €20/year**
