const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { connectDB } = require('./config/database');
const { authenticate } = require('./middleware/auth');
const { Seat } = require('./models');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.use('/graphql', graphqlHTTP(async (req) => {
  const user = await authenticate(req);

  return {
    schema,
    rootValue: resolvers,
    context: { user },
    graphiql: process.env.NODE_ENV === 'development'
  };
}));

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinShow', (showId) => {
    socket.join(`show-${showId}`);
    console.log(`Client ${socket.id} joined show ${showId}`);
  });

  socket.on('leaveShow', (showId) => {
    socket.leave(`show-${showId}`);
    console.log(`Client ${socket.id} left show ${showId}`);
  });

  socket.on('seatLocked', async ({ showId, seatIds }) => {
    const seats = await Seat.findAll({ where: { id: seatIds } });
    io.to(`show-${showId}`).emit('seatsUpdated', seats);
  });

  socket.on('seatUnlocked', async ({ showId, seatIds }) => {
    const seats = await Seat.findAll({ where: { id: seatIds } });
    io.to(`show-${showId}`).emit('seatsUpdated', seats);
  });

  socket.on('seatBooked', async ({ showId, seatIds }) => {
    const seats = await Seat.findAll({ where: { id: seatIds } });
    io.to(`show-${showId}`).emit('seatsUpdated', seats);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'FLYXO Movie Ticket Booking System API',
    version: '1.0.0',
    endpoints: {
      graphql: '/graphql'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, io };
