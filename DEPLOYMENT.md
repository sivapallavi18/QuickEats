# Deployment Guide - Render

This guide will help you deploy your QuickEats MERN application to Render.

## Prerequisites

1. GitHub repository with your code
2. Render account (free tier available)
3. MongoDB Atlas account for database

## Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string (replace `<password>` with your actual password)
5. Whitelist all IP addresses (0.0.0.0/0) for Render deployment

## Step 2: Deploy Backend API

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `quickeats-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `master` (or your main branch)
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   FRONTEND_URL=https://your-frontend-app.onrender.com
   PORT=10000
   ```

6. Click "Create Web Service"

## Step 3: Deploy Frontend

1. In Render Dashboard, click "New" → "Static Site"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `quickeats-frontend`
   - **Branch**: `master`
   - **Root Directory**: Leave empty (root)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend-app.onrender.com/api
   ```

5. Click "Create Static Site"

## Step 4: Update Environment Variables

After both services are deployed:

1. Go to your backend service settings
2. Update the `FRONTEND_URL` environment variable with your actual frontend URL
3. Go to your frontend service settings
4. Update the `REACT_APP_API_URL` with your actual backend URL

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Test user registration and login
3. Test restaurant browsing and ordering
4. Check browser console for any errors

## Important Notes

- **Free Tier Limitations**: Render free tier services sleep after 15 minutes of inactivity
- **Cold Starts**: First request after sleep may take 30+ seconds
- **Database**: Use MongoDB Atlas free tier for production database
- **HTTPS**: Render provides HTTPS by default
- **Custom Domains**: Available on paid plans

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure `FRONTEND_URL` is correctly set in backend
2. **API Connection**: Verify `REACT_APP_API_URL` points to correct backend URL
3. **Database Connection**: Check MongoDB Atlas connection string and IP whitelist
4. **Build Failures**: Check build logs in Render dashboard

### Environment Variables Checklist:

**Backend:**
- ✅ NODE_ENV=production
- ✅ MONGODB_URI (from MongoDB Atlas)
- ✅ JWT_SECRET (generate a secure random string)
- ✅ FRONTEND_URL (your frontend Render URL)

**Frontend:**
- ✅ REACT_APP_API_URL (your backend Render URL + /api)

## Monitoring

- Check service logs in Render dashboard
- Monitor service status and metrics
- Set up alerts for service downtime (paid plans)

## Scaling

For production use, consider:
- Upgrading to paid Render plans for better performance
- Using Redis for session storage
- Implementing CDN for static assets
- Database optimization and indexing