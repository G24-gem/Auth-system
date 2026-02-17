# Secure Authentication System with Day/Night Theme 🌅🌙

A beautiful and secure Node.js authentication system with PostgreSQL, featuring bcrypt password hashing and an animated day/night theme that transitions based on the current time.

## ✨ Features

### Security
- **Bcrypt Password Hashing**: Passwords are hashed with 12 salt rounds for maximum security
- **Session Management**: Secure HTTP-only cookies with express-session
- **Input Validation**: Server-side validation using express-validator
- **SQL Injection Protection**: Parameterized queries with PostgreSQL
- **Password Requirements**: Enforced strong password policy (min 8 chars, uppercase, lowercase, number, special character)

### Design
- **Dynamic Day/Night Theme**: Automatic theme transitions based on time of day
  - **Dawn (5-7 AM)**: Soft pink and orange hues as the sun rises
  - **Day (7 AM-5 PM)**: Bright sunny sky with floating clouds
  - **Dusk (5-7 PM)**: Golden hour colors as the sun sets
  - **Night (7 PM-5 AM)**: Dark starry sky with moonlight
- **Smooth Transitions**: All theme changes happen gradually over 2 seconds
- **Animated Elements**: Moving clouds, twinkling stars, and floating celestial bodies
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone or download this project**

2. **Install dependencies**
   ```bash
   cd auth-system
   npm install
   ```

3. **Set up PostgreSQL database**

   First, make sure PostgreSQL is running on your system. Then:

   ```bash
   # Login to PostgreSQL
   psql -U postgres

   # Run the setup script
   \i setup.sql
   
   # Or manually create the database
   CREATE DATABASE auth_db;
   ```

   The application will automatically create the necessary tables when it starts.

4. **Configure environment variables**

   Edit the `.env` file and update with your PostgreSQL credentials:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=auth_db
   DB_USER=postgres
   DB_PASSWORD=your_actual_password

   SESSION_SECRET=change-this-to-a-random-secret-key
   PORT=3000
   NODE_ENV=development
   ```

   **Important**: Change the `SESSION_SECRET` to a long random string in production!

5. **Start the server**

   ```bash
   npm start
   
   # Or for development with auto-reload
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
auth-system/
├── config/
│   └── database.js          # PostgreSQL connection and initialization
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   └── auth.js              # Authentication routes (login, signup, logout)
├── public/
│   ├── css/
│   │   └── styles.css       # All styles including day/night themes
│   ├── js/
│   │   ├── theme.js         # Theme management and transitions
│   │   ├── auth.js          # Login/signup form handling
│   │   └── dashboard.js     # Dashboard functionality
│   ├── index.html           # Login/signup page
│   └── dashboard.html       # Protected dashboard page
├── server.js                # Main server file
├── setup.sql                # Database setup script
├── .env                     # Environment configuration
└── package.json             # Project dependencies
```

## 🔐 Security Features Explained

### Bcrypt Password Hashing
- Uses 12 salt rounds (2^12 = 4096 iterations)
- Automatically generates unique salts for each password
- Resistant to rainbow table and brute-force attacks
- Industry-standard hashing algorithm

### Session Security
- HTTP-only cookies (not accessible via JavaScript)
- Secure flag enabled in production (HTTPS only)
- 24-hour session expiration
- Server-side session storage

### Input Validation
- Email format validation
- Username pattern validation (alphanumeric + underscore only)
- Password strength requirements enforced
- SQL injection prevention via parameterized queries

## 🎨 Theme System

The theme automatically adjusts based on the current time:

| Time Period | Theme | Features |
|-------------|-------|----------|
| 5-7 AM | Dawn | Soft gradient, sun rising, stars fading |
| 7 AM-5 PM | Day | Bright blue sky, sun overhead, floating clouds |
| 5-7 PM | Dusk | Orange/purple gradient, sun setting |
| 7 PM-5 AM | Night | Dark sky, moon, twinkling stars |

All transitions are smooth and take 2 seconds to complete.

## 🛠️ API Endpoints

### POST `/api/auth/signup`
Create a new user account

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### POST `/api/auth/login`
Login to an existing account

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### POST `/api/auth/logout`
Logout and destroy session

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET `/api/auth/status`
Check authentication status

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "username": "johndoe"
  }
}
```

## 🔧 Customization

### Adjusting Theme Times
Edit `public/js/theme.js` and modify the `getThemeForHour()` method:

```javascript
getThemeForHour(hour) {
    if (hour >= 5 && hour < 7) {
        return this.getDawnTheme(hour);
    } else if (hour >= 7 && hour < 17) {
        return this.getDayTheme(hour);
    }
    // ... customize times here
}
```

### Changing Colors
Edit CSS variables in `public/css/styles.css`:

```css
:root {
    --accent: #3498db;        /* Primary color */
    --accent-hover: #2980b9;  /* Hover color */
    --error: #e74c3c;         /* Error color */
    --success: #27ae60;       /* Success color */
}
```

### Password Requirements
Edit validation in `routes/auth.js`:

```javascript
const SALT_ROUNDS = 12;  // Increase for more security (slower)

body('password')
    .isLength({ min: 8 })  // Minimum length
    .matches(/your-custom-regex/)  // Custom requirements
```

## 📊 Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| username | VARCHAR(50) | Unique username |
| email | VARCHAR(100) | Unique email address |
| password_hash | VARCHAR(255) | Bcrypt hashed password |
| created_at | TIMESTAMP | Account creation time |
| last_login | TIMESTAMP | Last login time |
| is_active | BOOLEAN | Account active status |

## 🐛 Troubleshooting

### "Cannot connect to database"
- Ensure PostgreSQL is running: `sudo systemctl status postgresql`
- Check credentials in `.env` file
- Verify database exists: `psql -U postgres -l`

### "Port 3000 already in use"
- Change PORT in `.env` file
- Or kill the process: `lsof -ti:3000 | xargs kill`

### Theme not transitioning
- Check browser console for JavaScript errors
- Ensure `theme.js` is loaded before other scripts
- Clear browser cache and reload

## 🚀 Production Deployment

### Before deploying:

1. **Set secure environment variables**
   ```env
   NODE_ENV=production
   SESSION_SECRET=very-long-random-secret-string
   ```

2. **Enable HTTPS**
   - Update session cookie settings in `server.js`
   - Use a reverse proxy (nginx) or hosting platform SSL

3. **Use environment variables for sensitive data**
   - Never commit `.env` to version control
   - Use platform-specific secret management

4. **Database security**
   - Use connection pooling
   - Enable SSL for database connections
   - Use read-only users where appropriate

## 📝 License

MIT License - Feel free to use this project for learning or production!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📧 Support

For questions or issues, please open an issue on GitHub or contact the maintainer.

---

**Built with ❤️ using Node.js, Express, PostgreSQL, and Bcrypt**
