# Enhanced Admin Dashboard

## Overview

This is a comprehensive admin dashboard for the AI Chatbot SaaS Platform that provides real-time monitoring and management capabilities across all organizations, users, conversations, and subscriptions.

## Features

### 📊 Real-time Dashboard
- **Live Statistics**: Real-time updates of key metrics every 10-30 seconds
- **Multi-metric Overview**: Total users, active conversations, revenue, organizations, vector embeddings, and API calls
- **Color-coded Cards**: Visual indicators with border colors for different metric types

### 🏢 Organization Management
- **Complete Organization List**: View all registered organizations with detailed statistics
- **Subscription Tiers**: Visual badges for Free, Standard, Premium, and Enterprise tiers
- **User & Conversation Counts**: Per-organization user and conversation statistics
- **Status Monitoring**: Active, trial, and suspended organization statuses

### 💬 Conversation Management
- **Cross-organization Conversations**: Monitor conversations across all organizations
- **Real-time Status**: Active, resolved, and pending conversation states
- **Visitor Information**: Track visitor details and interaction history
- **Organization Context**: See which organization each conversation belongs to

### 📈 Advanced Analytics
- **Growth Trends**: Monthly conversation, visitor, and revenue trends
- **Comparative Analysis**: Current year vs. last year comparisons
- **Interactive Charts**: Recharts-powered visualizations including:
  - Area charts for growth overview
  - Line charts for monthly trends
  - Bar charts for revenue analysis
  - Pie charts for subscription distribution

### 💰 Subscription Analytics
- **Revenue Tracking**: Real-time revenue monitoring and monthly breakdowns
- **Subscription Distribution**: Visual breakdown of subscription tiers
- **Billing Management**: Track subscription statuses and billing dates
- **Payment Analytics**: Monitor payment amounts and subscription changes

### 🎨 Modern UI Components
- **Tabbed Interface**: Clean navigation between different data views
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Automatic theme switching
- **Interactive Tables**: Sortable and filterable data tables
- **Color-coded Badges**: Visual status and tier indicators

## Technical Implementation

### Frontend Architecture
```
admin/
├── src/
│   ├── pages/dashboard/
│   │   └── index.tsx          # Main dashboard component
│   ├── services/
│   │   └── api.ts             # API service layer
│   ├── hooks/
│   │   └── useAdminData.ts    # Custom React hooks for data management
│   └── components/ui/         # Reusable UI components
```

### Backend API Endpoints
```
AI_Py/
└── routes/
    └── admin.py               # Admin-specific API endpoints
```

#### Available Endpoints:
- `GET /admin/organizations` - All organizations with statistics
- `GET /admin/conversations` - Recent conversations across organizations
- `GET /admin/subscriptions` - All subscription details
- `GET /admin/dashboard-stats` - Aggregated dashboard statistics
- `GET /admin/analytics` - Historical analytics data
- `GET /admin/realtime-stats` - Real-time statistics
- `GET /admin/subscription-distribution` - Subscription tier distribution

### Data Models

#### Organization
```typescript
{
  id: string;
  name: string;
  api_key: string;
  user_id: string;
  subscription_tier: 'free' | 'standard' | 'premium' | 'enterprise';
  subscription_status: 'active' | 'trial' | 'suspended';
  total_users: number;
  total_conversations: number;
  created_at: string;
  // ... additional fields
}
```

#### Conversation
```typescript
{
  id: string;
  organization_id: string;
  organization_name: string;
  visitor_id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  // ... additional fields
}
```

#### Subscription
```typescript
{
  id: string;
  user_id: string;
  organization_id: string;
  organization_name: string;
  stripe_subscription_id: string;
  payment_amount: number;
  subscription_tier: string;
  subscription_status: string;
  current_period_start: string;
  current_period_end: string;
  // ... additional fields
}
```

## Database Collections

The dashboard aggregates data from the following MongoDB collections:

### Core Collections
1. **organizations**: Organization profiles and settings
2. **visitors**: Chatbot users and their sessions
3. **conversations**: Individual chat messages and interactions
4. **subscriptions**: Payment and subscription records
5. **documents**: Knowledge base documents (for vector embeddings count)

### Statistics Generated
- **Real-time Metrics**: Active conversations, API calls
- **Aggregated Counts**: Total users, organizations, conversations
- **Revenue Calculations**: Monthly recurring revenue from active subscriptions
- **Growth Analytics**: Month-over-month comparisons
- **Usage Metrics**: Vector embeddings, document counts

## Setup Instructions

### 1. Backend Setup
1. Start the AI_Py server with the admin routes:
   ```bash
   cd AI_Py
   python main.py
   ```

2. Set the admin token environment variable:
   ```bash
   export ADMIN_TOKEN="your_admin_super_secret_token"
   ```

### 2. Frontend Setup
1. Install dependencies:
   ```bash
   cd admin
   npm install
   ```

2. Set the API URL in your environment:
   ```bash
   # .env
   VITE_API_URL=http://localhost:8000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Authentication
The admin dashboard uses a simple token-based authentication. Set the admin token in localStorage:
```javascript
localStorage.setItem('adminApiKey', 'your_admin_super_secret_token');
```

## Features in Detail

### Real-time Updates
- **Auto-refresh**: Data automatically refreshes at different intervals
- **Manual Refresh**: Each section has manual refresh capabilities
- **Loading States**: Proper loading indicators for all data fetching

### Interactive Charts
- **Recharts Integration**: Professional chart library with animations
- **Responsive Design**: Charts adapt to container size
- **Tooltip Support**: Hover for detailed information
- **Color Themes**: Consistent color scheme across all charts

### Data Management
- **React Query**: Efficient data fetching with caching
- **Custom Hooks**: Reusable data logic
- **Error Handling**: Graceful error states
- **TypeScript**: Full type safety

### Performance Optimizations
- **Memoization**: Computed statistics are memoized
- **Lazy Loading**: Charts and heavy components load on demand
- **Efficient Queries**: Optimized database queries with indexes
- **Caching**: Client-side caching with stale-while-revalidate strategy

## Security Considerations

1. **Authentication**: Admin token-based authentication
2. **Authorization**: Endpoints protected with admin verification
3. **Data Exposure**: Only aggregated statistics, no sensitive user data
4. **Rate Limiting**: Consider implementing rate limiting for production

## Future Enhancements

1. **Real-time WebSocket**: Live updates without polling
2. **Advanced Filtering**: Filter data by date ranges, organizations
3. **Export Functionality**: Export reports to CSV/PDF
4. **User Management**: Manage individual user accounts
5. **System Health**: Monitor server health and performance
6. **Audit Logs**: Track admin actions and changes
7. **Notification System**: Alerts for important events

## Development Notes

- **Code Structure**: Modular and maintainable architecture
- **Component Reusability**: Shared UI components
- **Data Flow**: Unidirectional data flow with React Query
- **Error Boundaries**: Proper error handling and user feedback
- **Accessibility**: Following WCAG guidelines for accessibility 