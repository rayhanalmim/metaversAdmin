# Dynamic Admin Dashboard Setup

## Overview
The admin dashboard has been successfully converted from using static/mock data to dynamically fetching real data from the Python FastAPI backend.

## Connected Endpoints

### Authentication
- `POST /auth/admin/login` - Admin login with email/password
- `GET /admin/verify` - Verify admin JWT token

### Dashboard Data
- `GET /admin/dashboard-stats` - Overall dashboard statistics
- `GET /admin/realtime-stats` - Real-time statistics (updated every 30s)
- `GET /admin/analytics` - Monthly analytics data for charts
- `GET /admin/subscription-distribution` - Subscription tier distribution

### Management Data
- `GET /admin/organizations` - All organizations with details
- `GET /admin/conversations` - Recent conversations across all orgs
- `GET /admin/subscriptions` - All subscription records

## Configuration

### Environment Variables
Create a `.env` file in the admin directory:
```bash
VITE_API_URL=http://localhost:8000
```

### Backend Requirements
Ensure your Python backend is running on the configured URL (default: `http://localhost:8000`) with the following admin routes available in `admin.py`:

1. Authentication endpoints in `auth.py`
2. Admin management endpoints in `admin.py`

## Features

### Real-time Updates
- Dashboard stats refresh automatically every 30 seconds
- Loading states for all data fetching
- Error handling for failed API calls

### Dynamic Data Display
- **Overview Tab**: Real-time stats cards, analytics charts, recent activity
- **Organizations Tab**: Complete organization management with real data
- **Conversations Tab**: All conversations with session details
- **Analytics Tab**: Monthly trends and revenue charts
- **Subscriptions Tab**: Subscription distribution and detailed subscription management

### Admin Authentication
- Secure JWT-based authentication
- Admin role verification
- Persistent login state
- Token verification on app start

## Default Admin Credentials
- **Email**: `222015010@student.green.edu.bd`
- **Password**: `admin123`

## Data Refresh
- Dashboard stats: Every 30 seconds
- All other data: On tab switch or page refresh
- Manual refresh available by switching tabs

## Error Handling
- Loading spinners during data fetch
- Error messages for failed requests
- Graceful fallbacks for missing data
- Empty state messages when no data is available

## API Response Format
All endpoints return data in the format expected by the frontend components. The Python backend handles:
- Date formatting
- Data aggregation
- Proper error responses
- Authentication validation 