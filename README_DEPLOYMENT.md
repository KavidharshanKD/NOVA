# Universe / NOVA Deployment Manual

This guide describes how to deploy the **Universe (NOVA)** application in a production-ready environment across Vercel, Render, and MongoDB Atlas.

---

## Architecture Overview

```
                      +-----------------------------+
                      |       React Frontend        |
                      |          (Vercel)           |
                      +--------------+--------------+
                                     |
                                     | API Requests
                                     v
                      +-----------------------------+
                      |       Express Backend       |
                      |          (Render)           |
                      +-------+--------------+------+
                              |              |
           Dynamic Predictions|              | MongoDB Connection
                              v              v
         +----------------------+      +---------------+
         |     Flask ML API     |      | MongoDB Atlas |
         |       (Render)       |      |    (Cloud)    |
         +----------------------+      +---------------+
```

---

## 1. Database Setup (MongoDB Atlas)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster (Shared Free Tier is sufficient).
3. Under **Database Access**, create a user with read/write privileges.
4. Under **Network Access**, add IP address `0.0.0.0/0` to allow access from Render's dynamic backend IPs.
5. Obtain the **URI Connection String** (format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/nova?retryWrites=true&w=majority`).

---

## 2. Machine Learning API Deployment (Render)
1. Log in to [Render](https://render.com).
2. Click **New** -> **Web Service**.
3. Connect your repository.
4. Configure the service settings:
   - **Name**: `nova-ml-api`
   - **Runtime**: `Python`
   - **Root Directory**: `ml`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python predict.py`
5. Keep other settings default. Render will dynamically assign a port using the `PORT` environment variable.
6. Once deployed, note down the service URL (e.g., `https://nova-ml-api.onrender.com`).

---

## 3. Node.js Backend Deployment (Render)
1. Log in to [Render](https://render.com).
2. Click **New** -> **Web Service**.
3. Connect your repository.
4. Configure the service settings:
   - **Name**: `nova-backend`
   - **Runtime**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment**, add the following environment variables:
   - `MONGODB_URI`: *Your MongoDB Atlas Connection URI* (from step 1)
   - `JWT_SECRET`: *A secure random string for JWT hashing*
   - `FLASK_API_URL`: *Your ML API URL* (from step 2, without trailing slash, e.g., `https://nova-ml-api.onrender.com`)
   - `FRONTEND_URL`: *Your Vercel URL* (from step 4, e.g., `https://nova-universe.vercel.app`)
6. Once deployed, copy the backend service URL (e.g., `https://nova-backend-iduc.onrender.com`).

---

## 4. React Frontend Deployment (Vercel)
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your repository.
4. Configure the deployment settings:
   - **Framework Preset**: `Vite` (automatically detected)
   - **Root Directory**: `./` (Root directory of the project)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   - `VITE_API_URL`: `https://nova-backend-iduc.onrender.com/api` *(or your custom deployed backend domain with `/api` path)*
6. Click **Deploy**. Vercel will build the frontend and serve it at a `.vercel.app` domain.

---

## Production Environment Variables Checklist

### Backend (Render Web Service)
| Key | Example Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5001` (Auto-assigned by Render) | The backend listening port |
| `MONGODB_URI` | `mongodb+srv://...` | Connection link to MongoDB Atlas |
| `JWT_SECRET` | `supersecretkey` | Cryptographic secret for signing tokens |
| `FLASK_API_URL` | `https://nova-ml-api.onrender.com` | Base URL of the Python ML Service |
| `FRONTEND_URL` | `https://nova-universe.vercel.app` | URL of the frontend for CORS policy |

### Machine Learning Service (Render Web Service)
| Key | Example Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` (Auto-assigned by Render) | The Flask listening port |

### Frontend (Vercel Project)
| Key | Example Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://nova-backend-iduc.onrender.com/api` | API path to backend server endpoints |
