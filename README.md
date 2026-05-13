# BASA School Forms - Live Web Application

A web application for BASA Schools to collect Grade 10 subject choices and parent attendance records.

## Features

- **Grade 10 Subject Selection Form**: Multi-step form for students to select subjects
- **Parents Attendance Register**: Form for parents to sign in for school events
- **Data Persistence**: All submissions stored in MongoDB database
- **Admin Panel**: View submitted data (PIN protected)
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: HTML, CSS, JavaScript
- **Hosting**: Render (recommended)

## Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

3. **Start MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update MONGODB_URI in .env

4. **Run the Application**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

5. **Access the App**
   - Open http://localhost:3000 in your browser

## Deployment to Render

### 1. Prepare for Deployment

- Create a MongoDB Atlas database (free tier available)
- Update MONGODB_URI in .env with your Atlas connection string
- Test locally with the Atlas connection

### 2. Deploy to Render

1. **Create a Render Account**
   - Go to https://render.com and sign up

2. **Connect Your Repository**
   - Push your code to GitHub
   - Connect your GitHub repo to Render

3. **Configure the Service**
   - **Service Type**: Web Service
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `ADMIN_PIN`: Your admin PIN (change from default)

4. **Deploy**
   - Render will automatically build and deploy your app
   - Your app will be available at `https://your-app-name.onrender.com`

### 3. Database Setup

**MongoDB Atlas (Recommended):**
1. Create account at https://cloud.mongodb.com
2. Create a free cluster
3. Create database user and whitelist IP (0.0.0.0/0 for Render)
4. Get connection string and update MONGODB_URI

## Admin Access

- Access submitted data at `/api/admin/forms` and `/api/admin/attendance`
- Use the admin PIN set in environment variables
- PIN is required for security

## File Structure

```
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── index.html             # Main landing page
├── BASA_Grade10_Subject_Choice.html    # Subject selection form
├── basa_parents_attendance_register_v3.html  # Attendance form
├── .env.example           # Environment variables template
└── README.md              # This file
```

## Security Notes

- Change the default ADMIN_PIN in production
- Use HTTPS in production (Render provides this)
- MongoDB Atlas provides encryption at rest
- Consider implementing authentication for admin access

## Support

For issues or questions, please contact the development team.