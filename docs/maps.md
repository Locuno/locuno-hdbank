# Google Maps API Setup Guide

## Overview

This document explains how to obtain and configure a Google Maps API key for the Locuno HD Bank application. The Google Maps integration is used in the Family Dashboard to display real-time family member locations.

## Prerequisites

- Google Cloud Platform (GCP) account
- Credit card for billing setup (required even for free tier)
- Project with billing enabled

## Step-by-Step Guide

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name: `locuno-hdbank-maps`
4. Select your organization (if applicable)
5. Click **"Create"**

### 2. Enable Billing

1. In the Cloud Console, go to **Billing**
2. Link a billing account to your project
3. **Note**: Google requires a credit card even for free tier usage

### 3. Enable Google Maps JavaScript API

1. Go to **APIs & Services** → **Library**
2. Search for **"Maps JavaScript API"**
3. Click on **"Maps JavaScript API"**
4. Click **"Enable"**

### 4. Create API Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"API key"**
3. Copy the generated API key
4. Click **"Restrict Key"** (recommended for security)

### 5. Configure API Key Restrictions

#### Application Restrictions
- Select **"HTTP referrers (web sites)"**
- Add your domains:
  ```
  localhost:3000/*
  localhost:5173/*
  *.pages.dev/*
  yourdomain.com/*
  ```

#### API Restrictions
- Select **"Restrict key"**
- Choose **"Maps JavaScript API"**
- Optionally add **"Places API"** if needed

### 6. Update Application Configuration

#### Frontend Configuration

Update `apps/frontend/index.html`:

```html
<!-- Replace the existing Google Maps script -->
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places"></script>
```

#### Environment Variables (Optional)

Create `apps/frontend/.env.local`:

```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

Then update `index.html` to use the environment variable:

```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=%VITE_GOOGLE_MAPS_API_KEY%&libraries=places"></script>
```

## Security Best Practices

### 1. API Key Restrictions

Always restrict your API key to:
- **Specific domains** (HTTP referrers)
- **Specific APIs** (Maps JavaScript API only)
- **IP addresses** (for server-side usage)

### 2. Environment Variables

- Never commit API keys to version control
- Use environment variables for sensitive data
- Use different keys for development and production

### 3. Monitoring Usage

1. Go to **APIs & Services** → **Dashboard**
2. Monitor your API usage
3. Set up billing alerts
4. Review quotas and limits

## Pricing Information

### Free Tier
- **$200 monthly credit** for new users
- **28,000 map loads per month** free
- **100,000 requests per month** for most APIs

### Pay-as-you-go
- **Maps JavaScript API**: $7 per 1,000 requests
- **Places API**: $17 per 1,000 requests
- **Geocoding API**: $5 per 1,000 requests

## Troubleshooting

### Common Errors

#### `InvalidKeyMapError`
- **Cause**: Invalid or missing API key
- **Solution**: Check API key is correct and properly configured

#### `RefererNotAllowedMapError`
- **Cause**: Domain not in allowed referrers list
- **Solution**: Add your domain to HTTP referrers restrictions

#### `ApiNotActivatedMapError`
- **Cause**: Maps JavaScript API not enabled
- **Solution**: Enable the API in Google Cloud Console

#### `QuotaExceededError`
- **Cause**: Exceeded daily/monthly quota
- **Solution**: Check usage in Cloud Console, increase quota if needed

### Debug Steps

1. **Check Browser Console** for specific error messages
2. **Verify API Key** in Google Cloud Console
3. **Check Restrictions** match your domain
4. **Monitor Usage** in APIs Dashboard
5. **Test with Simple HTML** to isolate issues

## Testing Your Setup

Create a simple test file to verify your API key works:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Google Maps Test</title>
</head>
<body>
    <div id="map" style="height: 400px; width: 100%;"></div>
    
    <script>
        function initMap() {
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 15,
                center: { lat: 10.841, lng: 106.810 }, // Vinhomes Grand Park
            });
            
            new google.maps.Marker({
                position: { lat: 10.841, lng: 106.810 },
                map: map,
                title: "Test Location"
            });
        }
    </script>
    
    <script async defer 
        src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap">
    </script>
</body>
</html>
```

## Current Implementation

The Google Maps integration is located in:
- **Component**: `apps/frontend/src/components/GoogleMap.tsx`
- **Usage**: `apps/frontend/src/pages/family/FamilyDashboard.tsx`
- **Configuration**: `apps/frontend/index.html`

## Support Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
- [Error Messages Reference](https://developers.google.com/maps/documentation/javascript/error-messages)

## Next Steps

1. **Get your API key** following the steps above
2. **Replace the placeholder key** in `index.html`
3. **Test the Family Dashboard** at `/family`
4. **Monitor usage** in Google Cloud Console
5. **Set up billing alerts** to avoid unexpected charges

---

**Note**: The current API key in the application is invalid and needs to be replaced with your own valid key following this guide.
