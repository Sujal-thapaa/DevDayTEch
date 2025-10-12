# Google Maps API Setup Guide

## Important Note

The credentials you provided are **OAuth 2.0 Client credentials** (for user authentication), not a Google Maps API key. To use Google Maps in this application, you need a **Maps JavaScript API key**.

## How to Get a Google Maps API Key

### Step 1: Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)

### Step 2: Enable Maps JavaScript API
1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for **"Maps JavaScript API"**
3. Click on it and press **Enable**

### Step 3: Create an API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API key**
3. A new API key will be created
4. **Important**: Click on the key to restrict it (recommended for security)

### Step 4: Restrict Your API Key (Recommended)
1. Under **Application restrictions**, select **HTTP referrers (web sites)**
2. Add your domains:
   - For development: `http://localhost:*`
   - For production: `https://yourdomain.com/*`
3. Under **API restrictions**, select **Restrict key**
4. Choose **Maps JavaScript API** from the dropdown
5. Click **Save**

## How to Add the API Key to Your Project

### Option 1: Using Environment Variables (Recommended)
1. Create a `.env` file in the project root (if it doesn't exist)
2. Add this line:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```
3. The application will automatically use this key

### Option 2: Direct Configuration
1. Open `src/config/maps.ts`
2. Replace `'YOUR_GOOGLE_MAPS_API_KEY_HERE'` with your actual API key
3. **Warning**: Don't commit this file with your real API key to version control

## Your OAuth Credentials

The credentials you provided are:
- **Client ID**: `307249583406-953o5o7stve8hn3e0bqjckreoesu1tl3.apps.googleusercontent.com`
- **Client Secret**: `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`

These are useful for:
- Google Sign-In / OAuth authentication
- Accessing user data with permission
- Google Calendar, Drive, etc.

But **not** for Google Maps API.

## Testing the Map

Once you've added your API key:
1. Restart the development server: `npm run dev`
2. Navigate to the Public portal
3. Scroll to the "Facility Locations" section
4. You should see an interactive Google Map with facility markers

## Troubleshooting

### Map shows gray box
- Check that you've enabled **Maps JavaScript API** in Google Cloud Console
- Verify your API key is correct in `.env` or `src/config/maps.ts`
- Check browser console for specific error messages

### "This page can't load Google Maps correctly"
- Your API key may be restricted incorrectly
- Make sure `http://localhost:*` is allowed in HTTP referrer restrictions
- Ensure Maps JavaScript API is enabled

### Billing warning
- Google Maps requires a billing account, but includes $200 free monthly credit
- For a small prototype, you won't exceed the free tier

## Security Best Practices

1. ✅ Always use environment variables for API keys
2. ✅ Restrict your API key to specific domains
3. ✅ Restrict to only the APIs you need (Maps JavaScript API)
4. ❌ Never commit `.env` files to Git
5. ❌ Never expose your API key in public repositories

## Need Help?

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation/javascript)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)

