# GitHub Pages + Custom Domain Setup

## Overview
This guide will help you deploy UnitGo to GitHub Pages using your GoDaddy domain.

## Prerequisites
- GitHub account
- GoDaddy domain (e.g., easequest.com)
- Repository with your code

## Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically deploy when you push to main branch

## Step 2: Set up Custom Domain

### 2.1 Configure Domain in GitHub
1. In your repository **Settings** → **Pages**
2. Under **Custom domain**, enter your domain:
   - **For subdomain**: `unitgo.easequest.com` (recommended)
   - **For root domain**: `easequest.com` (replaces your main site)
3. Check **Enforce HTTPS** (will be available after DNS is configured)

**Important**: GitHub Pages does NOT support subdirectories like `easequest.com/apps/unitgo`. You must use either a subdomain or root domain.

### 2.2 Configure DNS in GoDaddy
1. Log into your GoDaddy account
2. Go to **My Products** → **DNS**
3. Find your domain and click **Manage**
4. Add these DNS records:

**For subdomain (recommended):**
```
Type: CNAME
Name: unitgo
Value: yourusername.github.io
TTL: 600 (10 minutes)
```

**For root domain:**
```
Type: A
Name: @
Value: 185.199.108.153
TTL: 600

Type: A  
Name: @
Value: 185.199.109.153
TTL: 600

Type: A
Name: @
Value: 185.199.110.153
TTL: 600

Type: A
Name: @
Value: 185.199.111.153
TTL: 600
```

## Step 3: Deploy Your App

1. Push your code to the main branch:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

2. GitHub Actions will automatically build and deploy your app
3. Check the **Actions** tab to see the deployment progress

## Step 4: Verify Deployment

1. Wait for DNS propagation (can take up to 24 hours)
2. Visit your custom domain
3. Test all functionality

## Benefits of GitHub Pages

✅ **Free hosting** - No hosting costs  
✅ **Automatic deployments** - Push code, get updates  
✅ **HTTPS by default** - Secure connections  
✅ **Global CDN** - Fast loading worldwide  
✅ **Version control** - Easy rollbacks  
✅ **Custom domain support** - Use your own domain  

## Troubleshooting

### DNS Issues
- Use `dig` or online DNS checker to verify records
- Wait up to 24 hours for full propagation
- Check GoDaddy DNS settings

### Build Issues
- Check GitHub Actions logs
- Ensure all dependencies are in package.json
- Verify Next.js build works locally

### Custom Domain Issues
- Ensure DNS records are correct
- Wait for GitHub to verify domain
- Check for typos in domain name

## Maintenance

### Updating Your App
1. Make changes to your code
2. Commit and push to main branch
3. GitHub Actions automatically deploys
4. Changes go live in ~2-3 minutes

### Monitoring
- Check GitHub Actions for build status
- Monitor your domain's uptime
- Set up GitHub notifications for failed builds

---

**Your app will be live at: https://unitgo.easequest.com** (or your chosen subdomain)
