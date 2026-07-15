# Deployment Guide

**Last Updated**: 2026-07-16  
**Status**: Production Ready

## Quick Start

```bash
# Build for production
npm run build

# Verify build
npm run build:preview

# Deploy to S3 (see "Deployment Options" below)
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Build machine: ~512MB RAM, 2+ CPU cores
- For AWS S3 deployment: AWS CLI configured with credentials
- For Vercel/Netlify: Account and authentication configured

## Environment Variables

Create `.env` file (or set in deployment platform):

```env
VITE_API_BASE_URL=https://api.loyalty.internal  # Backend API endpoint
```

**Production Value**: Must point to the production loyalty backend API.

## Deployment Options

### Option A: AWS S3 + CloudFront (Manual Deployment)

Best for: Organizations with existing AWS infrastructure.

#### Prerequisites
```bash
# Install AWS CLI
brew install awscli

# Configure credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Default region (us-east-1)
```

#### Deployment Steps

```bash
# 1. Test locally
npm run test -- --watchAll=false
npm run build

# 2. Deploy to S3
aws s3 sync dist/ s3://loyalty-admin-prod/ --delete --cache-control "max-age=31536000,immutable"
# Note: --delete removes files from S3 that are not in dist/

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E1234EXAMPLE \
  --paths "/*"

# 4. Verify deployment
curl -I https://loyalty-admin.internal/index.html
# Should return 200 OK
```

#### Rollback

```bash
# Option 1: Restore previous version from S3 backup
aws s3 sync s3://loyalty-admin-backup/ s3://loyalty-admin-prod/ --delete

# Option 2: Deploy previous tag/commit
git checkout v1.2.3
npm run build
aws s3 sync dist/ s3://loyalty-admin-prod/ --delete
aws cloudfront create-invalidation --distribution-id E1234EXAMPLE --paths "/*"
```

### Option B: Vercel (Recommended for Simplicity)

Best for: Teams that want zero-config deployment.

#### Prerequisites
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login
```

#### Deployment Steps

```bash
# Deploy to production
vercel --prod

# Or use GitHub integration (auto-deploy on push to main)
# See: https://vercel.com/docs/git/github
```

#### Configuration

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_BASE_URL": "@api_base_url_prod"
  }
}
```

#### Rollback
```bash
# Vercel automatically keeps previous deployments
# Revert via dashboard: Deployments → Previous deployment → Promote to Production
```

### Option C: Netlify

Best for: JAMstack-first deployments.

#### Prerequisites
- Netlify account
- GitHub connected

#### Deployment Steps

```bash
# Connect repository in Netlify dashboard
# Build settings:
#   Build command: npm run build
#   Publish directory: dist
# Deploy!
```

#### Environment Variables
Set in Netlify dashboard: Site Settings → Build & Deploy → Environment
```
VITE_API_BASE_URL=https://api.loyalty.internal
```

#### Rollback
Netlify keeps deploy history; revert via dashboard.

### Option D: Docker + Self-Hosted

Best for: Full control, private infrastructure.

#### Build & Deploy

```bash
# Build image
docker build -t loyalty-admin:1.2.3 .

# Tag for registry
docker tag loyalty-admin:1.2.3 registry.internal/loyalty-admin:1.2.3

# Push to registry
docker push registry.internal/loyalty-admin:1.2.3

# Deploy to Kubernetes
kubectl set image deployment/loyalty-admin \
  loyalty-admin=registry.internal/loyalty-admin:1.2.3 \
  --record

# Verify rollout
kubectl rollout status deployment/loyalty-admin
```

#### Rollback
```bash
kubectl rollout undo deployment/loyalty-admin
```

## Deployment Checklist

Before deploying to production, verify:

- [ ] All tests passing: `npm test -- --watchAll=false`
- [ ] Lint passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in build output
- [ ] `.env` file has correct `VITE_API_BASE_URL`
- [ ] Feature flags configured on backend (if needed)
- [ ] Backup of current production created
- [ ] Deployment team notified (if applicable)

## Post-Deployment Verification

After deployment, verify the app works:

1. **Page Load**
   ```bash
   curl -I https://loyalty-admin.internal
   # Should return 200 OK
   ```

2. **Login Flow**
   - Open https://loyalty-admin.internal
   - Enter test credentials
   - Should redirect to dashboard
   - Check browser console for errors (F12)

3. **Key Views**
   - Click through: Dashboard → Wallets → Partners → Profiles
   - Verify data loads (no 401/403 errors)
   - Check Network tab for API responses

4. **Performance**
   - Open DevTools → Performance tab
   - Reload page
   - First Contentful Paint should be < 2 seconds

## Troubleshooting

### Page returns 404

**Cause**: S3 not configured for static website hosting.

**Fix**:
```bash
# Enable static website hosting
aws s3api put-bucket-website \
  --bucket loyalty-admin-prod \
  --website-configuration '{
    "IndexDocument": {"Suffix": "index.html"},
    "ErrorDocument": {"Key": "index.html"}
  }'
```

### Old content showing in browser

**Cause**: Browser cache or CloudFront cache.

**Fix**:
```bash
# Hard refresh browser
Shift + Ctrl + R  (Windows/Linux)
Shift + Cmd + R   (Mac)

# Or invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id E1234EXAMPLE \
  --paths "/*"
```

### API calls failing with CORS error

**Cause**: Backend CORS headers not configured for new domain.

**Fix**:
- Contact backend team
- Add deployment domain to backend CORS whitelist
- Example: https://loyalty-admin.internal

### White screen, no errors in console

**Cause**: Backend unavailable or `VITE_API_BASE_URL` incorrect.

**Fix**:
```bash
# Verify backend is running
curl -I https://api.loyalty.internal/health

# Check deployed .env values
# (Method depends on deployment platform)
```

## Monitoring & Alerts

### CloudWatch (AWS)

```bash
# View access logs
aws logs tail /aws/cloudfront/loyalty-admin --follow
```

### Application Monitoring

Set up error tracking:
- **Sentry** (recommended): Captures JavaScript errors
- **LogRocket**: Session replay + error tracking
- **Datadog**: Full stack monitoring

Integration example (Sentry):
```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_ENV,
  tracesSampleRate: 1.0,
});
```

## Performance Targets

After deployment, monitor:

| Metric | Target | Tool |
|--------|--------|------|
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| First Input Delay (FID) | < 100ms | PageSpeed Insights |
| Cumulative Layout Shift (CLS) | < 0.1 | DevTools |
| Time to Interactive | < 3s | Lighthouse |

## Versioning & Change Log

### Semantic Versioning

- **MAJOR** (1.0.0): Breaking changes (requires update guide)
- **MINOR** (0.1.0): New features (backwards compatible)
- **PATCH** (0.0.1): Bug fixes

### Creating a Release

```bash
# Tag commit
git tag v1.2.3

# Push tag
git push origin v1.2.3

# Create GitHub release with notes
gh release create v1.2.3 --notes "$(cat RELEASE_NOTES.md)"
```

## Disaster Recovery

### Complete Data Loss

```bash
# If S3 bucket deleted, restore from backup
aws s3api list-buckets  # Verify backup bucket exists

aws s3 sync s3://loyalty-admin-backup/ s3://loyalty-admin-prod/

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id E1234EXAMPLE --paths "/*"
```

### Corrupted Deployment

```bash
# Rollback to last known good
git checkout v1.2.2
npm run build
# Redeploy using chosen option (S3, Vercel, etc.)
```

## On-Call Runbook

**Incident**: App is down / showing errors

1. **Immediate**: Check status page (if exists)
2. **5 mins**: Verify backend is online (`curl /health`)
3. **10 mins**: Check deployment logs (GitHub Actions / Vercel / CloudFront)
4. **15 mins**: Rollback to previous version (see Rollback sections above)
5. **20 mins**: Notify team, investigate root cause

**Contact**:
- Backend team: [Slack channel or email]
- DevOps: [Contact info]
- On-call schedule: [Link to calendar]

## References

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [AWS S3 Static Website](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Invalidation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html)
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)
- [Netlify Deployment](https://docs.netlify.com/site-configuration/builds/)

---

**Last Deployed**: [Check git tag or deployment dashboard]  
**Deployed By**: [Git commit author]  
**Environment**: Production  
**Status**: ✅ Running
