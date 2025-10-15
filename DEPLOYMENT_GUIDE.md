# 🚀 Deployment Guide: Madison Vet Finder to Vercel

## Quick Deploy (5 minutes)

### Step 1: Push to GitHub

1. Go to [GitHub](https://github.com/new) and create a new repository
2. Name it: `madison-vet-finder`
3. Keep it **Private** (recommended) or Public
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

6. Copy the commands GitHub shows you, but use these instead:

```bash
cd /home/code/vet-directory
git remote add origin https://github.com/YOUR_USERNAME/madison-vet-finder.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com/signup) and sign up/login (use GitHub login for easiest setup)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your `madison-vet-finder` repository
5. Vercel will auto-detect it's a Next.js app ✅

### Step 3: Add Environment Variables

Before clicking "Deploy", add these environment variables:

Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key_here
RESEND_API_KEY = your_resend_api_key_here
```

**Where to find these values:**
- Supabase URL & Key: Go to your Supabase project → Settings → API
- Resend API Key: Go to Resend dashboard → API Keys

### Step 4: Deploy!

Click **"Deploy"** and wait 2-3 minutes ⏱️

### Step 5: Connect Custom Domain (madisonvetfinder.com)

1. Once deployed, go to your project settings in Vercel
2. Click **"Domains"** tab
3. Enter: `madisonvetfinder.com`
4. Vercel will show you DNS records to add

**Add these DNS records at your domain registrar:**

For **root domain** (madisonvetfinder.com):
- Type: `A`
- Name: `@`
- Value: `76.76.21.21` (Vercel's IP)

For **www subdomain**:
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

5. Wait 5-30 minutes for DNS propagation
6. Vercel will automatically provision SSL certificate 🔒

---

## Alternative: Deploy via Vercel CLI (Advanced)

If you prefer command line:

```bash
cd /home/code/vet-directory
npx vercel login
npx vercel --prod
```

Follow the prompts and add environment variables when asked.

---

## ✅ Post-Deployment Checklist

- [ ] Site loads at your-project.vercel.app
- [ ] Custom domain connected (madisonvetfinder.com)
- [ ] SSL certificate active (https://)
- [ ] Clinic listings showing (99 clinics)
- [ ] Search and filters working
- [ ] Individual clinic pages loading
- [ ] Appointment request form working
- [ ] Email notifications sending

---

## 🔧 Troubleshooting

**Build fails?**
- Check environment variables are set correctly
- Make sure Supabase URL and keys are valid

**Domain not connecting?**
- DNS can take up to 48 hours (usually 5-30 minutes)
- Verify DNS records are correct
- Use [DNS Checker](https://dnschecker.org) to verify propagation

**Clinics not loading?**
- Check Supabase connection
- Verify table name is `clinics_madison_wi`
- Check browser console for errors

---

## 📞 Need Help?

If you run into issues, check:
1. Vercel deployment logs
2. Browser console (F12)
3. Supabase logs

---

**Your site will be live at:**
- Vercel URL: `https://your-project.vercel.app`
- Custom domain: `https://madisonvetfinder.com` (after DNS setup)

🎉 **Congratulations! Your MVP is live!**
