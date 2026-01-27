# Five9 Sync Monitoring Dashboard

Enterprise-grade real-time monitoring dashboard for Five9 call recording sync system.

## 🚀 Features

- **Real-time Monitoring**: Live sync status with auto-refresh every 30 seconds
- **System Health Dashboard**: Comprehensive health score with 0-100 gauge
- **Disk Usage Monitor**: Capacity tracking with projections
- **Call Volume Analytics**: Top callers, hourly distribution, and trends
- **Performance Metrics**: Success rates, transfer speeds, and historical data
- **Beautiful UI**: Dark theme with glassmorphism effects and smooth animations
- **Fully Accessible**: WCAG 2.1 AA compliant with keyboard navigation
- **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS v3
- **Components**: Radix UI primitives
- **Charts**: Recharts
- **Animations**: Framer Motion
- **State**: TanStack Query (React Query)
- **Icons**: Lucide React

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🖥️ Development

The development server runs on port 8080:

```
http://localhost:8080
```

## 🏗️ Project Structure

```
five9-dashboard/
├── app/
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Main dashboard page
│   ├── globals.css          # Global styles & design tokens
│   └── api/
│       ├── metrics/         # Sync metrics endpoint
│       └── call-volume/     # Call volume endpoint
├── components/
│   ├── ui/                  # Shadcn primitives
│   ├── layout/              # Shell, Header
│   ├── metrics/             # KPI cards, gauges, indicators
│   ├── charts/              # All chart components
│   └── shared/              # Reusable utilities
├── lib/
│   ├── utils.ts             # Helper functions
│   ├── constants.ts         # Configuration
│   ├── mock-data.ts         # Mock data generators
│   └── query-provider.tsx   # React Query provider
├── hooks/
│   ├── use-metrics.ts       # Data fetching hooks
│   └── use-interval.ts      # Polling hook
└── types/
    └── metrics.ts           # TypeScript interfaces
```

## 🎨 Design System

### Colors
- **Background**: Deep space black (#0a0a0f)
- **Primary**: Purple accent (#8b5cf6)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **UI**: Inter font family
- **Data/Code**: JetBrains Mono

## 🔧 Configuration

### Polling Interval
Adjust in `lib/constants.ts`:
```typescript
export const POLLING_INTERVAL = 30000; // 30 seconds
```

### Disk Thresholds
```typescript
export const DISK_WARNING_THRESHOLD = 80; // 80%
export const DISK_CRITICAL_THRESHOLD = 90; // 90%
```

## 📊 API Endpoints

### GET /api/metrics
Returns sync metrics including:
- Last run status and details
- Next scheduled run
- System health score
- Disk usage
- Performance stats
- Recent activity (24 hours)

### GET /api/call-volume
Returns call volume data including:
- Top callers leaderboard
- Hourly distribution (24-hour heatmap)
- Daily trends (7 days)

## ♿ Accessibility

- All interactive elements have proper ARIA labels
- Keyboard navigation fully supported
- Focus management with visible focus rings
- Semantic HTML structure
- WCAG 2.1 AA contrast ratios
- Screen reader friendly

## 🚢 Deployment

### Production Build
```bash
npm run build
npm start
```

### Server Deployment
Configured for port 8080 (change in `package.json` if needed):
```json
"scripts": {
  "dev": "next dev -p 8080",
  "start": "next start -p 8080"
}
```

## 📝 License

Proprietary - Five9 Internal Use Only

## 👥 Support

For issues or questions, contact the development team.
