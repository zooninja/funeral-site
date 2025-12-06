# Funeral Site - Static Single Page

Production-ready funeral services website with security-first architecture.

## Features

- ✅ Single-page design (fast load < 1s)
- ✅ Security headers (CSP, HSTS, XSS protection)
- ✅ Cloudflare Turnstile CAPTCHA
- ✅ Rate limiting (5 req/hour per IP)
- ✅ Email notifications via Resend API
- ✅ Responsive design (mobile-first)
- ✅ SEO optimized (Schema.org markup)
- ✅ Zero database (serverless functions)

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Hosting:** Cloudflare Pages (FREE)
- **Functions:** Cloudflare Workers
- **Storage:** Cloudflare KV
- **Email:** Resend API (100 emails/day free)
- **Security:** Cloudflare Turnstile

## Project Structure

```
funeral-site/
├── index.html              # Main page
├── css/
│   └── style.min.css       # Styles
├── js/
│   └── main.min.js         # Client JS
├── img/                    # Images (add your own)
│   └── hero.webp           # Hero background
├── functions/
│   └── api/
│       └── contact.js      # Form handler
├── _headers                # Security headers
└── README.md
```

## Setup Instructions

### 1. Prerequisites

- GitHub account
- Cloudflare account (free)
- Resend account (free tier)

### 2. Get API Keys

**Cloudflare Turnstile:**
1. Go to https://dash.cloudflare.com/
2. Turnstile → Add Site
3. Copy Site Key and Secret Key

**Resend API:**
1. Go to https://resend.com/
2. Create account
3. API Keys → Create
4. Copy API key

### 3. Deploy to Cloudflare Pages

```bash
# 1. Initialize git
git init
git add .
git commit -m "Initial commit"

# 2. Push to GitHub
gh repo create funeral-site --public --source=. --remote=origin --push

# Or manually:
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/funeral-site.git
git branch -M main
git push -u origin main
```

### 4. Connect to Cloudflare Pages

1. Login to Cloudflare Dashboard
2. Pages → Create a project
3. Connect to Git → Select your repository
4. Build settings:
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: /
5. Click "Save and Deploy"

### 5. Configure Environment Variables

In Cloudflare Pages → Settings → Environment variables:

```
TURNSTILE_SECRET = your_turnstile_secret_key
RESEND_API_KEY = re_xxxxxxxxxxxxx
NOTIFICATION_EMAIL = your@email.bg
```

### 6. Create KV Namespace

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login
wrangler login

# Create KV namespace
wrangler kv:namespace create "KV"

# Note the ID, then add to Pages:
# Pages → Settings → Functions → KV Namespace Bindings
# Variable name: KV
# KV namespace: Select your namespace
```

### 7. Update Configuration

**In index.html:**
- Replace `1x00000000000000000000AA` with your Turnstile Site Key
- Update phone numbers, email, address
- Update company name

**Add Images:**
Place in `/img/` folder:
- `hero.webp` - Hero background (1920x1080px recommended)
- `favicon.svg` - Site icon

### 8. Custom Domain (Optional)

1. Pages → Custom domains → Set up a custom domain
2. Add your domain (e.g., `yourdomain.bg`)
3. Update DNS records as instructed

## Expected Performance

```
Lighthouse Scores:
  Performance: 100/100
  Accessibility: 100/100
  Best Practices: 100/100
  SEO: 100/100

Load Times:
  First Contentful Paint: < 0.5s
  Time to Interactive: < 1s
  Total Page Size: < 300KB

Security: A+ (securityheaders.com)
```

## Cost Breakdown

```yaml
Monthly Costs:
  Cloudflare Pages: €0 (unlimited bandwidth)
  Cloudflare Workers: €0 (100k requests/day free)
  Cloudflare KV: €0 (1GB + 100k reads/day free)
  Resend Email: €0 (100 emails/day free)
  Turnstile: €0 (1M verifications/month free)
  Domain (.bg): ~€20/year
  
Total: €1.67/month (domain only)
```

## Security Features

- ✅ Content Security Policy (CSP)
- ✅ HSTS with preload
- ✅ XSS Protection headers
- ✅ Clickjacking protection
- ✅ MIME type sniffing prevention
- ✅ Rate limiting (5 req/hour per IP)
- ✅ CAPTCHA verification
- ✅ Input sanitization
- ✅ No inline scripts (except schema)

## Maintenance

**Zero maintenance required** - fully static + serverless

**Monitoring:**
- Cloudflare Analytics (built-in, free)
- Email delivery logs in Resend dashboard
- Contact form submissions logged in KV (24h retention)

## Development

**Local Testing:**

```bash
# Install Wrangler
npm install -g wrangler

# Run local dev server with Functions support
wrangler pages dev .

# Access at http://localhost:8788
```

**Image Optimization:**

```bash
# Install sharp-cli
npm install -g sharp-cli

# Optimize images
sharp -i img/hero.jpg -o img/hero.webp --webp quality=85
sharp -i img/logo.png -o img/favicon.svg --svg
```

## Troubleshooting

**Form not submitting:**
1. Check Turnstile site key in `index.html`
2. Verify environment variables in Cloudflare Pages
3. Check KV namespace binding

**Emails not received:**
1. Verify Resend API key
2. Check sender domain verification
3. Review Resend logs

**Rate limit issues:**
1. KV namespace must be bound as "KV"
2. Check Cloudflare Functions logs

## Support

For issues, check:
- Cloudflare Pages logs
- Browser console (F12)
- Resend dashboard

## License

MIT License - Free to use and modify

---

**Created with security-first DevSecOps principles**
