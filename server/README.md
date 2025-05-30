# Coffee API Serverless

This project is a serverless application for managing coffee-related data, designed for deployment on Vercel. It utilizes Express and Mongoose to handle requests and interact with a MongoDB database.

## Project Structure

```
coffee-api-serverless
├── api
│   └── index.js          # Entry point for the serverless function
├── src
│   ├── models
│   │   └── coffee.js     # Mongoose model for coffee
│   ├── routes
│   │   └── coffee.js     # Routes for coffee-related endpoints
│   └── utils
│       └── db.js         # Database connection logic
├── package.json           # npm configuration file
├── vercel.json            # Vercel deployment configuration
└── README.md              # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd coffee-api-serverless
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your MongoDB URI:
   ```
   MONGO_URI=<your-mongodb-uri>
   ```

4. **Run the application locally:**
   You can test the serverless function locally using Vercel CLI:
   ```bash
   vercel dev
   ```

5. **Deploy to Vercel:**
   To deploy the application, run:
   ```bash
   vercel
   ```

## Usage

Once deployed, you can access the API endpoints for managing coffee data. The available routes are defined in `src/routes/coffee.js`.