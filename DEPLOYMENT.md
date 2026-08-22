# LeakGuard Studio - Absolute Beginner's Deployment Guide

If you have never deployed an app before, **don't panic!** We will do this together, step by step. We are going to put your app on the internet for free using three services:
1. **GitHub** (to hold your code)
2. **Render** (to run your backend and database)
3. **Vercel** (to run your frontend website)

Follow these exact steps:

---

## Step 1: Push Your Code to GitHub
Both Render and Vercel need to pull your code from a website called GitHub.
1. Go to [GitHub.com](https://github.com/) and create a free account if you don't have one.
2. Click the **"+"** icon in the top right and click **New repository**.
3. Name it `leakguard-studio`, scroll down, and click **Create repository**.
4. Now, open a new terminal on your computer inside the `leakguard-studio` folder and run these exact commands one by one (replace `YOUR_USERNAME` with your actual GitHub username):
   ```bash
   git init
   git add .
   git commit -m "First commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/leakguard-studio.git
   git push -u origin main
   ```
*(If it asks you to log in to GitHub, just follow the prompts).*

---

## Step 2: Create a Free Database on Render
We need a place to store our users and bounties.
1. Go to [Render.com](https://render.com/) and create a free account (Sign up with GitHub).
2. Click **New +** at the top right, and select **PostgreSQL**.
3. Name it `leakguard-db`.
4. Scroll to the bottom and click **Create Database**.
5. *Wait about 2 minutes for it to be created.*
6. Once it's ready, scroll down to the **Connections** section and look for **Internal Database URL**. It will look like `postgres://user:password@hostname/db`. 
7. **Copy that Internal URL and paste it somewhere safe (like a notepad). We need it in Step 3!**

---

## Step 3: Deploy the Backend on Render
Now we launch the Python AI backend.
1. On Render, click **New +** at the top right, and select **Web Service**.
2. Click **Build and deploy from a Git repository** and click Next.
3. Connect your GitHub account, find `leakguard-studio`, and click **Connect**.
4. Fill out the form exactly like this:
   - **Name:** `leakguard-backend`
   - **Root Directory:** Type exactly `aiml`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Scroll down to the **Environment Variables** section and click **Add Environment Variable**. Add all of these:
   - Key: `DATABASE_URL` | Value: *(Paste the URL you copied in Step 2)*
   - Key: `GROQ_API_KEY` | Value: *(Your Llama3 Groq Key)*
   - Key: `PLATFORM_MNEMONIC` | Value: *(Your 24 secret words)*
   - Key: `ALGORAND_NETWORK` | Value: `testnet`
   - Key: `AVM_ADDRESS` | Value: *(Your Algorand wallet address)*
   - Key: `FACILITATOR_URL` | Value: `https://facilitator.goplausible.xyz`
   - Key: `FRONTEND_URL` | Value: `*` *(We will fix this later)*
6. Scroll down and click **Create Web Service**.
7. It will take about 5 minutes to build. Once you see "Live" with a green dot, look at the top left of the screen under the name `leakguard-backend`. You will see a URL like `https://leakguard-backend-xyz.onrender.com`. 
8. **Copy that URL! We need it for the frontend!**

---

## Step 4: Deploy the Frontend on Vercel
Finally, we put the actual visual website on the internet!
1. Go to [Vercel.com](https://vercel.com/) and create a free account (Sign up with GitHub).
2. Click **Add New...** and select **Project**.
3. You will see a list of your GitHub repositories. Find `leakguard-studio` and click **Import**.
4. On the configuration page, look for **Root Directory**. Click **Edit** and select the `frontend` folder.
5. Open the **Environment Variables** section and add exactly one:
   - Key: `VITE_API_URL`
   - Value: *(Paste the `https://leakguard-backend-xyz.onrender.com` URL you copied in Step 3)*
6. Click **Deploy**.
7. Wait 2 minutes. When confetti falls on your screen, click **Continue to Dashboard** and then click the **Visit** button to see your live website!

Congratulations! You just deployed a full-stack Web3 AI application! 🚀
