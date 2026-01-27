# 🚀 Five9 Dashboard - Quick Start Guide

## Get Started in 3 Minutes

### 1️⃣ Prerequisites Check

```bash
# Verify you have Node.js v18+
node --version

# If not installed, get it from https://nodejs.org/
```

### 2️⃣ Install & Run

```bash
cd five9-dashboard
npm install
npm run dev
```

### 3️⃣ Open Browser

Navigate to: **http://localhost:8080**

That's it! 🎉

---

## What You'll See

### Hero Section
- **Live sync status** with animated pulse indicator
- **Countdown timer** to next scheduled sync
- **Last sync time** and status

### Key Metrics (4 KPI Cards)
- Files Transferred
- Data Volume  
- Success Rate
- Average Speed

### System Health
- Circular health gauge (0-100 score)
- Disk usage with projections
- Uptime tracking

### Charts & Analytics
- 24-hour sync timeline
- Success rate gauge
- Top callers leaderboard
- Call volume heatmap (24 hours)
- 7-day trend chart

---

## Key Features

✅ **Real-time Updates** - Auto-refreshes every 30 seconds  
✅ **Beautiful Animations** - Smooth transitions with Framer Motion  
✅ **Fully Responsive** - Works on mobile, tablet, and desktop  
✅ **Dark Theme** - Easy on the eyes with purple accents  
✅ **Accessible** - WCAG 2.1 AA compliant  

---

## Quick Commands

```bash
# Development server (port 8080)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## Project Structure

```
five9-dashboard/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main dashboard
│   ├── layout.tsx         # Root layout
│   └── api/               # API routes
├── components/            # React components
│   ├── metrics/          # KPI cards, gauges
│   ├── charts/           # Data visualizations
│   ├── layout/           # Shell, header
│   └── shared/           # Reusable utilities
├── lib/                  # Utilities & helpers
├── hooks/                # Custom React hooks
└── types/                # TypeScript definitions
```

---

## Customization

### Change Polling Interval

Edit `lib/constants.ts`:
```typescript
export const POLLING_INTERVAL = 30000; // milliseconds
```

### Adjust Color Theme

Edit `app/globals.css`:
```css
--primary: 258 90% 66%;  /* Purple */
--success: 158 64% 52%;  /* Green */
```

### Modify Port

Edit `package.json`:
```json
"dev": "next dev -p 8080",
"start": "next start -p 8080"
```

---

## Troubleshooting

### Port Already in Use?

```bash
# Kill process on port 8080
npx kill-port 8080

# Or use a different port
npm run dev -- -p 3000
```

### Build Errors?

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript Errors?

```bash
# Run type checker
npm run type-check
```

---

## Next Steps

1. ✅ **You're running the dashboard!**
2. 📖 Read `README.md` for detailed documentation
3. 🚀 See `DEPLOYMENT.md` for production deployment
4. 🔌 Replace mock data with real Five9 API (when ready)

---

## Need Help?

- **Documentation**: Check README.md
- **Deployment**: See DEPLOYMENT.md
- **Code Structure**: Browse the well-commented source code

Enjoy your new dashboard! 🎉
