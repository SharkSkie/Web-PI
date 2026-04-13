# MindZines: Mental Health Zine Platform 🎨🧠

MindZines is a professional, modern web application designed for self-expression and mental health reflection. Users can create and share digital zines (self-published works) and participate in non-clinical mental health assessments to gain insights into their internal and external emotional drivers.

---

## ✨ Features

### 👤 User Features
- **Modern Landing Page**: A colorful, animated introduction to the platform.
- **Secure Authentication**: JWT-based login and registration with Bcrypt password hashing.
- **Zine Gallery**: Explore a community-driven collection of approved digital zines.
- **Zine Upload**: Upload PDF zines with titles and descriptions for moderation.
- **Assessment Wizard**: An interactive, step-by-step questionnaire for psychological self-reflection.
- **Insight Dashboard**: Visual results of your assessment with personalized conclusions and progress visualizations.

### 🛡️ Administrative Features
- **Moderation Dashboard**: Review, approve, or reject user-submitted zines.
- **Role-Based Access**: Specialized views and API protection for authorized admins.

---

## 🛠️ Technology Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (Modern, responsive UI)
- **Framer Motion** (Subtle animations)
- **Lucide React** (High-quality icons)
- **SweetAlert2** (Premium modal notifications)
- **Axios** (API communication)

### Backend
- **Node.js & Express**
- **MySQL** (Relational database)
- **Sequelize CLI** (Database migrations and seeders)
- **JWT & Bcryptjs** (Secure authentication)
- **Multer** (File upload handling)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MySQL Server** (Local or Cloud-based like Clever Cloud)

### 2. Environment Configuration
Create a `.env` file in the root directory and add your credentials:
```env
PORT=3000
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_super_secret_key
```

### 3. Backend Setup
```bash
# Install dependencies
npm install

# Run database migrations (create tables)
npm run migrate

# Run seeders (add demo users and zines)
npm run seed

# Start the server
npm run dev
```

### 4. Frontend Setup
Open a new terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Start the React development server
npm run dev
```

Navigate to `http://localhost:5173` to view the application.

---

## 🧪 Demo Credentials
If you ran `npm run seed`, you can use these accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **User** | `user@demo.com` | `password` |
| **Admin** | `admin@demo.com` | `password` |

---

## ⚖️ Disclaimer
*MindZines is tool for self-reflection and creative expression. It does not provide medical or clinical diagnosis. If you are experiencing mental health distress, please reach out to licensed professionals.*
