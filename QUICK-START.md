# ⚡ QUICK REFERENCE - FUNERAL SITE

## 📍 Location
```
C:\Users\toche\funeral-site-production.zip
C:\Users\toche\funeral-site\
```

## 🎯 What to Do Now

### STEP 1: Get API Keys (10 min)

**Cloudflare Turnstile (FREE):**
1. Go to: https://dash.cloudflare.com/
2. Turnstile → Add site
3. Copy **Site Key** and **Secret Key**

**Resend Email (FREE):**
1. Go to: https://resend.com/
2. Sign up → API Keys → Create
3. Copy **API Key**

### STEP 2: Customize Site (15 min)

Open `index.html` and replace:

```html
Line 60:  data-sitekey="1x00000000000000000000AA"
          ↓
          data-sitekey="YOUR_TURNSTILE_SITE_KEY"

Line 9:   href="tel:+359888123456"
          ↓
          href="tel:+359XXXXXXXXX"

Lines 134-142: Update all contact info
```

### STEP 3: Add Image (5 min)

1. Get image (1920x1080px) from:
   - Unsplash.com (free)
   - Pexels.com (free)
   - Your photos

2. Convert to WebP:
   - Use https://squoosh.app/
   - Or: `sharp -i input.jpg -o hero.webp --webp quality=85`

3. Save as: `img/hero.webp`

### STEP 4: Deploy (20 min)

```bash
# 1. Install GitHub CLI (if needed)
winget install GitHub.cli

# 2. Navigate to project
cd C:\Users\toche\funeral-site

# 3. Initialize and push
git init
git add .
git commit -m "Initial deployment"
gh repo create funeral-site --public --source=. --push
```

**4. Connect Cloudflare Pages:**
- Dashboard → Pages → Create project
- Connect to Git → Select `funeral-site` repo
- Framework: None
- Build command: (empty)
- Output directory: `/`
- Click "Save and Deploy"

**5. Add Environment Variables:**
- Pages → Settings → Environment variables
- Add:
  ```
  TURNSTILE_SECRET = your_secret_key
  RESEND_API_KEY = re_xxxxxxxxxxxx
  NOTIFICATION_EMAIL = your@email.bg
  ```

**6. Create KV Namespace:**
```bash
npm install -g wrangler
wrangler login
wrangler kv:namespace create "KV"
```

- Copy namespace ID
- Pages → Settings → Functions → KV Namespace Bindings
- Variable name: `KV`
- Select your namespace

### STEP 5: Test (5 min)

1. Visit your `*.pages.dev` URL
2. Submit test form
3. Verify email received
4. Run Lighthouse test (F12 → Lighthouse)

---

## 🔧 Common Issues

**Form not working:**
- Check Turnstile site key in HTML
- Verify env vars in Cloudflare
- Check KV namespace binding name is "KV"

**Emails not arriving:**
- Verify Resend API key
- Check spam folder
- Review Resend dashboard logs

**Deployment fails:**
- Ensure all files committed to git
- Check Cloudflare Pages logs
- Verify no syntax errors in JS

---

## 📊 Expected Results

✅ Lighthouse: 100/100/100/100
✅ Load time: < 1 second
✅ Security grade: A+
✅ Mobile responsive: Perfect
✅ Cost: ~€2/month (domain only)

---

## 📞 Support Resources

- README.md - Full documentation
- DEPLOYMENT.md - Detailed checklist
- SECURITY.md - Security info
- Cloudflare Docs: https://developers.cloudflare.com/pages/

---

## 🎉 You're Done When:

- [ ] Site loads at your `*.pages.dev` URL
- [ ] Contact form sends emails
- [ ] Lighthouse shows 100s
- [ ] Mobile version looks good
- [ ] Security headers test passes

**Total time: ~1 hour**

---

Generated: 2024-12-06
Location: C:\Users\toche\funeral-site\
