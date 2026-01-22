# Monolithic Deployment Guide for Render

This guide explains how to deploy your MERN stack application as a single service on Render, where the backend serves the frontend.

## 1. Project Setup (Already Done)
The project has been configured for monolithic deployment:
- **Root `package.json`**: Orchestrates installing dependencies for both client and server, and building the client.
- **Server `index.js`**: Configured to serve the React frontend static files from `client/dist`.

## 2. Push to GitHub
Ensure your latest code is pushed to your GitHub repository.

## 3. Create Web Service on Render

1.  Log in to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.

## 4. Configure Service Settings

Fill in the following details:

| Setting | Value |
| :--- | :--- |
| **Name** | `your-app-name` |
| **Region** | Choose the one closest to you (e.g., Singapore, Oregon) |
| **Branch** | `main` (or your working branch) |
| **Root Directory** | `.` (Leave empty or dot) |
| **Runtime** | **Node** |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

> **Note:** The `build` command defined in the root `package.json` will install dependencies for both client and server and build the React app. The `start` command will launch the Express server.

## 5. Environment Variables (Critical)

Scroll down to the **Environment Variables** section and add the following keys. 

**Important:** For `CLIENT_URL`, use your Render URL (e.g., `https://your-app-name.onrender.com`).

| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render's default port) |
| `MONGO_URI` | Your MongoDB Connection String |
| `SECRET_KEY` | Your JWT Secret (Any long random string) |
| `CLIENT_URL` | `https://your-app-name.onrender.com` (Your Render App URL) |
| `STRIPE_SECRET_KEY` | Your **Test** Secret Key (`sk_test_...`) |
| `API_KEY` | Your Cloudinary API Key |
| `API_SECRET` | Your Cloudinary API Secret |
| `CLOUD_NAME` | Your Cloudinary Cloud Name |
| `WEBHOOK_ENDPOINT_SECRET` | **Leave empty initially** (See Step 6) |

## 6. Final Stripe Setup (After Deployment)

1.  **Deploy the Service**: Click **Create Web Service**. Wait for the build to finish.
2.  **Get Webhook Secret**:
    *   Go to **Stripe Dashboard > Developers > Webhooks**.
    *   Add Endpoint: `https://your-app-name.onrender.com/api/v1/purchase/webhook`
    *   Select event: `checkout.session.completed`.
    *   Copy the **Signing Secret** (`whsec_...`).
3.  **Update Render**:
    *   Go back to Render Dashboard > Environment.
    *   Add/Update `WEBHOOK_ENDPOINT_SECRET` with the value you just copied.
    *   **Save Changes** (this will trigger a redeploy).

## 7. Troubleshooting

-   **Build Fails?** Check the logs. Ensure `npm run build` works locally.
-   **White Screen?** Open browser console. If you see 404s for assets, ensure `server/index.js` is correctly pointing to `../client/dist`.
-   **CORS Errors?** Ensure `CLIENT_URL` matches exactly what is in your browser address bar (no trailing slash).
