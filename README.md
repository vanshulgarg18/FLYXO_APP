
# FLYXO - Real-Time Movie Ticket Booking System

A comprehensive full-stack movie ticket booking system built with GraphQL, Node.js, React, MySQL, and Socket.io. This project demonstrates real-time seat booking, preventing double bookings, and efficient API communication using GraphQL.

## Features

### User Features
- Browse currently showing movies with details
- View movie information including rating, duration, language, and genre
- Select show dates and timings
- Real-time seat selection with live updates
- Book tickets with ID proof validation (Aadhar, PAN, Driving License, Passport)
- Age verification for age-restricted movies
- View booking history
- Cancel bookings

### Admin Features
- Add, edit, and delete movies
- Create shows with custom timings and pricing
- Manage users (activate/deactivate/delete)
- View all bookings
- Manage movie status (active/inactive)

### Technical Features
- GraphQL API for efficient data fetching
- Real-time seat updates using Socket.io
- JWT-based authentication
- MySQL database with Sequelize ORM
- Responsive design for all devices
- Seat locking mechanism to prevent double booking
- Comprehensive ID proof validation
- Age-based movie restrictions

## Technology Stack

### Backend
- Node.js
- Express.js
- GraphQL (express-graphql)
- MySQL
- Sequelize ORM
- Socket.io
- JWT (jsonwebtoken)
- bcryptjs

### Frontend
- React.js
- Vite
- React Router
- Socket.io Client
- React Toastify
- Lucide Icons

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd flyxo
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE flyxo_db;
```

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=flyxo_db
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

### 4. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

The `.env` file should contain:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Running the Application

### Start the Backend Server

From the backend directory:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

### Start the Frontend Development Server

From the frontend directory:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Creating Your First Admin Account

To access the admin panel, you need to create an admin user. You can do this in two ways:

### Method 1: Register and Manually Update (Recommended)

1. Register a new account through the UI
2. Connect to your MySQL database
3. Update the user role:

```sql
UPDATE Users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Method 2: Direct Database Insert

```sql
INSERT INTO Users (name, email, password, phone, age, role, createdAt, updatedAt)
VALUES (
  'Admin User',
  'admin@flyxo.com',
  '$2a$10$YourHashedPasswordHere',
  '1234567890',
  25,
  'admin',
  NOW(),
  NOW()
);
```

Note: For Method 2, you'll need to hash the password using bcryptjs first.

## Default Credentials for Testing

After setting up the database and creating an admin account, you can use:

- Email: admin@flyxo.com
- Password: (the password you set)

## API Endpoints

### GraphQL Endpoint

```
POST http://localhost:5000/graphql
```

### Example GraphQL Queries

**Fetch all movies:**
```graphql
query {
  movies(isActive: true) {
    id
    title
    description
    genre
    duration
    language
    rating
    thumbnail
  }
}
```

**Create a booking:**
```graphql
mutation {
  createBooking(input: {
    showId: 1
    seatIds: [1, 2, 3]
    idProofType: "aadhar"
    idProofNumber: "123456789012"
  }) {
    id
    bookingReference
    totalAmount
  }
}
```

## Sample Movie Thumbnails

When adding movies through the admin panel, you can use these Pexels image URLs:

1. **Action Movie**: `https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg`
2. **Drama**: `https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg`
3. **Comedy**: `https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg`
4. **Thriller**: `https://images.pexels.com/photos/1279830/pexels-photo-1279830.jpeg`
5. **Romance**: `https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg`
6. **Sci-Fi**: `https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg`

## Adding Sample Data

### Sample Movie

After logging in as admin:

1. Go to Admin Panel
2. Click "Add Movie"
3. Fill in the details:
   - Title: "The Great Adventure"
   - Description: "An epic journey through uncharted territories"
   - Genre: "Action"
   - Duration: 150
   - Language: "English"
   - Rating: "UA"
   - Minimum Age: 13
   - Thumbnail: Use one of the URLs above
   - Release Date: Select current date

### Sample Show

1. Go to "Shows" tab in Admin Panel
2. Click "Create Show"
3. Fill in:
   - Movie: Select the movie you created
   - Show Date: Select a future date
   - Show Time: e.g., "18:00"
   - Screen: "1"
   - Total Seats: 100
   - Price: 250

## Project Structure

```
flyxo/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Movie.js
│   │   ├── Show.js
│   │   ├── Seat.js
│   │   ├── Booking.js
│   │   └── index.js
│   ├── graphql/
│   │   ├── schema.js
│   │   └── resolvers.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── validators.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   └── Admin.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   ├── graphql.js
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── .env
│
└── README.md
```

## Key Features Explained

### Real-Time Seat Booking

The system uses Socket.io to provide real-time updates:
- When a user selects seats, they are locked for 5 minutes
- Other users see locked seats in real-time
- If booking is completed, seats become permanently booked
- If user leaves or times out, seats are automatically unlocked

### ID Proof Validation

The system validates different ID proof types:
- **Aadhar**: 12 digits
- **PAN**: Format ABCDE1234F
- **Driving License**: Format DL1234567890123
- **Passport**: Format A1234567

### Age Verification

Movies can have age restrictions. The system:
- Checks user's age during booking
- Prevents booking if user is underage
- Displays age restrictions on movie details

### GraphQL Benefits

- **Efficient Data Fetching**: Request only the data you need
- **Single Endpoint**: All queries and mutations through `/graphql`
- **Type Safety**: Strong typing with GraphQL schema
- **Reduced Over-fetching**: No unnecessary data transfer

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify MySQL is running:
   ```bash
   mysql -u root -p
   ```

2. Check database exists:
   ```sql
   SHOW DATABASES;
   ```

3. Verify credentials in `.env` file

### Port Already in Use

If port 5000 or 5173 is already in use:

1. Change the port in backend `.env`:
   ```env
   PORT=5001
   ```

2. Update frontend `.env`:
   ```env
   VITE_API_URL=http://localhost:5001
   ```

### Socket.io Connection Issues

If real-time updates aren't working:

1. Check that both frontend and backend are running
2. Verify CORS settings in backend
3. Check browser console for WebSocket errors

## Testing the Application

### Manual Testing Steps

1. **User Registration**
   - Register a new user account
   - Verify email and password validation

2. **Admin Functions**
   - Login as admin
   - Add a new movie
   - Create shows for the movie
   - Verify all fields are working

3. **Booking Flow**
   - Browse movies as a regular user
   - Select a movie and show
   - Choose seats
   - Verify real-time seat locking (open in two browsers)
   - Complete booking with ID proof
   - Check booking appears in "My Bookings"

4. **Cancellation**
   - Cancel a booking
   - Verify seats are released

## Database Schema

### Users
- id, name, email, password, phone, role, age, isActive, timestamps

### Movies
- id, title, description, genre, duration, language, rating, minimumAge, thumbnail, releaseDate, isActive, timestamps

### Shows
- id, movieId, showDate, showTime, screen, totalSeats, availableSeats, price, isActive, timestamps

### Seats
- id, showId, seatNumber, row, status, lockedBy, lockedAt, timestamps

### Bookings
- id, userId, showId, seats, totalAmount, bookingReference, idProofType, idProofNumber, status, paymentStatus, timestamps

## Security Considerations

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Row-level validation for ID proofs
- Protected GraphQL mutations requiring authentication
- Admin-only routes protected on both frontend and backend
- SQL injection prevention through Sequelize ORM

## Future Enhancements

- Payment gateway integration
- Email notifications
- QR code tickets
- Seat selection preferences
- Movie reviews and ratings
- Advanced reporting for admins
- Mobile app version

## Contributing

This is a college project. For any questions or suggestions, please contact the project maintainer.

## License

This project is created for educational purposes.

## Acknowledgments

- Node.js and Express.js communities
- GraphQL documentation
- Socket.io team
- React.js community
- Sequelize ORM documentation

---

Built with ❤️ for college project
