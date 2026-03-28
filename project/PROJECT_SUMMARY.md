# FLYXO - Project Summary

## Overview

FLYXO is a comprehensive real-time movie ticket booking system designed as a college project. It demonstrates modern web development practices using GraphQL, React, Node.js, MySQL, and Socket.io.

## Key Features Implemented

### User Features
- User registration and authentication with JWT
- Browse active movies with thumbnails
- View detailed movie information
- Select show dates and timings
- Real-time seat selection with visual feedback
- ID proof validation (Aadhar, PAN, Driving License, Passport)
- Age verification for age-restricted movies
- View and manage booking history
- Cancel bookings with seat release

### Admin Features
- Secure admin panel access
- Add, edit, and delete movies
- Create shows with custom pricing
- Manage user accounts (activate/deactivate/delete)
- View all bookings across the system
- Manage movie status

### Technical Implementation

#### Backend Architecture
- **Framework**: Express.js with Node.js
- **API**: GraphQL for efficient data queries
- **Database**: MySQL with Sequelize ORM
- **Real-time**: Socket.io for live seat updates
- **Authentication**: JWT-based token authentication
- **Security**: bcrypt password hashing, input validation

#### Frontend Architecture
- **Framework**: React with Vite
- **Routing**: React Router for navigation
- **State Management**: Context API for auth state
- **Real-time**: Socket.io client for live updates
- **UI/UX**: Custom responsive CSS design
- **Notifications**: React Toastify for user feedback

#### Database Schema
- Users: Authentication and profile data
- Movies: Movie details and metadata
- Shows: Show timings and availability
- Seats: Seat arrangement and status
- Bookings: Transaction records

## Problem Statement Solution

### Challenge: Double Booking Prevention
**Solution**: Implemented seat locking mechanism
- Seats lock for 5 minutes when selected
- Real-time updates prevent concurrent bookings
- Automatic unlocking on timeout or cancellation

### Challenge: Inefficient API Communication
**Solution**: GraphQL implementation
- Single endpoint for all operations
- Client specifies exact data requirements
- Reduced over-fetching and under-fetching
- Improved performance and bandwidth usage

### Challenge: Lack of Real-time Updates
**Solution**: Socket.io integration
- Instant seat status updates across clients
- Live availability information
- Enhanced user experience

## Project Structure

```
flyxo/
├── backend/
│   ├── config/           # Database configuration
│   ├── models/           # Sequelize models
│   ├── graphql/          # GraphQL schema and resolvers
│   ├── middleware/       # Auth middleware
│   ├── utils/            # Helper functions
│   ├── server.js         # Main server file
│   └── seedData.js       # Sample data seeder
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   ├── utils/        # Helper utilities
│   │   └── App.jsx       # Main app component
│   └── public/           # Static assets
│
└── Documentation files
```

## Technologies Used

### Backend
- Node.js v14+
- Express.js v4.18
- GraphQL v16.8
- MySQL v5.7+
- Sequelize ORM v6.35
- Socket.io v4.6
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React v18.2
- Vite v5.0
- React Router v6.21
- Socket.io Client v4.6
- React Toastify v10.0
- Lucide React Icons

## Security Features

1. **Password Security**: bcrypt hashing with salt
2. **Authentication**: JWT tokens with expiration
3. **Authorization**: Role-based access control
4. **Input Validation**: ID proof format validation
5. **SQL Injection Prevention**: Sequelize ORM parameterized queries
6. **Age Verification**: Server-side age restriction checks

## Responsive Design

- Mobile-first approach
- Breakpoints for tablets and desktops
- Touch-friendly seat selection
- Optimized layouts for all screen sizes

## Real-World Features

1. **Seat Locking**: Prevents double bookings
2. **ID Verification**: Simulates real ticket verification
3. **Age Restrictions**: Enforces movie ratings
4. **Booking Management**: Full CRUD operations
5. **Admin Controls**: Complete system management

## Sample Data

The project includes a seed script that creates:
- 2 test users (1 admin, 1 regular user)
- 6 sample movies across different genres
- Ready-to-use movie thumbnails from Pexels

## Getting Started

See [QUICKSTART.md](QUICKSTART.md) for rapid setup instructions.
See [README.md](README.md) for complete documentation.

## Future Enhancements

Potential features for expansion:
1. Payment gateway integration (Razorpay/Stripe)
2. Email/SMS notifications
3. QR code generation for tickets
4. Movie ratings and reviews
5. Advanced reporting and analytics
6. Mobile application
7. Multiple theater locations
8. Food and beverage ordering
9. Loyalty program
10. Movie recommendations

## Educational Value

This project demonstrates:
- Full-stack development
- Real-time web applications
- GraphQL API design
- Database modeling
- Authentication & authorization
- WebSocket communication
- Responsive UI design
- State management
- Security best practices

## Testing

The application can be tested by:
1. Running the seed script for sample data
2. Testing user registration and login
3. Browsing and booking movies
4. Testing real-time seat updates (multiple browsers)
5. Admin panel operations
6. Booking cancellations

## Performance Considerations

- GraphQL reduces unnecessary data transfer
- Socket.io provides efficient real-time updates
- Database indexing on frequently queried fields
- Connection pooling for database optimization
- Seat lock expiration to free resources

## Conclusion

FLYXO successfully implements a production-ready movie ticket booking system with modern web technologies. It solves real-world problems like double booking and inefficient API communication while providing an excellent user experience through real-time updates and responsive design.

The project is well-documented, easy to set up, and demonstrates best practices in full-stack web development, making it an excellent showcase for college project evaluation.

---

**Developed as a College Project**
**Technology Stack**: MERN + GraphQL + Socket.io
