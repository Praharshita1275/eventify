# Eventify Backend

Backend API for the Eventify event management system.

## Database Setup

1. **Install MongoDB**:
   - [Download and install MongoDB](https://www.mongodb.com/try/download/community)
   - Ensure the MongoDB service is running

2. **Environment Setup**:
   - Run `npm run setup` to create the .env file with default values
   - Edit the .env file if you need to change MongoDB connection URL or other settings

3. **Database Connection Test**:
   - Run `npm run check-db` to verify your database connection

## Starting the Server

1. **Install dependencies**:
   ```
   npm install
   ```

2. **Start the development server**:
   ```
   npm run dev
   ```

3. **Production mode**:
   ```
   npm start
   ```

## API Documentation

- Base URL: `http://localhost:5001/api`
- Health Check: `http://localhost:5001/api`

### API Endpoints

- Authentication: `/api/auth`
- Events: `/api/events`
- Resources: `/api/resources`
- Feedback: `/api/feedback`
- Users: `/api/users`
- Announcements: `/api/announcements`

## Troubleshooting Database Issues

If you encounter database connection issues:

1. Ensure MongoDB is running:
   ```
   # Windows
   net start MongoDB

   # Linux/Mac
   sudo systemctl status mongod
   ```

2. Check .env file:
   - Make sure MONGO_URI is set correctly
   - Default value is `mongodb://localhost:27017/eventify`

3. Run database check:
   ```
   npm run check-db
   ```

4. Check MongoDB logs:
   - Look for error messages in MongoDB logs
   - Verify authentication requirements 