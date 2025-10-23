# 📳 Admin Phone Vibration Setup Guide

## 🎯 Feature Overview

When a customer places an order, the admin's phone will **vibrate like a phone call for 3 seconds** to alert them of the new order.

## 🔧 How It Works

1. **Real-time Monitoring**: Uses Supabase real-time subscriptions to detect new orders instantly
2. **Phone Vibration**: Uses the Vibration API to make the phone vibrate in a call-like pattern
3. **Browser Notifications**: Shows a notification with order details
4. **Sound Alert**: Plays notification beeps

## 📱 Setup Instructions

### **1. Enable Supabase Real-time**
Make sure your Supabase project has real-time enabled:
- Go to your Supabase dashboard
- Navigate to Settings → API
- Ensure real-time is enabled for your project

### **2. Admin Login**
- Go to `/admin/login`
- Login with: `admin@harveys.com` / `admin@123`
- **Allow notification permissions** when prompted

### **3. Test the System**

#### **Option A: Test Button**
- In the admin dashboard, click the **"📳 Test Vibration"** button
- Your phone should vibrate and show a notification

#### **Option B: Real Order Test**
- Open a new browser tab/window
- Go to the customer side and place an order
- The admin dashboard should vibrate immediately when the order is placed

## 🔍 Troubleshooting

### **Vibration Not Working?**
- **Check Device**: Vibration only works on mobile devices (phones/tablets)
- **Check Browser**: Use Chrome/Safari on mobile for best support
- **Check Settings**: Ensure device vibration is enabled in phone settings

### **Notifications Not Showing?**
- **Allow Permissions**: Make sure you clicked "Allow" for notifications
- **Check Browser Settings**: Ensure notifications are enabled for the site
- **Try Refresh**: Refresh the admin dashboard page

### **Real-time Not Working?**
- **Check Connection**: Look for the green "Live Notifications" indicator
- **Check Console**: Open browser dev tools to see connection logs
- **Check Supabase**: Ensure your Supabase project is active

## 📊 Status Indicators

In the admin dashboard header, you'll see:
- 🟢 **Live Notifications** - Real-time connection active
- 🔴 **Offline** - Connection issues

## 🧪 Testing Checklist

- [ ] Admin login requests notification permissions
- [ ] Green "Live Notifications" indicator shows
- [ ] Test button triggers vibration and notification
- [ ] Real order placement triggers immediate vibration
- [ ] Notification shows customer name and order details
- [ ] Phone vibrates in call-like pattern for ~3 seconds

## 📝 Technical Details

### **Vibration Pattern**
```javascript
// 3-second call-like vibration pattern
[500, 200, 500, 200, 500, 200, 300, 100, 300, 100, 300, 100, 500, 200, 500, 200, 500]
```

### **Real-time Events**
- Listens for `INSERT` events on `invoices` table
- Triggers notification only for `pending` status orders
- Updates order list in real-time

### **Browser Support**
- **Vibration API**: Chrome, Firefox, Safari (mobile)
- **Notifications API**: All modern browsers
- **Real-time**: WebSocket support required

## 🚀 Usage

1. **Keep admin dashboard open** on your phone
2. **Leave browser tab active** for best performance
3. **Phone will vibrate** immediately when orders come in
4. **Click notification** to focus the dashboard

The system works best when the admin dashboard is open and active on a mobile device! 📱✨

