# Ration Stock Notification System

A complete stock management system for ration shops that automatically notifies beneficiaries via SMS when products become available or go out of stock.

## Features

### For Staff
- **Product Management**: View and manage all ration products (Rice, Wheat, Sugar, Cooking Oil, Pulses)
- **Stock Updates**: Update product quantities with staff name and notes
- **Automatic Notifications**: System automatically sends SMS to all registered beneficiaries when stock status changes
- **Beneficiary Management**: View all registered beneficiaries with their contact information
- **Notification History**: Track all sent notifications with timestamps and status

### For Beneficiaries
- Receive instant SMS notifications when new stock arrives
- Get notified when products go out of stock
- Messages include product details and availability status

## System Architecture

### Frontend
- Built with React, TypeScript, and Vite
- Tailwind CSS for styling
- Lucide React for icons
- Responsive design for mobile and desktop

### Backend
- Supabase for database and authentication
- PostgreSQL database with Row Level Security (RLS)
- Edge Function for SMS notifications
- Real-time data synchronization

### Database Schema

#### Products Table
- Stores all ration products with quantity, status, and pricing
- Tracks stock levels and availability status

#### Beneficiaries Table
- Maintains beneficiary information
- Includes ration card numbers, phone numbers, and family details

#### Stock Updates Table
- Logs every stock update with before/after values
- Records staff member who made the update and optional notes

#### Notifications Table
- Tracks all notifications sent to beneficiaries
- Records message content, delivery status, and timestamps

## How It Works

1. **Stock Arrival**: When new stock arrives, staff opens the Products tab
2. **Update Stock**: Click "Update Stock" on the product card
3. **Enter Details**:
   - Enter new quantity
   - Enter staff name
   - Add optional notes
4. **Send Notifications**: Click "Update & Notify" button
5. **Automatic Process**:
   - Product quantity and status are updated in database
   - Stock update is logged with details
   - Edge function triggers and sends SMS to all active beneficiaries
   - Notifications are recorded in the database

### Notification Messages

**When Stock Becomes Available:**
```
Good news! [Product Name] is now available at the ration shop.
Stock: [Quantity] [Unit]. Visit soon to collect your ration.
```

**When Stock Runs Out:**
```
Update: [Product Name] is currently out of stock at the ration shop.
We will notify you when it becomes available again.
```

## Usage Guide

### Products Tab
- View all products with current stock levels
- See availability status (In Stock / Out of Stock)
- Click "Update Stock" to modify quantities
- Product cards show price per unit and current quantity

### Beneficiaries Tab
- View all registered beneficiaries
- See ration card numbers and contact information
- Check family member counts
- Identify active vs inactive beneficiaries

### Notifications Tab
- View last 50 notifications sent
- See which beneficiary received which notification
- Check delivery status (sent/failed)
- View message content and timestamps

## SMS Integration

The system includes a deployed Supabase Edge Function (`send-sms-notification`) that:
- Receives product update information
- Fetches all active beneficiaries from database
- Generates appropriate message based on stock status
- Simulates SMS sending (in production, integrate with SMS gateway)
- Records all notifications in database

### Integrating Real SMS Gateway

To enable actual SMS sending, modify the edge function at:
`supabase/functions/send-sms-notification/index.ts`

Add your SMS provider (Twilio, AWS SNS, etc.) credentials and API calls.

## Sample Data

The system comes pre-populated with:

**Products:**
- Rice (25/kg)
- Wheat (20/kg)
- Sugar (35/kg)
- Cooking Oil (120/liter)
- Pulses/Dal (80/kg)

**Beneficiaries:**
- 5 sample beneficiaries with phone numbers and addresses
- Ready for testing the notification system

## Security Features

- Row Level Security (RLS) enabled on all tables
- Secure API endpoints with Supabase authentication
- Environment variables for sensitive credentials
- CORS properly configured on edge functions

## Development

The system is built with modern web technologies:
- React 18 with TypeScript for type safety
- Vite for fast development and optimized builds
- Tailwind CSS for responsive, production-ready UI
- Supabase for scalable backend infrastructure

## Future Enhancements

- Staff authentication and role-based access
- Inventory alerts when stock falls below threshold
- Beneficiary portal to view notification history
- Multi-language SMS support
- Analytics dashboard for stock trends
- Integration with actual SMS gateways
- Barcode scanning for product tracking
- Export reports in PDF/Excel format
