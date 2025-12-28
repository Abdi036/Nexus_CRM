# Nexus CRM

Nexus CRM is a robust Customer Relationship Management system designed to streamline business operations, manage customer interactions, and provide actionable insights through data visualization. Built with a modern tech stack, it features a responsive frontend and a powerful backend API.

## 🚀 Features

- **User Authentication**: Secure login and registration using JWT and bcrypt.
- **Dashboard**: Visual data representation using Recharts for analytics.
- **Customer Management**: Create, read, update, and delete customer records.
- **Email Integration**: Automated email notifications using Nodemailer.
- **Responsive Design**: Mobile-first UI built with Tailwind CSS and Radix UI.

## 🛠️ Tech Stack

### Client
- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Shadcn/UI](https://ui.shadcn.com/) (inferred)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

### Server
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) + Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- npm or yarn

## 💾 Installation

### 1. Clone the Repository
```bash
git clone <repository_url>
cd Nexus_CRM
```

### 2. server Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory based on `.env.example`:
```bash
cp .env.example .env
```
Update the `.env` file with your configuration:
```env
MONGODB_URI=mongodb+srv://...  # Your MongoDB Connection String
JWT_SECRET=your_secret_key     # Secure secret for tokens
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000 # URL of your client app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 3. Client Setup
Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```

## 🚀 Running the Application

### Start the Backend Server
In the `server` directory:
```bash
# Development mode (restarts on file changes)
npm run dev

# Production mode
npm start
```
The server will start on port 5000 (or as defined in your .env).

### Start the Frontend Client
In the `client` directory:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## 🧪 Database Seeding
To populate the database with initial data (if using the provided seeder):
```bash
cd server
npm run seed
```

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License
This project is licensed under the ISC License.
